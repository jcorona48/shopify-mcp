/**
 * Configuration value object.
 *
 * Reads the server's settings from environment variables and CLI arguments,
 * validates them, and exposes an immutable {@link ServerConfig}. This module
 * has a single responsibility: translate raw input into a typed config. It
 * performs no I/O and never touches the rest of the system, so it can be
 * unit-tested in isolation.
 */

export type AuthConfig =
  | { kind: "static"; accessToken: string }
  | { kind: "client-credentials"; clientId: string; clientSecret: string };

export interface HttpConfig {
  port: number;
}

export interface ServerConfig {
  readonly shopDomain?: string;
  readonly apiVersion: string;
  readonly auth?: AuthConfig;
  readonly http: HttpConfig;
}

/** Raw, unvalidated inputs coming from the CLI (`--key=value` style). */
export interface CliArgs {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  domain?: string;
  port?: string;
  apiVersion?: string;
}

export const DEFAULT_API_VERSION = "2026-01";
export const DEFAULT_PORT = 3001;

export class ConfigError extends Error {}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
}

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Builds the server configuration from environment variables and CLI args.
 * CLI args take precedence over environment variables.
 */
export function loadConfig(
  env: NodeJS.ProcessEnv = process.env,
  args: CliArgs = {},
): ServerConfig {
  const shopDomain = asString(args.domain) ?? asString(env.MYSHOPIFY_DOMAIN);

  if (!shopDomain) {
    const hasCredentials = Boolean(
      asString(args.accessToken) ??
        asString(env.SHOPIFY_ACCESS_TOKEN) ??
        asString(args.clientId) ??
        asString(env.SHOPIFY_CLIENT_ID) ??
        asString(args.clientSecret) ??
        asString(env.SHOPIFY_CLIENT_SECRET),
    );
    if (hasCredentials) {
      throw new ConfigError(
        "MYSHOPIFY_DOMAIN is required when credentials are provided. Provide it via --domain=<store.myshopify.com> or the MYSHOPIFY_DOMAIN environment variable.",
      );
    }
    return {
      apiVersion:
        asString(args.apiVersion) ??
        asString(env.SHOPIFY_API_VERSION) ??
        DEFAULT_API_VERSION,
      http: {
        port: asNumber(args.port, asNumber(env.HTTP_PORT, DEFAULT_PORT)),
      },
    };
  }

  const accessToken =
    asString(args.accessToken) ?? asString(env.SHOPIFY_ACCESS_TOKEN);
  const clientId = asString(args.clientId) ?? asString(env.SHOPIFY_CLIENT_ID);
  const clientSecret =
    asString(args.clientSecret) ?? asString(env.SHOPIFY_CLIENT_SECRET);

  const auth = resolveAuth({ accessToken, clientId, clientSecret });

  return {
    shopDomain,
    apiVersion:
      asString(args.apiVersion) ??
      asString(env.SHOPIFY_API_VERSION) ??
      DEFAULT_API_VERSION,
    auth,
    http: {
      port: asNumber(args.port, asNumber(env.HTTP_PORT, DEFAULT_PORT)),
    },
  };
}

function resolveAuth(input: {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
}): AuthConfig {
  const hasClientCredentials = Boolean(input.clientId && input.clientSecret);

  if (hasClientCredentials) {
    return {
      kind: "client-credentials",
      clientId: input.clientId!,
      clientSecret: input.clientSecret!,
    };
  }

  if (input.accessToken) {
    return { kind: "static", accessToken: input.accessToken };
  }

  throw new ConfigError(
    "Authentication credentials are required.\n" +
      "  Option 1 — Static access token (legacy apps):   --accessToken=shpat_xxxxx\n" +
      "  Option 2 — Client credentials (Dev Dashboard):  --clientId=... --clientSecret=...",
  );
}
