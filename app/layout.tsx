import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'TaskFlow', template: '%s · TaskFlow' },
  description: "The most beautiful way to manage your team's projects and tasks.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${dmSans.variable} font-sans bg-page text-[var(--text-primary)] antialiased`}>
        <Providers>
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
        </Providers>
      </body>
    </html>
  )
}
