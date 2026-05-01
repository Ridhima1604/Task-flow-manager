import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import { jsonError, requireUser, isValidObjectId } from '../../../../lib/api-helpers'
import { Task } from '../../../../models/Task'
import { Project } from '../../../../models/Project'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid task ID', 400)

  try {
    const { title, description, priority, dueDate, assignee, status } = await req.json()
    await connectDB()
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: session.user.id },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(assignee !== undefined && { assignee }),
        ...(status && { status }),
      },
      { new: true },
    ).populate('project', 'name').populate('assignee', 'name email role')
    if (!task) return jsonError('Task not found', 404)
    return NextResponse.json(task)
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to update task')
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  const { id } = params
  if (!isValidObjectId(id)) return jsonError('Invalid task ID', 400)

  try {
    await connectDB()
    const task = await Task.findOneAndDelete({ _id: id, createdBy: session.user.id })
    if (!task) return jsonError('Task not found', 404)
    return NextResponse.json({ message: 'Task deleted' })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to delete task')
  }
}
