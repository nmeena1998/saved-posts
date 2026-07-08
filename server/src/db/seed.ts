import { db } from './connection.js';
import { courses, enrollments, posts, savedPosts, users } from './schema.js';

await db.delete(savedPosts);
await db.delete(posts);
await db.delete(enrollments);
await db.delete(courses);
await db.delete(users);

const now = Date.now();

await db.insert(users).values([
  { id: 'student-1', name: 'Nitesh', role: 'student' },
  { id: 'student-2', name: 'Ava', role: 'student' },
  { id: 'student-3', name: 'Liam', role: 'student' },
  { id: 'moderator-1', name: 'Nour', role: 'moderator' },
]);

await db.insert(courses).values([
  { id: 'course-1', title: 'Full Stack Foundations' },
  { id: 'course-2', title: 'Product Engineering' },
]);

await db.insert(enrollments).values([
  { id: 'enr-1', userId: 'student-1', courseId: 'course-1' },
  { id: 'enr-2', userId: 'student-2', courseId: 'course-2' },
  { id: 'enr-3', userId: 'student-3', courseId: 'course-1' },
]);

await db.insert(posts).values([
  { id: 'post-1', courseId: 'course-1', authorId: 'student-1', title: 'Welcome to the course', body: 'Introduce yourself and share your goals.', createdAt: new Date(now - 1_000) },
  { id: 'post-2', courseId: 'course-1', authorId: 'student-3', title: 'React Query question', body: 'When should I invalidate a query after mutation?', createdAt: new Date(now - 2_000) },
  { id: 'post-3', courseId: 'course-1', authorId: 'student-1', title: 'SQLite vs Postgres', body: 'What trade-offs should we consider for the take-home?', createdAt: new Date(now - 3_000) },
  { id: 'post-4', courseId: 'course-2', authorId: 'student-2', title: 'API versioning', body: 'How do you version public APIs?', createdAt: new Date(now - 4_000) },
  { id: 'post-5', courseId: 'course-2', authorId: 'student-2', title: 'Idempotency keys', body: 'Where should idempotency keys be persisted?', createdAt: new Date(now - 5_000) },
]);

console.log('Seed complete');
