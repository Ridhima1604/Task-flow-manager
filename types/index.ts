import type { DefaultSession } from 'next-auth'

export type UserRole = 'admin' | 'member'
export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface ApiUser {
  _id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface ApiProject {
  _id: string
  name: string
  description: string
  owner: ApiUser | string
  members: ApiUser[]
  activityLog?: ActivityLog[]
  taskStats?: {
    total: number
    pending: number
    inProgress: number
    completed: number
  }
  createdAt: string
  updatedAt: string
}

export interface ApiTask {
  _id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project: Pick<ApiProject, '_id' | 'name'> | string
  assignee: ApiUser | null
  dueDate: string | null
  createdBy: ApiUser | string
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  user: string
  userName: string
  action: string
  timestamp: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}
