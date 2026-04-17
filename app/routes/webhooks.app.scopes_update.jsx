import { shopify } from "../shopify.server";
import { getPrismaClient } from "../db.server";

export const action = async ({ request, context }) => {
  const { payload, session, topic, shop } = await shopify(context).authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    const db = getPrismaClient(context.cloudflare.env.DB);
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  return new Response();
};
