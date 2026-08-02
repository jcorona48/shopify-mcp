import { z } from "zod";

export const GetCustomersInputSchema = z.object({
  searchQuery: z
    .string()
    .optional()
    .describe("Search query, e.g. email:john@example.com or name"),
  limit: z.number().default(10),
});

export type GetCustomersInput = z.infer<typeof GetCustomersInputSchema>;
