import { useState, useEffect, useRef } from 'react'
import ProjectModal from './ProjectModal'

const colors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
]

export default function Projects({ projects }) {
  const [selected, setSelected] = useState(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = grid.querySelectorAll('.project-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Array.from(cards).indexOf(entry.target) * 80
            setTimeout(() => entry.target.classList.add('visible'), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [projects])

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>
      <p className="section-subtitle">A selection of projects I've built.</p>
      <div className="projects-grid" ref={gridRef}>
        {projects.map((proj, i) => (
          <div
            key={i}
            className="project-card"
            style={{ transitionDelay: `${i * 0.08}s` }}
            onClick={() => setSelected(proj)}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(proj)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${proj.title}`}
          >
            <div className="project-banner" style={{ background: colors[i % colors.length] }}>
              {proj.image ? <img src={proj.image} alt={proj.title} /> : '📁'}
            </div>
            <div className="project-body">
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.description}</p>
              <div className="project-tech">
                {proj.tech.map((t) => (
                  <span key={t} className="project-tech-tag">{t}</span>
                ))}
              </div>
              <div className="project-actions">
                <a href={proj.github} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>View Source →</a>
                <a href={proj.live} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Live Demo →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
