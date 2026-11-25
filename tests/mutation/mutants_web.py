# Deliberate bugs in the site's pure modules and local server; each must make Vitest fail.
# Run from the repository root (the driver checks the suite is green first; hands off the tree while it runs):
#   python3 tests/mutation/mutate.py tests/mutation/mutants_web.py -- npx vitest run --bail 1
#
# Not listed, because they cannot change behaviour (each was run once and survived):
#  - serve.mjs: removing the "stays inside root" check. The request path always starts with "/", so
#    normalize() resolves every ".." against "/" and join(root, ...) cannot leave root. Kept as defence in depth.

SEARCH = "src/lib/search.ts"
SERVE = "scripts/serve.mjs"

M = [
    # search ranking
    ("search: blank queries are not trimmed", SEARCH, "const q = raw.trim().toLowerCase();", "const q = raw.toLowerCase();"),
    ("search: matching is case-sensitive", SEARCH, "const q = raw.trim().toLowerCase();", "const q = raw.trim();"),
    ("search: an empty query returns everything", SEARCH,
     'if (!q) return index.filter((x) => x.kind === "track");', "if (!q) return index;"),
    ("search: an exact ID gets no bonus", SEARCH, "if (label === q) score += 100;", "if (label === q) score += 0;"),
    ("search: headings get the ID-prefix bonus", SEARCH,
     'else if (label.startsWith(q) && x.kind !== "heading") score += 40;', "else if (label.startsWith(q)) score += 40;"),
    ("search: title matches get no bonus", SEARCH, "if (x.title.toLowerCase().includes(q)) score += 30;", "if (false) score += 30;"),
    ("search: one term is enough", SEARCH, "if (terms.every((t) => x.hay.includes(t))) score += 10;",
     "if (terms.some((t) => x.hay.includes(t))) score += 10;"),
    ("search: non-matches are kept", SEARCH, "else if (score === 0) return null;", "else if (score === -1) return null;"),
    ("search: lessons lose their bonus", SEARCH, "lesson: 8, track: 6, item: 4, heading: 0", "lesson: 0, track: 6, item: 4, heading: 0"),
    ("search: ascending order", SEARCH, ".sort((a, b) => b.score - a.score)", ".sort((a, b) => a.score - b.score)"),
    ("search: the cap grows", SEARCH, "export const MAX_RESULTS = 50;", "export const MAX_RESULTS = 51;"),
    # local server
    ("serve: malformed URLs crash instead of 400", SERVE,
     '      res.writeHead(400, { ...headers, "Content-Type": "text/plain; charset=utf-8" });\n      res.end("Bad request: malformed URL encoding");\n      return;',
     "      throw new Error();"),
    ("serve: security headers are dropped on files", SERVE,
     '{ ...headers, "Content-Type": TYPES[extname(target)]', '{ "Content-Type": TYPES[extname(target)]'),
    ("serve: the manifest is served untyped", SERVE, '".webmanifest": "application/manifest+json"', '".webmanifestx": "application/manifest+json"'),
    ("serve: production headers come from the wrong rule", SERVE, 'h.source === "/(.*)"', 'h.source === "/"'),
    ("serve: directories count as files", SERVE, "isFile()) return p", "isDirectory() || true) return p"),
]
