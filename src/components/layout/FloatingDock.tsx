import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from 'motion/react'
import {
  Home,
  User,
  Layers,
  FolderGit2,
  GraduationCap,
  FileText,
  Mail,
} from 'lucide-react'

interface DockItem {
  title: string
  icon: ReactNode
  href: string
}

const DOCK_ITEMS: DockItem[] = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, href: '#hero' },
  { title: 'About', icon: <User className="w-5 h-5" />, href: '#about' },
  { title: 'Skills', icon: <Layers className="w-5 h-5" />, href: '#skills' },
  { title: 'Projects', icon: <FolderGit2 className="w-5 h-5" />, href: '#projects' },
  { title: 'Education', icon: <GraduationCap className="w-5 h-5" />, href: '#education' },
  { title: 'Resume', icon: <FileText className="w-5 h-5" />, href: '#resume' },
  { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '#contact' },
]

function DockIcon({
  item,
  mouseX,
}: {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // Spring physics calculation for 21st.dev magnification
  const widthSync = useTransform(distance, [-120, 0, 120], [42, 58, 42])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 14 })

  return (
    <motion.a
      ref={ref}
      href={item.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={prefersReducedMotion ? { width: 44, height: 44 } : { width, height: width }}
      className="relative flex items-center justify-center rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 transition-colors shadow-lg cursor-pointer aspect-square"
      aria-label={`Jump to ${item.title}`}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 px-2.5 py-1 rounded-md bg-slate-950/95 border border-slate-800 text-[10px] font-mono font-medium text-amber-200 whitespace-nowrap shadow-xl pointer-events-none z-50"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      <span className="flex items-center justify-center pointer-events-none">
        {item.icon}
      </span>
    </motion.a>
  )
}

/**
 * FloatingDock
 * Signature component from 21st.dev:
 * Bottom-anchored glassmorphic dock with macOS-style spring magnification,
 * instant navigation to sections, and glowing interactive hover states.
 */
export function FloatingDock() {
  const mouseX = useMotionValue(Infinity)

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 hidden md:block select-none pointer-events-auto">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.title} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  )
}

