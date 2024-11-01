const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Admin = sequelize.define("Admin", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Optional: Ensure email is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
