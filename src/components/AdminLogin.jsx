
import { useState } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import './AdminLogin.css'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.')
      }

      onLogin(data.username)

    } catch (error) {
      setError(error.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-brand">
          STHABLYM<span>.</span>
        </div>

        <div className="admin-login-icon">
          <LockKeyhole size={27} />
        </div>

        <p className="admin-login-label">
          PRIVATE ADMINISTRATION
        </p>

        <h1>Welcome back.</h1>

        <p className="admin-login-description">
          Sign in to access your STHABLYM management dashboard.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="admin-username">
            Username
          </label>

          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in securely'}
          </button>

        </form>

        <div className="admin-login-security">
          <ShieldCheck size={17} />
          <span>Secure administrator access</span>
        </div>

        <p className="admin-login-footer">
          STHABLYM MANAGEMENT
        </p>

      </div>
    </main>
  )
}

export default AdminLogin
