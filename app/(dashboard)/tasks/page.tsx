'use client'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import nextDynamic from 'next/dynamic'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import {
  Plus, Search, MoreHorizontal, Calendar, FolderKanban,
  Pencil, Trash2, X, Filter,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatDueDate, cn } from '@/lib/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Task, TaskStatus, TaskPriority } from '@/components/tasks/KanbanBoard'
import type { DropResult } from '@hello-pangea/dnd'

export const dynamic = 'force-dynamic';

const KanbanBoard = nextDynamic(() => import('@/components/tasks/KanbanBoard'), { ssr: false, loading: () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3 min-h-[200px] rounded-2xl p-4 border-t-2 bg-white/[0.02] border-[var(--border-subtle)]">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    ))}
  </div>
)})

const fetcher = (url: string) => fetch(url).then(r => r.json())



interface User { _id: string; name: string; email: string; role: string }
interface Project { _id: string; name: string }

function TaskForm({ task, projects, users, onSubmit, loading }: {
  task?: Task | null
  projects: Project[]
  users: User[]
  onSubmit: (data: Record<string, unknown>) => void
  loading: boolean
}) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [project, setProject] = useState(task?.project?._id ?? '')
  const [assignee, setAssignee] = useState(task?.assignee?._id ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pending')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, project, assignee: assignee || null, priority, dueDate: dueDate || null, status })
  }

  return (
    <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
      <Input label="Task Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" required />
      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add details..." />

      <div className="grid grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label">Project *</label>
          <select value={project} onChange={e => setProject(e.target.value)} required>
            <option value="">Select project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Assignee</label>
          <select value={assignee} onChange={e => setAssignee(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Priority pills */}
      <div className="input-group">
        <label className="input-label">Priority</label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
            <button
              key={p} type="button"
              onClick={() => setPriority(p)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all border',
                priority === p
                  ? p === 'high'   ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : p === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                  : 'bg-white/[0.04] text-slate-500 border-white/[0.06] hover:border-white/[0.12]',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label" htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        {/* Status segmented control */}
        <div className="input-group">
          <label className="input-label">Status</label>
          <div className="flex bg-white/[0.04] rounded-lg p-1 gap-1">
            {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map(s => (
              <button
                key={s} type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  'flex-1 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                  status === s ? 'bg-elevated text-white shadow-sm' : 'text-slate-500 hover:text-slate-300',
                )}
              >
                {s === 'in-progress' ? 'Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}

export default function TasksPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const { data: tasks = [], mutate } = useSWR<Task[]>('/api/tasks', fetcher)
  const { data: projects = [] } = useSWR<Project[]>(isAdmin ? '/api/projects' : null, fetcher)
  const { data: users = [] } = useSWR<User[]>('/api/users', fetcher)

  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loading = !tasks && !Array.isArray(tasks)

  // Filter tasks
  const filtered = tasks.filter(t => {
    const q = search.toLowerCase()
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    const matchesPriority = !filterPriority || t.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const byStatus = (status: TaskStatus) => filtered.filter(t => t.status === status)

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const newStatus = result.destination.droppableId as TaskStatus
    const taskId = result.draggableId
    const task = tasks.find(t => t._id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    const optimistic = tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t)
    mutate(optimistic, false)

    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Task moved to ${newStatus === 'in-progress' ? 'In Progress' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`)
      mutate()
    } catch {
      mutate(tasks, false) // revert
      toast.error('Failed to update task status')
    }
  }

  async function handleSubmit(formData: Record<string, unknown>) {
    setSubmitting(true)
    try {
      const url = editTask ? `/api/tasks/${editTask._id}` : '/api/tasks'
      const method = editTask ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editTask ? 'Task updated successfully' : 'Task created successfully')
      setModalOpen(false)
      setEditTask(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteTask) return
    setDeleting(true)
    try {
      await fetch(`/api/tasks/${deleteTask._id}`, { method: 'DELETE' })
      toast.success('Task deleted')
      setDeleteTask(null)
      mutate()
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tasks</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Manage and track task progress.</p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setEditTask(null); setModalOpen(true) }}
          >
            New Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(prev => prev === p ? '' : p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border',
                filterPriority === p
                  ? p === 'high'   ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : p === 'medium' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                  : 'bg-white/[0.04] text-slate-500 border-white/[0.06] hover:border-white/[0.12] hover:text-slate-300',
              )}
            >
              {p}
            </button>
          ))}
          <AnimatePresence>
            {(search || filterPriority) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => { setSearch(''); setFilterPriority('') }}
                className="btn btn-ghost btn-sm text-slate-500 hover:text-rose-400 gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <KanbanBoard
        tasks={filtered}
        onDragEnd={onDragEnd}
        isAdmin={isAdmin}
        onEdit={t => { setEditTask(t); setModalOpen(true) }}
        onDelete={setDeleteTask}
        search={search}
        loading={loading}
      />

      {/* FAB — admin only */}
      {isAdmin && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => { setEditTask(null); setModalOpen(true) }}
          className="fixed bottom-8 right-8 btn btn-primary btn-lg rounded-2xl shadow-glow-indigo gap-2 hidden lg:inline-flex"
        >
          <Plus className="w-5 h-5" /> New Task
        </motion.button>
      )}

      {/* Task modal */}
      {isAdmin && (
        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditTask(null) }}
          title={editTask ? 'Edit Task' : 'Create New Task'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => { setModalOpen(false); setEditTask(null) }}>Cancel</Button>
              <Button variant="primary" loading={submitting} type="submit" form="task-form">
                {editTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </>
          }
        >
          <TaskForm
            task={editTask}
            projects={projects}
            users={users}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
      />
    </motion.div>
  )
}
