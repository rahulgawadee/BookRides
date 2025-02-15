require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 9090;

// 🛠️ Middleware Configuration
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true, // Enable credentials
    })
);

// 📌 Database Connection
mongoose
    .connect(process.env.MONGODB_SERVER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 📌 Serve Static Files (React Build)
app.use(express.static(path.join(__dirname, "client/build")));

// 📌 API Routes
app.use("/api/handleuser", require("./routes/handleuser")); // User Authentication
app.use("/api/search", require("./routes/search")); // Search Handling
app.use("/api/handlebooking", require("./routes/handlebooking")); // Booking Management
app.use("/api/register", require("./routes/register")); // Vehicle Registration
app.use("/api/getRentalDetails", require("./routes/getRentalData")); // Rental Data Handling

// 📌 Default Route
app.get("/", (req, res) => {
    res.send("🚗 BookMyRide Server Status: Running...");
});

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "frontend/build")));

// Handle React routing (Serve index.html for unknown routes)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});


// 📌 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
