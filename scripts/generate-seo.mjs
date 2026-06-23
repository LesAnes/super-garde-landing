import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const fallbackUrl = "https://super-garde.fr";

function normalizeSiteUrl(rawUrl) {
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

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.URL);
const distDir = path.resolve("dist");
const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(path.join(distDir, "robots.txt"), robots),
  writeFile(path.join(distDir, "sitemap.xml"), sitemap),
]);
