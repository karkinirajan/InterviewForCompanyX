---
title: AI system design drills (D1–D4)
level: 4
summary: Four worked designs for AI systems (document intake, an LLM gateway, a permissioned RAG assistant, and taking an MVP to production), each with failure modes and metrics.
outcomes: Design an extraction pipeline with deterministic validation and human review | Design a multi-provider LLM gateway | Critique your own system honestly and phase its hardening
---

## Why this matters

AI design interviews look like classic ones with three extra questions: where may the model decide, how do you verify it, and how do you know quality holds over time? These four drills cover the patterns behind most real AI products. Use the [framework](/06-system-design/02-the-interview-framework) for each.

<a id="d1"></a>

## D1 · Document intake with extraction and human review

**Prompt:** "Faxed and scanned documents (for example medical referrals, insurance claims or invoices) arrive all day. Extract the key fields, create a record in the system of record, and send uncertain cases to staff."

This shape (intake → extract → validate deterministically → route → human review for exceptions) is behind many commercial document-AI products. The example below uses healthcare referrals on AWS.

```text
 Fax / scan / portal
        │
        ▼
 S3 (KMS, versioned) ──► EventBridge ──► SQS (+ DLQ)
                                          │
                                          ▼
                 Extraction worker (containers or a managed agent runtime)
                  ├─ OCR: text, forms, tables (e.g. Textract)
                  ├─ Model (via a private endpoint), strict schema:
                  │    patient, provider, diagnosis codes, urgency,
                  │    evidence spans, confidence
                  ├─ Deterministic validators: codes exist, provider ID valid,
                  │    patient match ladder: record number → DOB+name → review
                  └─ Guardrails: PII handling, grounding
                                          │
              ┌───────────────────────────┴──────────────────┐
              ▼                                              ▼
   Confident + valid                           Low confidence / conflict
   → system-of-record API (idempotency key)    → human review queue (UI)
              └────────────────► Audit log ◄─────────────────┘
                        (who, what, sources, prompt version, model)

 Cross-cutting: policy on write tools · traces with PII redacted ·
 labelled eval set in CI · per-tenant encryption keys
```

- **The model proposes; code verifies** codes and identifiers ([S4](#s4)).
- **Record matching is the dangerous step:** a deterministic ladder, ties go to humans, never auto-link on low confidence ([S3](#s3)).
- **Idempotency keys** on writes; dedupe duplicate faxes by content hash + subject + date.
- **Metrics:** field accuracy on labelled documents, straight-through rate, review-queue age, cost per document, reviewer correction rate fed back into evals.
- **Failure modes:** bad OCR; duplicate submissions; system-of-record outage (queue, retry, never drop).

<a id="d2"></a>

## D2 · Resilient multi-provider LLM gateway

**Prompt:** "Many teams call several model providers. Build a shared layer that's reliable, safe and cost-controlled."

```text
 Client ─► Gateway (FastAPI)
            ├─ Auth + tenant
            ├─ Redis token buckets (requests + tokens per minute, per tenant)
            ├─ PII policy (redact or block, by endpoint coverage)
            ├─ Cache: exact → semantic (only where allowed)
            ├─ Router: task class → model tier; breaker state per provider
            ├─ Adapters: cloud platform · Anthropic · OpenAI · Gemini · self-hosted
            ├─ Validate → one repair (low-risk only) → validated fallback
            └─ Async telemetry: tokens, cost, latency, prompt version, outcome
```

Decisions: fallback only between **validated** prompt/schema pairs; separate connect, first-token and total timeouts; hard per-tenant budgets; streaming passthrough with cancellation; the gateway owns retries so services don't stack their own. Managed alternatives exist (cloud agent gateways with built-in model fallback); know when you'd use them ([10.6](/10-production-ai/06-llm-gateway-and-platform)).

<a id="d3"></a>

## D3 · Policy assistant: RAG with permissions

**Prompt:** "Staff ask questions about internal policies. Different roles may see different documents. Answers must be traceable."

**Ingestion:** scan → parse → structure-aware chunks → version → attach ACL labels → embed → index (vectors + lexical + metadata).

**Query:** authenticate → resolve role filters → hybrid retrieval with **mandatory permission filters** → re-rank → bounded context → answer **only from sources with chunk IDs** → citation check → stream with sources → feedback and audit.

**Tables:** `documents`, `document_chunks`, `access_policies`, `ai_runs`, `feedback`.

**Insufficient evidence** returns "I couldn't find support in the approved sources", never a guess. See [Q1](#q1), [Q8](#q8), [C4](#c4).

<a id="d4"></a>

## D4 · Take an MVP to multi-tenant production (self-critique)

**Prompt:** "What would you change in your own project before real customers use it?" Having an honest answer is the point. The worked example is the casebook's clip service ([P1](#p1)), starting from its honest status.

| Today | Production version | Why |
|---|---|---|
| No auth | Auth with tenants and roles | Nothing else matters until this exists |
| SQLite (WAL) on one box | Managed Postgres with `tenant_id` + RLS | Concurrency, backups, isolation |
| In-memory thread job tracker | Queue + workers, job state in the DB, idempotent jobs | Survives restarts; scales rendering independently |
| Local disk + optional storage sync | Object storage as the source of truth, presigned uploads | No data on a single instance |
| Vendor adapters never run live | Run the bake-off on the golden set, choose an engine per language from measured error rates | Measure first |
| Placeholder thresholds | Tune from editor verdicts | Numbers come from data |
| Logs only | Metrics: render time, queue age, vendor errors by class, cost per clip, acceptance rate | The four AI axes plus product |

**Failure modes to name:** a vendor outage mid-batch (resume from saved outputs, never re-pay); a render stuck on one worker (timeouts, visibility timeout, DLQ); a consent flag missing on an item (the pipeline refuses, by design).

## Check yourself

<details markdown="1"><summary>In D1, why not let the model write directly to the system of record?</summary>

Because extraction errors (wrong patient, wrong code) have real consequences. The model proposes structured fields with evidence; deterministic validators check codes and identifiers; matching follows a ladder; low-confidence or conflicting cases go to humans; writes are idempotent and audited.

</details>

<details markdown="1"><summary>In D2, why fall back only between validated prompt/schema pairs?</summary>

Prompts and structured-output behaviour differ across models. An unvalidated fallback can return a different shape or quality, turning an outage into silent wrong answers.

</details>

<details markdown="1"><summary>In D3, where must permission filtering happen?</summary>

In server code during retrieval, before any chunk reaches the model, with RLS as a second wall and cache keys scoped by authorization context. The client never supplies the filter.

</details>

## Build it

Draw D1 from memory in five minutes and name three failure modes before looking. Then write D4 for one of your own projects.

## What comes next

Part 7: [LLM foundations](/07-llm-foundations), the start of the applied AI layer.
