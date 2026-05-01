'use client'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/lib/theme-provider'

// This file is kept for compatibility but the root layout.tsx handles providers directly.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
