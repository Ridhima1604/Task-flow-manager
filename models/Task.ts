import mongoose, { Document, Schema } from 'mongoose'
import type { TaskPriority, TaskStatus } from '../types'

export interface ITask extends Document {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project: mongoose.Types.ObjectId
  assignee: mongoose.Types.ObjectId | null
  dueDate: Date | null
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export const Task = mongoose.models.Task ?? mongoose.model<ITask>('Task', TaskSchema)
