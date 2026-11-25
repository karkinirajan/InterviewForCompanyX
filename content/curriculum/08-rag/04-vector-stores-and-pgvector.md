---
title: Vector stores and pgvector
level: 4
summary: Choosing a vector store, modelling chunks in Postgres with pgvector, filtered search, and tenant-safe retrieval with row-level security.
outcomes:
- Pick a vector store for a workload and defend it
- Design a pgvector schema with HNSW, full-text and tenant indexes
- Prevent cross-tenant leakage in retrieval
keypoints:
- Pick pgvector when Postgres is your system of record (joins, transactions, RLS). Pick managed or specialised stores for scale or filtering needs.
- 'Schema: tenant_id, document_id, version, section path, content, tsvector, embedding, embed_model.'
- Index with HNSW (cosine) + GIN (tsvector) + B-tree (tenant, doc).
- Filtered ANN can return too few rows. Use iterative scans (pgvector 0.8+), partitioning or per-tenant indexes.
- RLS is the second wall, and the app role must not own the table (or use FORCE).
projects:
- name: Multi-tenant knowledge base
  stack:
  - Postgres + pgvector
  - RLS
  - FastAPI
  - pytest
  build: Implement the C4 schema with two tenants and RLS, plus tests proving cross-tenant retrieval is impossible even for exact-match queries.
  practises: Tenant-safe vector storage.
- name: Store migration drill
  stack:
  - pgvector
  - Qdrant
  - Python
  build: Migrate the same corpus from pgvector to Qdrant, compare filtered-search recall and latency, and document the trade-offs.
  practises: Vendor choice with data.
---

## Why this matters

The vector store holds your users' knowledge. Picking one is an architecture decision with operational, cost and security consequences, and multi-tenant leakage through retrieval is one of the most serious AI bugs.

<a id="q4"></a>

## Q4. pgvector vs Pinecone vs Weaviate vs Qdrant?

| Store | Pick when | Watch for |
|---|---|---|
| pgvector | Postgres is the system of record; joins, transactions, RLS for tenants | Index build and memory at very large scale; filtered HNSW ([Q8](#q8)) |
| Pinecone | Zero-ops managed scale, serverless | Cost model, lock-in, residency |
| Weaviate | Built-in hybrid and modules | One more system to run |
| Qdrant | Heavy payload filtering, quantization, self-host | One more system to run |

> **Say:** "I default to pgvector for operational simplicity and Postgres-side security, and I've shipped on Pinecone and Qdrant when the workload called for it." (Casebook: [P4](#p4), [P3](#p3).)

## The pgvector schema

The full schema and queries are in the code kit, [C4](#c4). Its key decisions:

- `tenant_id` and `document_id` on every chunk; `embed_model` recorded per row.
- An HNSW index for cosine distance, a GIN index on a generated `tsvector` for lexical search, and a `(tenant_id, document_id)` B-tree.
- **Row-level security** as a second wall: the policy compares `tenant_id` with a per-transaction setting.
- Operators: `<=>` cosine distance (similarity = 1 − distance), `<->` L2, `<#>` **negative** inner product, `<+>` L1.

<a id="q8"></a>

## Q8. Multi-tenancy?

Authorization before retrieval, in server code; RLS as a second wall; cache keys scoped by authorization context; never let the client supply the filter. With pgvector, filtered HNSW queries can return too few rows; iterative index scans (0.8+) address it. Code: [C4](#c4).

### Why filtered ANN is tricky

An HNSW search finds the nearest N vectors, then the `WHERE tenant_id = …` filter removes other tenants' rows, possibly leaving too few results. Options: iterative scans (keep scanning until enough rows pass), partial indexes per large tenant, partitioning by tenant, or a store with native filtered search.

## Common mistakes

- Filtering by tenant only in the application, with no database-level backstop.
- The application role owning the table, which bypasses RLS unless `FORCE ROW LEVEL SECURITY` is set.
- Forgetting the lexical index, then blaming embeddings for missed codes.

## Check yourself

<details markdown="1"><summary>Why might a filtered HNSW query return only 3 rows when you asked for 50?</summary>

The index returns the nearest candidates first and the filter removes most of them (other tenants). Use iterative index scans, raise `ef_search`, partition or index per tenant, or choose a store with filter-aware ANN.

</details>

<details markdown="1"><summary>Name three layers that prevent cross-tenant leakage in RAG.</summary>

Server-side tenant/permission filters in every retrieval query; Postgres RLS as a second wall; cache keys scoped by tenant/user; plus tests that try to retrieve another tenant's document.

</details>

## Build it

Create the [C4](#c4) schema, load two tenants' documents, enable RLS, and write a test that tenant A can never retrieve tenant B's chunks, even with a query that matches B's text exactly.

## What comes next

[8.5 Evaluating and debugging RAG](/08-rag/05-evaluating-and-debugging-rag).
