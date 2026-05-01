'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  ShieldCheck, LogOut, Menu, X, ChevronRight,
  Bell, Settings, Users, BarChart2
} from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { cn } from '../../lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects',  label: 'Projects',  icon: FolderKanban },
  { href: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { href: '/admin',     label: 'Team',      icon: Users },
  { href: '/dashboard', label: 'Analytics', icon: BarChart2 },
]

const ADMIN_NAV = { href: '/admin', label: 'Admin', icon: ShieldCheck }

function NavItem({ href, label, icon: Icon, active }: {
  href: string; label: string; icon: React.ElementType; active: boolean
}) {
  return (
    <Link href={href}>
      <motion.div
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
          'transition-all duration-200 cursor-pointer select-none group',
          active
            ? 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
        )}
        whileHover={{ x: active ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active-bar"
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent-primary)] rounded-r-md"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <Icon className={cn('w-4 h-4', active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
        <span className="flex-1 leading-none">{label}</span>
      </motion.div>
    </Link>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const allNav = isAdmin ? [...NAV, ADMIN_NAV] : NAV

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3 shrink-0">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center shrink-0 shadow-md"
        >
          <span className="font-bold text-white tracking-wider text-sm">TF</span>
        </motion.div>
        <div>
          <p className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-none">Task</p>
          <p className="text-xs text-[var(--text-secondary)] leading-none mt-1 uppercase tracking-widest font-semibold">Flow</p>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close sidebar" className="ml-auto btn btn-ghost btn-icon rounded-lg text-[var(--text-muted)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-5 mb-2">
        <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Navigation</p>
      </div>

      <nav className="px-3 flex-1 space-y-0.5 overflow-y-auto scrollable no-scrollbar">
        {allNav.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') && item.href !== '/dashboard')
            }
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 shrink-0 space-y-1">
        <div className="divider mx-2 my-3" />

        <div className="flex items-center gap-1 px-2 mb-2">
          <ThemeToggle />
        </div>

        {session?.user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-subtle)] group hover:bg-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all">
            <Avatar name={session.user.name ?? 'User'} size="sm" showRing />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-none">{session.user.name}</p>
              <div className="mt-1">
                <Badge variant={isAdmin ? 'admin' : 'member'} dot={false} />
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger-subtle)] transition-all opacity-0 group-hover:opacity-100"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    if (mobile) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobile])

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] h-screen sticky top-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--accent-primary-subtle)] to-transparent pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setMobile(true)}
        aria-label="Open sidebar"
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-default)] text-[var(--text-secondary)] shadow-card"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            onClick={() => setMobile(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <motion.aside
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] shadow-modal"
          >
            <SidebarContent onClose={() => setMobile(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
