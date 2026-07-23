import { useEffect, useRef } from 'react'

export default function Certifications({ certifications }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !certifications) return

    const cards = grid.querySelectorAll('.cert-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target)
            setTimeout(() => entry.target.classList.add('visible'), idx * 60)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [certifications])

  return (
    <section id="certifications" className="section">
      <h2 className="section-title">Certifications</h2>
      <div className="cert-grid" ref={gridRef}>
        {certifications?.map((cert, i) => (
          <div key={i} className="cert-card" style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="cert-icon">🏅</div>
            <div className="cert-name">{cert.name}</div>
            <div className="cert-issuer">{cert.issuer}</div>
            <div className="cert-year">{cert.year}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
