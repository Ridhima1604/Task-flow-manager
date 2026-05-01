import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { connectDB } from '../lib/db'
import { User } from '../models/User'
import type { UserRole } from '../types'

import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
})
