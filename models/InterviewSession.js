const mongoose = require("mongoose");

// Each question in the session, with the candidate's answer and AI evaluation
const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    answerText: { type: String, default: null },
    evaluation: { type: String, default: null }, // AI's written evaluation
    score: { type: Number, default: null }, // 0-10 for this question
    answeredAt: { type: Date, default: null },
  },
  { _id: true }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewRole",
      required: true,
    },
    questions: [questionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    overallScore: {
      type: Number, // average score out of 10, filled when completed
      default: null,
    },
    overallFeedback: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
