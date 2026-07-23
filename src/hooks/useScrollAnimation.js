import { useEffect, useRef, useCallback } from 'react'

export function useScrollAnimation(stagger = 0) {
  const observerRef = useRef(null)

  const observeElements = useCallback((selectorOrElements, className = 'visible') => {
    const elements = typeof selectorOrElements === 'string'
      ? document.querySelectorAll(selectorOrElements)
      : selectorOrElements

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = Array.from(elements)
            const delay = stagger > 0 ? els.indexOf(entry.target) * stagger : 0
            setTimeout(() => {
              entry.target.classList.add(className)
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    observerRef.current = observer

    return () => observer.disconnect()
  }, [stagger])

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  return observeElements
}
