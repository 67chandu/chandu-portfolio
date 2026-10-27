import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-50 h-[3px] pointer-events-none overflow-hidden bg-slate-900/40 backdrop-blur-sm"
    >
      {/* Primary Glowing Gradient Progress Beam */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-full w-full bg-gradient-to-r from-[#fef08a] via-[#f59e0b] to-[#b45309] shadow-[0_0_14px_rgba(245,158,11,0.85)]"
      />

      {/* Leading Edge Sparkle */}
      <motion.div
        style={{ left: useSpring(scrollYProgress, { stiffness: 280, damping: 30 }) }}
        className="absolute top-0 w-8 h-full bg-white/60 blur-[2px] pointer-events-none -translate-x-full"
      />
    </div>
  )
}

