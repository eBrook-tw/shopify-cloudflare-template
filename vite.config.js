import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prismaClientDir = path.resolve(
  __dirname,
  "node_modules/.prisma/client",
);

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the Vite server.
// The CLI will eventually stop passing in HOST,
// so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

// HMR always binds to localhost — tunnel termination is local,
// so the browser (on the same machine) can reach it directly.
hmrConfig = {
  protocol: "ws",
  host: "localhost",
  port: 64999,
  clientPort: 64999,
};

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "react-router"],
    alias: [
      {
        find: /^\.prisma\/client\/default$/,
        replacement: path.join(prismaClientDir, "wasm.js"),
      },
      {
        find: /^#main-entry-point$/,
        replacement: path.join(prismaClientDir, "wasm.js"),
      },
    ],
  },
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser", "module", "default"],
      externalConditions: ["workerd", "worker", "browser", "module", "default"],
    },
  },
  server: {
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      allow: ["app", "workers", "node_modules"],
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
