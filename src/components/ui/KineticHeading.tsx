import { motion, useReducedMotion } from 'motion/react'

interface KineticHeadingProps {
  line1: string
  line2: string
  line3: string
  sheenX?: number
  sheenY?: number
  className?: string
}

/**
 * KineticHeading
 * Inspired by GSAP.com & tasteskill.dev:
 * High-craft kinetic typography with word-level spring dynamics,
 * tactile hover elasticity, and iridescent gold metallic specular sheen.
 */
export function KineticHeading({
  line1,
  line2,
  line3,
  sheenX = 50,
  sheenY = 50,
  className = '',
}: KineticHeadingProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())

  const lines = [
    { text: line1, delay: 0.1, hoverX: 6 },
    { text: line2, delay: 0.2, hoverX: 9 },
    { text: line3, delay: 0.3, hoverX: 12 },
  ]

  return (
    <div className={`space-y-1 select-none cursor-default font-display font-normal uppercase leading-[0.94] tracking-[0.02em] ${className}`}>
      {lines.map((line, idx) => (
        <motion.div
          key={line.text}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 35, skewY: 2.5 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, skewY: 0 }}
          transition={{
            duration: 0.75,
            delay: line.delay,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="overflow-hidden"
        >
          <motion.span
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    x: line.hoverX,
                    scale: 1.015,
                  }
            }
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`block text-3xl min-[380px]:text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-transparent bg-clip-text transition-all duration-150 ${
              idx === 2 ? 'drop-shadow-[0_4px_30px_rgba(245,158,11,0.45)]' : 'drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]'
            }`}
            style={{
              backgroundImage: `radial-gradient(circle 460px at ${sheenX}% ${sheenY}%, #ffffff 0%, #fef08a 22%, #f59e0b 58%, #b45309 96%)`,
            }}
          >
            {line.text}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

