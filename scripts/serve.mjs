// Minimal static server for the ./out export, with clean URLs (/part -> /part.html) and the same
// security headers as production (read from vercel.json, so the local browser pass checks the real CSP).
// Usage: npm start  [PORT=3000]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".woff": "font/woff", ".webmanifest": "application/manifest+json",
};

/** Map a URL path to a file under root, or null. Never resolves outside root. */
async function resolveFile(root, urlPath) {
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const base = join(root, safe);
  if (base !== root && !base.startsWith(root + sep)) return null;
  for (const p of [base, `${base}.html`, join(base, "index.html")]) {
    try { if ((await stat(p)).isFile()) return p; } catch { /* try the next candidate */ }
  }
  return null;
}

/** Security headers declared for every path in vercel.json. */
export async function productionHeaders(vercelJsonPath) {
  try {
    const config = JSON.parse(await readFile(vercelJsonPath, "utf8"));
    const all = (config.headers ?? []).find((h) => h.source === "/(.*)");
    return Object.fromEntries((all?.headers ?? []).map((h) => [h.key, h.value]));
  } catch {
    return {};
  }
}

export function createStaticServer(rootDir, headers = {}) {
  const root = resolve(rootDir);
  return createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    } catch {
      res.writeHead(400, { ...headers, "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad request: malformed URL encoding");
      return;
    }
    try {
      const file = await resolveFile(root, pathname);
      const target = file ?? join(root, "404.html");
      const body = await readFile(target);
      res.writeHead(file ? 200 : 404, { ...headers, "Content-Type": TYPES[extname(target)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(500, { ...headers, "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server error");
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  const headers = await productionHeaders(resolve("vercel.json"));
  createStaticServer("out", headers).listen(port, "127.0.0.1", () => console.log(`Serving ./out at http://127.0.0.1:${port}`));
}
