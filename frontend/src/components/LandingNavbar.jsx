
import React from 'react'
import { Link } from 'react-router-dom'

const LandingNavbar = () => {
  return (
    <nav className="landing-nav">
        <div className="nav-container">
            <Link to="/" className="navbar-logo">
                <span className="logo-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ba89ec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></span>
                <span className="text">Nexora</span>
            </Link>
          <div className="nav-actions">
            <button className="nav-btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="nav-btn-solid" onClick={() => navigate('/login')}>Get started</button>
          </div>
        </div>
      </nav>
  )
}

export default LandingNavbar