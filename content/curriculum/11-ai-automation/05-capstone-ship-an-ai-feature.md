---
title: 'Capstone: ship an AI feature end to end'
level: 4
summary: A project brief that exercises the whole guide, with milestones, a definition of done and the write-up that turns it into interview evidence.
outcomes:
- Deliver an AI feature from requirements to production monitoring
- Produce a case study with decisions, numbers and honest gaps
- Defend every claim in it under follow-up questions
keypoints:
- Build one honest, finished, measured project, which beats many demos.
- 'Milestones: spec → auth + tenants → ingestion → hybrid retrieval → streamed cited answers → extraction + review → reliability → guardrails → evals in CI → deploy + observability → write-up.'
- 'Definition of done: live URL, README with decisions and **known gaps**, tests and evals in CI, defended numbers.'
- Write it up in the casebook format and rehearse the 60-second pitch.
projects:
- name: Policy Q&A and extraction SaaS
  stack:
  - Next.js
  - FastAPI
  - Postgres + pgvector + RLS
  - Celery
  - an LLM gateway
  - Langfuse
  - Vercel + a container host
  build: The capstone brief, with workspaces, uploads, cited streaming answers, schema extraction with review, and an admin cost and quality dashboard.
  practises: Everything in Parts 3–11 in one product.
- name: Meeting-notes copilot
  stack:
  - Next.js
  - FastAPI
  - an STT API
  - an LLM API
  - Postgres
  - Slack API
  build: Upload a recording, get a transcript and structured action items with evidence timestamps, and post them to Slack after a human edits them.
  practises: Voice, extraction, HITL and integration end to end.
---

## Why this matters

One finished, honest, measured project proves more than any certificate. This capstone is designed to produce exactly the evidence applied AI interviews ask for.

## The brief

Build a **document question-answering and extraction service** for a domain you care about (your city's regulations, a game's rulebook, open-source project docs, public policy documents):

- Users sign in and belong to a workspace (tenant).
- They upload documents; ingestion runs in the background.
- They ask questions and get streamed, cited answers, or an honest "not found".
- They can run a structured extraction (a fixed schema) on any document, with evidence and a review screen.
- Admins see a dashboard: usage, cost per task, quality metrics.

## Milestones

| # | Milestone | Lessons | Done when |
|---|---|---|---|
| 1 | Requirements, anti-goals, ADRs | 2.2, 2.4 | One-page spec with acceptance criteria |
| 2 | API + auth + tenants on Postgres | 3.1–3.4 | IDOR test passes |
| 3 | Ingestion worker | 3.6, 8.2 | Idempotent; delete removes everything |
| 4 | Hybrid retrieval + re-rank | 8.1–8.4 | Recall@5 measured on 30 questions |
| 5 | Streaming answers with citations | 4.5, 7.3 | Stop cancels upstream; citations verified |
| 6 | Extraction with validation + review UI | 11.3 | Field accuracy measured |
| 7 | Reliability + gateway | 10.1, 10.6 | Q12 table covered by tests |
| 8 | Guardrails | 10.3, 10.4 | Injection suite passes; no keys in logs |
| 9 | Evals in CI | 10.2 | Regression fails the build |
| 10 | Deploy + observability | 5.1–5.4, 10.5 | Live URL; dashboard; alerts |
| 11 | Write-up | 13.1 | Case study published |

## Definition of done

- Live deployment with a health check.
- README: what it is, how to run, architecture diagram, decisions, **known gaps and unverified parts**.
- Tests and evals in CI; numbers recorded with baseline and method.
- A 60-second pitch and a list of the follow-up questions you can answer.

## Write it up

Use the casebook format from [13.1](/13-casebook/01-presenting-projects): one line, why it matters, how it's built, decisions worth quoting, numbers, honest status, pitch, follow-ups.

## Interview follow-ups

- **"Walk me through your capstone."** Use the casebook format: one line, the architecture, two decisions with reasons, the eval numbers with baselines, honest gaps, and what you'd do next.
- **"What would break first at 100× users?"** Name it from your own measurements: provider rate limits, ingestion throughput, DB connections or cost. Then give the fix.

## Check yourself

<details markdown="1"><summary>What makes a project write-up credible to an interviewer?</summary>

Specific decisions with reasons, numbers with baselines and methods, an honest status (what isn't done or verified), and the ability to answer three levels of follow-up questions on any claim.

</details>

## What comes next

Part 12: [Career and interviews](/12-career-and-interviews), turning this work into offers.
