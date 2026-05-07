# Task Management App (Trello Clone)

## Project Overview
A full-stack Task Management application built as a portfolio project for junior backend developer roles.

## Tech Stack
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (register/login)
- **Frontend:** React + Axios

## Project Structure
```
node/
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/   # Route handler functions
│   │   ├── routes/        # Express route definitions
│   │   ├── middleware/    # Auth middleware, error handling
│   │   ├── utils/        # Helper functions (JWT, Prisma client)
│   │   └── index.ts      # App entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── package.json
│   └── tsconfig.json
└── frontend/         # React app (separate)
```

## Commands
- `cd backend && npm run dev` — Start backend dev server with hot reload (nodemon + ts-node)
- `cd backend && npx prisma migrate dev` — Run database migrations
- `cd backend && npx prisma studio` — Open Prisma's visual database browser
- `cd backend && npx prisma generate` — Regenerate Prisma client after schema changes

## Environment Variables
Backend `.env` file (in `backend/` directory):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for signing JWT tokens
- `PORT` — Server port (default: 3000)

## API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token
- `GET /api/tasks` — Get all tasks for logged-in user (protected)
- `POST /api/tasks` — Create a new task (protected)
- `GET /api/tasks/:id` — Get a single task (protected)
- `PUT /api/tasks/:id` — Update a task (protected)
- `DELETE /api/tasks/:id` — Delete a task (protected)

## Conventions
- All protected routes require `Authorization: Bearer <token>` header
- Task statuses: "TODO", "IN_PROGRESS", "DONE"
- Passwords are hashed with bcrypt before storing
- TypeScript strict mode is enabled

## Git & GitHub Workflow
After completing any meaningful piece of work — a feature, a bug fix, a refactor, or a config change — commit and push to GitHub immediately. Never let finished work sit uncommitted.

**Commit rules:**
- Write a clear subject line in the imperative mood: `add task filtering by status`, not `added stuff`
- Use a prefix to categorise: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- If the change needs explanation, add a short body after a blank line describing *why*, not just *what*
- Keep commits focused — one logical change per commit, not a dump of everything at once

**When to commit:**
- After scaffolding a new file or route
- After a feature is working (even if not yet polished)
- After fixing a bug
- After updating environment config, Dockerfile, or schema
- Before switching to a different part of the codebase

**Push after every commit** — a commit that only lives locally offers no protection against data loss.
