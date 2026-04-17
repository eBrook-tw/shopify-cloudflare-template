import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { getPrismaClient } from "./db.server";

export const shopify = (context) =>
  shopifyApp({
    apiKey: context.cloudflare.env.SHOPIFY_API_KEY,
    apiSecretKey: context.cloudflare.env.SHOPIFY_API_SECRET || "",
    apiVersion: ApiVersion.October25,
    scopes: context.cloudflare.env.SCOPES?.split(","),
    appUrl: context.cloudflare.env.SHOPIFY_APP_URL || "",
    authPathPrefix: "/auth",
    sessionStorage: new PrismaSessionStorage(
      getPrismaClient(context.cloudflare.env.DB),
    ),
    distribution: AppDistribution.AppStore,
    future: {
      expiringOfflineAccessTokens: true,
    },
  });

export const apiVersion = ApiVersion.October25;
