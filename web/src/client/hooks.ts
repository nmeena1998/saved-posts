import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { queryKeys } from './queryKeys';

export function useFeed(courseId: string, page = 1) {
  return useQuery({ queryKey: queryKeys.feed(courseId, page), queryFn: () => api.listFeed(courseId, page) });
}

export function useSavedPosts(page = 1) {
  return useQuery({ queryKey: queryKeys.saved(page), queryFn: () => api.listSaved(page) });
}

export function useToggleSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, hasSaved }: { postId: string; hasSaved: boolean }) => hasSaved ? api.unsavePost(postId) : api.savePost(postId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
        queryClient.invalidateQueries({ queryKey: ['saved-posts'] }),
      ]);
    },
  });
}
