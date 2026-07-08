import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Db } from './db/connection.js';
import { db as defaultDb } from './db/connection.js';
import { getCurrentUser } from './auth/currentUser.js';
import { HttpError, unauthorized } from './errors.js';
import { paginationSchema } from './validation/pagination.js';
import { listCoursePosts, removePost } from './services/posts.service.js';
import { listSavedPosts, savePost, unsavePost } from './services/savedPosts.service.js';

export function createApp(db: Db = defaultDb) {
  const app = new Hono();

  app.use('*', cors({ origin: ['http://localhost:5173'], allowHeaders: ['x-user-id', 'x-user-role', 'content-type'], allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));

  app.onError((error, c) => {
    if (error instanceof HttpError) {
      return c.json({ error: error.message }, error.status);
    }
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  });

  app.get('/health', c => c.json({ ok: true }));

  app.get('/courses/:courseId/posts', async c => {
    const user = getCurrentUser(c);
    if (!user) throw unauthorized();

    const pagination = paginationSchema.parse(c.req.query());
    const data = await listCoursePosts(db, user, c.req.param('courseId'), pagination);
    return c.json({ data, pagination });
  });

  app.post('/posts/:postId/save', async c => {
    const user = getCurrentUser(c);
    if (!user) throw unauthorized();

    await savePost(db, user, c.req.param('postId'));
    return c.json({ ok: true });
  });

  app.delete('/posts/:postId/save', async c => {
    const user = getCurrentUser(c);
    if (!user) throw unauthorized();

    await unsavePost(db, user, c.req.param('postId'));
    return c.json({ ok: true });
  });

  app.get('/me/saved-posts', async c => {
    const user = getCurrentUser(c);
    if (!user) throw unauthorized();

    const pagination = paginationSchema.parse(c.req.query());
    const data = await listSavedPosts(db, user, pagination);
    return c.json({ data, pagination });
  });

  app.delete('/moderation/posts/:postId', async c => {
    const user = getCurrentUser(c);
    if (!user) throw unauthorized();

    await removePost(db, user, c.req.param('postId'));
    return c.json({ ok: true });
  });

  return app;
}
