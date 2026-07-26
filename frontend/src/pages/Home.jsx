// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { getHistory, getErrorMessage } from '../services/interviewService'

const Home = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getHistory()
      setSessions(data.sessions || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load interview history'))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-average'
    return 'score-low'
  }

  // Backend stores scores on a 0-10 scale; the UI displays 0-100.
  const toDisplayScore = (score) => (score == null ? null : Math.round(score * 10))

  const completedSessions = sessions.filter((s) => s.overallScore != null)
  const displayScores = completedSessions.map((s) => toDisplayScore(s.overallScore))

  const handleSessionClick = (session) => {
    if (session.status === 'completed') {
      navigate(`/interview/${session._id}/transcript`, { state: { session } })
    } else {
      navigate(`/interview/${session._id}`)
    }
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-welcome">
          <h1 className="home-title">Welcome back!</h1>
          <p className="home-subtitle">Track your interview progress and practice more</p>
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate('/interview/track')}
        >
          Start New Interview
        </Button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="home-stats">
        <Card className="stat-card">
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Total Interviews</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            {displayScores.length > 0
              ? Math.round(displayScores.reduce((acc, s) => acc + s, 0) / displayScores.length)
              : 0}
          </div>
          <div className="stat-label">Average Score</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            {displayScores.length > 0 ? Math.max(...displayScores) : 0}
          </div>
          <div className="stat-label">Best Score</div>
        </Card>
      </div>

      <div className="home-history">
        <h2 className="section-title">Interview History</h2>

        {loading ? (
          <p className="track-subtitle">Loading history...</p>
        ) : sessions.length === 0 ? (
          <p className="track-subtitle">No interviews yet. Start your first one above!</p>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => {
              const displayScore = toDisplayScore(session.overallScore)
              return (
                <Card key={session._id} className="session-card" hoverable>
                  <div className="session-header">
                    <span className="session-role">{session.role?.title}</span>
                    {displayScore != null ? (
                      <span className={`session-score ${getScoreColor(displayScore)}`}>
                        {displayScore}/100
                      </span>
                    ) : (
                      <span className="session-score">In Progress</span>
                    )}
                  </div>
                  <div className="session-date">{formatDate(session.createdAt)}</div>
                  <div className="session-summary">
                    {session.overallFeedback
                      ? `${session.overallFeedback.slice(0, 100)}...`
                      : 'Feedback will appear once this interview is completed.'}
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleSessionClick(session)}
                  >
                    {session.status === 'completed' ? 'View Transcript' : 'Resume Interview'}
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home