---
title: P0, P6, P7, P10–P13 · Product, voice and full-stack work
level: 3
summary: An AI ops console, a lead-scoring platform with a shadow model, a voice stack, a daily news product, backend rescues, a browser extension and a router demo, each with the pattern worth reusing.
outcomes:
- Reuse the patterns from each project in your own work
- Scope claims precisely to your role
- Use production-hygiene details as interview evidence
keypoints:
- '**P6:** scope claims to your role. Frontend console plus two findings (resolver fallback, Slack injection).'
- '**P7:** a shadow model before promotion, refusal of placeholder secrets, encrypted CRM tokens, URL checks.'
- '**P10:** multi-vendor audio normalised to 16 kHz mono; evidence-based vendor choice.'
- '**P12:** sanitise output, audit without values, confirm exact side effects.'
- '**P0:** featured claims without inspectable code invite the hardest questions.'
projects:
- name: Lead scoring with shadow model
  stack:
  - FastAPI
  - Postgres
  - XGBoost
  - HubSpot sandbox
  - Docker Compose
  build: Score leads with a transparent formula live and an ML model in shadow, with a promotion dashboard comparing them on outcomes.
  practises: Safe rollout of learned models.
- name: Ops console for an AI assistant
  stack:
  - Next.js
  - SSE
  - Postgres
  - an LLM API
  build: A live feed of assistant decisions with a trace drawer and a chat panel, highlighting tool results that look like injected instructions.
  practises: Operator UX and injection visibility.
---

<a id="p6"></a>

## P6 · Pilot: AI ops console (frontend contractor)

- **Role:** frontend contractor. Built the **Next.js operator console**: live feed, trace drawer, Claude chat, for an assistant that triages email, Slack and calendar events as ALERT, DRAFT or NOTHING.
- **The product:** an AI field-service copilot pulling in Gmail, Slack, call transcripts, QuickBooks and Acuity bookings into customer/job entity resolution, with **Zep** as its memory layer. Console stack: Next.js 16, TypeScript, PostgreSQL, Claude.
- **Two findings:** the entity resolver didn't fall back to the linked email when a name match failed, with client money involved (flagged as critical); **prompt injection embedded in Slack tool results**, flagged repeatedly.
- **Scope rule:** claim the console and the findings only, not backend ownership or the fixes. → [S3](#s3)

<a id="p7"></a>

## P7 · RevOps lead scoring platform

- **What:** scores B2B leads from usage and engagement signals into HOT, WARM, COOL, COLD. A transparent formula is always live; an **XGBoost model scores in shadow** and is promoted only when its accuracy is trusted. A **score simulator** shows how a lead's score would change as signals change.
- **Stack:** Python, FastAPI, Celery workers, PostgreSQL, Redis, SQLAlchemy + Alembic, Typer CLI, Next.js 16 frontend.
- **Integrations:** HubSpot (batch sync out, signed deal-won webhook in), Salesforce (OAuth), outbound webhooks with signatures and retries, S3-compatible raw imports, per-lead AI report.
- **Production hygiene:** refuses to start with placeholder secrets; encrypts stored CRM tokens; keeps tokens out of the browser; **checks every URL it calls on a user's behalf**.
- **Numbers (repository):** 810 API tests, 528 of 528 mutants caught. Docker Compose: Postgres, Redis, API, worker, scheduler, web.
- **Use for:** ownership ([S8](#s8)), safe rollout ("shadow model = canary for prompts", [Q15](#q15)), secrets ([Q30](#q30)).

<a id="p10"></a>

## P10 · Voice stack: transcribeX, ttstt, CBT coach

| Project | What | Pattern |
|---|---|---|
| **transcribeXplatform** | Transcription with speaker identification and AI summaries across **AssemblyAI, Deepgram Nova-3, OpenAI and local Whisper**; every input normalized to 16 kHz mono WAV with ffmpeg; CLI, web app and an Electron desktop app with bundled installers | Multi-provider audio adapters |
| **ttstt** (VoiceTech radar) | Comparison platform for TTS and STT providers: leaderboard, recommendation wizard, TCO calculator; 215 Vitest tests, 108 mutation checks | Vendor selection on evidence |
| **CBT recovery coach** (therapist.kneeraazon.com) | FastAPI + Next.js; SQLAlchemy 2 async + Alembic; Argon2id; rotating refresh JWT cookies; **Gemini + ElevenLabs voice** over a **FastAPI WebSocket** authenticated by short-lived, single-use tickets (Next.js route handlers can't hold the socket, so it runs on the API); 210 API tests | Sensitive-domain voice AI with real auth; WebSockets done safely |

→ [Q39](#q39), [S10](#s10)

<a id="p11"></a>

## P11 · EkJhalak: bilingual news briefings (own, runs daily)

Next.js 16, TypeScript, RSS, **Groq API**, Supabase. Ingests public RSS from Nepali and international outlets, deduplicates coverage, generates labeled Nepali and English summaries and translations. **Not RAG.** Use for ownership and operating-cost discipline on something you run yourself.

<a id="p12"></a>

## P12 · Backend rescues and safety-critical patterns

| Project | Pattern worth quoting |
|---|---|
| **Clarity** (Django 5.2 + DRF, Nuxt 4) | Optional OpenAI helper drafts descriptions; **descriptions sanitized on the way out** so editor markup can't run script (OWASP "improper output handling"). Rescued from a Django 4.1 repo with committed secrets and DEBUG on |
| **Kruxova** (DRF, Celery) | **Audit trail of authenticated writes that records route, method and field names, never tokens, cookies or values**: PHI-style log hygiene. Rebuilt from a codebase that exposed its user table |
| **Delta hedging** (Flask, IG demo API) | Refuses to start against anything but the demo environment; places an order **only when hedging is on and the request confirms the exact previewed order**: the human-confirmation pattern for side effects. 532 tests |
| **MeroHealth** (Django) | Healthcare platform backend: accounts with email verification, social login, lab registration, safe `?next=` redirects |

<a id="p13"></a>

## P13 · Nestpane (Chrome Web Store)

Local-first new-tab workspace (Manifest V3), published on the Chrome Web Store, GPL-3.0. The browser's real bookmarks, Markdown notes, tasks, focus timer, habits, journal; command palette with optional AI answers; Google Drive backup with optional passphrase encryption (AES-GCM via the **Web Crypto API**); 158 tests, zero runtime npm dependencies. Use when asked about shipping a product to real users.

<a id="p0"></a>

## P0 · Deterministic LLM Router (portfolio feature)

- **As described on the portfolio site:** routes prompts across OpenAI, Anthropic and local weights; structured schemas; automatic fallback; p99 18.0 ms and 3.8K tok/s quoted; diagram nodes ASGI, Deterministic, Hybrid, PostgreSQL, Redis.
- **Be ready to explain:** where the code lives (it isn't in a public repository); that an 18 ms figure can only be routing overhead, never model latency, and on what load it was measured; what 3.8K tok/s measures; whether it served real traffic.
- **Safe phrasing:** "The routing decision adds p99 18 ms before inference; the model call itself is separate."
- **Lesson:** a featured claim without inspectable code invites the hardest questions. Prefer featuring work people can open.

## What to learn from these

Shadow models before promotion; sanitise output; audit without values; confirm exact side effects; refuse unsafe configuration at startup; scope claims to your role.

## What comes next

[13.7 Web platforms and finance tools](/13-casebook/07-web-platforms-and-finance-tools).
