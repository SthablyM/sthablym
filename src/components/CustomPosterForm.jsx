
import { useState } from 'react'
import './CustomPosterForm.css'

function CustomPosterForm() {
  const [files, setFiles] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="custom-poster-form" className="custom-poster-section">

      <div className="custom-poster-heading">
        <p className="poster-label">LET'S CREATE SOMETHING</p>
        <h2>Request a <span>custom design.</span></h2>
        <p>
          Tell us about your business and the design you have
          in mind. We'll use your details to understand your
          requirements.
        </p>
      </div>

      <form className="poster-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="customerName">Your name *</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">WhatsApp number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 071 234 5678"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="businessName">Business name *</label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            placeholder="Your business name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Business category *</label>
            <select id="category" name="category" required defaultValue="">
              <option value="" disabled>Select category</option>
              <option>Beauty & Salon</option>
              <option>Food & Catering</option>
              <option>Events & Decorations</option>
              <option>Fashion & Clothing</option>
              <option>Retail & Online Store</option>
              <option>Cleaning Services</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="designType">Design required *</label>
            <select id="designType" name="designType" required defaultValue="">
              <option value="" disabled>Select design</option>
              <option>Promotional poster</option>
              <option>Business flyer</option>
              <option>Price list</option>
              <option>Menu design</option>
              <option>Event invitation</option>
              <option>Social media graphics</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="colours">Preferred colours</label>
          <input
            id="colours"
            name="colours"
            type="text"
            placeholder="e.g. Navy, white and gold"
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Tell us about your design *</label>
          <textarea
            id="requirements"
            name="requirements"
            rows="6"
            placeholder="Describe your poster, wording, prices, contact details and any special requirements..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="references">Upload your logo or reference images</label>
          <div className="upload-area">
            <input
              id="references"
              name="references"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                setFiles(Array.from(event.target.files || []))
              }}
            />
            <p>Choose your images or business logo.</p>
            <span>PNG, JPG or other image formats</span>
          </div>

          {files.length > 0 && (
            <p className="file-list">
              {files.map((file, index) => (
                <span key={`${file.name}-${index}`}>
                  {file.name}
                </span>
              ))}
            </p>
          )}
        </div>

        <button type="submit" className="poster-submit">
          Submit design request ↗
        </button>

        {submitted && (
          <p className="form-notice" role="status">
            Your form is ready. Online submission will be
            activated once we connect the backend.
          </p>
        )}

        <p className="form-disclaimer">
          Submitting this form does not make a payment or
          confirm an order.
        </p>

      </form>
    </section>
  )
}

export default CustomPosterForm
