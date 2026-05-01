import { NextResponse } from 'next/server'
import { startOfDay, subDays } from 'date-fns'
import { jsonError, requireUser } from '@/lib/api-helpers'
import { connectDB } from '@/lib/db'
import { Project } from '@/models/Project'
import { Task } from '@/models/Task'
import { User } from '@/models/User'

export async function GET() {
  const { error, session } = await requireUser()
  if (error) return error

  try {
    await connectDB()
    const taskQuery = session.user.role === 'admin' ? { createdBy: session.user.id } : { assignee: session.user.id }
    const [total, completed, inProgress, pending, recentTasks] = await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'completed' }),
      Task.countDocuments({ ...taskQuery, status: 'in-progress' }),
      Task.countDocuments({ ...taskQuery, status: 'pending' }),
      Task.find(taskQuery).populate('assignee', 'name email role').populate('project', 'name').sort({ updatedAt: -1 }).limit(5),
    ])

    const adminExtras = session.user.role === 'admin'
      ? {
          totalUsers: await User.countDocuments(),
          totalProjects: await Project.countDocuments({ owner: session.user.id }),
          activityLog: (await Project.find({ owner: session.user.id }).select('activityLog').sort({ updatedAt: -1 }).limit(10))
            .flatMap((project) => project.activityLog)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 20),
        }
      : {}

    return NextResponse.json({
      total,
      completed,
      inProgress,
      pending,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      recentTasks,
      since: startOfDay(subDays(new Date(), 6)),
      ...adminExtras,
    })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch stats')
  }
}
