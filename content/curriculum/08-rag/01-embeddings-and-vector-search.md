---
title: Embeddings and vector search
level: 4
summary: What embeddings are, similarity metrics, approximate nearest-neighbour indexes, and the limits of dense retrieval.
outcomes: Explain embeddings and cosine similarity | Describe how HNSW and IVF indexes trade recall for speed | Know what dense retrieval misses
---

## Why this matters

Vector search is the first stage of most RAG systems. Understanding it explains both why it finds paraphrases that keyword search misses, and why it misses exact identifiers that keyword search finds trivially.

## Core ideas

- **Embedding:** a fixed-length vector (hundreds to thousands of numbers) produced by an embedding model, such that texts with similar meaning have nearby vectors.
- **Similarity:** cosine similarity (angle between vectors) is the usual measure; dot product and L2 distance are alternatives. Use what the embedding model was trained for.
- **Bi-encoder:** query and documents are embedded separately, so documents can be embedded once ahead of time. Fast; less precise than models that read query and document together.
- **Approximate nearest neighbour (ANN):** exact search compares the query with every vector; ANN indexes trade a little recall for huge speed-ups.
  - **HNSW:** a layered graph; excellent recall and speed; more memory; slower to build.
  - **IVF (IVFFlat):** clusters vectors and searches the nearest clusters; faster builds; needs data before building; tune `lists` and `probes`.
- **Same model for queries and documents.** Changing the embedding model means re-embedding everything.

## Where dense retrieval fails

- Exact identifiers: product codes, drug names, diagnosis and billing codes, record numbers, error codes.
- Rare words and new jargon the embedding model hasn't seen.
- Negation and numbers ("not covered", "over 65").
- Very long chunks, whose meaning gets averaged into mush.

That's why production systems add lexical search and re-ranking ([8.3](/08-rag/03-hybrid-search-and-reranking)).

## How to do it

```python
vectors = await embedder.embed([c.text for c in chunks])      # batch, not one call per chunk
rows = [(c.id, c.text, v, EMBED_MODEL) for c, v in zip(chunks, vectors)]  # store the model name
```

Record the embedding model with every vector, so a model change can be detected and migrated with a dual index ([Q9](#q9)).

## Check yourself

<details markdown="1"><summary>Why can dense retrieval miss a query for "ICD-10 E11.9"?</summary>

Embeddings capture meaning, not exact strings; rare codes don't have reliable semantic representations, so similar-looking codes or general diabetes text may rank higher. Lexical search matches the exact token.

</details>

<details markdown="1"><summary>HNSW or IVFFlat?</summary>

HNSW for better recall and query speed when memory and build time allow; IVFFlat for faster builds and lower memory, tuned with lists/probes, built after data exists.

</details>

## Build it

Embed 200 short documents, search with cosine similarity by brute force, then add an HNSW index and compare results and timing.

## What comes next

[8.2 Ingestion and chunking](/08-rag/02-ingestion-and-chunking).
