---
title: Model selection, cost and latency
level: 3
summary: Choosing models on evidence, routing tasks to tiers, the levers that cut cost and latency, and switching models safely.
outcomes: Choose a model with an evaluation, not a leaderboard | Estimate and reduce cost per task | Switch or add providers without breaking quality
---

## Why this matters

Model choice decides quality, latency and cost, the three numbers every AI product is judged on. New models arrive monthly; teams that can evaluate and switch safely get better and cheaper over time, while others stay stuck or break things.

## Choosing a model

Judge candidates on **your** task with **your** eval set:

| Criterion | Measure |
|---|---|
| Quality | Eval score on your golden set; schema compliance; refusal rate |
| Latency | Time to first token and total, at p50 and p95 |
| Cost | Cost per *successful* task, not per token |
| Data terms | Storage, training use, region, compliance coverage |
| Availability | Rate limits, uptime, regional endpoints |
| Capabilities | Context length, tool use, vision/audio, structured output |

Leaderboards tell you what to try, not what to ship.

### Tiering and routing

Route each task class to the cheapest model that passes its eval: a small model for classification and extraction, a large or reasoning model for hard synthesis. Keep the route in configuration so it can change without a deploy.

## Cost

```text
cost per call = input_tokens × input_price + output_tokens × output_price (+ cache reads/writes)
cost per task = Σ calls per task (retries, tools, judges included) / success rate
```

<a id="q37"></a>

### Q37. Cost levers?

Model tiering · prompt caching on static prefixes · exact and embedding caches · semantic cache only where privacy allows · smaller context after re-ranking · batch APIs for offline work · `max_tokens` per class · per-tenant budgets · **never pay twice**: keep every paid reply and refuse to re-send finished items ([P1](#p1)).

> **Say:** "A cheaper answer that makes the user ask twice isn't cheaper."

<a id="q38"></a>

### Q38. Latency levers?

Measure first. Split [TTFT](#g-ttft) (prefill, network, retrieval) from time per output token (model size, output length). Stream; cache prefixes; smaller models where quality holds; parallel retrieval; re-rank only top-k; concise schemas; async I/O; region proximity; background jobs off the critical path.

## Switching models safely

<a id="q15"></a>

### Q15. Switching models safely?

Versioned config; run the eval set on the candidate (quality, schema compliance, refusals, latency, cost); canary a slice; watch; instant rollback. Pin dated snapshots. Same discipline as promoting a shadow model only on evidence ([P7](#p7)).

<a id="q18"></a>

### Q18. One interface for many providers?

Normalize request, response and errors; keep provider-specific capabilities reachable; centralize keys and config; instrument every call. Choose by quality, latency, cost, data terms and availability. **Fallback only between providers whose prompts and schemas you've validated.** See [S10](#s10): the adapter hides transport, not semantics.

## Self-hosted and open-weight models

Running open-weight models yourself (vLLM, Ollama, cloud GPU endpoints) gives data control and predictable cost at steady high volume, at the price of GPUs, operations and usually lower quality than frontier APIs. Choose when data can't leave your boundary, volume is high and steady, or a small fine-tuned model meets the quality bar. When benchmarking locally, pin the exact model build and context settings so results are comparable.

## Common mistakes

- Picking the newest or biggest model for everything.
- Measuring cost per token instead of per successful task.
- Silent provider fallback to an unevaluated model.

## Check yourself

<details markdown="1"><summary>Why measure cost per successful task rather than per call?</summary>

Retries, failed validations, multi-step tools and user re-asks all add calls. A cheap model that fails half the time can cost more per useful result than an expensive one that succeeds.

</details>

<details markdown="1"><summary>Name five cost levers.</summary>

Model tiering, prompt caching, response caching, trimming context after re-ranking, batch APIs for offline work, per-class `max_tokens`, per-tenant budgets, never paying twice for the same item.

</details>

## Build it

Run the same 30-item eval set through two models; produce a table of quality, p95 latency and cost per successful task; write a one-paragraph recommendation.

## What comes next

[7.6 Prompting, RAG or fine-tuning?](/07-llm-foundations/06-prompting-rag-or-fine-tuning)
