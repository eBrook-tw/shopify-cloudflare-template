# GEMINI.md - Project Context & Instructions

This project is a **Shopify App** built using **React Router (v7)** and designed for deployment on **Cloudflare Workers** using **Cloudflare D1** as the database.

## Project Overview

- **Architecture:** Monolithic web application utilizing React Router's full-stack capabilities.
- **Shopify Integration:** Uses `@shopify/shopify-app-react-router` for authentication, session management, and API access.
- **Runtime:** Cloudflare Workers (via `wrangler`).
- **Database:** Cloudflare D1 (SQL) accessed through **Prisma ORM** with the `@prisma/adapter-d1` adapter.
- **Frontend:** React with **Shopify Polaris** components and **App Bridge** for embedded app functionality.

## Core Technologies

- **Framework:** React Router 7 (Vite-based)
- **Deployment:** Cloudflare Workers & Wrangler
- **ORM:** Prisma 6.x
- **Database:** Cloudflare D1
- **Shopify SDKs:** `@shopify/shopify-app-react-router`, `@shopify/app-bridge-react`
- **Tooling:** Shopify CLI, Vite, ESLint, Prettier

## Building and Running

### Local Development
1.  **Environment Variables:** Ensure `.dev.vars` (or `.env` equivalents) are set up.
2.  **Setup Prisma:**
    ```bash
    npm run setup
    ```
3.  **Local Database Migrations:**
    ```bash
    npm run db:migrate:local
    ```
4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    *Note: `npm run dev` executes `scripts/dev.sh`, which starts a `cloudflared` tunnel and the `react-router dev` server concurrently.*

### Build and Deployment
-   **Build:** `npm run build`
-   **Deploy to Cloudflare:** `npm run deploy` (Runs build and then `wrangler deploy`)
-   **Remote Migrations:** `npm run db:migrate:remote`

## Project Structure

-   `app/`: Main application source code.
    -   `routes/`: File-system based routes (React Router).
    -   `shopify.server.js`: Shopify app configuration and initialization.
    -   `db.server.js`: Prisma client initialization with D1 adapter.
-   `workers/`: Cloudflare Worker entry point (`app.ts`).
-   `prisma/`: Prisma schema and migration definitions.
-   `scripts/`: Utility scripts (e.g., `dev.sh`).
-   `shopify.app.toml`: Shopify app configuration (scopes, webhooks, etc.).
-   `wrangler.json`: Cloudflare Workers and D1 configuration.

## Development Conventions

-   **Authentication:** Always use `shopify(context).authenticate.admin(request)` in loaders to verify Shopify admin sessions.
-   **Data Access:** Use the `getPrismaClient(context.cloudflare.env.DB)` helper from `db.server.js` to interact with the database.
-   **Routing:** Follow the flat routes convention in `app/routes/`.
-   **Webhooks:** Register/update webhooks via `shopify.app.toml` for automatic syncing during deployment.
-   **Error Handling:** Use React Router's `ErrorBoundary` and the `boundary` helper from the Shopify adapter to ensure headers (like App Bridge redirects) are correctly handled.

## Key Files for Investigation

1.  `shopify.app.toml`: Source of truth for Shopify app settings.
2.  `wrangler.json`: Worker bindings and environment variables.
3.  `app/shopify.server.js`: How Shopify services are instantiated.
4.  `app/db.server.js`: Database connection logic.
5.  `prisma/schema.prisma`: Data models (Session, etc.).
