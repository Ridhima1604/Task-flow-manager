import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import { User } from '../../../../models/User'
import { jsonError } from '../../../../lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'member' } = await req.json()
    if (!name || !email || !password) {
      return jsonError('Name, email, and password are required', 400)
    }
    if (password.length < 6) {
      return jsonError('Password must be at least 6 characters', 400)
    }
    if (!['admin', 'member'].includes(role)) {
      return jsonError('Invalid role', 400)
    }

    await connectDB()

    // Admin role: only allowed if no admin exists yet
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' })
      if (existingAdmin) {
        return jsonError('An admin already exists. Register as a member instead.', 409)
      }
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return jsonError('An account with this email already exists', 409)
    }

    const user = await User.create({ name, email: email.toLowerCase(), password, role })
    return NextResponse.json(
      { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      { status: 201 },
    )
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Registration failed')
  }
}
