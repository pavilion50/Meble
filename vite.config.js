import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { defineConfig } from "vite";
import { sites } from "@openai/sites-vite-plugin";

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

function staticWorker() {
  return {
    name: "kw-meble-static-worker",
    apply: "build",
    async closeBundle() {
      const serverDir = resolve(process.cwd(), "dist", "server");
      await mkdir(serverDir, { recursive: true });
      await writeFile(
        resolve(serverDir, "index.js"),
        "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n"
      );
    },
  };
}

export default defineConfig({
  plugins: [sites(), staticWorker()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])
      ),
    },
  },
});
