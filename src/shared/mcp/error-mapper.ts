/**
 * Decorator that normalizes and logs tool errors.
 *
 * Wraps any {@link Tool} so failures are converted into the shared
 * {@link ShopifyError} hierarchy (giving consistent messages regardless of
 * where the failure happened) and logged with the tool name.
 */

import { toShopifyError } from "@/shared/errors";
import type { Tool } from "@/shared/tool";

export class ErrorMapperTool implements Tool {
  constructor(private readonly inner: Tool) {}

  get name(): string {
    return this.inner.name;
  }

  get description(): string {
    return this.inner.description;
  }

  get inputSchema() {
    return this.inner.inputSchema;
  }

  async execute(input: Record<string, unknown>): Promise<unknown> {
    try {
      return await this.inner.execute(input);
    } catch (error) {
      const mapped = toShopifyError(error);
      console.error(`Tool "${this.inner.name}" failed:`, mapped.message);
      throw mapped;
    }
  }
}

/** Wraps every tool in an {@link ErrorMapperTool}. */
export function withErrorMapping(tools: Tool[]): Tool[] {
  return tools.map((tool) => new ErrorMapperTool(tool));
}
