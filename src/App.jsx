import Navbar from './components/Navbar'
import Services from './components/Services'
import PosterStudio from './components/PosterStudio'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO SECTION */}
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

        {/* SERVICES SECTION */}
        <Services />
        <PosterStudio />

      </main>
    </>
  )
}

export default App
