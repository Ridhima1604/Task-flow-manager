import mongoose, { Document, Schema } from 'mongoose'

export interface IActivityLog {
  user: mongoose.Types.ObjectId
  userName: string
  action: string
  timestamp: Date
}

export interface IProject extends Document {
  name: string
  description: string
  owner: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  activityLog: IActivityLog[]
  createdAt: Date
  updatedAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
)

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    activityLog: { type: [ActivityLogSchema], default: [] },
  },
  { timestamps: true },
)

export const Project = mongoose.models.Project ?? mongoose.model<IProject>('Project', ProjectSchema)
