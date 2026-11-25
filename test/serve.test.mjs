// Behaviour of the local static server (scripts/serve.mjs) against a throwaway ./out tree.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createStaticServer } from "../scripts/serve.mjs";

let root, server, base;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "fg-serve-"));
  await mkdir(join(root, "08-rag"), { recursive: true });
  await writeFile(join(root, "index.html"), "<p>home</p>");
  await writeFile(join(root, "404.html"), "<p>missing</p>");
  await writeFile(join(root, "08-rag.html"), "<p>part 8</p>");
  await writeFile(join(root, "08-rag", "01-x.html"), "<p>lesson</p>");
  await writeFile(join(root, "site.webmanifest"), "{}");
  server = createStaticServer(root, { "X-Frame-Options": "DENY" });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((r) => server.close(r));
  await rm(root, { recursive: true, force: true });
});

describe("static server", () => {
  it("serves clean URLs for parts and lessons", async () => {
    expect(await (await fetch(`${base}/08-rag`)).text()).toContain("part 8");
    expect(await (await fetch(`${base}/08-rag/01-x`)).text()).toContain("lesson");
  });

  it("answers a malformed percent-encoding with 400 and keeps serving", async () => {
    const bad = await fetch(`${base}/%E0%A4%A`);
    expect(bad.status).toBe(400);
    expect((await fetch(`${base}/`)).status).toBe(200);
  });

  it("never serves files outside the root", async () => {
    const res = await fetch(`${base}/..%2F..%2Fetc%2Fpasswd`);
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("missing");
  });

  it("sends the configured security headers on every response", async () => {
    expect((await fetch(`${base}/`)).headers.get("x-frame-options")).toBe("DENY");
    expect((await fetch(`${base}/nope`)).headers.get("x-frame-options")).toBe("DENY");
  });

  it("types the web manifest correctly", async () => {
    expect((await fetch(`${base}/site.webmanifest`)).headers.get("content-type")).toBe("application/manifest+json");
  });
});

describe("production headers (vercel.json)", () => {
  it("declare a CSP that forbids framing, plugins and foreign scripts", async () => {
    const { productionHeaders } = await import("../scripts/serve.mjs");
    const h = await productionHeaders(join(process.cwd(), "vercel.json"));
    const csp = h["Content-Security-Policy"];
    expect(csp).toMatch(/default-src 'self'/);
    expect(csp).toMatch(/frame-ancestors 'none'/);
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).not.toMatch(/script-src[^;]*\*/);
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("DENY");
  });

  it("returns no headers when the config is missing", async () => {
    const { productionHeaders } = await import("../scripts/serve.mjs");
    expect(await productionHeaders(join(root, "absent.json"))).toEqual({});
  });
});
