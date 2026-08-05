/**
 * Composition root.
 *
 * Wires the store registry/resolver, the per-store tool set and the MCP HTTP
 * handler, returning a ready {@link HttpServer}. Keeping this out of
 * `src/index.ts` leaves the entry point trivial and this file testable in
 * isolation.
 */

import { createMcpHandler } from "@modelcontextprotocol/server";
import type { ServerConfig } from "@/shared/config";
import { createMcpServer } from "@/shared/mcp/mcp-server-factory";
import { withErrorMapping } from "@/shared/mcp/error-mapper";
import { HttpServer } from "@/shared/http/http-server";
import {
  StoreRegistry,
  SESSION_SWEEP_MS,
} from "@/shared/store/store-registry";
import { StoreResolver } from "@/shared/store/store-resolver";
import {
  buildGraphQLClient,
  createUnavailableStore,
  type StoreContext,
} from "@/shared/store/store-context";
import { toShopifyError } from "@/shared/errors";
import type { Tool } from "@/shared/tool";
import {
  ProductGraphQLRepository,
  ProductService,
  createProductTools,
} from "@/modules/products/products.module";
import {
  CustomerGraphQLRepository,
  CustomerService,
  createCustomerTools,
} from "@/modules/customers/customers.module";
import {
  OrderGraphQLRepository,
  OrderService,
  createOrderTools,
} from "@/modules/orders/orders.module";
import {
  CollectionGraphQLRepository,
  CollectionService,
  createCollectionTools,
} from "@/modules/collections/collections.module";
import { createStoreTools } from "@/modules/stores/stores.module";

const SERVER_INFO = {
  name: "shopify",
  version: "1.0.0",
  description:
    "MCP Server for Shopify API, enabling interaction with store data through GraphQL API",
};

export function createApp(
  config: ServerConfig,
  options: { host?: string } = {},
): HttpServer {
  const registry = new StoreRegistry();
  const resolver = new StoreResolver(config, registry);

  if (config.shopDomain) {
    void resolver.initializeDefault().catch((error: unknown) => {
      const detail = (error as Error).message.replace(/\s+/g, " ").slice(0, 120);
      console.warn(
        `Default store ${config.shopDomain} is not reachable at startup: ${detail}. ` +
          "Requests without explicit credentials will keep failing; use connect-shop or HTTP headers instead.",
      );
    });
  }

  const mcpHandler = createMcpHandler(async (ctx) => {
    const sessionId = ctx.requestInfo?.headers.get("mcp-session-id") ?? null;
    let store: StoreContext;
    try {
      store = await resolver.resolve(ctx.requestInfo?.headers, sessionId);
    } catch (error) {
      store = createUnavailableStore(toShopifyError(error));
    }
    const tools = buildStoreTools(resolver, store, sessionId, config.apiVersion);
    return createMcpServer(SERVER_INFO, withErrorMapping(tools));
  });

  setInterval(() => registry.cleanup(), SESSION_SWEEP_MS).unref();

  return new HttpServer(config, mcpHandler, SERVER_INFO.version, options);
}

function buildStoreTools(
  resolver: StoreResolver,
  store: StoreContext,
  sessionId: string | null,
  apiVersion: string,
): Tool[] {
  const client = buildGraphQLClient(store, apiVersion);
  return [
    ...createProductTools(new ProductService(new ProductGraphQLRepository(client))),
    ...createCustomerTools(new CustomerService(new CustomerGraphQLRepository(client))),
    ...createOrderTools(new OrderService(new OrderGraphQLRepository(client))),
    ...createCollectionTools(new CollectionService(new CollectionGraphQLRepository(client))),
    ...createStoreTools(resolver, sessionId),
  ];
}
