# Task & Project Management System With Roles

A full-stack mini SaaS app for team-based project and task management with JWT auth, RBAC, MongoDB persistence, and strict `teamId` isolation.

## Stack

- Frontend: React, hooks, axios, React Router, Vite
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT + bcrypt
- Deployment target: Railway for backend/DB, Vercel optional for frontend

## Core Capabilities

- Signup and login with JWT
- Role-based access control for `admin` and `member`
- Team isolation using `teamId`
- Multi-project management
- Task assignment and status updates
- Dashboard summary for totals, completed, pending, and overdue tasks

## Roles

### Admin

- Create projects
- Create and assign tasks
- View all team projects and tasks
- View all users in the same team

### Member

- View only assigned tasks
- Update task status only
- View team projects

## Team Isolation Rules

Every user has a `teamId`.

- Projects are always filtered by `teamId`
- Tasks are always filtered by `teamId`
- Members also get an extra filter so they only see tasks assigned to them
- Admins can only assign tasks to users within the same `teamId`

## Project Structure

```text
.
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed.js
│   └── server.js
├── src
│   ├── api
│   ├── components
│   ├── context
│   ├── hooks
│   └── pages
└── README.md
```

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects` admin only
- `GET /api/projects` team filtered

### Tasks

- `POST /api/tasks` admin only
- `GET /api/tasks` team filtered, plus assigned-user-only for members
- `PUT /api/tasks/:id` admins can edit, members can update `status` only

### Dashboard

- `GET /api/dashboard/summary`

### Users

- `GET /api/users` admin only, returns team users for task assignment

## Required Seed Users

These are created by the seed script:

```json
{
  "email": "admin@team1.com",
  "password": "123456",
  "role": "admin",
  "teamId": "TEAM_ABC_001"
}
```

```json
{
  "email": "member@team1.com",
  "password": "123456",
  "role": "member",
  "teamId": "TEAM_ABC_001"
}
```

## Local Setup

### 1. Frontend

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-management-system
JWT_SECRET=replace-with-a-strong-secret
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Seed Users

From `backend/` run:

```bash
npm run seed
```

## Railway Deployment

### Backend service

1. Push the repository to GitHub.
2. In Railway, create a new project.
3. Add a MongoDB service or connect an external MongoDB instance.
4. Create a backend service using the `backend/` directory as the root.
5. Set environment variables:

```bash
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

6. Railway will run `npm install` and `npm start` from `backend/package.json`.

### Frontend service

Deploy the root project to Vercel and set:

```bash
VITE_API_URL=https://your-railway-backend-url/api
```

## Submission Checklist

- Live backend URL from Railway
- Live frontend URL
- GitHub repository URL
- Updated README
- Demo video

## Verification

- Frontend production build passes with `npm run build`
- Backend dependencies are installed in `backend/`

## Notes

- A local `postcss.config.js` was added so Vite no longer inherits a broken global Tailwind/PostCSS config from the parent user directory.
- The older demo components remain in the repo, but the app entry points now use the new authenticated RBAC workflow.
