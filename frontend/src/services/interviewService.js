// frontend/src/services/interviewService.js
// Reuses the existing Axios instance (src/api/axios.js) that already attaches
// the auth token — no separate axios instance is created here.
import API from '../api/axios'

// GET /api/interviews/roles -> { success, roles }
export const getRoles = async () => {
  const { data } = await API.get('/interviews/roles')
  return data
}

// POST /api/interviews/start  { role: roleId } -> { success, sessionId, questionNumber, totalQuestions, question }
export const startInterview = async (roleId) => {
  const { data } = await API.post('/interviews/start', { role: roleId })
  return data
}

// GET /api/interviews/:sessionId/question -> { success, questionNumber, totalQuestions, question, status }
export const getCurrentQuestion = async (sessionId) => {
  const { data } = await API.get(`/interviews/${sessionId}/question`)
  return data
}

// POST /api/interviews/:sessionId/answer  { answer } -> { success, score, evaluation, nextQuestion, questionNumber, totalQuestions, sessionEnded }
export const submitAnswer = async (sessionId, answerText) => {
  const { data } = await API.post(`/interviews/${sessionId}/answer`, { answer: answerText })
  return data
}

// POST /api/interviews/:sessionId/finish -> { success, overallScore, overallFeedback, session }
export const finishInterview = async (sessionId) => {
  const { data } = await API.post(`/interviews/${sessionId}/finish`)
  return data
}

// GET /api/interviews/:sessionId/progress -> { success, questionNumber, totalQuestions, status }
export const getProgress = async (sessionId) => {
  const { data } = await API.get(`/interviews/${sessionId}/progress`)
  return data
}

// GET /api/interviews/:sessionId -> { success, session }  (full transcript, populated role)
export const getSessionDetails = async (sessionId) => {
  const { data } = await API.get(`/interviews/${sessionId}`)
  return data
}

// GET /api/interviews/history -> { success, sessions }
export const getHistory = async () => {
  const { data } = await API.get('/interviews/history')
  return data
}

// Shared helper so every page surfaces backend error messages consistently
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.message || fallback