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
} = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

// All interview routes require a logged-in user
router.use(protect);

router.get("/roles", getRoles);
router.get("/history", getMyInterviews);

router.post("/start", startInterview);
router.get("/:sessionId/question", getCurrentQuestion);
router.post("/:sessionId/answer", submitAnswer);
router.post("/:sessionId/finish", finishInterview);
router.get("/:sessionId/progress", getProgress);

module.exports = router;
