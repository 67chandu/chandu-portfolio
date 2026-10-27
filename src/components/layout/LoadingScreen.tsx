import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { usePortfolio } from '../../context'

export function LoadingScreen() {
  const { data } = usePortfolio()
  const prefersReducedMotion = useReducedMotion()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const duration = prefersReducedMotion ? 120 : 950
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="portfolio-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06070a] text-slate-100"
          aria-label="Loading portfolio"
        >
          {/* Ambient Warm Golden Glow */}
          <div
            className="absolute w-72 h-72 pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl border border-amber-500/40 bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent shadow-[0_0_25px_rgba(245,158,11,0.2)]"
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center font-display text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fcd34d] to-[#d97706]"
            >
              {data.profileData.initials || 'CC'}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-amber-200/90 mb-3"
          >
            {data.profileData.name}
          </motion.p>

          <div className="w-48 h-1 rounded-full bg-slate-900/90 overflow-hidden border border-amber-500/20">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#fef08a] via-[#f59e0b] to-[#b45309] shadow-[0_0_10px_rgba(245,158,11,0.6)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
