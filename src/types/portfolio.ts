export interface HighlightItem {
  label: string
  value: string
  detail: string
}

export interface ProfileData {
  name: string
  monogram: string
  headerSubtitle: string
  badge: string
  location: string
  universityShort: string
  rolesRotator: string[]
  intro: string
  objective: string
  aboutParagraphs: string[]
  highlights: HighlightItem[]
  avatarPhotoUrl: string
  // Compatibility & extended fields
  bio?: string
  github?: string
  linkedin?: string
  degree?: string
  specialization?: string
  university?: string
  tagline?: string
  email?: string
  phone?: string
  resumeUrl?: string
  avatarUrl?: string
  initials?: string
  availabilityBadge?: string
  careerObjective?: string
  heroTitleLine1?: string
  heroTitleLine2?: string
  heroTitleLine3?: string
  heroNarrative?: string
  heroBadges?: string[]
  emailIsPlaceholder?: boolean
  phoneIsPlaceholder?: boolean
  socialLinks?: {
    id: string
    label: string
    url: string
    username?: string
    iconName?: string
    isPlaceholder?: boolean
  }[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  specialization: string
  startDate?: string
  completionDate?: string
  status?: 'Ongoing' | 'Completed' | string
  grade?: string
  description?: string
  coursework?: string[]
  logoUrl?: string
  // Compatibility fields
  period?: string
  location?: string
  statusBadge?: string
  keyCoursework?: string[]
}

export type SkillCategory =
  | 'Programming Languages'
  | 'Web Technologies'
  | 'AI/ML & Data'
  | 'Tools & Platforms'
  | 'Professional & Communication Skills'

export interface SkillItem {
  id: string
  name: string
  category: SkillCategory | string
  note: string
  levelLabel?: string
  categoryTag?: string
  description?: string
}

export interface ProjectItem {
  id: string
  title: string
  shortDescription: string
  problemSolved?: string
  features?: string[]
  technologies: string[]
  category: string
  visualType?: 'yolo' | 'nlp' | 'audio' | 'chatbot' | 'custom' | string
  thumbnailUrl?: string
  githubUrl?: string
  demoUrl?: string
  featured?: boolean
  status?: string
  order?: number
  // Compatibility & rich fields
  problemStatement?: string
  myContribution?: string
  keyFeatures?: string[]
  workflowSteps?: string[]
  challengesAndLessons?: string[]
  previewVisualType?: 'vision' | 'nlp' | 'audio' | 'chatbot' | string
  githubIsPlaceholder?: boolean
  liveDemoUrl?: string
  accentGradient?: string
  projectTypeBadge?: string
}

export interface AchievementItem {
  id: string
  title: string
  organization: string
  category?: string
  description: string
  statusNote?: string
  keyTakeaways?: string[]
}

export interface TroubleshootingItem {
  id: string
  title: string
  domain: string
  scenario: string
  diagnosticApproach: string
  resolutionAndTakeaway: string
  toolsUsed: string[]
}

export interface ResumeData {
  fileName?: string
  filename?: string
  dataUrl?: string
  pdfUrl?: string
  updatedAt?: string
  lastUpdated?: string
  published?: boolean
  summary?: string
}

export interface ContactData {
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
  naukriUrl: string
  webhookUrl?: string
}

export interface FooterData {
  tagline: string
  copyrightName: string
  naukriUrl?: string
}

export interface AppearanceSettings {
  enable3DAvatar: boolean
  enableParticles: boolean
  enableBackgroundParticles?: boolean
  enable3DTilt: boolean
  showAboutSection: boolean
  showSkillsSection: boolean
  showProjectsSection: boolean
  showEducationSection: boolean
  showContactSection: boolean
  showTroubleshootingSection?: boolean
}

export interface PortfolioState {
  profileData: ProfileData
  education: EducationEntry[]
  skills: SkillItem[]
  projects: ProjectItem[]
  achievements: AchievementItem[]
  resume: ResumeData
  contact: ContactData
  footer: FooterData
  appearance: AppearanceSettings
  adminPin: string
  // Compatibility fields
  educationList?: EducationEntry[]
  achievementsList?: AchievementItem[]
  featuredProjects?: ProjectItem[]
  skillCategories?: any[]
  troubleshooting?: TroubleshootingItem[]
  troubleshootingList?: TroubleshootingItem[]
}

export interface NavItem {
  label: string
  href: string
}
