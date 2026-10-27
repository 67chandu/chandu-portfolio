import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * useGsapReveal
 * Hook to apply choreographed GSAP timed entry reveals to a container's children
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  selector = '.gsap-reveal',
  delay = 0.1,
  stagger = 0.08
) {
  const containerRef = useRef<T | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const targets = el.querySelectorAll(selector)
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 28,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          delay,
          stagger,
          ease: 'power3.out',
        }
      )
    }, el)

    return () => ctx.revert()
  }, [selector, delay, stagger])

  return containerRef
}

/**
 * Direct GSAP timed reveal utility for elements
 */
export function animateReveal(element: HTMLElement | null, delay = 0) {
  if (!element) return
  return gsap.fromTo(
    element,
    { opacity: 0, y: 24, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, delay, ease: 'power2.out' }
  )
}

