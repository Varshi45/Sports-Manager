const express = require("express");
const matchController = require("../controllers/matchController");
const authenticateAdmin = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", matchController.getMatches);
router.post("/create", authenticateAdmin, matchController.createMatch);
router.delete("/:matchId", authenticateAdmin, matchController.deleteMatch);
router.get(
  "/admin/:adminId",
  authenticateAdmin,
  matchController.findMatchesByAdminId
);

module.exports = router;
