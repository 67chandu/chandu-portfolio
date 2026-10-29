import { useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import * as THREE from 'three'

interface GoldFramedPortrait3DProps {
  imageSrc?: string
  wavingImageSrc?: string
  name?: string
}

/**
 * Instagram-Style 3D Avatar Profile Card with Three.js Procedural Hand-Waving Engine
 * - PBR Lighting: Key directional light, ambient fill, and studio rim lighting
 * - Articulated 3D Arm, Wrist & Fingers with multi-phalanx procedural wave kinematics
 * - Cursor-reactive head & torso tracking with spring damping
 * - Instagram profile zoom-out effect on hover
 * - Zero speech bubbles or text pills — pure, sleek, luxury 3D avatar aesthetic
 */
export function GoldFramedPortrait3D({
  imageSrc = '/chandu-3d-portrait.jpg',
  wavingImageSrc = '/chandu-waving.jpg',
  name = 'Chandu Challa',
}: GoldFramedPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasMountRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // References to communicate with Three.js animation loop
  const isHoveredRef = useRef(false)
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    isHoveredRef.current = isHovered
  }, [isHovered])

  // =========================================================================
  // THREE.JS 3D AVATAR & ARTICULATED HAND-WAVING STAGE
  // =========================================================================
  useEffect(() => {
    const mount = canvasMountRef.current
    if (!mount) return

    const width = mount.clientWidth || 360
    const height = mount.clientHeight || 450

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0, 5.4)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 2. Studio PBR Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 1.4)
    scene.add(ambientLight)

    // Key warm directional light
    const keyLight = new THREE.DirectionalLight(0xfef08a, 2.4)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    // Cool fill light for dimensional depth
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0)
    fillLight.position.set(-4, -2, 2)
    scene.add(fillLight)

    // Cinematic rim spotlight from top-back
    const rimLight = new THREE.SpotLight(0xf59e0b, 3.8)
    rimLight.position.set(0, 5, -2)
    rimLight.lookAt(0, 0, 0)
    scene.add(rimLight)

    // Master avatar group (reacts to cursor tilt and breathing)
    const avatarGroup = new THREE.Group()
    scene.add(avatarGroup)

    // 3. Avatar Portrait Planes (Resting & Waving Texture Blend)
    const textureLoader = new THREE.TextureLoader()
    const planeGeo = new THREE.PlaneGeometry(3.6, 2.02, 16, 16)

    // Rest texture
    const restMat = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.08,
      transparent: true,
      opacity: 1.0,
    })
    textureLoader.load(imageSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      restMat.map = tex
      restMat.needsUpdate = true
    })
    const restPlane = new THREE.Mesh(planeGeo, restMat)
    restPlane.position.set(0, 0.05, 0)
    avatarGroup.add(restPlane)

    // Waving texture (fades in on hover for photorealistic hand & facial greeting)
    const waveMat = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.08,
      transparent: true,
      opacity: 0.0,
    })
    textureLoader.load(wavingImageSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      waveMat.map = tex
      waveMat.needsUpdate = true
    })
    const wavePlane = new THREE.Mesh(planeGeo, waveMat)
    wavePlane.position.set(0, 0.05, 0.01)
    avatarGroup.add(wavePlane)

    // 4. Procedural Articulated 3D Waving Hand & Arm Hierarchy
    // Upper arm -> Forearm -> Wrist -> Palm -> 5 Articulated Fingers
    const armRoot = new THREE.Group()
    // Position on the character's right side (viewer's left)
    armRoot.position.set(-0.95, -0.25, 0.22)
    avatarGroup.add(armRoot)

    // PBR Skin Material
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xcf956c, // warm Indian skin tone matching Chandu's 3D portrait
      roughness: 0.38,
      metalness: 0.04,
    })

    // Navy Suit Sleeve Material
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x1a2436, // tailored navy blazer fabric
      roughness: 0.65,
      metalness: 0.12,
    })

    // Gold Button Accent
    const goldButtonMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85,
    })

    // Forearm with suit sleeve
    const forearmGroup = new THREE.Group()
    armRoot.add(forearmGroup)

    const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.55, 16)
    const sleeveMesh = new THREE.Mesh(sleeveGeo, suitMat)
    sleeveMesh.position.set(0, -0.28, 0)
    forearmGroup.add(sleeveMesh)

    // Gold sleeve button
    const buttonGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12)
    const buttonMesh = new THREE.Mesh(buttonGeo, goldButtonMat)
    buttonMesh.rotation.x = Math.PI / 2
    buttonMesh.position.set(0.11, -0.15, 0)
    forearmGroup.add(buttonMesh)

    // Wrist Joint Group
    const wristGroup = new THREE.Group()
    wristGroup.position.set(0, 0.02, 0)
    forearmGroup.add(wristGroup)

    // Wrist sphere
    const wristGeo = new THREE.SphereGeometry(0.09, 16, 16)
    const wristMesh = new THREE.Mesh(wristGeo, skinMat)
    wristGroup.add(wristMesh)

    // Palm Mesh
    const palmGeo = new THREE.BoxGeometry(0.24, 0.28, 0.08)
    const palmMesh = new THREE.Mesh(palmGeo, skinMat)
    palmMesh.position.set(0, 0.16, 0.01)
    wristGroup.add(palmMesh)

    // Helper to create an articulated finger with multiple phalanx segments
    interface FingerNode {
      group: THREE.Group
      proximal: THREE.Mesh
      intermediate?: THREE.Mesh
      distal: THREE.Mesh
    }

    const createFinger = (
      baseX: number,
      baseY: number,
      length: number,
      thickness: number,
      isThumb = false
    ): FingerNode => {
      const group = new THREE.Group()
      group.position.set(baseX, baseY, 0)

      const phalanxLen = isThumb ? length / 2 : length / 3

      // Proximal phalanx
      const proxGeo = new THREE.CapsuleGeometry(thickness, phalanxLen, 4, 8)
      const proxMesh = new THREE.Mesh(proxGeo, skinMat)
      proxMesh.position.set(0, phalanxLen / 2, 0)
      group.add(proxMesh)

      // Distal phalanx
      const distalGeo = new THREE.CapsuleGeometry(thickness * 0.9, phalanxLen * 0.85, 4, 8)
      const distalMesh = new THREE.Mesh(distalGeo, skinMat)
      distalMesh.position.set(0, phalanxLen * 1.35, 0)
      group.add(distalMesh)

      return {
        group,
        proximal: proxMesh,
        distal: distalMesh,
      }
    }

    // 5 Articulated 3D Fingers
    const thumb = createFinger(-0.12, 0.10, 0.18, 0.038, true)
    thumb.group.rotation.z = Math.PI / 4
    wristGroup.add(thumb.group)

    const indexFinger = createFinger(-0.08, 0.30, 0.26, 0.032)
    wristGroup.add(indexFinger.group)

    const middleFinger = createFinger(-0.01, 0.32, 0.28, 0.033)
    wristGroup.add(middleFinger.group)

    const ringFinger = createFinger(0.06, 0.30, 0.25, 0.031)
    wristGroup.add(ringFinger.group)

    const pinkyFinger = createFinger(0.12, 0.26, 0.21, 0.028)
    wristGroup.add(pinkyFinger.group)

    // Initial pose: hand lowered out of frame
    armRoot.position.y = -2.2
    armRoot.scale.set(0.85, 0.85, 0.85)

    // 5. Procedural Animation Loop with Spring Damping & Wave Kinematics
    let animId: number
    const clock = new THREE.Clock()

    // Smooth state interpolation variables
    let currentElevation = 0 // 0 = resting, 1 = waving elevated
    let currentCameraZ = 5.2

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      const isHov = isHoveredRef.current

      // A. Instagram-Style Camera Zoom-Out on Hover
      // Resting: 5.2 (close up portrait), Hovered: 6.1 (zoomed out to reveal body & waving hand)
      const targetCamZ = isHov ? 6.1 : 5.2
      currentCameraZ += (targetCamZ - currentCameraZ) * 0.07
      camera.position.z = currentCameraZ

      // B. Cross-dissolve between resting and waving textures
      const targetWaveOpacity = isHov ? 0.96 : 0.0
      waveMat.opacity += (targetWaveOpacity - waveMat.opacity) * 0.08
      restMat.opacity = 1.0 - waveMat.opacity * 0.7

      // C. Cursor-reactive head & torso tracking with damped spring physics
      const mouse = mousePosRef.current
      const targetHeadRotY = mouse.x * 0.22
      const targetHeadRotX = -mouse.y * 0.16
      avatarGroup.rotation.y += (targetHeadRotY - avatarGroup.rotation.y) * 0.06
      avatarGroup.rotation.x += (targetHeadRotX - avatarGroup.rotation.x) * 0.06

      // D. Organic Breathing / Idle Torso Respiration
      const breathY = Math.sin(time * 1.8) * 0.025
      restPlane.position.y = 0.05 + breathY
      wavePlane.position.y = 0.05 + breathY

      // E. Hand Elevation Spring Physics
      const targetElev = isHov ? 1.0 : 0.0
      currentElevation += (targetElev - currentElevation) * 0.08
      // Lerp from -2.2 (hidden) to 0.15 (waving beside cheek)
      armRoot.position.y = THREE.MathUtils.lerp(-2.2, 0.15, currentElevation)
      armRoot.position.x = THREE.MathUtils.lerp(-0.95, -0.82, currentElevation)

      // Only calculate waving kinematics when elevated
      if (currentElevation > 0.05) {
        // Natural wrist rotation: ~18 degrees harmonic wave
        const waveFreq = 6.2 // ~1.0 wave per second
        const wristSway = Math.sin(time * waveFreq) * 0.32
        const wristTwist = Math.cos(time * waveFreq) * 0.14

        wristGroup.rotation.z = wristSway
        wristGroup.rotation.y = wristTwist
        wristGroup.rotation.x = -0.15

        // Forearm lagging follow-through
        forearmGroup.rotation.z = Math.sin(time * waveFreq - 0.25) * 0.12

        // Individual Finger Articulation (harmonic wave ripple across fingers)
        indexFinger.group.rotation.x = Math.sin(time * waveFreq) * 0.16
        middleFinger.group.rotation.x = Math.sin(time * waveFreq + 0.2) * 0.20
        ringFinger.group.rotation.x = Math.sin(time * waveFreq + 0.4) * 0.22
        pinkyFinger.group.rotation.x = Math.sin(time * waveFreq + 0.6) * 0.25
        thumb.group.rotation.x = Math.cos(time * waveFreq) * 0.12
      } else {
        // Reset hand joints when idle
        wristGroup.rotation.set(0, 0, 0)
        forearmGroup.rotation.set(0, 0, 0)
      }

      renderer.render(scene, camera)
    }

    animate()

    // 6. Resize Handler
    const handleResize = () => {
      if (!mount) return
      const newW = mount.clientWidth || 360
      const newH = mount.clientHeight || 450
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      planeGeo.dispose()
      restMat.dispose()
      waveMat.dispose()
      skinMat.dispose()
      suitMat.dispose()
      goldButtonMat.dispose()
      renderer.dispose()
    }
  }, [imageSrc, wavingImageSrc])

  // =========================================================================
  // CURSOR & TOUCH INTERACTION
  // =========================================================================
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
    if (!isHovered) setIsHovered(true)

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    // Update 3D canvas mouse reference
    mousePosRef.current = { x: normX * 2, y: normY * 2 }

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
    mousePosRef.current = { x: 0, y: 0 }
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

    mousePosRef.current = { x: normX * 2, y: normY * 2 }

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
    setTimeout(() => {
      setIsHovered(false)
      mousePosRef.current = { x: 0, y: 0 }
      setTilt({ rotateX: 4, rotateY: -6 })
      setGlarePos((prev) => ({ ...prev, opacity: 0 }))
    }, 2200)
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
          scale: isHovered ? 0.92 : 1.0, // INSTAGRAM 3D AVATAR PROFILE ZOOM-OUT EFFECT
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 220, damping: 22 },
          rotateY: { type: 'spring', stiffness: 220, damping: 22 },
          scale: { type: 'spring', stiffness: 260, damping: 22 }, // Spring-based zoom transition
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#78350f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] transition-shadow duration-300"
      >
        {/* Outer Inset Shadow & Dark Bevel Recess */}
        <div className="w-full h-full rounded-[14px] p-2 sm:p-2.5 bg-[#0d0e12] border border-amber-500/40 relative overflow-hidden">
          {/* Inner Secondary Thin Gold Mat Border */}
          <div className="w-full h-full rounded-lg p-[2px] bg-gradient-to-tr from-amber-600/60 via-amber-300/80 to-amber-500/60 relative overflow-hidden">
            {/* The Interactive Three.js WebGL Avatar & Hand-Waving Canvas */}
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-black relative">
              <div ref={canvasMountRef} className="w-full h-full" />

              {/* Dynamic Mouse Glare Sweep (Metallic Sheen) */}
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

              {/* Elegant Gold Cursive Signature in Bottom Right Corner (Exact Replica of Instagram / Image 2 style) */}
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
