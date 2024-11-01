// controllers/sportController.js

const { Sport } = require("../models");

const sportController = {
  // Fetch all sports
  async getSports(req, res) {
    try {
      const sports = await Sport.findAll();
      res.json(sports);
    } catch (error) {
      console.error("Error retrieving sports:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Create a new sport
  async createSport(req, res) {
    try {
      const { name } = req.body;
      const newSport = await Sport.create({ name, adminId: req.user.id });
      res.status(201).json(newSport);
    } catch (error) {
      console.error("Error creating sport:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a sport by its ID
  async deleteSport(req, res) {
    try {
      const { sportId } = req.params;
      const sport = await Sport.findByPk(sportId);

      if (!sport) {
        return res.status(404).json({ message: "Sport not found" });
      }

      // Optional: check if the current user is the admin who created the sport
      if (sport.adminId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this sport" });
      }

      await sport.destroy();
      res.json({ message: "Sport deleted successfully" });
    } catch (error) {
      console.error("Error deleting sport:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Find sports based on admin ID
  async findSportsByAdminId(req, res) {
    try {
      const { adminId } = req.params;
      const sports = await Sport.findAll({ where: { adminId } });

      if (sports.length === 0) {
        return res.status(404).json({ message: "No sports found!! Create" });
      }

      res.json(sports);
    } catch (error) {
      console.error("Error finding sports by admin ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = sportController;
