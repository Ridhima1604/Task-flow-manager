import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { jsonError, requireUser } from '@/lib/api-helpers'
import { Task } from '@/models/Task'
import { Project, type IActivityLog } from '@/models/Project'
import { User } from '@/models/User'
import { subDays, startOfDay } from 'date-fns'

export async function GET() {
  const { error, session } = await requireUser()
  if (error) return error

  try {
    await connectDB()
    const isAdmin = session.user.role === 'admin'

    // Task counts
    const taskQuery = isAdmin ? { createdBy: session.user.id } : { assignee: session.user.id }
    const [total, completed, inProgress, pending] = await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'completed' }),
      Task.countDocuments({ ...taskQuery, status: 'in-progress' }),
      Task.countDocuments({ ...taskQuery, status: 'pending' }),
    ])

    // Last 7 days activity (tasks created per day)
    const sevenDaysAgo = subDays(new Date(), 6)
    const recentTasks = await Task.find({
      ...taskQuery,
      createdAt: { $gte: startOfDay(sevenDaysAgo) },
    }).select('createdAt status')

    // Build 7-day chart data
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dayStart = startOfDay(d)
      const dayEnd = new Date(dayStart.getTime() + 86400000)
      const dayTasks = recentTasks.filter(t => {
        const created = new Date(t.createdAt)
        return created >= dayStart && created < dayEnd
      })
      return {
        day: dayStr,
        created: dayTasks.length,
        completed: dayTasks.filter(t => t.status === 'completed').length,
      }
    })

    // Recent tasks (last 5)
    const recentTasksList = await Task.find(taskQuery)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    // Recent projects
    const recentProjects = await Project.find({
      $or: [{ owner: session.user.id }, { members: session.user.id }]
    })
      .populate('members', 'name email')
      .sort({ updatedAt: -1 })
      .limit(4)

    // Activity feed (admin only — all projects' activity)
    let activityFeed: Array<{
      userName: string; action: string; timestamp: Date; type: string
    }> = []

    if (isAdmin) {
      const projects = await Project.find({ owner: session.user.id })
        .select('activityLog')
        .sort({ updatedAt: -1 })
      const allLogs = projects.flatMap(p =>
        p.activityLog.map((log: IActivityLog) => ({
          userName: log.userName,
          action: log.action,
          timestamp: log.timestamp,
          type: log.action.includes('created task')
            ? 'created'
            : log.action.includes('moved')
            ? 'moved'
            : log.action.includes('created a project')
            ? 'project'
            : 'completed',
        }))
      )
      activityFeed = allLogs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    }

    // System-wide stats (admin only)
    let systemStats = null
    if (isAdmin) {
      const [totalUsers, totalProjects] = await Promise.all([
        User.countDocuments(),
        Project.countDocuments({ owner: session.user.id }),
      ])
      systemStats = { totalUsers, totalProjects }
    }

    return NextResponse.json({
      stats: { total, completed, inProgress, pending },
      chartData,
      recentTasks: JSON.parse(JSON.stringify(recentTasksList)),
      recentProjects: JSON.parse(JSON.stringify(recentProjects)),
      activityFeed,
      systemStats,
    })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
  }
}
