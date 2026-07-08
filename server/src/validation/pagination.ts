import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type Pagination = z.infer<typeof paginationSchema>;
export const offsetFor = ({ page, limit }: Pagination) => (page - 1) * limit;
