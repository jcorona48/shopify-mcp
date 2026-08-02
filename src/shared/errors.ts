/**
 * Error hierarchy for the Shopify integration.
 *
 * Tools and gateways throw these typed errors; the MCP server layer converts
 * them into clean, user-facing messages. Using a single hierarchy keeps error
 * classification in one place instead of scattering ad-hoc `new Error(...)`
 * calls across every tool.
 */

export interface UserError {
  field: string | null;
  message: string;
}

/** Base class for every error raised by the Shopify integration. */
export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** A request to the Shopify Admin API failed (network, auth, or GraphQL). */
export class ShopifyHttpError extends ShopifyError {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Shopify returned `userErrors` on a mutation. */
export class ShopifyUserErrorsError extends ShopifyError {
  constructor(
    readonly errors: UserError[],
    action: string,
  ) {
    super(formatUserErrors(action, errors));
  }
}

/** A requested resource does not exist. */
export class ShopifyNotFoundError extends ShopifyError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
  }
}

/** A store connection or credentials problem (multi-store mode). */
export class ShopifyStoreError extends ShopifyError {
  constructor(message: string) {
    super(message);
  }
}

export function formatUserErrors(action: string, errors: UserError[]): string {
  const details = errors
    .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
    .join(", ");
  return `Failed to ${action}: ${details}`;
}

/** Throws {@link ShopifyUserErrorsError} when Shopify reported userErrors. */
export function assertNoUserErrors(action: string, errors: UserError[]): void {
  if (errors.length > 0) {
    throw new ShopifyUserErrorsError(errors, action);
  }
}

/**
 * Converts an unknown error (e.g. a `graphql-request` `ClientError`) into a
 * typed {@link ShopifyError} so callers only need to understand one hierarchy.
 */
export function toShopifyError(error: unknown): ShopifyError {
  if (error instanceof ShopifyError) return error;

  if (isClientError(error)) {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.errors?.map((e: { message: string }) => e.message).join(", ") ||
      error.message;
    return new ShopifyHttpError(status, message);
  }

  if (error instanceof Error) return new ShopifyError(error.message);
  return new ShopifyError(String(error));
}

function isClientError(error: unknown): error is {
  message: string;
  response?: {
    status?: number;
    errors?: Array<{ message: string }>;
  };
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "request" in error
  );
}
