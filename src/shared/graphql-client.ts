/**
 * Typed GraphQL client for the Shopify Admin API.
 *
 * Reads the access token from a {@link TokenProvider} on every request, so a
 * background refresh never leaves the client with a stale header — no need to
 * hot-swap headers after refresh.
 */

import { GraphQLClient } from "graphql-request";
import { assertNoUserErrors } from "@/shared/errors";
import type { UserError } from "@/shared/errors";
import type { TokenProvider } from "@/shared/auth/token-provider";

export class ShopifyGraphQLClient {
  private readonly client: GraphQLClient;

  constructor(
    private readonly tokenProvider: TokenProvider,
    endpoint: string,
  ) {
    this.client = new GraphQLClient(endpoint, {
      headers: { "Content-Type": "application/json" },
    });
  }

  async request<T>(
    document: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    return this.client.request<T>(document, variables, {
      "X-Shopify-Access-Token": this.tokenProvider.getAccessToken(),
    });
  }

  async requestMutation<T>(
    document: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const data = await this.request<T>(document, variables);
    assertNoUserErrors(actionFromData(data), extractUserErrors(data));
    return data;
  }
}

function extractUserErrors(data: unknown): UserError[] {
  if (typeof data !== "object" || data === null) return [];

  for (const value of Object.values(data)) {
    if (typeof value === "object" && value !== null && "userErrors" in value) {
      return (value as { userErrors?: UserError[] }).userErrors ?? [];
    }
  }
  return [];
}

function actionFromData(data: unknown): string {
  if (typeof data !== "object" || data === null) return "mutation";

  const key = Object.keys(data)[0] ?? "";
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
}
