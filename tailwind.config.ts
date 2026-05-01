import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page:     'var(--bg-base)',
        sidebar:  'var(--sidebar-bg)',
        card:     'var(--bg-card)',
        elevated: 'var(--bg-elevated)',
        surface:  'var(--bg-surface)',
        border: {
          subtle:   'var(--border-subtle)',
          DEFAULT:  'var(--border-default)',
          strong:   'var(--border-strong)',
          focus:    'var(--accent-primary-subtle)',
        },
        primary: {
          DEFAULT: 'var(--accent-primary)',
          dark:    'var(--accent-primary-hover)',
          light:   'var(--accent-primary)',
          50:      'var(--accent-primary-subtle)',
          100:     'var(--accent-primary-subtle)',
          200:     'var(--accent-primary-subtle)',
        },
        accent:  'var(--accent-primary)',
        success: 'var(--accent-success)',
        warning: 'var(--accent-warning)',
        danger:  'var(--accent-danger)',
        info:    'var(--accent-info)',
        muted:   'var(--text-muted)',
        faint:   'var(--text-secondary)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.35s ease forwards',
        'slide-up':    'slideUp 0.35s ease forwards',
        'slide-down':  'slideDown 0.25s ease forwards',
        'scale-in':    'scaleIn 0.2s ease forwards',
        'shimmer':     'shimmer 2s infinite linear',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-soft': 'bounceSoft 0.5s ease',
        'glow':        'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown:  { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer:    { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        glow:       { from: { boxShadow: '0 0 8px rgba(99,102,241,0.2)' }, to: { boxShadow: '0 0 24px rgba(99,102,241,0.5)' } },
      },
      boxShadow: {
        'glow-indigo': '0 0 0 1px rgba(99,102,241,0.3), 0 4px 24px rgba(99,102,241,0.15)',
        'glow-violet': '0 0 0 1px rgba(139,92,246,0.3), 0 4px 24px rgba(139,92,246,0.12)',
        'glow-emerald':'0 0 0 1px rgba(16,185,129,0.3), 0 4px 24px rgba(16,185,129,0.12)',
        'glow-rose':   '0 0 0 1px rgba(244,63,94,0.3),  0 4px 24px rgba(244,63,94,0.12)',
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
        'card-hover':  '0 2px 8px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)',
        'modal':       '0 24px 80px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
export default config
