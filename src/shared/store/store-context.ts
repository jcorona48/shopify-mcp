import type { AuthConfig } from "@/shared/config";
import type { TokenProvider } from "@/shared/auth/token-provider";
import { createTokenProvider } from "@/shared/auth/index";
import { UnavailableTokenProvider } from "@/shared/auth/unavailable-token-provider";
import { ShopifyGraphQLClient } from "@/shared/graphql-client";

/** Credentials for one Shopify store, supplied by the caller at connect time. */
export interface StoreCredentials {
  shopDomain: string;
  auth: AuthConfig;
}

/**
 * An initialized store session: enough to talk to the Admin API for one shop.
 * Never serialized to disk; lives only in process memory.
 */
export interface StoreContext {
  shopDomain: string;
  tokenProvider: TokenProvider;
}

export function createStoreContext(credentials: StoreCredentials): StoreContext {
  return {
    shopDomain: credentials.shopDomain,
    tokenProvider: createTokenProvider(
      credentials.auth,
      credentials.shopDomain,
    ),
  };
}

export function createUnavailableStore(reason: Error): StoreContext {
  return {
    shopDomain: "",
    tokenProvider: new UnavailableTokenProvider(reason),
  };
}

export function buildGraphQLClient(
  store: StoreContext,
  apiVersion: string,
): ShopifyGraphQLClient {
  return new ShopifyGraphQLClient(
    store.tokenProvider,
    `https://${store.shopDomain}/admin/api/${apiVersion}/graphql.json`,
  );
}
