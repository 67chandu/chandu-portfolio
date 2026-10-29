import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'motion/react'
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  Cpu,
  Layers,
  Send,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'
import { usePortfolio } from '../../context'
import { staggerContainerVariant, fadeUpVariant } from '../../utils/animations'
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

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function ContactSection() {
  const { data } = usePortfolio()
  const { profileData, contact } = data

  const email = contact?.email || profileData.email || 'challachandu67@gmail.com'
  const phone = contact?.phone || profileData.phone || '+91 9059169996'
  const location = contact?.location || profileData.location || 'Hyderabad & Suryapet, Telangana, India'
  const githubUrl = contact?.githubUrl || profileData.github || 'https://github.com/67chandu'
  const linkedinUrl = contact?.linkedinUrl || profileData.linkedin || 'https://linkedin.com/in/chandu-challa'
  const naukriUrl = contact?.naukriUrl || 'https://www.naukri.com/mnjuser/profile'

  const [activeChannel, setActiveChannel] = useState<'role' | 'contract' | 'research' | 'coffee'>('role')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [subject, setSubject] = useState('Full-Time AI/ML Engineering Role Opportunity')
  const [message, setMessage] = useState(
    'Hi Chandu, we reviewed your AI/ML and Computer Vision engineering portfolio and would like to invite you for a technical discussion regarding an open engineering opportunity on our team...'
  )
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentTimeIST, setCurrentTimeIST] = useState('')

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const istString = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date())
      setCurrentTimeIST(istString)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Channel switch handler: auto-configures subject & draft message
  const handleSelectChannel = (channel: 'role' | 'contract' | 'research' | 'coffee') => {
    setActiveChannel(channel)
    if (channel === 'role') {
      setSubject('Full-Time AI/ML Engineering Role Opportunity')
      setMessage(
        'Hi Chandu, we evaluated your AI/ML and software engineering projects and would like to discuss an engineering role on our team...'
      )
    } else if (channel === 'contract') {
      setSubject('AI / Computer Vision Project Collaboration')
      setMessage(
        'Hi Chandu, we have a computer vision / deep learning project requiring real-time object tracking and would like to collaborate with you...'
      )
    } else if (channel === 'research') {
      setSubject('Applied Deep Learning & NLP Engineering Inquiry')
      setMessage(
        'Hi Chandu, your work on computer vision, toxic span NLP, and audio feature extraction matches our domain. Let us connect...'
      )
    } else {
      setSubject('Technical Coffee Chat & Software Networking')
      setMessage(
        'Hi Chandu, I came across your portfolio and wanted to connect for a casual tech coffee chat to talk software engineering and AI...'
      )
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2200)
    } catch {
      // ignore
    }
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2200)
    } catch {
      // ignore
    }
  }

  const handleCopyMessageDraft = async () => {
    try {
      const draftText = `To: ${email}\nSubject: ${subject}\n\n${message}\n\nSender: ${senderName || 'Visitor'} (${senderEmail || 'N/A'})`
      await navigator.clipboard.writeText(draftText)
      setCopiedMessage(true)
      setTimeout(() => setCopiedMessage(false), 2500)
    } catch {
      // ignore
    }
  }

  // Instant, reliable mailto submission
  const handleSendMailto = (e: FormEvent) => {
    e.preventDefault()

    const body = `Hello Chandu,\n\n${message}\n\n---\nSender: ${senderName}\nEmail: ${senderEmail}\nSent from Chandu Challa Portfolio`
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    setSubmitted(true)
    window.location.href = mailtoUrl
  }

  return (
    <section
      id="contact"
      aria-label="Contact Chandu Challa"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative border-t border-amber-500/15 overflow-hidden bg-[#07090e]"
    >
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/4 -right-32 w-96 h-96 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute bottom-10 -left-32 w-96 h-96 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Let&apos;s Connect &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-400">
              Build Together
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Open for full-time AI/ML engineering roles, software development opportunities, and technical collaboration.
            Send a direct message or connect instantly through the links below:
          </p>
        </div>

        {/* 4-Topic Preset Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-5xl mx-auto font-mono text-xs">
          {[
            {
              id: 'role' as const,
              label: '01 // FULL-TIME ROLE',
              sub: 'Career & Engineering Opportunities',
              icon: Cpu,
              accent: 'border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
            },
            {
              id: 'contract' as const,
              label: '02 // AI / CV PROJECT',
              sub: 'Vision & Deep Learning Systems',
              icon: Sparkles,
              accent: 'border-sky-400/60 bg-sky-500/15 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]',
            },
            {
              id: 'research' as const,
              label: '03 // NLP & APPLIED AI',
              sub: 'Transformers, NLP & Models',
              icon: Layers,
              accent: 'border-purple-400/60 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.2)]',
            },
            {
              id: 'coffee' as const,
              label: '04 // TECH CONNECT',
              sub: 'Casual Developer Discussion',
              icon: MessageSquare,
              accent: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]',
            },
          ].map((ch) => {
            const Icon = ch.icon
            const isSelected = activeChannel === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectChannel(ch.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between ${
                  isSelected
                    ? ch.accent
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold tracking-wider text-[11px]">{ch.label}</span>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{ch.sub}</span>
              </button>
            )
          })}
        </div>

        {/* Main 2-Column Contact Stage */}
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto"
        >
          {/* LEFT 5 COLS: Direct Communication & Profile Hub */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-5 space-y-4 text-left">
            {/* Availability & Location Card */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-5">
              {/* Active Status Badge */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Available for Hire
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                  2025 Graduate
                </span>
              </div>

              {/* Location & Time */}
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">{location}</span>
                    <span className="text-[11px] text-slate-400">Coordinates: 17.3850° N, 78.4867° E</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px]">Local Time: </span>
                    <span className="text-amber-300 font-bold">{currentTimeIST || 'Active IST'}</span>
                  </div>
                </div>
              </div>

              {/* Response Promise */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast response guaranteed. Typically replies within a few hours.</span>
              </div>
            </div>

            {/* Quick Contact Pods (Email & Phone) */}
            <div className="space-y-3 font-mono text-xs">
              {/* Email Pod */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase block">Direct Email</span>
                    <a
                      href={`mailto:${email}`}
                      className="text-white hover:text-amber-300 font-semibold truncate block text-xs transition"
                    >
                      {email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Pod */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase block">Phone / Mobile</span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-white hover:text-sky-300 font-semibold truncate block text-xs transition"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-sky-400 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Copy phone to clipboard"
                  aria-label="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Professional Social Links */}
            <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">GitHub</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px]">LinkedIn</span>
              </a>

              <a
                href={naukriUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Naukri</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT 7 COLS: Direct Message Form */}
          <motion.div
            variants={fadeUpVariant}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl text-left shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                  Send a Direct Message
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                ACTIVE INBOX
              </span>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Opening your default email client...</span>
                  <span className="text-[11px] text-emerald-300/90">
                    If your email app didn&apos;t open automatically, you can also copy the draft below with one click.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSendMailto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-sender-name" className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="contact-sender-name"
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Recruiter / Company Name"
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-sender-email" className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    id="contact-sender-email"
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Message *</span>
                  <span className="text-[10px] text-slate-500 font-mono">{message.length} chars</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/90 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Magnetic strength={0.2} radius={80} className="w-full sm:flex-1">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-950" />
                    <span>Send Message to Chandu</span>
                  </motion.button>
                </Magnetic>

                <button
                  type="button"
                  onClick={handleCopyMessageDraft}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  title="Copy full message draft for webmail (Gmail/Outlook)"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMessage ? 'Draft Copied!' : 'Copy Draft'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
