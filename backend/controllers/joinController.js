const { Join, Matches, Player } = require("../models");

// Join a match
exports.joinMatch = async (req, res) => {
  try {
    const { playerId, matchId } = req.body;

    // Check if the player has already joined the match
    const existingJoin = await Join.findOne({
      where: { playerId, matchId },
    });
    if (existingJoin) {
      return res
        .status(400)
        .json({ message: "You have already joined this match." });
    }

    // Check if the match has available slots
    const match = await Matches.findByPk(matchId);
    if (!match || match.slotsRemaining <= 0) {
      return res
        .status(400)
        .json({ message: "No available slots in this match." });
    }

    // Create a join record
    const join = await Join.create({ playerId, matchId });

    // Update slots remaining in the match
    match.slotsRemaining -= 1;
    await match.save();

    res.status(201).json({ message: "Successfully joined the match!", join });
  } catch (error) {
    console.error("Error joining match:", error);
    res.status(500).json({ message: "Failed to join match." });
  }
};

// Get all matches a player has joined
exports.getPlayerJoins = async (req, res) => {
  try {
    const { playerId } = req.params;

    const joins = await Join.findAll({
      where: { playerId },
      include: [
        {
          model: Matches,
          as: "Match",
          attributes: ["team1", "team2", "date", "location", "sportId"],
        },
      ],
    });

    res.status(200).json({ joins });
  } catch (error) {
    console.error("Error retrieving player joins:", error);
    res.status(500).json({ message: "Failed to retrieve joins." });
  }
};

exports.getPlayersForMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Find all joins for the specified matchId, including player details
    const joins = await Join.findAll({
      where: { matchId },
      include: [
        {
          model: Player,
          as: "Player",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
    });

    // Extract player details from the join records
    const players = joins.map((join) => join.Player);

    res.status(200).json({ players });
  } catch (error) {
    console.error("Error fetching players for match:", error);
    res.status(500).json({ message: "Failed to retrieve players for match." });
  }
};
