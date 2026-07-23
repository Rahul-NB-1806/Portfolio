import { useTypingEffect } from '../hooks/useTypingEffect'

export default function Hero({ config }) {
  const typedText = useTypingEffect(config.roles)

  const handleDownload = (e) => {
    e.preventDefault()
    const link = document.createElement('a')
    link.href = config.resumeUrl
    link.download = 'Rahul_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for opportunities
          </div>
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-title">
            <span className="highlight">{config.name}</span>
          </h1>
          <div className="hero-typing">
            <span>{typedText}</span><span className="cursor" />
          </div>
          <p className="hero-description">{config.aboutMe}</p>
          <div className="hero-actions">
            <a href={config.resumeUrl} download className="btn btn-primary" onClick={handleDownload}>Download Resume</a>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
            <a href={config.social.github} target="_blank" rel="noopener" className="btn-icon" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noopener" className="btn-icon" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
        <div className="hero-figure">
          <div className="hero-figure-shape" style={{ backgroundImage: 'url(/image1.jpeg)' }} />
        </div>
      </div>
    </section>
  )
}
