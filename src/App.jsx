
import Navbar from './components/Navbar'
import Services from './components/Services'
import PosterStudio from './components/PosterStudio'
import CustomPosterForm from './components/CustomPosterForm'
import BusinessEnquiryForm from './components/BusinessEnquiryForm'
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

        {/* WEBSITE PORTFOLIO */}
        <section id="portfolio" className="portfolio-section">
          <div className="portfolio-heading">
            <p className="section-label">OUR WORK</p>

            <h2>
              Ideas brought to <span>life.</span>
            </h2>

            <p>
              Explore the digital experiences we create
              for businesses and growing brands.
            </p>
          </div>

          <div className="portfolio-empty">
            <h3>Our portfolio is growing.</h3>

            <p>
              We're preparing examples of our website
              projects. Check back soon.
            </p>
          </div>
        </section>

        {/* POSTER STUDIO */}
        <PosterStudio />

        {/* CUSTOM POSTER REQUEST FORM */}
        <CustomPosterForm />

        {/* GENERAL BUSINESS ENQUIRIES */}
        <BusinessEnquiryForm />

      </main>
    </>
  )
}

export default App
