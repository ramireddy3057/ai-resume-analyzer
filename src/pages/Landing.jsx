import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <section className="landing-hero">
          <div className="hero-badge">
            <span />
            AI-powered resume screening
          </div>
          <h1>Analyze your resume<br />with <em>AI precision</em></h1>
          <p>
            Upload your resume, paste the job description, and get an instant
            ATS match score with actionable feedback — in seconds.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-green btn-lg">
              Try it free →
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              Create account
            </Link>
          </div>
        </section>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
              📊
            </div>
            <h3>ATS score</h3>
            <p>See exactly how well your resume matches the job with a detailed percentage score.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#E6F1FB', color: '#185FA5' }}>
              🎯
            </div>
            <h3>Skill gap analysis</h3>
            <p>Discover which skills are matched and which are missing from the job requirements.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#FAEEDA', color: '#854F0B' }}>
              💡
            </div>
            <h3>Smart feedback</h3>
            <p>Get specific, actionable suggestions to improve your resume for each role you apply to.</p>
          </div>
        </div>
      </main>
    </>
  )
}
