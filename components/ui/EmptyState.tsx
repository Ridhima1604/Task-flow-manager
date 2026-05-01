'use client'
import { motion } from 'framer-motion'
import { Button } from './Button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  iconColor?: string
}

export function EmptyState({
  icon: Icon, title, description, action, iconColor = 'text-[var(--text-muted)]',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-5">
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>{action.label}</Button>
      )}
    </motion.div>
  )
}
