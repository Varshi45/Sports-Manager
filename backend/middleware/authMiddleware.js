// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findByPk(decoded.id);

    // Check if user exists
    if (!user) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = authenticateAdmin;
