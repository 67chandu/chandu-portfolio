import { useState } from 'react'
import { motion } from 'motion/react'

interface PersonalLogoProps {
  compact?: boolean
  className?: string
}

export function PersonalLogo({ compact = false, className = '' }: PersonalLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href="#hero"
      aria-label="Chandu Challa — Return to Homepage"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex items-center gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070a] rounded-2xl ${className}`}
    >
      {/* 3D Geometric Gold Monogram Badge */}
      <motion.div
        animate={
          isHovered
            ? {
                rotateY: 15,
                rotateX: -10,
                scale: 1.05,
                boxShadow: '0 12px 30px -4px rgba(245, 158, 11, 0.45)',
              }
            : {
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                boxShadow: '0 8px 20px -6px rgba(245, 158, 11, 0.25)',
              }
        }
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] p-[1.5px] border border-amber-500/40 shadow-lg shadow-amber-500/15 overflow-hidden"
      >
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-yellow-500/10 to-amber-600/25 opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Dynamic Light Sweep Highlight */}
        <motion.div
          animate={
            isHovered
              ? { x: ['-100%', '200%'] }
              : { x: '-100%' }
          }
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
        />

        {/* Monogram SVG Interior */}
        <div className="relative w-full h-full rounded-[14px] bg-[#0d0e12]/95 backdrop-blur-md flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]"
          >
            {/* Outer Geometric C */}
            <path
              d="M23 11 C15 11 11 15 11 20 C11 25 15 29 23 29 C25 29 27 28 28.5 27"
              stroke="url(#cc-gold-grad)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Inner Interlocking C */}
            <path
              d="M29 14 C27.5 13 25.5 12.5 23.5 12.5 C18 12.5 14.5 16 14.5 20 C14.5 24 18 27.5 23.5 27.5 C26 27.5 28 26.5 29.5 25"
              stroke="url(#cc-gold-inner)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            {/* Cybernetic Accent Node */}
            <circle cx="28.5" cy="14" r="1.6" fill="#fef08a" />
            <circle cx="28.5" cy="27" r="1.6" fill="#f59e0b" />

            <defs>
              <linearGradient id="cc-gold-grad" x1="11" y1="11" x2="29" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.5" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="cc-gold-inner" x1="14" y1="12" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fcd34d" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Typography Wordmark */}
      {!compact && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-0.5 font-heading font-bold text-base sm:text-lg tracking-wider uppercase text-white group-hover:text-amber-200 transition-colors leading-tight">
            <span>Chandu Challa</span>
            <span className="text-amber-400 group-hover:scale-125 transition-transform inline-block">.</span>
          </div>
          <span className="font-mono text-[10px] text-amber-300/90 font-medium tracking-wider uppercase">
            CSE • AI &amp; ML Engineer
          </span>
        </div>
      )}
    </a>
  )
}
