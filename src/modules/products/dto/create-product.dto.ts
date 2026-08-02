import { z } from "zod";

export const CreateProductInputSchema = z.object({
  title: z.string().min(1),
  descriptionHtml: z.string().optional(),
  handle: z
    .string()
    .optional()
    .describe(
      "URL slug, e.g. 'black-sunglasses'. Auto-generated from title if omitted.",
    ),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("DRAFT"),
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
        namespace: z.string(),
        key: z.string(),
        value: z.string(),
        type: z
          .string()
          .describe(
            "Metafield type, e.g. 'single_line_text_field', 'json', 'number_integer'",
          ),
      }),
    )
    .optional(),
  productOptions: z
    .array(
      z.object({
        name: z.string().describe("Option name, e.g. 'Size' or 'Color'"),
        values: z
          .array(z.object({ name: z.string() }))
          .optional()
          .describe("Option values"),
      }),
    )
    .optional()
    .describe("Product options to create inline (max 3)"),
  collectionsToJoin: z
    .array(z.string())
    .optional()
    .describe("Collection GIDs to add the product to"),
});

export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;
