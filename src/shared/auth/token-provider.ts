/**
 * Strategy interface for supplying a Shopify Admin access token.
 *
 * Two implementations exist: a static legacy token and OAuth client
 * credentials with transparent refresh. Clients depend only on this interface
 * (DIP) so the token source can be swapped without touching callers.
 */

export interface TokenProvider {
  /** Fetch a first token. Must be called before serving requests. */
  initialize(): Promise<void>;
  /** Return the current, valid access token. */
  getAccessToken(): string;
  /** Stop background work (e.g. the refresh timer). */
  destroy(): void;
}
