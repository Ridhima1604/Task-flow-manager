'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
        {label && (
          <label
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: '10px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              padding: icon ? '9px 12px 9px 34px' : '9px 12px',
              fontSize: '13px',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              background: 'var(--bg-input)',
              border: error
                ? '1px solid var(--accent-danger)'
                : '1px solid var(--border-default)',
              borderRadius: '10px',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error
                ? 'var(--accent-danger)'
                : 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = error
                ? '0 0 0 3px var(--accent-danger-subtle)'
                : '0 0 0 3px var(--accent-primary-subtle)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? 'var(--accent-danger)'
                : 'var(--border-default)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: '11px', color: 'var(--accent-danger)' }}>{error}</span>
        )}
      </div>
    );
  }
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
        {label && (
          <label
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '13px',
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            background: 'var(--bg-input)',
            border: error
              ? '1px solid var(--accent-danger)'
              : '1px solid var(--border-default)',
            borderRadius: '10px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--accent-danger)'
              : 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px var(--accent-danger-subtle)'
              : '0 0 0 3px var(--accent-primary-subtle)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--accent-danger)'
              : 'var(--border-default)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '11px', color: 'var(--accent-danger)' }}>{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';
export default Input;
