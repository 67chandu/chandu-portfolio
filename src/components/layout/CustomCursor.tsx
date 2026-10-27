import { useEffect, useState } from 'react'
import { motion, useSpring, useReducedMotion } from 'motion/react'

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  const cursorX = useSpring(-100, { stiffness: 420, damping: 28 })
  const cursorY = useSpring(-100, { stiffness: 420, damping: 28 })

  useEffect(() => {
    if (prefersReducedMotion) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)

      const target = e.target as HTMLElement | null
      const isClickable = Boolean(
        target?.closest('a, button, input, textarea, select, [role="button"]')
      )
      setHovered(isClickable)
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [cursorX, cursorY, prefersReducedMotion, visible])

  return (
    <>
      {/* Custom Magnetic Cursor Ring (Desktop Only) */}
      {!prefersReducedMotion && visible && (
        <motion.div
          style={{
            translateX: cursorX,
            translateY: cursorY,
          }}
          animate={{
            scale: hovered ? 1.65 : 1,
            borderColor: hovered ? 'rgba(251, 191, 36, 0.85)' : 'rgba(245, 158, 11, 0.4)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="hidden lg:flex fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-amber-400/50 bg-amber-400/10 pointer-events-none z-50 items-center justify-center backdrop-blur-[1px]"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        </motion.div>
      )}
    </>
  )
}
