# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Local dev: Cloudflare tunnel + React Router dev server
npm run build            # Build for production
npm run deploy           # Build and deploy to Cloudflare Workers (--keep-vars)
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint

# Database migrations (Cloudflare D1)
npm run db:migrate:create   # Create new migration script
npm run db:migrate:local    # Apply migrations to local D1
npm run db:migrate:remote   # Apply migrations to production D1

npm run setup            # Generate Prisma client (run after schema changes)
npm run graphql-codegen  # Regenerate Shopify Admin API GraphQL types
```

There is no test runner configured in this project.

## Architecture

This is a **Shopify embedded admin app** running on **Cloudflare Workers** with React Router 7 for full-stack SSR.

### Request Flow

```
Cloudflare Worker (workers/app.ts)
  → React Router SSR handler
    → Shopify OAuth middleware (app/shopify.server.js)
      → Route loaders/actions (app/routes/)
        → Shopify Admin GraphQL API
```

### Key Files

- **`workers/app.ts`** — Worker entry point; creates the React Router request handler with Cloudflare bindings
- **`app/shopify.server.js`** — Shopify app config: API version (2025-10), scopes, session storage via Prisma+D1, webhook registration
- **`app/db.server.js`** — Prisma client instantiation using `@prisma/adapter-d1` for Cloudflare Workers compatibility
- **`app/routes/`** — File-system routes: `app._index.jsx` (home), `app.jsx` (layout), `auth.$.jsx` (OAuth), `webhooks.*.jsx`

### Database

Cloudflare D1 (SQLite) accessed via Prisma with the D1 driver adapter. Schema is in `prisma/schema.prisma`; migrations live in `migrations/` (not `prisma/migrations/`). Prisma uses its WASM query engine (aliased in `vite.config.js`) to work in the Workers runtime.

### Config Files

| File | Controls |
|------|---------|
| `wrangler.json` | Worker name, D1 binding (`DB`), env vars, custom domain, observability |
| `shopify.app.toml` | App scopes, webhooks, metafield/metaobject definitions |
| `prisma/schema.prisma` | Session model for OAuth token storage |
| `vite.config.js` | Cloudflare plugin, SSR, Prisma WASM alias |
| `.dev.vars` | Local secrets (not committed): `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `CLOUDFLARE_TUNNEL_TOKEN` |

### Local Development

The dev script (`scripts/dev.sh`) runs a Cloudflare tunnel and the React Router dev server concurrently. Secrets go in `.dev.vars`. The D1 database binding is `DB` — the Worker receives it via `context.cloudflare.env.DB`.

### Deployment

Production Worker name: `cloudflare-1`. D1 database: `cloudflare-shopify-1`. Custom domain: `shopify-dev-1.antonydu.store`. Secrets are set via `wrangler secret put`.
