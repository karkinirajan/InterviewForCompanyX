---
title: The career map
level: 0
summary: The five levels from intern to applied AI engineer, what each one is trusted with, and the skills that move you up.
outcomes: Place yourself on the ladder honestly | Name the skill gap between your level and the next | Explain what an "applied AI engineer" does and doesn't do
---

## Why this matters

Job titles vary wildly between companies, but the *trust* behind them doesn't. A senior engineer at one company and a mid-level at another often do the same work. Thinking in terms of what you're trusted with gives you a stable map, and tells you what to learn next.

## The five levels

| Level | Trusted with | Typical gap to the next level |
|---|---|---|
| **L0 · Intern** | A well-defined ticket, with someone checking the result | Tools fluency (git, terminal, debugger); reading unfamiliar code |
| **L1 · Junior** | A feature end to end inside an existing design, with tests and review | Data modelling, auth, deployment, debugging production |
| **L2 · Mid-level** | A service or a product area: its data, API, deploys and on-call | Designing for failure, scale and change; making trade-offs explicit |
| **L3 · Senior** | A system across teams; technical direction; raising others' work | Influence without authority; choosing what *not* to build |
| **L4 · Applied AI** | Putting LLMs, retrieval and agents into production systems reliably, safely and at a known cost | Depth: evaluation science, platform design, domain compliance |

L4 isn't "above" L3 in seniority. It's a **specialisation built on L2–L3 engineering**. A good applied AI engineer is at least a solid mid-level backend or full-stack engineer who has added a new set of tools and, more importantly, a new set of failure modes.

## What an applied AI engineer actually does

A typical job description for this role (titles include *AI Integration Engineer*, *AI Engineer*, *LLM Engineer*, *Applied AI Engineer*) asks for some version of this list:

1. Integrate model APIs (Claude, GPT, Gemini, open-weight models, cloud platforms like Bedrock or Vertex) into products.
2. Build retrieval-augmented generation: ingestion, chunking, vector stores, retrieval tuning.
3. Build agentic workflows with frameworks or custom orchestration.
4. Engineer, version and evaluate prompts.
5. Add guardrails: validation, filtering, fallbacks.
6. Monitor latency, cost per request, quality drift and token usage.
7. Work with frontend engineers to surface AI in the product.
8. Own the AI layer across the software lifecycle: design, testing, deployment, operations.

Notice what's missing: training foundation models, research, writing CUDA kernels. That's ML engineering and research, a different path. Notice also that items 5–8 are classic backend and platform engineering applied to a new kind of dependency.

> **Say:** "An applied AI engineer builds the connective tissue between model APIs, product systems and users. Calling the model is the easy part. The value is the service around it: contracts, validation, retries, measurement, deployment."

## The usual migration path

Most applied AI engineers today didn't start there. A common path, and the one this guide follows:

1. **Years 0–2:** learn one backend stack deeply (for example Python with Django or FastAPI, or TypeScript with Node), plus enough frontend to ship a feature alone.
2. **Years 2–4:** own services in production. Learn databases, queues, caching, cloud, CI/CD, observability, security. Get paged and learn from it.
3. **The pivot:** start adding LLM features to products you already understand: a summariser, a classifier, a support assistant. The engineering habits carry over; the new skill is managing a non-deterministic dependency.
4. **Depth:** RAG, agents, evaluation, guardrails, cost control, platform work (gateways, prompt registries, eval harnesses).

The pivot works because companies need people who can make AI *behave inside real systems*, and that's a full-stack skill set with new edges.

## How levels are judged in interviews

| Signal | Junior answer | Senior answer |
|---|---|---|
| "How would you add retries?" | "Wrap it in a loop" | "Only for transient errors, with backoff and jitter, a total deadline, honoring `Retry-After`, and never for a 400" ([Q12](#q12)) |
| "How do you know it works?" | "I tested it" | "Here's the eval set, the metric, the baseline, and the dashboard that shows when it drifts" |
| "Which database?" | Names one | Asks about access patterns, consistency, scale and team skills first, then picks and names the trade-off |

The senior pattern is always the same: **principle → implementation → trade-off → proof from your own work.** You'll see that shape in every answer in this guide.

## Check yourself

<details markdown="1"><summary>Is an applied AI engineer a data scientist?</summary>

No. Data scientists analyse data and often train or evaluate models; ML engineers build training and serving pipelines. Applied AI engineers integrate existing models into products and own reliability, safety, cost and UX around them. The roles overlap at evaluation.

</details>

<details markdown="1"><summary>Why is L4 described as a specialisation, not a promotion?</summary>

Because the work assumes L2–L3 engineering skills (APIs, data, deploys, observability, security) and adds model-specific ones. A brilliant prompt writer who can't run a service in production isn't an applied AI engineer yet.

</details>

<details markdown="1"><summary>Name four of the eight responsibilities in a typical applied AI job description.</summary>

Any four of: integrate model APIs; build RAG; build agentic workflows; prompt engineering, versioning and evaluation; guardrails; monitoring latency, cost, drift and tokens; working with frontend to surface AI; owning the AI layer across the SDLC.

</details>

## Build it

Write one paragraph placing yourself on the ladder, with evidence: one thing you're trusted with today, and the one skill from the "gap" column you'll work on first. Keep it; reread it in three months.

## What comes next

[0.3 How to learn engineering](/00-start-here/03-how-to-learn-engineering): a study method that makes the rest of this guide stick.
