/**
 * Factory for {@link TokenProvider} implementations.
 *
 * Given the resolved {@link AuthConfig} it builds the matching strategy so the
 * composition root never branches on auth kind by hand.
 */

import type { AuthConfig } from "@/shared/config";
import { ClientCredentialsTokenProvider } from "@/shared/auth/client-credentials-token-provider";
import { StaticTokenProvider } from "@/shared/auth/static-token-provider";
import type { TokenProvider } from "@/shared/auth/token-provider";

export function createTokenProvider(
  config: AuthConfig,
  shopDomain: string,
): TokenProvider {
  if (config.kind === "client-credentials") {
    return new ClientCredentialsTokenProvider({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      shopDomain,
    });
  }
  return new StaticTokenProvider(config.accessToken);
}
