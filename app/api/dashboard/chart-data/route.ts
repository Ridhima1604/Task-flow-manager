import { NextResponse } from 'next/server'
import { format, startOfDay, subDays } from 'date-fns'
import { jsonError, requireUser } from '../../../../lib/api-helpers'
import { connectDB } from '../../../../lib/db'
import { Task } from '../../../../models/Task'

export async function GET() {
  const { error, session } = await requireUser()
  if (error) return error

  try {
    await connectDB()
    const days = Array.from({ length: 7 }, (_, index) => startOfDay(subDays(new Date(), 6 - index)))
    const query = session.user.role === 'admin' ? { createdBy: session.user.id } : { assignee: session.user.id }
    const tasks = await Task.find({ ...query, createdAt: { $gte: days[0] } }).select('createdAt updatedAt status')

    const chartData = days.map((day) => {
      const key = format(day, 'MMM d')
      return {
        day: key,
        created: tasks.filter((task) => format(task.createdAt, 'MMM d') === key).length,
        completed: tasks.filter((task) => task.status === 'completed' && format(task.updatedAt, 'MMM d') === key).length,
      }
    })

    return NextResponse.json({ chartData })
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Failed to fetch chart data')
  }
}
