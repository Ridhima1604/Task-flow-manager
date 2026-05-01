'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: `
    background: var(--accent-primary);
    color: white;
    border: none;
  `,
  ghost: `
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-default);
  `,
  danger: `
    background: var(--accent-danger-subtle);
    color: var(--accent-danger);
    border: 1px solid var(--accent-danger);
  `,
  outline: `
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-strong);
  `,
};

const sizeStyles: Record<string, string> = {
  sm: 'padding: 5px 12px; font-size: 12px; border-radius: 8px;',
  md: 'padding: 8px 16px; font-size: 13px; border-radius: 10px;',
  lg: 'padding: 11px 22px; font-size: 14px; border-radius: 12px;',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, children, style, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontFamily: 'inherit',
          fontWeight: 500,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          ...Object.fromEntries(
            (variantStyles[variant] + sizeStyles[size])
              .split(';')
              .filter(Boolean)
              .map((rule) => {
                const [k, ...v] = rule.split(':');
                return [
                  k.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase()),
                  v.join(':').trim(),
                ];
              })
          ),
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }}
          />
        ) : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
