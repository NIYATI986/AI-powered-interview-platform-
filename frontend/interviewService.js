// frontend/src/services/interviewService.js
// Thin wrapper functions around the existing backend interview endpoints.
// No new backend routes are introduced here — every function maps 1:1 to
// an endpoint already defined in interviewRoutes.js.
import api from './api'

// GET /api/interviews/roles
export const getRoles = async () => {
  const { data } = await api.get('/interviews/roles')
  return data // { success, roles }
}

// POST /api/interviews/start  { roleId }
export const startInterview = async (roleId) => {
  const { data } = await api.post('/interviews/start', { roleId })
  return data // { success, sessionId, role, totalQuestions, firstQuestion }
}

// GET /api/interviews/:sessionId/question
export const getCurrentQuestion = async (sessionId) => {
  const { data } = await api.get(`/interviews/${sessionId}/question`)
  return data // { success, sessionId, questionIndex, totalQuestions, question }
}

// POST /api/interviews/:sessionId/answer  { answerText }
export const submitAnswer = async (sessionId, answerText) => {
  const { data } = await api.post(`/interviews/${sessionId}/answer`, { answerText })
  return data // { success, evaluation, score, nextQuestion, isComplete, progress }
}

// POST /api/interviews/:sessionId/finish
export const finishInterview = async (sessionId) => {
  const { data } = await api.post(`/interviews/${sessionId}/finish`)
  return data // { success, overallScore, overallFeedback, questionBreakdown? }
}

// GET /api/interviews/:sessionId/progress
export const getProgress = async (sessionId) => {
  const { data } = await api.get(`/interviews/${sessionId}/progress`)
  return data // { success, sessionId, role, status, currentQuestionIndex, totalQuestions, overallScore }
}

// GET /api/interviews/history
export const getHistory = async () => {
  const { data } = await api.get('/interviews/history')
  return data // { success, sessions }
}

// Small shared helper so every page surfaces backend error messages consistently
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.message || fallback