/**
 * Express HTTP entry point for the MCP server.
 *
 * Uses `@modelcontextprotocol/express`'s pre-configured app (JSON body parsing
 * + DNS rebinding protection) and bridges the fetch-shaped MCP handler to
 * Express with `toNodeHandler` from `@modelcontextprotocol/node`.
 */

import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import type { McpHttpHandler } from "@modelcontextprotocol/server";
import type { ServerConfig } from "@/shared/config";

export class HttpServer {
  private readonly app = createMcpExpressApp();

  constructor(
    private readonly config: ServerConfig,
    mcpHandler: McpHttpHandler,
    version: string,
  ) {
    const mcp = toNodeHandler(mcpHandler);
    this.app.use("/mcp", (req, res) => void mcp(req, res, req.body));

    this.app.get("/", (_req, res) => {
      res.json({
        status: "ok",
        name: "Shopify MCP Server",
        version,
        mode: "HTTP",
        endpoints: { mcp: "/mcp" },
      });
    });
  }

  start(): void {
    this.app.listen(this.config.http.port, () => {
      console.log(
        `Shopify MCP Server is running in HTTP mode on port ${this.config.http.port}`,
      );
      console.log(`Health check: http://localhost:${this.config.http.port}`);
    });
  }
}
