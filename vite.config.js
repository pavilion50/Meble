import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { defineConfig, loadEnv } from "vite";

const pages = [
  "index.html",
  "meble-kuchenne.html",
  "zabudowy-wnek.html",
  "meble-lazienkowe.html",
  "meble-pokojowe.html",
  "szafy.html",
  "garderoby.html",
  "meble-biurowe.html",
];

// Generuje robots.txt i sitemap.xml na podstawie tego samego VITE_SITE_URL,
// co reszta witryny (meta tagi, canonical, structured data w plikach .html).
// Dzięki temu domenę zmienia się w jednym miejscu — w pliku .env.
function seoFiles(siteUrl) {
  return {
    name: "kw-meble-seo-files",
    apply: "build",
    async closeBundle() {
      const origin = siteUrl.replace(/\/+$/, "");
      const distDir = resolve(process.cwd(), "dist");

      const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

      const urls = pages
        .map((page) => {
          const path = page === "index.html" ? "" : page;
          const priority = page === "index.html" ? "1.0" : "0.8";
          return `  <url>\n    <loc>${origin}/${path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        })
        .join("\n");
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

      await writeFile(resolve(distDir, "robots.txt"), robotsTxt);
      await writeFile(resolve(distDir, "sitemap.xml"), sitemapXml);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL || "http://localhost:5173";

  return {
    plugins: [seoFiles(siteUrl)],
    preview: {
      headers: {
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' https://images.unsplash.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'",
      },
    },
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])
        ),
      },
    },
  };
});
