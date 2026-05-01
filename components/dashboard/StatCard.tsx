'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

// Animated count-up hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>()
  const start = useRef<number>()

  useEffect(() => {
    if (!target) return
    const animate = (ts: number) => {
      if (!start.current) start.current = ts
      const elapsed = ts - start.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return value
}

export function StatCard({ label, value, icon: Icon, color, glow, delay }: {
  label: string; value: number; icon: React.ElementType
  color: string; glow?: string; delay: number
}) {
  const count = useCountUp(value)
  const pct = value > 0 ? Math.min(100, (value / Math.max(value + 2, 10)) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`card card-interactive ${glow ? `hover:shadow-${glow}` : ''} group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-[var(--accent-success)] text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Active</span>
        </div>
      </div>
      <p className="text-4xl font-bold text-[var(--text-primary)] mb-1">{count}</p>
      <p className="text-[var(--text-secondary)] text-sm mb-4">{label}</p>
      <div className="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color.replace('bg-', 'bg-').replace('/15', '').replace('text-', '')}`}
          style={{
            background: color.includes('indigo') || color.includes('var(--accent-primary-subtle)')
              ? 'linear-gradient(90deg,var(--accent-primary),#818cf8)'
              : color.includes('emerald') || color.includes('var(--accent-success-subtle)')
              ? 'linear-gradient(90deg,var(--accent-success),#34d399)'
              : color.includes('violet')
              ? 'linear-gradient(90deg,#8b5cf6,#a78bfa)'
              : color.includes('amber') || color.includes('var(--accent-warning-subtle)')
              ? 'linear-gradient(90deg,var(--accent-warning),#fbbf24)'
              : 'var(--border-default)',
          }}
        />
      </div>
    </motion.div>
  )
}
