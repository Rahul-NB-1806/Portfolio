import { useState, useEffect, useRef, useCallback } from 'react'

export function useTypingEffect(roles, { typingSpeed = 80, deletingSpeed = 30, pauseAfter = 2000, pauseBeforeDelete = 400 } = {}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const roleIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const timeoutRef = useRef(null)

  const tick = useCallback(() => {
    const currentRole = roles[roleIndexRef.current]
    if (!currentRole) return

    if (!isDeleting) {
      charIndexRef.current++
      setDisplayedText(currentRole.substring(0, charIndexRef.current))
      if (charIndexRef.current === currentRole.length) {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true)
        }, pauseAfter)
        return
      }
      timeoutRef.current = setTimeout(tick, typingSpeed)
    } else {
      charIndexRef.current--
      setDisplayedText(currentRole.substring(0, charIndexRef.current))
      if (charIndexRef.current === 0) {
        setIsDeleting(false)
        roleIndexRef.current = (roleIndexRef.current + 1) % roles.length
        timeoutRef.current = setTimeout(tick, pauseBeforeDelete)
        return
      }
      timeoutRef.current = setTimeout(tick, deletingSpeed)
    }
  }, [roles, isDeleting, typingSpeed, deletingSpeed, pauseAfter, pauseBeforeDelete])

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, 600)
    return () => clearTimeout(timeoutRef.current)
  }, [tick])

  return displayedText
}
