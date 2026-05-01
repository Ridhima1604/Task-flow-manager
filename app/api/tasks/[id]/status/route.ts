import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../../lib/db'
import { jsonError, requireUser, isValidObjectId } from '../../../../../lib/api-helpers'
import { Task } from '../../../../../models/Task'
import { Project } from '../../../../../models/Project'

const VALID_STATUSES = ['pending', 'in-progress', 'completed']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser()
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid task ID', 400)

  try {
    const { status } = await req.json()
    if (!VALID_STATUSES.includes(status)) return jsonError('Invalid status', 400)

    await connectDB()

    // Find task — admin: by createdBy, member: by assignee
    const query = session.user.role === 'admin'
      ? { _id: id, createdBy: session.user.id }
      : { _id: id, assignee: session.user.id }

    const oldTask = await Task.findOne(query)
    if (!oldTask) return jsonError('Task not found', 404)

    const prevStatus = oldTask.status
    oldTask.status = status
    await oldTask.save()

    // Log to project activity
    const project = await Project.findById(oldTask.project)
    if (project) {
      project.activityLog.push({
        user: session.user.id as unknown as import('mongoose').Types.ObjectId,
        userName: session.user.name ?? 'User',
        action: `moved "${oldTask.title}" from ${prevStatus} to ${status}`,
        timestamp: new Date(),
      })
      await project.save()
    }

    const updatedTask = await Task.findById(id)
      .populate('project', 'name')
      .populate('assignee', 'name email role')
    return NextResponse.json(updatedTask)
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to update task status')
  }
}
