---
title: Resume and profile, claim by claim
level: 2
summary: Every statement on the resume (resume.kneeraazon.com) and the GitHub profile README, mapped to its evidence and to the lesson that prepares you to defend it, with the facts only you can supply marked.
outcomes:
- Defend any line of your CV or GitHub profile under three follow-up questions
- Know which claims still need your numbers before an interview
- Keep the CV, profile and this guide consistent when either changes
keypoints:
- "Rule: **every line has evidence and a lesson behind it**, or it comes off the CV."
- "✓ means covered: the evidence is in a case study and the concepts in a lesson. ✎ means the guide explains it, but the numbers or facts are yours to fill in."
- Metrics need a baseline, a measurement method, a mechanism and your share. Fill the defense rows before any interview.
- "Removed in November 2026 for lack of project evidence: Kafka, Elasticsearch, GCP, Azure, Kubernetes, Prometheus/Grafana, LlamaIndex, pgvector (as built work), Bandit."
- When you edit the CV or profile, update this page in the same sitting.
projects:
- name: Claims register as data
  stack: [YAML, Python, GitHub Actions]
  build: Keep every CV claim in a YAML file with its evidence link and guide lesson; generate this table and fail CI if a claim lacks either.
  practises: Making consistency a checked property, not a memory exercise.
- name: Earn a removed skill
  stack: [Postgres + pgvector, FastAPI, the C4 schema]
  build: Build the multi-tenant knowledge base from lesson 8.4 end to end, then add pgvector back to the CV with that repository as evidence.
  practises: Turning a gap into a claim you can defend.
---

## Why this matters

Interviews follow the CV line by line, interviewers open the GitHub profile, and reference checks compare documents. A claim you can't explain costs more than a claim you never made. This page is the audit: every statement, where its evidence lives, and which lesson prepares the answer.

**Legend:** ✓ covered (evidence in a case study, concepts in a lesson) · ✎ the guide explains it, but the number or fact is yours to fill in.

## Identity and summary

| Claim | Evidence | Defend with | Status |
|---|---|---|---|
| Senior Backend & AI Engineer · Python | Casebook P1–P19 | [0.2](/00-start-here/02-the-career-map), [12.2](/12-career-and-interviews/02-your-narrative) | ✓ |
| 7+ years building production APIs, retrieval systems and full-stack products | Work history below | [12.2](/12-career-and-interviews/02-your-narrative) | ✎ must agree with your final dates |
| Top Rated on Upwork, 100% Job Success Score | Upwork profile | [12.4](/12-career-and-interviews/04-behavioral-and-culture) | ✓ |
| 80+ delivered projects for 75+ clients | Upwork history | [12.1](/12-career-and-interviews/01-the-hiring-process) (one number everywhere) | ✓ decided: use 80+ / 75+ on every document |
| Python, FastAPI, Django, RAG, cloud infrastructure | [P1](#p1), [P3](#p3), [P4](#p4), [P7](#p7), [P12](#p12) | Parts [3](/03-backend), [5](/05-cloud-devops-security), [8](/08-rag) | ✓ |
| 41% lower LLM inference cost | Embedding caches + semantic deduplication | [Q37](#q37), [3.5](/03-backend/05-caching-and-redis) | ✎ kept: fill the defense row below |
| 72% lower API latency | Async FastAPI + Redis redesign ([S6](#s6)) | [3.7](/03-backend/07-async-concurrency-performance) | ✎ fill the defense row |
| 35% lower AWS spend | Rightsizing, RDS optimisation | [5.2](/05-cloud-devops-security/02-cloud-fundamentals-aws) | ✎ fill the defense row |

## Experience

| Claim | Evidence | Defend with | Status |
|---|---|---|---|
| Production RAG and LLM systems: chat, semantic search, agentic workflows with OpenAI, Claude, Gemini, LangChain, LangGraph | [P3](#p3), [P4](#p4), [P8](#p8), [P2](#p2), [P6](#p6) | Parts [7](/07-llm-foundations), [8](/08-rag), [9](/09-agents) | ✓ |
| 41% LLM cost cut via embedding caches and semantic dedup | (yours) | [Q37](#q37), [3.5](/03-backend/05-caching-and-redis) | ✎ |
| 72% lower latency with async FastAPI, Redis, batching, query tuning | [S6](#s6) | [3.7](/03-backend/07-async-concurrency-performance), [3.3](/03-backend/03-relational-databases-and-sql) | ✎ |
| Django platform scaled to 12,000 requests/minute at 99.99% uptime via zero-downtime microservices migration | [S7](#s7) | [6.1](/06-system-design/01-fundamentals), [2.5](/02-software-lifecycle/05-ci-cd-and-releases) (expand/contract) | ✎ cut-over, consistency, monitoring, rollback |
| Containerised ingestion pipeline, 2M+ events/day at 37 ms average latency | (yours) | [3.6](/03-backend/06-background-jobs-and-queues), [5.1](/05-cloud-devops-security/01-linux-docker-nginx) | ✎ know why average, not p95 |
| AWS spend down 35% (infrastructure and RDS optimisation) | (yours) | [5.2](/05-cloud-devops-security/02-cloud-fundamentals-aws) | ✎ |
| CI/CD with GitHub Actions: releases from 2 days to 2 hours | (yours) | [2.5](/02-software-lifecycle/05-ci-cd-and-releases) | ✎ what was slow before, what changed |
| Pathway: Django/DRF platforms for React and Next.js clients; MySQL and MongoDB tuning | (yours) | [3.2](/03-backend/02-python-web-frameworks), [3.3](/03-backend/03-relational-databases-and-sql) | ✎ dates pending |
| Merohealth: Django, DRF, React, Next.js features for a healthcare platform; components used by a 10,000+ user dashboard | [P12](#p12) MeroHealth backend | [3.4](/03-backend/04-authentication-and-authorization), [5.6](/05-cloud-devops-security/06-privacy-and-compliance) | ✎ dates pending; confirm the 10,000+ figure (no repository shows it) |
| Food and Beverage Nepal: solo-built Django product and catalogue platform; performance, accessibility, SEO | (yours) | [4.1](/04-frontend/01-html-css-and-the-browser), [3.2](/03-backend/02-python-web-frameworks) | ✎ dates pending |

### Metric defense rows (fill before any interview)

| Metric | Baseline (number, endpoint, period) | How measured | What changed, by impact | Your share | What you'd do differently |
|---|---|---|---|---|---|
| 41% LLM cost | [fill] | [fill] | embedding cache, semantic dedup | [fill] | [fill] |
| 72% latency | [fill] | [fill] | async FastAPI, Redis, batching, query tuning | [fill] | [fill] |
| 12K RPM at 99.99% | [fill] | [fill] | zero-downtime monolith → microservices | [fill] | [fill] |
| 2M events/day at 37 ms | [fill] | [fill] | containerised pipeline, Postgres sharding | [fill] | [fill] |
| 35% AWS | [fill] | [fill] | rightsizing, RDS optimisation | [fill] | [fill] |
| 2 days → 2 hours releases | [fill] | [fill] | GitHub Actions automation | [fill] | [fill] |

## Selected projects (resume)

| Project | Case study | Status |
|---|---|---|
| RevOps lead scoring (formula + shadow XGBoost, Celery, score simulator, signed HubSpot/Salesforce webhooks) | [P7](#p7) | ✓ |
| Pilot AI operations console (Next.js, Claude chat, Zep) | [P6](#p6) | ✓ claim the console and findings only |
| EkJhalak bilingual news (RSS, Groq, Supabase) | [P11](#p11) | ✓ |
| Delta hedging platform (Black–Scholes, IG demo API, confirmed orders) | [P19](#p19) | ✓ |
| SmartClaim AI (46 LCD L35041 criteria, six-step checklist, structured OpenAI output) | [P2](#p2) | ✓ |
| Nestpane (local-first MV3 new tab, encrypted Drive backup) | [P13](#p13) | ✓ |
| Spinoza's Ethics (6 SVG diagrams, Groq Geometric Advisor) | [P18](#p18) | ✎ confirm the live URL: the resume says `ethicsbyspinoza.vercel.app`, the repository says `spinoza-ethics.vercel.app` |
| TexecN, CBT coach, Sheesh Shoes | [P14](#p14), [P10](#p10), [P15](#p15) | ✓ |
| Additional: Clarity, Everest Smart Traders, quantitative routing, trading arena, FastKwan, recruitment CLI, VoiceTech radar, budget tracker | [P12](#p12), [P16](#p16), [P9](#p9), [P8](#p8), [P4](#p4), [P5](#p5), [P10](#p10), [P17](#p17) | ✓ |

## Skills (resume)

| Skill line | Evidence | Lesson |
|---|---|---|
| RAG, hybrid retrieval, reranking | [P3](#p3), [P4](#p4) | [8.3](/08-rag/03-hybrid-search-and-reranking) |
| LLM agents and tool orchestration; LangChain, LangGraph, FastMCP | [P8](#p8) | [9.2](/09-agents/02-tool-calling-and-the-agent-loop), [9.3](/09-agents/03-mcp-and-agent-protocols) |
| OpenAI, Claude, Gemini | [P2](#p2), [P6](#p6), [P1](#p1), [P5](#p5) | [7.3](/07-llm-foundations/03-calling-model-apis) |
| Pinecone, Qdrant, ColBERT, Cohere Rerank | [P4](#p4), [P3](#p3) | [8.4](/08-rag/04-vector-stores-and-pgvector) |
| RAGAS, DeepEval, Langfuse | [P3](#p3) | [10.2](/10-production-ai/02-evaluation), [10.5](/10-production-ai/05-observability-and-cost) |
| Python, FastAPI, Django, DRF, Flask | [P7](#p7), [P10](#p10), [P12](#p12), [P19](#p19) | [3.2](/03-backend/02-python-web-frameworks) |
| AsyncIO, Celery, WebSockets | [P7](#p7), [P10](#p10) (voice WebSocket) | [3.6](/03-backend/06-background-jobs-and-queues), [3.7](/03-backend/07-async-concurrency-performance) |
| Pydantic, REST API design; caching, idempotency, retries | [P1](#p1), [P2](#p2), [P7](#p7) | [3.1](/03-backend/01-api-design), [3.5](/03-backend/05-caching-and-redis), [3.8](/03-backend/08-resilience-patterns) |
| React, Next.js, TypeScript | [P1](#p1), [P2](#p2), [P14](#p14), [P15](#p15) | Part [4](/04-frontend) |
| PostgreSQL, MongoDB, Redis; Supabase, Neon, SQLite | [P15](#p15), [P4](#p4), [P7](#p7), [P2](#p2), [P11](#p11) | [3.3](/03-backend/03-relational-databases-and-sql), [3.5](/03-backend/05-caching-and-redis) |
| AWS, Vercel, Cloudflare | [P1](#p1), [P11](#p11) | [5.2](/05-cloud-devops-security/02-cloud-fundamentals-aws), [5.3](/05-cloud-devops-security/03-deployment-platforms) |
| Docker, Nginx, Linux | [P1](#p1), [P15](#p15), [P7](#p7) | [5.1](/05-cloud-devops-security/01-linux-docker-nginx) |
| GitHub Actions, Playwright, k6 | [P1](#p1), [P15](#p15), [P10](#p10) | [2.5](/02-software-lifecycle/05-ci-cd-and-releases), [2.3](/02-software-lifecycle/03-testing-strategy) |

## Education

| Claim | Status |
|---|---|
| Electronics and Communications engineering, IOE Pokhara | ✎ pending your exact wording and dates. Write it exactly as it is: a degree title with an end date reads as completed ([12.1](/12-career-and-interviews/01-the-hiring-process)) |

## GitHub profile README

| Section | Claims | Evidence | Status |
|---|---|---|---|
| Intro | Production AI systems, Python backends, full-stack products; RAG, agents, scoring engines; Top Rated, 100% JSS | Casebook | ✓ |
| AI agents, RAG and compliance | OpenAI, Claude, Gemini, Groq pipelines; LangChain/LangGraph agents, FastMCP servers; Pinecone + Cohere Rerank retrieval with MongoDB Atlas Search; Zep memory | [P2](#p2), [P4](#p4), [P5](#p5), [P6](#p6), [P8](#p8), [P11](#p11) | ✓ |
| Scoring, quant and risk | Lead scoring with shadow XGBoost; Black–Scholes delta hedging; deterministic regime routing | [P7](#p7), [P19](#p19), [P9](#p9) | ✓ |
| Python backends | FastAPI, Django/DRF, Flask, Celery + Redis, SQLAlchemy/Alembic, signed CRM webhooks, token/session security (Kruxova, Clarity, CBT coach) | [P7](#p7), [P10](#p10), [P12](#p12) | ✓ |
| Full-stack and local-first | Next.js 16, React 19, TypeScript, Nuxt 4, Three.js storefront, bilingual news reader, MV3 workspace with Web Crypto sync | [P15](#p15), [P11](#p11), [P12](#p12) (Clarity on Nuxt), [P13](#p13), [P14](#p14) | ✓ |
| How I work | Existing codebases first; real gates (Ruff, mypy, ESLint, pytest, Vitest, Playwright against real Postgres, mutation testing); security in the loop | [S9](#s9), [2.3](/02-software-lifecycle/03-testing-strategy), [5.5](/05-cloud-devops-security/05-application-security) | ✓ |
| Stack table | AI, RAG & ML, Backend, Frontend, Browser, Data, DevOps, Quality rows | As above, plus [P17](#p17) (Prisma), [P15](#p15) (Drizzle) | ✓ |

## Check yourself

<details markdown="1"><summary>Which claims must you fill in before your next interview?</summary>

Every ✎ row: the six metric defense rows, the final career dates (which also set "7+ years"), the education line, the Merohealth 10,000+ figure, and the Spinoza live URL.

</details>

## What comes next

Back to the [interview route](/interview-route), or [Part 14: Reference](/14-reference).
