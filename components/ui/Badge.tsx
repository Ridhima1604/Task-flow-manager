'use client';

import { HTMLAttributes } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted' | 'admin' | 'member' | 'low' | 'medium' | 'high' | 'active' | 'pending' | 'in-progress' | 'completed';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: 'var(--accent-success-subtle)', color: 'var(--accent-success)' },
  warning: { bg: 'var(--accent-warning-subtle)', color: 'var(--accent-warning)' },
  danger:  { bg: 'var(--accent-danger-subtle)',  color: 'var(--accent-danger)' },
  info:    { bg: 'var(--accent-info-subtle)',    color: 'var(--accent-info)' },
  primary: { bg: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' },
  muted:   { bg: 'var(--border-subtle)',         color: 'var(--text-secondary)' },
  admin:   { bg: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' },
  member:  { bg: 'var(--border-subtle)',         color: 'var(--text-secondary)' },
  low:     { bg: 'var(--accent-success-subtle)', color: 'var(--accent-success)' },
  medium:  { bg: 'var(--accent-warning-subtle)', color: 'var(--accent-warning)' },
  high:    { bg: 'var(--accent-danger-subtle)',  color: 'var(--accent-danger)' },
  active:  { bg: 'var(--accent-success-subtle)', color: 'var(--accent-success)' },
  pending: { bg: 'var(--border-subtle)',         color: 'var(--text-secondary)' },
  'in-progress': { bg: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' },
  completed: { bg: 'var(--accent-success-subtle)', color: 'var(--accent-success)' },
};

export function Badge({ variant = 'muted', children, style, dot, ...props }: BadgeProps) {
  const { bg, color } = variantMap[variant as BadgeVariant] || variantMap.muted;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 9px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.025em',
        whiteSpace: 'nowrap',
        background: bg,
        color: color,
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'currentColor',
          }}
        />
      )}
      {children || variant.charAt(0).toUpperCase() + variant.slice(1)}
    </span>
  );
}

export default Badge;
