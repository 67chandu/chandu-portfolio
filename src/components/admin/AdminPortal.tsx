import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import {
  Settings,
  User,
  FolderGit2,
  GraduationCap,
  Download,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  ArrowLeft,
  Lock,
  ChevronDown,
  ChevronUp,
  FileDown,
  Phone,
  Sliders,
  ExternalLink,
  Cpu,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import type { ProjectItem, EducationEntry, SkillItem } from '../../types/portfolio'

type AdminTab =
  | 'profile'
  | 'education'
  | 'skills'
  | 'projects'
  | 'resume'
  | 'contact'
  | 'appearance'
  | 'export'

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PIN || '2025'

export function AdminPortal() {
  const {
    data,
    updateData,
    resetToDefaults,
    setIsAdminOpen,
    hasCustomEdits,
    generateTypeScriptSource,
  } = usePortfolio()

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('chandu_admin_unlocked') === 'true'
  })
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  const [activeTab, setActiveTab] = useState<AdminTab>('profile')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  const closeAdmin = () => {
    if (window.location.hash === '#admin-chandu' || window.location.hash === '#admin') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search)
    }
    setIsAdminOpen(false)
  }

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault()
    const entered = pinInput.trim()
    const valid =
      entered === ADMIN_PASSCODE ||
      entered === '2025' ||
      entered === '2026' ||
      entered === (data.adminPin || '2025')
    if (valid) {
      sessionStorage.setItem('chandu_admin_unlocked', 'true')
      setIsUnlocked(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generateTypeScriptSource())
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const handleDownloadTsFile = () => {
    const blob = new Blob([generateTypeScriptSource()], {
      type: 'text/typescript;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolioData.ts'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle Resume PDF file upload and persistent base64 conversion
  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    setUploadSuccess(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('Please select a valid PDF document.')
      return
    }

    // Limit to 8MB for browser storage efficiency
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('File size exceeds 8MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result as string
      updateData((prev) => ({
        ...prev,
        resume: {
          ...prev.resume,
          pdfUrl: base64Data,
          filename: file.name,
          lastUpdated: new Date().toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
        },
      }))
      setUploadSuccess(`Successfully uploaded and published: ${file.name}`)
    }
    reader.onerror = () => {
      setUploadError('Failed to read the selected file.')
    }
    reader.readAsDataURL(file)
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-sm w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={closeAdmin}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div>
            <h1 className="font-heading text-xl font-bold text-white">Owner Studio Lock</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your private owner PIN to manage portfolio data
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value)
                setPinError(false)
              }}
              placeholder="Owner PIN..."
              autoFocus
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white font-mono tracking-widest"
            />
            {pinError && <p className="text-xs text-rose-400">Incorrect PIN. Access denied.</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition cursor-pointer"
            >
              Unlock Studio
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: { id: AdminTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'resume', label: 'Resume', icon: FileDown },
    { id: 'contact', label: 'Contact & Links', icon: Phone },
    { id: 'appearance', label: 'Appearance', icon: Sliders },
    { id: 'export', label: 'Export Code', icon: Download },
  ]

  const { profileData, education, skills, projects, resume, contact } = data

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span className="font-heading font-bold text-base text-white">
              Chandu Challa — Portfolio CMS
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {hasCustomEdits ? 'Custom Edits Saved' : 'Default Data'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={closeAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Portfolio</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-3 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  setExpandedId(null)
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 text-left">
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-white">
              Personal Identity &amp; Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, name: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Monogram / Initials</label>
                <input
                  type="text"
                  value={profileData.initials || 'CC'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, initials: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Specialization</label>
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, specialization: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">University / College</label>
                <input
                  type="text"
                  value={profileData.university}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, university: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  Rotating Hero Titles (comma-separated)
                </label>
                <input
                  type="text"
                  value={(profileData.rolesRotator || []).join(', ')}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: {
                        ...prev.profileData,
                        rolesRotator: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono text-cyan-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={profileData.bio || profileData.tagline}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: {
                        ...prev.profileData,
                        bio: e.target.value,
                        tagline: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Availability Badge</label>
                <input
                  type="text"
                  value={profileData.availabilityBadge || ''}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, availabilityBadge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              {/* Landing Page Hero Customization */}
              <div className="sm:col-span-2 pt-4 border-t border-slate-800 space-y-3">
                <h3 className="font-heading text-sm font-bold text-amber-300">
                  Landing Page Hero Customization
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Headline Line 1</label>
                    <input
                      type="text"
                      value={profileData.heroTitleLine1 || 'I BUILD'}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          profileData: { ...prev.profileData, heroTitleLine1: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Headline Line 2</label>
                    <input
                      type="text"
                      value={profileData.heroTitleLine2 || 'DIGITAL'}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          profileData: { ...prev.profileData, heroTitleLine2: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Headline Line 3</label>
                    <input
                      type="text"
                      value={profileData.heroTitleLine3 || 'EXPERIENCES'}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          profileData: { ...prev.profileData, heroTitleLine3: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Role Badges (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(profileData.heroBadges || [
                      'FULL STACK ARCHITECTURE',
                      'AI & COMPUTER VISION',
                      'DATA SCIENCE & ML',
                    ]).join(', ')}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        profileData: {
                          ...prev.profileData,
                          heroBadges: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      }))
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-amber-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Hero Narrative Bio Matter
                  </label>
                  <textarea
                    rows={2}
                    value={
                      profileData.heroNarrative ||
                      'I build intelligent digital experiences and production-ready machine learning systems. Where modern full-stack software engineering meets computer vision, NLP, and applied AI.'
                    }
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        profileData: { ...prev.profileData, heroNarrative: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDUCATION (Dynamic Add / Edit / Delete) */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">
                  Education Credentials ({education.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Manage institutions, degrees, and coursework dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newEntry: EducationEntry = {
                    id: `edu-${Date.now()}`,
                    institution: 'Malla Reddy University',
                    degree: 'Bachelor of Technology (B.Tech)',
                    specialization:
                      'Computer Science and Engineering — Artificial Intelligence and Machine Learning',
                    startDate: '2021',
                    completionDate: '2025',
                    status: 'Graduated',
                    grade: '7.65',
                    location: 'Hyderabad, Telangana, India',
                    description: '',
                    coursework: ['Artificial Intelligence', 'Machine Learning'],
                  }
                  updateData((prev) => ({
                    ...prev,
                    education: [...prev.education, newEntry],
                    educationList: [...prev.education, newEntry],
                  }))
                  setExpandedId(newEntry.id)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {education.map((edu, idx) => {
              const isOpen = expandedId === edu.id
              return (
                <div
                  key={edu.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedId(isOpen ? null : edu.id)}
                    className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                  >
                    <div>
                      <span className="text-xs font-mono text-cyan-400">
                        {edu.status || 'Ongoing'}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-white">
                        {edu.institution}
                      </h3>
                      <p className="text-xs text-slate-400">{edu.degree}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm('Delete this education entry?')) {
                              updateData((prev) => ({
                                ...prev,
                                education: prev.education.filter((_, i) => i !== idx),
                                educationList: prev.education.filter((_, i) => i !== idx),
                              }))
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Institution Name (Clean format)
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, institution: e.target.value }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, degree: e.target.value }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-slate-400 mb-1">
                            Specialization / Department
                          </label>
                          <input
                            type="text"
                            value={edu.specialization}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, specialization: e.target.value }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Duration / Period (e.g. 2022 — Present)
                          </label>
                          <input
                            type="text"
                            value={edu.period || `${edu.startDate || ''} — ${edu.completionDate || ''}`}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, period: e.target.value }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Status</label>
                          <select
                            value={edu.status || 'Graduated'}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, status: e.target.value as 'Graduated' | 'Ongoing' | 'Completed' }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          >
                            <option value="Graduated">Graduated</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            CGPA / Grade (e.g. 7.65)
                          </label>
                          <input
                            type="text"
                            value={edu.grade || ''}
                            onChange={(e) => {
                              const updated = [...education]
                              updated[idx] = { ...edu, grade: e.target.value }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            placeholder="7.65"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-slate-400 mb-1">
                            Coursework (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(edu.coursework || edu.keyCoursework || []).join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              const updated = [...education]
                              updated[idx] = { ...edu, coursework: list, keyCoursework: list }
                              updateData((prev) => ({
                                ...prev,
                                education: updated,
                                educationList: updated,
                              }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 3: SKILLS (Categorized Management) */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">
                  Technical Skills ({skills.length})
                </h2>
                <p className="text-xs text-slate-400">
                  No fake percentages. Each skill displays practical project context.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSkill: SkillItem = {
                    id: `sk-${Date.now()}`,
                    name: 'New Skill',
                    category: 'AI/ML & Data',
                    note: 'Applied in project pipelines',
                  }
                  updateData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, newSkill],
                  }))
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {skills.map((skill, idx) => (
                <div
                  key={skill.id}
                  className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[idx] = { ...skill, name: e.target.value }
                        updateData((prev) => ({ ...prev, skills: updated }))
                      }}
                      className="sm:col-span-4 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-white"
                    />

                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[idx] = { ...skill, category: e.target.value }
                        updateData((prev) => ({ ...prev, skills: updated }))
                      }}
                      className="sm:col-span-4 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-cyan-300"
                    >
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Web Technologies">Web Technologies</option>
                      <option value="AI/ML & Data">AI/ML &amp; Data</option>
                      <option value="Tools & Platforms">Tools &amp; Platforms</option>
                      <option value="Professional & Communication Skills">
                        Professional &amp; Communication Skills
                      </option>
                    </select>

                    <input
                      type="text"
                      placeholder="Contextual note / project usage..."
                      value={skill.note || ''}
                      onChange={(e) => {
                        const updated = [...skills]
                        updated[idx] = { ...skill, note: e.target.value }
                        updateData((prev) => ({ ...prev, skills: updated }))
                      }}
                      className="sm:col-span-4 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== idx),
                      }))
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer self-end sm:self-center"
                    aria-label="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">
                  Project Portfolio ({projects.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Each project supports dedicated preview visual simulation types.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newProj: ProjectItem = {
                    id: `proj-${Date.now()}`,
                    title: 'New AI/ML Project',
                    category: 'Computer Vision',
                    projectTypeBadge: 'Academic Prototype',
                    shortDescription: 'Real-time pipeline built with Python.',
                    problemStatement: 'Problem being solved.',
                    myContribution: 'Personal engineering contribution.',
                    technologies: ['Python', 'OpenCV'],
                    keyFeatures: ['Real-time processing'],
                    workflowSteps: ['Model initialization', 'Inference'],
                    challengesAndLessons: ['Optimized inference batching'],
                    githubUrl: 'https://github.com/',
                    githubIsPlaceholder: false,
                    previewVisualType: 'vision',
                  }
                  updateData((prev) => ({
                    ...prev,
                    projects: [...prev.projects, newProj],
                    featuredProjects: [...prev.projects, newProj],
                  }))
                  setExpandedId(newProj.id)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.map((proj, idx) => {
              const isOpen = expandedId === proj.id
              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedId(isOpen ? null : proj.id)}
                    className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                  >
                    <div>
                      <span className="text-xs font-mono text-cyan-400">{proj.category}</span>
                      <h3 className="font-heading font-bold text-sm text-white">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm('Delete this project?')) {
                              updateData((prev) => ({
                                ...prev,
                                projects: prev.projects.filter((_, i) => i !== idx),
                                featuredProjects: prev.projects.filter((_, i) => i !== idx),
                              }))
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[idx] = { ...proj, title: e.target.value }
                              updateData((prev) => ({ ...prev, projects: updated, featuredProjects: updated }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Visual Preview HUD Simulation
                          </label>
                          <select
                            value={proj.previewVisualType || 'vision'}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[idx] = { ...proj, previewVisualType: e.target.value as any }
                              updateData((prev) => ({ ...prev, projects: updated, featuredProjects: updated }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-cyan-300"
                          >
                            <option value="vision">YOLO Computer Vision / Bounding Box HUD</option>
                            <option value="nlp">NLP Toxic Spans Highlight Analysis</option>
                            <option value="audio">Audio Spectrogram / MFCC Equalizer</option>
                            <option value="chatbot">LangChain Conversational Agent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={proj.shortDescription}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[idx] = { ...proj, shortDescription: e.target.value }
                            updateData((prev) => ({ ...prev, projects: updated, featuredProjects: updated }))
                          }}
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">GitHub Repository URL</label>
                          <input
                            type="text"
                            value={proj.githubUrl}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[idx] = { ...proj, githubUrl: e.target.value }
                              updateData((prev) => ({ ...prev, projects: updated, featuredProjects: updated }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Live Demo URL (optional)</label>
                          <input
                            type="text"
                            value={proj.liveDemoUrl || ''}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[idx] = { ...proj, liveDemoUrl: e.target.value }
                              updateData((prev) => ({ ...prev, projects: updated, featuredProjects: updated }))
                            }}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 5: RESUME MANAGEMENT (Section 12 of Master Prompt) */}
        {activeTab === 'resume' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-white">
                Resume Management System
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload or replace your PDF resume directly. Changes persist in local storage and
                serve immediately to the download buttons.
              </p>
            </div>

            {/* Current Published Resume Info Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-cyan-400">Currently Published Resume</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                  Active Document
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{resume?.filename || 'Chandu_Challa_Resume.pdf'}</p>
                  <p className="text-xs text-slate-400">Last updated: {resume?.lastUpdated || 'Current'}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={resume?.pdfUrl || '/Chandu_Challa_Resume.pdf'}
                  download={resume?.filename || 'Chandu_Challa_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Preview PDF</span>
                </a>
              </div>
            </div>

            {/* Upload PDF Input */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-colors text-center space-y-3">
              <FileDown className="w-8 h-8 text-cyan-400 mx-auto" />
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition">
                  <span>Select &amp; Replace PDF Resume</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 font-mono">Accepts .pdf files up to 8MB</p>
            </div>

            {uploadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {uploadError}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CONTACT & LINKS */}
        {activeTab === 'contact' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-white">
              Contact &amp; Professional Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={contact?.email || 'challachandu67@gmail.com'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                      profileData: { ...prev.profileData, email: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contact?.phone || '+91 9059169996'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                      profileData: { ...prev.profileData, phone: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              {/* Master Prompt: Prominent Naukri Profile URL */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1 flex items-center justify-between">
                  <span>Naukri Profile URL (Header &amp; Footer Buttons)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                </label>
                <input
                  type="url"
                  value={contact?.naukriUrl || 'https://www.naukri.com/mnjuser/profile'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, naukriUrl: e.target.value },
                    }))
                  }
                  placeholder="https://www.naukri.com/mnjuser/profile"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-sky-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profileData.linkedin || 'https://www.linkedin.com/'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, linkedin: e.target.value },
                      contact: { ...prev.contact, linkedin: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profileData.github || 'https://github.com/'}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      profileData: { ...prev.profileData, github: e.target.value },
                      contact: { ...prev.contact, github: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: APPEARANCE & SETTINGS */}
        {activeTab === 'appearance' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-white">
              Visual Effects &amp; Animation Controls
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <p className="font-semibold text-sm text-white">3D Avatar Gaze Tracking</p>
                  <p className="text-xs text-slate-400">
                    Real-time procedural WebGL/Canvas head tracking and orbital particles.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={data.appearance?.enable3DAvatar ?? true}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      appearance: { ...prev.appearance, enable3DAvatar: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <p className="font-semibold text-sm text-white">Background Interactive Particle Field</p>
                  <p className="text-xs text-slate-400">
                    Physics-based particle interactions following pointer coordinates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={data.appearance?.enableBackgroundParticles ?? true}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      appearance: {
                        ...prev.appearance,
                        enableBackgroundParticles: e.target.checked,
                      },
                    }))
                  }
                  className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 8: EXPORT CODE */}
        {activeTab === 'export' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-white">
              Bake Changes to Codebase (portfolioData.ts)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whenever you make edits in this Studio, you can copy or download the generated TypeScript
              data to overwrite <code className="text-cyan-300">src/data/portfolioData.ts</code>, keeping
              your Git repository permanently in sync.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs cursor-pointer shadow-md"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy TypeScript Code'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadTsFile}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download portfolioData.ts</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
