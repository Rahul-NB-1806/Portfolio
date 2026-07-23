export default function About({ config }) {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About</h2>
      <p className="about-text">{config.aboutMe}</p>
    </section>
  )
}
