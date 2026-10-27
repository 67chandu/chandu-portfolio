import { motion } from 'motion/react'
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  BookOpen,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { MotionCard } from '../ui/MotionCard'
import type { EducationEntry, AchievementItem } from '../../types/portfolio'

export function EducationSection() {
  const { data } = usePortfolio()
  const educationItems: EducationEntry[] = data.education || data.educationList || []
  const achievementsItems: AchievementItem[] = data.achievements || data.achievementsList || []

  return (
    <section
      id="education"
      aria-label="Education and Academic Credentials"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/15 overflow-hidden bg-transparent"
    >
      {/* Page 5 Transition: Academic Celestial Orbital Rings & Soft Ambient Flares */}
      <div className="absolute top-1/4 right-12 w-[28rem] h-[28rem] rounded-full border border-amber-500/15 pointer-events-none animate-spin-slow z-0" />
      <div className="absolute bottom-10 left-10 w-[22rem] h-[22rem] rounded-full border border-cyan-500/10 pointer-events-none animate-spin-slow [animation-direction:reverse] z-0" />
      <div
        className="absolute top-1/3 -left-28 w-[34rem] h-[34rem] pointer-events-none opacity-25 animate-aurora-pulse z-0"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-16 -right-24 w-[30rem] h-[30rem] pointer-events-none opacity-20 animate-drift-light z-0"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Heading */}
        <div className="text-left space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Education &amp; Leadership
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Formal technical education in Computer Science and Engineering with an AI/ML
            specialization at Malla Reddy University alongside campus event coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Education Entries */}
          <div className="lg:col-span-7 space-y-6">
            {educationItems.map((edu: EducationEntry) => {
              const coursework = edu.coursework || edu.keyCoursework || []
              const period =
                edu.period ||
                `${edu.startDate || ''} — ${edu.completionDate || (edu.status === 'Ongoing' ? 'Present' : '')}`

              return (
                <MotionCard key={edu.id} className="p-6 sm:p-8" tiltStrength={5} glowColor="gold">
                  <div className="space-y-5 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 font-mono text-xs text-amber-300 font-medium">
                        {edu.status || edu.statusBadge || 'Undergraduate'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{period}</span>
                      </span>
                    </div>

                    <div>
                      {/* College Name: Malla Reddy University */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {edu.institution || 'Malla Reddy University'}
                        </h3>
                      </div>

                      <p className="text-base sm:text-lg font-semibold text-amber-300">
                        {edu.degree}
                      </p>

                      <p className="text-slate-300 text-sm mt-0.5">
                        {edu.specialization}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {edu.grade && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold">
                            CGPA: {edu.grade}
                          </span>
                        )}
                        {edu.location && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-amber-400/80" />
                            <span>{edu.location}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-sm text-slate-300 leading-relaxed">{edu.description}</p>
                    )}

                    {coursework.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Key Coursework &amp; Labs</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {coursework.map((course, idx) => (
                            <motion.span
                              key={idx}
                              whileHover={{ scale: 1.04 }}
                              className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 transition-colors"
                            >
                              {course}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </MotionCard>
              )
            })}
          </div>

          {/* Right Column: Leadership & Achievements */}
          <div className="lg:col-span-5 space-y-5">
            {achievementsItems.map((ach: AchievementItem) => (
              <MotionCard
                key={ach.id}
                className="p-6"
                glowColor="gold"
                tiltStrength={6}
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-amber-300/90 uppercase tracking-wider">
                        {ach.category}
                      </span>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                        {ach.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-amber-300/90">{ach.organization}</span>
                    <span>{ach.statusNote || 'Malla Reddy University'}</span>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
