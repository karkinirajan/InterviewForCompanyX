# Work done: InterviewForCompanyX (engineering field guide)

Done on 2026-11-25 on the local branch `chore/modernize`. Nothing has been pushed, published or deployed.

## At a glance

| | Before | After |
| --- | --- | --- |
| Lint gate | none | ESLint (Next Core Web Vitals + TypeScript), warnings fail; ruff for Python |
| Tests | none (the compiler's own build gates only) | 15 Vitest + 32 pytest, including a golden compile of the real curriculum |
| Statement coverage (Vitest, `src/lib/**` + `scripts/serve.mjs`) | none | 60.6% (search and server covered; `content.ts` data loading and `storage.ts` not unit-tested) |
| Mutation checks | none | 19/19 compiler + 16/16 web mutants killed (one survivor found and fixed by a new test) |
| Dependency advisories (`npm audit`) | 0 | 0 |
| Python dependencies | unpinned `uv run --with …` | `pyproject.toml` + `uv.lock` |
| CI | none | GitHub Actions: Python 3.13/3.15 and Node 24/26 |
| Security headers | none | CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS (vercel.json, mirrored by the local server) |

## What was wrong, and what changed

| Area | Found | Change |
| --- | --- | --- |
| Local server | A malformed percent-encoded URL (`/%E0%A4%A`) threw an unhandled `URIError` and **killed the server**; every later request failed | Returns 400 and keeps serving; read errors return 500. Test: `test/serve.test.mjs` "answers a malformed percent-encoding with 400 and keeps serving" |
| Deployment exposure | No CSP or framing protection on the site | Headers in `vercel.json`; `npm start` applies the same headers, and a browser pass showed no CSP violations. Guard test checks the CSP keeps `frame-ancestors 'none'`, `object-src 'none'` and no wildcard scripts |
| Local server | `.webmanifest` and `.woff` were served as `application/octet-stream` | Correct types; test |
| Content compiler | The final summary line crashed (non-zero exit after writing everything) when the output folder was outside the repository | Prints an absolute path instead; found by the golden test |
| Content compiler | Problems from a previous `main()` call carried into the next | Reset at the start of each run |
| React | Seven lint errors: state copied into effects (route resets, palette reset, sidebar expansion) and a variable mutated during render in the tech map | Rewritten as state adjusted during render and precomputed phase offsets. The two localStorage hydration loads and the timer's clock reaction keep their effects, with a one-line reason on each disable |

## How it was checked

| Check | Result |
| --- | --- |
| `npm ci && uv sync --locked`, then `npm run check` (content, eslint, ruff, tsc, vitest, pytest, build) | exit 0 |
| `npm run mutation` | 19/19 and 16/16 killed |
| Equivalent mutant (server "stays inside root" check removed) | ran once, survived as predicted: the path always starts with `/`, so it can't escape; kept as defence in depth, documented in `tests/mutation/mutants_web.py` |
| Node 24.22.3 (nvm) | 15 tests, build OK |
| Python 3.13.18 | 32 tests pass |
| `actionlint` 1.7.12 (via `uvx --from actionlint-py`) | clean |
| `npm audit --audit-level=high` | 0 vulnerabilities |
| Secret scan (count-only: 8 patterns, tree and full history) | scan clean, patterns listed in the QA notes; no risky file names ever committed |
| Browser pass (Chromium, Playwright) under the production CSP | no CSP violations on home, lesson, route and tech-map pages; fonts load; search and previews work; no horizontal overflow at 640/768/1024/1280/1536 px |
| Contrast (computed colours, both themes) | all text pairs ≥ 4.93:1 |

## Not checked

- CI on GitHub (nothing pushed). The workflow was linted and each step run locally.
- The Vercel deploy with the new headers. On first deploy, open the site and check the browser console for CSP violations.
- The actionlint Docker image: Docker could not mount overlay storage on this machine (kernel/driver issue). The PyPI build of the same tool was used instead.
- Safari and Firefox.

## Decisions for you

1. **TypeScript 7 held back** until typescript-eslint supports it (see VERSIONS.md).
2. **CSP allows `'unsafe-inline'` scripts and styles.** A static Next.js export inlines its bootstrap data and the theme script; a nonce needs a server. Tightening it means moving off static export or hashing each inline script at build time.
3. **Share-image URLs** use `SITE_URL`, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. Set `SITE_URL` if the site moves to a custom domain.
4. **The site is `noindex`** (personal reference). Remove `robots` in `src/app/layout.tsx` if you want it in search engines.
5. **Nothing is pushed.** To publish: `git push -u origin chore/modernize`, then merge into `main`.
