import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  alphaSpeed: number
}

/**
 * InteractiveBackground
 * Renders a full-viewport continuous 3D canvas animation across all pages:
 * 1. Flowing golden-amber dual aurora sine waves with dynamic amplitude and scroll acceleration.
 * 2. Luminous neural particle network connected with synaptic lines.
 * 3. Interactive cursor magnetic beam effect.
 * 4. Ambient drifting atmospheric nebula glow orbs.
 */
export function InteractiveBackground() {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const mouse = { x: -9999, y: -9999 }
    let lastScrollY = window.scrollY
    let scrollSpeed = 0
    let waveOffset = 0

    // Particle density tuned for high visual impact and 60fps smoothness
    const count = Math.min(85, Math.floor((width * height) / 18000))
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      radius: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.45 + 0.25,
      alphaSpeed: (Math.random() - 0.5) * 0.01,
    }))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleScroll = () => {
      const deltaScroll = window.scrollY - lastScrollY
      scrollSpeed = Math.min(30, Math.abs(deltaScroll))
      lastScrollY = window.scrollY

      // Parallax drift on scroll
      for (let i = 0; i < particles.length; i++) {
        particles[i].y -= deltaScroll * 0.18
        if (particles[i].y < 0) particles[i].y = height
        if (particles[i].y > height) particles[i].y = 0
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      waveOffset += 0.012 + scrollSpeed * 0.003
      scrollSpeed *= 0.92 // Smooth velocity decay

      const currentScroll = window.scrollY

      // =========================================================================
      // 1. FLOWING DUAL-HARMONIC AURORA SINE WAVES (Active & Gorgeous on Scroll)
      // =========================================================================
      if (currentScroll > 80) {
        const scrollFactor = Math.min(1, (currentScroll - 80) / 300)
        ctx.save()

        // Wave Ribbon 1: Warm Golden Amber Sine Wave
        ctx.beginPath()
        ctx.moveTo(0, height * 0.38)
        for (let x = 0; x <= width; x += 12) {
          const y =
            height * 0.4 +
            Math.sin(x * 0.003 + waveOffset) * 55 +
            Math.cos(x * 0.0018 - waveOffset * 0.7) * 40
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.42 * scrollFactor})`
        ctx.lineWidth = 2.4
        ctx.shadowColor = 'rgba(245, 158, 11, 0.75)'
        ctx.shadowBlur = 22
        ctx.stroke()

        // Wave Ribbon 2: Champagne Gold Secondary Harmonic
        ctx.beginPath()
        ctx.moveTo(0, height * 0.58)
        for (let x = 0; x <= width; x += 12) {
          const y =
            height * 0.6 +
            Math.sin(x * 0.0038 - waveOffset * 1.1) * 48 +
            Math.cos(x * 0.0022 + waveOffset * 0.9) * 32
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.32 * scrollFactor})`
        ctx.lineWidth = 1.8
        ctx.shadowColor = 'rgba(251, 191, 36, 0.65)'
        ctx.shadowBlur = 18
        ctx.stroke()

        // Wave Ribbon 3: Cyber Cyan Subtle Counter-Wave (AI/ML Neural Pulse)
        ctx.beginPath()
        ctx.moveTo(0, height * 0.76)
        for (let x = 0; x <= width; x += 14) {
          const y =
            height * 0.78 +
            Math.sin(x * 0.0025 + waveOffset * 0.8) * 35 +
            Math.cos(x * 0.0035 - waveOffset) * 25
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.22 * scrollFactor})`
        ctx.lineWidth = 1.2
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)'
        ctx.shadowBlur = 14
        ctx.stroke()

        ctx.restore()
      }

      // =========================================================================
      // 2. LUMINOUS NEURAL NETWORK PARTICLES & SYNAPTIC THREADS
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaSpeed
        if (p.alpha > 0.75 || p.alpha < 0.2) p.alphaSpeed = -p.alphaSpeed

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Particle Dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)'
        ctx.shadowBlur = 8
        ctx.fill()

        // Connect nearby particles with synaptic lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 145) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.18 * (1 - dist / 145)})`
            ctx.lineWidth = 0.9
            ctx.shadowBlur = 0
            ctx.stroke()
          }
        }

        // Connect particles to mouse cursor with interactive amber beam
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < 190) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.35 * (1 - mDist / 190)})`
          ctx.lineWidth = 1.3
          ctx.shadowColor = 'rgba(251, 191, 36, 0.8)'
          ctx.shadowBlur = 10
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prefersReducedMotion])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0c12] bg-grid-pattern"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Floating Animated Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -right-36 w-[38rem] h-[38rem] rounded-full bg-amber-500/12 blur-[150px] animate-aurora-pulse pointer-events-none" />
      <div className="absolute top-2/3 -left-40 w-[36rem] h-[36rem] rounded-full bg-yellow-500/10 blur-[140px] animate-drift-light pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] rounded-full bg-amber-600/8 blur-[160px] animate-float-slow pointer-events-none" />
    </div>
  )
}
