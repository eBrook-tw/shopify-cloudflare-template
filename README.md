# Shopify App Template - React Router

This is a template for building a [Shopify app](https://shopify.dev/docs/apps/getting-started) using [React Router](https://reactrouter.com/). It was forked from the [Shopify Remix app template](https://github.com/Shopify/shopify-app-template-remix) and converted to React Router.

Rather than cloning this repo, follow the [Quick Start steps](https://github.com/Shopify/shopify-app-template-react-router#quick-start).

Visit the [`shopify.dev` documentation](https://shopify.dev/docs/api/shopify-app-react-router) for more details on the React Router app package.

## Upgrading from Remix

If you have an existing Remix app that you want to upgrade to React Router, please follow the [upgrade guide](https://github.com/Shopify/shopify-app-template-react-router/wiki/Upgrading-from-Remix). Otherwise, please follow the quick start guide below.

## Quick start

### Prerequisites

Before you begin, you'll need to [download and install the Shopify CLI](https://shopify.dev/docs/apps/tools/cli/getting-started) if you haven't already.

### Setup

```shell
shopify app init --template=https://github.com/eBrook-tw/shopify-cloudflare-template
```

### Local Development

#### 1. Install dependencies

```shell
npm install
```

#### 2. Configure local secrets

```shell
cp .dev.vars.sample .dev.vars
```

Then edit `.dev.vars` and fill in the four required values:

```
CLOUDFLARE_TUNNEL_TOKEN=   # From Cloudflare Zero Trust dashboard
SHOPIFY_API_KEY=           # From your Shopify Partner app settings
SHOPIFY_API_SECRET=        # From your Shopify Partner app settings
SHOPIFY_APP_URL=           # Your app's public URL (e.g. https://shopify-dev-1.antonydu.store)
```

#### 3. Update database name in `wrangler.json`

Edit `wrangler.json` and update the `database_name` on line 15 to match your own D1 database name:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "<your-database-name>",
    "database_id": "<your-database-id>"
  }
]
```

#### 4. Apply database migrations (D1)

```shell
npm run db:migrate:local
```

#### 5. Deploy app config to Shopify

```shell
npx shopify app deploy
```

#### 6. Start the dev server

```shell
npm run dev
```

Press P to open the URL to your app. Once you click install, you can start development.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.

### Deploy to Cloudflare Workers

#### 1. Create the D1 database

```shell
npx wrangler d1 create <your-database-name>
```

Then update `wrangler.json` with the output `database_name` and `database_id`:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "<your-database-name>",
    "database_id": "<your-database-id>"
  }
]
```

#### 2. Apply database migrations (D1 production)

```shell
npm run db:migrate:remote
```

#### 3. Set production secrets

```shell
npx wrangler secret put SHOPIFY_API_KEY
npx wrangler secret put SHOPIFY_API_SECRET
npx wrangler secret put SHOPIFY_APP_URL
```

#### 4. Deploy to Cloudflare Workers

```shell
npm run deploy
```

This builds the app and deploys it to Cloudflare Workers with `--keep-vars` to preserve existing secret bindings. Your app will be available at the custom domain configured in `wrangler.json`.

## Resources

React Router:

- [React Router docs](https://reactrouter.com/home)

Shopify:

- [Intro to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [Shopify App React Router docs](https://shopify.dev/docs/api/shopify-app-react-router)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge-library).
- [Polaris Web Components](https://shopify.dev/docs/api/app-home/polaris-web-components).
- [App extensions](https://shopify.dev/docs/apps/app-extensions/list)
- [Shopify Functions](https://shopify.dev/docs/api/functions)

Internationalization:

- [Internationalizing your app](https://shopify.dev/docs/apps/best-practices/internationalization/getting-started)
