// frontend/src/pages/InterviewTrack.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { getRoles, startInterview, getErrorMessage } from '../services/interviewService'

// Backend InterviewRole documents don't carry an icon, so we keep the same
// icon set from the original mock and match it to a role by keyword.
// This preserves the existing visual design while the data itself is real.
const iconFor = (title = '') => {
  const t = title.toLowerCase()
  if (t.includes('frontend')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>
  }
  if (t.includes('backend')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15H6a4 4 0 0 0-4 4v2"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/></svg>
  }
  if (t.includes('full') && t.includes('stack')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/></svg>
  }
  if (t.includes('data')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/></svg>
  }
  if (t.includes('devops')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v6H5z"/><path d="M5 14h14v6H5z"/><path d="M9 7h.01"/><path d="M9 17h.01"/><path d="M17 9l1.5 1.5L20 9"/><path d="M17 19l1.5 1.5L20 19"/></svg>
  }
  if (t.includes('mobile')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
  }
  // default
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
}

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)

const InterviewTrack = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    setLoadingRoles(true)
    setError('')
    try {
      const data = await getRoles()
      setRoles(data.roles || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load interview roles'))
    } finally {
      setLoadingRoles(false)
    }
  }

  const handleStartInterview = async () => {
    if (!selectedRoleId) {
      setError('Please select a role first')
      return
    }
    setStarting(true)
    setError('')
    try {
      const data = await startInterview(selectedRoleId)
      navigate(`/interview/${data.sessionId}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to start interview'))
      setStarting(false)
    }
  }

  return (
    <div className="track-page">
      <div className="track-header">
        <h1 className="track-title">Choose Your Interview Role</h1>
        <p className="track-subtitle">Select the role you want to practice for</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loadingRoles ? (
        <p className="track-subtitle">Loading roles...</p>
      ) : (
        <div className="tracks-grid">
          {roles.map((role) => (
            <Card
              key={role._id}
              className={`track-card ${selectedRoleId === role._id ? 'track-selected' : ''}`}
              hoverable
              onClick={() => setSelectedRoleId(role._id)}
            >
              <div className="track-icon">{iconFor(role.title)}</div>
              <h3 className="track-name">{role.title}</h3>
              <p className="track-description">{role.description || role.category}</p>
              <span className="track-difficulty">{capitalize(role.difficulty)}</span>
              {selectedRoleId === role._id && (
                <div className="track-check">✓</div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="track-actions">
        <Button
          variant="primary"
          size="large"
          onClick={handleStartInterview}
          disabled={!selectedRoleId || starting}
          loading={starting}
        >
          Start Interview
        </Button>
      </div>
    </div>
  )
}

export default InterviewTrack