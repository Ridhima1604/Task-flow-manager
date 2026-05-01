'use client'

import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { MoreHorizontal, Calendar, FolderKanban, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { formatDueDate, cn } from '../../lib/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  _id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  project: { _id: string; name: string }
  assignee: { _id: string; name: string; email: string } | null
  createdAt: string
}

const COLUMNS: { status: TaskStatus; label: string; color: string; dot: string; badge: string }[] = [
  { status: 'pending',     label: 'Pending',     color: 'border-[var(--border-strong)]',  dot: 'bg-[var(--text-muted)]',  badge: 'bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-default)]' },
  { status: 'in-progress', label: 'In Progress', color: 'border-[var(--accent-primary)]', dot: 'bg-[var(--accent-primary)]', badge: 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary-subtle)]' },
  { status: 'completed',   label: 'Completed',   color: 'border-[var(--accent-success)]',dot: 'bg-[var(--accent-success)]',badge: 'bg-[var(--accent-success-subtle)] text-[var(--accent-success)] border border-[var(--accent-success-subtle)]' },
]

function TaskCardMenu({ taskId, onEdit, onDelete }: { taskId: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Task options"
          className="btn btn-ghost btn-icon w-7 h-7 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all"
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
            <Pencil className="w-3.5 h-3.5" /> Edit task
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--accent-danger)] hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger-subtle)] rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function TaskCard({ task, index, isAdmin, onEdit, onDelete, searchQuery }: {
  task: Task; index: number; isAdmin: boolean
  onEdit: (t: Task) => void; onDelete: (t: Task) => void; searchQuery: string
}) {
  const { label: dueLabel, overdue } = formatDueDate(task.dueDate)

  function highlight(text: string) {
    if (!searchQuery) return text
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="bg-[var(--accent-warning-subtle)] text-[var(--accent-warning)] rounded px-0.5">{part}</mark>
        : part
    )
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group bg-[var(--bg-card)] border rounded-xl p-4 transition-all duration-200 cursor-grab active:cursor-grabbing',
            snapshot.isDragging
              ? 'border-[var(--accent-primary)] shadow-modal rotate-[1.5deg] scale-[1.03]'
              : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary-subtle)] hover:shadow-glow-indigo hover:translate-y-[-2px]',
          )}
          style={provided.draggableProps.style}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant={task.priority} />
              <Badge variant={task.status} />
            </div>
            {isAdmin && (
              <TaskCardMenu
                taskId={task._id}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task)}
              />
            )}
          </div>

          <p className="text-sm font-medium text-[var(--text-primary)] mb-1 truncate-2 leading-snug">
            {highlight(task.title)}
          </p>

          {task.description && (
            <p className="text-xs text-[var(--text-secondary)] mb-3 truncate-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="h-px bg-[var(--border-subtle)] my-3" />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {task.project && (
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 truncate">
                  <FolderKanban className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{task.project.name}</span>
                </span>
              )}
              {dueLabel && (
                <span className={cn('text-[11px] flex items-center gap-1 shrink-0', overdue ? 'text-[var(--accent-danger)]' : 'text-[var(--text-muted)]')}>
                  <Calendar className="w-2.5 h-2.5" />
                  {dueLabel}
                </span>
              )}
            </div>
            {task.assignee && (
              <Avatar name={task.assignee.name} size="xs" />
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default function KanbanBoard({ tasks, onDragEnd, isAdmin, onEdit, onDelete, search, loading }: {
  tasks: Task[]
  onDragEnd: (result: DropResult) => void
  isAdmin: boolean
  onEdit: (t: Task) => void
  onDelete: (t: Task) => void
  search: string
  loading: boolean
}) {
  const byStatus = (status: TaskStatus) => tasks.filter(t => t.status === status)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
        {COLUMNS.map(col => (
          <Droppable key={col.status} droppableId={col.status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  'flex flex-col gap-3 min-h-[200px] rounded-2xl p-4 border-t-2 transition-all duration-200',
                  'bg-white/[0.02]',
                  col.color,
                  snapshot.isDraggingOver && 'bg-[var(--accent-primary-subtle)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary-subtle)]',
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
                  </div>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', col.badge)}>
                    {byStatus(col.status).length}
                  </span>
                </div>

                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
                ) : byStatus(col.status).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-xs text-[var(--text-muted)]">Drop tasks here</p>
                  </div>
                ) : (
                  byStatus(col.status).map((task, i) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      index={i}
                      isAdmin={isAdmin}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      searchQuery={search}
                    />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
