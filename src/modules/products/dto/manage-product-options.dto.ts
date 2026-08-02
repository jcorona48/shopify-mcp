import { z } from "zod";

export const ManageProductOptionsInputSchema = z.object({
  productId: z.string().min(1).describe("Shopify product GID"),
  action: z.enum(["create", "update", "delete"]),
  options: z
    .array(
      z.object({
        name: z.string().describe("Option name, e.g. 'Size' or 'Color'"),
        position: z
          .number()
          .optional()
          .describe("Position of the option (1-based)"),
        values: z
          .array(z.string())
          .optional()
          .describe("Option values, e.g. ['Small', 'Medium', 'Large']"),
      }),
    )
    .optional()
    .describe("Options to create (action=create)"),
  optionId: z
    .string()
    .optional()
    .describe("Option GID to update (action=update)"),
  name: z.string().optional().describe("New name for the option (action=update)"),
  position: z.number().optional().describe("New position (action=update)"),
  valuesToAdd: z
    .array(z.string())
    .optional()
    .describe("Values to add (action=update)"),
  valuesToDelete: z
    .array(z.string())
    .optional()
    .describe("Value GIDs to delete (action=update)"),
  optionIds: z
    .array(z.string())
    .optional()
    .describe("Option GIDs to delete (action=delete)"),
});

export type ManageProductOptionsInput = z.infer<
  typeof ManageProductOptionsInputSchema
>;
