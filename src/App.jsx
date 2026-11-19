
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import PosterStudio from './components/PosterStudio'
import CustomPosterForm from './components/CustomPosterForm'
import BusinessEnquiryForm from './components/BusinessEnquiryForm'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'

import './App.css'

function App() {
  const [selectedDesign, setSelectedDesign] = useState(null)

  const [adminUser, setAdminUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const handleAdminLogout = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/admin/logout',
      {
        method: 'POST',
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Could not log out. Please try again.')
    }

    setAdminUser(null)

  } catch (error) {
    alert(error.message)
  }
}

  const isAdminRoute =
    window.location.pathname.replace(/\/+$/, '') === '/admin'

  // Check whether an administrator is already logged in
  useEffect(() => {
    if (!isAdminRoute) {
      setCheckingSession(false)
      return
    }

    const checkAdminSession = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/admin/me',
          {
            credentials: 'include'
          }
        )

        const data = await response.json()

        if (response.ok && data.authenticated) {
          setAdminUser(data.username)
        }
      } catch (error) {
        console.error('Could not verify admin session:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkAdminSession()
  }, [isAdminRoute])

  // Admin login screen and dashboard
  if (isAdminRoute) {

    if (checkingSession) {
      return (
        <div className="admin-loading">
          Checking administrator access...
        </div>
      )
    }

    if (!adminUser) {
      return (
        <AdminLogin
          onLogin={(username) => setAdminUser(username)}
        />
      )
    }

    return <AdminDashboard onLogout={handleAdminLogout} />
  }

  // Normal public website
  return (
    <>
      <Navbar />

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="hero-label">YOUR DIGITAL PARTNER</p>

            <h1>
              We help businesses
              <span> stand out.</span>
            </h1>

            <p className="hero-description">
              Websites, creative designs and digital solutions
              that make running your business easier.
            </p>

            <div className="hero-actions">
              <a href="#services" className="primary-button">
                Explore our services ↗
              </a>

              <a href="#portfolio" className="text-button">
                View our work
              </a>
            </div>
          </div>
        </section>

        <Services />

        <Portfolio />

        <PosterStudio onSelectDesign={setSelectedDesign} />

        <CustomPosterForm selectedDesign={selectedDesign} />

        <BusinessEnquiryForm />
      </main>
    </>
  )
}

export default App
