import { boundary } from "@shopify/shopify-app-react-router/server";
import { shopify } from "../shopify.server";

export const loader = async ({ request, context }) => {
  await shopify(context).authenticate.admin(request);

  return null;
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
