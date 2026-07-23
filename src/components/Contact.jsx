import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact({ config }) {
  const formRef = useRef(null)
  const [state, setState] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = () => {
    const errs = {}
    if (!state.name.trim()) errs.name = 'Please enter your name'
    if (!state.email.trim()) errs.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errs.email = 'Please enter a valid email'
    if (!state.subject.trim()) errs.subject = 'Please enter a subject'
    if (!state.message.trim()) errs.message = 'Please enter a message'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('success')
        setState({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      })
      .catch(() => {
        setStatus('idle')
        alert('Failed to send message. Please try again later.')
      })
  }

  const handleChange = (field) => (e) => {
    setState((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Get In Touch</h2>
      <p className="section-subtitle">Have a project in mind? I'd love to hear from you.</p>
      <div className="contact-grid">
         <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="form-name">Name</label>
            <input type="text" id="form-name" name="from_name" className={`form-input${errors.name ? ' error' : ''}`} placeholder="Your name" value={state.name} onChange={handleChange('name')} />
            {errors.name && <div className="form-error visible">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="form-email">Email</label>
            <input type="email" id="form-email" name="reply_to" className={`form-input${errors.email ? ' error' : ''}`} placeholder="your@email.com" value={state.email} onChange={handleChange('email')} />
            {errors.email && <div className="form-error visible">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="form-subject">Subject</label>
            <input type="text" id="form-subject" name="subject" className={`form-input${errors.subject ? ' error' : ''}`} placeholder="What's this about?" value={state.subject} onChange={handleChange('subject')} />
            {errors.subject && <div className="form-error visible">{errors.subject}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="form-message">Message</label>
            <textarea id="form-message" name="message" className={`form-input${errors.message ? ' error' : ''}`} placeholder="Your message..." value={state.message} onChange={handleChange('message')} />
            {errors.message && <div className="form-error visible">{errors.message}</div>}
          </div>
          <button type="submit" className={`form-submit${status === 'loading' ? ' loading' : ''}${status === 'success' ? ' success' : ''}`} disabled={status !== 'idle'}>
            <span className="spinner" />
            <span className="btn-text">{status === 'success' ? 'Message Sent ✓' : 'Send Message'}</span>
          </button>
        </form>
        <div className="contact-info">
          <div className="contact-info-item">
            <div className="contact-info-icon">✉</div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">{config.email}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-info-icon">📞</div>
            <div>
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">{config.phone}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-info-icon">📍</div>
            <div>
              <div className="contact-info-label">Location</div>
              <div className="contact-info-value">{config.location}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
