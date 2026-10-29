import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  FolderGit2,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpRight,
  Cpu,
  MessageSquareCode,
  AudioWaveform,
  ScanEye,
  Terminal,
  Play,
  Pause,
  LayoutGrid,
  Maximize2,
  Activity,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import type { ProjectItem } from '../../types/portfolio'
import { MotionCard, AnimatedSectionHeader } from '../ui/MotionCard'
import { Magnetic } from '../ui/Magnetic'

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

/* =========================================================================
   1. YOLO Computer Vision Interactive Preview
   Features: Cursor-following tracking reticle, Camera Feed Switcher, Intrusion Alert
   ========================================================================= */
function YoloInteractivePreview() {
  const [feed, setFeed] = useState<'CAM-01' | 'CAM-02' | 'INFRARED'>('CAM-01')
  const [alertActive, setAlertActive] = useState(false)
  const [reticlePos, setReticlePos] = useState({ x: 0, y: 0, isHovering: false })
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(20, Math.min(rect.width - 90, e.clientX - rect.left - 45))
    const y = Math.max(20, Math.min(rect.height - 55, e.clientY - rect.top - 25))
    setReticlePos({ x, y, isHovering: true })
  }

  const handleMouseLeave = () => {
    setReticlePos((prev) => ({ ...prev, isHovering: false }))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(15, Math.min(rect.width - 90, touch.clientX - rect.left - 45))
    const y = Math.max(15, Math.min(rect.height - 55, touch.clientY - rect.top - 25))
    setReticlePos({ x, y, isHovering: true })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className="relative w-full h-48 rounded-2xl bg-[#060a12] border border-cyan-500/30 overflow-hidden p-3 flex flex-col justify-between font-mono select-none"
    >
      {/* Top Camera Status & Stream Controls */}
      <div className="flex items-center justify-between text-[10px] z-20">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              alertActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-cyan-300 font-semibold">{feed} // 1080P 60FPS</span>
        </div>

        {/* Camera Feed Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
          {(['CAM-01', 'CAM-02', 'INFRARED'] as const).map((cam) => (
            <button
              key={cam}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFeed(cam)
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] transition cursor-pointer ${
                feed === cam
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cam.replace('CAM-', 'C')}
            </button>
          ))}
        </div>
      </div>

      {/* Crosshair / Scanning Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Dynamic Bounding Box: Tracks Cursor when Hovered, otherwise glides autonomously */}
      <motion.div
        animate={
          reticlePos.isHovering
            ? { x: reticlePos.x, y: reticlePos.y }
            : {
                x: [25, 120, 65, 25],
                y: [28, 42, 18, 28],
                scale: [1, 1.05, 0.96, 1],
              }
        }
        transition={
          reticlePos.isHovering
            ? { type: 'spring', stiffness: 320, damping: 28 }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
        className={`absolute w-36 h-20 rounded-lg border-2 ${
          alertActive
            ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_20px_rgba(244,63,94,0.45)]'
            : 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
        } p-1.5 z-10 pointer-events-none`}
      >
        <div
          className={`absolute -top-3 left-1 px-1.5 py-0.5 rounded ${
            alertActive ? 'bg-rose-500' : 'bg-cyan-500'
          } text-slate-950 font-bold text-[8px] uppercase tracking-wider flex items-center gap-1`}
        >
          <span>{alertActive ? 'INTRUSION ALERT' : 'TARGET: PERSON'}</span>
          <span>96%</span>
        </div>
        <div className="w-full h-full border border-dashed border-cyan-300/30 rounded flex items-center justify-center text-[9px] text-cyan-200">
          [LOCK: ACTIVE]
        </div>
      </motion.div>

      {/* Bottom Status Bar with Intrusion Simulation Trigger */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1.5 border-t border-slate-900 z-20">
        <span className="text-cyan-400">LATENCY: 12.4ms</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setAlertActive((prev) => !prev)
          }}
          className={`px-2 py-0.5 rounded text-[9px] font-semibold transition cursor-pointer ${
            alertActive
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800'
          }`}
        >
          {alertActive ? 'Clear Intrusion' : 'Simulate Intrusion'}
        </button>
      </div>
    </div>
  )
}

/* =========================================================================
   2. Live NLP Toxic Span Detector & Attention Scanner Preview (Project 2)
   Features: Sweeping neural scanner laser, live token attention weights,
   animated confidence gauge, real-time TF-IDF vector activation matrix
   ========================================================================= */
function NlpInteractivePreview() {
  const [sampleIdx, setSampleIdx] = useState(0)
  const [isScanning, setIsScanning] = useState(true)

  const samples = [
    {
      text: [
        { word: 'This', toxic: false, weight: '0.04' },
        { word: 'implementation', toxic: false, weight: '0.06' },
        { word: 'is', toxic: false, weight: '0.02' },
        { word: 'completely', toxic: false, weight: '0.08' },
        { word: 'garbage', toxic: true, weight: '0.94' },
        { word: 'and', toxic: false, weight: '0.03' },
        { word: 'worthless', toxic: true, weight: '0.89' },
      ],
      score: '93.4%',
      risk: 'HIGH RISK',
      riskColor: 'text-rose-400 bg-rose-950/40 border-rose-500/40',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      text: [
        { word: 'Refactoring', toxic: false, weight: '0.03' },
        { word: 'the', toxic: false, weight: '0.01' },
        { word: 'attention', toxic: false, weight: '0.05' },
        { word: 'layers', toxic: false, weight: '0.04' },
        { word: 'improved', toxic: false, weight: '0.02' },
        { word: 'overall', toxic: false, weight: '0.02' },
        { word: 'latency', toxic: false, weight: '0.03' },
      ],
      score: '4.2%',
      risk: 'CLEAN',
      riskColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ]

  const active = samples[sampleIdx]

  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#060a14] border border-indigo-500/35 overflow-hidden p-3.5 flex flex-col justify-between font-mono select-none shadow-lg shadow-indigo-950/30">
      {/* Top Header & Neural Status */}
      <div className="flex items-center justify-between text-[10px] z-10">
        <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
          <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>NLP ATTENTION SCANNER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 hidden sm:inline">512-D TF-IDF</span>
          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${active.badgeColor}`}>
            {active.score} {active.risk}
          </span>
        </div>
      </div>

      {/* Main Interactive Token Stream with Continuous Sweeping Scanning Laser */}
      <div className="relative my-auto py-1">
        {/* Sweeping Laser Scanner Beam */}
        <motion.div
          animate={isScanning ? { x: ['-10%', '110%', '-10%'] } : { x: '50%' }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-8 pointer-events-none z-10 opacity-70"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.45) 50%, rgba(244, 63, 94, 0.7) 100%)',
            filter: 'blur(2px)',
          }}
        />

        {/* Tokens Container */}
        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-wrap gap-1.5 items-center relative overflow-hidden">
          {active.text.map((token, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className={`relative px-1.5 py-1 rounded text-xs transition-all flex flex-col items-center cursor-default ${
                token.toxic
                  ? 'bg-rose-500/25 border border-rose-500 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.35)] animate-pulse'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-indigo-400/50'
              }`}
            >
              <span className="text-[8px] font-mono opacity-70 leading-none mb-0.5">
                {token.weight}
              </span>
              <span>{token.word}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Attention Vector Bar Matrix */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[9px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            <span>NEURAL SPAN OFFSET MAP</span>
          </span>
          <span className="text-cyan-300">LATENCY: 6.8ms // LINEARSVC</span>
        </div>

        {/* Animated Vector Weights Micro-Equalizer */}
        <div className="h-2 w-full flex items-end gap-1 px-1 bg-slate-950 rounded-md border border-slate-900 overflow-hidden">
          {[0.15, 0.4, 0.25, 0.85, 0.95, 0.35, 0.7, 0.9, 0.2, 0.6, 0.85, 0.3, 0.95, 0.4].map(
            (val, idx) => (
              <motion.div
                key={idx}
                animate={
                  isScanning
                    ? { height: ['20%', `${Math.round(val * 100)}%`, '30%'] }
                    : { height: '25%' }
                }
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: idx * 0.08,
                  ease: 'easeInOut',
                }}
                className={`flex-1 rounded-t ${
                  val > 0.8 ? 'bg-rose-500' : 'bg-indigo-500/80'
                }`}
              />
            )
          )}
        </div>
      </div>

      {/* Interactive Controls & Sample Selector */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1.5 border-t border-slate-900/90">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsScanning((prev) => !prev)
          }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-indigo-300 font-semibold cursor-pointer border border-slate-800"
        >
          {isScanning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isScanning ? 'Scanning' : 'Pause'}</span>
        </button>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSampleIdx(0)
            }}
            className={`px-2 py-0.5 rounded transition cursor-pointer text-[8px] font-semibold ${
              sampleIdx === 0
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Sample A (Toxic)
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSampleIdx(1)
            }}
            className={`px-2 py-0.5 rounded transition cursor-pointer text-[8px] font-semibold ${
              sampleIdx === 1
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Sample B (Clean)
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   3. Live Audio MFCC Spectrogram & Waveform Visualizer Preview (Project 3)
   Features: 20-band dancing MFCC equalizer with floating peak caps,
   live oscillating audio sine waveform, rotating acoustic disc, BPM counter
   ========================================================================= */
function AudioInteractivePreview() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [genre, setGenre] = useState<'Jazz' | 'Electronic' | 'Classical' | 'Rock'>('Jazz')

  const genreProfiles = {
    Jazz: {
      bars: [0.4, 0.85, 0.6, 0.95, 0.7, 0.8, 0.45, 0.75, 0.9, 0.55, 0.85, 0.65, 0.4, 0.88, 0.5, 0.78, 0.6, 0.82, 0.45, 0.7],
      bpm: '124 BPM',
      conf: '94.2%',
      accent: 'from-amber-400 via-yellow-400 to-amber-600',
    },
    Electronic: {
      bars: [0.95, 0.9, 0.85, 1, 0.8, 0.95, 0.7, 0.85, 1, 0.9, 0.8, 0.75, 0.9, 0.95, 0.85, 0.9, 0.95, 0.8, 0.88, 0.92],
      bpm: '138 BPM',
      conf: '98.6%',
      accent: 'from-cyan-400 via-sky-400 to-indigo-500',
    },
    Classical: {
      bars: [0.55, 0.4, 0.35, 0.5, 0.45, 0.38, 0.28, 0.35, 0.42, 0.3, 0.48, 0.35, 0.25, 0.38, 0.4, 0.32, 0.28, 0.34, 0.22, 0.3],
      bpm: '88 BPM',
      conf: '91.8%',
      accent: 'from-emerald-400 via-teal-400 to-cyan-500',
    },
    Rock: {
      bars: [0.85, 0.78, 0.92, 0.88, 0.95, 0.82, 0.9, 0.85, 0.78, 0.92, 0.88, 0.84, 0.9, 0.86, 0.92, 0.85, 0.8, 0.88, 0.82, 0.78],
      bpm: '142 BPM',
      conf: '96.1%',
      accent: 'from-rose-500 via-amber-400 to-orange-500',
    },
  }

  const profile = genreProfiles[genre]

  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#060a14] border border-sky-500/35 overflow-hidden p-3.5 flex flex-col justify-between font-mono select-none shadow-lg shadow-sky-950/30">
      {/* Top Status Header */}
      <div className="flex items-center justify-between text-[10px] z-10">
        <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
          <AudioWaveform className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>LIBROSA MFCC SPECTRUM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400">{profile.bpm}</span>
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-bold">
            {genre.toUpperCase()} {profile.conf}
          </span>
        </div>
      </div>

      {/* Main Dual-Layer Visualizer: Dancing 20-Band Equalizer + Live Audio Sine Waveform */}
      <div className="my-auto relative h-20 bg-slate-950/85 rounded-xl border border-slate-800/80 p-2 flex flex-col justify-end overflow-hidden">
        {/* Background Live Oscillating Audio Sine Waveform (Acoustic Time Domain) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg className="w-full h-12" preserveAspectRatio="none" viewBox="0 0 100 20">
            <motion.path
              d="M 0 10 Q 12 2, 25 10 T 50 10 T 75 10 T 100 10"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              animate={
                isPlaying
                  ? {
                      d: [
                        'M 0 10 Q 12 2, 25 10 T 50 10 T 75 10 T 100 10',
                        'M 0 10 Q 12 18, 25 10 T 50 10 T 75 10 T 100 10',
                        'M 0 10 Q 12 2, 25 10 T 50 10 T 75 10 T 100 10',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        </div>

        {/* 20 MFCC Frequency Bands with Floating Peak Caps */}
        <div className="relative z-10 w-full h-full flex items-end justify-between gap-1">
          {profile.bars.map((val, idx) => (
            <div key={`${genre}-${idx}`} className="flex-1 h-full flex flex-col justify-end items-center relative">
              {/* Floating Peak Cap */}
              <motion.span
                animate={
                  isPlaying
                    ? {
                        bottom: [`${Math.round(val * 85 + 10)}%`, `${Math.round(val * 95)}%`, `${Math.round(val * 70)}%`],
                      }
                    : { bottom: '20%' }
                }
                transition={{
                  duration: isPlaying ? 0.7 : 0.2,
                  repeat: isPlaying ? Infinity : 0,
                  delay: idx * 0.04,
                  ease: 'easeInOut',
                }}
                className="absolute w-full h-[2px] bg-white rounded-full shadow-[0_0_6px_#fff]"
              />

              {/* Main Equalizer Bar */}
              <motion.span
                animate={
                  isPlaying
                    ? {
                        height: ['15%', `${Math.round(val * 100)}%`, '22%'],
                      }
                    : { height: '18%' }
                }
                transition={{
                  duration: isPlaying ? 0.7 : 0.2,
                  repeat: isPlaying ? Infinity : 0,
                  delay: idx * 0.04,
                  ease: 'easeInOut',
                }}
                className={`w-full rounded-t bg-gradient-to-t ${profile.accent} shadow-[0_0_8px_rgba(56,189,248,0.25)]`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DSP Frequency & Feature Line */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 px-0.5">
        <span>SAMPLE: 22.05 kHz</span>
        <span className="text-sky-300">MFCC[0..19]: 20 CHANNELS</span>
        <span>FFT: 2048</span>
      </div>

      {/* Interactive Controls & Genre Switcher */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1.5 border-t border-slate-900/90">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsPlaying((prev) => !prev)
          }}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-sky-300 font-semibold cursor-pointer border border-slate-800"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <div className="flex gap-1">
          {(['Jazz', 'Electronic', 'Classical', 'Rock'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setGenre(g)
              }}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer text-[8px] font-semibold ${
                genre === g
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   4. Chatbot / Generative AI Interactive Preview
   Features:
   - Real-time token streaming typewriter simulation
   - Active neural latency & velocity readout (48 tok/s, 24ms latency)
   - LangChain pipeline node chain with traveling data packet:
     User Prompt -> BufferMemory -> PromptTemplate -> LLM
   - Dynamic prompt presets with instant re-streaming
   ========================================================================= */
const CHATBOT_PROMPTS = [
  {
    q: 'Explain LangChain Memory',
    fullText:
      'ConversationBufferMemory persists previous dialogue turns into prompt context window, maintaining multi-turn coherence.',
    tokens: 18,
    latency: '24ms',
  },
  {
    q: 'Streamlit session_state',
    fullText:
      'Streamlit reruns on every user interaction; st.session_state stores mutable conversational context across re-executions.',
    tokens: 22,
    latency: '31ms',
  },
  {
    q: 'Prompt Template Schema',
    fullText:
      'ChatPromptTemplate combines SystemMessage and MessagesPlaceholder to dynamically inject conversational history into the LLM.',
    tokens: 20,
    latency: '28ms',
  },
]

function ChatbotInteractivePreview() {
  const [promptIdx, setPromptIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState(CHATBOT_PROMPTS[0].fullText)
  const [isTyping, setIsTyping] = useState(false)
  const [tokCount, setTokCount] = useState(CHATBOT_PROMPTS[0].tokens)

  const handleSelectPrompt = (idx: number) => {
    if (idx === promptIdx && isTyping) return
    setPromptIdx(idx)
    setIsTyping(true)
    setDisplayedText('')
    setTokCount(0)

    const targetText = CHATBOT_PROMPTS[idx].fullText
    let charIdx = 0
    const interval = setInterval(() => {
      charIdx += 3
      if (charIdx >= targetText.length) {
        setDisplayedText(targetText)
        setIsTyping(false)
        setTokCount(CHATBOT_PROMPTS[idx].tokens)
        clearInterval(interval)
      } else {
        setDisplayedText(targetText.slice(0, charIdx))
        setTokCount(Math.ceil((charIdx / targetText.length) * CHATBOT_PROMPTS[idx].tokens))
      }
    }, 28)
  }

  const cur = CHATBOT_PROMPTS[promptIdx]

  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#060a12] border border-emerald-500/35 overflow-hidden p-3.5 flex flex-col justify-between font-mono select-none shadow-lg shadow-emerald-950/30">
      {/* Top Status Header */}
      <div className="flex items-center justify-between text-[10px] z-10">
        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>LANGCHAIN STREAMLIT AGENT</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-slate-400">LATENCY: {cur.latency}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isTyping ? 'animate-ping' : ''}`} />
            {isTyping ? 'STREAMING...' : 'GENERATED'}
          </span>
        </div>
      </div>

      {/* LangChain Node Pipeline Chain with traveling data packet */}
      <div className="relative py-1 px-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 overflow-hidden">
        <span className="text-cyan-300 font-bold">1. USER</span>
        <span>→</span>
        <span className="text-emerald-300 font-bold">2. MEMORY [K=4]</span>
        <span>→</span>
        <span className="text-purple-300 font-bold">3. PROMPT_TMPL</span>
        <span>→</span>
        <span className="text-amber-300 font-bold">4. LLM</span>

        {/* Traveling glowing packet along the pipeline */}
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] pointer-events-none opacity-70"
        />
      </div>

      {/* Dialogue Streaming Bubble Area */}
      <div className="my-auto space-y-1.5 text-[11px] overflow-hidden">
        {/* User Query Pill */}
        <div className="flex items-center justify-end">
          <span className="px-2.5 py-0.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-[10px]">
            &gt; {cur.q}
          </span>
        </div>

        {/* AI Streaming Response with blinking cursor */}
        <div className="flex items-start gap-1.5">
          <div className="p-0.5 px-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[8px] font-bold shrink-0 mt-0.5 flex items-center gap-1">
            <span>AI</span>
            {isTyping && (
              <span className="flex gap-0.5">
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse delay-75" />
              </span>
            )}
          </div>
          <p className="px-2.5 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 text-slate-200 text-[10px] leading-relaxed relative flex-1 min-h-[38px]">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Interactive Controls & Prompt Switcher */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-900">
        <span className="text-emerald-400 font-semibold">{tokCount} TOKENS GENERATED</span>

        <div className="flex gap-1">
          {CHATBOT_PROMPTS.map((p, idx) => (
            <button
              key={p.q}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectPrompt(idx)
              }}
              className={`px-2 py-0.5 rounded transition cursor-pointer text-[8px] font-semibold ${
                promptIdx === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {idx === 0 ? 'Memory' : idx === 1 ? 'State' : 'Template'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectPreviewVisual({
  type,
  title,
}: {
  type?: string
  title: string
}) {
  const norm = (type || '').toLowerCase()
  const t = (title || '').toLowerCase()

  // 1. Audio MFCC Acoustic Waveform Analyzer
  if (norm.includes('audio') || norm.includes('genre') || norm.includes('music') || t.includes('genre') || t.includes('music') || t.includes('audio')) {
    return <AudioInteractivePreview />
  }
  // 2. Computer Vision YOLOv8 Real-Time Scanner
  if (norm.includes('vision') || norm.includes('yolo') || t.includes('yolo') || t.includes('theft') || t.includes('vision') || t.includes('object')) {
    return <YoloInteractivePreview />
  }
  // 3. Toxic Span & Text Classification Tokenizer
  if (norm.includes('toxic') || t.includes('toxic') || t.includes('span') || (norm.includes('nlp') && !t.includes('chat'))) {
    return <NlpInteractivePreview />
  }
  // 4. Conversational AI Chatbot (LangChain & Streamlit)
  return <ChatbotInteractivePreview />
}

export function ProjectsSection() {
  const { data } = usePortfolio()
  const projectsList = data.projects || data.featuredProjects || []
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('grid')
  const [showcaseIndex, setShowcaseIndex] = useState(0)

  const categories = ['All', ...Array.from(new Set(projectsList.map((p) => p.category)))]

  const filteredProjects =
    selectedCategory === 'All'
      ? projectsList
      : projectsList.filter((p) => p.category === selectedCategory)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null)
    }
    if (activeProject) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeProject])

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase()
    if (c.includes('vision')) return ScanEye
    if (c.includes('audio')) return AudioWaveform
    if (c.includes('nlp')) return MessageSquareCode
    return Cpu
  }

  const activeShowcaseProj =
    filteredProjects[showcaseIndex] || filteredProjects[0] || projectsList[0]

  return (
    <section
      id="projects"
      aria-label="Engineered Projects & Prototypes"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/15 overflow-hidden bg-transparent"
    >
      {/* Background ambient animated lighting */}
      <div
        className="absolute top-1/4 -right-24 w-[34rem] h-[34rem] pointer-events-none opacity-30 animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 -left-24 w-[32rem] h-[32rem] pointer-events-none opacity-25 animate-drift-light"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.16) 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <AnimatedSectionHeader
            badgeNumber="03"
            badgeLabel="Featured AI/ML Projects"
            title="Interactive AI & Machine Learning Engineering"
            subtitle="Explore practical machine learning and full-stack systems with interactive live previews, codebase walk-throughs, and technical breakdowns."
            icon={<FolderGit2 className="w-3.5 h-3.5" />}
          />

          {/* View Mode & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>3D Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('showcase')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  viewMode === 'showcase'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Cinematic Lab</span>
              </button>
            </div>

            {/* Category Filter Pills (Touch scrollable on mobile) */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat)
                    setShowcaseIndex(0)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            VIEW MODE 1: CINEMATIC SHOWCASE (Large Interactive Laboratory)
            ========================================================================= */}
        {viewMode === 'showcase' && activeShowcaseProj && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-slate-900/80 border border-cyan-500/40 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
          >
            {/* Top Lab Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                  ACTIVE LAB ENVIRONMENT // {activeShowcaseProj.category}
                </span>
              </div>

              {/* Showcase project thumbnails navigator */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {filteredProjects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setShowcaseIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                      showcaseIndex === idx
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    0{idx + 1} • {proj.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Showcase Main Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              {/* Left Column: Interactive Simulation */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl">
                  <ProjectPreviewVisual
                    type={activeShowcaseProj.previewVisualType || activeShowcaseProj.visualType}
                    title={activeShowcaseProj.title}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400 text-center">
                  Tip: Interact with controls, switch camera feeds, or test live AI prompt token streams inside the viewport.
                </p>
              </div>

              {/* Right Column: Project Details & Case Study Deep-Dive */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                    {activeShowcaseProj.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeShowcaseProj.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {activeShowcaseProj.shortDescription}
                  </p>
                </div>

                {/* Features Checklist */}
                {(activeShowcaseProj.keyFeatures || activeShowcaseProj.features || []).length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {(activeShowcaseProj.keyFeatures || activeShowcaseProj.features || [])
                      .slice(0, 3)
                      .map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                  </ul>
                )}

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeShowcaseProj.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Case Study Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveProject(activeShowcaseProj)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 text-slate-950 font-semibold text-xs transition cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <span>Full Engineering Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <a
                    href={activeShowcaseProj.githubUrl || 'https://github.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
                  >
                    <GithubIcon className="w-4 h-4 text-cyan-400" />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            VIEW MODE 2: 3D SPOTLIGHT GRID WITH CARD DEPTH & STAGGERED PARALLAX
            ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredProjects.map((project, index) => {
              const CategoryIcon = getCategoryIcon(project.category)
              const features = project.keyFeatures || project.features || []
              const visualType = project.previewVisualType || project.visualType || 'vision'

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : (index % 2) * 0.12,
                    ease: 'easeOut',
                  }}
                >
                  <MotionCard tiltStrength={6} hasBorderBeam={index === 0} glowColor="cyan">
                    <div className="flex flex-col justify-between h-full bg-[#0d1322]/85 border border-slate-800/90 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-colors group relative">
                      {/* ThreeUI Corner Brackets */}
                      <span className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono text-slate-700 group-hover:text-cyan-400/70 transition-colors">
                        ⌜
                      </span>
                      <span className="pointer-events-none absolute top-3 right-3 text-[9px] font-mono text-slate-700 group-hover:text-cyan-400/70 transition-colors">
                        ⌝
                      </span>
                      <span className="pointer-events-none absolute bottom-3 left-3 text-[9px] font-mono text-slate-700 group-hover:text-cyan-400/70 transition-colors">
                        ⌞
                      </span>
                      <span className="pointer-events-none absolute bottom-3 right-3 text-[9px] font-mono text-slate-700 group-hover:text-cyan-400/70 transition-colors">
                        ⌟
                      </span>

                      {/* Visual Interactive Preview Header */}
                      <div className="p-5 pb-3">
                        <ProjectPreviewVisual type={visualType} title={project.title} />
                      </div>

                      {/* Body Content */}
                      <div className="p-6 pt-2 space-y-4 text-left flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                              <CategoryIcon className="w-3 h-3 text-cyan-400" />
                              <span>{project.category}</span>
                            </span>
                            {project.projectTypeBadge && (
                              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                                {project.projectTypeBadge}
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                            {project.title}
                          </h3>

                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {project.shortDescription}
                          </p>
                        </div>

                        {/* Features Snippet */}
                        {features.length > 0 && (
                          <ul className="space-y-1.5 pt-1">
                            {features.slice(0, 2).map((feat, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-slate-400"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tech Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        <Magnetic strength={0.25} radius={80}>
                          <button
                            type="button"
                            onClick={() => setActiveProject(project)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
                          >
                            <span>Explore Full Case Study</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </Magnetic>

                        <div className="flex items-center gap-3">
                          {project.liveDemoUrl && project.liveDemoUrl.trim() !== '' && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Demo</span>
                            </a>
                          )}

                          <a
                            href={project.githubIsPlaceholder ? '#projects' : project.githubUrl}
                            onClick={(e) => {
                              if (project.githubIsPlaceholder) {
                                e.preventDefault()
                                setActiveProject(project)
                              }
                            }}
                            target={project.githubIsPlaceholder ? undefined : '_blank'}
                            rel={project.githubIsPlaceholder ? undefined : 'noopener noreferrer'}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
                          >
                            <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Source Code</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </MotionCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Case Study Deep-Dive Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b101d] border border-cyan-500/35 shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 text-left">
                <div>
                  <span className="px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 font-mono text-xs text-cyan-300 font-semibold">
                    {activeProject.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
                    {activeProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Problem Statement and Personal Contribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                  <p className="font-mono text-xs uppercase text-cyan-400">Problem Statement</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeProject.problemStatement || activeProject.problemSolved}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                  <p className="font-mono text-xs uppercase text-emerald-400">
                    My Actual Contribution
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeProject.myContribution}
                  </p>
                </div>
              </div>

              {/* Implementation Workflow Steps */}
              {activeProject.workflowSteps && activeProject.workflowSteps.length > 0 && (
                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3 text-left">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase text-indigo-400">
                    <Layers className="w-4 h-4" />
                    <span>Implementation Workflow</span>
                  </div>
                  <ol className="space-y-2">
                    {activeProject.workflowSteps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 font-mono text-[11px] text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Key Features & Lessons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {(activeProject.keyFeatures || activeProject.features || []).length > 0 && (
                  <div className="space-y-2">
                    <p className="font-mono text-xs uppercase text-slate-400">Key Features</p>
                    <ul className="space-y-2">
                      {(activeProject.keyFeatures || activeProject.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeProject.challengesAndLessons && activeProject.challengesAndLessons.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-mono text-xs uppercase text-amber-400">Engineering Lessons</p>
                    <ul className="space-y-2">
                      {activeProject.challengesAndLessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Technologies in Modal */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {activeProject.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
