import { useEffect, useRef } from 'react'

export default function Education({ education }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !education) return

    const cards = grid.querySelectorAll('.edu-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target)
            setTimeout(() => entry.target.classList.add('visible'), idx * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [education])

  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>
      <div className="edu-grid" ref={gridRef}>
        {education?.map((edu, i) => (
          <div key={i} className="edu-card" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="edu-icon">🎓</div>
            <div className="edu-info">
              <div className="edu-period">{edu.period}</div>
              <div className="edu-degree">{edu.degree}</div>
              <div className="edu-institution">
                {edu.institution}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
              </div>
              {edu.highlights?.length > 0 && (
                <div className="edu-highlights">
                  {edu.highlights.map((h, j) => <span key={j} className="edu-highlight-tag">{h}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
