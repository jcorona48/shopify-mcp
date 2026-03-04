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
import { getCollections } from "./tools/getCollections.js";
import { updateCollection } from "./tools/updateCollection.js";
import { createProduct, CreateProductInputSchema } from "./tools/createProduct.js";
import { updateProduct, UpdateProductInputSchema } from "./tools/updateProduct.js";
import { manageProductVariants, ManageProductVariantsInputSchema } from "./tools/manageProductVariants.js";
import { deleteProductVariants, DeleteProductVariantsInputSchema } from "./tools/deleteProductVariants.js";
import { deleteProduct, DeleteProductInputSchema } from "./tools/deleteProduct.js";
import { manageProductOptions, ManageProductOptionsInputSchema  } from "./tools/manageProductOptions.js";
import { ShopifyAuth } from "./lib/shopifyAuth.js";


interface ToolSchema  {
  [key: string]: any;
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
const SHOPIFY_CLIENT_ID =
  argv.clientId || process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET =
  argv.clientSecret || process.env.SHOPIFY_CLIENT_SECRET;
const MYSHOPIFY_DOMAIN = argv.domain || process.env.MYSHOPIFY_DOMAIN;
const HTTP_MODE = argv.http || process.env.HTTP_MODE || false;
const HTTP_PORT = argv.port || process.env.HTTP_PORT || 3001;

const useClientCredentials = !!(SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET);

// Store in process.env for backwards compatibility
process.env.MYSHOPIFY_DOMAIN = MYSHOPIFY_DOMAIN;

// Validate required environment variables
if (!SHOPIFY_ACCESS_TOKEN && !useClientCredentials) {
  console.error("Error: Authentication credentials are required.");
  console.error("");
  console.error("Option 1 — Static access token (legacy apps):");
  console.error("  --accessToken=shpat_xxxxx");
  console.error("");
  console.error("Option 2 — Client credentials (Dev Dashboard apps, Jan 2026+):");
  console.error("  --clientId=your_client_id --clientSecret=your_client_secret");
  process.exit(1);
}

if (!MYSHOPIFY_DOMAIN) {
  console.error("Error: MYSHOPIFY_DOMAIN is required.");
  console.error("Please provide it via command line argument or .env file.");
  console.error("  Command line: --domain=your-store.myshopify.com");
  process.exit(1);
}

// Resolve access token (client credentials or static)
let accessToken: string;
let auth: ShopifyAuth | null = null;

if (useClientCredentials) {
  auth = new ShopifyAuth({
    clientId: SHOPIFY_CLIENT_ID!,
    clientSecret: SHOPIFY_CLIENT_SECRET!,
    shopDomain: MYSHOPIFY_DOMAIN,
  });
  accessToken = await auth.initialize();
} else {
  accessToken = SHOPIFY_ACCESS_TOKEN!;
}

process.env.SHOPIFY_ACCESS_TOKEN = accessToken;

// Create Shopify GraphQL client
const API_VERSION = argv.apiVersion || process.env.SHOPIFY_API_VERSION || "2026-01";
const shopifyClient = new GraphQLClient(
  `https://${MYSHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
  {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json"
    }
  }
);

// Let the auth manager hot-swap the token header on refresh
if (auth) {
  auth.setGraphQLClient(shopifyClient);
}

// Initialize tools with shopifyClient
getProducts.initialize(shopifyClient);
getProductById.initialize(shopifyClient);
getCustomers.initialize(shopifyClient);
getOrders.initialize(shopifyClient);
getOrderById.initialize(shopifyClient);
updateOrder.initialize(shopifyClient);
getCustomerOrders.initialize(shopifyClient);
updateCustomer.initialize(shopifyClient);
createProduct.initialize(shopifyClient);
updateProduct.initialize(shopifyClient);
manageProductVariants.initialize(shopifyClient);
deleteProductVariants.initialize(shopifyClient);
deleteProduct.initialize(shopifyClient);
manageProductOptions.initialize(shopifyClient);
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
    schema: UpdateProductInputSchema.shape,
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
  },
  'create-product': {
    schema: CreateProductInputSchema.shape,
    execute: async (args: any) => {
      return await createProduct.execute(args);
    }
  },
  'manage-product-variants': {
    schema: ManageProductVariantsInputSchema.shape,
    execute: async (args: any) => {
      return await manageProductVariants.execute(args);
    }
  },
  'manage-product-options': {
    schema: ManageProductOptionsInputSchema.shape,
    execute: async (args: any) => {
      return await manageProductOptions.execute(args);
    }
  },
  'delete-product': {
    schema: DeleteProductInputSchema.shape,
    execute: async (args: any) => {
      return await deleteProduct.execute(args);
    }
  },
  'delete-product-variants': {
    schema: DeleteProductVariantsInputSchema.shape,
    execute: async (args: any) => {
      return await deleteProductVariants.execute(args);
    }
  }
};

// Function to create and configure a new MCP server instance
function createMcpServer(): McpServer {
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

  return server;
}

if (HTTP_MODE) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Store single active session (only one connection at a time)
  let activeSession: { transport: SSEServerTransport, server: McpServer } | null = null;

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
    // Close any existing connection
    if (activeSession) {
      console.log('Closing previous session to accept new connection');
    }
    
    // Create a new server instance for this SSE connection
    const server = createMcpServer();
    const sseTransport = new SSEServerTransport('/messages', res);
    activeSession = { transport: sseTransport, server };
    
    // Clean up on disconnect
    res.on('close', () => {
      if (activeSession?.transport === sseTransport) {
        activeSession = null;
        console.log('SSE connection closed');
      }
    });
    
    server.connect(sseTransport);
    console.log('SSE connection established');
  });

  app.post("/messages", async (req: Request, res: Response) => {
    if (activeSession) {
      await activeSession.transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).json({ error: 'No active SSE connection. Connect to /sse first.' });
    }
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Shopify MCP Server is running in HTTP mode on port ${HTTP_PORT}`);
    console.log(`Health check: http://localhost:${HTTP_PORT}`);
  });

} else {
  const server = createMcpServer();
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