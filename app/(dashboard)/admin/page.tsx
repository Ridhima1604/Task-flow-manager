'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import {
  ShieldCheck, Users, FolderKanban, ListTodo, MoreHorizontal,
  Trash2, Activity, CheckCircle2, Clock, Search,
} from 'lucide-react'
import nextDynamic from 'next/dynamic'
import { Badge } from '../../../components/ui/Badge'
import { Avatar } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { SkeletonTableRow, Skeleton } from '../../../components/ui/Skeleton'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { formatRelative, cn } from '../../../lib/utils'
import { StatCard } from '../../../components/dashboard/StatCard'
import * as Tabs from '@radix-ui/react-tabs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export const dynamic = 'force-dynamic';

const AdminPieChart = nextDynamic(() => import('../../../components/dashboard/AdminCharts').then(mod => mod.AdminPieChart), { ssr: false, loading: () => <Skeleton className="h-60 w-full rounded-xl" /> })
const AdminBarChart = nextDynamic(() => import('../../../components/dashboard/AdminCharts').then(mod => mod.AdminBarChart), { ssr: false, loading: () => <Skeleton className="h-60 w-full rounded-xl" /> })

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface User { _id: string; name: string; email: string; role: string; createdAt: string }
interface Project { _id: string; name: string; taskStats: { total: number } }

const ACTIVITY_COLORS: Record<string, string> = {
  created: 'bg-[var(--accent-primary)]',
  completed: 'bg-[var(--accent-success)]',
  moved: 'bg-[var(--accent-warning)]',
  project: 'bg-[var(--accent-primary)]',
}



function UserMenu({ userId, currentUserId, onDelete, onRoleChange }: {
  userId: string; currentUserId: string
  onDelete: () => void; onRoleChange: (role: string) => void
}) {
  const isSelf = userId === currentUserId
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="User options"
          disabled={isSelf}
          className={cn('btn btn-ghost btn-icon w-8 h-8 rounded-lg', isSelf && 'opacity-30 cursor-not-allowed')}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="glass rounded-xl border border-[var(--border-default)] p-1 min-w-[160px] shadow-modal z-50" sideOffset={4}>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={() => onRoleChange('admin')}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Make Admin
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={() => onRoleChange('member')}
          >
            <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Make Member
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-[var(--border-subtle)] my-1" />
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--accent-danger)] hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger-subtle)] rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}



export default function AdminPage() {
  const { data: session } = useSession()
  if (session && session.user?.role !== 'admin') redirect('/dashboard')

  const { data: users = [], mutate: mutateUsers, isLoading: usersLoading } = useSWR<User[]>('/api/users', fetcher)
  const { data: dashData, isLoading: dashLoading } = useSWR('/api/dashboard', fetcher)
  const { data: projects = [] } = useSWR<Project[]>('/api/projects', fetcher)

  const [tab, setTab] = useState('users')
  const [search, setSearch] = useState('')
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredUsers = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRoleChange(userId: string, role: string) {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Role updated to ${role}`)
      mutateUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  async function handleDeleteUser() {
    if (!deleteUser) return
    setDeleting(true)
    try {
      await fetch(`/api/users/${deleteUser._id}`, { method: 'DELETE' })
      toast.success('User deleted')
      setDeleteUser(null)
      mutateUsers()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  const stats = dashData?.stats ?? { total: 0, completed: 0, inProgress: 0, pending: 0 }
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const pieData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
  ]

  const barData = projects
    .sort((a, b) => (b.taskStats?.total ?? 0) - (a.taskStats?.total ?? 0))
    .slice(0, 5)
    .map(p => ({ name: p.name.slice(0, 16), tasks: p.taskStats?.total ?? 0 }))

  const TABS = [
    { value: 'users', label: 'Users' },
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity Log' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary-subtle)] flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[var(--accent-primary)]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
            <Badge variant="admin" dot={false} />
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Full control over users, projects, and system settings.</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List className="bg-[var(--border-subtle)] rounded-xl p-1 inline-flex gap-1 mb-8">
          {TABS.map(t => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all outline-none',
                tab === t.value ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              )}
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* ── USERS TAB ── */}
        <Tabs.Content value="users">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 h-9 text-sm"
              />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)] font-semibold">{users.length}</span> users
            </span>
          </div>

          <div className="card p-0 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] items-center gap-4 px-6 py-3 bg-[var(--border-subtle)] border-b border-[var(--border-default)]">
              <div />
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Role</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Joined</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</span>
            </div>

            {usersLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} />)
              : filteredUsers.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] items-center gap-4 px-6 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</span>
                  <span className="text-sm text-[var(--text-secondary)] truncate">{user.email}</span>
                  <Badge variant={user.role as 'admin' | 'member'} dot={false} />
                  <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{formatRelative(user.createdAt)}</span>
                  <UserMenu
                    userId={user._id}
                    currentUserId={session?.user?.id ?? ''}
                    onDelete={() => setDeleteUser(user)}
                    onRoleChange={role => handleRoleChange(user._id, role)}
                  />
                </motion.div>
              ))
            }
          </div>
        </Tabs.Content>

        {/* ── OVERVIEW TAB ── */}
        <Tabs.Content value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={users.length} icon={Users} color="bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]" delay={0} glow="glow-indigo" />
            <StatCard label="Active Projects" value={projects.length} icon={FolderKanban} color="bg-[var(--accent-success-subtle)] text-[var(--accent-success)]" delay={0.1} glow="glow-emerald" />
            <StatCard label="System Tasks" value={stats.total} icon={ListTodo} color="bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)]" delay={0.2} glow="glow-amber" />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="bg-[var(--border-subtle)] text-[var(--text-muted)]" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5">Task Status Distribution</h2>
              {dashLoading
                ? <Skeleton className="h-60 w-full rounded-xl" />
                : <AdminPieChart data={pieData} />
              }
            </div>

            <div className="card">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5">Project Velocity</h2>
              {dashLoading
                ? <Skeleton className="h-60 w-full rounded-xl" />
                : barData.length === 0
                  ? <div className="flex items-center justify-center h-60 text-[var(--text-muted)] text-sm">No projects yet</div>
                  : <AdminBarChart data={barData} />
              }
            </div>
          </div>
        </Tabs.Content>

        {/* ── ACTIVITY LOG TAB ── */}
        <Tabs.Content value="activity">
          <div className="card">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-6">Activity Log</h2>
            {dashLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !dashData?.activityFeed?.length ? (
              <p className="text-sm text-[var(--text-muted)] py-8 text-center">No activity yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--border-subtle)]" />
                <div className="space-y-5">
                  {dashData.activityFeed.map((event: { userName: string; action: string; timestamp: string; type: string }, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
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
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        loading={deleting}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteUser?.name}"? This cannot be undone.`}
        confirmLabel="Delete User"
      />
    </motion.div>
  )
}
