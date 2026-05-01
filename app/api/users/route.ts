import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser } from '@/lib/api-helpers'
import { User } from '@/models/User'

export async function GET() {
  const { error } = await requireUser()
  if (error) return error

  try {
    await connectDB()
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch users')
  }
}
