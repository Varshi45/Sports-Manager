// server.js

const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sportRoutes = require("./routes/sportRoutes");
const matchRoutes = require("./routes/matchRoutes");
const joinRoutes = require("./routes/joinRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const connectSync = async () => {
  try {
    await connectDB();
    await sequelize.sync();
  } catch (error) {
    console.error("Error syncing database models:", error);
    process.exit(1); // Exit the process if there’s an error
  }
};

// Test Route to check database connection
app.get("/api/test", async (req, res) => {
  try {
    res.send("Database connected and models synced");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/sports", sportRoutes);
app.use("/matches", matchRoutes);
app.use("/joins", joinRoutes);

// Start the server
app.listen(port, async () => {
  await connectSync(); // Wait for connection and syncing to complete
  console.log(`Server running on http://localhost:${port}`);
});
