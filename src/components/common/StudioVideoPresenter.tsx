import { useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Volume2, VolumeX, Play, Pause, ShieldCheck } from 'lucide-react'

interface StudioVideoPresenterProps {
  videoSrc?: string
  posterSrc?: string
  name?: string
  university?: string
}

/**
 * Borderless Studio Video Presenter
 * Renders the 1080p walking video directly onto the page canvas with ZERO boxes or card borders.
 * Uses feathered radial and linear gradient alpha masks to blend the studio background
 * completely into the website's dark canvas.
 */
export function StudioVideoPresenter({
  videoSrc = '/hero-walking.mp4',
  posterSrc = '/chandu-3d-portrait.jpg',
  name = 'Chandu Challa',
}: StudioVideoPresenterProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play().catch(() => {
      video.muted = true
      setIsMuted(true)
      video.play().catch(() => setIsPlaying(false))
    })
  }, [])

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({
      rotateX: -normY * 8,
      rotateY: normX * 10,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1100px' }}
      className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-[3/4] sm:aspect-[4/5] mx-auto flex items-center justify-center select-none"
    >
      {/* 1. Volumetric Studio Atmospheric Backlighting (Cyan & Indigo) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-sky-500/10 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-400/10 blur-[100px] pointer-events-none rounded-full" />

      {/* 2. Seamless Perspective Studio Floor Reflection Grid */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 50% at 50% 90%, rgba(6, 182, 212, 0.12), transparent 70%)',
        }}
      />

      {/* 3. Borderless 3D Interactive Video Canvas */}
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: prefersReducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 200, damping: 22 },
          rotateY: { type: 'spring', stiffness: 200, damping: 22 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {!videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center pointer-events-auto"
            style={{
              // Multi-stage radial feather: 100% borderless, melts into the page background
              maskImage:
                'radial-gradient(ellipse 72% 78% at 50% 48%, black 48%, rgba(0,0,0,0.85) 62%, transparent 92%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 72% 78% at 50% 48%, black 48%, rgba(0,0,0,0.85) 62%, transparent 92%)',
            }}
          />
        ) : (
          <img
            src={posterSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
            style={{
              maskImage:
                'radial-gradient(ellipse 72% 78% at 50% 48%, black 48%, rgba(0,0,0,0.85) 62%, transparent 92%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 72% 78% at 50% 48%, black 48%, rgba(0,0,0,0.85) 62%, transparent 92%)',
            }}
          />
        )}

        {/* 4. Floating Holographic Telemetry Badges (NO BOXES - Floating directly in space) */}
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 backdrop-blur-md shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold">
            Live Presenter // 1080P
          </span>
        </motion.div>

        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="hidden sm:flex absolute bottom-12 right-2 z-20 items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 backdrop-blur-md shadow-lg"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[10px] text-slate-300">
            Chandu Challa • AI/ML Rig
          </span>
        </motion.div>

        {/* 5. Minimalist Floating Audio & Playback Pill (Unobtrusive) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/90 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1 rounded-lg text-slate-300 hover:text-cyan-300 transition cursor-pointer"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="w-[1px] h-3 bg-slate-800" />

          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded-lg text-slate-300 hover:text-cyan-300 transition cursor-pointer flex items-center gap-1.5"
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="text-[10px] font-mono text-slate-400">
              {isMuted ? 'Muted' : 'Audio On'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
