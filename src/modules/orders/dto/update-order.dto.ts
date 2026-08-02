import { z } from "zod";

export const UpdateOrderInputSchema = z.object({
  id: z.string().min(1),
  tags: z.array(z.string()).optional(),
  email: z.string().email().optional(),
  note: z.string().optional(),
  customAttributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
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
  shippingAddress: z
    .object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      company: z.string().optional(),
      country: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      province: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderInputSchema>;
