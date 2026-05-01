import { cn } from '@/lib/utils'

type Variant = 'pending' | 'in-progress' | 'completed' | 'low' | 'medium' | 'high' | 'admin' | 'member' | 'new' | 'success' | 'warning'

const variantMap: Record<Variant, string> = {
  pending:       'badge badge-muted',
  'in-progress': 'badge badge-primary',
  completed:     'badge badge-success',
  low:           'badge badge-muted',
  medium:        'badge badge-warning',
  high:          'badge badge-danger',
  admin:         'badge badge-primary',
  member:        'badge badge-muted',
  new:           'badge badge-info',
  success:       'badge badge-success',
  warning:       'badge badge-warning',
}

const labelMap: Record<Variant, string> = {
  pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed',
  low: 'Low', medium: 'Medium', high: 'High',
  admin: 'Admin', member: 'Member', new: 'New',
  success: 'Success', warning: 'Warning',
}

const dotMap: Record<Variant, string> = {
  pending:       'bg-[var(--text-muted)]',
  'in-progress': 'bg-[var(--accent-primary)]',
  completed:     'bg-[var(--accent-success)]',
  low:           'bg-[var(--text-muted)]',
  medium:        'bg-[var(--accent-warning)]',
  high:          'bg-[var(--accent-danger)]',
  admin:         'bg-[var(--accent-primary)]',
  member:        'bg-[var(--text-muted)]',
  new:           'bg-[var(--accent-info)]',
  success:       'bg-[var(--accent-success)]',
  warning:       'bg-[var(--accent-warning)]',
}

export function Badge({ variant, label, dot = true, className }: {
  variant: Variant
  label?: string
  dot?: boolean
  className?: string
}) {
  return (
    <span className={cn(variantMap[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 mr-1.5', dotMap[variant])} />}
      {label ?? labelMap[variant]}
    </span>
  )
}
