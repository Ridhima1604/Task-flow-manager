import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { auth } from '../lib/auth'
import { Project } from '../models/Project'
import type { UserRole } from '../types'

export function jsonError(error: string, status = 500) {
  return NextResponse.json({ error }, { status })
}

export async function requireUser(role?: UserRole) {
  const session = await auth()
  if (!session?.user?.id) return { error: jsonError('Unauthorized', 401), session: null }
  if (role && session.user.role !== role) return { error: jsonError('Forbidden', 403), session: null }
  return { error: null, session }
}

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

export async function canAccessProject(projectId: string, userId: string, role: UserRole) {
  if (!isValidObjectId(projectId)) return false
  const project = await Project.findOne(
    role === 'admin'
      ? { _id: projectId, owner: userId }
      : { _id: projectId, members: userId },
  )
  return Boolean(project)
}

export function serializeDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T
}
