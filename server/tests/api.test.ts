import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { makeTestDb, seedTestDb } from './testDb.js';

describe('forum API', () => {
  it('returns 401 without auth headers', async () => {
    const db = makeTestDb();
    await seedTestDb(db);
    const app = createApp(db);

    const res = await app.request('/courses/course-1/posts');
    expect(res.status).toBe(401);
  });

  it('returns 403 when student reads a non-enrolled course', async () => {
    const db = makeTestDb();
    await seedTestDb(db);
    const app = createApp(db);

    const res = await app.request('/courses/course-2/posts', {
      headers: { 'x-user-id': 'student-1', 'x-user-role': 'student' },
    });
    expect(res.status).toBe(403);
  });

  it('supports happy path: save, hydrated feed flag, saved list', async () => {
    const db = makeTestDb();
    await seedTestDb(db);
    const app = createApp(db);
    const headers = { 'x-user-id': 'student-1', 'x-user-role': 'student' };

    const save = await app.request('/posts/post-1/save', { method: 'POST', headers });
    expect(save.status).toBe(200);

    const feed = await app.request('/courses/course-1/posts', { headers });
    const feedJson = await feed.json() as { data: Array<{ id: string; hasSaved: boolean; savesCount: number }> };
    expect(feedJson.data.find(p => p.id === 'post-1')?.hasSaved).toBe(true);
    expect(feedJson.data.find(p => p.id === 'post-1')?.savesCount).toBe(1);

    const saved = await app.request('/me/saved-posts', { headers });
    const savedJson = await saved.json() as { data: Array<{ id: string }> };
    expect(savedJson.data.map(p => p.id)).toEqual(['post-1']);
  });
});
