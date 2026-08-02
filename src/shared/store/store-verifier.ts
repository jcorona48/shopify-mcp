import { ShopifyStoreError } from "@/shared/errors";
import { buildGraphQLClient, type StoreContext } from "@/shared/store/store-context";

/** Prove a store context can talk to Shopify by fetching the shop's name. */
export async function verifyStore(
  store: StoreContext,
  apiVersion: string,
): Promise<{ shopName: string }> {
  const client = buildGraphQLClient(store, apiVersion);
  try {
    const data = await client.request<{ shop: { name: string } }>(
      "query { shop { name } }",
    );
    return { shopName: data.shop.name };
  } catch (error) {
    throw new ShopifyStoreError(
      `Could not connect to ${store.shopDomain}: ${(error as Error).message}`,
    );
  }
}
