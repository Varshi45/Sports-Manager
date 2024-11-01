// routes/joinRoutes.js

const express = require("express");
const router = express.Router();
const joinController = require("../controllers/joinController");

router.post("/join", joinController.joinMatch);
router.get("/player/:playerId", joinController.getPlayerJoins);
router.get("/match/:matchId/players", joinController.getPlayersForMatch);

module.exports = router;
