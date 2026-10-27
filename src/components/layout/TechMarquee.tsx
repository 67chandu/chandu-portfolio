import { motion, useReducedMotion } from 'motion/react'
import {
  Sparkles,
  Cpu,
  Brain,
  Layers,
  Code2,
  ScanEye,
  AudioWaveform,
  Terminal,
} from 'lucide-react'

const TECH_PILLS = [
  { name: 'COMPUTER VISION (YOLOV8)', icon: ScanEye, glow: 'text-cyan-400' },
  { name: 'DEEP LEARNING NEURAL MODELS', icon: Brain, glow: 'text-amber-400' },
  { name: 'NLP TOXIC SPAN EXTRACTION', icon: Terminal, glow: 'text-purple-400' },
  { name: 'AUDIO MFCC SPECTRUM ANALYSIS', icon: AudioWaveform, glow: 'text-emerald-400' },
  { name: 'PYTORCH & TENSORFLOW', icon: Cpu, glow: 'text-amber-300' },
  { name: 'REACT 19 & TYPESCRIPT', icon: Code2, glow: 'text-sky-400' },
  { name: 'FULL-STACK INTELLIGENT SYSTEMS', icon: Layers, glow: 'text-indigo-400' },
  { name: 'MALLA REDDY UNIVERSITY // 2025', icon: Sparkles, glow: 'text-amber-400' },
]

/**
 * TechMarquee
 * Inspired by GSAP.com & 21st.dev:
 * Fluid kinetic scrolling marquee with edge gradient fade masks,
 * interactive pause-on-hover, glowing tech pills, and seamless infinite looping.
 */
export function TechMarquee() {
  const prefersReducedMotion = Boolean(useReducedMotion())

  return (
    <div
      className="relative py-4 bg-[#08090e] border-y border-amber-500/15 overflow-hidden select-none group"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={prefersReducedMotion ? {} : { x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center gap-6 whitespace-nowrap w-max group-hover:[animation-play-state:paused]"
      >
        {[...TECH_PILLS, ...TECH_PILLS].map((pill, idx) => {
          const Icon = pill.icon
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-amber-400/50 transition-all font-mono text-xs tracking-wider text-slate-300 hover:text-white cursor-default shadow-sm backdrop-blur-md"
            >
              <Icon className={`w-3.5 h-3.5 ${pill.glow} shrink-0`} />
              <span className="font-medium uppercase">{pill.name}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
