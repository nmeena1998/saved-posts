import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { makeTestDb, seedTestDb } from './testDb.js';
import { savePost, unsavePost } from '../src/services/savedPosts.service.js';
import { savedPosts } from '../src/db/schema.js';

const user = { id: 'student-1', role: 'student' as const };

describe('saved post business logic', () => {
  it('creates a save and treats duplicate save as idempotent', async () => {
    const db = makeTestDb();
    await seedTestDb(db);

    await savePost(db, user, 'post-1');
    await savePost(db, user, 'post-1');

    const rows = await db.select().from(savedPosts).where(eq(savedPosts.userId, user.id));
    expect(rows).toHaveLength(1);
    expect(rows[0].deletedAt).toBeNull();
  });

  it('un-save soft deletes and re-save reactivates the same record', async () => {
    const db = makeTestDb();
    await seedTestDb(db);

    await savePost(db, user, 'post-1');
    await unsavePost(db, user, 'post-1');
    const afterUnsave = await db.select().from(savedPosts).where(eq(savedPosts.userId, user.id));
    expect(afterUnsave).toHaveLength(1);
    expect(afterUnsave[0].deletedAt).toBeInstanceOf(Date);

    await savePost(db, user, 'post-1');
    const afterResave = await db.select().from(savedPosts).where(eq(savedPosts.userId, user.id));
    expect(afterResave).toHaveLength(1);
    expect(afterResave[0].id).toBe(afterUnsave[0].id);
    expect(afterResave[0].deletedAt).toBeNull();
  });
});
