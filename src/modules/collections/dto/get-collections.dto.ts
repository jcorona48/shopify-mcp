import { z } from "zod";

export const GetCollectionsInputSchema = z.object({
  searchTitle: z.string().optional(),
  limit: z.number().default(10),
});

export type GetCollectionsInput = z.infer<typeof GetCollectionsInputSchema>;
