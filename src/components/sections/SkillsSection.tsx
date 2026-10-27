import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Code2,
  Terminal,
  Brain,
  Globe,
  Users,
  Layers,
  Cpu,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  X,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { staggerContainerVariant } from '../../utils/animations'
import type { SkillItem } from '../../types/portfolio'

const CATEGORIES = [
  'All',
  'Programming Languages',
  'Web Technologies',
  'AI/ML & Data',
  'Tools & Platforms',
  'Professional & Communication Skills',
] as const

type CategoryTab = (typeof CATEGORIES)[number]

// Color configuration per category
const CATEGORY_THEMES: Record<
  string,
  {
    badge: string
    glow: string
    border: string
    accent: string
    tag: string
  }
> = {
  'Programming Languages': {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    border: 'group-hover:border-amber-400/60',
    accent: '#f59e0b',
    tag: 'LANGUAGES',
  },
  'Web Technologies': {
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    border: 'group-hover:border-cyan-400/60',
    accent: '#06b6d4',
    tag: 'FRONTEND & UI',
  },
  'AI/ML & Data': {
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    glow: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    border: 'group-hover:border-purple-400/60',
    accent: '#a855f7',
    tag: 'DEEP LEARNING',
  },
  'Tools & Platforms': {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'group-hover:border-emerald-400/60',
    accent: '#10b981',
    tag: 'DEVOPS & CLI',
  },
  'Professional & Communication Skills': {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    glow: 'from-rose-500/20 via-pink-500/10 to-transparent',
    border: 'group-hover:border-rose-400/60',
    accent: '#f43f5e',
    tag: 'MANAGEMENT',
  },
}

function CategoryIcon({ category, className = 'w-4 h-4' }: { category: string; className?: string }) {
  switch (category) {
    case 'Programming Languages':
      return <Code2 className={className} />
    case 'Web Technologies':
      return <Globe className={className} />
    case 'AI/ML & Data':
      return <Brain className={className} />
    case 'Tools & Platforms':
      return <Terminal className={className} />
    case 'Professional & Communication Skills':
      return <Users className={className} />
    default:
      return <Cpu className={className} />
  }
}

// Skill engineering metadata: links each skill to its real-world implementation
const SKILL_ENGINEERING_METRICS: Record<
  string,
  {
    verifiedRepo: string
    projectBadge: string
    depthLevel: number // 1 to 4
    stackTags: string[]
  }
> = {
  Python: {
    verifiedRepo: 'YOLO, Librosa, NLP & LangChain',
    projectBadge: 'Primary Engineering Stack',
    depthLevel: 4,
    stackTags: ['NumPy', 'PyTorch', 'OpenCV', 'Pandas'],
  },
  'HTML5 & CSS3': {
    verifiedRepo: 'Modern Portfolio V2 & Web Labs',
    projectBadge: 'Semantic Responsive UI',
    depthLevel: 4,
    stackTags: ['Tailwind CSS', 'Flexbox', 'CSS Grid'],
  },
  'Streamlit UI': {
    verifiedRepo: 'Conversational AI Chatbot UI',
    projectBadge: 'Session-State Reactive Web',
    depthLevel: 4,
    stackTags: ['Reactive Widgets', 'State Persistence', 'Python Web'],
  },
  'YOLO & OpenCV': {
    verifiedRepo: 'Object & Theft Detection System',
    projectBadge: 'Real-Time CV Inference',
    depthLevel: 4,
    stackTags: ['YOLOv8', 'Frame Analysis', '14ms Latency'],
  },
  'NLP & scikit-learn': {
    verifiedRepo: 'Toxic Span Classification',
    projectBadge: 'Text Feature Extraction',
    depthLevel: 4,
    stackTags: ['TF-IDF', 'Tokenization', 'Classification'],
  },
  'LangChain & Conversational AI': {
    verifiedRepo: 'Conversational AI Chatbot',
    projectBadge: 'Prompt Orchestration Engine',
    depthLevel: 4,
    stackTags: ['BufferMemory', 'PromptTemplate', 'LLM Endpoints'],
  },
  'Librosa Audio Analysis': {
    verifiedRepo: 'Music Genre Classification',
    projectBadge: 'Acoustic DSP Extraction',
    depthLevel: 4,
    stackTags: ['20 MFCCs', 'Fourier Transform', 'Spectrograms'],
  },
  'System Diagnostics & CLI': {
    verifiedRepo: 'Technical Troubleshooting Lab',
    projectBadge: 'PowerShell & Environment PATH',
    depthLevel: 4,
    stackTags: ['PowerShell', 'Git CLI', 'Virtual Envs'],
  },
  'MS Excel, Word & PowerPoint': {
    verifiedRepo: 'Data Cleaning & Event Docs',
    projectBadge: 'Data Formatting & Reports',
    depthLevel: 4,
    stackTags: ['Spreadsheets', 'Formulas', 'Technical Decks'],
  },
  'Technical Event Coordination': {
    verifiedRepo: 'Malla Reddy University Events',
    projectBadge: 'National Tech Symposiums',
    depthLevel: 4,
    stackTags: ['On-Ground Logistics', 'Scheduling', 'Leadership'],
  },
}

/**
 * 3D Interactive Cybernetic Skill Card
 * Features:
 * - 3D cursor tilt physics with specular sheen
 * - Dynamic category glow trace
 * - 4-stage LED Competency Bus meter
 * - Interactive click for deep-dive technical context
 */
function InteractiveSkillCard({
  skill,
  onSelect,
}: {
  skill: SkillItem
  onSelect: (skill: SkillItem) => void
}) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const theme = CATEGORY_THEMES[skill.category] || CATEGORY_THEMES['Programming Languages']
  const meta = SKILL_ENGINEERING_METRICS[skill.name] || {
    verifiedRepo: 'Academic Engineering Repository',
    projectBadge: 'Verified Competency',
    depthLevel: 4,
    stackTags: [skill.category],
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setMousePos({ x, y })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setMousePos({ x: 0, y: 0 })
        }}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 600)
        }}
        onClick={() => onSelect(skill)}
        style={{
          transform: isHovered
            ? `perspective(800px) rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) translateZ(8px)`
            : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
        className={`relative h-full p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 active:bg-slate-900 border border-slate-800/80 ${theme.border} transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg select-none backdrop-blur-md`}
      >
        {/* Dynamic Specular Spotlight Sheen */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25 transition-opacity"
            style={{
              background: `radial-gradient(circle 260px at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, ${theme.accent}, transparent 70%)`,
            }}
          />
        )}

        {/* Ambient Top Glow Line */}
        <div
          className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[${theme.accent}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        <div className="space-y-3.5 relative z-10">
          {/* Top Header: Category Icon + Project Tag */}
          <div className="flex items-center justify-between gap-3">
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}
              style={{
                backgroundColor: `${theme.accent}18`,
                borderColor: `${theme.accent}40`,
                color: theme.accent,
              }}
            >
              <CategoryIcon category={skill.category} className="w-4 h-4" />
            </div>

            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${theme.badge}`}>
              {theme.tag}
            </span>
          </div>

          {/* Skill Title & Note */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white group-hover:text-amber-200 transition-colors tracking-tight">
                {skill.name}
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            {skill.note && (
              <p className="text-xs text-slate-300/90 mt-1.5 leading-relaxed line-clamp-2">
                {skill.note}
              </p>
            )}
          </div>

          {/* Stack Technology Mini Badges */}
          <div className="flex flex-wrap gap-1 pt-1">
            {meta.stackTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Interactive Competency Bus */}
        <div className="pt-3.5 mt-3.5 border-t border-slate-800/70 relative z-10 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">DEPTH:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => {
                const isLit = step <= meta.depthLevel
                return (
                  <span
                    key={step}
                    className={`w-2.5 h-1.5 rounded-sm transition-all duration-300 ${
                      isLit
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                        : 'bg-slate-800'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          <span className="text-slate-400 truncate max-w-[150px] group-hover:text-amber-300 transition-colors">
            {meta.projectBadge}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Animated Neural Category Radar Deck
 * Displays real-time audio/quantum frequency oscillations that change according to active category
 */
function CategoryWaveformTelemetry({
  activeCategory,
  activeCount,
}: {
  activeCategory: CategoryTab
  activeCount: number
}) {
  const theme = CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES['Programming Languages']

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs select-none">
      {/* Category Info */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm"
          style={{
            backgroundColor: `${theme.accent}15`,
            borderColor: `${theme.accent}40`,
            color: theme.accent,
          }}
        >
          <Activity className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase font-mono">DOMAIN STACK</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-white font-bold text-xs tracking-wider font-mono">
            {activeCategory.toUpperCase()} • {activeCount} {activeCount === 1 ? 'SKILL' : 'SKILLS'}
          </span>
        </div>
      </div>

      {/* Dynamic Dancing Multi-Band Frequency Bars */}
      <div className="flex items-center gap-1.5 h-6">
        {[0.8, 0.4, 0.9, 0.6, 1.0, 0.5, 0.85, 0.7, 0.95, 0.45, 0.75, 0.6].map((amp, idx) => (
          <motion.span
            key={`${activeCategory}-${idx}`}
            animate={{
              height: ['20%', `${Math.round(amp * 100)}%`, '30%'],
            }}
            transition={{
              duration: 0.8 + (idx % 3) * 0.2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: idx * 0.05,
            }}
            className="w-1 rounded-full shadow-sm"
            style={{ backgroundColor: theme.accent }}
          />
        ))}
      </div>

      {/* Verification Seal */}
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>PROJECT VERIFIED</span>
      </div>
    </div>
  )
}

/**
 * Master SkillsSection
 * Completely overhauled with deep cinematic animations:
 * 1. Animated Category Waveform Deck with dynamic frequency bars
 * 2. Real-Time Interactive Search Filter
 * 3. 3D Cursor-Tilt Cards with Specular Spotlight & 4-Stage LED Competency Bus
 * 4. Interactive Deep-Dive Modal explaining codebase application
 */
export function SkillsSection() {
  const { data } = usePortfolio()
  const { skills } = data
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null)

  // Filter skills by category & real-time search query
  const filteredSkills = useMemo(() => {
    return skills.filter((s: SkillItem) => {
      const matchesCat = activeCategory === 'All' || s.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.note && s.note.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCat && matchesSearch
    })
  }, [skills, activeCategory, searchQuery])

  return (
    <section
      id="skills"
      aria-label="Technical & Core Skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-amber-500/15 overflow-hidden bg-transparent select-none"
    >
      {/* Animated Cybernetic Scanning Lasers */}
      <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none animate-laser-sweep z-0" />
      <div
        className="absolute top-1/4 -right-24 w-[36rem] h-[36rem] pointer-events-none opacity-25 animate-drift-light z-0"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-10 -left-28 w-[32rem] h-[32rem] pointer-events-none opacity-20 animate-aurora-pulse z-0"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Layers className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Skills &amp; Technologies</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Skills, Tooling &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-400">
                Applied AI Architecture
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Curated capabilities and modern frameworks across deep learning, computer vision, and software engineering.
              Click any skill card to examine its codebase context and practical implementation:
            </p>
          </div>

          {/* Interactive Search & Filter Toolbar */}
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Category Filter Pills (Touch Scrollable on Mobile) */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                const count =
                  cat === 'All'
                    ? skills.length
                    : skills.filter((s) => s.category === cat).length

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                      isActive ? 'text-amber-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="skills-category-active-pill"
                        className="absolute inset-0 rounded-xl bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                    <span
                      className={`relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                        isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Real-Time Live Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter skill by name (e.g. Python, YOLO, LangChain)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Neural Category Waveform Deck */}
            <CategoryWaveformTelemetry
              activeCategory={activeCategory}
              activeCount={filteredSkills.length}
            />
          </div>

          {/* Skills Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill: SkillItem) => (
                <InteractiveSkillCard
                  key={skill.id}
                  skill={skill}
                  onSelect={(s) => setSelectedSkill(s)}
                />
              ))}
            </AnimatePresence>
          </motion.div>


        </motion.div>
      </div>

      {/* =========================================================================
          INTERACTIVE SKILL DEEP-DIVE MODAL (Holographic Architecture Drawer)
          ========================================================================= */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-amber-400/50 shadow-2xl space-y-5 text-left font-sans"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block">
                    ENGINEERING COMPETENCY // {selectedSkill.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>

              {/* Context Note */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] text-slate-400 uppercase">Application Scope</span>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  {selectedSkill.note}
                </p>
              </div>

              {/* Engineering Implementation & Repos */}
              {SKILL_ENGINEERING_METRICS[selectedSkill.name] && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Active Codebase Context:</span>
                    <span className="text-amber-300 font-semibold">
                      {SKILL_ENGINEERING_METRICS[selectedSkill.name].verifiedRepo}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {SKILL_ENGINEERING_METRICS[selectedSkill.name].stackTags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href="#projects"
                  onClick={() => setSelectedSkill(null)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/25"
                >
                  <span>Explore Associated Projects</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
