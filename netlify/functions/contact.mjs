import { sendContactToDiscord } from "../../api/contact-handler.js";

export default async function handler(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const result = await sendContactToDiscord({
    email: body.email,
    source: body.source,
    webhookUrl: globalThis.Netlify?.env?.get("DISCORD_WEBHOOK_URL") ?? process.env.DISCORD_WEBHOOK_URL,
  });

  return Response.json(result.payload, { status: result.statusCode });
}

export const config = {
  method: "POST",
  path: "/api/contact",
};
