import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import { jsonError, requireUser, isValidObjectId, serializeDoc } from '../../../../lib/api-helpers'
import { Project } from '../../../../models/Project'
import { Task } from '../../../../models/Task'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser()
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid project ID', 400)

  try {
    await connectDB()
    const query = session.user.role === 'admin'
      ? { _id: id, owner: session.user.id }
      : { _id: id, members: session.user.id }
    const project = await Project.findOne(query).populate('members', 'name email role createdAt')
    if (!project) return jsonError('Project not found', 404)
    return NextResponse.json(serializeDoc(project))
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch project')
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid project ID', 400)

  try {
    const { name, description, members } = await req.json()
    await connectDB()
    const project = await Project.findOneAndUpdate(
      { _id: id, owner: session.user.id },
      { ...(name && { name }), ...(description !== undefined && { description }), ...(members && { members }) },
      { new: true },
    ).populate('members', 'name email role createdAt')
    if (!project) return jsonError('Project not found', 404)
    return NextResponse.json(serializeDoc(project))
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to update project')
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid project ID', 400)

  try {
    await connectDB()
    const project = await Project.findOneAndDelete({ _id: id, owner: session.user.id })
    if (!project) return jsonError('Project not found', 404)
    await Task.deleteMany({ project: id })
    return NextResponse.json({ message: 'Project deleted' })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to delete project')
  }
}
