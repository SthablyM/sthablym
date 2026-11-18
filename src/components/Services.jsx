
import './Services.css'

function Services() {
  const services = [
    {
      number: '01',
      title: 'Website Development',
      description:
        'Professional websites that help your business establish an online presence and reach more customers.',
      products: [
        'Business websites',
        'Online store websites',
        'Booking and service websites',
        'Portfolio websites'
      ]
    },
    {
      number: '02',
      title: 'Creative Design',
      description:
        'Professional marketing materials that help your business promote products, services and special offers.',
      products: [
        'Promotional posters',
        'Flyers and brochures',
        'Menus and price lists',
        'Social media graphics',
        'Invitations and event designs'
      ]
    },
    {
      number: '03',
      title: 'Digital Business Solutions',
      description:
        'Practical digital tools that simplify bookings, orders and everyday business operations.',
      products: [
        'Online booking systems',
        'Customer enquiry forms',
        'Online ordering systems',
        'Custom business tools'
      ]
    },
    {
      number: '04',
      title: 'Branding & Identity',
      description:
        'Distinctive visual identities that help your business build recognition and trust.',
      products: [
        'Business logos',
        'Business cards',
        'Brand identity packages',
        'Business stationery'
      ]
    }
  ]

  return (
    <section id="services" className="services-section">
      <div className="section-heading">
        <p className="section-label">OUR SERVICES</p>

        <h2>
          Digital solutions for <span>business growth.</span>
        </h2>

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

            <ul className="service-products">
              {service.products.map((product) => (
                <li key={product}>{product}</li>
              ))}
            </ul>

            <a href="#contact">Explore service ↗</a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
