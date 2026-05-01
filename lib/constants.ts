import type { TaskPriority, TaskStatus } from '../types'

export const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed']
export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
