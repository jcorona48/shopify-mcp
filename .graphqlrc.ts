import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";

export default {
  schema:
    "https://shopify.dev/admin-graphql-direct-proxy/2026-01",
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: "2026-01",
      documents: ["./src/**/*.{ts,tsx}"],
      outputDir: "./src/shared/generated",
      declarations: true,
    }),
  },
};
