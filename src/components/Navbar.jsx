import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="nav-dot" />
        ResumeAI
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup" className="nav-link primary">Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
