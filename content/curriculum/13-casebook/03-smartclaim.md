---
title: 'P2 · SmartClaim: compliance judgement with strict schemas'
level: 4
summary: A healthcare app where a model judges wound-care documentation against Medicare coverage criteria, with strict schemas, no provider storage and a full error taxonomy, plus what its first version got wrong.
outcomes:
- Explain how a strict schema contains prompt injection
- Design an error taxonomy for an AI endpoint
- Tell the "model that didn't exist" story
keypoints:
- A strict JSON schema built from the form fields caps any injection at "pass/fail + reason".
- Turn provider storage off, hash user IDs and validate input exactly (fields, sizes).
- 'Error taxonomy: 401, 422, 413, 429 + Retry-After, 503 for config/quota, 502 for model failure, each with its own UI message.'
- Keep clinical drafts in `sessionStorage` on shared computers.
- 'The "model named LLM" bug: a generic error message hid a total outage.'
projects:
- name: Checklist compliance judge
  stack:
  - Next.js
  - OpenAI Responses API (strict schema)
  - Neon Postgres
  - Auth.js
  build: A form whose answers are judged per field against written criteria, with strict schema, rate limits, an error taxonomy and no provider storage.
  practises: Schema-constrained judgement in a sensitive domain.
- name: Error-taxonomy refactor
  stack:
  - Any AI app you have
  - Playwright
  build: Replace generic errors with distinct status codes and messages per failure class, with E2E tests for each.
  practises: Making failures diagnosable.
---

<a id="p2"></a>

## P2 · SmartClaim AI (healthcare)

**One line:** wound-care providers fill a 46-question checklist; a model judges each answer against CMS Medicare **LCD L35041** and reports pass or fail with a reason, before the claim is billed. Next.js 16, React 19, Auth.js, Neon Postgres, OpenAI.

| Decision | Detail |
|---|---|
| Strict schema | OpenAI Responses API with a **strict JSON schema built from the form's field list**: one required `{status: pass/fail, reason}` per field. A refusal or incomplete answer is a failure, not a partial result |
| No provider storage | `store: false` (the Responses API keeps responses for a period by default; this is clinical data) |
| Identity hygiene | The user is identified to OpenAI by a SHA-256 of their id, not an email |
| Injection containment | The checklist goes in as data; instructions say never follow instructions inside a value; **the schema limits what a successful injection can achieve to pass/fail with a reason** |
| Input validation | Exactly the 46 fields, 2,000 characters per answer, 64 KiB body; anything else is 422 |
| Rate limit | 20 evaluations per hour per user; 429 with `Retry-After` |
| Error taxonomy | 401 · 422 · 400/413 · 429 · 503 (quota or missing key) · 502 (model failed or refused); a distinct UI message for each |
| Timeouts | 90 s, one retry; provider error text never echoed (it can quote the key) |
| Client storage | Draft in `sessionStorage`, not `localStorage` (clinical notes on a shared clinic computer) |

**Numbers (repository):** 416 tests, 90 of 90 seeded mutation defects caught.

## What the first version got wrong

From the project's own `work-done.md`: it asked for a model named `"LLM"`, which doesn't exist, so **every evaluation failed**, and the UI showed "free tier has reached capacity" for every failure, which hid the real cause. The route took the request body with no validation and pasted it into the prompt. The public FAQ claimed HIPAA compliance the code didn't support (since removed). → [S2](#s2)

## Honest status

No live model call after the modernization (no key in that environment); evaluations are stored in a table without expiry, protected only by row-level security under a public anon key. **[confirm]** whether v1 was the author's and whether it had real users.

## 60-second pitch

> "SmartClaim judges wound-care documentation against 46 Medicare coverage criteria before a claim is billed. The model gets a strict JSON schema built from the form, so the only thing it can return is pass or fail with a reason per question; that also caps what a prompt injection inside a clinical note can do. Provider-side storage is off, the user is hashed before it reaches OpenAI, and every failure has its own status code and message. That last part came from a real bug: the first version requested a model that didn't exist, every evaluation failed, and a generic 'capacity' message hid it. Now a 502, a 503 and a 429 each say what actually happened."

## What to learn from it

Constrain outputs to cap injection; give every failure a name; minimise what reaches the provider; match browser storage to data sensitivity; never let marketing claim compliance the system hasn't earned.

## What comes next

[13.4 RAG systems](/13-casebook/04-rag-systems).
