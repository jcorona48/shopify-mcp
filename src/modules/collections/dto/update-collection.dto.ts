import { z } from "zod";

export const UpdateCollectionInputSchema = z.object({
  collectionId: z.string().min(1),
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(2).max(1000).optional(),
  descriptionHtml: z.string().min(2).max(1000).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export type UpdateCollectionInput = z.infer<typeof UpdateCollectionInputSchema>;
