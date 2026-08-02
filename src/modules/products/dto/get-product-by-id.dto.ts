import { z } from "zod";

export const GetProductByIdInputSchema = z.object({
  productId: z.string().min(1),
});

export type GetProductByIdInput = z.infer<typeof GetProductByIdInputSchema>;
