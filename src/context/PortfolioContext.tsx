import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { PortfolioState } from '../types/portfolio'
import { defaultPortfolioData } from '../data/portfolioData'
import { PortfolioContext } from './portfolioContextDef'

const STORAGE_KEY = 'chandu_portfolio_cms_data_v1'

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as PortfolioState
        // Filter out removed Quantum NLP project completely
        const filteredProjects = (parsed.projects || defaultPortfolioData.projects).filter(
          (p) => p.id !== 'proj-qnlp' && !p.title?.toLowerCase().includes('quantum')
        )

        // Sanitize out stale legacy values (e.g. Java, Quantum NLP, 8.2 CGPA, 2026 ongoing)
        const sanitizedSkills = (parsed.skills || defaultPortfolioData.skills).filter(
          (s) =>
            s.name?.toLowerCase() !== 'java' &&
            s.id !== 'sk-2' &&
            !s.name?.toLowerCase().includes('quantum') &&
            s.id !== 'sk-7'
        )
        const sanitizedEdu = (parsed.education || defaultPortfolioData.education).map((edu) => ({
          ...edu,
          startDate: edu.startDate === '2022' ? '2021' : edu.startDate,
          completionDate: edu.completionDate === 'Present' ? '2025' : edu.completionDate,
          status: edu.status === 'Ongoing' ? 'Graduated' : edu.status,
          grade: !edu.grade || edu.grade === '8.2' ? '7.65' : edu.grade,
          period: edu.period?.includes('Ongoing') ? '2021 — 2025 (Graduated)' : edu.period,
          coursework: (edu.coursework || []).map((c) => c.replace(/Java\s*(&\s*)?/gi, '')),
        }))

        return {
          ...defaultPortfolioData,
          ...parsed,
          skills: sanitizedSkills,
          education: sanitizedEdu,
          educationList: sanitizedEdu,
          projects: filteredProjects,
          profileData: {
            ...defaultPortfolioData.profileData,
            ...(parsed.profileData || {}),
          },
        }
      }
    } catch (err) {
      console.error('Failed to read saved portfolio data from localStorage:', err)
    }
    return defaultPortfolioData
  })

  const [hasCustomEdits, setHasCustomEdits] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) !== null
  })

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin-chandu' || window.location.hash === '#admin'
  })

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin-chandu' || window.location.hash === '#admin') {
        setIsAdminOpen(true)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Owner Shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        setIsAdminOpen((prev) => !prev)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const updateData = (updater: (prev: PortfolioState) => PortfolioState) => {
    setData((prev) => {
      const next = updater(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setHasCustomEdits(true)
      } catch (err) {
        console.error('Failed to save portfolio data to localStorage:', err)
      }
      return next
    })
  }

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultPortfolioData)
    setHasCustomEdits(false)
  }

  const generateTypeScriptSource = (): string => {
    const jsonFormatted = JSON.stringify(data, null, 2)
    return `import type { PortfolioState } from '../types/portfolio'\n\nexport const defaultPortfolioData: PortfolioState = ${jsonFormatted}\n\nexport const navItems = [\n  { label: 'Home', href: '#hero' },\n  { label: 'About', href: '#about' },\n  { label: 'Skills', href: '#skills' },\n  { label: 'Projects', href: '#projects' },\n  { label: 'Education', href: '#education' },\n  { label: 'Contact', href: '#contact' },\n] as const\n`
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetToDefaults,
        isAdminOpen,
        setIsAdminOpen,
        hasCustomEdits,
        generateTypeScriptSource,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}
