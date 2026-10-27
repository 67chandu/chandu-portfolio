import { useState } from 'react'
import { motion } from 'motion/react'
import {
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Cpu,
  Calendar,
  Check,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { staggerContainerVariant, fadeUpVariant } from '../../utils/animations'
import { Magnetic } from '../ui/Magnetic'
import { BorderBeam } from '../ui/BorderBeam'

export function ResumeSection() {
  const { data } = usePortfolio()
  const { profileData, resume } = data
  const projectsList = data.projects || data.featuredProjects || []

  const [downloaded, setDownloaded] = useState(false)

  const pdfUrl = resume?.pdfUrl || profileData.resumeUrl || '/Chandu_Challa_Resume.pdf'
  const filename = resume?.filename || resume?.fileName || 'Chandu_Challa_Resume.pdf'
  const lastUpdated = resume?.lastUpdated || resume?.updatedAt || 'October 2025'

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  return (
    <section
      id="resume"
      aria-label="Resume & Curriculum Vitae"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/15 overflow-hidden bg-transparent select-none"
    >
      {/* Animated ambient backdrop flares */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] pointer-events-none opacity-20 animate-aurora-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-72 h-72 pointer-events-none opacity-15 animate-drift-light"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-amber-950/20 border border-amber-500/30 p-5 sm:p-8 md:p-12 shadow-2xl space-y-8 text-left backdrop-blur-xl relative overflow-hidden"
        >
          {/* 21st.dev Orbiting Border Beam */}
          <BorderBeam duration={9} colorFrom="#fef08a" colorTo="#f59e0b" colorGlow="rgba(245, 158, 11, 0.5)" rx={24} />

          {/* Subtle Top Golden Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Top Row: Resume Details & Download Action */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Curriculum Vitae</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Resume &amp; Credentials
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Direct access to my official resume covering education, AI/ML engineering projects, and technical skills.
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Updated: {lastUpdated}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium truncate max-w-xs">{filename}</span>
              </div>
            </div>

            {/* GSAP-Style Magnetic Animated Luminous Download Button */}
            <Magnetic strength={0.3} radius={110}>
              <motion.a
                href={pdfUrl}
                download={filename}
                onClick={handleDownload}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Chandu Challa's PDF Resume"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition shadow-lg shadow-amber-500/25 shrink-0 cursor-pointer group"
              >
                {/* Animated Light Sweep Effect */}
                <motion.div
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-16 bg-white/30 skew-x-12 pointer-events-none"
                />

                {downloaded ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download PDF Resume</span>
                  </>
                )}
              </motion.a>
            </Magnetic>
          </motion.div>

          {/* Bottom Grid: 3 Clean Credentials Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Education */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-400/50 p-5 space-y-2 transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/10 cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <p className="font-heading font-semibold text-white text-base">
                {profileData.degree}
              </p>
              <p className="text-xs text-amber-300 font-medium">{profileData.specialization}</p>
              <p className="text-xs text-slate-400">
                {data.education?.[0]?.institution || 'Malla Reddy University'} • {data.education?.[0]?.grade || '7.65'} CGPA • Graduated 2025
              </p>
            </motion.div>

            {/* Card 2: Core Stack */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-400/50 p-5 space-y-2 transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/10 cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Core Technical Stack</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-400/80" />
              </div>
              <p className="font-heading font-semibold text-white text-base">
                Python, Modern Web &amp; Applied AI
              </p>
              <p className="text-xs text-slate-300">
                YOLOv8, NLP, Librosa Audio, LangChain, Streamlit, Git
              </p>
            </motion.div>

            {/* Card 3: Project Portfolio */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-400/50 p-5 space-y-2 transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Project Portfolio</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="font-heading font-semibold text-white text-base">
                {projectsList.length} Verified AI/ML Prototypes
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ready for Entry-Level Engineering Roles</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
