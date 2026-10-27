import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ExternalLink, ArrowUpRight, Lock } from 'lucide-react'
import { usePortfolio } from '../../context'
import { navItems } from '../../data/navItems'
import { Magnetic } from '../ui/Magnetic'

export function Navbar() {
  const { data, setIsAdminOpen } = usePortfolio()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('#hero')

  const naukriUrl = data.contact?.naukriUrl || 'https://www.naukri.com/mnjuser/profile'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      const sections = ['hero', 'about', 'skills', 'projects', 'education', 'contact']
      for (const sectionId of [...sections].reverse()) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(`#${sectionId}`)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06070a]/90 backdrop-blur-xl border-b border-amber-500/10 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Brand Monogram: CHANDU. with Gold Accent (Magnetic) */}
        <Magnetic strength={0.25} radius={80}>
          <a
            href="#hero"
            aria-label="Chandu Challa — Return to top"
            className="group inline-flex items-center gap-1 text-lg sm:text-xl font-display font-extrabold tracking-widest text-white select-none outline-none cursor-pointer"
          >
            <span className="group-hover:text-amber-200 transition-colors">CHANDU</span>
            <span className="text-amber-400 group-hover:scale-125 transition-transform inline-block">.</span>
          </a>
        </Magnetic>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/40 border border-slate-800/80 p-1.5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveSection(item.href)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition ${
                  isActive ? 'text-amber-200 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-amber-500/15 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </div>

        {/* Desktop Action Buttons: Let's Talk + Naukri Profile (GSAP Magnetic) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Naukri Profile Button */}
          <Magnetic strength={0.25} radius={70}>
            <a
              href={naukriUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Chandu Challa's Naukri Profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-800/90 text-slate-300 hover:text-amber-200 text-xs font-medium transition-all group cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
              <span>Naukri</span>
              <ExternalLink className="w-3 h-3 text-amber-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Magnetic>

          {/* Let's Talk Button */}
          <Magnetic strength={0.3} radius={80}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] active:scale-95 cursor-pointer"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Magnetic>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-300 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu with Staggered Entrance */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden border-b border-amber-500/20 bg-[#06070a]/95 backdrop-blur-2xl px-5 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.href
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => {
                      setActiveSection(item.href)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition min-h-[44px] ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </motion.a>
                )
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <a
                href={naukriUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white min-h-[44px]"
              >
                <span>Naukri Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-xs font-semibold text-amber-200 min-h-[44px]"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsAdminOpen(true)
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-amber-300 transition cursor-pointer min-h-[40px]"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Studio</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
