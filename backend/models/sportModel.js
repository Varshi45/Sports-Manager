const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Admin = require("./adminModel");

const Sport = sequelize.define("Sport", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

// Associations
Sport.belongsTo(Admin, { foreignKey: "adminId", onDelete: "CASCADE" });

module.exports = Sport;
