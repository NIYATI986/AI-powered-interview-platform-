const mongoose = require("mongoose");

const interviewRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true, // e.g. "Frontend Developer", "Data Analyst"
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String, // e.g. "Software Engineering", "Data Science", "HR"
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewRole", interviewRoleSchema);
