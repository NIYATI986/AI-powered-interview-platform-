import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingNavbar from './components/LandingNavbar'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import InterviewTrack from './pages/InterviewTrack'
import Questions from './pages/Questions'

import './styles/global.css'


function AppNavbar() {
  const location = useLocation()

  const landingRoutes = [
    '/',
    '/login',
    '/signup'
  ]

  if (landingRoutes.includes(location.pathname)) {
    return <LandingNavbar />
  }

  return <Navbar />
}


function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app">
        <AppNavbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Home />} />

            <Route path="/interview/track" element={<InterviewTrack />} />
            <Route path="/interview/:id" element={<Questions />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App