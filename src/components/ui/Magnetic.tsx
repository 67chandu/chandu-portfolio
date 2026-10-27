import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { motion, useSpring, useReducedMotion } from 'motion/react'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  disabled?: boolean
}

/**
 * Magnetic
 * Inspired by GSAP.com & 21st.dev:
 * Fluid magnetic physics that draws interactive elements (buttons, badges, icons)
 * towards the pointer with weighted spring momentum and snaps back cleanly on release.
 */
export function Magnetic({
  children,
  className = '',
  strength = 0.35,
  radius = 120,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())
  const [isHovered, setIsHovered] = useState(false)

  // Weighted GSAP-style spring physics
  const springConfig = { stiffness: 220, damping: 18, mass: 0.2 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.hypot(deltaX, deltaY)

    if (distance < radius) {
      if (!isHovered) setIsHovered(true)
      x.set(deltaX * strength)
      y.set(deltaY * strength)
    } else {
      if (isHovered) setIsHovered(false)
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  if (disabled || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}

