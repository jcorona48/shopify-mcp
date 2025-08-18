#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
import minimist from "minimist";
import { z } from "zod/v3";
import express, { Request, Response } from "express";
import cors from "cors";

import { getCustomerOrders } from "./tools/getCustomerOrders.js";
import { getCustomers } from "./tools/getCustomers.js";
import { getOrderById } from "./tools/getOrderById.js";
import { getOrders } from "./tools/getOrders.js";
import { getProductById } from "./tools/getProductById.js";
import { getProducts } from "./tools/getProducts.js";
import { updateCustomer } from "./tools/updateCustomer.js";
import { updateOrder } from "./tools/updateOrder.js";
import { updateProduct, UpdateProductInputSchemaNormal } from "./tools/updateProduct.js";
import { getCollections } from "./tools/getCollections.js";
import { updateCollection } from "./tools/updateCollection.js";

interface ToolSchema {
  [key: string]: z.ZodTypeAny;
}

interface Tool {
  schema: ToolSchema;
  execute: (args: any) => Promise<any>;
}

interface Tools {
  [key: string]: Tool;
}

const argv = minimist(process.argv.slice(2));

dotenv.config();

const SHOPIFY_ACCESS_TOKEN =
  argv.accessToken || process.env.SHOPIFY_ACCESS_TOKEN;
const MYSHOPIFY_DOMAIN = argv.domain || process.env.MYSHOPIFY_DOMAIN;
const HTTP_MODE = argv.http || process.env.HTTP_MODE || false;
const HTTP_PORT = argv.port || process.env.HTTP_PORT || 3001;

process.env.SHOPIFY_ACCESS_TOKEN = SHOPIFY_ACCESS_TOKEN;
process.env.MYSHOPIFY_DOMAIN = MYSHOPIFY_DOMAIN;

if (!SHOPIFY_ACCESS_TOKEN) {
  console.error("Error: SHOPIFY_ACCESS_TOKEN is required.");
  console.error("Please provide it via command line argument or .env file.");
  console.error("  Command line: --accessToken=your_token");
  process.exit(1);
}

if (!MYSHOPIFY_DOMAIN) {
  console.error("Error: MYSHOPIFY_DOMAIN is required.");
  console.error("Please provide it via command line argument or .env file.");
  console.error("  Command line: --domain=your-store.myshopify.com");
  process.exit(1);
}

const shopifyClient = new GraphQLClient(
  `https://${MYSHOPIFY_DOMAIN}/admin/api/2023-07/graphql.json`,
  {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/json"
    }
  }
);

getProducts.initialize(shopifyClient);
getProductById.initialize(shopifyClient);
getCustomers.initialize(shopifyClient);
getOrders.initialize(shopifyClient);
getOrderById.initialize(shopifyClient);
updateOrder.initialize(shopifyClient);
getCustomerOrders.initialize(shopifyClient);
updateCustomer.initialize(shopifyClient);
updateProduct.initialize(shopifyClient);
getCollections.initialize(shopifyClient);
updateCollection.initialize(shopifyClient);

const tools: Tools = {
  'get-products': {
    schema: {
      searchTitle: z.string().optional(),
      limit: z.number().default(10)
    },
    execute: async (args: any) => {
      return await getProducts.execute(args);
    }
  },
  'get-product-by-id': {
    schema: {
      productId: z.string().min(1)
    },
    execute: async (args: any) => {
      return await getProductById.execute(args);
    }
  },
  'get-customers': {
    schema: {
      searchQuery: z.string().optional(),
      limit: z.number().default(10)
    },
    execute: async (args: any) => {
      return await getCustomers.execute(args);
    }
  },
  'get-orders': {
    schema: {
      status: z.enum(["any", "open", "closed", "cancelled"]).default("any"),
      limit: z.number().default(10)
    },
    execute: async (args: any) => {
      return await getOrders.execute(args);
    }
  },
  'get-order-by-id': {
    schema: {
      orderId: z.string().min(1)
    },
    execute: async (args: any) => {
      return await getOrderById.execute(args);
    }
  },
  'update-order': {
    schema: {
      id: z.string().min(1),
      tags: z.array(z.string()).optional(),
      email: z.string().email().optional(),
      note: z.string().optional(),
      customAttributes: z
        .array(
          z.object({
            key: z.string(),
            value: z.string()
          })
        )
        .optional(),
      metafields: z
        .array(
          z.object({
            id: z.string().optional(),
            namespace: z.string().optional(),
            key: z.string().optional(),
            value: z.string(),
            type: z.string().optional()
          })
        )
        .optional(),
      shippingAddress: z
        .object({
          address1: z.string().optional(),
          address2: z.string().optional(),
          city: z.string().optional(),
          company: z.string().optional(),
          country: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          province: z.string().optional(),
          zip: z.string().optional()
        })
        .optional()
    },
    execute: async (args: any) => {
      return await updateOrder.execute(args);
    }
  },
  'get-customer-orders': {
    schema: {
      customerId: z
        .string()
        .regex(/^\d+$/, "Customer ID must be numeric")
        .describe("Shopify customer ID, numeric excluding gid prefix"),
      limit: z.number().default(10)
    },
    execute: async (args: any) => {
      return await getCustomerOrders.execute(args);
    }
  },
  'update-customer': {
    schema: {
      id: z
        .string()
        .regex(/^\d+$/, "Customer ID must be numeric")
        .describe("Shopify customer ID, numeric excluding gid prefix"),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      tags: z.array(z.string()).optional(),
      note: z.string().optional(),
      taxExempt: z.boolean().optional(),
      metafields: z
        .array(
          z.object({
            id: z.string().optional(),
            namespace: z.string().optional(),
            key: z.string().optional(),
            value: z.string(),
            type: z.string().optional()
          })
        )
        .optional()
    },
    execute: async (args: any) => {
      return await updateCustomer.execute(args);
    }
  },
  'update-product': {
    schema: UpdateProductInputSchemaNormal,
    execute: async (args: any) => {
      return await updateProduct.execute(args);
    }
  },
  'get-collections': {
    schema: {
      searchTitle: z.string().optional(),
      limit: z.number().default(10)
    },
    execute: async (args: any) => {
      return await getCollections.execute(args);
    }
  },
  'update-collection': {
    schema: {
      collectionId: z.string().min(1),
      title: z.string().min(2).max(100).optional(),
      description: z.string().min(2).max(1000).optional(),
      descriptionHtml: z.string().min(2).max(1000).optional(),
      seo: z.object({
        title: z.string().optional(),
        description: z.string().optional()
      }).optional()
    },
    execute: async (args: any) => {
      return await updateCollection.execute(args);
    }
  }
};

const server = new McpServer({
  name: "shopify",
  version: "1.0.0",
  description:
    "MCP Server for Shopify API, enabling interaction with store data through GraphQL API",
});

Object.entries(tools).forEach(([toolName, tool]) => {
  server.registerTool(
    toolName,
     {
      title: toolName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      inputSchema: tool.schema,
    },
    // @ts-ignore
    async (args: any) => { // @ts-ignore
      console.log("Executing tool:", toolName);
      console.log("Arguments:", args);
      const result = await tool.execute(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }]
      };
    }
  );
});

if (HTTP_MODE) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let sseTransport: SSEServerTransport | null = null;

  app.get('/', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      name: 'Shopify MCP Server', 
      version: '1.0.0',
      mode: 'HTTP',
      endpoints: {
        sse: '/sse',
        messages: '/messages'
      }
    });
  });

  app.get("/sse", (req: Request, res: Response) => {
    sseTransport = new SSEServerTransport('/messages', res);
    server.connect(sseTransport)
  });

  app.post("/messages",async (req: Request, res: Response) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res, req.body);
    }
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Shopify MCP Server is running in HTTP mode on port ${HTTP_PORT}`);
    console.log(`Health check: http://localhost:${HTTP_PORT}`);
  });

} else {
  const transport = new StdioServerTransport();
  server
    .connect(transport)
    .then(() => {
      console.log("Shopify MCP Server is running in MCP mode...");
      console.log("Listening for requests on stdin/stdout");
    })
    .catch((error: unknown) => {
      console.error("Failed to start Shopify MCP Server:", error);
    });
}