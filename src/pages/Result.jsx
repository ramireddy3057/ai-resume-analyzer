import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.result) {
    return (
      <>
        <Navbar />
        <div className="result-page">
          <p style={{ color: 'var(--muted)' }}>No result found. Please analyze a resume first.</p>
          <button className="btn btn-green" style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </>
    )
  }

  const {
    score,
    matchedSkills = [],
    missingSkills = [],
    overallFeedback,
    strengths = [],
    improvements = [],
    rewrittenSummary,
  } = state.result
  const fileName = state.fileName || 'resume.pdf'

  const scoreColor = score >= 70 ? 'var(--green)' : score >= 45 ? '#EF9F27' : '#E24B4A'
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <>
      <Navbar />
      <div className="result-page">
        <div className="page-header">
          <h2>Analysis complete</h2>
          <p>{fileName} &nbsp;·&nbsp; AI-powered by Gemini</p>
        </div>

        {/* Row 1: Score + Skills */}
        <div className="result-top">
          <div className="score-card">
            <div className="score-circle">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--bg)" strokeWidth="8" />
                <circle cx="55" cy="55" r={radius} fill="none" stroke={scoreColor}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div className="score-text" style={{ color: scoreColor }}>{score}</div>
            </div>
            <div className="score-title">ATS match score</div>
            <div className="score-sub">
              {score >= 70 ? 'Strong match 🎉' : score >= 45 ? 'Moderate match' : 'Needs improvement'}
            </div>
            <div className="bars" style={{ width: '100%', marginTop: 8 }}>
              <div className="bar-row">
                <div className="bar-meta"><span>Skills matched</span><span>{matchedSkills.length}/{matchedSkills.length + missingSkills.length}</span></div>
                <div className="bar-track">
                  <div className="bar-fill bar-green" style={{ width: `${matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1) * 100}%` }} />
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-meta"><span>Overall ATS score</span><span>{score}%</span></div>
                <div className="bar-track">
                  <div className="bar-fill bar-amber" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="skills-panel">
            <div>
              <h3><span style={{ color: 'var(--green)' }}>✓</span> Matched skills</h3>
              {matchedSkills.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--muted)' }}>No skills matched — try adding a job description.</p>
                : <div className="tags">{matchedSkills.map(s => <span key={s} className="tag tag-green">{s}</span>)}</div>
              }
            </div>
            <div>
              <h3><span style={{ color: '#E24B4A' }}>✕</span> Missing skills</h3>
              {missingSkills.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--muted)' }}>All key skills found!</p>
                : <div className="tags">{missingSkills.map(s => <span key={s} className="tag tag-red">{s}</span>)}</div>
              }
            </div>
          </div>
        </div>

        {/* Row 2: Overall feedback */}
        {overallFeedback && (
          <div className="feedback-card" style={{ marginBottom: 16 }}>
            <h3>Overall assessment</h3>
            <div className="feedback-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="fi-icon fi-blue" style={{ fontSize: 18 }}>🤖</div>
              <div className="fi-text">{overallFeedback}</div>
            </div>
          </div>
        )}

        {/* Row 3: Strengths + Improvements side by side */}
        {(strengths.length > 0 || improvements.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {strengths.length > 0 && (
              <div className="feedback-card" style={{ marginBottom: 0 }}>
                <h3>✅ Strengths</h3>
                {strengths.map((s, i) => (
                  <div key={i} className="feedback-item">
                    <div className="fi-icon fi-green" style={{ fontSize: 13 }}>✓</div>
                    <div className="fi-text">{s}</div>
                  </div>
                ))}
              </div>
            )}
            {improvements.length > 0 && (
              <div className="feedback-card" style={{ marginBottom: 0 }}>
                <h3>💡 Improvements</h3>
                {improvements.map((imp, i) => (
                  <div key={i} className="feedback-item">
                    <div className="fi-icon fi-amber" style={{ fontSize: 13 }}>!</div>
                    <div className="fi-text">{imp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Row 4: AI Rewritten Summary */}
        {rewrittenSummary && (
          <div className="feedback-card" style={{ marginBottom: 16 }}>
            <h3>✨ AI-rewritten professional summary</h3>
            <div style={{
              marginTop: 12,
              padding: '14px 16px',
              background: 'var(--green-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              color: 'var(--green-dark)',
              lineHeight: 1.7,
              borderLeft: '3px solid var(--green)',
            }}>
              {rewrittenSummary}
            </div>
            <button
              className="btn btn-outline"
              style={{ marginTop: 12, fontSize: 13, padding: '7px 16px' }}
              onClick={() => navigator.clipboard.writeText(rewrittenSummary)}
            >
              Copy to clipboard
            </button>
          </div>
        )}

        <div className="result-actions">
          <button className="btn btn-green" style={{ flex: 1, padding: 12 }}
            onClick={() => window.print()}>
            Download report
          </button>
          <button className="btn btn-outline" style={{ flex: 1, padding: 12 }}
            onClick={() => navigate('/dashboard')}>
            Analyze another
          </button>
        </div>
      </div>
    </>
  )
}
