# TaskFlow

A single-service Next.js full-stack TaskFlow built for Railway.

## Stack

- Next.js 14 App Router
- React 18
- NextAuth v5 credentials auth
- MongoDB Atlas + Mongoose
- Tailwind CSS
- Framer Motion
- Recharts
- @hello-pangea/dnd Kanban drag and drop

## Local Setup

```bash
npm install
```

Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
NEXTAUTH_SECRET=replace-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## API Routes

- `GET /api/health`
- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET|POST /api/projects`
- `GET|PATCH|DELETE /api/projects/:id`
- `GET|POST /api/tasks`
- `PATCH|DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `GET /api/users`
- `DELETE /api/users/:id`
- `PATCH /api/users/:id/role`
- `GET /api/dashboard/stats`
- `GET /api/dashboard/chart-data`

## Railway

This app deploys as one Railway service from the repository root.

Set these variables in Railway:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.railway.app
NODE_ENV=production
```

`MONGODB_DNS_SERVERS` is optional in Railway. It is useful on Windows/local networks where Node refuses SRV DNS lookups.

Railway uses:

```bash
npm install && npm run build
npm start
```

The health check path is `/api/health`.

## Notes

- Do not use `directConnection=true` in production.
- Do not hardcode backend localhost URLs; all app fetches are same-origin.
- `.env.local` is ignored and must not be committed.
