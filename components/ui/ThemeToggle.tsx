'use client'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../lib/theme-provider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle theme"
      className="relative p-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4" />
          : <Moon className="w-4 h-4" />
        }
      </motion.div>
    </motion.button>
  )
}
