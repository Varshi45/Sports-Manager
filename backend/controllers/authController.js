//controllers/authController.js

const bcrypt = require("bcrypt");
const { Admin, Player } = require("../models");
const { generateToken } = require("../utils/jwtUtils");
const { verifyGoogleToken } = require("../utils/googleAuth");

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    // Check if user exists in Admin or Player model
    let user = await Admin.findOne({ where: { email } });
    let role = "admin";

    if (!user) {
      user = await Player.findOne({ where: { email } });
      role = "player";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Block password login for Google users
    if (user.password === "google") {
      return res.status(400).json({
        message: "This account is linked to Google. Please use Google Login.",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user: { ...user.toJSON(), role } });
  },
  async signup(req, res) {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    let user;

    if (role === "admin") {
      user = await Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } else {
      user = await Player.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    }

    // Attach role to the user data before returning
    res.status(201).json({ ...user.toJSON(), role });
  },

  async signout(req, res) {
    res.json({ message: "Successfully signed out" });
  },

  async updateNames(req, res) {
    const { id, role, firstName, lastName } = req.body;

    try {
      // Update user in the respective model based on their role
      let user;
      if (role === "admin") {
        user = await Admin.findByPk(id);
      } else if (role === "player") {
        user = await Player.findByPk(id);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's names
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();

      res.json({ message: "Names updated successfully", user: user.toJSON() });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating names" });
    }
  },

  async googleLogin(req, res) {
    const { token } = req.body;

    try {
      const googleUser = await verifyGoogleToken(token);

      // Check if user exists in the database
      let user = await Player.findOne({ where: { email: googleUser.email } });

      if (!user) {
        // Create a new user for Google login
        user = await Player.create({
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          password: "google", // Placeholder for Google users
        });
      }

      const appToken = generateToken(user);
      res.json({ token: appToken, user: user.toJSON() });
    } catch (error) {
      console.error("Google login failed:", error);
      res.status(401).json({ message: "Google authentication failed" });
    }
  },
};

module.exports = authController;
