
import { useState } from 'react'
import './Portfolio.css'

const categories = [
  'All work',
  'Websites',
  'Online stores',
  'Branding',
  'Creative design'
]

const projects = [
  {
    id: 1,
    title: 'Business Websites',
    category: 'Websites',
    description: 'Professional websites for growing businesses.',
    number: '01'
  },
  {
    id: 2,
    title: 'Online Stores',
    category: 'Online stores',
    description: 'Digital storefronts that make selling online easier.',
    number: '02'
  },
  {
    id: 3,
    title: 'Brand Identity',
    category: 'Branding',
    description: 'Visual identities that help businesses stand out.',
    number: '03'
  },
  {
    id: 4,
    title: 'Promotional Designs',
    category: 'Creative design',
    description: 'Posters and marketing designs for your business.',
    number: '04'
  }
]

function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All work')

  const filteredProjects =
    activeCategory === 'All work'
      ? projects
      : projects.filter(
          (project) => project.category === activeCategory
        )

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-heading">
        <p className="section-label">OUR WORK</p>

        <h2>
          Ideas brought to <span>life.</span>
        </h2>

        <p>
          A look at the digital experiences and creative
          solutions we offer to businesses.
        </p>
      </div>

      <div className="portfolio-filters" aria-label="Filter portfolio projects">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              activeCategory === category
                ? 'portfolio-filter active'
                : 'portfolio-filter'
            }
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredProjects.map((project) => (
          <article className="portfolio-card" key={project.id}>
            <div className="portfolio-placeholder">
              <span className="portfolio-number">
                {project.number}
              </span>

              <div className="portfolio-placeholder-content">
                <span>STHABLYM</span>
                <p>PROJECT PREVIEW</p>
              </div>
            </div>

            <div className="portfolio-card-info">
              <div>
                <p className="portfolio-category">
                  {project.category}
                </p>

                <h3>{project.title}</h3>

                <p className="portfolio-description">
                  {project.description}
                </p>
              </div>

              <span className="portfolio-coming-soon">
                Coming soon
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Portfolio