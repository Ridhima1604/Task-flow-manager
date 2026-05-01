'use client';

import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted' | 'admin' | 'member' | 'low' | 'medium' | 'high' | 'active' | 'pending' | 'in-progress' | 'completed';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | string;
  dot?: boolean;
}

const variantMap: Record<string, string> = {
  success: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]',
  warning: 'bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)]',
  danger: 'bg-[var(--accent-danger-subtle)] text-[var(--accent-danger)]',
  info: 'bg-[var(--accent-info-subtle)] text-[var(--accent-info)]',
  primary: 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]',
  muted: 'bg-[var(--border-subtle)] text-[var(--text-secondary)]',
  admin: 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]',
  member: 'bg-[var(--border-subtle)] text-[var(--text-secondary)]',
  low: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]',
  medium: 'bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)]',
  high: 'bg-[var(--accent-danger-subtle)] text-[var(--accent-danger)]',
  active: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]',
  pending: 'bg-[var(--border-subtle)] text-[var(--text-secondary)]',
  'in-progress': 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]',
  completed: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]',
};

export function Badge({ variant = 'muted', children, className, dot, ...props }: BadgeProps) {
  const styles = variantMap[variant] || variantMap.muted;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap',
        styles,
        className
      )}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children || (typeof variant === 'string' ? variant.charAt(0).toUpperCase() + variant.slice(1) : '')}
    </span>
  );
}

export default Badge;
