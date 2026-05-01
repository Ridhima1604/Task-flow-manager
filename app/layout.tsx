import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import { auth } from '../lib/auth'
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
        </Providers>
      </body>
    </html>
  )
}
