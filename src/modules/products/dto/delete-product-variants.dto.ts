import { z } from "zod";

export const DeleteProductVariantsInputSchema = z.object({
  productId: z.string().min(1).describe("Shopify product GID"),
  variantIds: z
    .array(z.string().min(1))
    .min(1)
    .describe("Array of variant GIDs to delete"),
});

export type DeleteProductVariantsInput = z.infer<
  typeof DeleteProductVariantsInputSchema
>;
