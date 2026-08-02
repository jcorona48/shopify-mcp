# PLAN.md — shopify-mcp (memoria de sesión)

> Lee esto antes de tocar código. Refleja el estado actual del refactor SOLID +
> migración a MCP SDK v2 + multi-tienda. Actualízalo al terminar cada sesión.

## Objetivo
Refactorizar `shopify-mcp` (MCP server para la Shopify Admin API) con principios
SOLID, migrar del SDK MCP v1 (retirado) al v2 y soportar **multi-tienda**
(credenciales propias por cliente). Organizar en módulos de negocio
(`src/modules/`) + infraestructura (`src/shared/`), archivos cortos de
responsabilidad única, código en **clases**, integrando el codegen oficial de
Shopify y la skill `shopify-admin`.

## Decisiones clave
- **Gestor de paquetes: bun** (el usuario lo pidió; NO npm). Lockfile `bun.lock`.
- **Transporte**: solo HTTP Streamable. **`@modelcontextprotocol/express`**
  (bootstrap Express: JSON body parsing + DNS rebinding protection) + handler
  `createMcpHandler()` de `@modelcontextprotocol/server` + `toNodeHandler()` de
  `@modelcontextprotocol/node`. Sin SSE v1, sin WebSocket.
- **Bug crítico HTTP**: `toNodeHandler(mcpHandler)` con `express.json()` rompe el
  body (JSON vacío → error `-32700 Parse error`). Fix aplicado en
  `shared/http/http-server.ts`: pasar `req.body` como tercer arg →
  `(req, res) => void mcp(req, res, req.body)`.
- **API v2**: `McpServer` + `registerTool(name, {title, description, inputSchema},
  cb)` con `inputSchema` = `z.object({...})` COMPLETO. `createMcpHandler(factory)`
  crea un `McpServer` por request vía `(ctx: McpRequestContext) => McpServer`;
  `ctx.requestInfo` es la `Request` web estándar (headers accesibles).
- **Codegen**: `.graphqlrc.ts` con `shopifyApiProject({ apiType: ApiType.Admin,
  apiVersion: '2026-01', outputDir: './src/shared/generated', declarations: true })`.
  Schema: `https://shopify.dev/admin-graphql-direct-proxy/2026-01`. Queries con tag
  `gql` de `graphql-request` (NO `#graphql`, NO interpolar `${VAR}`). Genera:
  `admin.generated.d.ts`, `admin.types.d.ts`, `admin-2026-01.schema.json` en
  `src/shared/generated/`.
- **SOLID**: interfaz `Tool` en `shared/tool.ts` (`name`, `description`,
  `inputSchema: z.ZodObject<z.ZodRawShape>`, `execute(input: Record<string,
  unknown>): Promise<unknown>`). Cada tool depende solo de la interfaz service de
  su módulo (DIP). Decorator `ErrorMapperTool` en `shared/mcp/error-mapper.ts`.
- **Nombres**: gateways renombrados a `.service` (ProductService,
  GraphQLProductService, etc.) y a `.gateway.js` → `.service.js`.
- **Tipos nombrados**: sin literales de tipo inline dentro de los services. Cada
  módulo tiene `responses.ts` (tipos de respuesta GraphQL por operación),
  `nodes.ts` (nodos GraphQL), `mappers.ts` (node → dominio), `types.ts`
  (modelos de dominio), `*.service.ts` (interfaz) y `graphql-*.service.ts`
  (implementación). Sin schemas.ts/queries.ts largos: cada tool es carpeta con
  `schema.ts`, `query.ts`, `tool.ts` (decisión explícita del usuario).
- **Base moderna**: build con **tsup** (ESM, target node20, deps externalizadas),
  tsconfig con `moduleResolution: "bundler"` e **imports relativos sin `.js`**
  (`./app`, no `./app.js`). tsc solo para typecheck (`--noEmit`). Node 20+.
- **Multi-tienda**: credenciales solo en memoria, nunca a disco; no loguear ni
  devolver tokens; aislar por sesión; verificar credenciales al registrar
  (`connect-shop` con `verify: true` por defecto); permitir TLS; fallback a `.env`.
  Prioridad de resolución del store por request:
  1. Headers HTTP en `POST /mcp` (`x-shopify-domain` + `x-shopify-access-token` o
     `x-shopify-client-id` + `x-shopify-client-secret`).
  2. Sesión MCP (`mcp-session-id` header) vinculada por la tool `connect-shop`.
  3. Store por defecto de `.env` / CLI.
- **Auth**: patrón Strategy + Factory (`TokenProvider`). El cliente GraphQL lee el
  token por request. `ClientCredentialsTokenProvider.initialize()` es idempotente
  (permite cachear providers client-credentials en el registry).

## Estructura de archivos (estado)
```
src/
  index.ts                     # entrada trivial (~10 líneas): config + createApp().start()
  app.ts                       # [HECHO] composition root: registry, resolver, tools por store, createMcpHandler, HttpServer
  shared/
    config.ts                  # [HECHO] loadConfig + AuthConfig (CLI args > env)
    errors.ts                  # [HECHO] ShopifyError, ShopifyHttpError, ShopifyUserErrorsError, ShopifyNotFoundError, ShopifyStoreError, assertNoUserErrors
    types.ts                   # [HECHO] Money, Address, Metafield, Seo
    gid.ts                     # [HECHO] gidFor(resource, id)
    tool.ts                    # [HECHO] interfaz Tool
    graphql-client.ts          # [HECHO] wrapper graphql-request + token dinámico por request
    generated/                 # [HECHO] codegen: admin.generated.d.ts, admin.types.d.ts, admin-2026-01.schema.json
    auth/                      # [HECHO] TokenProvider Strategy + Factory (static / client-credentials)
    mcp/                       # [HECHO] mcp-server-factory (createMcpServer + titleize), error-mapper (ErrorMapperTool)
    http/                      # [HECHO] HttpServer: Express + /mcp + health + listen (fix req.body)
    store/
      store-context.ts         # [HECHO] StoreCredentials, StoreContext, createStoreContext, buildGraphQLClient
      store-registry.ts        # [HECHO] cache client-credentials + sesiones por mcp-session-id (TTL 30 min, sweep 5 min)
      store-resolver.ts        # [HECHO] resolve(headers, sessionId): headers > sesión > default; connect(); normalizeShopDomain
      store-verifier.ts        # [HECHO] verifyStore() via query { shop { name } }
  modules/
    products/                  # [HECHO] 8 tools + product.service.ts + graphql-product.service.ts + nodes/mappers/types/responses/graphql-inputs
    customers/                 # [HECHO] 3 tools + customer.service.ts + graphql-customer.service.ts + nodes/mappers/types/responses
    orders/                    # [HECHO] 3 tools + order.service.ts + graphql-order.service.ts + nodes/mappers/types/responses
    collections/               # [HECHO] 2 tools + collection.service.ts + graphql-collection.service.ts + nodes/mappers/types/responses
    stores/
      connect-shop/tool.ts     # [HECHO] vincula store a la sesión (verify por defecto)
      schema.ts                # [HECHO] shopDomain + (accessToken | clientId+clientSecret) + verify
      index.ts                 # [HECHO] createStoreTools(resolver, sessionId)
```

## 17 tools (16 originales + connect-shop)
`get-products`, `get-product-by-id`, `get-customers`, `get-orders`, `get-order-by-id`,
`update-order`, `get-customer-orders`, `update-customer`, `update-product`,
`get-collections`, `update-collection`, `create-product`, `manage-product-variants`,
`manage-product-options`, `delete-product`, `delete-product-variants`,
`connect-shop`.

Notas de comportamiento a preservar:
- `update-customer` y `get-customer-orders` reciben id **numérico** (regex
  `/^\d+$/`) y convierten a `gid://shopify/Customer/<id>`.
- `create-product`: al pasar `productOptions` Shopify solo crea la variante
  default; el MCP devuelve la descripción que avisa usar `manage-product-variants`.
- `get-collections` responde con `products: []` e `image: null`.
- Los `userErrors` de las mutations se lanzan como error descriptivo
  (`assertNoUserErrors`).

## API 2026-01 (validado por codegen + skill)
- `customerUpdate(input: CustomerInput!)`; `orderUpdate(input: OrderInput!)`;
  `collectionUpdate(input: CollectionInput!)`.
- Campos corregidos: `Customer.numberOfOrders` + `amountSpent { amount
  currencyCode }` (NO ordersCount/totalSpent); `Order.displayFinancialStatus`/
  `displayFulfillmentStatus` (NO financialStatus/fulfillmentStatus);
  `Collection.productsCount` es `Count` → subcampos `{ count }`.
- Deprecados (con aviso de la skill, dejar así): `Customer.email` →
  `defaultEmailAddress.emailAddress`; `Customer.phone` → `defaultPhoneNumber.phoneNumber`.

## Trabajo hecho (última sesión)
- Multi-tienda: `shared/store/*` + tool `connect-shop` + headers por request en
  `POST /mcp`; `initializeDefault()` con soft-fail (el servidor arranca aunque el
  store de `.env` esté roto, para que clientes usen `connect-shop`/headers).
- Refactor de tipos: `responses.ts` por módulo (tipos de respuesta GraphQL con
  nombre), `customers/nodes.ts` + `customers/mappers.ts` extraídos del service,
  `ProductWithRemainingVariants`, params con nombre (`ListCustomersParams`, etc.).
- `src/app.ts` como composition root; `src/index.ts` reducido a ~10 líneas.
- Renombrado `.gateway` → `.service` en los 4 módulos.
- Codegen movido de `src/` a `src/shared/generated/` (`.graphqlrc.ts` actualizado;
  regenerado con `bunx graphql-codegen`).
- Fix idempotencia de `ClientCredentialsTokenProvider.initialize()`.
- **Base moderna**: build con **tsup** (`tsup.config.ts`, `format: esm`,
  `target: node20`, `external: dependencies` de package.json, `sourcemap`).
  `tsconfig.json` con `module: ESNext` + `moduleResolution: bundler` + `noEmit`
  (tsc solo para typecheck). **Imports relativos SIN extensión `.js`** en todo
  `src/`. Deps ordenadas: `@types/*` → devDependencies; `@types/node` ^24;
  `rimraf` eliminado; `engines.node >=20`; scripts `build`/`start`/`dev`/`typecheck`/`codegen`.
- Typecheck OK (`bunx tsc --noEmit`) y build OK (`bun run build`; bundle arranca).

## Pendiente
- Smoke test HTTP completo de multi-tienda (initialize + tools/list con headers +
  connect-shop verify=false + un tools/call). OJO: investigar `-32700 Parse
  error` reproducible al probar por curl en `/mcp` (parece no entregarse
  `parsedBody` en la ruta moderna); el fix `req.body` documentado arriba se
  aplicó pero el smoke aún no pasó.
- Verificar errores de credenciales por request cuando el default store falla
  (deben salir limpios vía ErrorMapperTool).
- Borrar restos de `src/tools/`, `src/lib/`, `src/domain/`, `src/config/`,
  `src/errors/` si aún existen.
- README (v2, Express, bun, tsup, codegen, multi-tienda).
