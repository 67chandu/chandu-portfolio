import { Wrench, Terminal, CheckCircle2, Search, ShieldAlert } from 'lucide-react'
import { usePortfolio } from '../../context'
import { MotionCard, AnimatedSectionHeader } from '../ui/MotionCard'
import type { TroubleshootingItem } from '../../types/portfolio'

export function TroubleshootingSection() {
  const { data } = usePortfolio()
  const troubleshootingList: TroubleshootingItem[] =
    data.troubleshooting || data.troubleshootingList || []

  return (
    <section
      id="troubleshooting"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/15 bg-transparent overflow-hidden"
    >
      {/* Animated Diagnostic Scanlines & Status Beacon */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(245,158,11,0.25)_1px,transparent_1px)] bg-[size:100%_4px] animate-scanline z-0" />
      <div className="absolute top-1/3 -left-24 w-[32rem] h-[32rem] rounded-full bg-amber-500/10 blur-[100px] animate-aurora-pulse pointer-events-none z-0" />
      <div className="absolute bottom-10 -right-24 w-[30rem] h-[30rem] rounded-full bg-emerald-500/8 blur-[95px] animate-float-slow pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <AnimatedSectionHeader
          badgeNumber="05"
          badgeLabel="Practical Troubleshooting & IT Support Lab"
          title="Real-World System Diagnostics, Environment Setup & Problem Resolution"
          subtitle="Hands-on diagnostic case studies demonstrating root-cause analysis across Windows CLI, Python ML environments, responsive web layouts, and Excel reporting."
          icon={<Wrench className="w-3.5 h-3.5" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {troubleshootingList.map((item: TroubleshootingItem, index: number) => (
            <MotionCard
              key={item.id}
              className="p-6"
              glowColor="gold"
              tiltStrength={6}
            >
              <div className="space-y-4">
                {/* Simulated Terminal Window Bar */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="font-mono text-[11px] text-slate-400 ml-2">
                      diag-case-0{index + 1}.sh
                    </span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                </div>

                <div>
                  <span className="font-mono text-[11px] text-amber-400 uppercase">
                    {item.domain}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                    {item.title}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 p-3.5">
                    <p className="font-mono text-[11px] text-amber-300 uppercase flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Issue Scenario</span>
                    </p>
                    <p className="text-slate-300 leading-relaxed">{item.scenario}</p>
                  </div>

                  <div className="rounded-xl bg-slate-950/75 border border-slate-800/80 p-3.5">
                    <p className="font-mono text-[11px] text-amber-400 uppercase flex items-center gap-1.5 mb-1">
                      <Search className="w-3.5 h-3.5" />
                      <span>Investigation &amp; Diagnostic Approach</span>
                    </p>
                    <p className="text-slate-300 leading-relaxed">{item.diagnosticApproach}</p>
                  </div>

                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-3.5">
                    <p className="font-mono text-[11px] text-emerald-400 uppercase flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolution &amp; Key Takeaway</span>
                    </p>
                    <p className="text-emerald-200 leading-relaxed">{item.resolutionAndTakeaway}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {(item.toolsUsed || []).map((tool: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300"
                    >
                      #{tool}
                    </span>
                  ))}
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  )
}
