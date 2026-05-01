import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser, serializeDoc } from '@/lib/api-helpers'
import { Project } from '@/models/Project'
import { Task } from '@/models/Task'

export async function GET() {
  const { error, session } = await requireUser()
  if (error) return error

  try {
    await connectDB()
    const query = session.user.role === 'admin' ? { owner: session.user.id } : { members: session.user.id }
    const projects = await Project.find(query).populate('members', 'name email role createdAt').sort({ createdAt: -1 })
    const stats = await Task.aggregate([
      { $match: { project: { $in: projects.map((project) => project._id) } } },
      { $group: { _id: { project: '$project', status: '$status' }, count: { $sum: 1 } } },
    ])

    const enriched = projects.map((project) => {
      const taskStats = { total: 0, pending: 0, inProgress: 0, completed: 0 }
      stats.filter((item) => item._id.project.toString() === project._id.toString()).forEach((item) => {
        taskStats.total += item.count
        if (item._id.status === 'pending') taskStats.pending = item.count
        if (item._id.status === 'in-progress') taskStats.inProgress = item.count
        if (item._id.status === 'completed') taskStats.completed = item.count
      })
      return { ...serializeDoc(project), taskStats }
    })

    return NextResponse.json(enriched)
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch projects')
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireUser('admin')
  if (error) return error

  try {
    const { name, description = '', members = [] } = await req.json()
    if (!name) return jsonError('Project name is required', 400)

    await connectDB()
    const project = await Project.create({
      name,
      description,
      owner: session.user.id,
      members,
      activityLog: [{ user: session.user.id, userName: session.user.name ?? 'Admin', action: 'created a project' }],
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to create project')
  }
}
