'use client'
import { SessionProvider } from 'next-auth/react'

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
