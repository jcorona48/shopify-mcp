import type { TokenProvider } from "@/shared/auth/token-provider";

/** Supplies a fixed, pre-provisioned access token (legacy apps). */
export class StaticTokenProvider implements TokenProvider {
  constructor(private readonly accessToken: string) {}

  async initialize(): Promise<void> {}

  getAccessToken(): string {
    return this.accessToken;
  }

  destroy(): void {}
}
