
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <section id="home" className="hero">
          <p>YOUR DIGITAL PARTNER</p>
          <h1>We help businesses <span>stand out.</span></h1>
          <p className="hero-description">
            Websites, creative designs and digital solutions
            that make running your business easier.
          </p>
        </section>
      </main>
    </>
  )
}

export default App
