import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowUpRight,
  FileDown,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Cpu,
  Layers,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { staggerContainerVariant, fadeUpVariant } from '../../utils/animations'
import { Magnetic } from '../ui/Magnetic'
import { KineticHeading } from '../ui/KineticHeading'

export function HeroSection() {
  const { data } = usePortfolio()
  const { contact, resume, profileData } = data
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [videoLoaded, setVideoLoaded] = useState(false)
  const naukriUrl = contact?.naukriUrl || 'https://www.naukri.com/mnjuser/profile'
  const lastActiveRef = useRef<number>(0)

  // Interactive mouse & touch tracking for 3D tilt, spotlight shift & liquid gold specular sheen
  const [mousePos, setMousePos] = useState({
    normX: 0,
    normY: 0,
    sheenX: 45,
    sheenY: 50,
  })

  // Continuous subtle ambient drift when idle (animates automatically on mobile devices)
  useEffect(() => {
    if (prefersReducedMotion) return
    let frameId: number
    let t = 0
    const tick = () => {
      t += 0.02
      // Only drift if user hasn't touched or moved recently
      if (Date.now() - lastActiveRef.current > 1200) {
        setMousePos({
          normX: Math.sin(t * 0.7) * 0.12,
          normY: Math.cos(t * 0.5) * 0.12,
          sheenX: Math.round(45 + Math.sin(t * 0.8) * 22),
          sheenY: Math.round(50 + Math.cos(t * 0.6) * 18),
        })
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [prefersReducedMotion])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return
    lastActiveRef.current = Date.now()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normX = (x / rect.width) * 2 - 1
    const normY = (y / rect.height) * 2 - 1

    setMousePos({
      normX,
      normY,
      sheenX: Math.round((x / rect.width) * 100),
      sheenY: Math.round((y / rect.height) * 100),
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (prefersReducedMotion || !e.touches[0]) return
    lastActiveRef.current = Date.now()
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1))
    const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1))

    setMousePos({
      normX,
      normY,
      sheenX: Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100))),
      sheenY: Math.round(Math.max(0, Math.min(100, (y / rect.height) * 100))),
    })
  }

  const handleMouseLeave = () => {
    lastActiveRef.current = Date.now()
    setMousePos({
      normX: 0,
      normY: 0,
      sheenX: 45,
      sheenY: 50,
    })
  }

  return (
    <section
      id="hero"
      aria-label="Introduction & Studio Stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-studio-ash select-none"
    >
      {/* =========================================================================
          SEAMLESS STUDIO ASH VIDEO LAYER — 100% BLENDED WITH ZERO HARD SEAMS
          Positioned in the 3rd quarter of the page with feathered cyclorama lighting
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <video
          src="/hero-walking.mp4"
          poster="/chandu-3d-portrait.jpg"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-[75%_center] sm:object-[75%_center] md:object-[75%_center] lg:object-[75%_center] xl:object-[75%_center]"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.85) 45%, black 70%), linear-gradient(to bottom, black 80%, rgba(0,0,0,0.5) 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.85) 45%, black 70%), linear-gradient(to bottom, black 80%, rgba(0,0,0,0.5) 90%, transparent 100%)',
          }}
        />

        {/* Fallback image while video buffers */}
        {!videoLoaded && (
          <img
            src="/chandu-3d-portrait.jpg"
            alt="Chandu Challa"
            className="absolute inset-0 w-full h-full object-cover object-[75%_top] opacity-30"
          />
        )}

        {/* Dynamic Studio Spotlight Beam (Parallax shifts smoothly with cursor) */}
        <div
          className="absolute -top-20 right-6 sm:right-16 lg:right-24 w-[500px] sm:w-[650px] h-[900px] pointer-events-none opacity-50 z-0 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mousePos.normX * 24}px, ${mousePos.normY * 18}px, 0)`,
            background:
              'radial-gradient(ellipse 65% 85% at 50% 20%, rgba(251, 191, 36, 0.32) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 75%)',
            filter: 'blur(65px)',
          }}
        />

        {/* Aceternity Overhead Stage Lamp Spotlight (Illuminating the walking motion & smoke plumes) */}
        <div
          className="absolute top-0 right-8 sm:right-20 lg:right-32 w-[420px] sm:w-[560px] h-[380px] pointer-events-none opacity-55 mix-blend-screen"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(254, 240, 138, 0.65) 0%, rgba(245, 158, 11, 0.3) 45%, transparent 75%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Left-Side Studio Ash Ambient Scrim: Blends seamlessly with zero hard seams & sharp mobile contrast */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[60%] lg:w-[48%] bg-gradient-to-r from-[#22242c]/85 via-[#2d3038]/50 to-transparent sm:from-[#22242c]/65 sm:via-[#2d3038]/35 pointer-events-none z-0" />

        {/* Top Navbar Studio Blend */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#22242c]/75 via-[#2d3038]/30 to-transparent pointer-events-none z-0" />

        {/* Bottom Studio Floor Blend into TechMarquee & Dark Canvas */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#06070a] via-[#06070a]/75 to-transparent pointer-events-none z-0" />
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT LAYER (Interactive 3D Tilt, Sheen & Spring Physics)
          ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto pt-28 sm:pt-32 pb-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Typography & Narrative Column */}
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-7 w-full max-w-2xl lg:max-w-3xl space-y-6 text-left relative z-10"
          >
            {/* 21st.dev & ThreeUI Live System Telemetry & Brand Row */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.18)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="tracking-wider uppercase font-semibold">AVAILABLE FOR HIRE</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">2025 GRADUATE</span>
              </div>

              <span className="hidden sm:inline-block w-6 h-[1px] bg-slate-700/60" />

              <span className="font-mono text-xs uppercase tracking-[0.28em] text-slate-300/80 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                CHANDU CHALLA<span className="text-amber-400">.</span>
              </span>
            </motion.div>

            {/* GSAP & Tasteskill.dev Kinetic Typography Headline */}
            <motion.div
              variants={fadeUpVariant}
              animate={{
                rotateX: prefersReducedMotion ? 0 : -mousePos.normY * 6,
                rotateY: prefersReducedMotion ? 0 : mousePos.normX * 7,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={{ perspective: 1000 }}
            >
              <KineticHeading
                line1={profileData?.heroTitleLine1 || 'I BUILD'}
                line2={profileData?.heroTitleLine2 || 'DIGITAL'}
                line3={profileData?.heroTitleLine3 || 'EXPERIENCES'}
                sheenX={mousePos.sheenX}
                sheenY={mousePos.sheenY}
              />
            </motion.div>

            {/* Interactive Magnetic Role Badges (21st.dev tactile spring float) */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-2 pt-0.5">
              {(profileData?.heroBadges || [
                'FULL STACK ARCHITECTURE',
                'AI & COMPUTER VISION',
                'DATA SCIENCE & ML',
              ]).map((title, idx) => {
                const icons = [Cpu, Sparkles, Layers]
                const Icon = icons[idx % icons.length]
                return (
                  <Magnetic key={title} strength={0.22} radius={70}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-amber-500/15 border border-slate-700/60 hover:border-amber-400/50 text-[11px] font-mono uppercase tracking-wider text-slate-300 hover:text-amber-200 transition-all cursor-default shadow-sm backdrop-blur-md"
                    >
                      <Icon className="w-3 h-3 text-amber-400/90 group-hover:scale-115 transition-transform" />
                      <span>{title}</span>
                    </motion.div>
                  </Magnetic>
                )
              })}
            </motion.div>

            {/* Narrative Matter */}
            <motion.p
              variants={fadeUpVariant}
              className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg lg:max-w-xl font-normal break-words"
            >
              {profileData?.heroNarrative ||
                'I build intelligent digital experiences and production-ready machine learning systems. Where modern full-stack software engineering meets computer vision, NLP, and applied AI.'}
            </motion.p>

            {/* Master Action Buttons: GSAP Magnetic Spring Pills */}
            <motion.div
              variants={fadeUpVariant}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {/* Action 1: Explore Work (Aceternity Gold Shimmer Pill with GSAP Magnetic Tracking) */}
              <Magnetic strength={0.28} radius={110}>
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative overflow-hidden group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/25 via-amber-400/35 to-yellow-500/25 hover:from-amber-400/40 hover:to-yellow-400/40 border border-amber-400/60 hover:border-amber-300 text-amber-100 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] cursor-pointer"
                >
                  {/* Aceternity Traveling Light Shimmer */}
                  <motion.div
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-12 bg-white/25 skew-x-12 pointer-events-none"
                  />
                  <span className="relative z-10 font-semibold">Explore My Work</span>
                  <ArrowUpRight className="relative z-10 w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>
              </Magnetic>

              {/* Action 2: Download Resume (GSAP Magnetic Frosted Glass Pill) */}
              <Magnetic strength={0.25} radius={100}>
                <motion.a
                  href={resume?.pdfUrl || '#resume'}
                  download={resume?.pdfUrl ? 'Chandu_Challa_Resume.pdf' : undefined}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-slate-200 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-300 transition-colors" />
                  <span>Download Resume</span>
                </motion.a>
              </Magnetic>

              {/* Action 3: Naukri Profile (GSAP Magnetic Monospace Pill) */}
              <Magnetic strength={0.25} radius={100}>
                <motion.a
                  href={naukriUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="View Chandu Challa's Naukri Profile"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-transparent hover:bg-white/[0.05] border border-white/15 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/90 animate-pulse" />
                  <span>Naukri</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-300 transition-colors" />
                </motion.a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* RIGHT: Empty Column for the Walking Person Stage */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none select-none h-full" />
        </div>
      </div>

      {/* Floating Gold Signature in the Bottom Right Corner (Never Overlaps the Man) */}
      <div className="hidden lg:block absolute bottom-14 right-8 sm:right-12 lg:right-16 z-20 pointer-events-none select-none text-right">
        <span className="font-signature text-4xl sm:text-5xl text-amber-300/90 drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)]">
          Chandu
        </span>
      </div>

      {/* Elegant Scroll Down Transition Cue to About Section (GSAP Magnetic) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="relative z-10 pb-6 text-center flex flex-col items-center justify-center select-none"
      >
        <Magnetic strength={0.3} radius={90}>
          <a
            href="#about"
            aria-label="Scroll down to About section and 3D Avatar"
            className="group inline-flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-300">
              Scroll Down
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-amber-400/80" />
          </a>
        </Magnetic>
      </motion.div>
    </section>
  )
}
