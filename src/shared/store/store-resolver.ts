import type { ServerConfig } from "@/shared/config";
import { ShopifyStoreError } from "@/shared/errors";
import { createStoreContext, type StoreContext, type StoreCredentials } from "@/shared/store/store-context";
import { StoreRegistry } from "@/shared/store/store-registry";
import { verifyStore } from "@/shared/store/store-verifier";

export const SHOP_DOMAIN_HEADER = "x-shopify-domain";
export const ACCESS_TOKEN_HEADER = "x-shopify-access-token";
export const CLIENT_ID_HEADER = "x-shopify-client-id";
export const CLIENT_SECRET_HEADER = "x-shopify-client-secret";

export interface ConnectResult {
  store: StoreContext;
  shopName: string;
}

/**
 * Decides which Shopify store a request should talk to.
 *
 * Priority:
 * 1. Per-request HTTP headers on POST /mcp (multi-store from the caller).
 * 2. A store bound to the current MCP session via the `connect-shop` tool.
 * 3. The default store from the server configuration (.env / CLI args).
 *
 * Credentials never leave process memory and are never returned to callers.
 */
export class StoreResolver {
  private readonly defaultStore?: StoreContext;

  constructor(
    private readonly config: ServerConfig,
    private readonly registry: StoreRegistry,
  ) {
    if (config.shopDomain && config.auth) {
      this.defaultStore = createStoreContext({
        shopDomain: config.shopDomain,
        auth: config.auth,
      });
    }
  }

  async initializeDefault(): Promise<void> {
    if (!this.defaultStore) return;
    await this.defaultStore.tokenProvider.initialize();
  }

  getDefaultStore(): StoreContext | undefined {
    return this.defaultStore;
  }

  async resolve(
    headers?: Headers,
    sessionId: string | null = null,
  ): Promise<StoreContext> {
    let store: StoreContext;

    const fromHeaders = this.storeFromHeaders(headers);
    if (fromHeaders) {
      store = fromHeaders;
    } else if (sessionId && this.registry.getSession(sessionId)) {
      store = this.registry.getSession(sessionId)!;
    } else if (this.defaultStore) {
      store = this.defaultStore;
    } else {
      throw new ShopifyStoreError(
        "No store credentials provided for this request. Send x-shopify-domain + x-shopify-access-token " +
          "(or x-shopify-client-id + x-shopify-client-secret) headers, or configure a default store via MYSHOPIFY_DOMAIN.",
      );
    }

    try {
      await store.tokenProvider.initialize();
    } catch (error) {
      console.warn(
        `Store ${store.shopDomain} is not reachable (${(error as Error).message.slice(0, 120)}). ` +
          "Requests will keep failing until credentials are valid; use connect-shop or HTTP headers.",
      );
    }
    return store;
  }

  /**
   * Register a caller-supplied store for a session. When `verify` is true the
   * credentials are tested against Shopify before the session is accepted.
   */
  async connect(
    sessionId: string,
    credentials: StoreCredentials,
    verify: boolean,
  ): Promise<ConnectResult> {
    const domain = normalizeShopDomain(credentials.shopDomain);

    let store: StoreContext;
    if (credentials.auth.kind === "client-credentials") {
      store = this.registry.clientCredentialsStore({
        shopDomain: domain,
        clientId: credentials.auth.clientId,
        clientSecret: credentials.auth.clientSecret,
      });
    } else {
      store = createStoreContext({
        shopDomain: domain,
        auth: credentials.auth,
      });
    }

    await store.tokenProvider.initialize().catch((error: unknown) => {
      console.warn(
        `connect-shop: store ${store.shopDomain} token exchange failed (${(error as Error).message.slice(0, 120)}).`,
      );
    });

    let shopName: string | undefined;
    if (verify) {
      ({ shopName } = await verifyStore(store, this.config.apiVersion));
    }

    this.registry.setSession(sessionId, store);
    return { store, shopName: shopName ?? domain };
  }

  private storeFromHeaders(headers?: Headers): StoreContext | undefined {
    if (!headers) return undefined;

    const shopDomain = headers.get(SHOP_DOMAIN_HEADER);
    if (!shopDomain) return undefined;

    const domain = normalizeShopDomain(shopDomain);
    const accessToken = headers.get(ACCESS_TOKEN_HEADER) || undefined;
    const clientId = headers.get(CLIENT_ID_HEADER) || undefined;
    const clientSecret = headers.get(CLIENT_SECRET_HEADER) || undefined;

    if (clientId && clientSecret) {
      return this.registry.clientCredentialsStore({
        shopDomain: domain,
        clientId,
        clientSecret,
      });
    }
    if (accessToken) {
      return createStoreContext({
        shopDomain: domain,
        auth: { kind: "static", accessToken },
      });
    }
    throw new ShopifyStoreError(
      `No credentials for ${domain}: send ${ACCESS_TOKEN_HEADER} or ${CLIENT_ID_HEADER} + ${CLIENT_SECRET_HEADER}.`,
    );
  }
}

export function normalizeShopDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  const withoutScheme = trimmed.replace(/^https?:\/\//, "");
  if (
    !withoutScheme ||
    withoutScheme.includes("/") ||
    withoutScheme.includes(" ") ||
    !withoutScheme.includes(".") ||
    withoutScheme.includes(":")
  ) {
    throw new ShopifyStoreError(
      `Invalid Shopify domain "${value}". Use e.g. my-store.myshopify.com`,
    );
  }
  return withoutScheme;
}
