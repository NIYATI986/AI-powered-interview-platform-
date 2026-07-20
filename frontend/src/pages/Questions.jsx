// frontend/src/pages/Questions.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

const mockQuestions = [
  'What is the difference between props and state in React?',
  'Explain the concept of closure in JavaScript.',
  'What is the CSS box model?',
  'Explain the virtual DOM in React.',
  'What is the difference between HTTP and HTTPS?'
]

const mockFeedback = [
  'Excellent! You demonstrated a clear understanding of this concept.',
  'Good answer! Consider mentioning the lexical scoping aspect.',
  'Great! You covered the key components of the box model.',
  'Nice explanation! The virtual DOM is a crucial React concept.',
  'Perfect! You clearly understand the security implications.'
]

const Questions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState([])

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      alert('Please write your answer')
      return
    }

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    setFeedback(mockFeedback[currentQuestionIndex % mockFeedback.length])

    setTimeout(() => {
      if (currentQuestionIndex >= 4) {
        setCompleted(true)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer('')
        setFeedback(null)
      }
    }, 2000)
  }

  if (completed) {
    return (
      <div className="results-page">
        <div className="results-container">
          <Card className="results-card">
            <div className="results-header">
              <div className="results-icon">🎉</div>
              <h1 className="results-title">Interview Complete!</h1>
              <div className="results-score">
                <span className="score-number">85</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>

            <div className="results-summary">
              <h3>Overall Summary</h3>
              <p>Great performance! You showed strong understanding of React concepts and JavaScript fundamentals. Keep practicing to improve further!</p>
            </div>

            <div className="results-transcript">
              <h3>Full Transcript</h3>
              {mockQuestions.map((q, index) => (
                <Card key={index} className="transcript-item">
                  <div className="transcript-question">
                    <span className="q-number">Q{index + 1}</span>
                    <p>{q}</p>
                  </div>
                  <div className="transcript-answer">
                    <strong>Your Answer:</strong>
                    <p>{answers[index] || 'No answer provided'}</p>
                  </div>
                  <div className="transcript-feedback">
                    <strong>Feedback:</strong>
                    <p>{mockFeedback[index % mockFeedback.length]}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="results-actions">
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
              >
                View History
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/interview/track')}
              >
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
            Question {currentQuestionIndex + 1} of 5
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="question-card">
          <div className="question-header">
            <span className="question-role">Frontend Developer</span>
            <span className="question-number">Q{currentQuestionIndex + 1}</span>
          </div>
          <div className="question-content">
            <h2>{mockQuestions[currentQuestionIndex]}</h2>
          </div>
        </Card>

        {feedback && (
          <Card className="feedback-card">
            <div className="feedback-content">
              <h4>💡 Feedback</h4>
              <p>{feedback}</p>
            </div>
          </Card>
        )}

        {!feedback && (
          <Card className="answer-card">
            <div className="answer-content">
              <textarea
                className="answer-textarea"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
              />
              <div className="answer-actions">
                <Button
                  variant="primary"
                  onClick={handleSubmitAnswer}
                >
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