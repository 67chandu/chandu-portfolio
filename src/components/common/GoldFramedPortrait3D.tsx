import { useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface GoldFramedPortrait3DProps {
  imageSrc?: string
  videoMp4Src?: string
  videoWebmSrc?: string
  name?: string
}

/**
 * Photorealistic 3D Avatar Profile Card with 60 FPS Hand-Waving Motion
 * - Authentic 3D CGI Avatar matching Chandu Challa's likeness
 * - Instagram profile-style zoom-out framing and radiant open-mouth smile on hover
 * - Natural 3D hand-waving gesture beside cheek with articulated fingers & wrist kinematics
 * - 3D cursor-reactive perspective tilt with spring physics & metallic glare sweep
 * - Zero speech bubbles or text pills — pure, sleek, luxury 3D avatar aesthetic
 */
export function GoldFramedPortrait3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  videoMp4Src = '/chandu-hi-wave.mp4',
  videoWebmSrc = '/chandu-hi-wave.webm',
  name = 'Chandu Challa',
}: GoldFramedPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  // Preload and initialize video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => setIsVideoReady(true)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    }
  }, [])

  // Control playback based on hover state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isHovered) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play policy fallback (video is muted)
        })
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered])

  // =========================================================================
  // CURSOR & TOUCH INTERACTION WITH SPRING PHYSICS
  // =========================================================================
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
    if (!isHovered) setIsHovered(true)

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    setTilt({
      rotateX: -normY * 12,
      rotateY: normX * 14,
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
    setTilt({ rotateX: 4, rotateY: -6 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    setIsHovered(true)
    handleTouchMove(e)
  }

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5))
    const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5))

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

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    touchTimerRef.current = setTimeout(() => {
      setIsHovered(false)
      setTilt({ rotateX: 4, rotateY: -6 })
      setGlarePos((prev) => ({ ...prev, opacity: 0 }))
    }, 3200)
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
      aria-label={`${name} 3D Avatar Profile`}
      role="region"
      className="relative w-full max-w-[340px] min-[400px]:max-w-[380px] sm:max-w-[440px] aspect-[4/5] mx-auto flex items-center justify-center select-none py-4 cursor-pointer"
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

      {/* 2. Tilted 3D Beveled Picture Frame (Zooms out smoothly on hover like Instagram 3D avatar profile) */}
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 0.94 : 1.0, // Instagram profile spring zoom-out effect
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 220, damping: 22 },
          rotateY: { type: 'spring', stiffness: 220, damping: 22 },
          scale: { type: 'spring', stiffness: 240, damping: 22 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] transition-shadow duration-300"
      >
        {/* Outer Inset Shadow & Dark Bevel Recess */}
        <div className="w-full h-full rounded-[14px] p-2 sm:p-2.5 bg-[#0d0e12] border border-amber-500/40 relative overflow-hidden">
          {/* Inner Secondary Thin Gold Mat Border */}
          <div className="w-full h-full rounded-lg p-[2px] bg-gradient-to-tr from-amber-600/60 via-amber-300/80 to-amber-500/60 relative overflow-hidden">
            {/* The Avatar Screen Container */}
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-black relative flex items-center justify-center">
              {/* Layer A: High-Resolution Resting Portrait Image */}
              <img
                src={imageSrc}
                alt={`${name} 3D Portrait`}
                loading="eager"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-out z-10 ${
                  isHovered && isVideoReady ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Layer B: 60 FPS Photorealistic Animated 3D Avatar Video (Plays on Hover) */}
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload="auto"
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-out z-10 ${
                  isHovered && isVideoReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src={videoWebmSrc} type="video/webm" />
                <source src={videoMp4Src} type="video/mp4" />
              </video>

              {/* Dynamic Mouse Glare Sweep (Metallic Sheen) */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen z-20"
                style={{
                  opacity: glarePos.opacity,
                  background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 80%)`,
                }}
              />

              {/* Ambient Vignette & Bottom Shadow */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 35%, transparent 60%)',
                }}
              />

              {/* Elegant Gold Cursive Signature in Bottom Right Corner */}
              <div className="absolute bottom-3 right-4 z-30 pointer-events-none select-none text-right">
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
