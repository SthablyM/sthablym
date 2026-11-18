import { useState } from 'react'
import './BusinessEnquiryForm.css'

function BusinessEnquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="business-enquiry-section">

      <div className="business-enquiry-heading">
        <p className="section-label">LET'S WORK TOGETHER</p>

        <h2>
          Tell us about your
          <span> business idea.</span>
        </h2>

        <p>
          Looking for a website, branding or a digital solution?
          Tell us what you need and let's explore how we can help.
        </p>
      </div>

      <form className="business-enquiry-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="businessCustomerName">Your name *</label>
          <input
            id="businessCustomerName"
            name="customerName"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="businessEmail">Email address *</label>
            <input
              id="businessEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessPhone">WhatsApp number *</label>
            <input
              id="businessPhone"
              name="phone"
              type="tel"
              placeholder="071 234 5678"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            placeholder="Enter your business name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessService">What service do you need? *</label>
          <select
            id="businessService"
            name="service"
            defaultValue=""
            required
          >
            <option value="" disabled>Select a service</option>
            <option>Business website</option>
            <option>Online store website</option>
            <option>Booking website</option>
            <option>Portfolio website</option>
            <option>Branding and logo design</option>
            <option>Digital business solution</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="businessRequirements">
            Tell us about your project *
          </label>
          <textarea
            id="businessRequirements"
            name="requirements"
            rows="6"
            placeholder="Describe your business, what you need and what you would like your website or solution to do..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessBudget">
            Estimated budget (optional)
          </label>
          <select
            id="businessBudget"
            name="budget"
            defaultValue=""
          >
            <option value="">Select your budget</option>
            <option>Below R1,000</option>
            <option>R1,000 – R3,000</option>
            <option>R3,000 – R5,000</option>
            <option>R5,000 – R10,000</option>
            <option>Above R10,000</option>
            <option>Not sure yet</option>
          </select>
        </div>

        <button type="submit" className="business-submit">
          Send project enquiry ↗
        </button>

        {submitted && (
          <p className="form-notice" role="status">
            Your enquiry form is ready. Online submission
            will be activated once we connect the backend.
          </p>
        )}

        <p className="form-disclaimer">
          Submitting this form does not confirm an order or require payment.
        </p>

      </form>
    </section>
  )
}

export default BusinessEnquiryForm
