import { ArrowUp, Mail, Phone, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../../context'
import { PersonalLogo } from '../common/PersonalLogo'
import { navItems } from '../../data/navItems'

const CURRENT_YEAR = new Date().getFullYear()

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

export function Footer() {
  const { data } = usePortfolio()
  const { profileData, contact, footer } = data

  const currentYear = CURRENT_YEAR
  const email = contact?.email || profileData.email || 'challachandu67@gmail.com'
  const phone = contact?.phone || profileData.phone || '+91 9059169996'
  const naukriUrl = contact?.naukriUrl || 'https://www.naukri.com/mnjuser/profile'
  const tagline =
    footer?.tagline ||
    profileData.tagline ||
    'Computer Science & Engineering (AI & ML) • Malla Reddy University'

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      aria-label="Site Footer"
      className="border-t border-amber-500/10 bg-[#06070a] pt-14 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 text-left"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Section: Brand + Links + Naukri CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info & Personal Logo */}
          <div className="md:col-span-5 space-y-3">
            <PersonalLogo />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <a
                href={`mailto:${email}`}
                className="hover:text-amber-300 inline-flex items-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{email}</span>
              </a>
              <span>•</span>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="hover:text-amber-300 inline-flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-amber-300 transition-colors py-0.5"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect & Naukri Button */}
          <div className="md:col-span-3 space-y-3 flex flex-col md:items-end">
            <p className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold w-full md:text-right">
              Professional Profiles
            </p>

            <div className="flex items-center gap-2">
              <a
                href={profileData.github || 'https://github.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href={profileData.linkedin || 'https://www.linkedin.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              {/* Back To Top Button */}
              <button
                type="button"
                onClick={scrollToTop}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                aria-label="Scroll back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

            {/* Prominent Naukri Profile Button on Footer */}
            <a
              href={naukriUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Chandu Challa's Naukri Profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>View My Naukri Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright Strip & Admin Access */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-slate-300">
              &copy; {currentYear}{' '}
              <span className="font-heading font-semibold text-amber-400 tracking-wide">
                Chandu Challa
              </span>
              . All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[11px] text-slate-400">
              Malla Reddy University • B.Tech CSE (AI &amp; ML) • Graduated 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
