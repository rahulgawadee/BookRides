const express = require("express")
const {body} = require('express-validator')
const bcrypt = require("bcryptjs") // for hashing passoword
var jwt = require('jsonwebtoken') //for sending auth token to logged in user


require('dotenv').config();
JWT_SECRET = process.env.JWT_SECRET //for sending auth token to logged in user


var fetchUser = require("../middleware/fetchUser")
const router = express.Router()

const userDataModel = require('../Modals/Userdata')

// ROUTE 1: Creating New User
router.post('/signup',  async (req,res)=> {
    const {username, phone, email, password} = req.body;
    const checkEmail = await userDataModel.find({email: email})
    const checkUsername = await userDataModel.find({username: username})

    if (checkEmail.length === 0 && checkUsername.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt)
        await userDataModel.create( {
            username: username,
            phone: phone,
            email: email,
            password: secPass
        })
        res.send("Account Created Successfully!")
    }
    else {
        res.status(401).send("email or username already exist")
    }

})

//ROUTE 2: Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDataModel.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Email or Password" });

        const payload = { user: { id: user.id } };
        const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ authToken, username: user.username });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


//ROUTE 3: Change Loggedin User Details
router.post('/edit', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await userDataModel.findById(userID).select("-password");

        if (user) {
            const { username, email, phone } = req.body;
            user.username = username || user.username;
            user.email = email || user.email;
            user.phone = phone || user.phone;

            await user.save();
            res.status(200).json({ message: "Success" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log("Error updating user details:", err);
        res.status(500).json({ message: "Error updating user details" });
    }
});


//ROUTE 4: Get loggedin User Details using auth-token
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await userDataModel.findById(userID).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error getting user details:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;