// routes/sportRoutes.js

const express = require("express");
const sportController = require("../controllers/sportController"); // Import the controller
const authenticateAdmin = require("../middleware/authMiddleware"); // Import the middleware

const router = express.Router();

router.post("/create", authenticateAdmin, sportController.createSport);
router.get("/", sportController.getSports);
router.delete("/:sportId", authenticateAdmin, sportController.deleteSport);
router.get(
  "/admin/:adminId",
  authenticateAdmin,
  sportController.findSportsByAdminId
);

module.exports = router;
