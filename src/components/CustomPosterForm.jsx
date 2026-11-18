
import { useEffect, useState } from 'react'
import './CustomPosterForm.css'

function CustomPosterForm({ selectedDesign }) {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState(null)

  const purchaseType = selectedDesign?.purchaseType || ''

  const price =
    purchaseType === 'Ready-made'
      ? 49
      : purchaseType === 'Personalised'
        ? 99
        : ''

  const isPersonalised = purchaseType === 'Personalised'
  const isReadyMade = purchaseType === 'Ready-made'

  useEffect(() => {
    if (selectedDesign) {
      setCategory(selectedDesign.category || '')
      setFiles([])
      setMessage('')
      setOrderId(null)
    }
  }, [selectedDesign])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedDesign || submitting) return

    setSubmitting(true)
    setMessage('')
    setOrderId(null)

    const form = event.currentTarget
    const formData = new FormData(form)

    // Add the selected poster information
    formData.set('design_title', selectedDesign.title)
    formData.set('purchase_type', purchaseType)
    formData.set('price', String(price))

    // Add the uploaded files
    files.forEach((file) => {
      formData.append('references', file)
    })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit your order.')
      }

      setOrderId(result.order_id)
      setMessage('Your order has been received successfully!')

      form.reset()
      setFiles([])
      setCategory(selectedDesign.category || '')

    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'We could not connect to STHABLYM. Please try again.'
          : error.message
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="custom-poster-form" className="custom-poster-section">

      <div className="custom-poster-heading">
        <p className="poster-label">STHABLYM POSTER STUDIO</p>

        <h2>
          Complete your <span>poster order.</span>
        </h2>

        <p>
          Provide your details below so we can prepare your
          selected poster order.
        </p>
      </div>

      <form className="poster-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="selectedDesign">Selected poster design</label>
          <input
            id="selectedDesign"
            type="text"
            value={selectedDesign?.title || 'No poster selected'}
            readOnly
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchaseType">Purchase option</label>
            <input
              id="purchaseType"
              type="text"
              value={purchaseType || 'Select an option from Poster Studio'}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="posterPrice">Poster price</label>
            <input
              id="posterPrice"
              type="text"
              value={price ? `R${price}.00` : 'Not selected'}
              readOnly
            />
          </div>
        </div>

        {!selectedDesign && (
          <p className="form-disclaimer">
            Please choose a poster and purchase option from
            the Poster Studio before completing your order.
          </p>
        )}

        <div className="form-group">
          <label htmlFor="customerName">Your name *</label>
          <input
            id="customerName"
            name="customer_name"
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

        {isPersonalised && (
          <div className="personalised-form-section">

            <div className="personalised-form-heading">
              <h3>Let's personalise your poster.</h3>
              <p>
                Tell us about your business so we can customise
                the selected design to represent your brand.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="businessName">Business name *</label>
              <input
                id="businessName"
                name="business_name"
                type="text"
                placeholder="Your business name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Business category *</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="" disabled>Select category</option>
                <option>Beauty & Salon</option>
                <option>Food & Catering</option>
                <option>Events & Decorations</option>
                <option>Fashion & Clothing</option>
                <option>Retail & Online Stores</option>
                <option>Cleaning Services</option>
                <option>Other</option>
              </select>
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
                placeholder="Provide the wording, prices, contact details and any special requirements you want included..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="references">
                Upload your logo or reference images
              </label>

              <div className="upload-area">
                <input
                  id="references"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={(event) => {
                    setFiles(Array.from(event.target.files || []))
                  }}
                />

                <p>Choose your images or business logo.</p>
                <span>PNG, JPG and WebP formats (10 MB total limit)</span>
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

          </div>
        )}

        {isReadyMade && (
          <div className="ready-made-notice">
            <h3>Your ready-made poster</h3>
            <p>
              You've selected a ready-made digital poster.
              No customisation details are required.
              Your poster will be delivered to your email
              after payment and order processing.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="poster-submit"
          disabled={!selectedDesign || submitting}
        >
          {submitting ? 'Submitting order...' : 'Submit poster order ↗'}
        </button>

        {message && (
          <div className="form-notice" role="status">
            <p>{message}</p>

            {orderId && (
              <strong>Your order reference: STB-{orderId}</strong>
            )}
          </div>
        )}

        <p className="form-disclaimer">
          Submitting an order does not confirm payment.
          Your order will initially be recorded as Pending.
          Payment and digital delivery will be connected separately.
        </p>

      </form>
    </section>
  )
}

export default CustomPosterForm
