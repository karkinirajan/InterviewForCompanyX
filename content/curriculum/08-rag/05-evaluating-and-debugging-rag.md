---
title: Evaluating and debugging RAG
level: 4
summary: The end-to-end pipeline, separate metrics for retrieval and generation, a debugging method that isolates the failing stage, and hallucination containment.
outcomes: Walk through a production RAG pipeline end to end | Measure retrieval and generation separately | Debug a wrong answer to its stage in minutes
---

## Why this matters

"Walk me through a RAG pipeline" and "it gives wrong answers; how do you debug?" are the two most common RAG interview questions. In production, they're the daily work.

<a id="q1"></a>

## Q1. Walk me through a RAG pipeline end to end.

1. **Ingest:** connectors; type and size checks; layout-aware parsing (faxes and PDFs with tables break naive extraction); sensitive-data handling before anything is indexed.
2. **Normalize + metadata:** headings, pages, section path, version, tenant, ACL labels.
3. **Chunk:** structure-aware first; parent-child when context matters.
4. **Embed:** batched; record the embedding model with every vector; a model change means a full re-embed.
5. **Index:** vectors + lexical index + metadata.
6. **Query:** authenticate, resolve tenant and permissions, optionally rewrite.
7. **Retrieve:** mandatory permission filters; hybrid (dense + lexical) fused with [RRF](#g-rrf).
8. **Re-rank:** top-50 → top-5.
9. **Assemble:** token budget, source IDs attached.
10. **Generate:** answer only from evidence, cite chunk IDs, explicit insufficient-evidence path.
11. **Validate:** schema; every cited ID exists in the retrieved set; business rules.
12. **Evaluate:** retrieval and generation separately, in CI and on sampled traffic.

<a id="q2"></a>

## Q2. It gives wrong answers. How do you debug?

Paste the correct context manually: now right → retrieval problem; still wrong → generation problem. Retrieval: chunk boundaries, embedding mismatch, filters, stale index, exact terms missed by dense search. Generation: prompt, context order (lost in the middle), model tier. Log chunk IDs and scores per answer. Rerun the eval suite after each change.

| Symptom | Likely cause | Inspect |
|---|---|---|
| Right answer never appears | Retrieval miss | Recall@k, chunking, filters |
| Wrong source | Similar but irrelevant | Precision@k, re-rank, metadata |
| Right source, wrong answer | Generation | Prompt, order, model |
| Another tenant's data | Missing filter | Server-side filters, RLS, cache keys |
| Stale answer | Stale index | Versioning, deletion flow |
| High cost | Too much context | Top-k, re-rank cutoff, caching |

<a id="q7"></a>

## Q7. How do you evaluate RAG?

| Layer | Metrics |
|---|---|
| Retrieval | Recall@k, Precision@k, [MRR](#g-mrr), [nDCG](#g-ndcg); RAGAS context precision and recall |
| Generation | Faithfulness, answer relevance, citation correctness |
| Product | Corrections, acceptance, edit distance on drafts |

Golden set with expert answers; run on every prompt, model or chunking change; calibrate LLM-as-judge against humans ([10.2](/10-production-ai/02-evaluation)).

<a id="q10"></a>

## Q10. Hallucination?

> **Say:** "You don't eliminate hallucination. You engineer containment."

Grounding with citations, schemas, citation verification, an explicit insufficient-evidence path, faithfulness in evals, human review for consequential outputs, sources visible in the UI. Structural containment when possible: constrain the answer space so a fabricated value can't be expressed ([S4](#s4)).

## Common mistakes

- One end-to-end "accuracy" number that can't tell you which stage broke.
- No logging of which chunks fed each answer.
- Evaluating on questions written by the same person who wrote the prompt.

## Check yourself

<details markdown="1"><summary>How do you tell a retrieval failure from a generation failure in one step?</summary>

Give the model the known-correct context directly. If the answer becomes right, retrieval was the problem; if it's still wrong, the prompt, context order or model is.

</details>

<details markdown="1"><summary>Name three retrieval metrics and three generation metrics.</summary>

Retrieval: recall@k, precision@k, MRR, nDCG. Generation: faithfulness, answer relevance, citation correctness.

</details>

## Build it

Create a 30-question golden set for your RAG project with expected source chunks and reference answers. Report recall@5, MRR and faithfulness, then change chunk size and report again.

## What comes next

[8.6 Advanced RAG](/08-rag/06-advanced-rag).
