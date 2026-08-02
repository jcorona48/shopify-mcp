import { z } from "zod";

export const DeleteProductInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe("Shopify product GID, e.g. gid://shopify/Product/123"),
});

export type DeleteProductInput = z.infer<typeof DeleteProductInputSchema>;
