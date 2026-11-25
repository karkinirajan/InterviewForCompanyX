<a id="part0"></a>

## Part 0 · Countdown plan

Framed as loops with gates, not a timetable. Fail a gate, repeat the loop.

| Window | Loop | Gate to pass |
|---|---|---|
| **Mon evening** | Work through [R1](#r1) to [R14](#r14). Fix the documents that need fixing (resume, LinkedIn, GitHub profile README, live sites). Decide the answers marked **[decide]** | Every public document states the same dates, degree and numbers. You can say your career timeline in one breath |
| **Tue morning** | [Part 4](#part4) dossiers P1, P2, P3, P6 aloud; then [S1](#s1) to [S5](#s5) | Each dossier's 60-second pitch, no notes, every number defensible |
| **Tue afternoon** | [Part 8](#part8), [D1](#d1) and [D4](#d4) on paper, type [C1](#c1) from memory | D1 drawn in 5 minutes with three failure modes named before anyone asks |
| **Tue evening** | [Part 13](#part13) mock drill, recorded | 32 of 40 or better; redo every zero |
| **Wed morning** | [Part 15](#part15) cheat sheet, intro twice, [Part 14](#part14) logistics | Logged in by 12:50 |

<a id="part1"></a>

## Part 1 · Red flags: fix or prepare before Wednesday

Leapfrog's interviews follow your resume closely, candidates report that interviewers opened their GitHub before the call, and the hiring process includes a reference check. So the dangerous questions aren't about RAG. They're about **inconsistencies between your own documents**. Severity: 🔴 fix the documents, 🟠 prepare a precise answer, 🟡 minor.

| ID | Sev | Issue | Evidence | Action |
|---|---|---|---|---|
| <a id="r1"></a>**R1** | 🔴 | **Career dates disagree across your sources** | Resume: Food and Beverage Nepal Feb 2018-Feb 2019 · Merohealth Jan 2019-May 2021 · Pathway Aug 2020-Sep 2022 · Upwork Nov 2021-present. Your own notes: Merohealth Jan 2020-May 2021 · Pathway Sep 2021-Sep 2023 · full-time freelancing from Oct 2023. Git: `FoodandBeverage` first commit Jan 2020; `merohealth` first commit Dec 2020. The resume also has three roles overlapping in 2020-2021 while university ran to 2021 | **[decide]** the true dates. Make resume, LinkedIn, kneeraazon.com and Upwork identical. If roles overlapped, have the one-line reason ready (part-time, remote, contract), only if true. See options below |
| <a id="r2"></a>**R2** | 🔴 | **Education line** | Resume: "Bachelor of Engineering, Electronics and Communications, Tribhuvan University (IOE), Pokhara, 2016-2021". Your notes: four years of Computer Engineering, degree not completed | A degree title with an end date reads as completed. If it wasn't, this is the line most likely to end an offer at background check. Write it as it is, for example "Electronics and Communication Engineering, IOE Pokhara, 2016-2020, not completed", and fix the field if the notes are right |
| <a id="r3"></a>**R3** | 🟠 | **41% LLM cost cut** | On resume and homepage. Your Nov 2026 proposal fact base marks it retired and unverified | **[decide]**: defend it (baseline, period, mechanism: embedding cache + semantic dedup, measurement) or stop leading with it. Never improvise a mechanism. See [M-table](#m-table) |
| <a id="r4"></a>**R4** | 🟠 | **Deterministic LLM Router** is the only featured project on kneeraazon.com (p99 18.0 ms, 3.8K tok/s) | No such repo among your 88 GitHub repos | Know where it lives and why it isn't public. 18 ms can only be routing overhead, never model latency. Know whether 3.8K tok/s is a benchmark. See [P0](#p0) |
| <a id="r5"></a>**R5** | 🟠 | **deterministic-quantitative-routing**: v1 of this guide said "the model maps a question to one of 6 indicators" | Your own README: the router is `MockSemanticRouter` (keywords), the data is a mock random walk | Claim it as a **prototype of the routing layer**: protocol plus mock, six real indicators, composition, stability loop with a circuit breaker. See [P9](#p9) |
| <a id="r6"></a>**R6** | 🟠 | **automated-trading provenance** | The first commit (Apr 2026) landed a complete multi-model codebase in one go, followed by "Streamline README for solo dev" | If it began as someone else's open-source project, credit it in the README and say so in the room. Your own work is the Nov 2026 modernization. See [P8](#p8) |
| <a id="r7"></a>**R7** | 🟠 | **The Oct-Nov 2026 modernization wave** | Most public repos got `work-done.md`, `VERSIONS.md` and mutation tests in the same weeks; reelslicer's `CLAUDE.md` names Claude Code as orchestrator with six agents | Own it as the JD's desirable "AI coding assistants" skill ([S9](#s9)). Be able to explain any file they open. "An agent wrote it" isn't an answer; "I specified it, reviewed it and gated it" is |
| <a id="r8"></a>**R8** | 🟡 | GitHub profile README says **"Django 6 LTS"** | Django 6.0 isn't LTS (5.2 is; the next LTS is 6.2). Your repos actually run Django 5.2 LTS | Fix the line tonight. A Django interviewer will notice |
| <a id="r9"></a>**R9** | 🔴 | **SmartClaim's public pages** | Your own `work-done.md` says the FAQ and footer claim "HIPAA compliant", "HIPAA Data Practices" and "deterministic", which the code doesn't support | If smartclaimai.vercel.app still says it, remove it before Wednesday. A healthcare company will check. Then it becomes a strength: [S2](#s2) |
| <a id="r10"></a>**R10** | 🔴 | **Pilot scope** | You held the frontend contractor role | Claim the console and your two findings only. See [P6](#p6), [S3](#s3) |
| <a id="r11"></a>**R11** | 🔴 | **The Nov 2026 AI-agent audit** (in two earlier drafts) | Ari picked another consultant on 11 Nov | Never mention it as work done |
| <a id="r12"></a>**R12** | 🟠 | **"Never run live" items** | reelslicer: vendor adapters and `propose` never run against a real vendor; golden set empty. SmartClaim: no live model call after the modernization | Say it precisely before they find it. It reads as rigor, not weakness. See [P1](#p1), [P2](#p2) |
| <a id="r13"></a>**R13** | 🟡 | **Project count** | Resume and homepage: 80+ projects, 75+ clients. Upwork: 108 jobs. Older drafts: 104+ | **[decide]** one number for Wednesday. The resume is the document in their hands |
| <a id="r14"></a>**R14** | 🟡 | **reelslicer mutation count** | README says 754 deliberate bugs caught, but its parts (241 + 35 + 475) sum to 751; the kanban says a combined run caught 466 of 466 | Know which run you quote. Fix the README sum |

**Options for R1 and R2** (they already hold the CV you applied with):

| Option | How | Trade-off |
|---|---|---|
| **A. Send a corrected CV now** | Short email to the recruiter today: "I've corrected my education and employment dates; please use this version." | Cleanest. A small awkwardness now instead of a large one at reference check |
| **B. Correct it at the start of the CV walkthrough** | "Before we go through it: two dates on the CV you have are wrong, here's the accurate version." | Shows integrity in the room; depends on them reaching the CV |
| **C. Leave it** | Nothing | Not recommended. The process includes a reference check, and Kathmandu's tech community is small |

<a id="part2"></a>

## Part 2 · The role, decoded

**Jump:** [JD map](#jd) · [Requirements](#part2) · [Screening questions](#screening)

**Thesis:** the role builds the connective tissue between LLM APIs, product systems and users. It's explicitly **not model training**: it integrates, orchestrates and deploys AI into production software, reliably, securely and at scale. The JD also says you'd work with engineers in Nepal, the US and Europe **on healthcare products**.

<a id="jd"></a>

### 2.1 Responsibilities (JD) → where your proof lives

| # | Responsibility | Proof | Questions |
|---|---|---|---|
| J1 | Integrate Claude, GPT, Bedrock, Gemini | [P1](#p1) Gemini + 5 speech vendors · [P2](#p2) OpenAI Responses API · [P5](#p5) Gemini · [P6](#p6) Claude chat UI · [P8](#p8) 5 model families | [Q11](#q11), [Q18](#q18) |
| J2 | RAG: ingestion, chunking, vector store, retrieval tuning | [P3](#p3) Qdrant + ColBERT + KG · [P4](#p4) Pinecone + Cohere Rerank | [Q1](#q1) to [Q10](#q10) |
| J3 | Agentic workflows (AgentCore, LangChain, LlamaIndex, custom) | [P8](#p8) LangGraph + FastMCP · [P9](#p9) routing prototype | [Q31](#q31) to [Q35](#q35), [Part 8](#part8) |
| J4 | Prompt engineering, versioning, evaluation | [P1](#p1) prompt version + SHA-256 fingerprint pinned by a test · [P3](#p3) RAGAS/DeepEval | [Q20](#q20) to [Q24](#q24) |
| J5 | Guardrails: validation, filtering, fallback | [P1](#p1) segment numbers only, untrusted text both ways · [P2](#p2) strict schema · [P5](#p5) injection-aware | [Q25](#q25) to [Q30](#q30) |
| J6 | Monitor latency, cost per query, drift, tokens | [P3](#p3) Langfuse · resume metrics [M-table](#m-table) | [Q36](#q36) to [Q38](#q38) |
| J7 | Work with frontend to surface AI | [P1](#p1) Next.js studio · [P6](#p6) Pilot console · [P2](#p2) wizard with per-error messages | [Q43](#q43) |
| J8 | Own the AI layer across the SDLC | [P1](#p1) ADRs → CI → EC2 + Vercel deploy · CI/CD 2 days → 2 hours | [D4](#d4) |

### 2.2 Requirements and desirables

| Requirement | Verdict | Proof |
|---|---|---|
| 3+ years backend/full-stack, API design | ✅ | 12K RPM Django platform; FastAPI across [P1](#p1), [P4](#p4), [P7](#p7) |
| Production LLM integration (not prototypes) | ✅ | [P3](#p3) (subcontract, production), [P1](#p1) (live studio; vendor calls not yet run: [R12](#r12)) |
| Python and/or TypeScript | ✅ | Python primary; Next.js 16 and TypeScript in [P1](#p1), [P2](#p2), [P10](#p10) |
| RAG with Pinecone / Weaviate / pgvector | ✅ | Pinecone [P4](#p4), Qdrant [P3](#p3), pgvector in stack |
| Prompting: system, few-shot, CoT, structured output | ✅ | [P2](#p2), [P1](#p1) |
| API security, rate limiting, LLM cost | ✅ | [P2](#p2) 20/hour + Retry-After; [P1](#p1) SSRF guard; [P7](#p7) signed webhooks |
| AWS or another cloud | ✅ | [P1](#p1) EC2 + S3 + IAM; ECS/RDS history; 35% rightsizing |

| Desirable | Verdict | Proof |
|---|---|---|
| AgentCore, LangChain, LlamaIndex, CrewAI, AutoGen | ⚠️ Partial | LangChain, LangGraph ✅ ([P8](#p8)); AgentCore: fluency ([Part 8](#part8)) |
| Multimodal (vision, audio) or tool use | ✅ | **Audio is a real strength**: [P1](#p1), [P10](#p10). Tool use: [P8](#p8) |
| Fine-tuning concepts | ✅ | [Q40](#q40) |
| AI coding assistants | ✅ | [S9](#s9): six-agent workflow with mutation-tested gates |

<a id="screening"></a>

### 2.3 The 12 screening questions (likely re-asked live)

| # | Question | Anchor |
|---|---|---|
| 1 | Years of ML experience | Applied, not training. Your one trained model: the shadow XGBoost scorer ([P7](#p7)) |
| 2 | Integrated LLM APIs into production? | Yes: [P3](#p3), [P2](#p2), [P1](#p1) |
| 3 | Which APIs, for what | OpenAI (compliance judgment), Gemini (clip finding, CV screening), Claude (ops console chat), Groq (news summaries), ElevenLabs, AssemblyAI, Deepgram, Sarvam, Chirp (speech) |
| 4 | Architecture, reliability, what broke | [S2](#s2), [S3](#s3), [Q12](#q12) |
| 5 | A RAG pipeline you built, your role | [S1](#s1), backup [P4](#p4) |
| 6 | One sentence on LLM reliability | Below |
| 7 | Cloud platforms | AWS ([P1](#p1)), Vercel, Cloudflare; Docker everywhere |
| 8 | Prompt quality and consistency | [Q20](#q20), [Q21](#q21) |
| 9 | Cost and latency factors | [Q37](#q37), [Q38](#q38) |
| 10 | A challenge integrating AI | [S4](#s4) or [S2](#s2) |
| 11 | Notice period | **[decide]** |
| 12 | Referral | Optional |

> **The one sentence:** "I treat every model call as an unreliable dependency: a typed schema checked on every reply, retries only for transient errors with `Retry-After` honored, timeouts and a fallback path that's actually tested, and evals plus tracing so I see quality move, not just uptime."

**Re-read what you submitted.** If any form answer came from the Qwen draft (DLQ story, EkJhalak as RAG), open with a correction: "Let me be more precise than my form answer."

<a id="part3"></a>

## Part 3 · Leapfrog, verified

**Jump:** [Facts](#part3) · [Products](#lf-products) · [Interview format](#lf-process) · [Why Leapfrog](#why-leapfrog)

### 3.1 Facts

- **Founded 2010.** Founders Himal Karmacharya (President) and Chandika Bhandari. **CEO: Chris Sprague.** HQ Seattle; engineering in Kathmandu (Dillibazar, Charkhal). 201-500 people.
- **AWS:** Advanced Tier Services Partner with AI and DevOps competencies; Leapfrog's LinkedIn says it holds both the **Generative AI** and **Agentic AI Consulting** competencies.
- **Domain:** digital health (patient engagement, clinical workflow, revenue cycle), plus education and other regulated work.
- **Values:** customer focus · accountable freedom · being remarkable · celebrating efforts · embracing openness.

<a id="lf-products"></a>

### 3.2 What they ship, and your parallel

| Offering | What it does | Stack | Your parallel |
|---|---|---|---|
| **Agentic Referral & MedRec Automation** (AWS Marketplace) | Intake of faxed, scanned, digital referrals and records → extract → validate → route to EHR, exceptions to human review | Bedrock + AgentCore | [P2](#p2) structured judgment + validation; [S3](#s3) entity resolution lesson |
| **Addy** | Referral and intake automation. ASUI: 15,700 fax pages a month, 98% accuracy | Textract + Bedrock | Extract → validate → route |
| **DocWeaver** | Unstructured documents → validated structured data in the customer's AWS | Bedrock, Neptune graph, agents on AgentCore | [P3](#p3): knowledge graph + Pydantic validation cross-checked against the graph |
| **Healthcare AI Accelerator** | 4-8 week GenAI/agentic POC | Bedrock, AgentCore, **Nova Sonic + Amazon Connect for IVR** | Voice: [P1](#p1), [P10](#p10) |

> **Name the pattern once in the interview:** "Your products are document or voice intake, extraction, deterministic validation, routing, and human review for exceptions. That's the shape of what I build."

<a id="lf-process"></a>

### 3.3 Their interview format (candidate reports)

| Report | Format |
|---|---|
| Senior Fullstack, Kathmandu, Aug 2024 | Phone call on experience → **LeetCode-style coding** → technical round **with the team you'd join** → HR on the offer |
| Kathmandu, Apr 2025 (filed on Glassdoor under "LeapFrog") | "They had even checked my GitHub repo which I pushed that same day at around 2 am" |
| Kathmandu, 2020 | Questions followed **whatever was mentioned in the resume**, with real-time examples |
| Careers page | Screening → assessment → interview → aligning expectations → **reference check** → HR → offer |

**Read for Wednesday (1 hour):** expect a CV deep-dive, an AI design or reliability scenario, possibly a coding exercise. Have your GitHub in order ([R8](#r8)) and pin the right repos ([Part 14](#pin)).

### 3.4 Peers building health agents on AgentCore (talking context)

Cohere Health runs a multi-tenant agentic architecture on AgentCore (Runtime microVM isolation, Gateway for tools, Memory). Bluesight's Prism assistant for healthcare compliance launched May 2026 and is used by 20 health systems. Use these only as "the industry is here" context, not as Leapfrog facts.

<a id="why-leapfrog"></a>

### 3.5 Why Leapfrog (45 seconds)

> "Three reasons. First, the work. Your Marketplace listing for referral and MedRec automation runs on Bedrock and AgentCore, and DocWeaver turns documents into validated structured data. That's the shape of what I build: extraction, validation against something deterministic, and human review for the exceptions.
>
> Second, healthcare. I started at Merohealth, and SmartClaim judges documentation against 46 Medicare coverage criteria. In this domain a wrong answer costs more than no answer. That constraint is how I already work: in reelslicer nothing ships until it's measured.
>
> Third, depth. I've delivered slices for many clients. I want to own one integration layer long enough to live with my decisions, with engineers in Nepal, the US and Europe."

<a id="part4"></a>

## Part 4 · Project dossiers

Ordered by interview value. Each has: what it proves, how it's built, the honest status, a 60-second pitch and the follow-ups that link into [Part 7](#part7). **Repo numbers are repo metrics, never client outcomes.**

**Jump:** [X1 matrix](#x1) · [P0 LLM Router ⚠️](#p0) · [P1 reelslicer](#p1) · [P2 SmartClaim](#p2) · [P3 Financial RAG](#p3) · [P4 FastKwan](#p4) · [P5 recruit-cli](#p5) · [P6 Pilot](#p6) · [P7 RevOps](#p7) · [P8 Trading arena](#p8) · [P9 Quant routing](#p9) · [P10 Voice](#p10) · [P11 EkJhalak](#p11) · [P12 Rescues](#p12) · [P13 Nestpane](#p13)

<a id="x1"></a>

### X1 · Evidence matrix (project × JD)

| | J1 LLM APIs | J2 RAG | J3 Agents | J4 Prompts/evals | J5 Guardrails | J6 Monitoring | J7 Frontend | J8 SDLC/deploy | Health | Audio |
|---|---|---|---|---|---|---|---|---|---|---|
| [P1 reelslicer](#p1) | ● | | ○ | ● | ● | ○ | ● | ● | | ● |
| [P2 SmartClaim](#p2) | ● | | | ○ | ● | | ● | ○ | ● | |
| [P3 Financial RAG](#p3) | ● | ● | | ● | ○ | ● | | | | |
| [P4 FastKwan TCM](#p4) | ● | ● | | | ○ | | | ○ | ○ | |
| [P5 recruit-cli](#p5) | ● | | | ○ | ● | | | ○ | | |
| [P6 Pilot console](#p6) | ○ | | ○ | | ● | ○ | ● | | | |
| [P7 RevOps](#p7) | ○ | | | ○ | ● | ○ | ● | ● | | |
| [P8 Trading arena](#p8) | ● | | ● | | ● | | | ○ | | |
| [P9 Quant routing](#p9) | | | ● | | ● | | | ○ | | |
| [P10 Voice stack](#p10) | ● | | | | ○ | | ● | ● | ○ | ● |
| [P11 EkJhalak](#p11) | ● | | | | | ○ | ● | ● | | |
| [P12 Backend rescues](#p12) | ○ | | | | ● | | ○ | ● | ● | |

● strong evidence · ○ supporting

<a id="p0"></a>

### P0 · Deterministic LLM Router (homepage feature) ⚠️

- **Claimed on kneeraazon.com:** routes prompts across OpenAI, Anthropic and local weights; structured instructor schemas; automatic fallback; **p99 18.0 ms, 3.8K tok/s**; diagram nodes ASGI, Deterministic, Hybrid, PostgreSQL, Redis.
- **Problem:** it's your homepage's only featured project and there's no repo for it. See [R4](#r4).
- **Prepare:** where the code lives; whether 18 ms is routing overhead measured on what load; what 3.8K tok/s measures; whether it served real traffic.
- **Safe phrasing:** "The routing decision adds p99 18 ms before inference; the model call itself is separate."

<a id="p1"></a>

### P1 · reelslicer: AI clip service with a measurement layer (your flagship, Nov 2026)

**One line:** an AI-assisted clip service for English, Hindi and Nepali creators, built so every claim about quality is measured. Live at reelslicer.com.

**Why it's your best interview asset:** it's yours end to end, it's recent, and it touches J1, J4, J5, J7 and J8 with decisions written down in 14 ADRs.

| Layer | What it is |
|---|---|
| `packages/eval` (`reelseval`) | The measurement layer: WER/CER counted over **grapheme clusters** (a changed vowel sign is one error), script correctness (native vs romanized vs wrong script), word-timing error, clip precision/recall/acceptance at k, cut quality, golden-set manifests with consent and dev/holdout split, engine bake-off, annotator agreement |
| `services/pipeline` (`reelspipeline`) | Adapters for **five speech vendors** (ElevenLabs Scribe v3, Sarvam Saaras v4 REST and Batch, Gemini 3.5 Transcribe, AssemblyAI, Google Chirp 3) behind one command; clip finding with **Gemini 3.8 Flash**; offline forced word aligner; prosody signals; caption packs |
| `services/renderer` (`reelsrender`) | 9:16 rendering with FFmpeg + libass, Devanagari captions **verified by measurement** (highlight direction, shaping, font coverage, safe area), -14 LUFS audio |
| `apps/api` + `apps/web` | FastAPI studio backend + Next.js 16 studio (clip workbench, disagreement review, IG safe-zone overlay, shareable delivery page) |
| Deploy | Next.js on Vercel + Cloudflare; FastAPI + FFmpeg 8 + libass + Noto Devanagari + **Nginx + systemd on EC2** (`c7i-flex.large`, us-east-1); private S3 bucket with SSE, least-privilege IAM role, optional 5-minute S3 sync timer |

**Decisions worth quoting (from your ADRs)**

1. **The model chooses segment numbers, never seconds** (ADR 0011). The transcript is cut into numbered segments at sentence ends and pauses; the model answers with first and last segment. It can't invent a timestamp, and a cut can't fall mid-word. → [S4](#s4)
2. **Propose is paid and non-deterministic; select is free and deterministic.** `propose` is the only step that calls out; `select` re-applies length, overlap, ranking and padding rules offline, so rules can be retuned without paying the model again.
3. **Prompt version + SHA-256 fingerprint of everything the model is told**, recorded in every output and **pinned by a test**: reword the prompt without bumping `PROMPT_VERSION` and CI fails. → [Q20](#q20)
4. **Untrusted text both ways.** The prompt says the transcript is data, but the real defense is the reply: numbers bounded and checked, titles cleaned of control and direction-override characters, cut at 1,000 code points. → [Q25](#q25)
5. **Consent defaults to no** (ADR 0005). Nothing leaves the machine without consent on the item, a key in the environment and `--yes`; the command prints a plan first. Holdout items are excluded unless asked for.
6. **Every unmeasured number is a recorded placeholder** (ADR 0002): clip length 15-60 s, 15 candidates, at most 10 clips, 0.2 s padding, medium thinking, 16,384 output tokens. Pinned by tests; tuned only after a baseline exists.
7. **Paid answers are never lost:** raw replies saved before parsing, files written whole or not at all, a failed write is a failed item, not a crash.
8. **HTTP layer** (`http.py`): retry only network errors, 429 and 5xx; honor `Retry-After` capped at 30 s, else exponential from 1 s; 4 attempts; audio re-read on every attempt; API key kept out of `repr` and scrubbed from error bodies; **presigned storage URLs must be https and not private, loopback or link-local** (SSRF hardening, K14). → [Q29](#q29), [C1](#c1)

**Numbers:** 1,435 tests across four packages · mypy strict, 93 source files · mutation checks (see [R14](#r14) for which total to quote) · CI with parallel lint, types, tests jobs · 14 ADRs · 18 research chapters.

**Honest status ([R12](#r12)):** golden set is empty; vendor adapters are built against vendor docs and have **never run against a real vendor**; `propose` has **never run against the live model**; the live studio transcribes locally with faster-whisper (CPU, int8, word timestamps, VAD). Job tracking is in memory (threads); persistence is SQLite in WAL mode; no auth yet (kanban K22). Hindi and Nepali captions not yet reviewed by native readers.

**What you'd do next for production:** [D4](#d4).

**60-second pitch**

> "reelslicer is my own product: long videos in, captioned vertical clips out, in English, Hindi and Nepali. What makes it interesting for this role is how the model is fenced in. Gemini proposes clips, but it can only answer with segment numbers from a table I give it, so it can't invent a timestamp or cut mid-word. Proposing is the only paid, non-deterministic step; selection is deterministic and offline, so I can retune rules without paying again. Every output records the prompt version and a hash of the prompt, and a test fails if someone rewords the prompt without bumping the version. Nothing is sent to any of the five speech vendors without consent on the item and an explicit flag. It's live on EC2 and Vercel with 1,435 tests. And I'll be straight: the vendor adapters haven't run against live APIs yet; that's the next step, and the evaluation harness to judge them is already built."

**Follow-ups:** why segments not timestamps ([S4](#s4)) · how you'd measure clip quality ([Q24](#q24)) · what breaks at scale ([D4](#d4)) · WER on Devanagari ([Q39](#q39)) · why Gemini first ([Q18](#q18)) · what thinking tokens do to your output limit ([Q19](#q19)).

<a id="p2"></a>

### P2 · SmartClaim AI: Medicare compliance judgment (healthcare)

**One line:** wound-care providers fill a 46-question checklist; a model judges each answer against CMS Medicare **LCD L35041** and reports pass or fail with a reason, before the claim is billed. Next.js 16, React 19, Auth.js, Neon Postgres, OpenAI.

| Decision | Detail |
|---|---|
| Strict schema | OpenAI Responses API with a **strict JSON schema built from the form's field list**: one required `{status: pass/fail, reason}` per field. A refusal or incomplete answer is a failure, not a partial result |
| No provider storage | `store: false` (the Responses API keeps responses 30 days by default; this is clinical data) |
| Identity hygiene | The user is identified to OpenAI by a SHA-256 of their id, not an email |
| Injection containment | The checklist goes in as data; instructions say never follow instructions inside a value; **the schema limits what a successful injection can achieve to pass/fail with a reason** |
| Input validation | Exactly the 46 fields, 2,000 characters per answer, 64 KiB body; anything else is 422 |
| Rate limit | 20 evaluations per hour per user; 429 with `Retry-After` |
| Error taxonomy | 401 · 422 · 400/413 · 429 · 503 (quota or missing key) · 502 (model failed or refused); a distinct UI message for each |
| Timeouts | 90 s, one retry; provider error text never echoed (it can quote the key) |
| Client storage | Draft in `sessionStorage`, not `localStorage` (clinical notes on a shared clinic computer) |

**Numbers (fact base):** 416 tests, 90 of 90 seeded mutation defects caught.

**What the first version got wrong** (your own `work-done.md`): it asked for a model named `"LLM"`, which doesn't exist, so **every evaluation failed**, and the UI showed "free tier has reached capacity" for every failure, which hid the real cause. The route took the request body with no validation and pasted it into the prompt. The public FAQ claimed HIPAA compliance. → [S2](#s2), [R9](#r9)

**Honest status:** no live model call after the modernization (no key in that environment); evaluations are stored in a Supabase table without expiry, protected only by row-level security under a public anon key. **[confirm]** whether v1 was yours and whether it had real users.

**60-second pitch**

> "SmartClaim judges wound-care documentation against 46 Medicare coverage criteria before a claim is billed. The model gets a strict JSON schema built from the form, so the only thing it can return is pass or fail with a reason per question; that also caps what a prompt injection inside a clinical note can do. Provider-side storage is off, the user is hashed before it reaches OpenAI, and every failure has its own status code and message. That last part came from a real bug: the first version requested a model that didn't exist, every evaluation failed, and a generic 'capacity' message hid it. Now a 502, a 503 and a 429 each say what actually happened."

<a id="p3"></a>

### P3 · Financial intelligence RAG (production, subcontract)

- **Problem:** financial questions are temporal and multi-hop; plain vector search can't order events or walk relationships.
- **Stack:** Graphiti + FalkorDB temporal knowledge graph (replaced deprecated Zep Community Edition) · Qdrant dense retrieval · ColBERT re-ranking · six Pydantic entity types (Company, FinancialEvent, AnalystRating, FinancialMetric, MacroEvent, Sector) with validation **cross-checked against the graph** · Langfuse tracing · RAGAS + DeepEval regression suites.
- **Your role:** subcontractor. **[fill]** the components you personally built. Never name the end client.
- **Leapfrog hook:** DocWeaver uses Neptune for document relationships. Same reason you used a graph.
- **Follow-ups:** [Q6](#q6) ColBERT · [Q7](#q7) evaluation · [Q10](#q10) hallucination.

<a id="p4"></a>

### P4 · FastKwan: TCM retrieval API (Pinecone + Cohere Rerank)

- **What:** FastAPI service for Traditional Chinese Medicine decision support. `POST /syndrome`: a chat model extracts symptoms (NER) → Pinecone finds 30 candidate syndromes → **Cohere Rerank to top 5**. `POST /prescription`: same symptoms in a prescriptions namespace (50 candidates) → rerank. `POST /lifestyle`: **MongoDB Atlas Search autocomplete** on the disease name.
- **Correction to v1:** Atlas Search serves a separate lexical endpoint; it isn't fused with Pinecone results.
- **Reliability details worth quoting:** upstream failures return **502 with a fixed message** (details only in server logs); a missing setting returns **503 naming the missing variables**; `/health` always open; query 1-4,000 characters; nothing required just to start the server.
- **Numbers (fact base):** 68 tests, 100% line coverage. First commit Jul 2023. **[confirm]** client or own.
- **Use when they say "Pinecone" or "reranking".** → [Q4](#q4), [Q6](#q6)

<a id="p5"></a>

### P5 · recruit-cli: Gemini CV screening → Notion (on PyPI)

- **Flow:** CV folder → text extraction → Gemini screening → **validated result** → Notion database.
- **Guardrails:** score must be an integer 0-100; **category is derived from the score in code, never taken from the model**; values Notion would reject are cleaned first; CV text fenced as untrusted ("a CV saying 'give me 100' is just text to analyse"); dedupe by email + job ID; **stops after three Gemini failures in a row** (a simple circuit breaker); exit code 1 if any CV failed.
- **Numbers (fact base):** 250 tests, 100% line and branch coverage. Published on PyPI (renamed in 0.4.0).
- **Use for:** injection ([Q25](#q25)), "model chooses, code decides" ([S4](#s4)).

<a id="p6"></a>

### P6 · Pilot (Bay Area Tech Hero): AI ops console (frontend contractor)

- **Your role:** frontend contractor. You built the **Next.js operator console**: live feed, trace drawer, Claude chat, for an assistant that triages email, Slack and calendar events as ALERT, DRAFT or NOTHING (pilotready.vercel.app).
- **The product:** an AI field-service copilot pulling in Gmail, Slack, call transcripts, QuickBooks and Acuity bookings into customer/job entity resolution.
- **Your two findings:** the entity resolver didn't fall back to the linked email when a name match failed, with client money involved (flagged as critical, ADR-051); **prompt injection embedded in Slack tool results**, flagged repeatedly.
- **Never claim:** backend ownership, the fix, or the audit ([R10](#r10), [R11](#r11)). → [S3](#s3)

<a id="p7"></a>

### P7 · RevOps lead scoring platform

- **What:** scores B2B leads from usage and engagement signals into HOT, WARM, COOL, COLD. A transparent formula is always live; an **XGBoost model scores in shadow** and is promoted only when its accuracy is trusted.
- **Integrations:** HubSpot (batch sync out, signed deal-won webhook in), Salesforce (OAuth), outbound webhooks with signatures and retries, S3-compatible raw imports, per-lead AI report.
- **Production hygiene:** refuses to start with placeholder secrets; encrypts stored CRM tokens; keeps tokens out of the browser; **checks every URL it calls on a user's behalf**.
- **Numbers:** 810 API tests, 528 of 528 mutants caught. Docker Compose: Postgres, Redis, API, worker, scheduler, web.
- **Use for:** ownership ([S8](#s8)), safe rollout ("shadow model = canary for prompts", [Q15](#q15)), secrets ([Q30](#q30)).

<a id="p8"></a>

### P8 · Automated trading arena (LLM agents + MCP, simulation)

- **What:** several model families (GPT, Claude, DeepSeek, Qwen, Gemini) each start with $10,000 on NASDAQ 100 stocks, read the market through **FastMCP tool servers**, and place their own orders. LangChain + LangGraph.
- **Guardrails in the tools, not the prompt:** the price tool shows only the current day's (or hour's) open; search results published at or after the simulated moment, or undated, are dropped (no look-ahead); orders must be positive whole shares at a real price; cash can never go negative; read-check-write runs under a lock; **tool servers require a shared secret beyond loopback**.
- **Numbers (fact base):** 602 tests, 230 of 230 mutants. A simulation benchmark, never live trading.
- **Provenance:** see [R6](#r6).
- **Use for:** MCP ([Q33](#q33)), tool-layer guardrails ([Q34](#q34)).

<a id="p9"></a>

### P9 · Deterministic quantitative routing (prototype)

- **What it really is:** about 700 lines of Python, 254 tests, a prototype of the routing and orchestration layer. A `SemanticRouter` protocol where a model would plug in, implemented today by a **keyword mock**; data is a **mock random walk** ([R5](#r5)).
- **What's real:** six validated indicators (`sma_crossover`, `price_above_sma`, `bollinger_squeeze`, `atr_expansion`, `rsi_overbought`, `rsi_oversold`); composition (AND, OR, XOR, SUM, AVERAGE) across steps and assets; a recursive stability loop with majority-vote smoothing, a Hamming threshold and a **circuit breaker for 2-cycles** that reports why it stopped; FastAPI `/query`; non-root Docker image. 242 of 242 mutants (fact base).
- **The idea to sell:** "LLM routes, code computes." Use as design thinking, not as a production system.

<a id="p10"></a>

### P10 · Voice stack: transcribeX, ttstt, CBT coach

| Project | What | Why it matters to Leapfrog |
|---|---|---|
| **transcribeXplatform** | Transcription with speaker identification and AI summaries across **AssemblyAI, Deepgram Nova-3, OpenAI and local Whisper**; every input normalized to 16 kHz mono WAV with ffmpeg; CLI, web app and an Electron desktop app with bundled installers | Multi-provider audio adapters; their IVR accelerator uses Nova Sonic + Amazon Connect |
| **ttstt** (VoiceTech radar) | Comparison platform for TTS and STT providers: leaderboard, recommendation wizard, TCO calculator; 215 Vitest tests, 108 mutation checks | Vendor selection on evidence |
| **CBT recovery coach** | FastAPI + Next.js; SQLAlchemy 2 async; Argon2id; rotating refresh JWT cookies; **Gemini + ElevenLabs voice**; 210 API tests | Sensitive-domain voice AI with real auth |

→ [Q39](#q39)

<a id="p11"></a>

### P11 · EkJhalak: bilingual news briefings (own, runs daily)

Next.js 16, TypeScript, RSS, **Groq API**, Supabase. Ingests public RSS from Nepali and international outlets, deduplicates coverage, generates labeled Nepali and English summaries and translations. **Not RAG.** Use for ownership and operating cost discipline on something you run yourself.

<a id="p12"></a>

### P12 · Backend rescues and safety-critical patterns

| Project | Pattern worth quoting |
|---|---|
| **Clarity** (Django 5.2 + DRF, Nuxt 4) | Optional OpenAI helper drafts descriptions; **descriptions sanitized on the way out** so editor markup can't run script (OWASP "improper output handling"). Rescued from a Django 4.1 repo with committed secrets and DEBUG on |
| **Kruxova** (DRF, Celery) | **Audit trail of authenticated writes that records route, method and field names, never tokens, cookies or values**: PHI-style log hygiene. Rebuilt from a codebase that exposed its user table |
| **Delta hedging** (Flask, IG demo API) | Refuses to start against anything but the demo environment; places an order **only when hedging is on and the request confirms the exact previewed order**: the human-confirmation pattern for side effects. 532 tests |
| **MeroHealth** (Django) | Healthcare platform backend: accounts with email verification, social login, lab registration, safe `?next=` redirects. Supports the healthcare line on your CV ([R1](#r1) dates still apply) |

<a id="p13"></a>

### P13 · Nestpane (Chrome Web Store)

Local-first new-tab workspace, v3.2.0 on the Chrome Web Store, GPL-3.0. Notes, tasks, focus, habits, journal; command palette with optional AI answers; Drive backup with optional passphrase encryption (AES-GCM); 158 tests, zero runtime npm dependencies. Use only if they ask about shipping a product to real users.

<a id="part5"></a>

## Part 5 · Your narrative

**Jump:** [Intro](#intro) · [Why Leapfrog](#why-leapfrog) · [Weakness](#weakness) · [Answers to decide](#decide)

<a id="intro"></a>

### 5.1 Tell me about yourself (about 80 seconds)

> "I'm Nirajan, a backend engineer who spends most of his time making LLMs behave inside real products. Python is home: FastAPI, Django, Postgres with pgvector, Redis and Celery, on AWS.
>
> Three pieces of recent work show how I do it. reelslicer is my own product, live on EC2 and Vercel: long videos in, captioned clips out, in English, Hindi and Nepali. The model can only answer with segment numbers, so it can't invent timestamps, and every metric that judges it is mutation-tested. SmartClaim judges wound-care documentation against 46 Medicare coverage criteria through strict JSON-schema outputs, with clinical text treated as untrusted data. And as a subcontractor I built parts of a production financial-intelligence RAG platform: a knowledge graph plus Qdrant, ColBERT re-ranking, and RAGAS and DeepEval regression suites in Langfuse.
>
> On the backend side, I scaled a Django platform to 12,000 requests a minute at 99.99% uptime, and cut API latency 72% with an async FastAPI and Redis redesign.
>
> I'm Top Rated on Upwork with a 100% job success score. I want to stop working in slices and own one integration layer on healthcare products, which is what this role describes."

**Gate:** under 90 seconds, no notes, every noun has a dossier behind it.

### 5.2 Why move from freelancing to full-time?

> "Freelancing taught me ownership: nobody else answers the client at 2 a.m. The ceiling is scope. I arrive for a slice, hand it over, and never live with my architecture for three years. I want one product line, peers who review my work and whose work I review, and the long loop where evals and observability actually compound. Healthcare is where that discipline matters most."

If asked "will you fit a team?": "reelslicer runs like a team already: ADRs, protected branches, CI gates, reviewers. I'd rather have people in those seats."

### 5.3 Strongest skill

> "Backend engineering for AI features. Calling a model is the easy part; the value is the service around it: contracts, validation, retries, consent, measurement, deployment. That's what turns a demo into something a team can run."

<a id="weakness"></a>

### 5.4 Weakness (pre-decided)

> "Running these systems at hospital scale under real compliance. I've designed for it (consent, no provider storage, audit-safe logs), but I haven't operated a BAA-covered deployment, and I haven't shipped on Bedrock or AgentCore. I'd learn both fastest inside a team that already runs them, which is part of why I'm here."

### 5.5 When you don't know

> "I haven't run that in production, so I won't overstate it. My understanding is [principle]. Before choosing, I'd verify [the unknown], test [the risk], and judge it on [metric]."

<a id="decide"></a>

### 5.6 Answers to decide tonight

| Item | Your answer |
|---|---|
| Career timeline in one breath ([R1](#r1)) | |
| Education in one breath ([R2](#r2)) | |
| 41% metric: use or drop ([R3](#r3)) | |
| Project count ([R13](#r13)) | |
| Notice period | |

<a id="part6"></a>

## Part 6 · Story bank

Format: **When to use · Situation · Action · Result · Lesson.** Items marked **[fill]** are facts only you know; fill them or leave that part out.

**Jump:** [S1 RAG](#s1) · [S2 What broke](#s2) · [S3 Pilot findings](#s3) · [S4 Fencing the model](#s4) · [S5 Measure first](#s5) · [S6 Latency](#s6) · [S7 Scale](#s7) · [S8 Ownership](#s8) · [S9 AI coding assistants](#s9) · [S10 Many vendors](#s10) · [S11 Ambiguity](#s11)

<a id="s1"></a>

### S1 · A production RAG system ([P3](#p3))

- **Use for:** "describe a RAG pipeline", retrieval quality, evals, graphs.
- **S:** financial questions are temporal and multi-hop; vectors flatten time and relationships.
- **A:** temporal knowledge graph (Graphiti + FalkorDB) for who-relates-to-whom-and-when; Qdrant for similar text; ColBERT to re-rank; six Pydantic entity types, with extracted entities cross-checked against the graph; Langfuse traces; RAGAS + DeepEval regression suites gating changes. **[fill]** your components.
- **R:** **[fill]** what improved, and how you knew.
- **Lesson:** "Retrieval and generation fail differently, so I measure them separately."

<a id="s2"></a>

### S2 · What broke: the model that didn't exist ([P2](#p2))

- **Use for:** "what broke in production", error design, observability.
- **S:** SmartClaim's first version requested a model named `"LLM"`. Every evaluation failed. The UI showed one message for every failure: "free tier has reached capacity". **[confirm]** whose version and whether users hit it.
- **A:** made the model a setting; mapped failures to distinct codes (401, 422, 429 with `Retry-After`, 502 for model failure or refusal, 503 for quota or missing key) with a distinct UI message each; validated the body (46 known fields, size limits) instead of pasting raw JSON into the prompt; turned off provider storage; moved drafts from `localStorage` to `sessionStorage`; removed HIPAA claims the code didn't support.
- **R:** failures are now diagnosable from the status code alone; 416 tests, 90 of 90 seeded defects caught.
- **Lesson:** "A generic error message is an outage you can't see. Every failure class gets its own name."

<a id="s3"></a>

### S3 · Two findings from the operator console ([P6](#p6))

- **Use for:** "what broke", prompt injection, frontend collaboration.
- **Say:**

> "On Pilot I was the frontend contractor: I built the operator console with the live feed, trace drawer and Claude chat. Two production issues came through my work. When a name match failed, the entity resolver didn't fall back to the customer's linked email, so records didn't resolve to the right customer, with real client money involved; I flagged it as critical. And instructions embedded in Slack tool results kept appearing in sessions; I flagged those repeatedly. The lesson I now design around: tool output is data, never instructions, and authorization lives outside the model."

- **[fill]:** how you noticed each; what the team did.
- **If asked how to fix the resolver:** a deterministic ladder: exact ID → linked email or phone → fuzzy name above a threshold → human review. Never auto-link on low confidence. Log every resolution with its confidence.

<a id="s4"></a>

### S4 · Fencing the model in: segment numbers, not seconds ([P1](#p1))

- **Use for:** "a challenge integrating AI", guardrails, hallucination.
- **S:** clip finding needs exact cut points. Ask a model for timestamps and it will invent plausible ones, and cut mid-word.
- **A:** cut the transcript into numbered segments at sentence ends and pauses; the model may only answer with first and last segment numbers; bound and check every number; clean every string; keep the raw paid reply; split paid `propose` from free, deterministic `select`.
- **R:** a hallucinated timestamp is structurally impossible; rules can be retuned without paying the model again.
- **Lesson:** "Let the model choose; let code compute." Same idea in [P5](#p5) (category derived from score) and [P9](#p9).

<a id="s5"></a>

### S5 · Measure before you build ([P1](#p1))

- **Use for:** evals, "how do you know it works", QA conversations.
- **A:** built the measurement layer first: WER/CER over grapheme clusters, script correctness, word-timing error, clip precision/recall/acceptance at k; golden-set manifests with consent and a private holdout; two annotators plus adjudication; every metric mutation-checked because "a wrong metric silently ruins every decision built on it".
- **R:** mutation checks found real defects in the code itself (including a stale-bytecode flaw in the mutation driver).
- **Lesson:** "A passing test suite only proves the tests pass, not that they can fail."

<a id="s6"></a>

### S6 · Performance: 72% lower API latency

Verified mechanism: **async FastAPI and Redis redesign** (resume adds batching and query tuning). Fill the [M-table](#m-table) row before Tuesday ends. Never say only "I used Redis"; name the bottleneck and why the change removed it.

<a id="s7"></a>

### S7 · Scale: 12,000 RPM at 99.99% uptime

Zero-downtime Django monolith → microservices migration. Prepare: how traffic was cut over, data consistency during the split, what you monitored, the rollback plan. **[fill each]**

<a id="s8"></a>

### S8 · End-to-end ownership ([P1](#p1) or [P7](#p7))

> "reelslicer goes from ADRs to a live deploy: FastAPI and FFmpeg on EC2 behind Nginx and systemd, a private encrypted S3 bucket with a least-privilege role, the Next.js studio on Vercel, CI on every push, protected staging and production branches."

Alternative: RevOps, where the shadow XGBoost model is promoted only on evidence.

<a id="s9"></a>

### S9 · AI coding assistants, with gates ([R7](#r7))

> "I use coding agents heavily, and I run them like a team: in reelslicer, an orchestrator session plus six specialist agents (frontend, backend, QA, security, SEO, production reviewer), each owning a set of paths so two never edit the same file, with contracts written before parallel work starts. Nothing merges without lint, strict mypy, 1,435 tests and mutation checks. Across my older repos I ran a modernization pass the same way, and each repo has a `work-done.md` listing what was **not** verified. Agents make me faster; the gates are what make the output mine."

<a id="s10"></a>

### S10 · Many vendors, one interface ([P1](#p1), [P10](#p10))

> "reelslicer talks to five speech vendors through one command that plans first and sends nothing without consent and a flag; transcribeX does the same across AssemblyAI, Deepgram, OpenAI and local Whisper, normalizing every input to 16 kHz mono first. The adapter hides transport, not semantics: word timings, chunk timings and diarization differ per vendor, so the interface says which ones it has."

<a id="s11"></a>

### S11 · Ambiguity and client communication

**[fill]** one real story: what they asked for, what you did instead, what happened. A smaller true story beats a bigger invented one.

<a id="part7"></a>

## Part 7 · Technical Q&A bank

Answer shape: **principle → implementation → trade-off → your proof.** 60 to 120 seconds.

| Group | Questions |
|---|---|
| RAG | [Q1 pipeline](#q1) · [Q2 debug](#q2) · [Q3 chunking](#q3) · [Q4 vector DBs](#q4) · [Q5 hybrid](#q5) · [Q6 re-rank](#q6) · [Q7 evals](#q7) · [Q8 tenants](#q8) · [Q9 updates](#q9) · [Q10 hallucination](#q10) |
| Integration | [Q11 Claude in FastAPI](#q11) · [Q12 failures](#q12) · [Q13 bad JSON](#q13) · [Q14 streaming](#q14) · [Q15 switching models](#q15) · [Q16 rate limits](#q16) · [Q17 schema vs tools](#q17) · [Q18 many providers](#q18) · [Q19 reasoning tokens](#q19) |
| Prompts & evals | [Q20 versioning](#q20) · [Q21 eval stack](#q21) · [Q22 non-determinism](#q22) · [Q23 LLM judge](#q23) · [Q24 golden set](#q24) |
| Security | [Q25 injection](#q25) · [Q26 guardrail layers](#q26) · [Q27 OWASP](#q27) · [Q28 PHI](#q28) · [Q29 SSRF](#q29) · [Q30 secrets](#q30) |
| Agents | [Q31 agent or pipeline](#q31) · [Q32 frameworks](#q32) · [Q33 MCP](#q33) · [Q34 runaway agents](#q34) · [Q35 safe drafting agent](#q35) |
| Ops & cost | [Q36 dashboard](#q36) · [Q37 cost](#q37) · [Q38 latency](#q38) |
| Speech | [Q39 speech-to-text](#q39) |
| Judgment | [Q40 fine-tuning](#q40) · [Q41 AI assistants](#q41) · [Q42 backend basics](#q42) · [Q43 frontend](#q43) · [Q44 self-critique](#q44) |

### 7.1 RAG

<a id="q1"></a>

**Q1. Walk me through a RAG pipeline end to end.**

1. **Ingest:** connectors; type and size checks; layout-aware parsing (faxes and PDFs with tables break naive extraction); PHI handling before anything is indexed.
2. **Normalize + metadata:** headings, pages, section path, version, tenant, ACL labels.
3. **Chunk:** structure-aware first; parent-child when context matters.
4. **Embed:** batched; record the embedding model with every vector; a model change means a full re-embed.
5. **Index:** vectors + lexical index + metadata.
6. **Query:** authenticate, resolve tenant and permissions, optionally rewrite.
7. **Retrieve:** mandatory permission filters; hybrid (dense + lexical) fused with [RRF](#g-rrf).
8. **Re-rank:** top-50 → top-5.
9. **Assemble:** token budget, source IDs attached.
10. **Generate:** answer only from evidence, cite chunk IDs, explicit insufficient-evidence path.
11. **Validate:** schema; every cited ID exists in the retrieved set; business rules.
12. **Evaluate:** retrieval and generation separately, in CI and on sampled traffic.

> **Say:** "An unevaluated RAG system is a demo." **Proof:** [P3](#p3), [P4](#p4).

<a id="q2"></a>

**Q2. It gives wrong answers. How do you debug?**

Paste the correct context manually: now right → retrieval problem; still wrong → generation problem. Retrieval: chunk boundaries, embedding mismatch, filters, stale index, exact terms missed by dense search. Generation: prompt, context order (lost in the middle), model tier. Log chunk IDs and scores per answer. Rerun the eval suite after each change.

| Symptom | Likely cause | Inspect |
|---|---|---|
| Right answer never appears | Retrieval miss | Recall@k, chunking, filters |
| Wrong source | Similar but irrelevant | Precision@k, re-rank, metadata |
| Right source, wrong answer | Generation | Prompt, order, model |
| Another tenant's data | Missing filter | Server-side filters, RLS, cache keys |
| Stale answer | Stale index | Versioning, deletion flow |
| High cost | Too much context | Top-k, re-rank cutoff, caching |

<a id="q3"></a>

**Q3. Chunk size and overlap?** No universal size. Structure-aware first (never split a lab table, dosage block or coverage criterion), baseline on a representative query set, then compare sizes and overlap on recall@k and answer quality. Small: precise, loses context. Large: context, diluted embeddings, more tokens.

<a id="q4"></a>

**Q4. pgvector vs Pinecone vs Weaviate vs Qdrant?**

| Store | Pick when | Watch for |
|---|---|---|
| pgvector | Postgres is the system of record; joins, transactions, RLS for tenants | Index build and memory at very large scale; filtered HNSW ([Q8](#q8)) |
| Pinecone | Zero-ops managed scale, serverless | Cost model, lock-in, residency |
| Weaviate | Built-in hybrid and modules | One more system to run |
| Qdrant | Heavy payload filtering, quantization, self-host | One more system to run |

> **Say:** "I default to pgvector for operational simplicity and Postgres-side security, and I've shipped on Pinecone ([P4](#p4)) and Qdrant ([P3](#p3))."

<a id="q5"></a>

**Q5. Hybrid search?** Dense misses exact identifiers (drug names, ICD-10 and CPT codes, MRNs); lexical misses paraphrase. Run both, fuse with RRF (rank-based, so cosine and BM25 scores never need normalizing), then re-rank. Postgres `ts_rank` isn't true BM25. Code: [C2](#c2).

<a id="q6"></a>

**Q6. Why re-rank, and why ColBERT?** First stage is fast and recall-oriented; a re-ranker fixes ordering. Cross-encoders are most precise and most expensive. [ColBERT](#g-colbert) uses late interaction: token-level matching, with document embeddings precomputed, so it's cheaper at scale than a full cross-encoder and sharper than a bi-encoder. Re-ranking can't recover a document never retrieved. **Proof:** [P3](#p3) ColBERT, [P4](#p4) Cohere Rerank.

<a id="q7"></a>

**Q7. How do you evaluate RAG?**

| Layer | Metrics |
|---|---|
| Retrieval | Recall@k, Precision@k, [MRR](#g-mrr), [nDCG](#g-ndcg); RAGAS context precision and recall |
| Generation | Faithfulness, answer relevance, citation correctness |
| Product | Corrections, acceptance, edit distance on drafts |

Golden set with expert answers; run on every prompt, model or chunking change; calibrate LLM-as-judge against humans.

<a id="q8"></a>

**Q8. Multi-tenancy?** Authorization before retrieval, in server code; RLS as a second wall; cache keys scoped by authorization context; never let the client supply the filter. With pgvector, filtered HNSW queries can return too few rows; iterative index scans (0.8+) address it. Code: [C4](#c4).

<a id="q9"></a>

**Q9. Updates and deletions?** Version documents and chunks; idempotent ingestion keyed by source ID + checksum; supersede on update; on delete remove vectors, lexical entries and caches, then verify. Embedding model change = full re-embed with a dual-index cutover.

<a id="q10"></a>

**Q10. Hallucination?**

> **Say:** "You don't eliminate hallucination. You engineer containment."

Grounding with citations, schemas, citation verification, an explicit insufficient-evidence path, faithfulness in evals, human review for consequential outputs, sources visible in the UI. Structural containment when possible: [S4](#s4).

### 7.2 Integration and reliability

<a id="q11"></a>

**Q11. Integrating Claude into FastAPI or Django: the hard parts?**

- Provider adapter behind an interface; business logic never imports an SDK.
- One shared async client per provider (lifespan); connection reuse; per-call timeouts.
- Sync Django: don't block workers on long generations; stream via ASGI or push to Celery.
- Stream end to end without buffering (`X-Accel-Buffering: no`).
- Structured output via forced tool use or JSON schema, validated with Pydantic.
- Secrets in a manager, read by name, kept out of `repr` and logs ([P1](#p1) does exactly this).
- Client-side RPM and TPM limits; honor `Retry-After`.
- `max_tokens` per request class; per-tenant budgets; spend alerts.
- Trace every call: model, prompt version, tokens, cache hits, latency, cost, outcome.

<a id="q12"></a>

**Q12. Provider times out, returns 429, or returns garbage?**

| Failure | Response |
|---|---|
| 429 / 5xx / timeout / network | Retry with capped exponential backoff + jitter; `Retry-After` wins (capped); bounded attempts and a total deadline |
| Persistent failures | Circuit breaker opens; route to a validated fallback provider |
| 400 / 401 / 422 / policy | Never retry: it only repeats the cost. Fail fast, alert |
| Schema violation | Not transient. One bounded repair for low-risk tasks, else fallback or human queue |
| Everything down | Degrade honestly: queue, cached answer, non-AI path. Never fabricate |

**Proof:** reelslicer `http.py` retries only network errors, 429 and 5xx, caps `Retry-After` at 30 s ([P1](#p1)); recruit-cli stops after three consecutive failures ([P5](#p5)); SmartClaim maps each failure to its own code ([P2](#p2)). Code: [C1](#c1).

<a id="q13"></a>

**Q13. Invalid JSON, refusals, truncation?** Prefer native strict schemas. Validate every reply. A refusal and an incomplete reply (output limit hit) are failures, not partial results ([P2](#p2)). One repair attempt only for low-risk tasks. Never coerce invalid data into a consequential decision.

<a id="q14"></a>

**Q14. Streaming to the UI?** SSE for one-way streams, WebSockets when the client sends mid-stream. Typed events (token, status, citation, done, error). Propagate cancellation so "Stop" stops the bill. Persist only after completion and validation. Code: [C3](#c3).

<a id="q15"></a>

**Q15. Switching models safely?** Versioned config; run the eval set on the candidate (quality, schema compliance, refusals, latency, cost); canary a slice; watch; instant rollback. Pin dated snapshots. Same discipline as RevOps' shadow model ([P7](#p7)).

<a id="q16"></a>

**Q16. Rate limits?** Per-user and per-tenant quotas, concurrency caps, a Redis token bucket on TPM as well as RPM, queues for non-interactive work, provider-aware backoff. Return 429 with `Retry-After` to your own clients ([P2](#p2): 20 per hour per user).

<a id="q17"></a>

**Q17. Structured output vs tool calling?** Structured output: "answer in this shape". Tool calling: "ask the application to run this operation". Safe flow: model proposes → server validates → server authorizes → narrow operation runs → result returns. The model never gets raw database or shell access.

<a id="q18"></a>

**Q18. One interface for many providers?** Normalize request, response and errors; keep provider-specific capabilities reachable; centralize keys and config; instrument every call. Choose by quality, latency, cost, data terms and availability. **Fallback only between providers whose prompts and schemas you've validated.** **Proof:** [S10](#s10). reelslicer: "a second provider is one class with a name, settings and `generate`".

<a id="q19"></a>

**Q19. Reasoning models: what changes?** Thinking tokens cost money and latency, and may count against the output limit. If they do, a high thinking level can exhaust the limit and return a paid, incomplete reply. Set thinking per task, size the output limit with headroom, treat "incomplete" as a failure. Your reelslicer ADR records exactly this as an open, unverified question for the first live run.

### 7.3 Prompts and evaluation

<a id="q20"></a>

**Q20. How do you version prompts?**

Prompts are code: in the repo or a registry, reviewed, versioned, tagged with model compatibility and eval scores, released behind an eval gate, rolled back by repointing a label. **Your strongest proof:** reelslicer records `PROMPT_VERSION` and a **SHA-256 fingerprint of everything the model is told** in every output, and a test fails if the wording changes without a new version ([P1](#p1)).

<a id="q21"></a>

**Q21. Your eval stack?**

| Level | What | When |
|---|---|---|
| Deterministic | Schema, regex, ranges, routing exact-match, latency bounds | Every PR |
| LLM-as-judge | Rubric grading with reasons, calibrated on human labels | CI, nightly |
| Online | Sampled faithfulness, thumbs, edits, refusals, drift alerts | Continuous |

<a id="q22"></a>

**Q22. QA is worried about non-determinism.** "Make the deterministic parts deterministic and quarantine the rest." Contract tests on schemas; mocked-provider tests for app logic; a small live suite; eval thresholds as CI gates; `temperature=0` reduces variance but guarantees nothing. **Proof:** reelslicer's paid `propose` vs deterministic `select` ([S4](#s4)).

<a id="q23"></a>

**Q23. LLM-as-judge pitfalls?** Position bias, verbosity bias, self-preference, drift when the judge changes. Calibrate on human labels, pairwise with order swapping, pin the judge, never the only signal. reelslicer treats the model's own 1-10 clip score as **not ground truth** until it tracks editor acceptance.

<a id="q24"></a>

**Q24. How do you build a golden set?** Rights-cleared data with consent recorded per item; dev and private holdout split (holdout never used for tuning); two annotators independently, lint against an annotation guide, measure agreement, adjudicate; set the agreement floor from a calibration round. **Proof:** [S5](#s5).

### 7.4 Guardrails and security

<a id="q25"></a>

**Q25. Prompt injection?** Treat user input, retrieved documents and **tool outputs** as untrusted data. Separate instructions from data. Keep authorization and tool permissions outside the model. Constrain what a reply can do: a strict schema caps a successful injection to "pass or fail with a reason" ([P2](#p2)); a score is bounded and the category derived in code ([P5](#p5)); replies are numbers checked against a table ([P1](#p1)). Real incident: Slack tool results ([S3](#s3)).

> **Say:** "A system prompt is not a security boundary."

<a id="q26"></a>

**Q26. Where do guardrails go?** Input (type, size, intent, PII) → identity → retrieval filters → prompt boundaries → tool schema + authorization + idempotency → output (schema, rules, grounding, sanitizing for display) → human approval → monitoring.

<a id="q27"></a>

**Q27. OWASP Top 10 for LLM apps (vocabulary).** Prompt injection · sensitive information disclosure · supply chain · data and model poisoning · improper output handling ([P12](#p12) Clarity sanitizes) · excessive agency · system prompt leakage · vector and embedding weaknesses · misinformation · unbounded consumption.

<a id="q28"></a>

**Q28. PII and PHI?** Minimize; redact or tokenize before external calls unless the endpoint is covered ([Part 8.3](#hipaa)); provider storage off ([P2](#p2) `store: false`); hash user identifiers sent to providers; keep clinical drafts out of long-lived browser storage; audit logs that record field names, never values ([P12](#p12) Kruxova); retention and deletion defined; obligations confirmed, not assumed.

<a id="q29"></a>

**Q29. Outbound calls and SSRF?** Any URL your server fetches on someone's behalf, including vendor-issued presigned URLs, is an attack path. Require https, resolve and refuse private, loopback and link-local addresses, send no API key to storage hosts, stream large files. **Proof:** reelslicer K14 hardening ([P1](#p1)); RevOps checks every URL it calls for a user ([P7](#p7)).

<a id="q30"></a>

**Q30. Secrets?** Read keys by name from the environment or a secrets manager; say only whether a key is set; keep it out of `repr`, logs and error bodies (scrub); refuse to start with placeholder secrets ([P7](#p7)); never in git, rc files or chat. **Proof:** [P1](#p1).

### 7.5 Agents

<a id="q31"></a>

**Q31. Agent or pipeline?**

> **Say:** "Agents are for workflows where the next step depends on the last result. If the steps are known, it's a pipeline."

Escalate deliberately, with budgets and approval gates. Often: deterministic orchestration around a few model decisions.

<a id="q32"></a>

**Q32. Frameworks in one breath.**

| Framework | One line |
|---|---|
| LangChain | Integration and composition library |
| LangGraph | Explicit state, checkpoints, human-in-the-loop interrupts; my production choice ([P8](#p8)) |
| LlamaIndex | Data-first: connectors, indexing, query engines |
| CrewAI | Role-based multi-agent teams |
| AutoGen | Microsoft's multi-agent conversation framework |
| Strands Agents | AWS's open-source agent SDK; pairs with AgentCore |
| AgentCore | Not a framework: AWS's platform to run and govern agents from any of these ([Part 8](#part8)) |

<a id="q33"></a>

**Q33. MCP?** An open protocol exposing tools, resources and prompts to any compatible client: M×N integrations become M+N. Every MCP server is new attack surface. **Proof:** FastMCP tool servers with a shared secret required beyond loopback ([P8](#p8)). AgentCore Gateway turns APIs and Lambdas into MCP tools, now with per-user MCP sessions.

<a id="q34"></a>

**Q34. Runaway agents?** Enforced by the orchestrator, not the model: max steps, deadline, token and dollar budget, tool-call cap, loop detection, checkpointed state, deterministic fallback. **Put guardrails in the tools**: [P8](#p8)'s tools can't see the future, and its account can't go negative, whatever the model says.

<a id="q35"></a>

**Q35. A safe agent that drafts patient-message replies?** Classify (rules first, model for ambiguity) → retrieve only authorized context → draft with evidence → schema and citation checks → **a human approves before anything is sent** ([P12](#p12) delta hedging's confirmed-order pattern) → audit log of who, what, which sources, which prompt version.

### 7.6 Observability and cost

<a id="q36"></a>

**Q36. Your AI dashboard?**

| Layer | Metrics |
|---|---|
| API | Rate, errors, p50/p95/p99 |
| Provider | Latency, timeouts, 429s, errors by class |
| Cost | Tokens in/out, cache hits, **cost per successful task** |
| RAG | Recall@k on the eval set, empty-retrieval rate |
| Generation | Faithfulness, schema violations, refusals |
| Agent | Steps per task, tool success, loops, approvals |
| Product | Corrections, acceptance, abandonment |

> **Say:** "Latency, cost per query, accuracy drift and token usage: the four things your JD lists are four rows of that dashboard."

<a id="q37"></a>

**Q37. Cost levers?** Model tiering · prompt caching on static prefixes · exact and embedding caches · semantic cache only where privacy allows · smaller context after re-ranking · batch APIs for offline work · `max_tokens` per class · per-tenant budgets · **never pay twice**: reelslicer keeps every paid reply and refuses to re-send finished items ([P1](#p1)).

> **Say:** "A cheaper answer that makes the user ask twice isn't cheaper."

<a id="q38"></a>

**Q38. Latency levers?** Measure first. Split [TTFT](#g-ttft) (prefill, network, retrieval) from time per output token (model size, output length). Stream; cache prefixes; smaller models where quality holds; parallel retrieval; re-rank only top-k; concise schemas; async I/O; region proximity; background jobs off the critical path.

### 7.7 Speech and multimodal

<a id="q39"></a>

**Q39. Integrating speech-to-text into a product?**

- **Normalize input** (16 kHz mono WAV) so every vendor sees the same audio ([P10](#p10)).
- **Measure per language and audio type:** WER and CER, counted over grapheme clusters for Devanagari; **script correctness** (some models romanize or translate instead of transcribing); timing error at median and p95 ([P1](#p1)).
- **Know what each vendor returns:** word timings, chunk timings, diarization, language detection; design the interface around those differences ([S10](#s10)).
- **Data terms:** some vendors train on uploads unless you opt out; read them before sending anyone's audio. Consent per item.
- **Leapfrog hook:** their IVR accelerator uses Nova Sonic with Amazon Connect; the same measurement discipline applies to voice agents.

### 7.8 Judgment

<a id="q40"></a>

**Q40. Prompting vs RAG vs fine-tuning?**

| Need | Tool |
|---|---|
| Behavior and format, fast iteration | Prompting |
| Private, changing, auditable knowledge with citations | RAG |
| Stable style or format at scale, or distilling a big model into a small one, with a curated dataset and evals | Fine-tuning |

Fine-tuning is wrong for facts that change. reelslicer's roadmap fine-tunes speech for Nepali only after consented corrections exist: data first, then training.

<a id="q41"></a>

**Q41. AI coding assistants?** [S9](#s9).

<a id="q42"></a>

**Q42. Backend fundamentals (don't let AI crowd these out).**

- Async helps only with async libraries; a blocking SDK in an async route blocks the loop.
- Django: `select_related` / `prefetch_related`; index filtered fields and FKs; `EXPLAIN ANALYZE`.
- Idempotency keys + unique constraints + persisted state.
- Celery: `acks_late`, idempotent tasks, retry with backoff, dead letters.
- Caching: TTLs, invalidation, stampede protection.
- Migrations: expand → migrate → contract.
- Path traversal: validate IDs and filenames with strict patterns ([P1](#p1) API does).

<a id="q43"></a>

**Q43. Working with frontend engineers?** Agree early on the API contract, streaming events, loading/error/empty/cancel states, citation shape, feedback events, status messages for slow steps, and which actions need confirmation. **Proof:** [P1](#p1) studio, [P6](#p6) console, [P2](#p2) per-error messages.

<a id="q44"></a>

**Q44. "What would you change in your own project?"** [D4](#d4). Having an honest answer is the point.

<a id="part8"></a>

## Part 8 · AgentCore, Bedrock and HIPAA

### 8.1 Amazon Bedrock AgentCore

**One line:** AWS's platform to build, deploy, connect, govern and evaluate agents. Framework-agnostic (LangGraph, LangChain, CrewAI, Strands, custom) and model-agnostic (Bedrock models and others).

| Service | What it does | Your bridge |
|---|---|---|
| **Runtime** | Each session in its own **microVM** (isolated CPU, memory, filesystem; sanitized at end). Up to **8 hours**; ends after **15 min idle**. HTTP, **MCP**, **A2A**, **AG-UI**; WebSocket streaming. Platform version V2 now in more regions; **Runtime Instances** give persistent sessions up to 14 days | Session isolation = tenant safety by construction |
| **Memory** | Short-term (session events) and long-term (facts, preferences, summaries) | Zep / Graphiti experience ([P3](#p3)) |
| **Gateway** | APIs and Lambdas → **MCP tools** with central auth; **MCP sessions** per authenticated user (default 1 h, up to 8 h); **Bedrock InvokeModel support with model fallback** (Oct 2026); Web Answer connector for cited web answers (Nov 2026) | Your fallback chains ([Q12](#q12)) and MCP servers ([P8](#p8)) |
| **Identity** | Inbound JWT/IAM; outbound OAuth and API keys via a token vault; can reference Secrets Manager secrets | Agents act with the caller's permissions |
| **Policy** | **Cedar** rules on the Gateway: deterministic allow or deny on every tool call, outside the model. GA Mar 2026 | Your principle: authorization never lives in the prompt |
| **Observability** | Step traces, tokens, latency; OpenTelemetry; CloudWatch; new **OverheadLatency** metric isolates platform time | Langfuse habits, AWS-native |
| **Evaluations** | LLM-as-judge and code evaluators, online and batch. GA Mar 2026 | Your RAGAS/DeepEval gates ([Q21](#q21)) |
| **Built-in tools** | Browser and Code Interpreter in isolated sessions | Safe execution of model-written code |
| **Around it** | AgentCore CLI 1.0 (Oct 2026); CDK L2 constructs stable (May 2026); Agent Registry GA (Aug 2026); optimization that turns production traces into improvements | IaC and governance |

> **Say:** "I haven't shipped on AgentCore. But its design is the one I've been hand-building: isolated sessions, tools behind MCP with central auth, deterministic policy outside the model, traces and evals as first-class, and since October, model fallback in the Gateway. My work would be mapping patterns I already use onto managed services."

| Choose AgentCore when | Choose self-managed when |
|---|---|
| Multi-tenant isolation matters; long sessions; AWS-native client; you want managed identity, policy, evals | Short deterministic pipelines; steady high volume where cost dominates; portability across clouds |

### 8.2 Amazon Bedrock essentials

- **Converse API:** one message format across Bedrock models.
- **Guardrails:** content filters, denied topics, PII redaction, contextual grounding checks (new Standard tier at the Classic price), Automated Reasoning checks.
- **Knowledge Bases** (managed RAG), prompt caching, batch inference, cross-region inference profiles.
- **Posture:** HIPAA-eligible; data not used to train base models; PrivateLink; KMS.

> **Say:** "Bedrock matters in healthcare because inference stays inside the customer's AWS boundary, under the same IAM, VPC and CloudTrail as everything else."

<a id="hipaa"></a>

### 8.3 HIPAA in five minutes

| Term | Meaning |
|---|---|
| Covered entity | Providers, health plans, clearinghouses |
| Business associate | A vendor handling PHI for them (a firm like Leapfrog can be one) |
| [BAA](#g-baa) | Required before a vendor touches PHI |
| PHI | Health information tied to an individual; Safe Harbor de-identification removes 18 identifier types |
| Minimum necessary | Use only what the task needs |
| Audit controls | Who accessed what, when |

> **Say:** "PHI never enters a prompt unless the endpoint is BAA-covered; otherwise I de-identify upstream and re-identify only at presentation, with an audit trail. Deterministic logic for anything safety-critical. And compliance is a property of the whole system and organization. I learned that the hard way when my own audit found SmartClaim's public pages claiming HIPAA compliance the code didn't support ([S2](#s2))."

<a id="part9"></a>

## Part 9 · System design drills

**Jump:** [D1 Referral intake](#d1) · [D2 LLM gateway](#d2) · [D3 Policy assistant](#d3) · [D4 reelslicer to production](#d4)

**Frame every time:** clarify (users, data, tenants, latency, read-only or actions, cost of a wrong answer, compliance boundary) → draw the main path → data and authorization → **three failure modes before they ask** → evals and observability → trade-offs. Never open with a vendor name.

<a id="d1"></a>

### D1 · Agentic referral intake on AWS (mirrors their product)

**Prompt:** "Faxed and scanned referrals arrive all day. Extract patient, referring provider, diagnosis codes and urgency; create the referral in the EHR; send uncertain cases to staff."

```text
 Fax / scan / portal
        │
        ▼
 S3 (KMS, versioned) ──► EventBridge ──► SQS (+ DLQ)
                                          │
                                          ▼
                 Extraction worker (ECS or AgentCore Runtime)
                  ├─ Textract: OCR, forms, tables
                  ├─ Bedrock (Claude via PrivateLink), strict schema:
                  │    patient, provider, ICD-10, urgency,
                  │    evidence spans, confidence
                  ├─ Deterministic validators: ICD-10 exists, NPI valid,
                  │    patient match ladder MRN → DOB+name → review
                  └─ Bedrock Guardrails: PII, grounding
                                          │
              ┌───────────────────────────┴──────────────────┐
              ▼                                              ▼
   Confident + valid                           Low confidence / conflict
   → EHR API (idempotency key)                 → human review queue (UI)
              └────────────────► Audit log ◄─────────────────┘
                        (who, what, sources, prompt version, model)

 Cross-cutting: AgentCore Policy (Cedar) on EHR write tools · OTel traces
 with PHI redacted · labeled-referral eval set in CI · per-tenant KMS keys
```

- **The model proposes; code verifies codes** ([S4](#s4)).
- **Patient matching is the dangerous step:** a ladder, ties to humans ([S3](#s3)).
- **Idempotency keys** on EHR writes; dedupe duplicate faxes by content hash + patient + date.
- **Metrics:** field accuracy on labeled referrals, straight-through rate, queue age, cost per referral, reviewer correction rate fed back into evals.
- **Failure modes:** bad OCR; duplicate faxes; EHR outage (queue, retry, never drop).

<a id="d2"></a>

### D2 · Resilient multi-provider LLM gateway

```text
 Client ─► FastAPI gateway
            ├─ Auth + tenant
            ├─ Redis token buckets (RPM + TPM per tenant)
            ├─ PII policy (redact or block by endpoint coverage)
            ├─ Cache: exact → semantic (only where allowed)
            ├─ Router: task class → tier; breaker state per provider
            ├─ Adapters: Bedrock Converse · Anthropic · OpenAI · Gemini
            ├─ Validate → one repair (low-risk only) → validated fallback
            └─ Async telemetry: tokens, cost, latency, prompt version
```

Decisions: fallback only between validated prompt/schema pairs; separate connect, first-token and total timeouts; hard per-tenant budgets; streaming passthrough with cancellation; the gateway owns retries so services don't stack their own. Mention AgentCore Gateway's model fallback as the managed alternative.

<a id="d3"></a>

### D3 · Clinician policy assistant (RAG with permissions)

Ingestion (scan, parse, structure-aware chunks, version, ACL) → query (auth → role filters → hybrid → re-rank → bounded context) → answer only from sources with chunk IDs → citation check → stream with sources → feedback and audit. Tables: `documents`, `document_chunks`, `access_policies`, `ai_runs`, `feedback`. Insufficient evidence returns "I couldn't find support in the approved sources", never a guess.

<a id="d4"></a>

### D4 · Take reelslicer from MVP to multi-tenant production (self-critique)

Your strongest "what would you change" answer. Start from the honest status in [P1](#p1).

| Today | Production version | Why |
|---|---|---|
| No auth | Auth with tenants and roles (kanban K22) | Nothing else matters until this exists |
| SQLite (WAL) on one box | RDS Postgres with `tenant_id` + RLS | Concurrency, backups, isolation |
| In-memory thread job tracker | SQS + workers (ECS or an EC2 autoscaling group with FFmpeg), job state in the DB, idempotent jobs | Survives restarts; scales renders independently |
| Local disk + optional S3 sync timer | S3 as the source of truth, presigned uploads | No data on a single instance |
| Vendor adapters never run live | Run the bake-off on the golden set, choose an engine per language from measured WER/CER | ADR 0002: measure first |
| Placeholders (clip length, counts, thinking) | Tune from editor verdicts | Numbers come from data |
| Logs | CloudWatch metrics: render time, queue age, vendor errors by class, cost per clip, acceptance rate | The four JD axes plus product |

**Failure modes to name:** a vendor outage mid-batch (resume from saved outputs, never re-pay); a render stuck on one worker (timeouts, visibility timeout, DLQ); a consent flag missing on an item (the pipeline refuses, by design).

<a id="part10"></a>

## Part 10 · Live coding kit

Python 3.11+. All snippets parse. Your real-world version of C1 is reelslicer's `http.py` ([P1](#p1)); say so.

**Jump:** [C1 retries + fallback](#c1) · [C2 RRF](#c2) · [C3 SSE streaming](#c3) · [C4 pgvector](#c4) · [C5 prompt review](#c5) · [Coding-round protocol](#coding-round)

<a id="c1"></a>

### C1 · Typed output, bounded retries, provider fallback

```python
from __future__ import annotations

import asyncio
import logging
import random
from collections.abc import Awaitable, Callable, Sequence
from dataclasses import dataclass
from typing import Literal

from pydantic import BaseModel, Field, ValidationError

logger = logging.getLogger(__name__)


class ReferralExtraction(BaseModel):
    urgency: Literal["routine", "urgent", "emergent"]
    icd10_codes: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    evidence_quotes: list[str]


class TransientProviderError(Exception):
    """429, 5xx, overloaded, connection reset: safe to retry."""

    def __init__(self, message: str, retry_after_s: float | None = None) -> None:
        super().__init__(message)
        self.retry_after_s = retry_after_s


class PermanentProviderError(Exception):
    """400, 401, 403, 422, content policy: retrying only repeats the cost."""


class AllProvidersFailedError(Exception):
    """Every provider failed; the caller routes the item to human review."""


@dataclass(frozen=True)
class Provider:
    name: str
    call: Callable[[str], Awaitable[str]]  # returns raw JSON text
    timeout_s: float = 20.0
    max_attempts: int = 3
    max_delay_s: float = 30.0


def _backoff_delay(provider: Provider, attempt: int, exc: Exception) -> float:
    if isinstance(exc, TransientProviderError) and exc.retry_after_s is not None:
        return min(exc.retry_after_s, provider.max_delay_s)  # provider's hint, capped
    return min(provider.max_delay_s, 2.0 ** (attempt - 1)) * random.uniform(0.5, 1.0)


async def _call_with_retries(provider: Provider, prompt: str) -> str:
    for attempt in range(1, provider.max_attempts + 1):
        try:
            async with asyncio.timeout(provider.timeout_s):
                return await provider.call(prompt)
        except (TransientProviderError, TimeoutError) as exc:
            if attempt == provider.max_attempts:
                raise
            delay = _backoff_delay(provider, attempt, exc)
            logger.warning(
                "llm.retry",
                extra={"provider": provider.name, "attempt": attempt,
                       "delay_s": round(delay, 2), "error": type(exc).__name__},
            )
            await asyncio.sleep(delay)
    raise RuntimeError("unreachable: the loop always returns or raises")


async def extract_referral(prompt: str, chain: Sequence[Provider]) -> ReferralExtraction:
    for provider in chain:
        try:
            raw = await _call_with_retries(provider, prompt)
            return ReferralExtraction.model_validate_json(raw)
        except ValidationError as exc:
            logger.error("llm.schema_violation",
                         extra={"provider": provider.name, "errors": exc.error_count()})
        except (TransientProviderError, PermanentProviderError, TimeoutError) as exc:
            logger.warning("llm.provider_failed",
                           extra={"provider": provider.name, "error": type(exc).__name__})
    raise AllProvidersFailedError("all providers failed; route to human review")
```

**Narrate:** retries only for transient errors; `Retry-After` wins but is capped; schema errors aren't retried; last resort is a human queue. **Production additions:** a circuit breaker per provider, a total deadline across the chain, per-provider prompt variants, metrics on every branch.

<a id="c2"></a>

### C2 · Reciprocal Rank Fusion

```python
from collections import defaultdict
from collections.abc import Sequence


def reciprocal_rank_fusion(
    rankings: Sequence[Sequence[str]], k: int = 60
) -> list[tuple[str, float]]:
    """Fuse ranked ID lists (e.g. dense + lexical). score(d) = sum of 1 / (k + rank)."""
    scores: defaultdict[str, float] = defaultdict(float)
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] += 1.0 / (k + rank)
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)
```

<a id="c3"></a>

### C3 · FastAPI SSE streaming with cancellation

```python
import json
import logging
from collections.abc import AsyncGenerator, Callable
from typing import Annotated, Any

from fastapi import Depends, FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
app = FastAPI()

TokenStream = Callable[[str], AsyncGenerator[str, None]]


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=4000)


def get_token_stream() -> TokenStream:
    """Provider adapter (Bedrock / Anthropic / OpenAI streaming), wired in lifespan."""
    raise NotImplementedError


def sse(payload: dict[str, Any]) -> str:
    return f"data: {json.dumps(payload)}\n\n"


@app.post("/v1/chat/stream")
async def chat_stream(
    body: ChatRequest,
    request: Request,
    stream: Annotated[TokenStream, Depends(get_token_stream)],
) -> StreamingResponse:
    async def events() -> AsyncGenerator[str, None]:
        tokens = stream(body.query)
        try:
            async for token in tokens:
                if await request.is_disconnected():
                    logger.info("chat.client_disconnected")
                    return
                yield sse({"type": "token", "text": token})
            yield sse({"type": "done"})
        finally:
            await tokens.aclose()  # close the upstream stream: stop paying for tokens

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```

<a id="c4"></a>

### C4 · pgvector: schema, indexes, tenant-safe retrieval

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     uuid         NOT NULL,
    document_id   uuid         NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
    doc_version   integer      NOT NULL,
    section_path  text         NOT NULL,
    content       text         NOT NULL,
    content_tsv   tsvector     GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    embedding     vector(1536) NOT NULL,
    embed_model   text         NOT NULL
);

CREATE INDEX document_chunks_embedding_hnsw
    ON document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX document_chunks_tsv_gin ON document_chunks USING gin (content_tsv);
CREATE INDEX document_chunks_tenant_doc ON document_chunks (tenant_id, document_id);

-- Second wall: row-level security (the app role must not own the table, or use FORCE)
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON document_chunks
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Dense candidates (inside a transaction)
SET LOCAL hnsw.ef_search = 100;
SET LOCAL hnsw.iterative_scan = relaxed_order;  -- pgvector 0.8+: keeps scanning when filters drop rows

SELECT id, section_path, 1 - (embedding <=> $1) AS cosine_similarity
FROM document_chunks
WHERE tenant_id = $2
ORDER BY embedding <=> $1
LIMIT 50;

-- Lexical candidates (ts_rank_cd is not true BM25)
SELECT id, ts_rank_cd(content_tsv, q) AS rank
FROM document_chunks, websearch_to_tsquery('english', $1) AS q
WHERE tenant_id = $2 AND content_tsv @@ q
ORDER BY rank DESC
LIMIT 50;
```

| Operator | Meaning |
|---|---|
| `<->` | L2 distance |
| `<=>` | Cosine distance (similarity = 1 − distance) |
| `<#>` | **Negative** inner product |
| `<+>` | L1 distance |

HNSW: better recall and speed, slower builds, more memory (`m`, `ef_construction`, `ef_search`). IVFFlat: faster builds, needs data before building, tune `lists` and `probes`.

<a id="c5"></a>

### C5 · "Review this prompt" checklist

Role and task clear · context separated from instructions · untrusted-content rule stated · output schema explicit · missing-information behavior defined · edge-case few-shot examples · no secrets · no wasted tokens · no reliance on the prompt for authorization · **versioned and fingerprinted, with an eval case** ([Q20](#q20)).

<a id="coding-round"></a>

### Coding-round protocol (LeetCode-style was reported)

1. Restate the problem and confirm one example aloud.
2. State brute force and its complexity in one sentence.
3. Name the pattern: hash map, two pointers, sliding window, stack, heap, BFS/DFS, intervals, binary search on answer.
4. Write typed, readable code; name variables for the reader.
5. Walk one example through the code by hand; then an edge case (empty, one element, duplicates).
6. Give final time and space complexity.

Warm up Tuesday with 3 mediums from your `150-leetcode-problems` repo, one per pattern you feel least sure about.

<a id="part11"></a>

## Part 11 · Behavioral and culture

| Value | Your evidence |
|---|---|
| Customer focus | 100% JSS across 100+ jobs |
| Accountable freedom | Self-directed delivery; you flag problems early ([S3](#s3)) |
| Being remarkable | Measure-first engineering ([S5](#s5)) |
| Celebrating efforts | **[fill]** a time you credited a teammate or client |
| Embracing openness | You audited your own app and wrote down what was wrong ([S2](#s2)) |

| Prompt | Angle |
|---|---|
| Short-term delivery vs long-term health | Ship the smallest end-to-end slice, but guardrails and observability are part of done; if the deadline forbids it, ship behind a flag with manual review and say the trade-off out loud |
| A production failure | [S2](#s2) or [S3](#s3) |
| Disagreement | **[fill]** argued with data, then committed |
| A mistake | **[fill]** small, real, with what changed afterward |
| Learning fast | How you'd ramp on AgentCore: docs → small spike → map one of your patterns → measure |
| Explaining AI to non-engineers | "LLMs are non-deterministic; here's how we make the product deterministic around them" |
| "What are you passionate about?" | Answer without the word: "AI systems people can trust in high-stakes work. A guardrail that stops one bad output satisfies me more than a demo." |

<a id="part12"></a>

## Part 12 · Questions to ask them

Pick two or three.

1. "Your Marketplace listing for referral and MedRec automation runs on Bedrock and AgentCore. For client work, is AgentCore the default, or does it depend on each client's constraints?"
2. "AgentCore Gateway added model fallback in October. Do you route models through Gateway, or keep your own layer?"
3. "How are prompt and model changes gated today? Is building that harness part of this role?"
4. "What's the hardest integration problem right now: extraction accuracy on poor faxes, latency, cost, or compliance?"
5. "In flows like Addy, how do reviewer corrections feed back into evaluation?"
6. "Is there a shared AI platform team, or does each product team integrate directly? Where would this role sit?"
7. "What does success look like at 90 days?"

**Always close with:** "Is there anything in my background you'd like me to clarify?"

No salary questions in the technical round.

<a id="part13"></a>

## Part 13 · Mock drill and scoring

Timer on. 90 seconds each. No notes. Record it. Score 0 to 2. **Gate: 32 of 40.**

| # | Question | Answer lives in |
|---|---|---|
| 1 | Background and why this role | [5.1](#intro) |
| 2 | Walk me through your career dates and education | [R1](#r1), [R2](#r2), [5.6](#decide) |
| 3 | Tell me about reelslicer | [P1](#p1) |
| 4 | Why segment numbers instead of timestamps? | [S4](#s4) |
| 5 | What broke in production? | [S2](#s2), [S3](#s3) |
| 6 | Draw a RAG system you built | [S1](#s1), [Q1](#q1) |
| 7 | Chunk size and overlap? | [Q3](#q3) |
| 8 | Vector vs hybrid search? | [Q5](#q5) |
| 9 | Tenant-safe retrieval? | [Q8](#q8), [C4](#c4) |
| 10 | OpenAI and Claude behind one service? | [Q18](#q18) |
| 11 | A 429 or a timeout: what happens? | [Q12](#q12), [C1](#c1) |
| 12 | How do you version prompts? | [Q20](#q20) |
| 13 | Prompt injection from a document or tool? | [Q25](#q25) |
| 14 | What's on your AI dashboard? | [Q36](#q36) |
| 15 | Explain one resume metric: baseline, mechanism, measurement | [M-table](#m-table) |
| 16 | Design referral intake | [D1](#d1) |
| 17 | What would you change in reelslicer for production? | [D4](#d4) |
| 18 | What is AgentCore and when would you use it? | [Part 8](#part8) |
| 19 | How do you use AI coding assistants without shipping slop? | [S9](#s9) |
| 20 | Integrating speech-to-text: what do you measure? | [Q39](#q39) |

**0** vague, wrong, or theoretical · **1** correct but missing trade-off, implementation or example · **2** principle + implementation + trade-off + your proof.

<a id="m-table"></a>

### Metric defense table (fill before Tuesday ends)

| They'll ask | 72% latency | 12K RPM | 2M events/day @ 37 ms | 35% AWS | 41% LLM cost ([R3](#r3)) |
|---|---|---|---|---|---|
| Baseline (number, endpoint, period) | | | | | |
| How measured (p50/p95, tool, window) | | | | | |
| What changed, by impact | async FastAPI, Redis, batching, query tuning | zero-downtime monolith → microservices | containerized pipeline, PostgreSQL sharding | rightsizing, RDS optimization | embedding cache, semantic dedup |
| Your share vs team's | | | | | |
| What you'd do differently | | | | | |

<a id="part14"></a>

## Part 14 · Day-of checklist

**Monday night**

- [ ] [R1](#r1), [R2](#r2): documents fixed; option A, B or C chosen
- [ ] [R8](#r8): GitHub profile README Django line fixed
- [ ] [R9](#r9): SmartClaim public pages checked and fixed
- [ ] [R14](#r14): reelslicer README mutation sum fixed
- [ ] [5.6](#decide) table filled

<a id="pin"></a>

**Pin these on GitHub** (interviewers have opened candidates' repos before calls). reelslicer is private, so offer a screen-share walkthrough instead:

1. `smart-claim-ai` (healthcare, strict schema, honest `work-done.md`)
2. `revops-lead-scoring-platform` (production hygiene, shadow model)
3. `tcm-med-ai` (Pinecone + Cohere Rerank)
4. `recruit-cli` (injection-aware, on PyPI)
5. `transcribeXplatform` (multi-provider audio)
6. `automated-trading` (only after [R6](#r6) is settled)

**Wednesday**

- [ ] Confirm meeting link or office location from the invite; if onsite, Dillibazar, Charkhal, arrive 15 minutes early
- [ ] Camera, mic, connection, hotspot backup; quiet room; water; pen and paper for diagrams
- [ ] Tabs: resume, kneeraazon.com, GitHub, JD, reelslicer.com; a blank editor for live coding
- [ ] Logged in by 12:50

**During:** think aloud; state assumptions; start simple, then add reliability, cost and security; end every design answer with what breaks first; stop talking when the answer is complete.

**After:** write down every question within an hour.

<a id="part15"></a>

## Part 15 · One-page cheat sheet

**Identity:** backend engineer first, AI integration second. Python, FastAPI, Django, Postgres/pgvector, Redis, Celery, AWS, Next.js.

**Projects in one line each**

- **reelslicer** ([P1](#p1)): live clip service (EN/HI/NE); model answers in segment numbers only; prompt version + SHA-256 pinned by test; consent-gated vendors; 1,435 tests; EC2 + Vercel. *Vendor calls not yet live.*
- **SmartClaim** ([P2](#p2)): 46 Medicare LCD criteria; strict schema; `store: false`; hashed user id; 20/h + `Retry-After`; per-error messages; the "model named LLM" bug.
- **Financial RAG** ([P3](#p3)): Graphiti + FalkorDB, Qdrant, ColBERT, RAGAS/DeepEval, Langfuse. Subcontract.
- **FastKwan** ([P4](#p4)): Pinecone 30 → Cohere Rerank 5; fixed 502s, named 503s.
- **recruit-cli** ([P5](#p5)): score bounded, category derived in code, stop after 3 failures.
- **Pilot** ([P6](#p6)): frontend console; flagged resolver bug + Slack injection.

**Numbers you can defend:** 72% API latency ↓ · 12K RPM @ 99.99% · 2M+ events/day @ 37 ms · releases 2 days → 2 h · AWS −35% · 100% JSS. **41%: only if decided ([R3](#r3)).**

**Leapfrog:** 2010 · Himal Karmacharya, Chandika Bhandari · CEO Chris Sprague · Seattle + Kathmandu · AWS Advanced Tier, AI + DevOps, Agentic AI Consulting · Addy (ASUI 15,700 pages/month, 98%) · Referral & MedRec on Bedrock + AgentCore · DocWeaver (Neptune + AgentCore) · IVR with Nova Sonic.

**AgentCore:** Runtime (microVM, 8 h, MCP/A2A/AG-UI) · Memory · Gateway (MCP tools, sessions, model fallback) · Identity · Policy (Cedar) · Observability · Evaluations · Browser + Code Interpreter.

**Reliability:** timeouts · retry transient only · backoff + jitter + capped `Retry-After` · breaker · validated fallback · idempotency · honest degradation.

**Lines to land**

- "Let the model choose; let code compute."
- "A system prompt is not a security boundary."
- "You don't eliminate hallucination. You engineer containment."
- "A generic error message is an outage you can't see."
- "A passing test suite only proves the tests pass."

**Close:** "This role describes the layer I already build: validation, reliability, measurement and cost around the model. I'd like to build it on healthcare products, with a team, long enough to see it mature."

<a id="part16"></a>

## Part 16 · Sources

**Role and company**

- [Leapfrog: AI Integration Engineer vacancy](https://career.lftechnology.com/o/ai-integration-engineer-1)
- [AWS case study: ASUI and Leapfrog (Addy)](https://aws.amazon.com/solutions/case-studies/asui-leapfrog-technology)
- [AWS partner case study: Leapfrog and Eduphoric (DocWeaver, Addy, CEO)](https://aws.amazon.com/partners/success/leapfrog-eduphoric-case-study/)
- [AWS Marketplace: Referral and MedRec Processing Using Agentic AI](https://aws.amazon.com/marketplace/pp/prodview-gp73myzmn7os4)
- [AWS Marketplace: Healthcare AI Accelerator POC](https://aws.amazon.com/marketplace/pp/prodview-447pvciyyxra6)
- [Leapfrog blog: Addy and AWS Bedrock](https://www.lftechnology.com/blogs/revolutionizing-patient-referral-management-addy-healthcare-aws-bedrock)
- [Leapfrog on LinkedIn](https://linkedin.com/company/lftechnology)
- [OnlineKhabar: founders and CEO](https://english.onlinekhabar.com/?p=553788)
- [Glassdoor: Senior Fullstack interview, Kathmandu](https://www.glassdoor.ie/Interview/Leapfrog-Technology-Senior-Fullstack-Engineer-Interview-Questions-EI_IE943236.0,19_KO20,45.htm)
- [Glassdoor: interview reports incl. GitHub checked](https://www.glassdoor.ca/Interview/LeapFrog-Interview-Questions-E14879.htm)
- [Glassdoor: resume-driven interview, 2020](https://www.glassdoor.co.uk/Interview/Leapfrog-Technology-Interview-E943236-RVW51595865.htm)

**AgentCore and AWS**

- [AgentCore FAQs](https://aws.amazon.com/bedrock/agentcore/faqs/)
- [AgentCore release notes (Nov 2026)](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)
- [ICYMI: what landed for AI builders, October 2026](https://aws.amazon.com/blogs/machine-learning/icymi-what-landed-for-ai-builders-in-october-2026/)
- [Runtime: how it works](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html)
- [Runtime: isolated sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html)
- [Policy and Evaluations GA](https://aws.amazon.com/fr/blogs/aws/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/)
- [Runtime Instances](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances-how-it-works.html)
- [Cohere Health on AgentCore](https://aws.amazon.com/blogs/machine-learning/how-cohere-health-digitizes-clinical-policies-using-amazon-bedrock-agentcore)
- [Bluesight Prism on AgentCore](https://aws.amazon.com/blogs/machine-learning/building-an-agentic-ai-solution-at-bluesight-with-amazon-bedrock/)

**Technical:** [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) · [pgvector](https://github.com/pgvector/pgvector)

**Your own material:** [resume.kneeraazon.com](https://resume.kneeraazon.com) · [kneeraazon.com](https://kneeraazon.com) · [github.com/karkinirajan](https://github.com/karkinirajan) (public READMEs and commit histories of 16 repos) · reelslicer (private: README, ADRs 0001-0014, `http.py`, `prompt.py`, `gemini_text.py`, API, deployment, kanban) · proposal fact base (portfolio library confirmed 17 Nov 2026) · your notes on Pilot, financial RAG, EkJhalak, career history.

**Not checked** (needed your approval while you were away, or out of reach): kneeraazon.com `/projects` and `/experience` pages; live smartclaimai.vercel.app content ([R9](#r9)); private repos other than reelslicer (`pilot`, `Therapist`, `ekjhalak`, `sheeshshoes`); the author of the Towards AI article "Beyond Faster Development" (still unconfirmed; don't cite a name).

<a id="part17"></a>

## Part 17 · Glossary

| Term | Meaning |
|---|---|
| <a id="g-rrf"></a>**RRF** | Reciprocal Rank Fusion: score = Σ 1/(k + rank), k ≈ 60. Fuses ranked lists without normalizing scores ([C2](#c2)) |
| <a id="g-colbert"></a>**ColBERT** | Late-interaction retrieval: token-level embeddings, max-similarity matching; precise, document side precomputable |
| <a id="g-mrr"></a>**MRR** | Mean Reciprocal Rank: how high the first relevant result appears |
| <a id="g-ndcg"></a>**nDCG** | Ranking quality with graded relevance, discounted by position |
| <a id="g-ttft"></a>**TTFT** | Time to first token: prefill + network + retrieval. What users feel |
| **WER / CER** | Word / character error rate. For Devanagari, count over grapheme clusters |
| **Grapheme cluster** | What a reader sees as one character (a consonant plus vowel sign, a conjunct) |
| **Golden set** | Expert-labeled evaluation data; with a private **holdout** never used for tuning |
| **Mutation testing** | Inject deliberate bugs; a good suite must fail for each one |
| **Circuit breaker** | Stop calling a failing dependency for a while; route elsewhere |
| **Idempotency key** | Makes a retried write take effect once |
| **SSRF** | Server-side request forgery: tricking your server into fetching internal addresses |
| **RLS** | Postgres row-level security; per-row access rules, used for tenant isolation |
| **microVM** | A lightweight VM per session (AgentCore Runtime): VM-level isolation |
| **Cedar** | AWS's open policy language; AgentCore Policy uses it to allow or deny tool calls |
| **MCP / A2A / AG-UI** | Protocols: model-to-tools / agent-to-agent / agent-to-UI |
| <a id="g-baa"></a>**BAA** | Business Associate Agreement under HIPAA |
| **PHI** | Protected health information |
| **Shadow model** | A new model scoring alongside the live one, promoted only on evidence |
