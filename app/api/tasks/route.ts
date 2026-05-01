import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser } from '@/lib/api-helpers'
import { Project } from '@/models/Project'
import { Task } from '@/models/Task'
import { PRIORITIES, STATUSES } from '@/lib/constants'

export async function GET() {
  const { error, session } = await requireUser()
  if (error) return error

  await connectDB()
  const query = session.user.role === 'admin'
    ? { createdBy: session.user.id }
    : { assignee: session.user.id }
  const tasks = await Task.find(query)
    .populate('project', 'name')
    .populate('assignee', 'name email role createdAt')
    .sort({ createdAt: -1 })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  try {
    const { title, description = '', project, assignee = null, priority = 'medium', dueDate = null } = await req.json()
    if (!title || !project) return jsonError('Title and project are required', 400)
    if (!PRIORITIES.includes(priority)) return jsonError('Invalid priority', 400)

    await connectDB()
    const projectDoc = await Project.findOne({ _id: project, owner: session.user.id })
    if (!projectDoc) return jsonError('Project not found', 404)
    if (assignee && !projectDoc.members.some((member: { toString(): string }) => member.toString() === assignee)) {
      return jsonError('Assignee must be a project member', 400)
    }

    const task = await Task.create({ title, description, project, assignee, priority, dueDate, createdBy: session.user.id })
    projectDoc.activityLog.push({ user: session.user.id, userName: session.user.name ?? 'Admin', action: `created task "${title}"`, timestamp: new Date() })
    await projectDoc.save()
    return NextResponse.json(task, { status: 201 })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to create task')
  }
}
