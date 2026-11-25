---
title: Reliability for LLM calls
level: 4
summary: Failure classes of model APIs and the right response to each, rate limiting, fallbacks, and honest degradation, with the C1 reference implementation.
outcomes:
- Map each provider failure to the correct response
- Rate-limit by requests and tokens, per tenant
- Implement typed output, bounded retries and provider fallback
keypoints:
- 'Q12 table: transient errors → backoff and jitter with a capped Retry-After, bounded; persistent → breaker and validated fallback; 4xx/policy → never retry; schema violation → one repair or fallback or human; all down → degrade honestly.'
- Rate-limit **tokens** and requests per tenant, and return 429 with Retry-After.
- 'Streaming needs three timeouts: connect, first token, total.'
- Never pay twice. Save raw replies first and write outputs atomically.
- Fall back only to **evaluated** models.
projects:
- name: Chaos-tested LLM client
  stack:
  - Python
  - httpx
  - respx
  - pytest
  - Pydantic
  build: Implement C1 with a breaker and deadline, and test every Q12 row against simulated providers.
  practises: Reliability policy, provably.
- name: Batch extraction with resume
  stack:
  - Python
  - SQLite
  - an LLM batch API
  build: Process 1,000 documents, kill it mid-run, resume without re-paying, and report cost and failure classes.
  practises: Never pay twice; failure taxonomies.
---

## Why this matters

Model APIs time out, rate-limit, overload, change behaviour and occasionally return garbage. Your product must keep working (or fail honestly) through all of it. This builds directly on [3.8 Resilience patterns](/03-backend/08-resilience-patterns).

<a id="q12"></a>

## Q12. Provider times out, returns 429, or returns garbage?

| Failure | Response |
|---|---|
| 429 / 5xx / timeout / network | Retry with capped exponential backoff + jitter; `Retry-After` wins (capped); bounded attempts and a total deadline |
| Persistent failures | Circuit breaker opens; route to a validated fallback provider |
| 400 / 401 / 422 / policy | Never retry: it only repeats the cost. Fail fast, alert |
| Schema violation | Not transient. One bounded repair for low-risk tasks, else fallback or human queue |
| Everything down | Degrade honestly: queue, cached answer, non-AI path. Never fabricate |

Casebook evidence: an HTTP layer that retries only network errors, 429 and 5xx, capping `Retry-After` at 30 s ([P1](#p1)); a CLI that stops after three consecutive model failures, a simple circuit breaker ([P5](#p5)); an app mapping each failure to its own status code ([P2](#p2)). Code: [C1](#c1).

<a id="q16"></a>

## Q16. Rate limits?

Per-user and per-tenant quotas, concurrency caps, a Redis token bucket on TPM as well as RPM, queues for non-interactive work, provider-aware backoff. Return 429 with `Retry-After` to your own clients (for example 20 evaluations per hour per user, [P2](#p2)).

## Timeouts for streaming calls

Use three: **connect** (a few seconds), **time to first token** (catches stuck generations early), and **total** (bounded by what the user will wait). A single long total timeout hides stuck requests.

## Never pay twice

Save the raw paid reply before parsing; write outputs atomically ("whole or not at all"); a failed write marks the item failed rather than crashing the batch; refuse to re-send finished items. Resuming after an outage then costs nothing extra.

## Honest degradation

When no validated model is available: queue the request and tell the user when to expect it, serve a cached answer clearly marked as such, or fall back to the non-AI path (a search, a form, a human). Never invent an answer to look available.

## Common mistakes

- Retrying 400s and policy refusals.
- Falling back to an unevaluated model.
- Retries stacked at the SDK, service and gateway levels.
- A single generic error for every failure, which hides outages ([S2](#s2)).

## Interview follow-ups

- **"The provider is degraded but not down: slow, occasional errors."** Latency-based breakers (trip on p95 over a threshold), hedged requests for idempotent reads, or route a share of traffic to the fallback, all watched on the dashboard.
- **"How do you test the fallback path?"** Unit tests with fake failing providers, plus a scheduled game day that forces fallback in staging and checks eval quality on the fallback model.

## Check yourself

<details markdown="1"><summary>A reply fails schema validation. Retry?</summary>

It's not a transient error, so not a blind retry. For low-risk tasks, one bounded repair attempt (send the validation error back); otherwise a validated fallback provider or a human queue. Log it as a schema violation for the dashboard.

</details>

<details markdown="1"><summary>Why limit tokens per minute and not only requests?</summary>

Cost and provider limits scale with tokens. One request with a huge context can cost as much as hundreds of small ones and exhaust the provider's token quota for everyone.

</details>

## Build it

Implement [C1](#c1) with two fake providers (one flaky, one slow) and tests for every row of the Q12 table.

## What comes next

[10.2 Evaluation](/10-production-ai/02-evaluation).
