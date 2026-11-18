const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { DEFAULT_ROLES } = require("./defaultRoles");

const newId = () => crypto.randomBytes(12).toString("hex");

const defaultRoles = DEFAULT_ROLES.map((role, index) => ({
  _id: `65f00000000000000000000${index + 1}`,
  ...role,
}));

const users = new Map();
const sessions = new Map();

const findUserByEmail = (email) => {
  const normalized = (email || "").trim().toLowerCase();
  for (const user of users.values()) {
    if (user.email === normalized) return user;
  }
  return null;
};

const findUserById = (id) => users.get(String(id)) || null;

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    _id: newId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: "candidate",
    createdAt: new Date(),
  };
  users.set(user._id, user);
  return user;
};

const comparePassword = (user, candidatePassword) =>
  bcrypt.compare(candidatePassword, user.password);

const getRoles = () => defaultRoles;

const findRoleById = (roleId) =>
  defaultRoles.find((r) => r._id === String(roleId)) || null;

const createSession = ({ userId, roleDoc, firstQuestion }) => {
  const now = new Date();
  const session = {
    _id: newId(),
    user: String(userId),
    role: { ...roleDoc },
    questions: [
      {
        _id: newId(),
        questionText: firstQuestion,
        answerText: null,
        evaluation: null,
        score: null,
        answeredAt: null,
      },
    ],
    currentQuestionIndex: 0,
    status: "in_progress",
    overallScore: null,
    overallFeedback: null,
    startedAt: now,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  sessions.set(session._id, session);
  return session;
};

const findSessionByIdForUser = (sessionId, userId) => {
  const session = sessions.get(String(sessionId));
  if (!session || session.user !== String(userId)) return null;
  return session;
};

const getSessionsForUser = (userId) => {
  const list = [];
  for (const session of sessions.values()) {
    if (session.user === String(userId)) {
      list.push(session);
    }
  }
  return list.sort((a, b) => b.createdAt - a.createdAt);
};

module.exports = {
  newId,
  findUserByEmail,
  findUserById,
  createUser,
  comparePassword,
  getRoles,
  findRoleById,
  createSession,
  findSessionByIdForUser,
  getSessionsForUser,
};