'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2, MoreHorizontal, FolderKanban, Users } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Input, Textarea } from '../../../components/ui/Input'
import { SkeletonCard } from '../../../components/ui/Skeleton'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { AvatarStack, Avatar } from '../../../components/ui/Avatar'
import { Badge } from '../../../components/ui/Badge'
import { formatRelative, stringToColorIndex, PROJECT_GRADIENT_SOLIDS, cn } from '../../../lib/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export const dynamic = 'force-dynamic';

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Member { _id: string; name: string; email: string; role: string }
interface Project {
  _id: string; name: string; description: string; createdAt: string
  members: Member[]
  taskStats: { total: number; pending: number; inProgress: number; completed: number }
}

function ProjectCardMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Project options"
          className="btn btn-ghost btn-icon w-7 h-7 rounded-lg text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
          onClick={e => e.stopPropagation()}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="glass rounded-xl border border-[var(--border-default)] p-1 min-w-[140px] shadow-modal z-50"
          sideOffset={4}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={onEdit}
          >
            <Pencil className="w-3.5 h-3.5" /> Edit project
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function ProjectCard({ project, isAdmin, onEdit, onDelete }: {
  project: Project; isAdmin: boolean
  onEdit: (p: Project) => void; onDelete: (p: Project) => void
}) {
  const { total, pending, inProgress, completed } = project.taskStats
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const gradIdx = stringToColorIndex(project._id, PROJECT_GRADIENT_SOLIDS.length)
  const [c1, c2] = PROJECT_GRADIENT_SOLIDS[gradIdx]
  const initial = project.name.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card card-interactive hover:shadow-glow-indigo group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--text-primary)] truncate leading-tight">{project.name}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate-2 leading-relaxed">
            {project.description || 'No description'}
          </p>
        </div>
        {isAdmin && (
          <ProjectCardMenu onEdit={() => onEdit(project)} onDelete={() => onDelete(project)} />
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[var(--text-muted)]">Progress</span>
          <span className="text-[var(--text-primary)] font-semibold">{pct}%</span>
        </div>
        <div className="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-[var(--accent-primary)]"
          />
        </div>
      </div>

      {/* Task stats */}
      <div className="flex items-center gap-3 text-xs mb-4">
        <span className="text-[var(--text-secondary)]">{total} tasks</span>
        <span className="text-[var(--text-muted)]">·</span>
        <span className="flex items-center gap-1 text-[var(--text-primary)]"><span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full" />{pending} pending</span>
        <span className="flex items-center gap-1 text-[var(--text-primary)]"><span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full" />{inProgress} active</span>
        <span className="flex items-center gap-1 text-[var(--text-primary)]"><span className="w-1.5 h-1.5 bg-[var(--accent-success)] rounded-full" />{completed} done</span>
      </div>

      <div className="h-px bg-[var(--border-subtle)] mb-4" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {project.members.length > 0
          ? <AvatarStack names={project.members.map(m => m.name)} max={4} />
          : <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Users className="w-3 h-3" />No members</span>
        }
        <span className="text-[11px] text-[var(--text-muted)]">{formatRelative(project.createdAt)}</span>
      </div>
    </motion.div>
  )
}

function ProjectForm({ project, users, onSubmit, loading }: {
  project?: Project | null; users: Member[]
  onSubmit: (data: { name: string; description: string; members: string[] }) => void
  loading: boolean
}) {
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(project?.members.map(m => m._id) ?? [])
  const [memberSearch, setMemberSearch] = useState('')

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  function toggleMember(id: string) {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ name, description, members: selectedMembers })
  }

  return (
    <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
      <Input label="Project Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. API Service" required />
      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this project about?" />

      <div className="input-group">
        <label className="input-label">Members</label>
        <input
          type="text"
          value={memberSearch}
          onChange={e => setMemberSearch(e.target.value)}
          placeholder="Search members..."
          className="mb-3"
        />
        <div className="border border-[var(--border-default)] rounded-xl overflow-hidden max-h-48 overflow-y-auto scrollable">
          {filteredUsers.map(user => (
            <label key={user._id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-subtle)] last:border-0 transition-colors">
              <input
                type="checkbox"
                checked={selectedMembers.includes(user._id)}
                onChange={() => toggleMember(user._id)}
                className="w-4 h-4 rounded accent-indigo-500"
                style={{ width: '16px', padding: '0', margin: '0' }}
              />
              <Avatar name={user.name} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
              </div>
              <Badge variant={user.role as 'admin' | 'member'} dot={false} />
            </label>
          ))}
        </div>
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMembers.map(id => {
              const u = users.find(u => u._id === id)
              if (!u) return null
              return (
                <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/25 text-xs text-indigo-300">
                  {u.name}
                  <button type="button" onClick={() => toggleMember(id)} className="hover:text-rose-400 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </form>
  )
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const { data: projects = [], mutate, isLoading } = useSWR<Project[]>('/api/projects', fetcher)
  const { data: users = [] } = useSWR<Member[]>(isAdmin ? '/api/users' : null, fetcher)

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const filtered = projects.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(formData: { name: string; description: string; members: string[] }) {
    setSubmitting(true)
    try {
      const url = editProject ? `/api/projects/${editProject._id}` : '/api/projects'
      const method = editProject ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editProject ? 'Project updated successfully' : 'Project created successfully')
      setModalOpen(false)
      setEditProject(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteProject) return
    setDeleting(true)
    try {
      await fetch(`/api/projects/${deleteProject._id}`, { method: 'DELETE' })
      toast.success('Project deleted')
      setDeleteProject(null)
      mutate()
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Manage your team&apos;s projects.</p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setEditProject(null); setModalOpen(true) }}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="pl-10 h-9 text-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          iconColor="text-indigo-600"
          title={search ? 'No projects found' : 'No projects yet'}
          description={search ? 'Try a different search term.' : 'Create your first project to start organizing tasks for your team.'}
          action={isAdmin ? { label: 'Create project', onClick: () => setModalOpen(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  isAdmin={isAdmin}
                  onEdit={p => { setEditProject(p); setModalOpen(true) }}
                  onDelete={setDeleteProject}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {isAdmin && (
        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditProject(null) }}
          title={editProject ? 'Edit Project' : 'New Project'}
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => { setModalOpen(false); setEditProject(null) }}>Cancel</Button>
              <Button variant="primary" loading={submitting} type="submit" form="project-form">
                {editProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </>
          }
        >
          <ProjectForm project={editProject} users={users} onSubmit={handleSubmit} loading={submitting} />
        </Modal>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteProject?.name}"? All associated tasks will also be deleted.`}
        confirmLabel="Delete Project"
      />
    </motion.div>
  )
}
