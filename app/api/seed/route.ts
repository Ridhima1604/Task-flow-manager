import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../../lib/db'
import { User } from '../../../models/User'
import { Project } from '../../../models/Project'
import { Task } from '../../../models/Task'
import mongoose from 'mongoose'

// Phase 1: DEMO DATA LAYER
const DEMO_USERS = [
  { _id: new mongoose.Types.ObjectId(), name: 'Ridhima Pandey', email: 'ridhima@teamtask.io', role: 'admin', rawPassword: 'password123' },
  { _id: new mongoose.Types.ObjectId(), name: 'Aryan Mehta', email: 'aryan@teamtask.io', role: 'member', rawPassword: 'password123' },
  { _id: new mongoose.Types.ObjectId(), name: 'Priya Nair', email: 'priya@teamtask.io', role: 'member', rawPassword: 'password123' },
  { _id: new mongoose.Types.ObjectId(), name: 'Kabir Singh', email: 'kabir@teamtask.io', role: 'member', rawPassword: 'password123' },
  { _id: new mongoose.Types.ObjectId(), name: 'Sanya Patel', email: 'sanya@teamtask.io', role: 'member', rawPassword: 'password123' },
]

export async function POST() {
  try {
    await connectDB()

    // 1. Clear existing data
    await User.deleteMany({})
    await Project.deleteMany({})
    await Task.deleteMany({})

    // 2. Insert Users
    const hashedUsers = await Promise.all(DEMO_USERS.map(async u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      password: await bcrypt.hash(u.rawPassword, 10),
    })))
    await User.insertMany(hashedUsers)

    // 3. Insert Projects
    const p1Id = new mongoose.Types.ObjectId()
    const p2Id = new mongoose.Types.ObjectId()
    const p3Id = new mongoose.Types.ObjectId()
    const p4Id = new mongoose.Types.ObjectId()

    const projectsToInsert = [
      {
        _id: p1Id,
        name: 'Website Redesign',
        description: 'Complete overhaul of the company marketing website with new branding',
        owner: DEMO_USERS[0]._id,
        members: [DEMO_USERS[0]._id, DEMO_USERS[2]._id, DEMO_USERS[4]._id],
        activityLog: [
          { user: DEMO_USERS[2]._id, userName: DEMO_USERS[2].name, action: 'completed task', timestamp: new Date(Date.now() - 2 * 3600000) },
        ],
      },
      {
        _id: p2Id,
        name: 'Mobile App v2.0',
        description: 'Feature-rich second version of the mobile application with offline support',
        owner: DEMO_USERS[0]._id,
        members: [DEMO_USERS[1]._id, DEMO_USERS[3]._id, DEMO_USERS[4]._id],
        activityLog: [
          { user: DEMO_USERS[1]._id, userName: DEMO_USERS[1].name, action: 'started working on', timestamp: new Date(Date.now() - 3 * 3600000) },
          { user: DEMO_USERS[3]._id, userName: DEMO_USERS[3].name, action: 'assigned task to Aryan', timestamp: new Date(Date.now() - 86400000) },
          { user: DEMO_USERS[4]._id, userName: DEMO_USERS[4].name, action: 'commented on task', timestamp: new Date(Date.now() - 86400000) },
        ],
      },
      {
        _id: p3Id,
        name: 'API Integration',
        description: 'Third-party payment gateway and analytics integration',
        owner: DEMO_USERS[0]._id,
        members: [DEMO_USERS[0]._id, DEMO_USERS[1]._id],
        activityLog: [],
      },
      {
        _id: p4Id,
        name: 'Design System',
        description: 'Build a shared component library and design token system',
        owner: DEMO_USERS[0]._id,
        members: [DEMO_USERS[2]._id, DEMO_USERS[4]._id],
        activityLog: [
          { user: DEMO_USERS[0]._id, userName: DEMO_USERS[0].name, action: 'created project', timestamp: new Date(Date.now() - 5 * 3600000) },
        ],
      },
    ]
    await Project.insertMany(projectsToInsert)

    // 4. Insert Tasks
    const d = new Date()
    const tasksToInsert = [
      { title: 'Design new homepage hero section', project: p1Id, assignee: DEMO_USERS[2]._id, status: 'completed', priority: 'high', dueDate: new Date(d.getTime() + 4 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Implement authentication flow', project: p2Id, assignee: DEMO_USERS[1]._id, status: 'in-progress', priority: 'high', dueDate: new Date(d.getTime() + 9 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Write API documentation', project: p3Id, assignee: DEMO_USERS[0]._id, status: 'in-progress', priority: 'medium', dueDate: new Date(d.getTime() + 7 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Set up CI/CD pipeline', project: p2Id, assignee: DEMO_USERS[3]._id, status: 'pending', priority: 'high', dueDate: new Date(d.getTime() + 14 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Create color token system', project: p4Id, assignee: DEMO_USERS[2]._id, status: 'in-progress', priority: 'medium', dueDate: new Date(d.getTime() + 11 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'User testing session', project: p1Id, assignee: DEMO_USERS[4]._id, status: 'pending', priority: 'medium', dueDate: new Date(d.getTime() + 17 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Fix payment gateway timeout bug', project: p3Id, assignee: DEMO_USERS[1]._id, status: 'completed', priority: 'high', dueDate: new Date(d.getTime() + 2 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Responsive layout for tablet', project: p1Id, assignee: DEMO_USERS[2]._id, status: 'completed', priority: 'low', dueDate: new Date(d.getTime()), createdBy: DEMO_USERS[0]._id },
      { title: 'Onboarding screen animations', project: p2Id, assignee: DEMO_USERS[4]._id, status: 'pending', priority: 'low', dueDate: new Date(d.getTime() + 24 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Button component variants', project: p4Id, assignee: DEMO_USERS[2]._id, status: 'completed', priority: 'medium', dueDate: new Date(d.getTime() - 3 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Database query optimization', project: p3Id, assignee: DEMO_USERS[1]._id, status: 'completed', priority: 'high', dueDate: new Date(d.getTime() - 1 * 86400000), createdBy: DEMO_USERS[0]._id },
      { title: 'Write unit tests for auth module', project: p2Id, assignee: DEMO_USERS[3]._id, status: 'in-progress', priority: 'medium', dueDate: new Date(d.getTime() + 13 * 86400000), createdBy: DEMO_USERS[0]._id },
    ]
    await Task.insertMany(tasksToInsert)

    return NextResponse.json({ message: 'Database successfully seeded with demo data.' })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Seeding failed' }, { status: 500 })
  }
}
