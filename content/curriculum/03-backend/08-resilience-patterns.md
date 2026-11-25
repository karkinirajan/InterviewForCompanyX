---
title: 'Resilience: timeouts, retries, circuit breakers'
level: 2
summary: How to call unreliable dependencies without letting their failures become yours, the foundation for every LLM integration.
outcomes:
- Set timeouts at every network boundary
- Retry only transient failures with backoff, jitter and a deadline
- Use circuit breakers, fallbacks and graceful degradation
keypoints:
- Set connect, read and total timeouts on every network call.
- Retry only transient errors (network, 429, 502–504) with capped exponential backoff, jitter, a capped `Retry-After` and a deadline.
- A circuit breaker fails fast when a dependency is down. Bulkheads stop one dependency from exhausting everything.
- Retry in **one** layer only, because 3 retries × 3 layers = 27 calls.
- Test fallbacks regularly, and degrade honestly rather than fabricating answers.
projects:
- name: Resilient client library
  stack:
  - Python
  - httpx
  - pytest
  - respx
  build: A wrapper with timeouts, retry policy, `Retry-After`, a breaker and structured retry logs, tested against simulated 429/503/timeouts.
  practises: The exact policy LLM integrations need.
- name: Fallback weather service
  stack:
  - FastAPI
  - two public APIs
  - Redis
  - toxiproxy
  build: Primary and secondary providers behind a breaker, cached last-known-good data, and chaos tests that kill the primary.
  practises: Breakers, fallbacks, graceful degradation.
---

## Why this matters

Every external call fails sometimes: networks drop, services overload, deploys restart pods. Without resilience patterns, one slow dependency ties up all your workers and takes your service down with it. Model providers are exactly this kind of dependency, slow and rate-limited, so this lesson is the bridge into Part 10.

## Core ideas

- **Timeouts everywhere:** connect, read and total. A call without a timeout can wait forever.
- **Retry only transient failures:** network errors, 429, 502, 503, 504. Never 400, 401, 403, 404, 422.
- **Exponential backoff with jitter:** wait 1 s, 2 s, 4 s... randomised, so clients don't retry in lockstep.
- **Respect `Retry-After`** when the server sends it, but cap it.
- **Bounded attempts and a total deadline,** so retries can't exceed what the user will wait.
- **Circuit breaker:** after repeated failures, stop calling the dependency for a cool-down period and fail fast (or use a fallback). Then let a trial request through.
- **Bulkhead:** isolate resources (separate pools or concurrency limits) so one failing dependency can't exhaust everything.
- **Fallback and graceful degradation:** a secondary provider, a cached answer, a queue for later, or an honest "not available right now". Never a fabricated answer.

## How to do it

```python
RETRYABLE = {429, 502, 503, 504}

async def call_with_retries(send, *, attempts=4, deadline_s=20.0, cap_s=30.0):
    start = time.monotonic()
    for attempt in range(1, attempts + 1):
        try:
            resp = await send()
        except (httpx.ConnectError, httpx.ReadTimeout):
            resp = None
        if resp is not None and resp.status_code not in RETRYABLE:
            return resp                        # success or a permanent error: stop
        if attempt == attempts:
            break
        retry_after = resp.headers.get("Retry-After") if resp is not None else None
        delay = min(float(retry_after), cap_s) if retry_after and retry_after.isdigit() \
            else min(cap_s, 2 ** (attempt - 1)) * random.uniform(0.5, 1.0)
        if time.monotonic() - start + delay > deadline_s:
            break                              # retrying would blow the deadline
        await asyncio.sleep(delay)
    raise DependencyUnavailable()
```

A fuller, typed version with provider fallback is [C1](#c1); a real-world one is described in [P1](#p1) (retries only network errors, 429 and 5xx; `Retry-After` capped at 30 s; four attempts; API key scrubbed from error bodies).

## Why this way

Retrying permanent errors only repeats the failure (and on paid APIs, the bill). Jitter prevents synchronised retry storms that keep a recovering service down. Breakers protect both you (no wasted waiting) and the dependency (room to recover).

## Common mistakes

- No timeout on outbound HTTP calls (some clients default to none).
- Retries at every layer (client, gateway, service), multiplying attempts: 3 × 3 × 3 = 27 calls. Retry in one place.
- Retrying non-idempotent writes without an idempotency key.
- A fallback that has never been tested, so it fails when needed.

## Check yourself

<details markdown="1"><summary>Which failures do you retry, and how?</summary>

Transient ones: network errors, timeouts, 429, 502, 503, 504. Use capped exponential backoff with jitter, honour a capped `Retry-After`, limit attempts and keep a total deadline. Never retry 4xx validation or auth errors ([Q12](#q12)).

</details>

<details markdown="1"><summary>What problem does a circuit breaker solve that retries don't?</summary>

Retries keep hammering a dependency that's down, tying up workers and delaying every request. A breaker notices sustained failure and fails fast (or uses a fallback) for a while, then probes recovery.

</details>

## Build it

Wrap a flaky fake service (fails 30% with 503, sometimes slow) with timeouts, retries and a simple breaker. Log every retry with attempt number and delay, and test that 400s are never retried.

## What comes next

Part 4: [Frontend engineering](/04-frontend). Or, if you're here to move into AI, jump to [Part 7](/07-llm-foundations) and come back.
