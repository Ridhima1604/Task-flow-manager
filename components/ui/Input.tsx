import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export function Input({ label, error, hint, icon, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="input-group">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(icon && 'pl-10', error && 'border-rose-500/50 focus:border-rose-500/70', className)}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--accent-danger)] mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-secondary)] mt-1">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="input-group">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <textarea
        id={inputId}
        rows={3}
        className={cn('resize-none', error && 'border-rose-500/50', className)}
        {...props}
      />
      {error && <p className="text-xs text-[var(--accent-danger)] mt-1">{error}</p>}
    </div>
  )
}
