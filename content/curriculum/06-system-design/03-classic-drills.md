---
title: Classic design drills
level: 3
summary: 'Worked outlines for the most common non-AI design questions: URL shortener, rate limiter, notifications, file uploads and a news feed.'
outcomes:
- Sketch five classic designs in 10 minutes each
- Reuse the same building blocks across problems
- Spot the one hard part of each problem
keypoints:
- 'URL shortener: ID generation plus read caching.'
- 'Rate limiter: distributed counting, token bucket, and a fail-open vs fail-closed choice.'
- 'Notifications: per-channel workers, idempotency, preferences, DLQ.'
- 'File upload: presigned URLs, an event queue, workers, status.'
- 'News feed: fan-out on write vs on read, plus a hybrid for celebrities.'
projects:
- name: URL shortener, production-grade
  stack:
  - Go or FastAPI
  - Redis
  - Postgres
  - k6
  build: Base62 IDs, a cached redirect path, async click analytics through a queue, and a load test reporting p99.
  practises: Caching and async analytics.
- name: Notification service
  stack:
  - Node.js
  - BullMQ
  - Redis
  - Postgres
  - Resend or SES
  build: Email and in-app channels, user preferences, idempotency per notification, retries and a DLQ.
  practises: Reliable delivery design.
---

## Why this matters

These problems recur in interviews because each isolates one hard idea. Knowing the hard part of each saves you from spending time on the easy parts.

## The drills

### URL shortener

- **Hard part:** generating short unique IDs at scale and serving reads fast.
- **Design:** base62 of a sequence or random ID with a uniqueness check; key-value store; heavy caching (reads ≫ writes); 301 vs 302 (cacheable vs countable); analytics via an async event stream.

### Rate limiter

- **Hard part:** accurate counting across many servers.
- **Design:** Redis with atomic increments; token bucket or sliding window; keys per user/tenant/endpoint; return 429 with `Retry-After`; fail-open vs fail-closed when Redis is down (a deliberate choice). For LLM APIs, limit tokens per minute too ([Q16](#q16)).

### Notification service

- **Hard part:** reliable delivery across channels without duplicates.
- **Design:** event → queue → per-channel workers (email, SMS, push); user preferences; idempotency keys per notification; retries with backoff and DLQ; templates; rate limits per user.

### File upload and processing

- **Hard part:** large files and slow processing.
- **Design:** presigned URLs for direct-to-storage upload; storage event → queue → workers; status in DB; virus scan; size and type validation; thumbnails or transcoding; private buckets.

### News feed

- **Hard part:** fan-out.
- **Design:** fan-out on write (push into followers' feeds; fast reads, expensive for celebrities) vs on read (compute at read time); hybrid for very popular accounts; cursor pagination; caching.

## Pattern you should notice

Every drill uses the same handful of blocks from [6.1](/06-system-design/01-fundamentals): cache, queue, idempotency, object storage, rate limiting. AI drills add a model, retrieval and evaluation to the same blocks.

## Check yourself

<details markdown="1"><summary>Fail-open or fail-closed when the rate limiter's store is unavailable?</summary>

It depends on what the limit protects. Fail-open (allow traffic) keeps the product working when abuse risk is low; fail-closed (deny) protects expensive or dangerous resources, like paid model calls with a hard budget.

</details>

<details markdown="1"><summary>Why presigned URLs for uploads?</summary>

Clients send bytes directly to object storage, so your servers don't proxy large files, and access is time-limited and scoped to one object without sharing credentials.

</details>

## Build it

Pick two drills and write a one-page design each using the [framework](/06-system-design/02-the-interview-framework), including three failure modes.

## What comes next

[6.4 AI system design drills](/06-system-design/04-ai-system-design-drills).
