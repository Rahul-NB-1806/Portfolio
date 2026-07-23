import { useEffect, useRef } from 'react'

export default function Experience({ experience }) {
  const timelineRef = useRef(null)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || !experience) return

    const items = timeline.querySelectorAll('.timeline-item')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add('visible')
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 150)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(timeline)
    return () => observer.disconnect()
  }, [experience])

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>
      <div className="timeline" ref={timelineRef}>
        {experience?.map((exp, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-period">{exp.period}</div>
            <div className="timeline-role">{exp.role}</div>
            <div className="timeline-company">{exp.company}</div>
            <ul className="timeline-highlights">
              {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
