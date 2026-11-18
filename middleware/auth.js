const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isDbConnected } = require("../config/db");
const memoryStore = require("../utils/memoryStore");

const JWT_SECRET = process.env.JWT_SECRET || "nexora-dev-secret-change-in-production";

// Protect routes - verifies JWT and attaches user to req.user
const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let user;
    if (isDbConnected()) {
      user = await User.findById(decoded.id).select("-password");
    } else {
      const memUser = memoryStore.findUserById(decoded.id);
      if (memUser) {
        const { password, ...safeUser } = memUser;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };