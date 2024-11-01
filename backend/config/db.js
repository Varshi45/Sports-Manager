const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance with your PostgreSQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // Using PostgreSQL
    port: 5432, // Default PostgreSQL port
    logging: false, // Disable logging (optional)
  }
);

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established and synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
