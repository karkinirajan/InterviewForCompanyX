---
title: System design fundamentals
level: 2
summary: Scaling reads and writes, caching, replication, partitioning, consistency, queues and the back-of-the-envelope estimates that ground a design.
outcomes:
- Estimate load, storage and bandwidth from requirements
- Choose between scaling strategies and consistency models
- Explain the trade-offs of replicas, sharding and async processing
keypoints:
- 'Building blocks: load balancer, cache, replicas, sharding, queue, object storage, search index, vector index.'
- Choose strong consistency for money and eventual consistency for feeds. Provide read-your-writes after updates.
- Estimate first (requests per second, storage, bandwidth, concurrent model calls).
- In AI systems, model latency and **rate limits** are usually the binding constraint.
- Don't reach for microservices or Kafka until the numbers demand it.
projects:
- name: Capacity calculator
  stack:
  - Python or a spreadsheet
  build: Input DAU, requests per user, payload size and model latency; output RPS, peak, storage per year and concurrent model calls.
  practises: Back-of-the-envelope estimation.
- name: Read-replica lab
  stack:
  - Postgres primary + replica (Docker)
  - FastAPI
  - pgbench
  build: Route reads to the replica, demonstrate replication lag, then implement read-your-writes for a user's own updates.
  practises: Replication and consistency trade-offs.
---

## Why this matters

Every design question tests the same building blocks. Knowing them well lets you spend interview time on the interesting part, the trade-offs, instead of reinventing basics.

## Building blocks

| Block | Use it to | Trade-off |
|---|---|---|
| Load balancer | Spread traffic across stateless app servers | Needs health checks; sticky sessions complicate scaling |
| Cache (CDN, Redis) | Serve hot reads fast | Staleness, invalidation, key scoping |
| Read replicas | Scale reads | Replication lag: a user may not see their own write |
| Partitioning / sharding | Scale writes and storage | Cross-shard queries and rebalancing are hard |
| Queue | Absorb bursts, decouple slow work | Eventual consistency; idempotency required |
| Object storage | Files, media, documents | Not a database; list operations are slow |
| Search index | Full-text and faceted search | A second copy to keep in sync |
| Vector index | Similarity search over embeddings | Approximate; filtering and updates need care ([8.4](/08-rag/04-vector-stores-and-pgvector)) |

## Consistency in plain words

- **Strong consistency:** every read sees the latest write. Simple to reason about; costs latency and availability across regions.
- **Eventual consistency:** reads may be stale briefly. Fine for feeds and counters; not for balances.
- **CAP:** during a network partition, a distributed store must choose between consistency and availability. Most real decisions are about latency versus consistency even without partitions.
- **Read-your-writes:** route a user's reads to the primary for a short time after they write.

## Back-of-the-envelope estimation

```text
1M daily active users × 20 requests/day = 20M requests/day
20M / 86,400 s ≈ 230 requests/s average; peak ≈ 3–5× → ~1,000 requests/s
Each stores 2 KB → 40 GB/day → ~15 TB/year
If each request makes one 2 s model call at 1,000 req/s → ~2,000 concurrent model calls
   → check the provider's rate limits and your budget before anything else
```

The last line is the AI twist: model latency and rate limits, not your servers, are usually the binding constraint ([Little's law](/03-backend/07-async-concurrency-performance)).

## Common mistakes

- Jumping to microservices, Kafka and Kubernetes for a system with 50 users.
- Ignoring the data model; most scaling problems are data problems.
- Forgetting failure: what happens when the cache, the queue or the provider is down?

## Check yourself

<details markdown="1"><summary>A user updates their profile and immediately sees the old version. Why, and what do you do?</summary>

Their read went to a replica that hadn't caught up (replication lag) or hit a stale cache. Read from the primary for that user for a short window after writes (read-your-writes), and invalidate the cache key on update.

</details>

<details markdown="1"><summary>When is sharding worth its cost?</summary>

When a single primary can no longer handle write volume or data size even after vertical scaling, indexing, caching and archiving. Choose a shard key that matches access patterns (often tenant ID) to avoid cross-shard queries.

</details>

## Build it

Estimate requests per second, storage per year and concurrent model calls for a "summarise every support ticket" feature at a company with 5,000 tickets a day.

## What comes next

[6.2 The system design interview framework](/06-system-design/02-the-interview-framework).
