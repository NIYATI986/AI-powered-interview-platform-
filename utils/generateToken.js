const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nexora-dev-secret-change-in-production";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;