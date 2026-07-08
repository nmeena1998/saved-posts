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

export type ApiListResponse<T> = {
  data: T[];
  pagination: { page: number; limit: number };
};
