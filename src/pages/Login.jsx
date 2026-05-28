import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import BASE_URL from '../api'
export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/login`, form)
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        navigate('/dashboard')
      } else {
        setError(res.data.message || 'Login failed. Check your credentials.')
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
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>

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
              placeholder="••••••••"
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-footer a">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  )
}



// import axios from "axios";

// function Login() {

//   const handleLogin = () => {

//     axios.post("http://localhost:5000/login", {

//       email: "kalyan@gmail.com",
//       password: "12345"

//     })
//     .then((response) => {

//       console.log(response.data);

//     });

//   };

//   return (

//     <div>

//       <h1>Login Page</h1>

//       <button onClick={handleLogin}>
//         Login
//       </button>

//     </div>

//   );
// }

// export default Login;