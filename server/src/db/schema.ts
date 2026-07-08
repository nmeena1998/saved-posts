import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role', { enum: ['student', 'moderator'] }).notNull(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
});

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => courses.id),
}, table => ({
  enrollmentUnique: uniqueIndex('enrollment_user_course_unique').on(table.userId, table.courseId),
}));

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id),
  authorId: text('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  removedAt: integer('removed_at', { mode: 'timestamp_ms' }),
});

export const savedPosts = sqliteTable('saved_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull().references(() => posts.id),
  savedAt: integer('saved_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
}, table => ({
  saveUnique: uniqueIndex('saved_posts_user_post_unique').on(table.userId, table.postId),
}));

export type UserRole = 'student' | 'moderator';
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type SavedPost = typeof savedPosts.$inferSelect;
