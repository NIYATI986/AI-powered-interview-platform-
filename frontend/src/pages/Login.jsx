import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

const Login = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }


  const handleLogin = () => {

    if (!form.email.includes('@')) {
      setError('Enter a valid email')
      return
    }


    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }


    // Login successful
    navigate('/interview/track')
  }


  return (
    <div className="auth-page">

      <div className="auth-container">

        <Card className="auth-card">

          <div className="auth-header">
            <h1 className="auth-title">
              Welcome Back
            </h1>

            <p className="auth-subtitle">
              Sign in to continue your interview practice
            </p>
          </div>


          <form
            className="auth-form"
            onSubmit={(e)=>{
              e.preventDefault()
              handleLogin()
            }}
          >

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
              placeholder="Enter your password"
              value={form.password}
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
              Sign In
            </Button>


          </form>


          <p className="auth-footer">
            Don't have an account?
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>


        </Card>

      </div>

    </div>
  )
}

export default Login