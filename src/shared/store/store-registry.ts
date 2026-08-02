import { createStoreContext, type StoreContext } from "@/shared/store/store-context";

export const SESSION_TTL_MS = 30 * 60 * 1000;
export const SESSION_SWEEP_MS = 5 * 60 * 1000;

interface SessionEntry {
  store: StoreContext;
  lastSeen: number;
}

/**
 * In-memory store registry.
 *
 * Holds two kinds of state, both process-local (never persisted):
 *
 * - A cache of client-credentials token providers keyed by (shop, clientId).
 *   Reusing them across requests avoids a token exchange on every call.
 * - Store sessions registered via the `connect-shop` tool, keyed by MCP
 *   session id, so a client can bind a store to its connection.
 */
export class StoreRegistry {
  private readonly clientCredentials = new Map<string, StoreContext>();
  private readonly sessions = new Map<string, SessionEntry>();

  getSession(sessionId: string): StoreContext | undefined {
    const entry = this.sessions.get(sessionId);
    if (!entry) return undefined;
    entry.lastSeen = Date.now();
    return entry.store;
  }

  setSession(sessionId: string, store: StoreContext): void {
    this.sessions.set(sessionId, { store, lastSeen: Date.now() });
  }

  deleteSession(sessionId: string): void {
    const entry = this.sessions.get(sessionId);
    if (entry) this.sessions.delete(sessionId);
  }

  /** Reuse (or create) a client-credentials store context for an app. */
  clientCredentialsStore(credentials: {
    shopDomain: string;
    clientId: string;
    clientSecret: string;
  }): StoreContext {
    const key = `cc:${credentials.shopDomain}:${credentials.clientId}`;
    const cached = this.clientCredentials.get(key);
    if (cached) return cached;

    const store = createStoreContext({
      shopDomain: credentials.shopDomain,
      auth: {
        kind: "client-credentials",
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
      },
    });
    this.clientCredentials.set(key, store);
    return store;
  }

  /** Drop expired sessions and stop their refresh timers. */
  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, entry] of this.sessions) {
      if (now - entry.lastSeen > SESSION_TTL_MS) {
        entry.store.tokenProvider.destroy();
        this.sessions.delete(sessionId);
      }
    }
  }
}
