import { PortfolioProvider, usePortfolio } from './context'
import { AdminPortal } from './components/admin/AdminPortal'
import { LoadingScreen } from './components/layout/LoadingScreen'
import { ThreeBackground } from './components/layout/ThreeBackground'
import { CustomCursor } from './components/layout/CustomCursor'
import { SmoothScroll } from './components/layout/SmoothScroll'
import { ScrollProgressBar } from './components/layout/ScrollProgressBar'
import { Navbar } from './components/layout/Navbar'
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp'
import { FloatingDock } from './components/layout/FloatingDock'
import { TechMarquee } from './components/layout/TechMarquee'
import { HeroSection } from './components/sections/HeroSection'
import { AboutSection } from './components/sections/AboutSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { EducationSection } from './components/sections/EducationSection'
import { ResumeSection } from './components/sections/ResumeSection'
import { ContactSection } from './components/sections/ContactSection'
import { Footer } from './components/layout/Footer'

function PortfolioContent() {
  const { isAdminOpen } = usePortfolio()

  if (isAdminOpen) {
    return <AdminPortal />
  }

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#06070a] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <ScrollProgressBar />
        <LoadingScreen />
        <CustomCursor />
        <ThreeBackground />
        <Navbar />
        <FloatingWhatsApp />
        <FloatingDock />

        <main className="relative z-10">
          <HeroSection />
          <TechMarquee />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <ResumeSection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  )
}

export function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  )
}

export default App
