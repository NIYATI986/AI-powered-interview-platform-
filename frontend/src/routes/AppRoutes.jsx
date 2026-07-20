// frontend/src/routes/AppRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import InterviewTrack from '../pages/InterviewTrack'
import Questions from '../pages/Questions'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/interview/track" element={<InterviewTrack />} />
      <Route path="/interview/:id" element={<Questions />} />
    </Routes>
  )
}

export default AppRoutes