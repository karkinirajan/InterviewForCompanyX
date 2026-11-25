---
title: Glossary
level: 0
summary: Short definitions of the terms used across the guide, from HTTP and SQL basics to retrieval metrics and agent protocols.
outcomes:
- Define every term used in the guide in one sentence
keypoints:
- Define every term in one sentence, then give one example of where it shows up.
- Retrieval metrics are MRR (first relevant), nDCG (graded ranking) and recall@k (coverage).
- RRF fuses by rank. ColBERT is late interaction. TTFT is what users feel.
- 'Engineering terms you must own: idempotency key, circuit breaker, DLQ, IDOR, SSRF, RLS, expand/contract.'
projects:
- name: Glossary hover plugin
  stack:
  - TypeScript
  - a browser extension (MV3)
  build: Highlight glossary terms on any web page and show the definition on hover.
  practises: Learning vocabulary in context.
- name: Explain-it-back recorder
  stack:
  - Phone recorder
  - Markdown
  build: Record a 30-second explanation for 20 terms, transcribe them and compare against the glossary.
  practises: Generation over recognition.
---

## AI and retrieval

| Term | Meaning |
|---|---|
| <a id="g-rrf"></a>**RRF** | Reciprocal Rank Fusion: score = Σ 1/(k + rank), k ≈ 60. Fuses ranked lists without normalizing scores ([C2](#c2)) |
| <a id="g-colbert"></a>**ColBERT** | Late-interaction retrieval: token-level embeddings, max-similarity matching; precise, document side precomputable |
| <a id="g-mrr"></a>**MRR** | Mean Reciprocal Rank: how high the first relevant result appears |
| <a id="g-ndcg"></a>**nDCG** | Ranking quality with graded relevance, discounted by position |
| <a id="g-ttft"></a>**TTFT** | Time to first token: prefill + network + retrieval. What users feel |
| **Token** | The unit models read, write and bill by; a chunk of text |
| **Context window** | Maximum input + output tokens in one call |
| **Embedding** | A vector representing meaning, used for similarity search |
| **HNSW / IVFFlat** | Approximate nearest-neighbour index types (graph-based / cluster-based) |
| **Hybrid search** | Dense (vector) + lexical (keyword) retrieval, fused |
| **Re-ranker** | A slower, more precise model that reorders first-stage candidates |
| **RAG** | Retrieval-augmented generation: answer from retrieved context, with citations |
| **Faithfulness** | Whether an answer is supported by the provided context |
| **Golden set** | Expert-labeled evaluation data; with a private **holdout** never used for tuning |
| **LLM-as-judge** | Using a model to grade outputs against a rubric; must be calibrated against humans |
| **Prompt injection** | Text that tries to override a model's instructions, directly or via documents/tool results |
| **Structured output** | Model output constrained to a schema (JSON) |
| **Tool calling** | The model requests that the application run a defined function with arguments |
| **Agent** | A loop where a model chooses the next action based on results so far |
| **MCP / A2A / AG-UI** | Protocols: model-to-tools / agent-to-agent / agent-to-UI |
| **Shadow model** | A new model scoring alongside the live one, promoted only on evidence |
| **Distillation** | Training a smaller model to imitate a larger one on a task |
| **WER / CER** | Word / character error rate. For Devanagari, count over grapheme clusters |
| **Grapheme cluster** | What a reader sees as one character (a consonant plus vowel sign, a conjunct) |
| **Diarization** | Identifying who spoke when in audio |

## Engineering

| Term | Meaning |
|---|---|
| **Idempotency key** | Makes a retried write take effect once |
| **Circuit breaker** | Stop calling a failing dependency for a while; route elsewhere |
| **Backoff with jitter** | Increasing, randomised waits between retries |
| **Dead-letter queue (DLQ)** | Where messages go after repeated failures, for inspection |
| **At-least-once delivery** | A message may be delivered more than once; consumers must be idempotent |
| **IDOR** | Insecure direct object reference: accessing others' objects by changing an ID |
| **SSRF** | Server-side request forgery: tricking your server into fetching internal addresses |
| **RLS** | Postgres row-level security; per-row access rules, used for tenant isolation |
| **CORS** | Browser mechanism letting a server allow cross-origin requests |
| **ADR** | Architecture decision record: one decision with context and consequences |
| **SLO** | Service level objective: a target like "99.5% of requests under 2 s" |
| **p95 / p99** | The latency 95% / 99% of requests are faster than |
| **Expand → migrate → contract** | Zero-downtime schema change pattern |
| **Mutation testing** | Inject deliberate bugs; a good suite must fail for each one |
| **Canary / blue-green / feature flag** | Release strategies: small traffic slice / instant switch / behaviour toggle |
| **microVM** | A lightweight VM per session (used by managed agent runtimes): VM-level isolation |
| **Cedar** | AWS's open policy language for allow/deny decisions |

## Compliance

| Term | Meaning |
|---|---|
| **PII** | Personally identifiable information |
| **PHI** | Protected health information |
| <a id="g-baa"></a>**BAA** | Business Associate Agreement under HIPAA |
| **Data minimisation** | Collect and send only what the task needs |
| **De-identification** | Removing identifiers so data can't be tied to a person |

## What comes next

[14.3 Sources and further reading](/14-reference/03-sources-and-further-reading).
