//routes/authRoutes.js

const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/signout", authController.signout);
router.put("/update-names", authController.updateNames);
router.post("/google-login", authController.googleLogin);

module.exports = router;
