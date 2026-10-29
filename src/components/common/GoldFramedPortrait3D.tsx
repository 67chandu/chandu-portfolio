import { useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface GoldFramedPortrait3DProps {
  imageSrc?: string
  videoSrcMp4?: string
  videoSrcWebm?: string
  name?: string
}

/**
 * Luxury 3D Gold-Framed Portrait with Graphical 3D Hand-Waving Video on Hover
 * - Resting State: Stylized 3D CGI portrait with golden signature and lighting
 * - Hover / Touch State: Seamlessly transitions into a 3D animated video of Chandu waving hello!
 * - Floating "Hello! 👋 I'm Chandu" speech pill
 * - Cursor-driven 3D perspective tilt and metallic glare sweep
 */
export function GoldFramedPortrait3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  videoSrcMp4 = '/chandu-waving.mp4',
  videoSrcWebm = '/chandu-waving.webm',
  name = 'Chandu Challa',
}: GoldFramedPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Control video playback on hover
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isHovered) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play policy handled silently (muted)
        })
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered])

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
    if (!isHovered) setIsHovered(true)

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    setTilt({
      rotateX: -normY * 14,
      rotateY: normX * 16,
    })

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Gentle default cinematic 3D pose
    setTilt({ rotateX: 4, rotateY: -6 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovered(true)
    handleTouchMove(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5))
    const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5))

    setTilt({
      rotateX: -normY * 16,
      rotateY: normX * 18,
    })

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    })
  }

  const handleTouchEnd = () => {
    // Keep waving briefly on mobile touch
    setTimeout(() => {
      setIsHovered(false)
      setTilt({ rotateX: 4, rotateY: -6 })
      setGlarePos((prev) => ({ ...prev, opacity: 0 }))
    }, 2500)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: '1200px' }}
      className="relative w-full max-w-[340px] min-[400px]:max-w-[380px] sm:max-w-[440px] aspect-[4/5] mx-auto flex items-center justify-center select-none py-4 cursor-pointer group"
    >
      {/* 1. Warm Golden Back-Aura Spotlight */}
      <div
        className={`absolute -inset-6 rounded-3xl pointer-events-none transition-opacity duration-500 z-0 ${
          isHovered ? 'opacity-85' : 'opacity-60'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.16) 50%, transparent 75%)',
          filter: 'blur(35px)',
        }}
      />

      {/* 2. Floating Golden Micro Dust Particles */}
      <div className="absolute -top-3 -right-3 pointer-events-none z-20">
        <Sparkles className={`w-5 h-5 text-amber-300 transition-transform duration-300 ${isHovered ? 'scale-125 animate-spin' : 'animate-pulse'}`} />
      </div>

      {/* 3. Tilted 3D Beveled Picture Frame */}
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.02 : 1.0,
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 220, damping: 22 },
          rotateY: { type: 'spring', stiffness: 220, damping: 22 },
          scale: { type: 'spring', stiffness: 300, damping: 25 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] transition-shadow duration-300"
      >
        {/* Outer Inset Shadow & Dark Bevel Recess */}
        <div className="w-full h-full rounded-[14px] p-2 sm:p-2.5 bg-[#0d0e12] border border-amber-500/40 relative overflow-hidden">
          {/* Inner Secondary Thin Gold Mat Border */}
          <div className="w-full h-full rounded-lg p-[2px] bg-gradient-to-tr from-amber-600/60 via-amber-300/80 to-amber-500/60 relative overflow-hidden">
            {/* Portrait & Video Container */}
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-black relative">
              {/* RESTING STATE: 3D CGI Portrait */}
              <img
                src={imageSrc}
                alt={name}
                className={`w-full h-full object-cover object-top transition-all duration-500 ease-out ${
                  isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                }`}
              />

              {/* HOVER STATE: 3D Animated Graphical Hand-Waving Video */}
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload="auto"
                poster="/chandu-waving-poster.jpg"
                className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ease-out ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
                }`}
              >
                <source src={videoSrcWebm} type="video/webm" />
                <source src={videoSrcMp4} type="video/mp4" />
              </video>

              {/* Dynamic Mouse Glare Sweep */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
                style={{
                  opacity: glarePos.opacity,
                  background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 80%)`,
                }}
              />

              {/* Ambient Vignette & Bottom Shadow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 35%, transparent 60%)',
                }}
              />

              {/* Floating Hello Gesture Speech Bubble (Appears on Hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className="absolute top-3.5 left-3.5 z-30 pointer-events-none"
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-amber-400/50 backdrop-blur-md shadow-[0_4px_20px_rgba(245,158,11,0.35)] font-mono text-[11px] text-amber-200">
                      <span className="text-sm animate-bounce inline-block">👋</span>
                      <span className="font-semibold tracking-wide">Hello! I&apos;m Chandu</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Status Pill (Hover indicator) */}
              <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-400/30 backdrop-blur-md font-mono text-[9px] text-amber-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{isHovered ? 'WAVING HELLO 👋' : 'HOVER TO WAVE HELLO'}</span>
              </div>

              {/* Elegant Gold Cursive Signature in Bottom Right Corner */}
              <div className="absolute bottom-3 right-4 z-20 pointer-events-none select-none text-right">
                <span className="font-signature text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.8)] tracking-wide">
                  Chandu
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
