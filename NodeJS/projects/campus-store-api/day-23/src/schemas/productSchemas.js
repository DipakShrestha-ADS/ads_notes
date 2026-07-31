import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().trim().min(2, 'Title must contain at least 2 characters'),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2).optional(),
  userId: z.number().int().positive().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();
