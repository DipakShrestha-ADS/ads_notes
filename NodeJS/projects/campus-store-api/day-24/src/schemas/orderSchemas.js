import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
});
