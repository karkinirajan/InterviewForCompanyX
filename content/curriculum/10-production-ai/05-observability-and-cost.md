---
title: AI observability and cost control
level: 4
summary: Tracing model and agent calls, the dashboard an AI feature needs, drift detection, and budgets that stop cost surprises.
outcomes: Instrument every model call with the fields that matter | Build an AI dashboard across seven layers | Set budgets and alerts per tenant and feature
---

## Why this matters

AI features can degrade without errors (quality drift) and get expensive without traffic growth (longer prompts, loops, abuse). The usual RED metrics aren't enough; you need quality and cost signals too. Job descriptions name them explicitly: latency, cost per query, accuracy drift and token usage.

## Instrument every call

Per call: request ID, tenant, feature, model and version, prompt version and fingerprint, input/output/cached tokens, cost, time to first token, total latency, retries, fallback used, outcome (ok, schema violation, refusal, incomplete, error class). For agents add step number, tool name and outcome. Tools: OpenTelemetry plus an LLM tracing tool (Langfuse, LangSmith, Phoenix, cloud-native tracing). Don't log raw content containing personal data by default.

<a id="q36"></a>

## Q36. Your AI dashboard?

| Layer | Metrics |
|---|---|
| API | Rate, errors, p50/p95/p99 |
| Provider | Latency, timeouts, 429s, errors by class |
| Cost | Tokens in/out, cache hits, **cost per successful task** |
| RAG | Recall@k on the eval set, empty-retrieval rate |
| Generation | Faithfulness, schema violations, refusals |
| Agent | Steps per task, tool success, loops, approvals |
| Product | Corrections, acceptance, abandonment |

> **Say:** "Latency, cost per query, accuracy drift and token usage: the four things job descriptions list are four rows of that dashboard."

## Drift

- **Input drift:** users ask new kinds of questions (watch topic clusters, empty-retrieval rate).
- **Model drift:** the provider changes behaviour (pin versions; run scheduled evals).
- **Data drift:** documents change or go stale (index freshness metrics).
- **Quality drift:** sampled judge scores, correction rates and acceptance trend down.

## Cost control

- Budgets per tenant and per feature, with alerts at 50/80/100%.
- Hard caps on `max_tokens` per request class and on agent spend per run ([9.6](/09-agents/06-controlling-agents)).
- Cost per successful task tracked weekly; investigate jumps.
- The levers list in [Q37](#q37).

## Common mistakes

- Monitoring uptime only.
- Cost dashboards by provider bill, monthly, too late to act.
- Tracing that stores full prompts with personal data.

## Check yourself

<details markdown="1"><summary>Name the seven layers of an AI dashboard.</summary>

API, provider, cost, RAG, generation, agent, product.

</details>

<details markdown="1"><summary>Quality complaints rise but error rate is flat. Where do you look?</summary>

Sampled judge scores and correction rates over time; whether the model version or prompt changed; retrieval metrics (empty retrieval, recall on the eval set); index freshness; new query types appearing.

</details>

## Build it

Instrument your project's model calls with the fields above, send them to a tracing tool, and build a one-page dashboard with cost per successful task.

## What comes next

[10.6 LLM gateway and AI platform](/10-production-ai/06-llm-gateway-and-platform).
