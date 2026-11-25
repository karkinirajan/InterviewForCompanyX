---
title: From full-stack to applied AI
level: 3
summary: What carries over from full-stack engineering, what's genuinely new, and a 90-day plan for making the move.
outcomes: Explain what changes when a dependency is non-deterministic | Map your existing skills onto applied AI responsibilities | Follow a concrete plan to build credible AI experience
---

## Why this matters

Most applied AI engineers are full-stack or backend engineers who added a new skill set. Knowing what transfers stops you from starting over, and knowing what's new stops you from shipping a demo and calling it a product.

## What carries over directly

| Full-stack skill | Applied AI use |
|---|---|
| API design, validation | Model I/O contracts, structured outputs, error taxonomies |
| Resilience patterns | Retries, fallbacks and breakers around providers ([3.8](/03-backend/08-resilience-patterns)) |
| Databases, indexing | Vector search in Postgres, metadata filters, tenant isolation |
| Queues and jobs | Batch processing, document pipelines, durable agent steps |
| Auth | Permission-aware retrieval, tool authorization |
| Testing, CI | Eval suites as CI gates |
| Observability | Tokens, cost per task, quality drift |
| Frontend | Streaming, citations, human approval UIs |

## What's genuinely new

1. **Non-determinism:** the same input can produce different outputs. You test with distributions and thresholds, not exact equality.
2. **Plausible wrongness:** failures look like confident, well-formed answers. Validation has to check meaning, not only shape.
3. **Instructions and data share a channel:** any text the model reads can try to give it orders (prompt injection).
4. **Cost scales with text:** every token in and out is billed; prompts and context size are budget decisions.
5. **Latency is seconds, not milliseconds,** and dominated by output length.
6. **Quality drifts** when providers update models, when your data changes, or when users ask new things.
7. **Evaluation is a discipline:** golden sets, metrics, judges and human labels.

## The core principle

> **Say:** "I treat every model call as an unreliable dependency: a typed schema checked on every reply, retries only for transient errors with `Retry-After` honored, timeouts and a fallback path that's actually tested, and evals plus tracing so I see quality move, not just uptime."

## A 90-day plan

| Weeks | Do | Evidence you'll have |
|---|---|---|
| 1–2 | Parts 7.2–7.5; call two providers; structured output with validation | A typed client with retries and a fake for tests |
| 3–5 | Part 8: build RAG over a document set you care about, on pgvector | Hybrid retrieval + re-ranking + an eval set with recall@k |
| 6–8 | Part 9: one agent with two or three tools, budgets and human approval | Traces of real runs; a runaway-agent test |
| 9–11 | Part 10: guardrails, gateway, cost dashboard | A dashboard and a prompt-injection test suite |
| 12–13 | Write it up as a case study (Part 13) | A README with decisions, numbers and honest gaps |

## Common mistakes

- Treating prompt-writing as the whole job.
- Starting with an agent framework before understanding the API underneath.
- No evaluation, so "it seems better" decides everything.

## Check yourself

<details markdown="1"><summary>Name four things that are genuinely new when your dependency is an LLM.</summary>

Non-deterministic output; plausible, confident wrongness; instructions and data sharing one channel (prompt injection); cost and latency scaling with tokens; quality drift; evaluation as a discipline.

</details>

## Build it

Write your own version of the one-sentence reliability principle above, and list which of your existing projects already shows each part of it.

## What comes next

[7.2 How LLMs work](/07-llm-foundations/02-how-llms-work).
