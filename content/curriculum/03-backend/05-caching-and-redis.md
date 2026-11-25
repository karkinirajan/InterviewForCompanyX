---
title: Caching and Redis
level: 2
summary: Where to cache, how to invalidate, how to avoid stampedes, and the Redis data structures behind sessions, rate limits and queues.
outcomes:
- Choose a caching layer and an invalidation strategy
- Prevent cache stampedes
- Implement a rate limiter with Redis
keypoints:
- Cache-aside with a TTL is the default. The database stays the source of truth.
- The cache key must include everything that changes the answer, **including who's asking**.
- Prevent stampedes with jittered TTLs, single-flight locks or early refresh.
- Redis gives you atomic counters for rate limits (requests **and tokens** per minute for LLM APIs).
- 'LLM caches: provider prompt caching, an exact response cache, and a semantic cache only where privacy allows.'
projects:
- name: Rate-limited public API
  stack:
  - FastAPI
  - Redis
  - k6
  build: A token-bucket limiter per user and per endpoint returning 429 with Retry-After, load-tested with k6.
  practises: Atomic Redis operations and rate-limit design.
- name: LLM response cache
  stack:
  - Python
  - Redis
  - an LLM API
  - Pydantic
  build: Cache completions keyed by model, prompt version, parameters, tenant and a normalised input hash; report hit rate and money saved.
  practises: Cache keys, TTLs, cost control.
---

## Why this matters

Caching is the cheapest performance win and the easiest way to serve wrong or private data. In AI systems it's also a major cost lever: an identical prompt answered from cache costs nothing ([Q37](#q37)).

## Core ideas

- **Layers:** browser → CDN → reverse proxy → application cache (Redis) → database cache. Cache as close to the user as correctness allows.
- **Cache-aside:** read cache; on miss, read the database and store the result with a TTL. The most common pattern.
- **Invalidation:** TTL expiry (simple, eventually fresh), explicit delete on write (fresh, easy to miss a path), or versioned keys (`user:42:v7`).
- **Cache key scope:** a key must include everything that changes the answer, **including who is asking**. A key without the tenant or user is a data leak.
- **Stampede:** a popular key expires and thousands of requests hit the database at once. Fix with a lock (one request rebuilds), early refresh, or jittered TTLs.
- **Redis:** an in-memory data store with strings, hashes, lists, sets, sorted sets and streams, plus TTLs and atomic operations.

## How to do it

```python
async def get_profile(user_id: int) -> Profile:
    key = f"profile:v2:{user_id}"
    if (hit := await redis.get(key)) is not None:
        return Profile.model_validate_json(hit)
    profile = await repo.load_profile(user_id)
    await redis.set(key, profile.model_dump_json(), ex=300 + random.randint(0, 60))  # jittered TTL
    return profile
```

A fixed-window rate limiter (per user, per minute):

```python
async def allow(user_id: str, limit: int = 60) -> bool:
    key = f"rl:{user_id}:{int(time.time() // 60)}"
    count = await redis.incr(key)          # atomic
    if count == 1:
        await redis.expire(key, 60)
    return count <= limit
```

For LLM APIs, rate-limit **tokens per minute** as well as requests, because one huge prompt costs as much as hundreds of small ones ([Q16](#q16)). A token bucket (refilling over time) smooths bursts better than fixed windows.

## Caching LLM calls

| Cache | Hits when | Watch out for |
|---|---|---|
| Provider prompt caching | A long static prefix (system prompt, documents) repeats | Prefix must be byte-identical; check the provider's rules |
| Exact-match response cache | Same model, prompt version and input | Key must include model, prompt version, parameters and tenant |
| Semantic cache | A *similar* question was answered | Can return a wrong answer for a subtly different question; never across users with private data |

## Why this way

Cache-aside keeps the database as the source of truth and degrades gracefully when Redis is down. TTLs bound how stale data can be even when invalidation is missed. Jitter spreads expiries so they don't align into a stampede.

## Common mistakes

- Cache keys without tenant or permission context.
- Caching errors (a 500 cached for an hour).
- No TTL, so stale data lives forever.
- Using Redis as the only copy of important data without persistence configured.

## Interview follow-ups

- **"What happens when Redis goes down?"** Cache-aside degrades to database reads (watch load); rate limits must choose fail-open or fail-closed deliberately; sessions stored in Redis need persistence or replication.
- **"Write-through vs cache-aside?"** Write-through updates the cache on every write (fresh, more write work, caches unread data); cache-aside fills on read (simple, can be stale until TTL or invalidation).
- **"How would you cache LLM answers safely in a multi-tenant app?"** Exact-match cache keyed by model, prompt version, parameters, normalised input and tenant; semantic cache only within one tenant and only for non-personal answers; short TTLs; never cache errors.
- **"Hot key problem?"** Replicate the key (key#1..N with random reads), add a local in-process cache with a short TTL, or precompute.

## Check yourself

<details markdown="1"><summary>What must a cache key for an LLM response include?</summary>

Model and version, prompt version, all parameters that change output (temperature, tools), the normalised input, and the authorization context (tenant or user) if any private data is involved.

</details>

<details markdown="1"><summary>What is a cache stampede and two ways to prevent it?</summary>

Many requests rebuilding the same expired key at once, overloading the database. Prevent with a rebuild lock (single flight), jittered TTLs, or refreshing popular keys before they expire.

</details>

## Build it

Add cache-aside with jittered TTLs to one endpoint, and a Redis rate limiter that returns 429 with `Retry-After`. Measure p95 latency before and after.

## What comes next

[3.6 Background jobs and queues](/03-backend/06-background-jobs-and-queues).
