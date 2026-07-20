// frontend/src/pages/Home.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

// Mock data for demonstration
const mockSessions = [
  {
    _id: '1',
    role: 'Frontend Developer',
    score: 85,
    overallSummary: 'Great performance! You showed strong understanding of React concepts and JavaScript fundamentals.',
    createdAt: '2026-07-15T10:30:00Z',
  },
  {
    _id: '2',
    role: 'Backend Developer',
    score: 72,
    overallSummary: 'Good understanding of backend concepts. Focus more on database optimization.',
    createdAt: '2026-07-14T15:45:00Z',
  },
  {
    _id: '3',
    role: 'Data Analyst',
    score: 93,
    overallSummary: 'Excellent analytical skills! Strong understanding of statistical concepts.',
    createdAt: '2026-07-13T09:15:00Z',
  }
]

const Home = () => {
  const navigate = useNavigate()
  const [sessions] = useState(mockSessions)
  const user = { name: 'Demo User' }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-average'
    return 'score-low'
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-welcome">
          <h1 className="home-title">Welcome, {user.name || 'User'}! </h1>
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

      <div className="home-stats">
        <Card className="stat-card">
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Total Interviews</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            {sessions.length > 0 
              ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length)
              : 0}
          </div>
          <div className="stat-label">Average Score</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            {sessions.length > 0 
              ? Math.max(...sessions.map(s => s.score || 0))
              : 0}
          </div>
          <div className="stat-label">Best Score</div>
        </Card>
      </div>

      <div className="home-history">
        <h2 className="section-title">Interview History</h2>
        <div className="sessions-grid">
          {sessions.map((session) => (
            <Card key={session._id} className="session-card" hoverable>
              <div className="session-header">
                <span className="session-role">{session.role}</span>
                <span className={`session-score ${getScoreColor(session.score)}`}>
                  {session.score}/100
                </span>
              </div>
              <div className="session-date">{formatDate(session.createdAt)}</div>
              <div className="session-summary">{session.overallSummary?.slice(0, 100)}...</div>
              <Button
                variant="outline"
                size="small"
                onClick={() => navigate(`/interview/${session._id}`)}
              >
                View Transcript
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home