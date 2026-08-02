import { z } from "zod";

export const GetProductsInputSchema = z.object({
  searchTitle: z.string().optional(),
  limit: z.number().default(10),
});

export type GetProductsInput = z.infer<typeof GetProductsInputSchema>;
