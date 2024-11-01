// models/Matches.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Matches = sequelize.define("Matches", {
  team1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Admins",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  sportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Sports",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  teamSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 25,
    },
  },
  slotsRemaining: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

Matches.associate = (models) => {
  Matches.hasMany(models.Join, { foreignKey: "matchId", as: "joins" });
};

module.exports = Matches;
