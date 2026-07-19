import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = () => {

    if (!form.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Signup successful
    navigate('/interview/track')
  }


  return (
    <div className="auth-page">
      <div className="auth-container">

        <Card className="auth-card">

          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Start your interview preparation journey
            </p>
          </div>


          <form 
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSignup()
            }}
          >

            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />


            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />


            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />


            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />


            {error && (
              <p className="error-message">
                {error}
              </p>
            )}


            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="large"
            >
              Create Account
            </Button>

          </form>


          <p className="auth-footer">
            Already have an account?
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>


        </Card>

      </div>
    </div>
  )
}

export default Signup