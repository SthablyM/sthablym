
import './PosterStudio.css'

function PosterStudio() {
  return (
    <section id="poster-studio" className="poster-studio">

      <div className="poster-heading">
        <p className="poster-label">STHABLYM CREATIVE STUDIO</p>

        <h2>
          Your business.
          <span> Your message.</span>
          Our creativity.
        </h2>

        <p>
          Professional promotional designs that help your
          business communicate, connect and stand out.
        </p>
      </div>

      <div className="poster-intro">
        <div>
          <h3>Designed with purpose.</h3>
          <p>
            From promotional posters to custom business designs,
            we create visuals that reflect your brand and speak
            to your customers.
          </p>
        </div>

        <a href="#contact" className="poster-button">
          Request a custom design ↗
        </a>
      </div>

      <div className="poster-categories">

        <article className="poster-category">
          <div className="poster-placeholder">
            <span>01</span>
            <p>YOUR DESIGN<br />GOES HERE</p>
          </div>
          <h3>Beauty & Lifestyle</h3>
          <p>Salon promotions, beauty services and price lists.</p>
        </article>

        <article className="poster-category">
          <div className="poster-placeholder">
            <span>02</span>
            <p>YOUR DESIGN<br />GOES HERE</p>
          </div>
          <h3>Food & Catering</h3>
          <p>Menus, catering promotions and food advertisements.</p>
        </article>

        <article className="poster-category">
          <div className="poster-placeholder">
            <span>03</span>
            <p>YOUR DESIGN<br />GOES HERE</p>
          </div>
          <h3>Events & Decorations</h3>
          <p>Event invitations, packages and promotional designs.</p>
        </article>

      </div>

      <div className="poster-bottom">
        <h3>Have something specific in mind?</h3>
        <p>
          Tell us about your business and let's create
          something that represents your brand.
        </p>
        <a href="#contact">Start your design request ↗</a>
      </div>

    </section>
  )
}

export default PosterStudio
