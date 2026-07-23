import { useEffect, useRef } from 'react'

const categories = ['Frontend', 'Languages', 'Tools']

export default function Skills({ skills }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const cards = el.querySelectorAll('.skill-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target)
            setTimeout(() => entry.target.classList.add('visible'), idx * 40)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [skills])

  const grouped = {}
  skills.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = []
    grouped[s.category].push(s)
  })

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">Technologies I work with daily.</p>
      {categories.map((cat) =>
        grouped[cat] ? (
          <div key={cat} className="skills-category">
            <div className="skills-category-label">{cat}</div>
            <div className="skills-grid">
              {grouped[cat].map((skill) => (
                <div key={skill.name} className="skill-card">
                  <div className="skill-icon">{skill.icon}</div>
                  <div className="skill-name">{skill.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </section>
  )
}
