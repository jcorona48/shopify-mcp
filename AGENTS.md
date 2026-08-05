# AGENTS.md — shopify-mcp

## Recuerda primero
Lee `PLAN.md` (raíz del repo) antes de tocar código. Es la memoria de la sesión anterior:
estado del refactor SOLID + migración a MCP SDK v2 + multi-tienda, estructura aprobada
y próximos pasos.

## Comandos
- Gestor de paquetes: **bun** (NO npm). `bun install`, `bunx`, `bun run`.
- Build: `bun run build` (tsup → `dist/index.js` + `dist/api.js`, ESM, Node 20+).
- Start (bundle): `bun run start`. Dev/watch: `bunx tsx src/index.ts ...`.
- Deploy Vercel: `vercel --prod` (ver sección "Deploy Vercel" abajo).
- Typecheck: `bunx tsc --noEmit` (tsconfig con `moduleResolution: "bundler"`).
- Codegen Shopify GraphQL: `bunx graphql-codegen` (config en `.graphqlrc.ts`,
  output en `src/shared/generated/`).

## Reglas del proyecto
- Archivos cortos, una responsabilidad; código en **clases**.
- Módulos verticales en `src/modules/<domain>/`; infraestructura en `src/shared/`.
- Capas por módulo (patrón de `products`): `controllers/` (tools), `interfaces/`
  (contrato `I<X>Service` + tipos de respuesta reutilizables como `ListResponse`,
  `ProductResponse`), `services/` (clase con lógica/orquestación que **inyecta el
  repository**), `repositories/` (`I<X>Repository` + `product-graphql.repository.ts`
  como fuente de datos), `dto/` (schemas zod), `entities/` (modelos), `graphql/`
  (queries/nodes/responses/mappers/inputs), `<domain>.module.ts` (wiring + exports).
- Declarar y reutilizar tipos de respuesta (p.ej. `ListResponse`) en vez de repetir
  literales como `{ products: IProduct[] }` en cada firma.
- Imports con alias `@/` (mapeado a `src/`), **sin extensión** (`.js`). Ej.:
  `import { createApp } from "@/app"`, `import type { Tool } from "@/shared/tool"`.
  Nada de relativos `../../`. Base moderna: tsup + `moduleResolution: "bundler"`
  (paths `@/*` en `tsconfig.json`).
- Al escribir queries/mutations Shopify Admin: usar la skill `shopify-admin`
  (`.agents/skills/shopify-admin/`) con `scripts/search_docs.mjs` + `scripts/validate.mjs`.
- No usar `@modelcontextprotocol/sdk` v1 ni `zod/v3`. Solo `@modelcontextprotocol/server`,
  `@modelcontextprotocol/node`, `@modelcontextprotocol/express`, `zod@^4.2`.
- No añadir comentarios al código salvo que se pidan.

## MCP HTTP stateless (multi-tienda)
- `createMcpHandler` (SDK v2) sirve cada POST con una instancia nueva del server
  (`legacy: 'stateless'`): **no emite `mcp-session-id`** y GET/DELETE de sesión → 405.
- La tienda por request se resuelve SOLO por headers HTTP: `x-shopify-domain` +
  `x-shopify-access-token` (o `x-shopify-client-id` + `x-shopify-client-secret`),
  leídos en la factory vía `ctx.requestInfo.headers` (`src/app.ts`). Con `accept:
  application/json, text/event-stream` en cada POST o el SDK responde `-32000`.
- `connect-shop` y `StoreRegistry` (sessions) están **inoperantes** en modo stateless
  (sessionId siempre null): documentado, no tocar. Los fallos de tienda caída se
  degradan a contenido de tool (HTTP 200), no a HTTP 500.

## Deploy Vercel
- `vercel.json`: `framework: null` (impide la detección de framework Express de
  Vercel, que rompía el build de tsup) + rewrite `/(.*) → /api`. `public/` vacío
  como output default (un output dir con archivos sombrearía las rutas, p.ej.
  `dist/` hacía que `/` devolviera el bundle JS en vez del health check).
- `api/index.js` (serverless function) solo hace `export { default } from
  "../dist/api.js"`. El bundle real se genera con tsup: `src/api.ts` es el
  entry Vercel (`src/api.ts:1-3`), entry añadida en `tsup.config.ts`. tsup
  resuelve los aliases `@/` (Vercel no los resuelve en `api/`) y elimina el
  top-level await (el runtime de Vercel no soporta TLA en el bundle de la
  función).
- `createApp` es **síncrono** (`src/app.ts`) — `initializeDefault()` es
  fire-and-forget con `.catch` warn, para evitar TLA en Vercel. `HttpServer`
  acepta `{ host }` opcional; en Vercel se usa `host: "0.0.0.0"` para desactivar
  la protección DNS-rebinding (si no, rechaza los hosts `*.vercel.app`).
- Sin `MYSHOPIFY_DOMAIN`/credenciales en prod, el server arranca en modo
  "header-only": `get-products` etc. devuelven un error claro como tool content.
