// const InterviewRole = require("../models/InterviewRole");
// const InterviewSession = require("../models/InterviewSession");
// const {
//   generateQuestions,
//   evaluateAnswer,
//   generateOverallFeedback,
// } = require("../services/aiService");

// // @route   GET /api/interviews/roles
// // @access  Private
// // Fetch all available interview roles the candidate can pick from
// const getRoles = async (req, res) => {
//   try {
//     const roles = await InterviewRole.find().sort({ title: 1 });
//     return res.status(200).json({ success: true, roles });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch interview roles",
//       error: err.message,
//     });
//   }
// };

// // @route   POST /api/interviews/start
// // @body    { roleId }
// // @access  Private
// // Starts a new interview session: generates questions via AI and stores them
// const startInterview = async (req, res) => {
//   try {
//     const { roleId } = req.body;
//     if (!roleId) {
//       return res.status(400).json({ success: false, message: "roleId is required" });
//     }

//     const role = await InterviewRole.findById(roleId);
//     if (!role) {
//       return res.status(404).json({ success: false, message: "Interview role not found" });
//     }

//     // AI Integration: generate questions for this role
//     const questionTexts = await generateQuestions(
//       role.title,
//       role.difficulty,
//       role.totalQuestions
//     );

//     const session = await InterviewSession.create({
//       user: req.user._id,
//       role: role._id,
//       questions: questionTexts.map((q) => ({ questionText: q })),
//       currentQuestionIndex: 0,
//       status: "in_progress",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Interview session started",
//       sessionId: session._id,
//       role: role.title,
//       totalQuestions: session.questions.length,
//       firstQuestion: session.questions[0].questionText,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to start interview. Check AI provider configuration.",
//       error: err.message,
//     });
//   }
// };

// // @route   GET /api/interviews/:sessionId/question
// // @access  Private
// // Returns the current (next unanswered) question for this session
// const getCurrentQuestion = async (req, res) => {
//   try {
//     const session = await InterviewSession.findOne({
//       _id: req.params.sessionId,
//       user: req.user._id,
//     });

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Session not found" });
//     }

//     if (session.status !== "in_progress") {
//       return res.status(400).json({
//         success: false,
//         message: `This interview session is already ${session.status}`,
//       });
//     }

//     if (session.currentQuestionIndex >= session.questions.length) {
//       return res.status(400).json({
//         success: false,
//         message: "All questions have been answered. Call the finish endpoint.",
//       });
//     }

//     const currentQuestion = session.questions[session.currentQuestionIndex];

//     return res.status(200).json({
//       success: true,
//       sessionId: session._id,
//       questionIndex: session.currentQuestionIndex,
//       totalQuestions: session.questions.length,
//       question: currentQuestion.questionText,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch current question",
//       error: err.message,
//     });
//   }
// };

// // @route   POST /api/interviews/:sessionId/answer
// // @body    { answerText }
// // @access  Private
// // Stores the candidate's answer for the current question, sends it to AI for
// // evaluation, and advances progress to the next question
// const submitAnswer = async (req, res) => {
//   try {
//     const { answerText } = req.body;
//     if (!answerText || !answerText.trim()) {
//       return res.status(400).json({ success: false, message: "answerText is required" });
//     }

//     const session = await InterviewSession.findOne({
//       _id: req.params.sessionId,
//       user: req.user._id,
//     }).populate("role");

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Session not found" });
//     }
//     if (session.status !== "in_progress") {
//       return res.status(400).json({
//         success: false,
//         message: `This interview session is already ${session.status}`,
//       });
//     }

//     const idx = session.currentQuestionIndex;
//     if (idx >= session.questions.length) {
//       return res.status(400).json({ success: false, message: "No more questions to answer" });
//     }

//     const currentQuestion = session.questions[idx];

//     // AI Integration: send answer for evaluation, receive evaluation + score
//     const { evaluation, score } = await evaluateAnswer(
//       session.role.title,
//       currentQuestion.questionText,
//       answerText
//     );

//     currentQuestion.answerText = answerText;
//     currentQuestion.evaluation = evaluation;
//     currentQuestion.score = score;
//     currentQuestion.answeredAt = new Date();

//     // Store current progress: move pointer to next question
//     session.currentQuestionIndex += 1;
//     await session.save();

//     const isLastQuestion = session.currentQuestionIndex >= session.questions.length;

//     return res.status(200).json({
//       success: true,
//       evaluation,
//       score,
//       nextQuestion: isLastQuestion
//         ? null
//         : session.questions[session.currentQuestionIndex].questionText,
//       isComplete: isLastQuestion,
//       progress: `${session.currentQuestionIndex}/${session.questions.length}`,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit answer",
//       error: err.message,
//     });
//   }
// };

// // @route   POST /api/interviews/:sessionId/finish
// // @access  Private
// // Generates final AI feedback and calculates the overall score
// const finishInterview = async (req, res) => {
//   try {
//     const session = await InterviewSession.findOne({
//       _id: req.params.sessionId,
//       user: req.user._id,
//     }).populate("role");

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Session not found" });
//     }
//     if (session.status === "completed") {
//       return res.status(200).json({
//         success: true,
//         message: "Session already completed",
//         overallScore: session.overallScore,
//         overallFeedback: session.overallFeedback,
//       });
//     }

//     const answeredQuestions = session.questions.filter((q) => q.answerText);
//     if (answeredQuestions.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot finish an interview with no answered questions",
//       });
//     }

//     // AI Integration: generate overall feedback + calculate final score
//     const { feedback, overallScore } = await generateOverallFeedback(
//       session.role.title,
//       answeredQuestions
//     );

//     session.overallFeedback = feedback;
//     session.overallScore = overallScore;
//     session.status = "completed";
//     session.completedAt = new Date();
//     await session.save();

//     return res.status(200).json({
//       success: true,
//       message: "Interview completed",
//       overallScore,
//       overallFeedback: feedback,
//       questionBreakdown: session.questions.map((q) => ({
//         question: q.questionText,
//         answer: q.answerText,
//         score: q.score,
//         evaluation: q.evaluation,
//       })),
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to finish interview",
//       error: err.message,
//     });
//   }
// };

// // @route   GET /api/interviews/:sessionId/progress
// // @access  Private
// const getProgress = async (req, res) => {
//   try {
//     const session = await InterviewSession.findOne({
//       _id: req.params.sessionId,
//       user: req.user._id,
//     }).populate("role", "title");

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Session not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       sessionId: session._id,
//       role: session.role.title,
//       status: session.status,
//       currentQuestionIndex: session.currentQuestionIndex,
//       totalQuestions: session.questions.length,
//       overallScore: session.overallScore,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch progress",
//       error: err.message,
//     });
//   }
// };

// // @route   GET /api/interviews/history
// // @access  Private
// // Bonus: list all of the current user's past/ongoing sessions
// const getMyInterviews = async (req, res) => {
//   try {
//     const sessions = await InterviewSession.find({ user: req.user._id })
//       .populate("role", "title category")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({ success: true, sessions });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch interview history",
//       error: err.message,
//     });
//   }
// };









////--------------------------------------------------------------------------------------------------------------------------------------------------------------------



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
    }).populate("role", "title category");

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

    const scores = completed.map((s) => s.score).filter((s) => s != null);
    const averageScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const bestSession = completed.reduce(
      (best, s) => (s.score != null && (!best || s.score > best.score) ? s : best),
      null
    );

    const recentSessions = sessions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((s) => ({
        sessionId: s._id,
        role: s.role.title,
        status: s.status,
        score: s.score,
        createdAt: s.createdAt,
      }));

    res.json({
      success: true,
      totalInterviews,
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      averageScore,
      bestScore: bestSession ? bestSession.score : null,
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
      roleStats[roleTitle].attempts += 1;
      roleStats[roleTitle].totalScore += s.score || 0;
      roleStats[roleTitle].bestScore = Math.max(roleStats[roleTitle].bestScore, s.score || 0);
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
    });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status === "completed") {
      return res.status(400).json({ success: false, message: "Interview already completed" });
    }

    const current = session.questions[session.currentQuestionIndex];

    res.json({
      success: true,
      sessionId: session._id,
      questionNumber: session.currentQuestionIndex + 1,
      totalQuestions: session.totalQuestions,
      question: current.question,
      alreadyAnswered: current.answer !== null,
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
    }).populate("role", "title");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.status !== "completed") {
      return res.status(400).json({ success: false, message: "Interview not completed yet" });
    }

    res.json({
      success: true,
      sessionId: session._id,
      role: session.role.title,
      score: session.score,
      overallSummary: session.overallSummary,
      totalQuestions: session.totalQuestions,
      completedAt: session.updatedAt,
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
