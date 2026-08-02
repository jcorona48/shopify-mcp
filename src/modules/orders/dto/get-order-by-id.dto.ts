import { z } from "zod";

export const GetOrderByIdInputSchema = z.object({
  orderId: z.string().min(1),
});

export type GetOrderByIdInput = z.infer<typeof GetOrderByIdInputSchema>;
