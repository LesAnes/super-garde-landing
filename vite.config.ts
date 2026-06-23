import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

function readRequestBody(request: import("node:http").IncomingMessage) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body) as Record<string, unknown>);
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function contactApiDevPlugin(webhookUrl: string | undefined): Plugin {
  return {
    name: "super-garde-contact-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (request, response) => {
        const { sendContactToDiscord, sendJson } = await import("./api/contact-handler.js");

        if (request.method === "OPTIONS") {
          response.statusCode = 204;
          response.end();
          return;
        }

        if (request.method !== "POST") {
          sendJson(response, 405, { error: "Method not allowed" });
          return;
        }

        try {
          const body = await readRequestBody(request);
          const result = await sendContactToDiscord({
            email: body.email,
            source: body.source,
            webhookUrl,
          });

          sendJson(response, result.statusCode, result.payload);
        } catch {
          sendJson(response, 400, { error: "Invalid JSON payload" });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), contactApiDevPlugin(env.DISCORD_WEBHOOK_URL)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
