import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser, isValidObjectId } from '@/lib/api-helpers'
import { User } from '@/models/User'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid user ID', 400)
  if (id === session.user.id) return jsonError('Cannot delete your own account', 400)

  try {
    await connectDB()
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) return jsonError('User not found', 404)
    return NextResponse.json({ message: 'User deleted' })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to delete user')
  }
}
