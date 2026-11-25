---
title: Hybrid search and re-ranking
level: 4
summary: Combining dense and lexical retrieval with Reciprocal Rank Fusion, then re-ranking with cross-encoders or late-interaction models.
outcomes:
- Implement hybrid retrieval fused with RRF
- Explain why and how re-ranking improves precision
- Choose a re-ranker for a latency and cost budget
keypoints:
- Dense finds paraphrases and lexical finds exact terms, so run both.
- Fuse by **rank** with RRF (Σ 1/(k+rank), k≈60), never by mixing raw scores.
- Re-rank the top 20–50 with a cross-encoder or ColBERT-style model for precision.
- Re-ranking can't recover documents retrieval missed, so recall comes first.
- Apply the same tenant and permission filters to every retriever.
projects:
- name: Hybrid search service
  stack:
  - FastAPI
  - Postgres (pgvector + tsvector)
  - a re-rank model
  build: Dense + lexical retrieval fused with RRF, then re-ranked; report recall@5 and MRR after each stage.
  practises: The standard production retrieval stack.
- name: Code-and-docs search
  stack:
  - TypeScript
  - Elasticsearch or OpenSearch
  - an embedding API
  build: Search docs where users type error codes and natural language; show that lexical wins on codes and dense on paraphrase.
  practises: Why hybrid matters, with evidence.
---

## Why this matters

Most production RAG systems that work well use hybrid retrieval plus a re-ranker. It's one of the highest-impact, lowest-risk improvements you can make, and a common interview topic.

<a id="q5"></a>

## Q5. Hybrid search?

Dense misses exact identifiers (drug names, ICD-10 and CPT codes, MRNs); lexical misses paraphrase. Run both, fuse with RRF (rank-based, so cosine and BM25 scores never need normalizing), then re-rank. Postgres `ts_rank` isn't true BM25. Code: [C2](#c2).

### Reciprocal Rank Fusion in one line

score(d) = Σ over result lists of 1 / (k + rank of d in that list), with k ≈ 60. A document ranked well in both lists rises; one strong ranking still counts. See [RRF](#g-rrf).

<a id="q6"></a>

## Q6. Why re-rank, and why ColBERT?

First stage is fast and recall-oriented; a re-ranker fixes ordering. Cross-encoders are most precise and most expensive. [ColBERT](#g-colbert) uses late interaction: token-level matching, with document embeddings precomputed, so it's cheaper at scale than a full cross-encoder and sharper than a bi-encoder. Re-ranking can't recover a document never retrieved. Casebook examples: ColBERT re-ranking ([P3](#p3)); a hosted re-rank API taking 30 candidates down to 5 ([P4](#p4)).

## How to do it

```python
dense   = await store.dense_search(query_vec, tenant_id, k=50)     # ids by cosine
lexical = await store.lexical_search(query_text, tenant_id, k=50)  # ids by text rank
fused   = reciprocal_rank_fusion([dense, lexical])[:40]            # C2
ranked  = await reranker.rerank(query_text, [chunks[i] for i, _ in fused], top_n=6)
context = assemble(ranked, token_budget=3_000)                     # with source ids
```

Both searches apply the **same mandatory tenant and permission filters** ([Q8](#q8)).

## Choosing a re-ranker

| Option | Precision | Cost / latency | Notes |
|---|---|---|---|
| None | Baseline | Lowest | Fine for small, clean corpora |
| Hosted re-rank API | High | Per-call fee; network hop | Fastest to adopt |
| Self-hosted cross-encoder | High | GPU/CPU cost; ~tens of ms per batch | Data stays inside |
| Late interaction (ColBERT-style) | High | Precomputed doc side; more storage | Scales well |
| LLM as re-ranker | Variable | Highest | Use sparingly |

## Common mistakes

- Normalising cosine and BM25 scores and adding them (fragile); fuse by rank instead.
- Re-ranking 500 candidates on every query (slow and costly); 20–50 is typical.
- Expecting the re-ranker to fix poor recall.

## Interview follow-ups

- **"What's k in RRF and does it matter much?"** A smoothing constant (≈60) that limits how much top ranks dominate. Results are fairly robust to it; tune only with evals.
- **"How many candidates should you re-rank?"** Enough to contain the right answer (check recall@N first), typically 20–50; more costs latency without much gain.
- **"Can an LLM be the re-ranker?"** Yes, for small candidate sets or hard cases, but it's slower and costlier; a cross-encoder is usually the better default.

## Check yourself

<details markdown="1"><summary>Why fuse by rank instead of by score?</summary>

Scores from different retrievers live on different, query-dependent scales; ranks are comparable. RRF needs no normalisation or tuning beyond k.

</details>

<details markdown="1"><summary>Your re-ranker made results worse for one query type. What do you check?</summary>

Whether the right document was in the candidate set at all (recall); whether the re-ranker handles that language or domain; candidate count and truncation of long chunks; then evaluate per query type on the golden set.

</details>

## Build it

Add lexical search and RRF to your vector search from 8.1, then a re-ranker. Measure recall@5 and MRR on 30 labelled queries at each step.

## What comes next

[8.4 Vector stores and pgvector](/08-rag/04-vector-stores-and-pgvector).
