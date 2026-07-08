import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema.js';

export function makeTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(`
  CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL);
  CREATE TABLE courses (id TEXT PRIMARY KEY, title TEXT NOT NULL);
  CREATE TABLE enrollments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, course_id TEXT NOT NULL, UNIQUE(user_id, course_id));
  CREATE TABLE posts (id TEXT PRIMARY KEY, course_id TEXT NOT NULL, author_id TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, created_at INTEGER NOT NULL, removed_at INTEGER);
  CREATE TABLE saved_posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, post_id TEXT NOT NULL, saved_at INTEGER NOT NULL, deleted_at INTEGER, UNIQUE(user_id, post_id));
  `);
  return drizzle(sqlite, { schema });
}

export async function seedTestDb(db: ReturnType<typeof makeTestDb>) {
  await db.insert(schema.users).values([
    { id: 'student-1', name: 'Student One', role: 'student' },
    { id: 'student-2', name: 'Student Two', role: 'student' },
    { id: 'moderator-1', name: 'Mod', role: 'moderator' },
  ]);
  await db.insert(schema.courses).values([
    { id: 'course-1', title: 'Course One' },
    { id: 'course-2', title: 'Course Two' },
  ]);
  await db.insert(schema.enrollments).values([
    { id: 'e1', userId: 'student-1', courseId: 'course-1' },
    { id: 'e2', userId: 'student-2', courseId: 'course-2' },
  ]);
  await db.insert(schema.posts).values([
    { id: 'post-1', courseId: 'course-1', authorId: 'student-1', title: 'One', body: 'Body', createdAt: new Date(1000) },
    { id: 'post-2', courseId: 'course-2', authorId: 'student-2', title: 'Two', body: 'Body', createdAt: new Date(2000) },
  ]);
}
