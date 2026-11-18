const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { isDbConnected } = require("../config/db");
const memoryStore = require("../utils/memoryStore");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are all required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    let user;
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
      user = await User.create({ name, email, password });
    } else {
      const existingUser = memoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
      user = await memoryStore.createUser({ name, email, password });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user;
    let isMatch = false;
    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase() }).select("+password");
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    } else {
      user = memoryStore.findUserByEmail(email);
      if (user) {
        isMatch = await memoryStore.comparePassword(user, password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { signup, login, getMe };