'use client'
import { cn } from '@/lib/utils'

const COLORS = [
  ['bg-indigo-500/20 text-indigo-300', 'ring-indigo-500/30'],
  ['bg-violet-500/20 text-violet-300', 'ring-violet-500/30'],
  ['bg-emerald-500/20 text-emerald-300', 'ring-emerald-500/30'],
  ['bg-rose-500/20 text-rose-300', 'ring-rose-500/30'],
  ['bg-amber-500/20 text-amber-300', 'ring-amber-500/30'],
  ['bg-sky-500/20 text-sky-300', 'ring-sky-500/30'],
  ['bg-pink-500/20 text-pink-300', 'ring-pink-500/30'],
  ['bg-teal-500/20 text-teal-300', 'ring-teal-500/30'],
]

export function getAvatarColors(name: string) {
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length
  return COLORS[idx]
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const sizeMap = {
  xs:  'w-6 h-6 text-[10px] ring-1',
  sm:  'w-8 h-8 text-xs ring-[1.5px]',
  md:  'w-10 h-10 text-sm ring-2',
  lg:  'w-12 h-12 text-base ring-2',
  xl:  'w-16 h-16 text-lg ring-2',
}

interface AvatarProps {
  name: string
  size?: keyof typeof sizeMap
  className?: string
  showRing?: boolean
}

export function Avatar({ name, size = 'md', className, showRing = false }: AvatarProps) {
  const [bg, ring] = getAvatarColors(name)
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold shrink-0 relative',
      sizeMap[size],
      bg,
      showRing && `ring ${ring}`,
      className,
    )}>
      {getInitials(name)}
    </div>
  )
}

export function AvatarStack({ names, max = 4, size = 'sm' }: {
  names: string[]
  max?: number
  size?: keyof typeof sizeMap
}) {
  const shown = names.slice(0, max)
  const extra = names.length - max
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((name, i) => (
        <Avatar key={i} name={name} size={size} showRing className="ring-[var(--bg-card)]" />
      ))}
      {extra > 0 && (
        <div className={cn(
          sizeMap[size],
          'rounded-full bg-[var(--bg-hover)] ring-2 ring-[var(--bg-card)] flex items-center justify-center text-[10px] font-semibold text-[var(--text-secondary)]',
        )}>
          +{extra}
        </div>
      )}
    </div>
  )
}
