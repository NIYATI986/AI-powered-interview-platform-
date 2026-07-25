// frontend/src/pages/Transcript.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { getSessionDetails, getErrorMessage } from '../services/interviewService'

const Transcript = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Home.jsx may pass the session via router state to avoid an extra call,
  // but GET /interviews/:sessionId is a real endpoint now, so we always have
  // a reliable fallback (e.g. on refresh or a direct link).
  const [session, setSession] = useState(location.state?.session || null)
  const [loading, setLoading] = useState(!location.state?.session)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) {
      loadSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadSession = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getSessionDetails(id)
      setSession(data.session)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load transcript'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="transcript-page">
        <p className="track-subtitle">Loading transcript...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="transcript-page">
        <h2>{error || 'Transcript not found'}</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const scoreOutOf100 = session.overallScore != null ? Math.round(session.overallScore * 10) : null

  return (
    <div className="transcript-page">
      <Card className="results-card">
        <h1>{session.role?.title} Transcript</h1>

        <h2>{scoreOutOf100 != null ? `Score: ${scoreOutOf100}/100` : 'In Progress'}</h2>

        {session.overallFeedback && (
          <p className="results-summary">{session.overallFeedback}</p>
        )}

        {(session.questions || []).map((item, index) => (
          <Card key={item._id || index} className="transcript-item">
            <h3>
              Q{index + 1}. {item.questionText}
            </h3>

            <p>
              <strong>Your Answer:</strong>
              <br />
              {item.answerText || 'No answer provided'}
            </p>

            <p>
              <strong>Feedback:</strong>
              <br />
              {item.evaluation || 'Not evaluated yet'}
            </p>
          </Card>
        ))}

        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Card>
    </div>
  )
}

export default Transcript