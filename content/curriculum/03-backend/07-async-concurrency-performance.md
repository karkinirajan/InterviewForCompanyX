---
title: Async, concurrency and performance
level: 2
summary: Concurrency models in Python and Node, finding the real bottleneck, and the backend fundamentals that AI work tends to crowd out.
outcomes:
- Choose threads, processes or async for a workload
- Profile before optimising and explain latency percentiles
- Apply the core backend fundamentals checklist
keypoints:
- Use async for many I/O waits, threads for blocking I/O libraries, and processes for CPU-bound Python.
- Report p50, p95 and p99, never only the average.
- 'Little''s law: in-flight ≈ arrival rate × time per request. Slow model calls mean many in flight.'
- Measure, trace one slow request, fix the biggest segment, then measure again.
- Bound concurrency with semaphores, and back every performance claim with a baseline, a method and a mechanism.
projects:
- name: Fan-out aggregator
  stack:
  - FastAPI
  - httpx
  - asyncio
  - k6
  build: An endpoint calling three slow services, first sequentially then with `gather`, a semaphore and a timeout; publish the p50/p95 before and after.
  practises: Concurrency, timeouts, measuring percentiles.
- name: CPU vs I/O benchmark
  stack:
  - Python
  - multiprocessing
  - threading
  - asyncio
  - py-spy
  build: Run the same CPU task and the same I/O task under threads, processes and async; profile with py-spy and explain the results.
  practises: The GIL and choosing a concurrency model.
---

## Why this matters

AI services are I/O-heavy (waiting on model providers, vector stores, databases) and sometimes CPU-heavy (parsing PDFs, audio processing). Choosing the right concurrency model, and measuring before optimising, is the difference between a service that scales and one that falls over at the first demo.

## Core ideas

- **Concurrency vs parallelism:** concurrency is juggling many tasks; parallelism is doing several at the same instant on multiple cores.
- **I/O-bound work** (network, disk): async or threads. **CPU-bound work:** processes, native code, or a separate worker.
- **Latency percentiles:** p50 is the typical request; p95/p99 are what your unluckiest users feel. Averages hide tail latency.
- **Throughput vs latency:** more parallelism raises throughput until a shared resource (DB connections, provider rate limits) saturates; then latency explodes.
- **Little's law:** concurrent requests ≈ arrival rate × time per request. If each request waits 5 s on a model, 20 requests per second means ~100 in flight.

## How to do it: find the bottleneck first

1. Measure end-to-end latency per endpoint (p50, p95, p99).
2. Trace one slow request: time in DB, in each external call, in your code ([5.4](/05-cloud-devops-security/04-observability)).
3. Fix the largest segment; re-measure.

Typical findings and fixes: N+1 queries → joins/prefetch; missing index → add one; sequential independent calls → `asyncio.gather`; repeated identical work → cache; synchronous SDK in async code → async client; big responses → pagination or streaming.

```python
# Independent I/O in parallel, with a timeout around the whole group
async with asyncio.timeout(3):
    profile, orders, recs = await asyncio.gather(
        repo.profile(uid), repo.orders(uid), recs_client.for_user(uid))
```

<a id="q42"></a>

## Backend fundamentals checklist (don't let AI crowd these out)

- Async helps only with async libraries; a blocking SDK in an async route blocks the loop.
- Django: `select_related` / `prefetch_related`; index filtered fields and foreign keys; `EXPLAIN ANALYZE`.
- Idempotency keys + unique constraints + persisted state.
- Celery: `acks_late`, idempotent tasks, retry with backoff, dead letters.
- Caching: TTLs, invalidation, stampede protection.
- Migrations: expand → migrate → contract.
- Path traversal: validate IDs and filenames with strict patterns.

## Why this way

Optimising without measurement usually improves the wrong thing. Percentiles reflect user experience; a p50 of 200 ms with a p99 of 8 s means one request in a hundred feels broken.

## Common mistakes

- Reporting average latency only.
- Adding async to CPU-bound code and expecting a speed-up.
- Unbounded concurrency (e.g. `gather` over 10,000 calls) that trips rate limits; use a semaphore.
- Claiming "I made it 72% faster" without a baseline, a measurement method and the mechanism. Every performance number on a CV needs all three ([S6](#s6)).

## Interview follow-ups

- **"The endpoint got slower after you added async. Why?"** A blocking call in the event loop (sync SDK, CPU work, `time.sleep`), or unbounded concurrency saturating a pool; profile with py-spy or loop-lag metrics.
- **"How many workers should a FastAPI service run?"** Roughly one process per CPU core for CPU-bound parts, with async handling concurrency within each; then size by load test, watching p95 and DB connection limits.
- **"Your DB has 100 connections and you have 20 pods."** Use a pooler (PgBouncer), small per-pod pools, and keep transactions short; count total connections across replicas.
- **"How do you prove a performance improvement?"** Same workload, same environment, before and after, percentiles (not averages), enough samples, and the mechanism that explains the gain.

## Check yourself

<details markdown="1"><summary>When do threads, processes and async each fit?</summary>

Async for many concurrent I/O waits with async libraries; threads for I/O with blocking libraries; processes (or separate workers) for CPU-bound work, because of the GIL in CPython.

</details>

<details markdown="1"><summary>Why look at p99 rather than the average?</summary>

Averages hide the slow tail. p99 shows what 1% of requests experience, and for users who make many requests per session, hitting the tail is common.

</details>

## Build it

Write an endpoint that calls three slow fake services sequentially, measure p50/p95 with a load tool (`hey`, `k6`, or `locust`), switch to `asyncio.gather` with a semaphore and a timeout, and measure again.

## What comes next

[3.8 Resilience patterns](/03-backend/08-resilience-patterns).
