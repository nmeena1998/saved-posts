import { and, count, desc, eq, inArray, isNull } from 'drizzle-orm';
import type { Db } from '../db/connection.js';
import { posts, savedPosts } from '../db/schema.js';
import type { CurrentUser } from '../auth/currentUser.js';
import { offsetFor, type Pagination } from '../validation/pagination.js';
import { assertCanReadPost } from './authorization.service.js';

export type HydratedPost = {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  hasSaved: boolean;
  savesCount: number;
};

function toHydrated(post: typeof posts.$inferSelect, counts: Map<string, number>, ownSaved: Set<string>): HydratedPost {
  return {
    id: post.id,
    courseId: post.courseId,
    authorId: post.authorId,
    title: post.title,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    hasSaved: ownSaved.has(post.id),
    savesCount: counts.get(post.id) ?? 0,
  };
}

export async function hydratePosts(db: Db, userId: string, rows: Array<typeof posts.$inferSelect>): Promise<HydratedPost[]> {
  if (rows.length === 0) return [];
  const postIds = rows.map(p => p.id);

  const countRows = await db
    .select({ postId: savedPosts.postId, value: count(savedPosts.id) })
    .from(savedPosts)
    .where(and(inArray(savedPosts.postId, postIds), isNull(savedPosts.deletedAt)))
    .groupBy(savedPosts.postId);

  const ownRows = await db
    .select({ postId: savedPosts.postId })
    .from(savedPosts)
    .where(and(inArray(savedPosts.postId, postIds), eq(savedPosts.userId, userId), isNull(savedPosts.deletedAt)));

  const counts = new Map(countRows.map(row => [row.postId, Number(row.value)]));
  const ownSaved = new Set(ownRows.map(row => row.postId));

  return rows.map(row => toHydrated(row, counts, ownSaved));
}

export async function savePost(db: Db, user: CurrentUser, postId: string) {
  await assertCanReadPost(db, user, postId);

  const existing = await db.query.savedPosts.findFirst({
    where: and(eq(savedPosts.userId, user.id), eq(savedPosts.postId, postId)),
  });

  const now = new Date();

  if (!existing) {
    const row = { id: crypto.randomUUID(), userId: user.id, postId, savedAt: now, deletedAt: null };
    await db.insert(savedPosts).values(row);
    return row;
  }

  if (existing.deletedAt === null) return existing;

  await db
    .update(savedPosts)
    .set({ savedAt: now, deletedAt: null })
    .where(and(eq(savedPosts.userId, user.id), eq(savedPosts.postId, postId)));

  return { ...existing, savedAt: now, deletedAt: null };
}

export async function unsavePost(db: Db, user: CurrentUser, postId: string) {
  await assertCanReadPost(db, user, postId);

  const existing = await db.query.savedPosts.findFirst({
    where: and(eq(savedPosts.userId, user.id), eq(savedPosts.postId, postId)),
  });

  if (!existing || existing.deletedAt !== null) return null;

  const now = new Date();
  await db
    .update(savedPosts)
    .set({ deletedAt: now })
    .where(and(eq(savedPosts.userId, user.id), eq(savedPosts.postId, postId)));

  return { ...existing, deletedAt: now };
}

export async function listSavedPosts(db: Db, user: CurrentUser, pagination: Pagination): Promise<HydratedPost[]> {
  const rows = await db
    .select({ post: posts })
    .from(savedPosts)
    .innerJoin(posts, eq(savedPosts.postId, posts.id))
    .where(and(eq(savedPosts.userId, user.id), isNull(savedPosts.deletedAt), isNull(posts.removedAt)))
    .orderBy(desc(savedPosts.savedAt))
    .limit(pagination.limit)
    .offset(offsetFor(pagination));

  return hydratePosts(db, user.id, rows.map(row => row.post));
}
