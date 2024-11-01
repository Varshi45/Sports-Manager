// models/Join.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Join = sequelize.define("Join", {
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Matches",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Players",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

// Associations (optional, if you need to define them here)
Join.associate = (models) => {
  Join.belongsTo(models.Matches, { foreignKey: "matchId", as: "match" });
  Join.belongsTo(models.Player, { foreignKey: "playerId", as: "player" });
};

module.exports = Join;
