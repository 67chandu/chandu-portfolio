import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Orbit, Eye } from 'lucide-react'

interface Avatar3DProps {
  photoUrl?: string
  name?: string
  specialization?: string
}

export function Avatar3D({
  photoUrl,
  name = 'Chandu Challa',
  specialization = 'CSE (AI & ML)',
}: Avatar3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0.5, rawY: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const [pulseCount, setPulseCount] = useState(0)

  // Track pointer on container
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({
      x: (x - 0.5) * 2, // -1 to 1
      y: (y - 0.5) * 2, // -1 to 1
      rawX: x,
      rawY: y,
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0, rawX: 0.5, rawY: 0.5 })
    setIsHovered(false)
  }, [])

  // WebGL / Canvas 3D rendering loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Particle nodes for 3D neural orbit
    const particles = Array.from({ length: 42 }, (_, i) => ({
      phi: Math.acos(-1 + (2 * i) / 42),
      theta: Math.sqrt(42 * Math.PI) * i,
      radius: 120 + (i % 5) * 12,
      size: 1.5 + (i % 3) * 0.8,
      speed: 0.008 + (i % 4) * 0.004,
      color: i % 2 === 0 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, ',
    }))

    // Smooth interpolated target tracking
    let currentTiltX = 0
    let currentTiltY = 0

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
      const centerY = height / 2

      // Ease current tilt towards mousePos
      const targetTiltX = prefersReducedMotion ? 0 : mousePos.x * 24
      const targetTiltY = prefersReducedMotion ? 0 : mousePos.y * 18
      currentTiltX += (targetTiltX - currentTiltX) * 0.08
      currentTiltY += (targetTiltY - currentTiltY) * 0.08

      // 1. Draw Holographic Floor Grid (Perspective 3D projection)
      const gridY = centerY + 130
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'
      ctx.lineWidth = 1
      for (let i = -5; i <= 5; i++) {
        const startX = centerX + i * 28 + currentTiltX * 0.5
        const endX = centerX + i * 65 + currentTiltX * 1.2
        ctx.beginPath()
        ctx.moveTo(startX, gridY)
        ctx.lineTo(endX, height - 10)
        ctx.stroke()
      }
      for (let j = 0; j < 4; j++) {
        const yPos = gridY + j * 16
        ctx.beginPath()
        ctx.moveTo(centerX - 140 - j * 18 + currentTiltX * 0.6, yPos)
        ctx.lineTo(centerX + 140 + j * 18 + currentTiltX * 0.6, yPos)
        ctx.stroke()
      }

      // 2. Draw 3D Gyroscopic Rings (Rotating on X, Y, Z axes with pitch)
      const ringRotSpeed = isHovered ? 0.035 : 0.015
      const drawRing = (
        radiusX: number,
        radiusY: number,
        angle: number,
        color: string,
        dashPattern?: number[]
      ) => {
        ctx.save()
        ctx.translate(centerX + currentTiltX * 0.4, centerY - 10 + currentTiltY * 0.4)
        ctx.rotate(angle)
        if (dashPattern) ctx.setLineDash(dashPattern)
        ctx.strokeStyle = color
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // Outer rings with coordinate notches
      drawRing(145, 62, time * ringRotSpeed + currentTiltX * 0.02, 'rgba(6, 182, 212, 0.25)', [6, 8])
      drawRing(130, 48, -time * ringRotSpeed * 1.2, 'rgba(99, 102, 241, 0.28)')
      drawRing(115, 36, time * ringRotSpeed * 0.7 + Math.PI / 4, 'rgba(14, 165, 233, 0.3)', [3, 5])

      // 3. Draw Stylized Procedural 3D Developer Bust / Head Wireframe
      const headX = centerX + currentTiltX * 0.8
      const headY = centerY - 15 + currentTiltY * 0.8

      // Soft ambient aura
      const gradient = ctx.createRadialGradient(headX, headY, 15, headX, headY, 110)
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.22)')
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)')
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(headX, headY, 110, 0, Math.PI * 2)
      ctx.fill()

      // Shoulders / Torso Geometric silhouette
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(headX - 65, headY + 115)
      ctx.lineTo(headX - 42, headY + 68)
      ctx.lineTo(headX - 22, headY + 54)
      ctx.lineTo(headX + 22, headY + 54)
      ctx.lineTo(headX + 42, headY + 68)
      ctx.lineTo(headX + 65, headY + 115)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Neck
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'
      ctx.beginPath()
      ctx.rect(headX - 12, headY + 36, 24, 20)
      ctx.fill()
      ctx.stroke()

      // Head Base Oval
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(headX, headY, 38, 46, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Cybernetic Headset / Neural Interface Band
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.65)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.ellipse(headX, headY - 14, 40, 16, 0, Math.PI, Math.PI * 2)
      ctx.stroke()

      // Gaze Tracking Eye Visor (Reacts directly to pointer gaze angle)
      const gazeOffsetX = Math.max(-12, Math.min(12, currentTiltX * 0.45))
      const gazeOffsetY = Math.max(-8, Math.min(8, currentTiltY * 0.35))
      const visorX = headX + gazeOffsetX
      const visorY = headY - 4 + gazeOffsetY

      // Visor Glow
      const visorGrad = ctx.createLinearGradient(visorX - 24, visorY, visorX + 24, visorY)
      visorGrad.addColorStop(0, '#06b6d4')
      visorGrad.addColorStop(0.5, '#38bdf8')
      visorGrad.addColorStop(1, '#818cf8')

      ctx.fillStyle = visorGrad
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = isHovered ? 18 : 10
      ctx.beginPath()
      // Rounded futuristic visor capsule
      ctx.roundRect(visorX - 22, visorY - 5, 44, 11, 5)
      ctx.fill()
      ctx.shadowBlur = 0 // Reset shadow

      // Visor Optical Pupils / Scanning Ray
      const scanX = visorX + Math.sin(time * 3) * 14
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(scanX, visorY, 2.2, 0, Math.PI * 2)
      ctx.fill()

      // 4. Draw Orbiting 3D Particles & Synapses
      particles.forEach((p, idx) => {
        const phi = p.phi
        const theta = p.theta + time * p.speed + (isHovered ? time * 0.02 : 0)

        // 3D Spherical coordinates
        const x3d = p.radius * Math.sin(phi) * Math.cos(theta)
        const y3d = p.radius * Math.cos(phi) * 0.45 // flatten for perspective
        const z3d = p.radius * Math.sin(phi) * Math.sin(theta)

        // 3D Perspective Projection
        const fov = 320
        const scale = fov / (fov + z3d)
        const projX = centerX + x3d * scale + currentTiltX * 0.6
        const projY = centerY + y3d * scale - 10 + currentTiltY * 0.6
        const alpha = Math.max(0.15, Math.min(0.9, (z3d + 140) / 280))

        ctx.fillStyle = `${p.color}${alpha})`
        ctx.beginPath()
        ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2)
        ctx.fill()

        // Connect nearby points with synaptic lines
        if (idx % 3 === 0 && idx < particles.length - 2) {
          const next = particles[idx + 1]
          const nextTheta = next.theta + time * next.speed
          const nx3d = next.radius * Math.sin(next.phi) * Math.cos(nextTheta)
          const ny3d = next.radius * Math.cos(next.phi) * 0.45
          const nz3d = next.radius * Math.sin(next.phi) * Math.sin(nextTheta)
          const nScale = fov / (fov + nz3d)
          const nProjX = centerX + nx3d * nScale + currentTiltX * 0.6
          const nProjY = centerY + ny3d * nScale - 10 + currentTiltY * 0.6

          const dist = Math.hypot(projX - nProjX, projY - nProjY)
          if (dist < 60) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - dist / 60) * alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(projX, projY)
            ctx.lineTo(nProjX, nProjY)
            ctx.stroke()
          }
        }
      })

      // 5. Scanline Pulse Wave on Click
      if (pulseCount > 0) {
        const pulseProgress = ((time * 4) % 3) / 3
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.6 * (1 - pulseProgress)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(headX, headY, 40 + pulseProgress * 120, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePos, isHovered, pulseCount, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      onClick={() => setPulseCount((c) => c + 1)}
      role="region"
      aria-label="Interactive 3D Developer Avatar"
      className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing group"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Outer HUD Ring */}
      <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors pointer-events-none" />

      {/* 3D WebGL / Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 touch-none pointer-events-none"
      />

      {/* Optional Inset Real Photo Pill when provided */}
      {photoUrl && (
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: mousePos.x * 6,
                  y: mousePos.y * 6,
                }
          }
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl"
        >
          <img
            src={photoUrl}
            alt={name}
            className="w-10 h-10 rounded-xl object-cover object-top border border-cyan-500/40"
            onError={(e) => {
              // Hide if not found
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
          <div className="pr-2 text-left">
            <span className="block text-[10px] font-mono uppercase text-slate-400">
              Verified Source
            </span>
            <span className="block text-xs font-semibold text-white truncate max-w-[100px]">
              {name.split(' ')[0]}
            </span>
          </div>
        </motion.div>
      )}

      {/* Top Left Telemetry Status Badge */}
      <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-lg pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold">
          3D Interactive Model
        </span>
      </div>

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md text-slate-300 text-[11px] font-mono pointer-events-none">
        <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>{specialization} • Active</span>
      </div>

      {/* Hover Instruction Overlay */}
      <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none group-hover:text-cyan-300 transition-colors">
        <Eye className="w-3 h-3 text-cyan-400" />
        <span>Track Cursor</span>
      </div>
    </div>
  )
}
