const Admin = require("./adminModel");
const Player = require("./playerModel");
const Sport = require("./sportModel");
const Matches = require("./Matches");
const Join = require("./Joins");

Matches.hasMany(Join, { foreignKey: "matchId" });
Player.hasMany(Join, { foreignKey: "playerId" });
Join.belongsTo(Matches, { foreignKey: "matchId" });
Join.belongsTo(Player, { foreignKey: "playerId" });

module.exports = {
  Admin,
  Player,
  Sport,
  Matches,
  Join,
};
