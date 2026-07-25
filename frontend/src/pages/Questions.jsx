// frontend/src/pages/Questions.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import {
  getSessionDetails,
  submitAnswer,
  finishInterview,
  getErrorMessage,
} from '../services/interviewService'

const Questions = () => {
  const { id: sessionId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [roleTitle, setRoleTitle] = useState('')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [nextQuestionText, setNextQuestionText] = useState(null)
  const [sessionEnded, setSessionEnded] = useState(false)

  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // { evaluation, score }
  const [submitting, setSubmitting] = useState(false)
  const [advancing, setAdvancing] = useState(false)

  const [completed, setCompleted] = useState(false)
  const [results, setResults] = useState(null) // { overallScore, overallFeedback, session }

  useEffect(() => {
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const loadSession = async () => {
    setLoading(true)
    setError('')
    try {
      const { session } = await getSessionDetails(sessionId)
      setRoleTitle(session.role?.title)
      setTotalQuestions(session.role?.totalQuestions || session.questions.length)

      if (session.status === 'completed') {
        setResults({ overallScore: session.overallScore, overallFeedback: session.overallFeedback, session })
        setCompleted(true)
      } else {
        const current = session.questions[session.currentQuestionIndex]
        setCurrentQuestion(current.questionText)
        setQuestionNumber(session.currentQuestionIndex + 1)
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load this interview session'))
    } finally {
      setLoading(false)
    }
  }

  const loadResults = async () => {
    const res = await finishInterview(sessionId)
    setResults(res)
    setCompleted(true)
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please write your answer')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await submitAnswer(sessionId, answer)
      setFeedback({ evaluation: res.evaluation, score: res.score })
      setNextQuestionText(res.nextQuestion)
      setSessionEnded(res.sessionEnded)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to submit your answer'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleContinue = async () => {
    if (sessionEnded) {
      setAdvancing(true)
      setError('')
      try {
        await loadResults()
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to generate your final feedback'))
      } finally {
        setAdvancing(false)
      }
      return
    }
    setCurrentQuestion(nextQuestionText)
    setQuestionNumber((n) => n + 1)
    setAnswer('')
    setFeedback(null)
  }

  if (loading) {
    return (
      <div className="interview-page">
        <div className="interview-container">
          <p className="track-subtitle">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (error && !currentQuestion && !completed) {
    return (
      <div className="interview-page">
        <div className="interview-container">
          <p className="error-message">{error}</p>
          <Button variant="outline" onClick={() => navigate('/interview/track')}>
            Back to Roles
          </Button>
        </div>
      </div>
    )
  }

  if (completed && results) {
    const scoreOutOf100 = Math.round((results.overallScore || 0) * 10)
    const breakdown = results.session?.questions || []

    return (
      <div className="results-page">
        <div className="results-container">
          <Card className="results-card">
            <div className="results-header">
              <div className="results-icon">🎉</div>
              <h1 className="results-title">Interview Complete!</h1>
              <div className="results-score">
                <span className="score-number">{scoreOutOf100}</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>

            <div className="results-summary">
              <h3>Overall Summary</h3>
              <p>{results.overallFeedback}</p>
            </div>

            {breakdown.length > 0 && (
              <div className="results-transcript">
                <h3>Full Transcript</h3>
                {breakdown.map((item, index) => (
                  <Card key={item._id || index} className="transcript-item">
                    <div className="transcript-question">
                      <span className="q-number">Q{index + 1}</span>
                      <p>{item.questionText}</p>
                    </div>
                    <div className="transcript-answer">
                      <strong>Your Answer:</strong>
                      <p>{item.answerText || 'No answer provided'}</p>
                    </div>
                    <div className="transcript-feedback">
                      <strong>Feedback:</strong>
                      <p>{item.evaluation}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="results-actions">
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                View History
              </Button>
              <Button variant="outline" onClick={() => navigate('/interview/track')}>
                Practice Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="interview-page">
      <div className="interview-container">
        <div className="interview-progress">
          <span className="progress-label">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <Card className="question-card">
          <div className="question-header">
            <span className="question-role">{roleTitle}</span>
            <span className="question-number">Q{questionNumber}</span>
          </div>
          <div className="question-content">
            <h2>{currentQuestion}</h2>
          </div>
        </Card>

        {error && <p className="error-message">{error}</p>}

        {feedback ? (
          <Card className="feedback-card">
            <div className="feedback-content">
              <h4>💡 Feedback</h4>
              <p>{feedback.evaluation}</p>
              <p><strong>Score:</strong> {feedback.score}/10</p>
            </div>
            <div className="answer-actions">
              <Button variant="primary" onClick={handleContinue} loading={advancing}>
                {sessionEnded ? 'See Results' : 'Next Question'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="answer-card">
            <div className="answer-content">
              <textarea
                className="answer-textarea"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                disabled={submitting}
              />
              <div className="answer-actions">
                <Button variant="primary" onClick={handleSubmitAnswer} loading={submitting}>
                  Submit Answer
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Questions