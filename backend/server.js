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
    console.log("Database connected and models synced");
  } catch (error) {
    console.error("Error syncing database models:", error);
    process.exit(1); // Exit the process if there's an error
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to the Sports Match API");
});

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
const startServer = async () => {
  await connectSync(); // Wait for connection and syncing to complete

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

// Handle server shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

startServer();
