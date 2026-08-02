import { z } from "zod";

/** Credentials for the shop to bind to the current MCP session. */
export const ConnectShopInputSchema = z.object({
  shopDomain: z
    .string()
    .min(1)
    .describe("Shop domain, e.g. my-store.myshopify.com"),
  accessToken: z
    .string()
    .min(1)
    .optional()
    .describe("Admin API access token (legacy custom apps)"),
  clientId: z
    .string()
    .min(1)
    .optional()
    .describe("OAuth client id (Dev Dashboard apps)"),
  clientSecret: z
    .string()
    .min(1)
    .optional()
    .describe("OAuth client secret (Dev Dashboard apps)"),
  verify: z
    .boolean()
    .default(true)
    .describe("Test the credentials against Shopify before saving"),
});

export type ConnectShopInput = z.infer<typeof ConnectShopInputSchema>;
