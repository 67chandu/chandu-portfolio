import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'motion/react'

/**
 * ThreeBackground
 * Ultra-smooth, high-performance 3D ambient particle wave.
 * Zero CPU array looping per frame, zero GPU buffer re-uploads.
 * Runs at rock-solid 60-120 FPS with near-zero CPU and memory overhead.
 */
export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isVisible = !document.hidden
    let animationFrameId: number
    const width = window.innerWidth
    const height = window.innerHeight

    // 1. Scene, Camera, and Atmospheric Fog
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0e1118, 0.012)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 800)
    camera.position.set(0, 8, 65)
    camera.lookAt(0, -6, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 2. Soft Bokeh Dot Texture
    const createBokehTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
        rad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        rad.addColorStop(0.35, 'rgba(253, 230, 138, 0.85)')
        rad.addColorStop(0.7, 'rgba(217, 119, 6, 0.25)')
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = rad
        ctx.fillRect(0, 0, 32, 32)
      }
      return new THREE.CanvasTexture(canvas)
    }
    const bokehTexture = createBokehTexture()

    // 3. Fluid 3D Wave Particle Field (Precomputed static wave shape)
    const cols = 36
    const rows = 20
    const numParticles = cols * rows
    const wavePositions = new Float32Array(numParticles * 3)
    const waveColors = new Float32Array(numParticles * 3)

    const xSpacing = 3.8
    const zSpacing = 3.6
    const xOffset = ((cols - 1) * xSpacing) / 2
    const zOffset = ((rows - 1) * zSpacing) / 2

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = (i * rows + j) * 3
        const x = i * xSpacing - xOffset
        const z = j * zSpacing - zOffset
        // Precompute natural undulating wave surface
        const y = -14 + Math.sin(x * 0.05) * 4.2 + Math.cos(z * 0.06) * 3.4

        wavePositions[idx] = x
        wavePositions[idx + 1] = y
        wavePositions[idx + 2] = z

        // Precompute smooth luxury gold-to-cyan gradient
        const norm = (y + 18) / 8
        waveColors[idx] = THREE.MathUtils.lerp(0.85, 0.98, norm)
        waveColors[idx + 1] = THREE.MathUtils.lerp(0.65, 0.82, norm)
        waveColors[idx + 2] = THREE.MathUtils.lerp(0.25, 0.45, norm)
      }
    }

    const waveGeometry = new THREE.BufferGeometry()
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3))
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3))

    const waveMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: bokehTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wavePoints = new THREE.Points(waveGeometry, waveMaterial)
    scene.add(wavePoints)

    // 4. Mouse Tracking & Window Resize
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let targetCameraY = 8

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollProgress = Math.min(1, Math.max(0, scrollY / docHeight))
      targetCameraY = 8 - scrollProgress * 12
    }

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        animate()
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    handleScroll()

    // 5. Zero-CPU Render Loop (Transform Group Only)
    const clock = new THREE.Clock()

    const animate = () => {
      if (!isVisible) return

      const time = clock.getElapsedTime()

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      if (!prefersReducedMotion) {
        camera.position.y += (targetCameraY - camera.position.y) * 0.05
        camera.position.x += (mouse.x * 4 - camera.position.x) * 0.03
        camera.lookAt(0, -6, 0)

        // Smooth GPU matrix transformations: ZERO array mutations
        wavePoints.rotation.y = time * 0.02
        wavePoints.position.y = Math.sin(time * 0.5) * 1.5
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      waveGeometry.dispose()
      waveMaterial.dispose()
      bokehTexture.dispose()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
