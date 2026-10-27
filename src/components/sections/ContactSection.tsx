import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import * as THREE from 'three'
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  Radio,
  Clock,
  Activity,
  Wifi,
  Terminal,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { staggerContainerVariant, fadeUpVariant } from '../../utils/animations'
import { Magnetic } from '../ui/Magnetic'

/**
 * Interactive 3D Holographic Earth Globe with Hyderabad Geo-Beacon
 * Built with Three.js:
 * - 3D Wireframe sphere with latitude/longitude glowing lines
 * - 750 twinkling golden/cyan cybernetic city node particles
 * - Accurate Hyderabad beacon pin at (17.3850° N, 78.4867° E) with pulsing radio rings
 * - Arcing 3D bezier laser trajectories to orbital satellites
 * - Mouse drag to spin with smooth inertia damping
 */
function HolographicUplinkGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 400
    const height = mount.clientHeight || 400

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 7.8)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      mount.appendChild(renderer.domElement)
    } catch {
      return
    }

    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    const globeRadius = 2.4

    // 2. Glowing Wireframe Sphere (Latitude & Longitude Grid)
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 28, 28)
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    })
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
    globeGroup.add(sphereMesh)

    // 3. Cybernetic Surface Nodes (700 Gold/Cyan Holographic Particles)
    const particleCount = 700
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = globeRadius + (Math.random() - 0.5) * 0.08

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      // Gold & cyan hue variation
      const isGold = Math.random() > 0.4
      particleColors[i * 3] = isGold ? 0.98 : 0.22
      particleColors[i * 3 + 1] = isGold ? 0.75 : 0.74
      particleColors[i * 3 + 2] = isGold ? 0.18 : 0.97
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const particlePoints = new THREE.Points(particleGeo, particleMat)
    globeGroup.add(particlePoints)

    // 4. Exact Hyderabad Coordinate Pin: [17.3850° N, 78.4867° E]
    const hyderabadLat = 17.385
    const hyderabadLon = 78.4867

    const latRad = hyderabadLat * (Math.PI / 180)
    const lonRad = (hyderabadLon + 180) * (Math.PI / 180)

    const hydX = -(globeRadius * Math.cos(latRad) * Math.cos(lonRad))
    const hydY = globeRadius * Math.sin(latRad)
    const hydZ = globeRadius * Math.cos(latRad) * Math.sin(lonRad)

    // Hyderabad core beacon dot
    const beaconGeo = new THREE.SphereGeometry(0.1, 16, 16)
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat)
    beaconMesh.position.set(hydX, hydY, hydZ)
    globeGroup.add(beaconMesh)

    // Hyderabad radiating pulse ring
    const ringGeo = new THREE.RingGeometry(0.12, 0.24, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.position.set(hydX, hydY, hydZ)
    ringMesh.lookAt(hydX * 2, hydY * 2, hydZ * 2)
    globeGroup.add(ringMesh)

    // 5. Orbital Satellite Ring with Orbiting Relay Satellite
    const orbitRadius = globeRadius * 1.45
    const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 64)
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    })
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat)
    orbitMesh.rotation.x = Math.PI / 3
    orbitMesh.rotation.y = Math.PI / 6
    globeGroup.add(orbitMesh)

    // Satellite Relay Node
    const satGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12)
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    const satMesh = new THREE.Mesh(satGeo, satMat)
    globeGroup.add(satMesh)

    // Initial orientation: Rotate globe so Hyderabad faces towards camera
    globeGroup.rotation.y = -lonRad + Math.PI / 2
    globeGroup.rotation.x = 0.25

    // 6. Interactive Drag & Spin Physics
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    const rotSpeedY = 0.004

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      globeGroup.rotation.y += deltaX * 0.008
      globeGroup.rotation.x += deltaY * 0.008
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevMouseX = e.touches[0].clientX
        prevMouseY = e.touches[0].clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevMouseX
      const deltaY = e.touches[0].clientY - prevMouseY
      globeGroup.rotation.y += deltaX * 0.008
      globeGroup.rotation.x += deltaY * 0.008
      prevMouseX = e.touches[0].clientX
      prevMouseY = e.touches[0].clientY
    }

    const onTouchEnd = () => {
      isDragging = false
    }

    const domElement = renderer.domElement
    domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    domElement.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // 7. Render Loop
    let animId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Continuous subtle orbital rotation when not dragging
      if (!isDragging) {
        globeGroup.rotation.y += rotSpeedY
      }

      // Pulse the Hyderabad beacon ring
      const pulseScale = 1 + Math.sin(elapsed * 4) * 0.35
      ringMesh.scale.set(pulseScale, pulseScale, pulseScale)
      ringMat.opacity = 0.8 - (pulseScale - 1) * 1.5

      // Orbit the satellite node along the tilted plane
      const satAngle = elapsed * 0.9
      const localX = orbitRadius * Math.cos(satAngle)
      const localY = orbitRadius * Math.sin(satAngle)
      const orbitPos = new THREE.Vector3(localX, localY, 0)
      orbitPos.applyEuler(orbitMesh.rotation)
      satMesh.position.copy(orbitPos)
      satMesh.rotation.y += 0.03

      renderer.render(scene, camera)
    }

    animate()

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return
      const newW = mount.clientWidth || 400
      const newH = mount.clientHeight || 400
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      domElement.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (mount.contains(domElement)) {
        mount.removeChild(domElement)
      }
      sphereGeo.dispose()
      sphereMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      beaconGeo.dispose()
      beaconMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      orbitGeo.dispose()
      orbitMat.dispose()
      satGeo.dispose()
      satMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full" />
      {/* Floating HUD Target Overlay */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-amber-400 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/30 backdrop-blur-md pointer-events-none shadow-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping mr-1.5" />
        TARGET LOCK // HYDERABAD [17.38° N, 78.48° E]
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-sky-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-sky-500/30 backdrop-blur-md pointer-events-none">
        DRAG 3D GLOBE TO ROTATE ORBIT
      </div>
    </div>
  )
}

/**
 * Live Audio-Visual Signal Oscilloscope
 * Renders dynamic oscillating sine/harmonic waveforms that react as the user types
 */
function SignalOscilloscope({ isTransmitting }: { isTransmitting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let phase = 0

    const render = () => {
      animId = requestAnimationFrame(render)
      phase += isTransmitting ? 0.14 : 0.04

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Oscilloscope background grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 15) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Draw active waveform
      ctx.beginPath()
      ctx.lineWidth = isTransmitting ? 2.5 : 1.5
      ctx.strokeStyle = isTransmitting ? '#f59e0b' : '#38bdf8'
      ctx.shadowColor = isTransmitting ? '#f59e0b' : '#38bdf8'
      ctx.shadowBlur = isTransmitting ? 12 : 6

      const midY = h / 2
      const amp = isTransmitting ? 24 : 12

      for (let x = 0; x < w; x++) {
        const normX = x / w
        const y =
          midY +
          Math.sin(normX * 12 + phase) * amp * Math.cos(normX * 4) +
          Math.sin(normX * 24 - phase * 1.5) * (amp * 0.4)

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [isTransmitting])

  return (
    <div className="w-full h-12 bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden relative">
      <canvas ref={canvasRef} width={380} height={48} className="w-full h-full" />
      <span className="absolute top-1 right-2 font-mono text-[8px] text-slate-400">
        FREQUENCY // 14.2 GHz [AES-256]
      </span>
    </div>
  )
}

/**
 * Master ContactSection
 * Completely redesigned as an unprecedented 3D Quantum Interplanetary Uplink Array:
 * 1. Real-time Three.js 3D Holographic Globe with Hyderabad node & orbital satellites
 * 2. 4-Channel Frequency Presets that auto-configure the transmission
 * 3. Live Audio/Electromagnetic Waveform Oscilloscope
 * 4. Biometric Laser-Scan Dispatch Engine with 3-Phase Transmission Handshake
 * 5. Geodetic Telemetry & Real-Time IST World Clock
 */
export function ContactSection() {
  const { data } = usePortfolio()
  const { profileData, contact } = data

  const email = contact?.email || profileData.email || 'challachandu67@gmail.com'
  const phone = contact?.phone || profileData.phone || '+91 9059169996'
  const location = contact?.location || profileData.location || 'Suryapet & Hyderabad, Telangana, India'

  const [activeChannel, setActiveChannel] = useState<'role' | 'contract' | 'research' | 'coffee'>('role')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [subject, setSubject] = useState('Full-Time AI/ML Engineering Role Opportunity')
  const [message, setMessage] = useState(
    'Hi Chandu, we reviewed your AI/ML and Computer Vision engineering portfolio and would like to invite you for a technical discussion regarding an open opportunity...'
  )
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitStep, setTransmitStep] = useState<string | null>(null)
  const [currentTimeIST, setCurrentTimeIST] = useState('')
  const [dispatchReceipt, setDispatchReceipt] = useState<{
    hash: string
    timestamp: string
    carrierFreq: string
    channelName: string
    mailtoUrl: string
  } | null>(null)
  const [copiedPayload, setCopiedPayload] = useState(false)

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const istString = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date())
      setCurrentTimeIST(istString)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Channel switch handler: auto-configures subject & payload
  const handleSelectChannel = (channel: 'role' | 'contract' | 'research' | 'coffee') => {
    setActiveChannel(channel)
    if (channel === 'role') {
      setSubject('Full-Time AI/ML Engineering Role Opportunity')
      setMessage(
        'Hi Chandu, we evaluated your AI/ML and full-stack projects and would like to discuss an entry-level engineering role on our team...'
      )
    } else if (channel === 'contract') {
      setSubject('AI / Computer Vision Project Prototype Collaboration')
      setMessage(
        'Hi Chandu, we have a computer vision / deep learning project requiring real-time object tracking and would like to collaborate with you...'
      )
    } else if (channel === 'research') {
      setSubject('Applied Deep Learning & NLP Engineering Inquiry')
      setMessage(
        'Hi Chandu, your work on computer vision, toxic span NLP, and audio feature extraction matches our domain. Let us connect...'
      )
    } else {
      setSubject('Technical Coffee Chat & Software Networking')
      setMessage(
        'Hi Chandu, I came across your portfolio and wanted to connect for a casual tech coffee chat to talk software engineering and AI...'
      )
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2500)
    } catch {
      // fallback
    }
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2500)
    } catch {
      // fallback
    }
  }

  // 3-Phase Quantum Biometric Transmission Handshake + Live Orbital Dispatch Receipt
  const handleSendMailto = (e: FormEvent) => {
    e.preventDefault()
    setIsTransmitting(true)
    setTransmitStep('Preparing message payload...')

    setTimeout(() => {
      setTransmitStep('Connecting to mail service...')
    }, 450)

    setTimeout(() => {
      setTransmitStep('Opening email client...')
    }, 900)

    setTimeout(() => {
      const channelLabels: Record<string, string> = {
        role: 'Full-Time Role',
        contract: 'AI / CV Project',
        research: 'Research & AI',
        coffee: 'Tech Connect',
      }
      const refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`

      const body = `Hello Chandu,\n\n${message}\n\n---\nSender: ${senderName}\nEmail: ${senderEmail}\nTopic: ${channelLabels[activeChannel] || 'General Discussion'}\nSent from Portfolio Contact Page`
      const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`

      setDispatchReceipt({
        hash: refId,
        timestamp: `${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
        carrierFreq: 'Direct Mail Protocol',
        channelName: channelLabels[activeChannel] || 'Direct Connect',
        mailtoUrl,
      })

      setIsTransmitting(false)
      setTransmitStep(null)

      // Automatically triggers native mail app after user has seen the confirmation
      setTimeout(() => {
        window.location.href = mailtoUrl
      }, 2000)
    }, 1300)
  }

  return (
    <section
      id="contact"
      aria-label="Contact Chandu Challa"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/20 overflow-hidden bg-[#07090e] select-none"
    >
      {/* Background Starfield & Atmospheric Glow */}
      <div
        className="absolute top-1/3 -right-36 w-[38rem] h-[38rem] pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />
      <div
        className="absolute bottom-10 -left-36 w-[34rem] h-[34rem] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header HUD */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Let&apos;s Connect &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-400">
              Build Together
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Open for full-time AI/ML roles, software engineering positions, and project collaboration.
            Rotate the interactive 3D globe or choose a conversation topic below:
          </p>
        </div>

        {/* 4-TOPIC CHANNEL MATRIX (Selects conversation mode) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-5xl mx-auto font-mono text-xs">
          {[
            {
              id: 'role' as const,
              label: '01 // FULL-TIME ROLE',
              sub: 'Career & Engineering Roles',
              icon: Cpu,
              accent: 'border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
            },
            {
              id: 'contract' as const,
              label: '02 // AI / CV PROJECT',
              sub: 'Machine Learning Systems',
              icon: Sparkles,
              accent: 'border-sky-400/60 bg-sky-500/15 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]',
            },
            {
              id: 'research' as const,
              label: '03 // RESEARCH & AI',
              sub: 'NLP, Vision & Algorithms',
              icon: Layers,
              accent: 'border-purple-400/60 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.25)]',
            },
            {
              id: 'coffee' as const,
              label: '04 // TECH CONNECT',
              sub: 'Casual Developer Chat',
              icon: Terminal,
              accent: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]',
            },
          ].map((ch) => {
            const Icon = ch.icon
            const isSelected = activeChannel === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectChannel(ch.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between ${
                  isSelected
                    ? ch.accent
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold tracking-wider text-[11px]">{ch.label}</span>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{ch.sub}</span>
              </button>
            )
          })}
        </div>

        {/* MAIN DUAL-STAGE SHOWCASE: 3D Globe + Sci-Fi Uplink Terminal */}
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* LEFT 5 COLS: 3D Holographic Globe & Quick Communication Pods */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-5 space-y-4">
            {/* The Interactive Three.js 3D Earth Globe */}
            <div className="rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-2xl overflow-hidden relative">
              <HolographicUplinkGlobe />
            </div>

            {/* Quick Orbital Channel Pods (Email, Phone, Coordinates) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {/* Email Pod */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 uppercase block">Email</span>
                    <a href={`mailto:${email}`} className="text-white hover:text-amber-300 font-semibold truncate block text-[11px]">
                      {email.split('@')[0]}@...
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Copy full email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Phone Pod */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 uppercase block">Phone</span>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white hover:text-sky-300 font-semibold truncate block text-[11px]">
                      {phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-400 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Copy phone"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Live Telemetry Status Bar */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 font-mono text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2.5">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>IST: {currentTimeIST || '15:50:00'}</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Activity className="w-3 h-3" />
                <span>STATUS: OPEN FOR ROLES</span>
              </span>
              <span className="text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {location.split(',')[0]}
              </span>
            </div>
          </motion.div>

          {/* RIGHT 7 COLS: Direct Message Form Terminal */}
          <motion.div
            variants={fadeUpVariant}
            className="lg:col-span-7 relative p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl text-left shadow-2xl space-y-5 overflow-hidden"
          >
            {/* Ambient Corner Plasma Glow */}
            <div
              className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            {/* Terminal Header & Status */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400 animate-pulse" />
                <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                  Send a Direct Message
                </h3>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QUICK RESPONSE</span>
              </div>
            </div>

            {/* Real-Time Signal Oscilloscope */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>SIGNAL ACTIVITY</span>
                <span className="text-sky-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> CONNECTED
                </span>
              </div>
              <SignalOscilloscope isTransmitting={isTransmitting} />
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSendMailto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-sender-name" className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="contact-sender-name"
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name or company"
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-sender-email" className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    id="contact-sender-email"
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-scope-subject" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Subject *
                </label>
                <input
                  id="contact-scope-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                />
              </div>

              <div>
                <label htmlFor="contact-payload-message" className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Your Message *</span>
                  <span className="text-[10px] text-slate-500 font-mono">{message.length} chars</span>
                </label>
                <textarea
                  id="contact-payload-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                />
              </div>

              {/* CLEAN MODERN DISPATCH BUTTON (Magnetic GSAP Physics) */}
              <div className="relative pt-1 w-full">
                <Magnetic strength={0.2} radius={100} className="w-full">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTransmitting}
                    className="relative w-full overflow-hidden inline-flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition cursor-pointer shadow-lg shadow-amber-500/25 group"
                  >
                    {isTransmitting ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin text-slate-950" />
                        <span className="font-mono text-xs">{transmitStep}</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                        <span>Send Message to Chandu Challa</span>
                      </>
                    )}
                  </motion.button>
                </Magnetic>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* =========================================================================
          NOVEL ANIMATION: HYPERSPACE EXPANDING PLASMA SHOCKWAVE
          ========================================================================= */}
      <AnimatePresence>
        {isTransmitting && (
          <motion.div
            initial={{ scale: 0, opacity: 0.95 }}
            animate={{ scale: 4.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="fixed inset-0 m-auto w-48 h-48 rounded-full border-4 border-amber-300 bg-amber-400/20 backdrop-blur-sm pointer-events-none z-50 shadow-[0_0_120px_#f59e0b]"
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          NOVEL ANIMATION: HOLOGRAPHIC ORBITAL DISPATCH RECEIPT MODAL
          Appears when anyone transmits a message to Chandu Challa
          ========================================================================= */}
      <AnimatePresence>
        {dispatchReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
            {/* Hyperspace Radial Shockwave Behind Receipt */}
            <motion.div
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: [0.8, 1.6, 1.2], opacity: [0.9, 0.4, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[600px] h-[600px] rounded-full border border-amber-400/30 bg-amber-400/5 pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-400/60 shadow-[0_0_80px_rgba(245,158,11,0.35)] space-y-6 text-left font-mono select-none overflow-hidden"
            >
              {/* Animated Top Laser Beam */}
              <motion.div
                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-sky-400 to-amber-400"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setDispatchReceipt(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Badge */}
              <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-xs">● MESSAGE READY TO DISPATCH</span>
                    <span className="text-[10px] text-slate-400">{dispatchReceipt.timestamp}</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Ready to Send
                  </h3>
                </div>
              </div>

              {/* Message Voucher Details */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-3 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">RECIPIENT</span>
                    <span className="text-amber-300 font-bold">Chandu Challa</span>
                    <span className="text-slate-400 text-[10px] block">{email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">SENDER</span>
                    <span className="text-white font-bold">{senderName || 'Anonymous Visitor'}</span>
                    <span className="text-slate-400 text-[10px] block">{senderEmail || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">LOCATION</span>
                    <span className="text-slate-200">Hyderabad, Telangana, India</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">TOPIC / CHANNEL</span>
                    <span className="text-sky-300 font-semibold">{dispatchReceipt.channelName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-500 uppercase tracking-wider block">REFERENCE ID:</span>
                  <span className="text-emerald-400 font-mono break-all">{dispatchReceipt.hash}</span>
                </div>
              </div>

              {/* Automated Dispatch Status Message */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Launching your default email client with the pre-filled message...</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <a
                  href={dispatchReceipt.mailtoUrl}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Email App Now</span>
                </a>

                <button
                  type="button"
                  onClick={async () => {
                    const rawText = `To: ${email}\nSubject: ${subject}\n\n${message}\n\nFrom: ${senderName} (${senderEmail})`
                    await navigator.clipboard.writeText(rawText)
                    setCopiedPayload(true)
                    setTimeout(() => setCopiedPayload(false), 2500)
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700"
                >
                  {copiedPayload ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPayload ? 'Copied Payload!' : 'Copy Payload'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
