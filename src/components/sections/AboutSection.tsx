import { motion } from 'motion/react'
import {
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  Cpu,
  Terminal,
  CheckCircle2,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { GoldFramedPortrait3D } from '../common/GoldFramedPortrait3D'
import { staggerContainerVariant, fadeUpVariant } from '../../utils/animations'
import { BentoCard } from '../ui/BentoGrid'
import { InteractiveTerminal } from '../ui/InteractiveTerminal'

export function AboutSection() {
  const { data } = usePortfolio()
  const { profileData } = data

  const stats = [
    {
      value: '4',
      label: 'AI/ML Systems',
      sublabel: 'Vision, NLP, Audio & AI Chat',
    },
    {
      value: data.education?.[0]?.grade || '7.65',
      label: 'B.Tech CGPA',
      sublabel: 'Consistent Academic Record',
    },
    {
      value: '100%',
      label: 'Hands-On Code',
      sublabel: 'Python & Modern Web',
    },
    {
      value: '2025',
      label: 'Graduation Year',
      sublabel: 'Malla Reddy University',
    },
  ]

  return (
    <section
      id="about"
      aria-label="About Chandu Challa — Story & 3D Avatar"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-amber-500/15 overflow-hidden bg-transparent"
    >
      {/* Background Atmospheric Animated Golden Flares & Orbital Motions */}
      <div
        className="absolute top-1/3 -left-40 w-[32rem] h-[32rem] pointer-events-none opacity-40 z-0 animate-aurora-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute top-1/2 -right-40 w-[34rem] h-[34rem] pointer-events-none opacity-35 z-0 animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      {/* Dynamic Animated Ambient Orbital Rings */}
      <div className="absolute top-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full border border-amber-500/10 pointer-events-none animate-spin-slow z-0" />
      <div className="absolute bottom-10 left-1/4 w-[22rem] h-[22rem] rounded-full border border-amber-400/10 pointer-events-none animate-spin-slow [animation-direction:reverse] z-0" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Main 2-Column Composition (Matching Image 2 from the Reel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: Monumental Headline, Bio Narrative, and Metrics Row */}
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            {/* Tagline */}
            <motion.div variants={fadeUpVariant} className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300/90 font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ABOUT CHANDU CHALLA
              </span>
            </motion.div>

            {/* Monumental Stacked Headline (Exact Image 2 Replica, Smooth Balanced Tone) */}
            <motion.div variants={fadeUpVariant} className="space-y-0.5 select-none">
              <h2 className="font-display font-normal text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-[0.02em] leading-[0.96] text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde68a] via-[#eab308] to-[#b45309] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="block break-words sm:whitespace-nowrap">I DON&apos;T JUST WRITE CODE.</span>
                <span className="block break-words sm:whitespace-nowrap">I BUILD WHAT&apos;S NEXT.</span>
              </h2>
            </motion.div>

            {/* Bio Narrative with Highlighted Gold Keywords (Exact Image 2 Style) */}
            <motion.div variants={fadeUpVariant} className="space-y-4 max-w-2xl text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                I&apos;m{' '}
                <strong className="text-amber-300 font-semibold">Chandu Challa</strong>, an AI &amp;
                Machine Learning Engineer and Computer Science graduate from{' '}
                <strong className="text-amber-200 font-semibold">Malla Reddy University</strong>{' '}
                specializing in building real-time computer vision architectures, deep learning neural
                models, and scalable full-stack intelligent systems. With a strong algorithmic
                foundation and a focus on clean engineering, I turn complex requirements into impactful
                products.
              </p>

              <p className="text-sm sm:text-base text-slate-400">
                Rather than treating deep learning as an abstract concept, I develop real prototypes:
                single-stage real-time object/theft detection with YOLOv8, attention-based toxic span
                extraction, and GTZAN audio spectrum classification with Librosa.
              </p>
            </motion.div>

            {/* Horizontal Stats / Metrics Row (Matching Image 2 with 4 metrics) */}
            <motion.div
              variants={fadeUpVariant}
              className="pt-4 border-t border-amber-500/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left"
            >
              {stats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#fcd34d] to-[#d97706] tracking-tight">
                    {s.value}
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-amber-200/90 font-medium">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block">
                    {s.sublabel}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Direct Link to Deep Engineering Details */}
            <motion.div variants={fadeUpVariant} className="pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-300 hover:text-white transition group"
              >
                <span>Explore Featured Engineering Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: The 3D Avatar in the Luxury Beveled Gold Frame (Exact Image 2 Replica) */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <GoldFramedPortrait3D
              imageSrc="/chandu-3d-portrait.jpg"
              name={profileData.name}
            />
          </motion.div>
        </div>

        {/* =========================================================================
            21st.dev & ThreeUI Engineering Bento Grid
            Interactive Developer Terminal + Academic Radar + Production Systems
            ========================================================================= */}
        <div className="pt-10 border-t border-amber-500/15 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer Telemetry &amp; System Architecture</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Interactive Terminal // Click tabs to inspect live code
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: Interactive Terminal */}
            <div className="lg:col-span-7 h-full flex flex-col justify-center">
              <InteractiveTerminal />
            </div>

            {/* Right 5 Cols: 2 Bento Cards */}
            <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
              {/* Card 1: Academic Credentials */}
              <BentoCard
                badge="ACADEMIC FOUNDATION"
                icon={<GraduationCap className="w-5 h-5" />}
                title="B.Tech in CSE (AI & ML)"
                description="Graduated in 2025 from Malla Reddy University with a 7.65 CGPA, specializing in computer vision, neural network architectures, and distributed systems."
                href="#education"
                cta="View Academic Credentials"
                hasBorderBeam={true}
                glowColor="gold"
              >
                <div className="pt-2 flex items-center justify-between text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">CGPA: 7.65 / 10</span>
                  <span className="text-amber-300 font-semibold">CLASS OF 2025</span>
                </div>
              </BentoCard>

              {/* Card 2: 4 Core AI/ML Systems */}
              <BentoCard
                badge="PRODUCTION PIPELINES"
                icon={<Cpu className="w-5 h-5" />}
                title="4 Production Systems"
                description="Architected and deployed end-to-end prototypes spanning single-stage detection, transformer attention classification, and acoustic feature extraction."
                href="#projects"
                cta="Explore 4 Core Projects"
                glowColor="cyan"
              >
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>YOLOv8 Vision</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Toxic Span NLP</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Audio MFCC ML</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>AI Chat Memory</span>
                  </div>
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
