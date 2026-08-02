import { z } from "zod";

export const UpdateCustomerInputSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Customer ID must be numeric")
    .describe("Shopify customer ID, numeric excluding gid prefix"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
  taxExempt: z.boolean().optional(),
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
});

export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
