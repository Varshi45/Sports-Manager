const { Sequelize } = require("sequelize");
require("dotenv").config();

// Construct the connection string using environment variables
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Create a new Sequelize instance with the connection string
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres", // Using PostgreSQL
  logging: false, // Disable logging (optional)
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
