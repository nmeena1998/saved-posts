import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_URL ?? './forum.sqlite';
const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');

sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student', 'moderator'))
);
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  course_id TEXT NOT NULL REFERENCES courses(id),
  UNIQUE(user_id, course_id)
);
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  removed_at INTEGER
);
CREATE TABLE IF NOT EXISTS saved_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  post_id TEXT NOT NULL REFERENCES posts(id),
  saved_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE(user_id, post_id)
);
CREATE INDEX IF NOT EXISTS posts_course_created_idx ON posts(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS saved_posts_user_saved_idx ON saved_posts(user_id, saved_at DESC);
CREATE INDEX IF NOT EXISTS saved_posts_post_active_idx ON saved_posts(post_id, deleted_at);
`);

console.log(`Migrated ${dbPath}`);
