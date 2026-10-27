import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Butter-smooth momentum inertia scroll engine.
 * Replaces default choppy scroll ticks with fluid exponential damping (Lenis-style physics).
 * Preserves native scroll events, anchor jumping, and respects accessibility preferences.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const isScrollingRef = useRef(false)
  const targetYRef = useRef(0)
  const currentYRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    // Detect touch-only mobile devices to preserve native gesture inertia
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice && window.innerWidth < 768) {
      return
    }

    currentYRef.current = window.scrollY
    targetYRef.current = window.scrollY

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const updateScroll = () => {
      const diff = targetYRef.current - currentYRef.current

      if (Math.abs(diff) > 0.4) {
        currentYRef.current = lerp(currentYRef.current, targetYRef.current, 0.085)
        window.scrollTo({
          top: Math.round(currentYRef.current),
          behavior: 'instant' as ScrollBehavior,
        })
        rafIdRef.current = requestAnimationFrame(updateScroll)
      } else {
        currentYRef.current = targetYRef.current
        window.scrollTo({
          top: targetYRef.current,
          behavior: 'instant' as ScrollBehavior,
        })
        isScrollingRef.current = false
        rafIdRef.current = null
      }
    }

    const onWheel = (e: WheelEvent) => {
      // Do not intercept if inside an overflowing modal or textarea
      const target = e.target as HTMLElement | null
      if (
        target?.closest('[data-lenis-prevent]') ||
        target?.closest('textarea') ||
        target?.closest('.overflow-y-auto')
      ) {
        return
      }

      e.preventDefault()

      // Normalize wheel delta across mouse wheels and trackpads
      const delta =
        e.deltaMode === 1
          ? e.deltaY * 32 // Line mode (Firefox)
          : e.deltaMode === 2
          ? e.deltaY * window.innerHeight // Page mode
          : e.deltaY

      // Smooth delta scaling with dampening
      const scaledDelta = delta * 1.15
      targetYRef.current = Math.max(
        0,
        Math.min(targetYRef.current + scaledDelta, maxScroll())
      )

      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        rafIdRef.current = requestAnimationFrame(updateScroll)
      }
    }

    // Keep target synchronized when user drags native scrollbar or presses keys
    const onScroll = () => {
      if (!isScrollingRef.current) {
        currentYRef.current = window.scrollY
        targetYRef.current = window.scrollY
      }
    }

    // Intercept internal anchor link clicks (#projects, #about, etc.)
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href)
        if (targetElement) {
          e.preventDefault()
          const rect = targetElement.getBoundingClientRect()
          const headerOffset = 80
          const destination = Math.max(
            0,
            Math.min(
              window.scrollY + rect.top - headerOffset,
              maxScroll()
            )
          )
          targetYRef.current = destination

          if (!isScrollingRef.current) {
            isScrollingRef.current = true
            rafIdRef.current = requestAnimationFrame(updateScroll)
          }
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onAnchorClick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onAnchorClick)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}

