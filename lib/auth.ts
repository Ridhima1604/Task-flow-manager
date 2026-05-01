import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import type { UserRole } from '@/types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        await connectDB()
        const user = await User.findOne({ email }).select('+password')
        if (!user) return null

        const isValid = await user.comparePassword(password)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
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
  secret: process.env.NEXTAUTH_SECRET,
})
