import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'motion/react'

/**
 * ThreeBackground
 * Ultra-smooth, low-contrast cinematic 3D particle wave & celestial horizon engine.
 * Adaptively recalibrates across sections:
 * - Upper pages (Hero -> Projects): Immersive, flowing golden bokeh wave field.
 * - Lower pages (Page 5: Education, Troubleshooting, Resume, Contact):
 *   Transitions smoothly into an elevated celestial horizon & ambient constellation field
 *   so the background remains active, balanced, and perfectly framed all the way to the footer.
 */
export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = window.innerWidth
    const height = window.innerHeight

    // 1. Scene, Camera, and Low-Contrast Atmospheric Fog
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0e1118, 0.01)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 8, 65)
    camera.lookAt(0, -6, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 2. Soft Bokeh Dot Texture (Gaussian Falloff in Memory)
    const createBokehTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        rad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        rad.addColorStop(0.35, 'rgba(253, 230, 138, 0.85)')
        rad.addColorStop(0.65, 'rgba(217, 119, 6, 0.25)')
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = rad
        ctx.fillRect(0, 0, 64, 64)
      }
      return new THREE.CanvasTexture(canvas)
    }
    const bokehTexture = createBokehTexture()

    // 3. Fluid 3D Wave Particle Field (Silky, Low Contrast)
    const cols = 68
    const rows = 38
    const numParticles = cols * rows
    const wavePositions = new Float32Array(numParticles * 3)
    const waveColors = new Float32Array(numParticles * 3)

    const xSpacing = 2.1
    const zSpacing = 2.0
    const xOffset = ((cols - 1) * xSpacing) / 2
    const zOffset = ((rows - 1) * zSpacing) / 2

    // Pre-calculate base coordinates
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = (i * rows + j) * 3
        wavePositions[idx] = i * xSpacing - xOffset
        wavePositions[idx + 1] = -14
        wavePositions[idx + 2] = j * zSpacing - zOffset

        waveColors[idx] = 0.85
        waveColors[idx + 1] = 0.65
        waveColors[idx + 2] = 0.25
      }
    }

    const waveGeometry = new THREE.BufferGeometry()
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3))
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3))

    const waveMaterial = new THREE.PointsMaterial({
      size: 1.85,
      map: bokehTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wavePoints = new THREE.Points(waveGeometry, waveMaterial)
    scene.add(wavePoints)

    // 4. Ambient Floating Studio Light Motes & Celestial Stars for Lower Pages
    const moteCount = 55
    const motePositions = new Float32Array(moteCount * 3)
    const moteVelocities: { x: number; y: number; z: number }[] = []

    for (let m = 0; m < moteCount; m++) {
      motePositions[m * 3] = (Math.random() - 0.5) * 95
      motePositions[m * 3 + 1] = (Math.random() - 0.5) * 55
      motePositions[m * 3 + 2] = (Math.random() - 0.5) * 50

      moteVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.025,
        z: (Math.random() - 0.5) * 0.015,
      })
    }

    const moteGeometry = new THREE.BufferGeometry()
    moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3))

    const moteMaterial = new THREE.PointsMaterial({
      size: 3.2,
      map: bokehTexture,
      color: 0xfde047,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const motePoints = new THREE.Points(moteGeometry, moteMaterial)
    scene.add(motePoints)

    // 5. Interactive Mouse & Adaptive Scroll Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let scrollProgress = 0
    let targetCameraY = 8
    let targetLookY = -6

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollProgress = Math.min(1, Math.max(0, scrollY / docHeight))

      // Multi-Section Adaptive Camera Recalibration:
      // Page 1 to Page 4: Camera dips gently underneath the flowing wave
      // Page 5 to Footer: Camera lifts into a majestic celestial horizon angle overlooking the constellation
      if (scrollProgress < 0.45) {
        const upperNorm = scrollProgress / 0.45
        targetCameraY = 8 - upperNorm * 18
        targetLookY = -6 - upperNorm * 8
      } else {
        const lowerNorm = (scrollProgress - 0.45) / 0.55
        targetCameraY = -10 + lowerNorm * 12
        targetLookY = -14 + lowerNorm * 10
      }
    }

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initial scroll setup
    handleScroll()

    // 6. 60 FPS Fluid Render Loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      const time = clock.getElapsedTime()

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Smooth Camera tracking
      if (!prefersReducedMotion) {
        camera.position.y += (targetCameraY - camera.position.y) * 0.05
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03
        camera.lookAt(0, targetLookY, 0)
      }

      // Animate Fluid Wave Vertices
      const posArray = waveGeometry.attributes.position.array as Float32Array
      const colorArray = waveGeometry.attributes.color.array as Float32Array

      if (!prefersReducedMotion) {
        // From page 5 onwards, wave gently widens its harmonic period for calm stability
        const waveScale = scrollProgress > 0.45 ? 0.8 : 1.0

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const index = (i * rows + j) * 3
            const x = posArray[index]
            const z = posArray[index + 2]

            // Harmonic fluid sine-cosine oscillation
            let y =
              -13 +
              Math.sin(x * 0.05 + time * 0.8) * 3.8 * waveScale +
              Math.cos(z * 0.065 + time * 0.6) * 3.2 * waveScale +
              Math.sin((x + z) * 0.04 + time * 0.5) * 1.8 * waveScale

            // Mouse interactive ripple wave
            const mX = mouse.x * 55
            const mZ = -mouse.y * 35
            const dist = Math.hypot(x - mX, z - mZ)
            if (dist < 28) {
              const rippleFactor = (1 - dist / 28) * Math.cos(dist * 0.3 - time * 3.2)
              y += rippleFactor * 2.8
            }

            posArray[index + 1] = y

            // Color gradient: Upper pages warm gold; lower pages blend in subtle cyan-champagne celestial tones
            const normalizedHeight = THREE.MathUtils.clamp((y + 16) / 8, 0, 1)
            const isLower = scrollProgress > 0.45
            const rTarget = isLower ? 0.45 : 0.98
            const gTarget = isLower ? 0.85 : 0.84
            const bTarget = isLower ? 0.95 : 0.35

            colorArray[index] = THREE.MathUtils.lerp(0.35, rTarget, normalizedHeight)
            colorArray[index + 1] = THREE.MathUtils.lerp(0.42, gTarget, normalizedHeight)
            colorArray[index + 2] = THREE.MathUtils.lerp(0.55, bTarget, normalizedHeight)
          }
        }
        waveGeometry.attributes.position.needsUpdate = true
        waveGeometry.attributes.color.needsUpdate = true

        // Animate Floating Studio Motes
        const motesPos = moteGeometry.attributes.position.array as Float32Array
        for (let m = 0; m < moteCount; m++) {
          motesPos[m * 3] += moteVelocities[m].x
          motesPos[m * 3 + 1] += moteVelocities[m].y + Math.sin(time + m) * 0.005
          motesPos[m * 3 + 2] += moteVelocities[m].z

          if (motesPos[m * 3] > 48 || motesPos[m * 3] < -48) moteVelocities[m].x *= -1
          if (motesPos[m * 3 + 1] > 28 || motesPos[m * 3 + 1] < -28) moteVelocities[m].y *= -1
          if (motesPos[m * 3 + 2] > 30 || motesPos[m * 3 + 2] < -30) moteVelocities[m].z *= -1
        }
        moteGeometry.attributes.position.needsUpdate = true
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

      waveGeometry.dispose()
      waveMaterial.dispose()
      moteGeometry.dispose()
      moteMaterial.dispose()
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
    >
      {/* Soft Ambient Atmospheric Light Vignette */}
      <div className="absolute top-1/4 -right-36 w-[42rem] h-[42rem] rounded-full bg-amber-500/8 blur-[170px] pointer-events-none" />
      <div className="absolute top-2/3 -left-40 w-[40rem] h-[40rem] rounded-full bg-yellow-500/6 blur-[160px] pointer-events-none" />
    </div>
  )
}
