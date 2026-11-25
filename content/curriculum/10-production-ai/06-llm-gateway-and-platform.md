---
title: LLM gateways and AI platforms
level: 4
summary: Centralising provider access, limits, caching, policy and telemetry in a gateway, and the other shared services (prompt registry, eval harness) a company's AI platform needs.
outcomes: Justify a gateway and list what it centralises | Compare building a gateway with managed options | Describe a minimal internal AI platform
---

## Why this matters

When more than one team ships AI features, duplicated provider code, keys, retries and budgets become a liability. A shared gateway and platform make every team safer and faster, and designing one is a common senior interview question ([D2](#d2)).

## What a gateway centralises

- Provider credentials and rotation.
- Authentication, tenant identification, quotas and budgets.
- Request and token rate limiting.
- Retries, timeouts, breakers and validated fallbacks (the only place retries happen).
- Caching (exact, prompt-prefix, semantic where allowed).
- PII policy (redact or block by endpoint coverage).
- Telemetry: tokens, cost, latency, prompt version, outcome.
- Model routing by task class and configuration.

Full design: [D2](#d2).

## Build or buy?

| Option | Fit |
|---|---|
| Thin in-house gateway (FastAPI + Redis) | Full control; specific compliance rules; moderate scale |
| Open-source proxies (e.g. LiteLLM) | Fast start, many providers; you still operate it |
| Cloud gateways (cloud agent gateways, Vercel AI Gateway, others) | Managed fallback, observability and billing; vendor coupling |

Decide on data boundaries, compliance, the providers you need, operational capacity and cost. Many teams start with a library-level adapter ([7.3](/07-llm-foundations/03-calling-model-apis)) and grow it into a service when the second team arrives.

## The rest of a minimal AI platform

| Component | Purpose |
|---|---|
| Prompt registry | Versioned prompts with fingerprints, model compatibility and eval scores ([Q20](#q20)) |
| Eval harness | Golden sets, judges, baselines, CI gates ([10.2](/10-production-ai/02-evaluation)) |
| Retrieval service | Shared ingestion, chunking, hybrid search with permission filters |
| Tool / MCP registry | Approved tools with owners, scopes and policies |
| Observability | Shared tracing and dashboards ([10.5](/10-production-ai/05-observability-and-cost)) |
| Policy | Which data classes may go to which models |

## Common mistakes

- A gateway that silently falls back to unevaluated models.
- Teams adding their own retries on top of the gateway's.
- A platform built before two real consumers exist.

## Check yourself

<details markdown="1"><summary>Why should only the gateway retry?</summary>

Retries at several layers multiply attempts (3 × 3 × 3 = 27), amplify outages and multiply cost. One owner of retry policy keeps behaviour predictable.

</details>

## Build it

Turn your adapter from 7.3 into a small gateway service with per-tenant token buckets, a cache, telemetry and a validated fallback, following [D2](#d2).

## Worked example: a request through the gateway

```text
POST /v1/complete  {task: "ticket_summary", tenant: t_42, input: "..."}
 1. authenticate service token → tenant t_42, team "support"
 2. policy: ticket_summary may use tiers [small, medium]; PII → redact (endpoint not covered)
 3. budget: t_42 has $38.10 of $50 left today → ok; TPM bucket 12k/60k → ok
 4. cache: key = sha256(model|prompt_v|params|tenant|redacted_input) → miss
 5. route: small model; breaker closed
 6. call with connect 3 s / first-token 8 s / total 30 s
 7. validate against ticket_summary schema → ok
 8. store cache entry (TTL 1 h); emit telemetry {tokens, cost, latency, prompt_v, outcome}
 9. respond 200 with usage headers
```

Failure branches: step 3 fails → 429 with `Retry-After`; step 6 times out twice → breaker trips → validated fallback model; step 7 fails → one repair for this low-risk task, else 502 with a stable error code.

## Interview follow-ups

- **"Isn't the gateway a single point of failure?"** It's stateless, so run several replicas behind a load balancer; Redis (limits, cache) degrades gracefully (fail open on cache, choose fail-open or fail-closed per budget); clients have short timeouts.
- **"How do teams change prompts without redeploying the gateway?"** Prompts and routes live in a registry with versions; the gateway reads the active label; changes go through eval gates.
- **"How do you charge teams back?"** Per-call cost tagged by tenant/team/feature, aggregated daily; budgets enforced at the gateway.

## More check-yourself

<details markdown="1"><summary>Which three timeouts should a streaming gateway enforce, and why separate them?</summary>

Connect, time-to-first-token and total. A single total timeout can't distinguish a stuck generation (no first token after many seconds) from a long, healthy stream; separate limits fail fast on the first and allow the second.

</details>

<details markdown="1"><summary>What must be in the gateway's cache key?</summary>

Model and version, prompt version, all output-affecting parameters, the normalised (and redacted) input, and the tenant or authorization scope.

</details>

## What comes next

Part 11: [AI automation and integration](/11-ai-automation).
