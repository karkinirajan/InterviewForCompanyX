// Minimal static server for the ./out export, with clean URLs (/stage -> /stage.html).
// Usage: npm start  [PORT=3000]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve("out");
const PORT = Number(process.env.PORT ?? 3000);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const base = join(ROOT, safe);
  if (!base.startsWith(ROOT)) return null;
  for (const p of [base, `${base}.html`, join(base, "index.html")]) {
    try { if ((await stat(p)).isFile()) return p; } catch { /* try next */ }
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(new URL(req.url ?? "/", "http://x").pathname);
  const target = file ?? join(ROOT, "404.html");
  res.writeHead(file ? 200 : 404, { "Content-Type": TYPES[extname(target)] ?? "application/octet-stream" });
  res.end(await readFile(target));
}).listen(PORT, "127.0.0.1", () => console.log(`Serving ./out at http://127.0.0.1:${PORT}`));
