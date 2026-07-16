const InterviewRole = require("../models/InterviewRole");
const InterviewSession = require("../models/InterviewSession");
const {
  generateQuestions,
  evaluateAnswer,
  generateOverallFeedback,
} = require("../services/aiService");

// @route   GET /api/interviews/roles
// @access  Private
// Fetch all available interview roles the candidate can pick from
const getRoles = async (req, res) => {
  try {
    const roles = await InterviewRole.find().sort({ title: 1 });
    return res.status(200).json({ success: true, roles });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview roles",
      error: err.message,
    });
  }
};

// @route   POST /api/interviews/start
// @body    { roleId }
// @access  Private
// Starts a new interview session: generates questions via AI and stores them
const startInterview = async (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res.status(400).json({ success: false, message: "roleId is required" });
    }

    const role = await InterviewRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: "Interview role not found" });
    }

    // AI Integration: generate questions for this role
    const questionTexts = await generateQuestions(
      role.title,
      role.difficulty,
      role.totalQuestions
    );

    const session = await InterviewSession.create({
      user: req.user._id,
      role: role._id,
      questions: questionTexts.map((q) => ({ questionText: q })),
      currentQuestionIndex: 0,
      status: "in_progress",
    });

    return res.status(201).json({
      success: true,
      message: "Interview session started",
      sessionId: session._id,
      role: role.title,
      totalQuestions: session.questions.length,
      firstQuestion: session.questions[0].questionText,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to start interview. Check AI provider configuration.",
      error: err.message,
    });
  }
};

// @route   GET /api/interviews/:sessionId/question
// @access  Private
// Returns the current (next unanswered) question for this session
const getCurrentQuestion = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: `This interview session is already ${session.status}`,
      });
    }

    if (session.currentQuestionIndex >= session.questions.length) {
      return res.status(400).json({
        success: false,
        message: "All questions have been answered. Call the finish endpoint.",
      });
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      questionIndex: session.currentQuestionIndex,
      totalQuestions: session.questions.length,
      question: currentQuestion.questionText,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current question",
      error: err.message,
    });
  }
};

// @route   POST /api/interviews/:sessionId/answer
// @body    { answerText }
// @access  Private
// Stores the candidate's answer for the current question, sends it to AI for
// evaluation, and advances progress to the next question
const submitAnswer = async (req, res) => {
  try {
    const { answerText } = req.body;
    if (!answerText || !answerText.trim()) {
      return res.status(400).json({ success: false, message: "answerText is required" });
    }

    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: `This interview session is already ${session.status}`,
      });
    }

    const idx = session.currentQuestionIndex;
    if (idx >= session.questions.length) {
      return res.status(400).json({ success: false, message: "No more questions to answer" });
    }

    const currentQuestion = session.questions[idx];

    // AI Integration: send answer for evaluation, receive evaluation + score
    const { evaluation, score } = await evaluateAnswer(
      session.role.title,
      currentQuestion.questionText,
      answerText
    );

    currentQuestion.answerText = answerText;
    currentQuestion.evaluation = evaluation;
    currentQuestion.score = score;
    currentQuestion.answeredAt = new Date();

    // Store current progress: move pointer to next question
    session.currentQuestionIndex += 1;
    await session.save();

    const isLastQuestion = session.currentQuestionIndex >= session.questions.length;

    return res.status(200).json({
      success: true,
      evaluation,
      score,
      nextQuestion: isLastQuestion
        ? null
        : session.questions[session.currentQuestionIndex].questionText,
      isComplete: isLastQuestion,
      progress: `${session.currentQuestionIndex}/${session.questions.length}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: err.message,
    });
  }
};

// @route   POST /api/interviews/:sessionId/finish
// @access  Private
// Generates final AI feedback and calculates the overall score
const finishInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Session already completed",
        overallScore: session.overallScore,
        overallFeedback: session.overallFeedback,
      });
    }

    const answeredQuestions = session.questions.filter((q) => q.answerText);
    if (answeredQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot finish an interview with no answered questions",
      });
    }

    // AI Integration: generate overall feedback + calculate final score
    const { feedback, overallScore } = await generateOverallFeedback(
      session.role.title,
      answeredQuestions
    );

    session.overallFeedback = feedback;
    session.overallScore = overallScore;
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Interview completed",
      overallScore,
      overallFeedback: feedback,
      questionBreakdown: session.questions.map((q) => ({
        question: q.questionText,
        answer: q.answerText,
        score: q.score,
        evaluation: q.evaluation,
      })),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to finish interview",
      error: err.message,
    });
  }
};

// @route   GET /api/interviews/:sessionId/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).populate("role", "title");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      role: session.role.title,
      status: session.status,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.questions.length,
      overallScore: session.overallScore,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: err.message,
    });
  }
};

// @route   GET /api/interviews/history
// @access  Private
// Bonus: list all of the current user's past/ongoing sessions
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

module.exports = {
  getRoles,
  startInterview,
  getCurrentQuestion,
  submitAnswer,
  finishInterview,
  getProgress,
  getMyInterviews,
};
