import { and, eq } from 'drizzle-orm';
import type { Db } from '../db/connection.js';
import { enrollments, posts } from '../db/schema.js';
import type { CurrentUser } from '../auth/currentUser.js';
import { forbidden, notFound } from '../errors.js';

export async function assertCanReadCourse(db: Db, user: CurrentUser, courseId: string): Promise<void> {
  if (user.role === 'moderator') return;

  const enrollment = await db.query.enrollments.findFirst({
    where: and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)),
  });

  if (!enrollment) throw forbidden();
}

export async function assertCanReadPost(db: Db, user: CurrentUser, postId: string) {
  const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
  if (!post || post.removedAt) throw notFound();

  await assertCanReadCourse(db, user, post.courseId);
  return post;
}
