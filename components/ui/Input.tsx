'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-[var(--text-secondary)] tracking-wide ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          {icon && (
            <span className="absolute left-3.5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[var(--bg-input)] text-sm font-medium text-[var(--text-primary)] outline-none transition-all',
              'border border-[var(--border-default)] rounded-xl',
              icon ? 'pl-11 pr-4 py-2.5' : 'px-4 py-2.5',
              'focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary-subtle)]',
              error && 'border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[var(--accent-danger-subtle)]',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[11px] font-medium text-[var(--accent-danger)] ml-1">{error}</span>}
      </div>
    );
  }
);

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-[var(--text-secondary)] tracking-wide ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-[var(--bg-input)] text-sm font-medium text-[var(--text-primary)] outline-none transition-all',
            'border border-[var(--border-default)] rounded-xl px-4 py-3 min-h-[120px] resize-none',
            'focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary-subtle)]',
            error && 'border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[var(--accent-danger-subtle)]',
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] font-medium text-[var(--accent-danger)] ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';

export default Input;
