/**
 * Builds a configured {@link McpServer} and registers every tool.
 *
 * Called by the `createMcpHandler` factory, so a fresh server (and thus a
 * fresh set of handlers) is produced per request. Adding a tool is a matter
 * of exposing it in a module's index — nothing here changes (OCP).
 */

import { McpServer } from "@modelcontextprotocol/server";
import type { Implementation } from "@modelcontextprotocol/server";
import type { Tool } from "@/shared/tool";

export function titleize(name: string): string {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function createMcpServer(serverInfo: Implementation, tools: Tool[]): McpServer {
  const server = new McpServer(serverInfo, { capabilities: { tools: {} } });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: titleize(tool.name),
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      async (args) => {
        console.log("Executing tool:", tool.name);
        const result = await tool.execute(args);
        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: result as Record<string, unknown>,
        };
      },
    );
  }

  return server;
}
