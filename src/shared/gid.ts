/**
 * Helpers for Shopify Global IDs (GIDs).
 *
 * The Admin API expects resources identified by `gid://shopify/<Type>/<id>`.
 * Some tools accept a bare numeric id from the user and must build the GID;
 * validating before sending avoids confusing server errors.
 */

const GID_PATTERN = /^gid:\/\/shopify\//;

/** True when the string looks like a Shopify GID. */
export function isGid(value: string): boolean {
  return GID_PATTERN.test(value);
}

/**
 * Builds a Shopify GID from a numeric id, e.g.
 * `gidFor("Customer", "123")` -> `gid://shopify/Customer/123`.
 * Pass-through when the input is already a full GID.
 */
export function gidFor(type: string, id: string): string {
  return isGid(id) ? id : `gid://shopify/${type}/${id}`;
}
