import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";

const siteName = "Super-Garde";
const siteTitle = "Super-Garde | Logiciel de gestion des gardes médicales";
const siteDescription =
  "Super-Garde aide les facultés de médecine à planifier, suivre et ajuster les gardes des étudiants, des rotations aux permutations.";
const siteKeywords = [
  "gestion des gardes medicales",
  "planning gardes etudiants medecine",
  "logiciel scolarite medecine",
  "permutations gardes",
  "faculte de medecine",
];

function normalizeSiteUrl(rawUrl: string | undefined) {
  const fallbackUrl = "https://super-garde.fr";

  if (!rawUrl) {
    return fallbackUrl;
  }

  try {
    const url = new URL(rawUrl);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallbackUrl;
  }
}

function seoPlugin(siteUrl: string): Plugin {
  const canonicalUrl = `${siteUrl}/`;
  const imageUrl = `${siteUrl}/og-image.svg`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    description: siteDescription,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "faculty administration",
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: canonicalUrl,
      logo: `${siteUrl}/favicon.svg`,
    },
  };

  const tags: HtmlTagDescriptor[] = [
    { tag: "link", attrs: { rel: "canonical", href: canonicalUrl } },
    { tag: "meta", attrs: { name: "robots", content: "index, follow, max-image-preview:large" } },
    { tag: "meta", attrs: { name: "author", content: siteName } },
    { tag: "meta", attrs: { name: "keywords", content: siteKeywords.join(", ") } },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:locale", content: "fr_FR" } },
    { tag: "meta", attrs: { property: "og:site_name", content: siteName } },
    { tag: "meta", attrs: { property: "og:title", content: siteTitle } },
    { tag: "meta", attrs: { property: "og:description", content: siteDescription } },
    { tag: "meta", attrs: { property: "og:url", content: canonicalUrl } },
    { tag: "meta", attrs: { property: "og:image", content: imageUrl } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: siteTitle } },
    { tag: "meta", attrs: { name: "twitter:description", content: siteDescription } },
    { tag: "meta", attrs: { name: "twitter:image", content: imageUrl } },
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(structuredData),
    },
  ].map((tag) => ({ ...tag, injectTo: "head" }));

  return {
    name: "super-garde-seo",
    transformIndexHtml(html) {
      return {
        html: html
          .replace(/<title>.*<\/title>/, `<title>${siteTitle}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${siteDescription}" />`,
          ),
        tags,
      };
    },
  };
}

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
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || env.SITE_URL || env.URL);

  return {
    plugins: [react(), seoPlugin(siteUrl), contactApiDevPlugin(env.DISCORD_WEBHOOK_URL)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
