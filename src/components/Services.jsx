
function Services() {
  const services = [
    {
      number: '01',
      title: 'Website Development',
      description:
        'Professional websites that help your business establish an online presence and reach more customers.'
    },
    {
      number: '02',
      title: 'Creative Design',
      description:
        'Eye-catching posters, flyers, menus and social media graphics that communicate your brand.'
    },
    {
      number: '03',
      title: 'Digital Business Solutions',
      description:
        'Practical digital tools that simplify bookings, orders and everyday business operations.'
    },
    {
      number: '04',
      title: 'Branding & Identity',
      description:
        'Distinctive logos and visual identities that help your business build recognition and trust.'
    }
  ]

  return (
    <section id="services" className="services-section">
      <div className="section-heading">
        <p className="section-label">WHAT WE DO</p>
        <h2>Digital solutions for <span>business growth.</span></h2>
        <p>
          From your first website to your next marketing campaign,
          we help bring your business ideas to life.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.number}>
            <span className="service-number">{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <a href="#contact">Let's discuss ↗</a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
