import type { TokenProvider } from "@/shared/auth/token-provider";

export class UnavailableTokenProvider implements TokenProvider {
  constructor(private readonly reason: Error) {}

  async initialize(): Promise<void> {}

  getAccessToken(): string {
    throw this.reason;
  }

  destroy(): void {}
}
