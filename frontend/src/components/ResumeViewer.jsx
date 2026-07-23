import { useEffect, useRef, useState } from 'react'

export default function ResumeViewer({ isOpen, onClose, resumeUrl }) {
  const overlayRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => overlayRef.current?.classList.add('active'))
      setLoading(true)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = 'Rahul_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div className="resume-viewer" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}>
      <div className="resume-viewer-content">
        <div className="resume-viewer-header">
          <div className="resume-viewer-header-left">
            <span className="resume-viewer-title">Resume.pdf</span>
          </div>
          <div className="resume-viewer-actions">
            <button className="resume-download-btn" onClick={handleDownload}>Download</button>
            <button className="resume-viewer-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="resume-frame">
          {loading && (
            <div className="resume-frame-loading">
              <div className="spinner" />
              <span>Opening resume...</span>
            </div>
          )}
          <iframe
            src={resumeUrl}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px', position: 'absolute', inset: 0, zIndex: 1 }}
            title="Resume"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
