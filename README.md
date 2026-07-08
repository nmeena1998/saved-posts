# THEKEY Community Forum — Saved Posts

A small full-stack slice for a course discussion forum with end-to-end Saved Posts.

## Stack

- TypeScript strict mode
- Server: Hono typed router, Zod, Drizzle ORM
- Database: SQLite
- Web: React + Vite + TanStack React Query
- i18n: message catalog with English and French
- Tests: Vitest

## Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Server runs on `http://localhost:3001`.
Web runs on `http://localhost:5173`.

The demo UI sends these stub auth headers by default:

```txt
x-user-id: student-1
x-user-role: student
```

## Test

```bash
npm test
npm run typecheck
```

## Demo users

- `student-1`: enrolled in `course-1`
- `student-2`: enrolled in `course-2`
- `moderator-1`: moderator

## API

```txt
GET    /courses/:courseId/posts?page=1&limit=10
POST   /posts/:postId/save
DELETE /posts/:postId/save
GET    /me/saved-posts?page=1&limit=10
DELETE /moderation/posts/:postId
```
