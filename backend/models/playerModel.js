const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Player = sequelize.define("Player", {
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

Player.associate = (models) => {
  Player.hasMany(models.Join, { foreignKey: "playerId", as: "joins" });
};

module.exports = Player;
