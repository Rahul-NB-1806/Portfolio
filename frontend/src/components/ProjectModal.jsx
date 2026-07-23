import { useEffect, useRef } from 'react'

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => overlayRef.current?.classList.add('active'))
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">{project.title}</h2>
        <div className="modal-body">
          <p>{project.description}</p>
          {project.features?.length > 0 && (
            <>
              <h4>Features</h4>
              <ul>{project.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            </>
          )}
          {project.challenges?.length > 0 && (
            <>
              <h4>Challenges</h4>
              <ul>{project.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </>
          )}
          <h4>Tech Stack</h4>
          <div className="project-tech" style={{ marginTop: 8 }}>
            {project.tech.map((t) => <span key={t} className="project-tech-tag">{t}</span>)}
          </div>
          <div className="project-actions" style={{ marginTop: 16 }}>
            <a href={project.github} target="_blank" rel="noopener">Source Code →</a>
            <a href={project.live} target="_blank" rel="noopener">Live Demo →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
