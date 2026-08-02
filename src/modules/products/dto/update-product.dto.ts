import { z } from "zod";

export const UpdateProductInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe("Shopify product GID, e.g. gid://shopify/Product/123"),
  title: z.string().optional(),
  descriptionHtml: z.string().optional(),
  handle: z.string().optional().describe("URL slug for the product"),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional()
    .describe("SEO title and description for search engines"),
  metafields: z
    .array(
      z.object({
        id: z.string().optional(),
        namespace: z.string().optional(),
        key: z.string().optional(),
        value: z.string(),
        type: z.string().optional(),
      }),
    )
    .optional(),
  collectionsToJoin: z
    .array(z.string())
    .optional()
    .describe("Collection GIDs to add the product to"),
  collectionsToLeave: z
    .array(z.string())
    .optional()
    .describe("Collection GIDs to remove the product from"),
  redirectNewHandle: z
    .boolean()
    .optional()
    .describe("If true, old handle redirects to new handle"),
});

export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;
