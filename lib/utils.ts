import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isOverdue(date: string | Date | null): boolean {
  if (!date) return false
  return isPast(new Date(date))
}

export function formatDueDate(date: string | Date | null): { label: string; overdue: boolean } {
  if (!date) return { label: '', overdue: false }
  const d = new Date(date)
  const overdue = isPast(d)
  return {
    label: overdue
      ? `Overdue · ${format(d, 'MMM d')}`
      : `Due ${formatDistanceToNow(d, { addSuffix: true })}`,
    overdue,
  }
}

export function statusToVariant(status: string): 'pending' | 'in-progress' | 'completed' {
  return status as 'pending' | 'in-progress' | 'completed'
}

export function priorityToVariant(priority: string): 'low' | 'medium' | 'high' {
  return priority as 'low' | 'medium' | 'high'
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Generate a color index from a string (for project colors)
export function stringToColorIndex(str: string, max: number): number {
  return str.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % max
}

export const PROJECT_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-pink-500',
  'from-teal-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-sky-500 to-indigo-500',
]

export const PROJECT_GRADIENT_SOLIDS = [
  ['#6366f1', '#8b5cf6'],
  ['#8b5cf6', '#ec4899'],
  ['#14b8a6', '#06b6d4'],
  ['#10b981', '#14b8a6'],
  ['#f59e0b', '#f97316'],
  ['#f43f5e', '#ec4899'],
  ['#38bdf8', '#6366f1'],
]
