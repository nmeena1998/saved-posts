import type { Context } from 'hono';
import type { UserRole } from '../db/schema.js';

export type CurrentUser = {
  id: string;
  role: UserRole;
};

export function getCurrentUser(c: Context): CurrentUser | null {
  const userId = c.req.header('x-user-id');
  const role = c.req.header('x-user-role');

  if (!userId || (role !== 'student' && role !== 'moderator')) {
    return null;
  }

  return { id: userId, role };
}
