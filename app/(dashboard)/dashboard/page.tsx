'use client'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import {
  ListTodo, CheckCircle2, Activity, Clock, TrendingUp,
  ArrowRight, Calendar, FolderKanban,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { SkeletonStatCard, Skeleton } from '@/components/ui/Skeleton'
import { formatDueDate, formatRelative, getGreeting } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { StatCard } from '@/components/dashboard/StatCard'

const ActivityChart = dynamic(() => import('@/components/dashboard/ActivityChart'), { ssr: false, loading: () => <Skeleton className="h-[260px] w-full rounded-xl" /> })

const fetcher = (url: string) => fetch(url).then(r => r.json())

const ACTIVITY_COLORS: Record<string, string> = {
  created: 'bg-[var(--accent-primary)]',
  completed: 'bg-[var(--accent-success)]',
  moved: 'bg-[var(--accent-warning)]',
  project: 'bg-[var(--accent-primary)]',
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data, isLoading } = useSWR('/api/dashboard', fetcher)

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'
  const greeting = getGreeting()
  const isAdmin = session?.user?.role === 'admin'

  const stats = data?.stats ?? { total: 0, completed: 0, inProgress: 0, pending: 0 }

  const STAT_CARDS = [
    { label: 'Total Tasks',  value: stats.total,       icon: ListTodo,     color: 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]', glow: 'glow-indigo',  delay: 0    },
    { label: 'Completed',    value: stats.completed,   icon: CheckCircle2, color: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)]', glow: 'glow-emerald', delay: 0.08 },
    { label: 'In Progress',  value: stats.inProgress,  icon: Activity,     color: 'bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)]', glow: 'glow-amber',   delay: 0.16 },
    { label: 'Pending',      value: stats.pending,     icon: Clock,        color: 'bg-[var(--border-subtle)] text-[var(--text-muted)]',             glow: undefined,      delay: 0.24 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(), 'EEEE, MMMM d')}</span>
          <span>·</span>
          <span className="text-[var(--accent-primary)]">{greeting}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {greeting}, <span className="text-gradient-primary">{firstName}</span>
        </h1>
        <p className="text-slate-400">
          Here&apos;s what&apos;s happening with your team today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
          : STAT_CARDS.map(c => <StatCard key={c.label} {...c} />)
        }
      </div>

      {/* Charts + Recent Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="xl:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Task Activity</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">Created</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-success)]" />
                <span className="text-[var(--text-secondary)]">Completed</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-[260px] w-full rounded-xl" />
          ) : (
            <ActivityChart data={data?.chartData ?? []} />
          )}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent Tasks</h2>
            <button
              onClick={() => router.push('/tasks')}
              className="text-xs text-[var(--accent-primary)] hover:opacity-80 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentTasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ListTodo className="w-8 h-8 text-[var(--text-muted)] mb-3" />
              <p className="text-sm text-[var(--text-secondary)]">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {(data?.recentTasks ?? []).map((task: {
                _id: string; title: string; status: string; priority: string
                dueDate: string | null; project: { name: string }; assignee?: { name: string }
              }, i: number) => {
                const { label: dueLabel, overdue } = formatDueDate(task.dueDate)
                return (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    onClick={() => router.push('/tasks')}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      task.status === 'completed' ? 'bg-emerald-400' :
                      task.status === 'in-progress' ? 'bg-indigo-400' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight group-hover:text-[var(--accent-primary)] transition-colors">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <FolderKanban className="w-2.5 h-2.5" />
                          {task.project?.name ?? 'Unknown'}
                        </span>
                        {dueLabel && (
                          <span className={`text-[11px] ${overdue ? 'text-[var(--accent-danger)]' : 'text-[var(--text-muted)]'}`}>
                            {dueLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={task.priority as 'low' | 'medium' | 'high'} dot={false} className="shrink-0" />
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Projects Row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Active Projects</h2>
          <button onClick={() => router.push('/projects')} className="text-xs text-[var(--accent-primary)] font-medium">
            View all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollable">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="min-w-[280px] h-32 rounded-xl" />)
          ) : (data?.recentProjects ?? []).length === 0 ? (
            <div className="text-sm text-slate-500 p-4 border border-[var(--border-subtle)] rounded-xl w-full text-center">No projects found.</div>
          ) : (
            (data?.recentProjects ?? []).map((project: any) => (
              <div key={project._id} className="card min-w-[300px] flex-shrink-0" style={{ borderLeft: `3px solid ${project.color || 'var(--accent-primary)'}` }}>
                <h4 className="font-semibold text-sm mb-1 truncate">{project.name}</h4>
                <p className="text-xs text-[var(--text-muted)] mb-4 truncate-2 h-8">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="avatar-stack">
                    {(project.members || []).slice(0, 3).map((m: any, i: number) => (
                      <Avatar key={i} name={m.name} size="sm" showRing className="border-2 border-[var(--bg-card)]" />
                    ))}
                  </div>
                  <Badge variant={project.status === 'active' ? 'success' : 'warning'} dot={false} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Feed — admin only */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Team Activity</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Recent actions across all projects</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-2 h-2 rounded-full shrink-0 mt-1.5" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.activityFeed?.length ? (
            <p className="text-sm text-[var(--text-muted)] py-6 text-center">No activity yet. Create a project or task to get started.</p>
          ) : (
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--border-subtle)]" />
              <div className="space-y-5">
                {data.activityFeed.map((event: {
                  userName: string; action: string; timestamp: string; type: string
                }, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-4 relative"
                  >
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 ring-2 ring-[var(--bg-card)] z-10 ${ACTIVITY_COLORS[event.type] ?? 'bg-[var(--text-muted)]'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">{event.userName}</span>{' '}
                        {event.action}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatRelative(event.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
