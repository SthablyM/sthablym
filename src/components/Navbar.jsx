import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        STHABLYM<span>.</span>
      </a>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#poster-studio" onClick={() => setMenuOpen(false)}>Poster Studio</a>
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Our Work</a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="nav-contact">
          Let's Talk
        </a>
      </div>
    </nav>
  )
}

export default Navbar
