import type { ApiListResponse, HydratedPost } from './types';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const authHeaders = {
  'x-user-id': 'student-1',
  'x-user-role': 'student',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...authHeaders, ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  listFeed: (courseId: string, page = 1) => request<ApiListResponse<HydratedPost>>(`/courses/${courseId}/posts?page=${page}&limit=10`),
  listSaved: (page = 1) => request<ApiListResponse<HydratedPost>>(`/me/saved-posts?page=${page}&limit=10`),
  savePost: (postId: string) => request<{ ok: true }>(`/posts/${postId}/save`, { method: 'POST' }),
  unsavePost: (postId: string) => request<{ ok: true }>(`/posts/${postId}/save`, { method: 'DELETE' }),
};
