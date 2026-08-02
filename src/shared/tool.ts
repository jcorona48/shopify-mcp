/**
 * Contract every MCP tool must satisfy.
 *
 * Tools implement this interface; the MCP server factory registers them and
 * the error-mapper decorator wraps them. LSP: code depends on this abstraction,
 * never on a concrete tool class.
 */

import type { z } from "zod";

export interface Tool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: z.ZodObject<z.ZodRawShape>;
  execute(input: Record<string, unknown>): Promise<unknown>;
}
