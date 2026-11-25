---
title: Story bank
level: 1
summary: Eleven reusable stories in STAR shape (situation, task, action, result, lesson) covering RAG, failures, guardrails, measurement, performance, ownership and AI coding tools.
outcomes:
- Tell any story in two minutes in STAR shape
- Pick the right story for a question in seconds
- Build your own bank with the same structure
keypoints:
- 'STAR+L: situation, task/action, result, **lesson**, in two minutes.'
- Aim for 8–12 stories covering builds, failures, disagreement, mistakes, ambiguity, performance, learning and helping others.
- 'Signature lessons: "model chooses, code computes", "generic errors hide outages", "measure retrieval and generation separately".'
- Fill every `[fill]`. A smaller true story beats a bigger invented one.
projects:
- name: Story bank app
  stack:
  - Next.js
  - Postgres
  - tags
  build: Store stories tagged by competency and question type, then pick a random question and get suggested stories, with a timer.
  practises: Fast retrieval of the right story.
- name: Story-to-question matrix
  stack:
  - Google Sheets or Airtable
  build: A matrix of stories against the 20 most common behavioural questions, ensuring every row has a strong story.
  practises: Coverage of the behavioural space.
---

## Why this matters

Behavioural and project questions ("tell me about a time…", "what broke?", "describe a challenge") are answered with stories. Preparing a bank in advance means you pick, not invent, under pressure.

**Format:** *When to use · Situation · Action · Result · Lesson.* Items marked **[fill]** are facts only the author knows; fill them or leave that part out. A smaller true story beats a bigger invented one.

These are the casebook author's stories. Use them as models for your own.

<a id="s1"></a>

## S1 · A production RAG system ([P3](#p3))

- **Use for:** "describe a RAG pipeline", retrieval quality, evals, graphs.
- **S:** financial questions are temporal and multi-hop; vectors flatten time and relationships.
- **A:** temporal knowledge graph (Graphiti + FalkorDB) for who-relates-to-whom-and-when; Qdrant for similar text; ColBERT to re-rank; six Pydantic entity types, with extracted entities cross-checked against the graph; Langfuse traces; RAGAS + DeepEval regression suites gating changes. **[fill]** your components.
- **R:** **[fill]** what improved, and how you knew.
- **Lesson:** "Retrieval and generation fail differently, so I measure them separately."

<a id="s2"></a>

## S2 · What broke: the model that didn't exist ([P2](#p2))

- **Use for:** "what broke in production", error design, observability.
- **S:** SmartClaim's first version requested a model named `"LLM"`. Every evaluation failed. The UI showed one message for every failure: "free tier has reached capacity". **[confirm]** whose version and whether users hit it.
- **A:** made the model a setting; mapped failures to distinct codes (401, 422, 429 with `Retry-After`, 502 for model failure or refusal, 503 for quota or missing key) with a distinct UI message each; validated the body (46 known fields, size limits) instead of pasting raw JSON into the prompt; turned off provider storage; moved drafts from `localStorage` to `sessionStorage`; removed HIPAA claims the code didn't support.
- **R:** failures are now diagnosable from the status code alone; 416 tests, 90 of 90 seeded defects caught.
- **Lesson:** "A generic error message is an outage you can't see. Every failure class gets its own name."

<a id="s3"></a>

## S3 · Two findings from an operator console ([P6](#p6))

- **Use for:** "what broke", prompt injection, frontend collaboration.
- **Say:**

> "On Pilot I was the frontend contractor: I built the operator console with the live feed, trace drawer and Claude chat. Two production issues came through my work. When a name match failed, the entity resolver didn't fall back to the customer's linked email, so records didn't resolve to the right customer, with real client money involved; I flagged it as critical. And instructions embedded in Slack tool results kept appearing in sessions; I flagged those repeatedly. The lesson I now design around: tool output is data, never instructions, and authorization lives outside the model."

- **[fill]:** how you noticed each; what the team did.
- **If asked how to fix the resolver:** a deterministic ladder: exact ID → linked email or phone → fuzzy name above a threshold → human review. Never auto-link on low confidence. Log every resolution with its confidence.

<a id="s4"></a>

## S4 · Fencing the model in: segment numbers, not seconds ([P1](#p1))

- **Use for:** "a challenge integrating AI", guardrails, hallucination.
- **S:** clip finding needs exact cut points. Ask a model for timestamps and it will invent plausible ones, and cut mid-word.
- **A:** cut the transcript into numbered segments at sentence ends and pauses; the model may only answer with first and last segment numbers; bound and check every number; clean every string; keep the raw paid reply; split paid `propose` from free, deterministic `select`.
- **R:** a hallucinated timestamp is structurally impossible; rules can be retuned without paying the model again.
- **Lesson:** "Let the model choose; let code compute." Same idea in [P5](#p5) (category derived from score) and [P9](#p9).

<a id="s5"></a>

## S5 · Measure before you build ([P1](#p1))

- **Use for:** evals, "how do you know it works", QA conversations.
- **A:** built the measurement layer first: WER/CER over grapheme clusters, script correctness, word-timing error, clip precision/recall/acceptance at k; golden-set manifests with consent and a private holdout; two annotators plus adjudication; every metric mutation-checked because "a wrong metric silently ruins every decision built on it".
- **R:** mutation checks found real defects in the code itself (including a stale-bytecode flaw in the mutation driver).
- **Lesson:** "A passing test suite only proves the tests pass, not that they can fail."

<a id="s6"></a>

## S6 · Performance: 72% lower API latency

Verified mechanism: **async FastAPI and Redis redesign** (the CV adds batching and query tuning). Prepare the metric defense ([12.5](/12-career-and-interviews/05-technical-interview-playbook)): baseline, measurement, mechanism, your share. Never say only "I used Redis"; name the bottleneck and why the change removed it.

<a id="s7"></a>

## S7 · Scale: 12,000 RPM at 99.99% uptime

Zero-downtime Django monolith → microservices migration. Prepare: how traffic was cut over, data consistency during the split, what you monitored, the rollback plan. **[fill each]**

<a id="s8"></a>

## S8 · End-to-end ownership ([P1](#p1) or [P7](#p7))

> "reelslicer goes from ADRs to a live deploy: FastAPI and FFmpeg on EC2 behind Nginx and systemd, a private encrypted S3 bucket with a least-privilege role, the Next.js studio on Vercel, CI on every push, protected staging and production branches."

Alternative: the RevOps platform, where a shadow XGBoost model is promoted only on evidence.

<a id="s9"></a>

## S9 · AI coding assistants, with gates

> "I use coding agents heavily, and I run them like a team: in reelslicer, an orchestrator session plus six specialist agents (frontend, backend, QA, security, SEO, production reviewer), each owning a set of paths so two never edit the same file, with contracts written before parallel work starts. Nothing merges without lint, strict mypy, 1,435 tests and mutation checks. Across my older repos I ran a modernization pass the same way, and each repo has a `work-done.md` listing what was **not** verified. Agents make me faster; the gates are what make the output mine."

Be ready to explain any file an interviewer opens. "An agent wrote it" isn't an answer; "I specified it, reviewed it and gated it" is.

<a id="s10"></a>

## S10 · Many vendors, one interface ([P1](#p1), [P10](#p10))

> "reelslicer talks to five speech vendors through one command that plans first and sends nothing without consent and a flag; transcribeX does the same across AssemblyAI, Deepgram, OpenAI and local Whisper, normalizing every input to 16 kHz mono first. The adapter hides transport, not semantics: word timings, chunk timings and diarization differ per vendor, so the interface says which ones it has."

<a id="s11"></a>

## S11 · Ambiguity and client communication

**[fill]** one real story: what they asked for, what you did instead, what happened. A smaller true story beats a bigger invented one.

## Build your own bank

Aim for 8–12 stories covering: a system you built end to end; something that broke; a disagreement; a mistake; ambiguity; a performance or scale win; learning something fast; mentoring or helping a teammate; a trade-off between speed and quality. Write each in the format above, with a one-line lesson.

## Check yourself

<details markdown="1"><summary>Which story answers "tell me about a challenge integrating AI", and what's its lesson?</summary>

[S4](#s4) (or [S2](#s2)): constraining the model to segment numbers so timestamps can't be invented. Lesson: "Let the model choose; let code compute."

</details>

## What comes next

[12.4 Behavioural and culture](/12-career-and-interviews/04-behavioral-and-culture).
