import { useState, useEffect } from 'react'
import CONFIG from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Certifications from './components/Certifications'
import GitHubSection from './components/GitHubSection'
import Connect from './components/Connect'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ResumeViewer from './components/ResumeViewer'
import AIAnalysis from './components/AIAnalysis'

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false)

  // Scroll progress bar
  useEffect(() => {
    const bar = document.createElement('div')
    bar.id = 'scroll-progress'
    document.body.prepend(bar)

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      bar.remove()
    }
  }, [])

  return (
    <>
      <AIAnalysis />

      <div
        id="portfolio"
        className="portfolio visible"
        role="main"
      >
        <Navbar />
        <main id="main">
          <Hero config={CONFIG} />
          <About config={CONFIG} />
          <Skills skills={CONFIG.skills} />
          <Projects projects={CONFIG.projects} />
          <Experience experience={CONFIG.experience} />
          <Education education={CONFIG.education} />
          <Certifications certifications={CONFIG.certifications} />
          <GitHubSection username={CONFIG.github} />
          <Connect config={CONFIG} />
          <Contact config={CONFIG} />
        </main>
        <Footer />
      </div>

      <ResumeViewer
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        resumeUrl={CONFIG.resumeUrl}
      />
    </>
  )
}
