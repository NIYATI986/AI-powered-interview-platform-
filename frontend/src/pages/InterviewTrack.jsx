// frontend/src/pages/InterviewTrack.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

const tracks = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
    description: 'React, JavaScript, CSS, HTML, UI/UX',
    difficulty: 'Intermediate'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog-icon lucide-user-cog"><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m14.305 16.53.923-.382"/><path d="m15.228 13.852-.923-.383"/><path d="m16.852 12.228-.383-.923"/><path d="m16.852 17.772-.383.924"/><path d="m19.148 12.228.383-.923"/><path d="m19.53 18.696-.382-.924"/><path d="m20.772 13.852.924-.383"/><path d="m20.772 16.148.924.383"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/></svg>,
    description: 'Node.js, Python, Database, APIs',
    difficulty: 'Intermediate'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket-icon lucide-rocket"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/></svg>,
    description: 'Complete web development stack',
    difficulty: 'Advanced'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/></svg>,
    description: 'SQL, Python, Statistics, Data Visualization',
    difficulty: 'Intermediate'
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server-cog"><path d="M5 4h14v6H5z"/><path d="M5 14h14v6H5z"/><path d="M9 7h.01"/><path d="M9 17h.01"/><path d="M17 9l1.5 1.5L20 9"/><path d="M17 19l1.5 1.5L20 19"/></svg>,
    description: 'Docker, Kubernetes, CI/CD, AWS, Linux',
    difficulty: 'Advanced'
  },
  {
    id: 'mobile',
    title: 'Mobile App Developer',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
    description: 'Flutter, React Native, Android, iOS',
    difficulty: 'Intermediate'
  }
]

const InterviewTrack = () => {
  const navigate = useNavigate()
  const [selectedTrack, setSelectedTrack] = useState(null)

  const handleStartInterview = () => {
    if (!selectedTrack) {
      alert('Please select a role first')
      return
    }
    navigate(`/interview/mock-session-${Date.now()}`)
  }

  return (
    <div className="track-page">
      <div className="track-header">
        <h1 className="track-title">Choose Your Interview Role</h1>
        <p className="track-subtitle">Select the role you want to practice for</p>
      </div>

      <div className="tracks-grid">
        {tracks.map((track) => (
          <Card
            key={track.id}
            className={`track-card ${selectedTrack === track.id ? 'track-selected' : ''}`}
            hoverable
            onClick={() => setSelectedTrack(track.id)}
          >
            <div className="track-icon">{track.icon}</div>
            <h3 className="track-name">{track.title}</h3>
            <p className="track-description">{track.description}</p>
            <span className="track-difficulty">{track.difficulty}</span>
            {selectedTrack === track.id && (
              <div className="track-check">✓</div>
            )}
          </Card>
        ))}
      </div>

      <div className="track-actions">
        <Button
          variant="primary"
          size="large"
          onClick={handleStartInterview}
          disabled={!selectedTrack}
        >
          Start Interview
        </Button>
      </div>
    </div>
  )
}

export default InterviewTrack