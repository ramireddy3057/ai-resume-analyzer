import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragover, setDragover] = useState(false)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Please upload a PDF file only.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload your resume first.'); return }
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jd)
      const res = await axios.post('http://localhost:5000/analyze-resume', formData)
      navigate('/result', { state: { result: res.data, fileName: file.name } })
    } catch {
      setError('Analysis failed. Make sure your backend server is running on port 5000.')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Upload your resume and an optional job description to get your ATS match score.</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Resumes analyzed</div>
            <div className="stat-value">4</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best score</div>
            <div className="stat-value">82%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg. score</div>
            <div className="stat-value">67%</div>
          </div>
        </div>

        {/* Upload zone */}
        <div
          className={`upload-zone ${file ? 'has-file' : ''} ${dragover ? 'dragover' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">{file ? '✅' : '📄'}</div>
          {file ? (
            <>
              <h3>Resume ready</h3>
              <p className="file-name">{file.name}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Click to replace</p>
            </>
          ) : (
            <>
              <h3>Drop your resume here</h3>
              <p>or <span className="link">click to browse</span> &nbsp;·&nbsp; PDF only &nbsp;·&nbsp; Max 5 MB</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Job description */}
        <div className="section-card">
          <label>Job description (optional but recommended)</label>
          <textarea
            placeholder="Paste the full job description here to get a tailored match score and skill gap analysis…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>

        {error && <p className="form-error" style={{ marginBottom: 14 }}>{error}</p>}

        {loading && (
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        )}

        <button
          className="btn btn-green btn-full btn-lg"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing your resume…' : '✨  Analyze resume'}
        </button>
      </div>
    </>
  )
}



// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard Page</h1>

//       <p>Your resumes will appear here.</p>
//     </div>
//   );
// }

// export default Dashboard;