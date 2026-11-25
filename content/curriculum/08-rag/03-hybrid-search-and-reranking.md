---
title: Hybrid search and re-ranking
level: 4
summary: Combining dense and lexical retrieval with Reciprocal Rank Fusion, then re-ranking with cross-encoders or late-interaction models.
outcomes: Implement hybrid retrieval fused with RRF | Explain why and how re-ranking improves precision | Choose a re-ranker for a latency and cost budget
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
