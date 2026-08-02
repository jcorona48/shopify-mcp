import { z } from "zod";

export const GetCustomerOrdersInputSchema = z.object({
  customerId: z
    .string()
    .regex(/^\d+$/, "Customer ID must be numeric")
    .describe("Shopify customer ID, numeric excluding gid prefix"),
  limit: z.number().default(10),
});

export type GetCustomerOrdersInput = z.infer<
  typeof GetCustomerOrdersInputSchema
>;
