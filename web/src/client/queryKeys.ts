export const queryKeys = {
  feed: (courseId: string, page: number) => ['feed', courseId, page] as const,
  saved: (page: number) => ['saved-posts', page] as const,
};
