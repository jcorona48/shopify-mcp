import { z } from "zod";

export const GetOrdersInputSchema = z.object({
  status: z
    .enum(["any", "open", "closed", "cancelled"])
    .default("any")
    .describe("Filter orders by status"),
  limit: z.number().default(10),
});

export type GetOrdersInput = z.infer<typeof GetOrdersInputSchema>;
