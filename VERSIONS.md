# Versions

What this project runs on, where each version was checked, and what was left alone on purpose. Checked on **2026-11-25**.

## Runtimes and tooling

| Component | Version | Pinned in | Why this one |
| --- | --- | --- | --- |
| Node.js | 26 (floor 24) | `.nvmrc`, `package.json` `engines` | 26 is the Active LTS line and Vercel's default; 24 is the other maintained LTS line, kept in the CI matrix |
| Python (content compiler) | 3.15 (floor 3.13) | `.python-version`, `pyproject.toml` `requires-python` | Newest line in bugfix support; PyYAML 6.0.4 ships cp315 wheels (checked on PyPI) |
| uv | 0.13.10 (local) | — | Runs the compiler from `uv.lock` |
| GitHub Actions | checkout v7, setup-node v7, setup-uv v10 | `.github/workflows/ci.yml` | Latest release tags, looked up with `gh api repos/<action>/releases/latest` |

## Where it was actually run

| What | Result |
| --- | --- |
| Vitest + `next build` on Node 26.13.1 | 15 tests pass; 108 static pages |
| Vitest + `next build` on Node 24.22.3 | 15 tests pass; 108 static pages |
| pytest on Python 3.15.2 | 32 pass |
| pytest on Python 3.13.18 | 32 pass |
| actionlint 1.7.12 on `.github/workflows/ci.yml` | clean |

**Not run:** CI on GitHub (no push), the Vercel deploy with the new headers, browsers other than Chromium.

## Application dependencies

| Package | Locked | Declared |
| --- | --- | --- |
| next | 16.4.6 | ^16.4.6 |
| react, react-dom | 19.3.1 | ^19.3.1 |
| @fontsource-variable/literata, @fontsource/ibm-plex-sans, @fontsource/ibm-plex-mono | 5.3.0 | ^5.3.0 |
| typescript | 6.0.3 | ^6.0.3 |
| eslint / eslint-config-next | 10.15.0 / 16.4.6 | ^10.15.0 / ^16.4.6 |
| vitest, @vitest/coverage-v8 | 5.1.2 | ^5.1.2 |
| @types/node | 26.6.10 | ^26.6.10 |
| markdown | 3.11.4 | >=3.11.4 |
| beautifulsoup4 | 4.15.0 | >=4.15.0 |
| pyyaml | 6.0.4 | >=6.0.4 |
| pytest / ruff | 9.2.0 / 0.17.6 | >=9.2.0 / >=0.17.6 |

The declared floors equal the tested versions, so an upgrade cannot resolve to something this pass did not run.

## Deliberately not upgraded

| Package | Latest seen | Why not |
| --- | --- | --- |
| typescript | 7.0.2 | Next 16.4 supports TS 7 through the `tsc` CLI, but typescript-eslint 8.74 (used by eslint-config-next) supports TypeScript `>=4.8.4 <6.1.0`. Upgrading would break the lint gate. Revisit when typescript-eslint supports 7 |
