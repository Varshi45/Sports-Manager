// controllers/matchController.js

const { Matches, Sport } = require("../models");

const matchController = {
  async getMatches(req, res) {
    try {
      const matches = await Matches.findAll();
      res.json(matches);
    } catch (error) {
      console.error("Error retrieving matches:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async createMatch(req, res) {
    try {
      const { team1, team2, date, location, sportId, teamSize } = req.body;

      // Check if the specified sport exists
      const sport = await Sport.findByPk(sportId);
      if (!sport) {
        return res.status(400).json({ message: "Invalid sport ID" });
      }

      const newMatch = await Matches.create({
        team1,
        team2,
        date,
        location,
        sportId,
        teamSize,
        slotsRemaining: teamSize, // Set slotsRemaining equal to teamSize
        adminId: req.user.id,
      });
      res.status(201).json(newMatch);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteMatch(req, res) {
    try {
      const { matchId } = req.params;
      const match = await Matches.findByPk(matchId);

      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      if (match.adminId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this match" });
      }

      await match.destroy();
      res.json({ message: "Match deleted successfully" });
    } catch (error) {
      console.error("Error deleting match:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async findMatchesByAdminId(req, res) {
    try {
      const { adminId } = req.params;
      const matches = await Matches.findAll({ where: { adminId } });

      if (matches.length === 0) {
        return res
          .status(404)
          .json({ message: "No matches found for this admin" });
      }

      res.json(matches);
    } catch (error) {
      console.error("Error finding matches by admin ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = matchController;
