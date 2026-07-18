const express = require("express");
const router = express.Router();
const {
  getRoles,
  startInterview,
  getCurrentQuestion,
  submitAnswer,
  finishInterview,
  getProgress,
  getMyInterviews,
  getSessionDetails,
  getDashboard,
  getStatistics,
  resumeInterview,
  getResult,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

// All interview routes require a logged-in user
router.use(protect);

router.get("/roles", getRoles);
router.get("/history", getMyInterviews);
router.get("/dashboard", getDashboard);
router.get("/stats", getStatistics);

router.post("/start", startInterview);
router.get("/:sessionId/question", getCurrentQuestion);
router.get("/:sessionId/resume", resumeInterview);
router.get("/:sessionId/result", getResult);
router.get("/:sessionId/progress", getProgress);
router.post("/:sessionId/answer", submitAnswer);
router.post("/:sessionId/finish", finishInterview);
router.get("/:sessionId/progress", getProgress);
router.get("/:sessionId", getSessionDetails);

module.exports = router;
