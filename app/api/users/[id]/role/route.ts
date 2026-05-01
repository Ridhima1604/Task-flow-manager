import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser, isValidObjectId } from '@/lib/api-helpers'
import { User } from '@/models/User'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid user ID', 400)
  if (id === session.user.id) return jsonError('Cannot change your own role', 400)

  try {
    const { role } = await req.json()
    if (!['admin', 'member'].includes(role)) return jsonError('Invalid role', 400)

    await connectDB()
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password')
    if (!user) return jsonError('User not found', 404)
    return NextResponse.json(user)
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to update role')
  }
}
