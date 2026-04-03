# TaskBoard — Full-Stack Task Management App

A Trello-inspired task management web application built with Node.js, Express, TypeScript, PostgreSQL, and React. Users can register, log in, and manage tasks across a Kanban-style board with status columns (To Do, In Progress, Done).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

## Features

- **User Authentication** — Register and login with secure bcrypt password hashing and JWT tokens
- **Task CRUD** — Create, read, update, and delete tasks via RESTful API
- **Kanban Board** — Trello-style UI with 3 columns: To Do, In Progress, Done
- **Task Priority** — Set priority levels (Low, Medium, High) with color-coded badges
- **Due Dates** — Assign due dates to tasks
- **Search & Filter** — Search tasks by title/description and filter by status
- **Protected Routes** — All task endpoints require authentication; users can only access their own data
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| Frontend | React + Axios |
| Deployment | Render + Supabase |

## Project Structure

```
taskmanager/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── controllers/        # Route handler functions
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── routes/             # Express route definitions
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication middleware
│   │   ├── utils/
│   │   │   ├── prisma.ts       # Database client (singleton)
│   │   │   └── jwt.ts          # Token sign/verify helpers
│   │   └── index.ts            # App entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema (User + Task models)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # React app
    └── src/
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   └── DashboardPage.tsx
        ├── components/
        │   ├── TaskCard.tsx
        │   └── CreateTaskForm.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── api.ts              # Axios API client
        └── App.tsx             # Router + protected routes
```

## API Endpoints

### Authentication (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tasks (protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) installed and running

### 1. Clone the repo

```bash
git clone https://github.com/sippanun1/taskmanager.git
cd taskmanager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskmanager?schema=public"
```

Create the database and run migrations:

```bash
psql -U postgres -c "CREATE DATABASE taskmanager;"
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      String    @default("TODO")     // TODO, IN_PROGRESS, DONE
  priority    String    @default("MEDIUM")   // LOW, MEDIUM, HIGH
  dueDate     DateTime?
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Deployment

- **Database:** [Supabase](https://supabase.com) (free PostgreSQL)
- **Backend:** [Render](https://render.com) (Web Service)
- **Frontend:** [Render](https://render.com) (Static Site)

## License

MIT
