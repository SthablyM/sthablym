
import { useState } from 'react'
import './PosterStudio.css'

const categories = [
  'All designs',
  'Beauty & Salon',
  'Food & Catering',
  'Events & Decorations',
  'Fashion & Clothing',
  'Retail & Online Stores'
]

const designs = [
  {
    id: 1,
    number: '01',
    title: 'Beauty Promotion',
    category: 'Beauty & Salon',
    description: 'Promote salon treatments, beauty services and special offers.'
  },
  {
    id: 2,
    number: '02',
    title: 'Salon Price List',
    category: 'Beauty & Salon',
    description: 'Display your beauty services and prices professionally.'
  },
  {
    id: 3,
    number: '03',
    title: 'Catering Promotion',
    category: 'Food & Catering',
    description: 'Advertise catering services, platters and food specials.'
  },
  {
    id: 4,
    number: '04',
    title: 'Event Invitation',
    category: 'Events & Decorations',
    description: 'Share the details of your special event in style.'
  },
  {
    id: 5,
    number: '05',
    title: 'Fashion Promotion',
    category: 'Fashion & Clothing',
    description: 'Promote clothing collections, sales and new arrivals.'
  },
  {
    id: 6,
    number: '06',
    title: 'Online Store Promotion',
    category: 'Retail & Online Stores',
    description: 'Showcase products and special offers for online shoppers.'
  }
]

function PosterStudio({ onSelectDesign }) {
  const [activeCategory, setActiveCategory] = useState('All designs')

  const handleDesignSelection = (design, purchaseType) => {
    onSelectDesign({
      ...design,
      purchaseType
    })
  }

  const filteredDesigns =
    activeCategory === 'All designs'
      ? designs
      : designs.filter(
          (design) => design.category === activeCategory
        )

  return (
    <section id="poster-studio" className="poster-studio">

      {/* POSTER STUDIO INTRO */}
      <div className="poster-heading">
        <p className="poster-label">STHABLYM CREATIVE STUDIO</p>

        <h2>
          Your business.
          <span> Your message.</span>
          Our creativity.
        </h2>

        <p>
          Explore promotional design ideas for your business.
          Choose a design style or request something created
          specifically for your brand.
        </p>
      </div>

      {/* INTRODUCTION */}
      <div className="poster-intro">
        <div>
          <h3>Designed with purpose.</h3>

          <p>
            From promotional posters to custom business designs,
            we create visuals that reflect your brand and speak
            to your customers.
          </p>
        </div>

        <a href="#custom-poster-form" className="poster-button">
          Request a custom design ↗
        </a>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="poster-filter-area">
        <h3>Explore our designs</h3>

        <div className="poster-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? 'poster-filter active'
                  : 'poster-filter'
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* POSTER DESIGN GALLERY */}
      <div className="poster-categories">
        {filteredDesigns.map((design) => (
          <article className="poster-category" key={design.id}>

            <div className={`poster-placeholder poster-design-${design.id}`}>
              <span className="poster-design-number">
                {design.number}
              </span>

              <div className="poster-design-preview">
                <span>STHABLYM</span>
                <h4>{design.title}</h4>
                <p>YOUR BRAND. YOUR MESSAGE.</p>
              </div>
            </div>

            <div className="poster-card-info">
              <p className="poster-card-category">
                {design.category}
              </p>

              <h3>{design.title}</h3>

              <p>{design.description}</p>

              {/* PURCHASE OPTIONS */}
              <div className="poster-purchase-options">
                <a
                  href="#custom-poster-form"
                  onClick={() =>
                    handleDesignSelection(design, 'Ready-made')
                  }
                >
                  Buy ready-made — R49 ↗
                </a>

                <a
                  href="#custom-poster-form"
                  onClick={() =>
                    handleDesignSelection(design, 'Personalised')
                  }
                >
                  Personalise — R99 ↗
                </a>
              </div>
            </div>

          </article>
        ))}
      </div>

      {/* CUSTOM DESIGN CTA */}
      <div className="poster-bottom">
        <h3>Have something specific in mind?</h3>

        <p>
          Tell us about your business, your preferred colours
          and the design you need. We'll work with you to create
          something that represents your brand.
        </p>

        <a href="#custom-poster-form">
          Start your design request ↗
        </a>
      </div>

    </section>
  )
}

export default PosterStudio
