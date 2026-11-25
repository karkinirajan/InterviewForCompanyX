---
title: Background jobs and queues
level: 2
summary: Moving slow or unreliable work off the request path with Celery, SQS or Redis queues, and making jobs idempotent, retryable and observable.
outcomes:
- Decide what belongs in a background job
- Design idempotent jobs with retries and dead-letter queues
- Explain at-least-once delivery and its consequences
keypoints:
- Slow or flaky work leaves the request path. Return `202` with a job ID.
- Delivery is **at-least-once**, so jobs must be idempotent (status checks, unique constraints).
- Use `acks_late`, retries with backoff and jitter, and a **dead-letter queue** for poison messages.
- Keep job state in the database, not in process memory.
- 'Never pay twice: save paid API responses before parsing.'
projects:
- name: PDF processing pipeline
  stack:
  - FastAPI
  - Celery
  - Redis
  - Postgres
  - S3/MinIO
  build: Upload → enqueue → extract text → store results with status polling; kill workers mid-job and prove exactly-once effects.
  practises: Idempotent jobs, retries, DLQ, job state.
- name: Webhook delivery service
  stack:
  - Node.js
  - BullMQ
  - Redis
  - Postgres
  build: Deliver signed webhooks to subscriber URLs with exponential retries, a DLQ, replay from the dashboard and per-subscriber rate limits.
  practises: Retries, signing, operability.
---

## Why this matters

Anything slow (document processing, video rendering, batch LLM calls, emails, webhooks) shouldn't hold an HTTP request open. Queues absorb bursts, survive restarts and let you scale workers separately from the web tier. Most AI pipelines are queue-driven.

## Core ideas

- **Producer → queue → worker.** The web request enqueues a job and returns `202 Accepted` with a job ID; a worker processes it; the client polls or is notified.
- **At-least-once delivery:** most queues may deliver a message more than once (a worker crashed after doing the work but before acknowledging). So **jobs must be idempotent**.
- **Visibility timeout / ack:** a message is hidden while a worker processes it; if not acknowledged in time, it reappears.
- **Retries with backoff** for transient failures; a **dead-letter queue (DLQ)** for messages that keep failing, so they're inspected instead of retried forever.
- **Tools:** Celery (Python, with Redis or RabbitMQ), RQ/Dramatiq, AWS SQS, Kafka (event streams), managed durable workflow engines for multi-step processes ([9.5](/09-agents/05-memory-state-durable-workflows)).

## How to do it

```python
@celery_app.task(bind=True, acks_late=True, autoretry_for=(TransientError,),
                 retry_backoff=True, retry_jitter=True, max_retries=5)
def process_document(self, document_id: str) -> None:
    doc = repo.get(document_id)
    if doc.status == "done":           # idempotency: already processed
        return
    result = extract(doc)              # may raise TransientError
    repo.save_result(document_id, result, status="done")   # one transaction
```

- `acks_late=True`: acknowledge only after the work finishes, so a crash causes a redelivery rather than a lost job.
- Status check + unique constraints = safe to run twice.
- Store job state in the database so the UI can show progress, and so a restart doesn't lose track.

### Never pay twice

For paid external calls (LLMs, OCR, speech-to-text), save the raw response **before** parsing it, keyed by job and input hash. If parsing fails or the worker crashes, the next attempt reuses the saved response instead of paying again ([P1](#p1)).

## Why this way

The request/response cycle is for things that finish in a second or two. Queues make slow work reliable (retries, DLQs), scalable (add workers) and cheap to recover from (resume, don't restart).

## Common mistakes

- Non-idempotent jobs that double-charge or double-send on redelivery.
- Infinite retries on a permanent error (bad input), burning money.
- Job state only in memory or in threads inside the web process, lost on restart (a classic MVP shortcut, see [D4](#d4)).
- Passing whole objects into the queue instead of IDs, then processing stale data.

## Check yourself

<details markdown="1"><summary>Why must queue workers be idempotent?</summary>

Because delivery is at-least-once: the same message can arrive twice after a crash or timeout. Without idempotency, side effects (charges, emails, records) happen twice.

</details>

<details markdown="1"><summary>What's a dead-letter queue for?</summary>

Holding messages that failed after the maximum retries, so they stop consuming resources, can be alerted on, inspected and replayed after a fix.

</details>

## Build it

Add a Celery (or RQ) worker to your service: `POST /documents` enqueues processing and returns 202 with an ID; `GET /documents/{id}` shows status. Kill the worker mid-job and prove the job completes exactly once after restart.

## What comes next

[3.7 Async, concurrency and performance](/03-backend/07-async-concurrency-performance).
