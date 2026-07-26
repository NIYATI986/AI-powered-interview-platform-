const InterviewRole = require("../models/InterviewRole");
const InterviewSession = require("../models/InterviewSession");
const aiService = require("../services/aiService");

// GET /api/interviews/roles
const getRoles = async (req, res) => {
  try {
    const roles = await InterviewRole.find().select(
      "title description category difficulty totalQuestions"
    );
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/interviews/start   body: { role: roleId }
const startInterview = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const roleDoc = await InterviewRole.findById(role);
    if (!roleDoc) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const firstQuestion = await aiService.generateFirstQuestion(roleDoc.title);

    const session = await InterviewSession.create({
      user: req.user._id,
      role: roleDoc._id,
      questions: [{ questionText: firstQuestion }],
      currentQuestionIndex: 0,
    });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      questionNumber: 1,
      totalQuestions: roleDoc.totalQuestions,
      question: firstQuestion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/:sessionId/question
const getCurrentQuestion = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "totalQuestions title");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const current = session.questions[session.currentQuestionIndex];
    res.json({
      success: true,
      questionNumber: session.currentQuestionIndex + 1,
      totalQuestions: session.role.totalQuestions,
      question: current.questionText,
      status: session.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/interviews/:sessionId/answer   body: { answer }
const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ success: false, message: "Answer is required" });
    }

    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "title totalQuestions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status !== "in_progress") {
      return res.status(400).json({ success: false, message: "Session is not in progress" });
    }

    const idx = session.currentQuestionIndex;
    session.questions[idx].answerText = answer;
    session.questions[idx].answeredAt = new Date();

    const totalQuestions = session.role.totalQuestions;
    const questionNumber = idx + 1;

    const result = await aiService.evaluateAnswerAndGenerateNext(
      session.role.title,
      session.questions,
      questionNumber,
      totalQuestions
    );

    session.questions[idx].evaluation = result.evaluation;
    session.questions[idx].score = result.score;

    let sessionEnded = false;
    if (result.nextQuestion && questionNumber < totalQuestions) {
      session.questions.push({ questionText: result.nextQuestion });
      session.currentQuestionIndex += 1;
    } else {
      sessionEnded = true;
    }

    await session.save();

    res.json({
      success: true,
      score: result.score,
      evaluation: result.evaluation,
      nextQuestion: sessionEnded ? null : result.nextQuestion,
      questionNumber: sessionEnded ? questionNumber : questionNumber + 1,
      totalQuestions,
      sessionEnded,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/interviews/:sessionId/finish
const finishInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "title");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Idempotent: if already completed, don't burn another AI call — return what's stored.
    if (session.status === "completed") {
      return res.json({
        success: true,
        overallScore: session.overallScore,
        overallFeedback: session.overallFeedback,
        session,
      });
    }

    const { overallScore, overallFeedback } = await aiService.generateOverallFeedback(
      session.role.title,
      session.questions
    );

    session.overallScore = overallScore;
    session.overallFeedback = overallFeedback;
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    res.json({ success: true, overallScore, overallFeedback, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/:sessionId/progress
const getProgress = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "totalQuestions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.json({
      success: true,
      questionNumber: session.currentQuestionIndex + 1,
      totalQuestions: session.role.totalQuestions,
      status: session.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/history
const getMyInterviews = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .populate("role", "title category")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, sessions });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
      error: err.message,
    });
  }
};

// GET /api/interviews/:sessionId (full transcript)
const getSessionDetails = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "title category totalQuestions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/dashboard
const getDashboard = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id }).populate(
      "role",
      "title"
    );

    const totalInterviews = sessions.length;
    const completed = sessions.filter((s) => s.status === "completed");
    const inProgress = sessions.filter((s) => s.status === "in_progress");

    // Bug fix: the schema field is `overallScore`, not `score`
    const scores = completed.map((s) => s.overallScore).filter((s) => s != null);
    const averageScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const bestSession = completed.reduce(
      (best, s) =>
        s.overallScore != null && (!best || s.overallScore > best.overallScore) ? s : best,
      null
    );

    const recentSessions = sessions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((s) => ({
        sessionId: s._id,
        role: s.role.title,
        status: s.status,
        score: s.overallScore,
        createdAt: s.createdAt,
      }));

    res.json({
      success: true,
      totalInterviews,
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      averageScore,
      bestScore: bestSession ? bestSession.overallScore : null,
      bestRole: bestSession ? bestSession.role.title : null,
      recentSessions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/stats
const getStatistics = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      user: req.user._id,
      status: "completed",
    }).populate("role", "title");

    const roleStats = {};

    sessions.forEach((s) => {
      const roleTitle = s.role.title;
      if (!roleStats[roleTitle]) {
        roleStats[roleTitle] = { role: roleTitle, attempts: 0, totalScore: 0, bestScore: 0 };
      }
      // Bug fix: the schema field is `overallScore`, not `score`
      roleStats[roleTitle].attempts += 1;
      roleStats[roleTitle].totalScore += s.overallScore || 0;
      roleStats[roleTitle].bestScore = Math.max(roleStats[roleTitle].bestScore, s.overallScore || 0);
    });

    const stats = Object.values(roleStats).map((r) => ({
      role: r.role,
      attempts: r.attempts,
      averageScore: Math.round(r.totalScore / r.attempts),
      bestScore: r.bestScore,
    }));

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/:sessionId/resume
const resumeInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "totalQuestions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    // Bug fix: fields are `questionText`/`answerText`, not `question`/`answer`;
    // and totalQuestions lives on the populated role, not directly on the session
    const current = session.questions[session.currentQuestionIndex];

    res.json({
      success: true,
      sessionId: session._id,
      questionNumber: session.currentQuestionIndex + 1,
      totalQuestions: session.role.totalQuestions,
      question: current.questionText,
      alreadyAnswered: current.answerText !== null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/:sessionId/result
const getResult = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "title totalQuestions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status !== "completed") {
      return res.status(400).json({ success: false, message: "Interview not completed yet" });
    }

    // Bug fix: fields are `overallScore`/`overallFeedback` (schema), and totalQuestions
    // lives on the populated role, not on the session itself
    res.json({
      success: true,
      sessionId: session._id,
      role: session.role.title,
      score: session.overallScore,
      overallSummary: session.overallFeedback,
      totalQuestions: session.role.totalQuestions,
      completedAt: session.completedAt || session.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};