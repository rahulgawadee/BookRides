require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 9090;
const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGODB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Serve Static Files (Placing it before API routes)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API Routes
app.use('/api/handleuser', require('./routes/handleuser'));
app.use('/api/search', require('./routes/search'));
app.use('/api/handlebooking', require('./routes/handlebooking'));
app.use('/api/register', require('./routes/register'));
app.use('/api/getRentalDetails', require('./routes/getRentalData'));

// Root Route
app.get('/', (req, res) => {
    res.send("BookMyRide Server Status: Running...");
});

// Catch-all Route for React Frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
