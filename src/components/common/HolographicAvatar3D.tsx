import { useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ShieldCheck, MessageSquare } from 'lucide-react'

interface HolographicAvatar3DProps {
  imageSrc?: string
  name?: string
  university?: string
  degree?: string
}

/**
 * Borderless 3D Holographic CGI Avatar
 * Renders Chandu's 3D CGI Avatar directly on the page background with ZERO boxes or card containers.
 * Integrates 3D gyroscopic coordinate rings, orbiting particles, cursor-driven specular lighting,
 * and seamless radial alpha blending into the theme.
 */
export function HolographicAvatar3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  name = 'Chandu Challa',
  university = 'Malla Reddy University',
  degree = 'B.Tech CSE (AI & ML)',
}: HolographicAvatar3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })
  const [speechIdx, setSpeechIdx] = useState(0)
  const [pulseCount, setPulseCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const quotes = [
    'Deep Learning, Computer Vision (YOLOv8) & NLP architecture design.',
    'Translating mathematical neural networks into scalable, reproducible pipelines.',
    'B.Tech CSE (AI & ML) at Malla Reddy University — Ready for entry-level engineering.',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeechIdx((prev) => (prev + 1) % quotes.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [quotes.length])

  // Mouse move handler for 3D tilt and specular lighting across glasses & suit
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setSpotlight({ x, y, opacity: 1 })

    if (!prefersReducedMotion) {
      const normX = x / rect.width - 0.5
      const normY = y / rect.height - 0.5
      setTilt({
        rotateX: -normY * 12,
        rotateY: normX * 14,
      })
    }
  }

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
    setTilt({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
  }

  // 3D Canvas Gyroscopic Orbit & Particles Engine (renders directly in free space)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Particle nodes for orbital 3D halo
    const particles = Array.from({ length: 40 }, (_, i) => ({
      phi: Math.acos(-1 + (2 * i) / 40),
      theta: Math.sqrt(40 * Math.PI) * i,
      radius: 145 + (i % 4) * 16,
      size: 1.5 + (i % 3) * 0.8,
      speed: 0.008 + (i % 3) * 0.004,
      color: i % 2 === 0 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, ',
    }))

    const render = () => {
      time += 0.02
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2 - 10

      // Draw 3D Gyroscopic Coordinate Rings in free space
      const ringSpeed = isHovered ? 0.03 : 0.014
      const drawRing = (
        rx: number,
        ry: number,
        angle: number,
        color: string,
        dashed?: number[]
      ) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        if (dashed) ctx.setLineDash(dashed)
        ctx.strokeStyle = color
        ctx.lineWidth = 1.3
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // 3 Concentric Gimbal Rings
      drawRing(170, 75, time * ringSpeed, 'rgba(6, 182, 212, 0.4)', [6, 8])
      drawRing(150, 60, -time * ringSpeed * 1.2, 'rgba(99, 102, 241, 0.35)')
      drawRing(130, 45, time * ringSpeed * 0.8 + Math.PI / 3, 'rgba(56, 189, 248, 0.38)', [3, 6])

      // Draw 3D Spherical Orbital Particles
      const fov = 350
      particles.forEach((p) => {
        const theta = p.theta + time * p.speed + (isHovered ? time * 0.02 : 0)
        const x3d = p.radius * Math.sin(p.phi) * Math.cos(theta)
        const y3d = p.radius * Math.cos(p.phi) * 0.5
        const z3d = p.radius * Math.sin(p.phi) * Math.sin(theta)

        const scale = fov / (fov + z3d)
        const projX = centerX + x3d * scale
        const projY = centerY + y3d * scale
        const alpha = Math.max(0.2, Math.min(0.9, (z3d + 160) / 320))

        ctx.fillStyle = `${p.color}${alpha})`
        ctx.beginPath()
        ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2)
        ctx.fill()
      })

      // Holographic Scan Pulse Wave on click
      if (pulseCount > 0) {
        const pulse = ((time * 4) % 3) / 3
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.7 * (1 - pulse)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, 60 + pulse * 140, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered, pulseCount, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setPulseCount((c) => c + 1)}
      style={{ perspective: '1100px' }}
      className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-[3/4] sm:aspect-[4/5] mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing text-left"
    >
      {/* 1. Volumetric Halo Lighting (Cyan & Indigo flares) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/12 blur-[110px] pointer-events-none rounded-full" />

      {/* 2. 3D Gyroscopic Coordinate Rings Canvas in Open Space */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* 3. Borderless 3D Interactive Avatar Figure */}
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 200, damping: 22 },
          rotateY: { type: 'spring', stiffness: 200, damping: 22 },
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Dynamic Specular Light Glare that follows cursor across suit & glasses */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(56, 189, 248, 0.32), transparent 68%)`,
          }}
        />

        {/* User's Exact 3D CGI Avatar Portrait with Seamless Feathered Alpha Edge Fade */}
        <img
          src={imageSrc}
          alt={`${name} — 3D CGI Avatar`}
          className="w-full h-full object-cover object-center scale-[1.03] pointer-events-auto"
          style={{
            // Seamless multi-stop radial feather: 100% borderless, melts into the page background
            maskImage:
              'radial-gradient(ellipse 72% 78% at 50% 46%, black 46%, rgba(0,0,0,0.85) 60%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 72% 78% at 50% 46%, black 46%, rgba(0,0,0,0.85) 60%, transparent 92%)',
          }}
        />

        {/* 4. Floating Holographic Telemetry Badges (NO BOXES) */}
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-2 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/75 border border-cyan-500/35 backdrop-blur-md shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold">
            3D Neural Avatar Rig
          </span>
        </motion.div>

        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="hidden sm:inline-flex absolute top-6 right-2 z-30 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/75 border border-slate-800 backdrop-blur-md text-[10px] font-mono text-slate-300 shadow-lg"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{degree} • {university}</span>
        </motion.div>

        {/* 5. Floating Interactive Speech Synthesizer Bubble (Floating in space under character) */}
        <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 z-30">
          <div className="rounded-2xl bg-slate-950/85 border border-cyan-500/30 p-3.5 backdrop-blur-xl shadow-2xl flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="min-h-[2.5rem] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={speechIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs text-slate-200 leading-relaxed font-sans"
                >
                  &ldquo;{quotes[speechIdx]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
