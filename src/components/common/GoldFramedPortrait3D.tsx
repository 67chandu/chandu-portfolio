import { useState, useRef, useEffect, useCallback } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface GoldFramedPortrait3DProps {
  imageSrc?: string
  wavingVideoWebm?: string
  wavingVideoMp4?: string
  wavingImageSrc?: string
  name?: string
}

/**
 * Instagram Profile 3D Avatar Card
 * - Displays high-resolution 3D CGI portrait in luxury beveled gold frame
 * - On hover / touch: Zooms out smoothly (Instagram 3D avatar pull-back)
 * - Seamlessly plays the exact 60 FPS hand-waving motion gesture video
 * - Cursor-reactive 3D tilt tracking with spring physics & holographic gold sheen
 * - Zero speech bubbles, zero text pills, zero bubbling effect
 * - Gold signature in the bottom right corner
 */
export function GoldFramedPortrait3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  wavingVideoWebm = '/chandu-waving.webm',
  wavingVideoMp4 = '/chandu-waving.mp4',
  name = 'Chandu Challa',
}: GoldFramedPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 4, rotateY: -6 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  // Handle video playback synchronization
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isHovered && !prefersReducedMotion) {
      video.play().catch(() => {
        // Autoplay may be restricted until first interaction
      })
    } else {
      // Pause after smooth fadeout
      const timer = setTimeout(() => {
        if (!isHovered && video) {
          video.pause()
          video.currentTime = 0
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isHovered, prefersReducedMotion])

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5

    // Smooth tilt: maximum +/- 10 degrees
    setTilt({
      rotateX: -normY * 16,
      rotateY: normX * 16,
    })

    // Holographic glare tracking
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 0.55,
    })
  }, [prefersReducedMotion])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ rotateX: 4, rotateY: -6 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  // Touch device toggle support
  const handleTouchStart = useCallback(() => {
    setIsHovered((prev) => !prev)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      className="relative select-none perspective-1000 cursor-pointer group"
      style={{ perspective: 1200 }}
      role="region"
      aria-label={`${name} — Interactive 3D Avatar Portrait`}
    >
      {/* Dynamic Ambient Gold Backlight Aura */}
      <motion.div
        className="absolute -inset-6 rounded-3xl pointer-events-none -z-10 blur-2xl transition-opacity duration-700"
        animate={{
          opacity: isHovered ? 0.75 : 0.35,
          scale: isHovered ? 1.05 : 0.98,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.25) 45%, transparent 75%)',
        }}
      />

      {/* Outer 3D Tilting Card Wrapper */}
      <motion.div
        className="relative rounded-2xl p-[3px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)]"
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 0.92 : 1.0, // Instagram 3D avatar profile zoom-out on hover
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
          mass: 0.8,
        }}
        style={{
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(135deg, #ffe082 0%, #d4af37 25%, #996515 50%, #d4af37 75%, #fff3b0 100%)',
        }}
      >
        {/* Frame Shadow Ridge */}
        <div className="relative rounded-[13px] p-[2px] bg-gradient-to-br from-[#0c0d12] via-[#1a1710] to-[#0a0a0d]">
          {/* Inner Beveled Inset Gold Ring */}
          <div className="relative rounded-[11px] p-[2px] bg-gradient-to-tr from-[#78590f] via-[#d4af37] to-[#ffe082]">
            {/* Dark Velvet Matting Display Canvas */}
            <div className="relative rounded-[9px] overflow-hidden bg-[#07080c] w-[280px] sm:w-[320px] md:w-[360px] aspect-[16/10]">
              {/* Layer 1: Base Resting 3D CGI Portrait */}
              <img
                src={imageSrc}
                alt={name}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 will-change-transform"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1.0)',
                }}
              />

              {/* Layer 2: 60 FPS Hand-Waving Video Motion Gesture */}
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload="auto"
                onLoadedData={() => setIsVideoReady(true)}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 will-change-opacity pointer-events-none"
                style={{
                  opacity: isHovered && isVideoReady ? 1 : 0,
                  transform: isHovered ? 'scale(1.02)' : 'scale(1.0)',
                }}
              >
                <source src={wavingVideoWebm} type="video/webm" />
                <source src={wavingVideoMp4} type="video/mp4" />
              </video>

              {/* Layer 3: Dynamic Holographic Gold Specular Glare */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-300"
                style={{
                  opacity: glarePos.opacity,
                  background: `radial-gradient(circle 220px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 236, 179, 0.45) 0%, rgba(251, 191, 36, 0.15) 40%, transparent 80%)`,
                }}
              />

              {/* Layer 4: Subtle Vignette Framing */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.65)',
                }}
              />

              {/* Layer 5: Luxury Gold Signature in Bottom Right Corner */}
              <div className="absolute bottom-2.5 right-3 pointer-events-none z-10 flex items-center gap-1 select-none">
                <span className="font-serif italic text-[11px] sm:text-xs text-amber-200/90 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Chandu
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b]" />
              </div>
            </div>
          </div>
        </div>

        {/* Four Decorative Luxury Corner Brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-200/90 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-200/90 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-200/90 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-200/90 pointer-events-none" />
      </motion.div>
    </div>
  )
}
