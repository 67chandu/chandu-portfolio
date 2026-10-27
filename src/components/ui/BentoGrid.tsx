import { useState, useRef } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { BorderBeam } from './BorderBeam'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children?: ReactNode
  className?: string
  badge?: string
  title?: string
  description?: string
  icon?: ReactNode
  href?: string
  cta?: string
  hasBorderBeam?: boolean
  glowColor?: 'gold' | 'cyan' | 'purple' | 'emerald'
}

/**
 * BentoCard
 * Signature component from 21st.dev & tasteskill.dev:
 * Obsidian glass bento container with cursor-following spotlight glow,
 * corner HUD micro-accents, optional BorderBeam, and interactive hover elevation.
 */
export function BentoCard({
  children,
  className = '',
  badge,
  title,
  description,
  icon,
  href,
  cta = 'Explore Details',
  hasBorderBeam = false,
  glowColor = 'gold',
}: BentoCardProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 })

  const glowRgba =
    glowColor === 'cyan'
      ? 'rgba(56, 189, 248, 0.2)'
      : glowColor === 'purple'
      ? 'rgba(168, 85, 247, 0.2)'
      : glowColor === 'emerald'
      ? 'rgba(16, 185, 129, 0.2)'
      : 'rgba(245, 158, 11, 0.22)'

  const beamColorFrom =
    glowColor === 'cyan'
      ? '#7dd3fc'
      : glowColor === 'purple'
      ? '#c084fc'
      : glowColor === 'emerald'
      ? '#6ee7b7'
      : '#fef08a'

  const beamColorTo =
    glowColor === 'cyan'
      ? '#0284c7'
      : glowColor === 'purple'
      ? '#7e22ce'
      : glowColor === 'emerald'
      ? '#047857'
      : '#f59e0b'

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={prefersReducedMotion ? {} : { y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group relative rounded-3xl bg-[#090b11]/90 hover:bg-[#0c0f17] border border-slate-800/80 hover:border-amber-400/50 p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] hover:shadow-[0_16px_50px_rgba(245,158,11,0.18)] overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* 21st.dev Orbiting Border Beam */}
      {hasBorderBeam && (
        <BorderBeam
          duration={8}
          colorFrom={beamColorFrom}
          colorTo={beamColorTo}
          colorGlow={glowRgba}
          rx={24}
        />
      )}

      {/* ThreeUI Corner HUD Accents */}
      <span className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono text-slate-700 group-hover:text-amber-400/70 transition-colors">
        ⌜
      </span>
      <span className="pointer-events-none absolute top-3 right-3 text-[9px] font-mono text-slate-700 group-hover:text-amber-400/70 transition-colors">
        ⌝
      </span>
      <span className="pointer-events-none absolute bottom-3 left-3 text-[9px] font-mono text-slate-700 group-hover:text-amber-400/70 transition-colors">
        ⌞
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 text-[9px] font-mono text-slate-700 group-hover:text-amber-400/70 transition-colors">
        ⌟
      </span>

      {/* Top Ambient Radiant Streak */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 group-hover:via-amber-400/90 to-transparent transition-all duration-500 pointer-events-none" />

      {/* Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${glowRgba}, transparent 65%)`,
        }}
      />

      {/* Top Content Area */}
      <div className="relative z-10 space-y-4">
        {(badge || icon) && (
          <div className="flex items-center justify-between gap-3">
            {icon && (
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-amber-400 group-hover:scale-110 group-hover:border-amber-400/40 transition-all shadow-sm">
                {icon}
              </div>
            )}
            {badge && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 font-mono text-[10px] uppercase tracking-wider text-amber-300 font-semibold">
                {badge}
              </span>
            )}
          </div>
        )}

        {title && (
          <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-amber-200 transition-colors tracking-tight">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Footer CTA Link */}
      {href && (
        <div className="relative z-10 pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <a
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 hover:text-white transition-colors group/link cursor-pointer"
          >
            <span>{cta}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      )}
    </motion.div>
  )
}

