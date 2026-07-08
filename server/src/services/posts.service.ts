import { and, desc, eq, isNull } from 'drizzle-orm';
import type { Db } from '../db/connection.js';
import { posts } from '../db/schema.js';
import type { CurrentUser } from '../auth/currentUser.js';
import { offsetFor, type Pagination } from '../validation/pagination.js';
import { assertCanReadCourse } from './authorization.service.js';
import { hydratePosts, type HydratedPost } from './savedPosts.service.js';
import { notFound } from '../errors.js';

export async function listCoursePosts(db: Db, user: CurrentUser, courseId: string, pagination: Pagination): Promise<HydratedPost[]> {
  await assertCanReadCourse(db, user, courseId);

  const rows = await db.query.posts.findMany({
    where: and(eq(posts.courseId, courseId), isNull(posts.removedAt)),
    orderBy: desc(posts.createdAt),
    limit: pagination.limit,
    offset: offsetFor(pagination),
  });

  return hydratePosts(db, user.id, rows);
}

export async function removePost(db: Db, user: CurrentUser, postId: string) {
  if (user.role !== 'moderator') throw notFound();

  const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
  if (!post || post.removedAt) throw notFound();

  await db.update(posts).set({ removedAt: new Date() }).where(eq(posts.id, postId));
  return { ...post, removedAt: new Date() };
}
