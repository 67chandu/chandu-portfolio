import { useState } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { BorderBeam } from './BorderBeam'

interface MotionCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'gold' | 'cyan' | 'indigo' | 'emerald'
  tiltStrength?: number
  hasBorderBeam?: boolean
}

/**
 * MotionCard
 * Inspired by 21st.dev & tasteskill.dev:
 * Deep obsidian glass surface with interactive cursor-reactive spotlight,
 * 3D gyroscopic spring tilt, top edge radiant accent, and optional 21st.dev BorderBeam.
 */
export function MotionCard({
  children,
  className = '',
  glowColor = 'gold',
  tiltStrength = 6,
  hasBorderBeam = false,
}: MotionCardProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  const glowRgba =
    glowColor === 'emerald'
      ? 'rgba(16, 185, 129, 0.22)'
      : glowColor === 'indigo'
      ? 'rgba(129, 140, 248, 0.22)'
      : glowColor === 'cyan'
      ? 'rgba(56, 189, 248, 0.22)'
      : 'rgba(245, 158, 11, 0.24)'

  const beamColorFrom =
    glowColor === 'emerald'
      ? '#6ee7b7'
      : glowColor === 'cyan'
      ? '#7dd3fc'
      : glowColor === 'indigo'
      ? '#a5b4fc'
      : '#fef08a'

  const beamColorTo =
    glowColor === 'emerald'
      ? '#10b981'
      : glowColor === 'cyan'
      ? '#0284c7'
      : glowColor === 'indigo'
      ? '#6366f1'
      : '#f59e0b'

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top

    setSpotlight({ x: localX, y: localY, opacity: 1 })

    if (!prefersReducedMotion && tiltStrength > 0) {
      const normX = localX / rect.width - 0.5
      const normY = localY / rect.height - 0.5
      setTilt({
        rotateX: -normY * tiltStrength,
        rotateY: normX * tiltStrength,
      })
    }
  }

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      whileHover={prefersReducedMotion ? {} : { y: -5 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
      transition={{
        rotateX: { type: 'spring', stiffness: 220, damping: 20 },
        rotateY: { type: 'spring', stiffness: 220, damping: 20 },
        y: { duration: 0.2 },
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-3xl bg-slate-950/80 hover:bg-slate-900/90 border border-slate-800/80 hover:border-amber-400/60 p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] hover:shadow-[0_16px_50px_rgba(245,158,11,0.2)] overflow-hidden ${className}`}
    >
      {/* 21st.dev Border Beam */}
      {hasBorderBeam && (
        <BorderBeam
          duration={8}
          colorFrom={beamColorFrom}
          colorTo={beamColorTo}
          colorGlow={glowRgba}
          rx={24}
        />
      )}

      {/* Aceternity / ThreeUI Ambient Top Accent Streak */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 group-hover:via-amber-400/90 to-transparent transition-all duration-500 pointer-events-none" />

      {/* 21st.dev Cursor-Following Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(460px circle at ${spotlight.x}px ${spotlight.y}px, ${glowRgba}, transparent 65%)`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </motion.div>
  )
}

interface SectionHeaderProps {
  badgeNumber: string
  badgeLabel: string
  title: string
  subtitle?: string
  icon: ReactNode
}

export function SectionHeader({
  badgeNumber,
  badgeLabel,
  title,
  subtitle,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="space-y-4 mb-12 sm:mb-16">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)]">
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
          {badgeNumber}
        </span>
        <span className="w-1 h-1 rounded-full bg-amber-400/60" />
        <span className="flex items-center gap-1.5">
          {icon}
          {badgeLabel}
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight text-white drop-shadow-sm">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export const AnimatedSectionHeader = SectionHeader

