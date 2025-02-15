const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const vehicleDetailsModel = require("../Modals/Vehicledata");

router.post("/", fetchUser, async (req, res) => {
    try {
        const { city, vtype, sortBy } = req.body;

        if (!city) {
            return res.status(400).json({ error: "City is required." });
        }

        let filter = { city };
        if (vtype && vtype !== "Any") {
            filter.vType = vtype; // Ensure key matches DB schema
        }

        let query = vehicleDetailsModel.find(filter);

        // Apply sorting only if `sortBy` is provided and not an empty string
        if (sortBy && sortBy.trim() !== "") {
            let sortObj = {};
            sortObj[sortBy] = 1;
            query = query.sort(sortObj);
        }

        const vehicles = await query.exec();

        if (!vehicles.length) {
            return res.json("Empty");
        }

        res.json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
