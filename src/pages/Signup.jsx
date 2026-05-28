import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/signup', form)
      if (res.data.message === 'Signup Successful') {
        navigate('/login')
      } else {
        setError(res.data.message || 'Signup failed.')
      }
    } catch {
      setError('Server error. Make sure the backend is running.')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-subtitle">Start analyzing resumes for free</p>

          <div className="form-group">
            <label>Full name</label>
            <input
              name="name"
              type="text"
              placeholder="Kalyan Ramireddy"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            className="btn btn-green btn-full"
            style={{ marginTop: '20px' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
