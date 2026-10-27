import { useState, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface GoldFramedPortrait3DProps {
  imageSrc?: string
  name?: string
  title?: string
}

/**
 * Luxury 3D Gold-Framed Portrait
 * Recreates the exact picture frame aesthetic from Image 2:
 * - Double-beveled gold metallic picture frame with 3D perspective tilt
 * - Chandu's 3D CGI stylized avatar portrait
 * - Floating gold cursive signature in the bottom right corner
 * - Cursor-driven specular gleam & ambient golden spotlight glow
 */
export function GoldFramedPortrait3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  name = 'Chandu Challa',
}: GoldFramedPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
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

  const handleMouseLeave = () => {
    // Gentle default cinematic 3D pose (slight perspective angle as seen in Image 2)
    setTilt({ rotateX: 4, rotateY: -6 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ perspective: '1200px' }}
      className="relative w-full max-w-[340px] min-[400px]:max-w-[380px] sm:max-w-[440px] aspect-[4/5] mx-auto flex items-center justify-center select-none py-4"
    >
      {/* 1. Warm Golden Back-Aura Spotlight */}
      <div
        className="absolute -inset-6 rounded-3xl pointer-events-none opacity-60 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 75%)',
          filter: 'blur(35px)',
        }}
      />

      {/* 2. Floating Golden Micro Dust Particles */}
      <div className="absolute -top-3 -right-3 pointer-events-none z-20">
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
      </div>

      {/* 3. Tilted 3D Beveled Picture Frame (Exact Image 2 Replica) */}
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 220, damping: 22 },
          rotateY: { type: 'spring', stiffness: 220, damping: 22 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] transition-shadow duration-300"
      >
        {/* Outer Inset Shadow & Dark Bevel Recess */}
        <div className="w-full h-full rounded-[14px] p-2 sm:p-2.5 bg-[#0d0e12] border border-amber-500/40 relative overflow-hidden">
          {/* Inner Secondary Thin Gold Mat Border */}
          <div className="w-full h-full rounded-lg p-[2px] bg-gradient-to-tr from-amber-600/60 via-amber-300/80 to-amber-500/60 relative overflow-hidden">
            {/* The 3D CGI Portrait */}
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-black relative">
              <img
                src={imageSrc}
                alt={name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
              />

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

              {/* 4. Elegant Gold Cursive Signature in Bottom Right Corner (Exact Replica of Image 2) */}
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
