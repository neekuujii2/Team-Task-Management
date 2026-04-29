# Team Task Management System

A full-stack task management platform built for small teams that need clear ownership, role-based access, and a simple workflow for projects and tasks. The application combines a React frontend with a Node.js and Express API backed by MongoDB.

## Overview

This project is organized as two applications:

- `frontend/`: React + Vite client for authentication, dashboards, projects, and tasks.
- `backend/`: Express + MongoDB API with JWT authentication and role-based permissions.

## Key Features

- JWT-based authentication with signup, login, and current-user session restore
- Role-aware access control for `admin` and `member` users
- Team isolation using `teamId` across users, projects, tasks, and dashboard data
- Project creation and listing for each team
- Task creation, assignment, status updates, and due-date tracking
- Dashboard summary with total, completed, pending, and overdue task metrics

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios, Ant Design
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB

## Project Structure

```text
Task_Management_System_With_Roles/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- server.js
|   `-- seed.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- Components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   `-- Styles/
|   `-- vite.config.js
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB connection string

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` if you want to override the default API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default and the API health check is available at `http://localhost:5000/api/health`.

## Seed Data

The backend includes a simple seed script that ensures demo users exist:

```bash
cd backend
npm run seed
```

Demo credentials:

- `admin@team1.com / 123456`
- `member@team1.com / 123456`

## API Summary

Main route groups exposed by the backend:

- `/api/auth`
- `/api/projects`
- `/api/tasks`
- `/api/dashboard`
- `/api/users`

## Access Rules

- `admin` users can create projects and tasks and manage task details
- `member` users can view team-scoped data and update only the status of tasks assigned to them
- All major queries are scoped by `teamId`

## Scripts

### Frontend

- `npm run dev`: Start the Vite development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

### Backend

- `npm run dev`: Start the API with Nodemon
- `npm start`: Start the API with Node.js
- `npm run seed`: Seed demo users

## Notes

- `backend/node_modules` exists locally in this working copy, but it is ignored from Git.
- The repository is prepared as a clean project snapshot so only the current source structure is published.

## License

This project is provided for educational and portfolio use. Update the license section if you plan to publish it under a specific license.
