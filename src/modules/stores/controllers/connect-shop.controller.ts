import { ShopifyStoreError } from "@/shared/errors";
import type { StoreResolver } from "@/shared/store/store-resolver";
import type { Tool } from "@/shared/tool";
import { ConnectShopInputSchema, type ConnectShopInput } from "@/modules/stores/dto/connect-shop.dto";

export class ConnectShopController implements Tool {
  readonly name = "connect-shop";
  readonly description =
    "Bind the current MCP session to a Shopify store using your own " +
    "credentials (access token, or client id + secret). On success the rest " +
    "of the tools in this session operate on that store. Credentials are kept " +
    "only in memory and never returned. Tip: you can skip this tool and send " +
    "the same credentials as HTTP headers on every POST /mcp request.";
  readonly inputSchema = ConnectShopInputSchema;

  constructor(
    private readonly resolver: StoreResolver,
    private readonly sessionId: string | null,
  ) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    if (!this.sessionId) {
      throw new ShopifyStoreError(
        "This MCP client did not send an mcp-session-id header, so there is " +
          "no session to bind a store to. Use the HTTP headers instead: " +
          "x-shopify-domain + x-shopify-access-token (or client id/secret).",
      );
    }

    const parsed = ConnectShopInputSchema.parse(input) as ConnectShopInput;
    const { shopDomain, accessToken, clientId, clientSecret, verify } = parsed;

    const hasToken = accessToken !== undefined;
    const hasClientCredentials = Boolean(clientId && clientSecret);
    if (hasToken === hasClientCredentials) {
      throw new ShopifyStoreError(
        "Provide exactly one auth mode: accessToken, or clientId + clientSecret.",
      );
    }

    const auth = hasToken
      ? { kind: "static" as const, accessToken: accessToken! }
      : {
          kind: "client-credentials" as const,
          clientId: clientId!,
          clientSecret: clientSecret!,
        };

    const { store, shopName } = await this.resolver.connect(
      this.sessionId,
      { shopDomain, auth },
      verify,
    );

    return {
      ok: true,
      shop: { domain: store.shopDomain, name: shopName },
      authMode: auth.kind,
    };
  }
}
