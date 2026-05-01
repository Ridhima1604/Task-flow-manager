import type { NextAuthConfig } from 'next-auth'
import type { UserRole } from '../types'

export const authConfig = {
  providers: [], // configured elsewhere
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ''
        token.role = user.role as UserRole
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET || 'build_time_secret_placeholder_for_stability',
} satisfies NextAuthConfig
