import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { usePortfolio } from '../../context'
import { Magnetic } from '../ui/Magnetic'

export function FloatingWhatsApp() {
  const { data } = usePortfolio()
  const { contact, profileData } = data

  const rawPhone = contact?.phone || profileData.phone || '+91 9059169996'
  // Clean phone to only digits (e.g. 919059169996)
  const cleanPhone = rawPhone.replace(/\D/g, '') || '919059169996'

  const messageText = encodeURIComponent(
    'Hi Chandu, I came across your portfolio and would like to connect!'
  )
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${messageText}`

  const [isVisible, setIsVisible] = useState(false)

  // Reveal after subtle delay on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 select-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]">
      <Magnetic strength={0.32} radius={95}>
        {/* Main Glassmorphic Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Chat with Chandu Challa"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="group relative flex items-center justify-center gap-2.5 p-3 sm:px-5 sm:py-3.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/35 hover:border-emerald-400 text-white backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px]"
        >
          {/* Soft Ambient Radial Glow behind the button */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-500/25 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* WhatsApp Official Vector SVG Icon */}
          <span className="relative z-10 w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0">
            <svg
              className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>

          {/* Text Label */}
          <span className="relative z-10 font-mono text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors tracking-wide hidden sm:inline">
            WhatsApp
          </span>

          {/* Active Online Pulse Dot */}
          <span className="relative z-10 flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </motion.a>
      </Magnetic>
    </div>
  )
}

