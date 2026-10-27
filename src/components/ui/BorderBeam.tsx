import { motion, useReducedMotion } from 'motion/react'

interface BorderBeamProps {
  className?: string
  duration?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  colorGlow?: string
  rx?: number
}

/**
 * BorderBeam
 * Signature component from 21st.dev:
 * A luminous ray of high-tech light that orbits the perimeter of obsidian glass cards.
 * Implemented with 100% cross-browser SVG pathLength physics for flawless mobile and desktop rendering.
 */
export function BorderBeam({
  className = '',
  duration = 7,
  borderWidth = 1.75,
  colorFrom = '#fef08a',
  colorTo = '#f59e0b',
  colorGlow = 'rgba(245, 158, 11, 0.65)',
  rx = 24,
}: BorderBeamProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}
    >
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="60%" stopColor={colorTo} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
          <filter id="beam-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbiting beam path */}
        <motion.rect
          x={borderWidth}
          y={borderWidth}
          width={`calc(100% - ${borderWidth * 2}px)`}
          height={`calc(100% - ${borderWidth * 2}px)`}
          rx={rx}
          ry={rx}
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth={borderWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="22 78"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{
            repeat: Infinity,
            duration,
            ease: 'linear',
          }}
          style={{
            filter: `drop-shadow(0 0 6px ${colorGlow})`,
          }}
        />
      </svg>
    </div>
  )
}

