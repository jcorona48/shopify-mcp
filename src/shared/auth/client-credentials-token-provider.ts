/**
 * Shopify OAuth Client Credentials flow.
 *
 * As of January 1 2026 Shopify no longer exposes static Admin API access
 * tokens in the UI. New apps created in the Dev Dashboard receive a
 * client_id + client_secret pair which must be exchanged for a short-lived
 * access token (expires_in ≈ 86 400 s / 24 h).
 *
 * This provider handles the token exchange and transparent refresh so the
 * rest of the codebase can keep using a plain access-token string. Consumers
 * read the current token via {@link getAccessToken} on every request, so the
 * header never goes stale after a refresh.
 */

import type { TokenProvider } from "@/shared/auth/token-provider";

export interface ClientCredentialsConfig {
  clientId: string;
  clientSecret: string;
  shopDomain: string; // e.g. "my-store.myshopify.com"
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
}

// Refresh 5 minutes before actual expiry to avoid race conditions.
const REFRESH_MARGIN_MS = 5 * 60 * 1000;
// Backoff when a refresh attempt fails.
const RETRY_DELAY_MS = 60_000;

export class ClientCredentialsTokenProvider implements TokenProvider {
  private accessToken: string | null = null;
  private expiresAt = 0;
  private lastError: Error | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly config: ClientCredentialsConfig) {}

  /** Fetch an initial token. Must be called before the server starts. */
  async initialize(): Promise<void> {
    if (this.accessToken) return;
    try {
      await this.fetchToken();
      this.scheduleRefresh();
    } catch (error) {
      this.lastError =
        error instanceof Error ? error : new Error(String(error));
      throw this.lastError;
    }
  }

  /** Return the current (valid) access token. */
  getAccessToken(): string {
    if (this.accessToken) {
      return this.accessToken;
    }
    if (this.lastError) {
      throw this.lastError;
    }
    throw new Error(
      "ClientCredentialsTokenProvider not initialized — call initialize() first",
    );
  }

  /** Stop the background refresh timer (for clean shutdown). */
  destroy(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async fetchToken(): Promise<void> {
    const url = `https://${this.config.shopDomain}/admin/oauth/access_token`;

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Shopify token exchange failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as TokenResponse;
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;
    this.lastError = null;
  }

  private scheduleRefresh(): void {
    const msUntilRefresh = this.expiresAt - Date.now() - REFRESH_MARGIN_MS;
    const delay = Math.max(msUntilRefresh, 0);

    this.refreshTimer = setTimeout(async () => {
      try {
        await this.fetchToken();
        this.scheduleRefresh();
      } catch (err) {
        console.error("Failed to refresh Shopify access token:", err);
        // Retry later rather than dying.
        this.refreshTimer = setTimeout(
          () => this.scheduleRefresh(),
          RETRY_DELAY_MS,
        );
      }
    }, delay);

    // Allow the Node process to exit even if the timer is pending.
    if (
      this.refreshTimer &&
      typeof this.refreshTimer === "object" &&
      "unref" in this.refreshTimer
    ) {
      this.refreshTimer.unref();
    }
  }
}
