'use client'
import { ThemeProvider } from '@/lib/theme-provider'
import { Toaster } from 'react-hot-toast'
import { SafeAuthProvider } from '@/components/auth/SafeAuthProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAuthProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '14px 18px',
              fontSize: '14px',
              fontFamily: 'var(--font-inter)',
              boxShadow: 'var(--shadow-md)',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: { primary: 'var(--accent-success)', secondary: 'var(--bg-base)' },
              style: { borderColor: 'var(--accent-success-subtle)' },
            },
            error: {
              iconTheme: { primary: 'var(--accent-danger)', secondary: 'var(--bg-base)' },
              style: { borderColor: 'var(--accent-danger-subtle)' },
            },
            loading: {
              iconTheme: { primary: 'var(--accent-primary)', secondary: 'var(--bg-base)' },
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}
