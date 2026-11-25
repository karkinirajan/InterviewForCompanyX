---
title: Ingestion and chunking
level: 4
summary: 'Getting documents in cleanly: parsing, metadata, structure-aware chunking, deduplication, versioning, updates and deletion.'
outcomes:
- Build an idempotent ingestion pipeline
- Choose a chunking strategy and test it on retrieval metrics
- Handle updates, deletions and embedding-model changes
keypoints:
- 'Pipeline: connect → layout-aware parse → handle PII → metadata → chunk → embed → index.'
- Chunk structure-aware first (never split a table or a criterion), then tune size and overlap on recall@k.
- Prefix chunks with context (document › section) so they stand alone.
- Ingestion must be idempotent, keyed by source ID + checksum, with versions that supersede.
- Deleting a document removes its vectors, lexical entries and caches, then verifies they're gone.
projects:
- name: Idempotent ingestion worker
  stack:
  - Python
  - Celery
  - unstructured or Docling
  - pgvector
  - S3/MinIO
  build: Ingest PDFs and Markdown with structure-aware chunks, checksums and versions; re-runs create no duplicates and deletes are verified.
  practises: Ingestion correctness.
- name: Chunking experiment
  stack:
  - Python
  - LlamaIndex or plain code
  - an eval set
  build: Compare fixed, structure-aware and parent-child chunking on recall@5 and answer quality, and publish the results table.
  practises: Choosing chunk strategy by measurement.
---

## Why this matters

Retrieval quality is capped by ingestion quality. A table split in half, a scanned page with garbled text, or a document that was deleted but still answers questions: these are ingestion bugs, and they look like "the AI is wrong".

## The pipeline

1. **Connect:** files, wikis, tickets, databases. Check type and size.
2. **Parse:** layout-aware for PDFs and scans (tables, headers, columns); OCR where needed.
3. **Handle sensitive data:** redact or classify personal data before anything is indexed.
4. **Normalise + metadata:** title, section path, page, version, source ID, tenant, ACL labels, dates.
5. **Chunk** (below).
6. **Embed** in batches; record the embedding model.
7. **Index:** vectors + lexical index + metadata, in one transaction where possible.

<a id="q3"></a>

## Q3. Chunk size and overlap?

No universal size. Structure-aware first (never split a lab table, dosage block or coverage criterion), baseline on a representative query set, then compare sizes and overlap on recall@k and answer quality. Small: precise, loses context. Large: context, diluted embeddings, more tokens.

### Strategies

| Strategy | How | Good for |
|---|---|---|
| Fixed size + overlap | N tokens with M overlap | Uniform prose; quick baseline |
| Structure-aware | Split on headings, sections, list items, table boundaries | Manuals, policies, contracts |
| Parent-child | Retrieve small chunks, return their larger parent section | Precise matching with enough context |
| Semantic | Split where topic shifts | Long unstructured text |

Prepend context to each chunk ("Policy X › Section 4.2 › Exclusions") so it stands on its own.

<a id="q9"></a>

## Q9. Updates and deletions?

Version documents and chunks; idempotent ingestion keyed by source ID + checksum; supersede on update; on delete remove vectors, lexical entries and caches, then verify. Embedding model change = full re-embed with a dual-index cutover.

## Common mistakes

- Naive PDF text extraction that scrambles tables and columns.
- No source ID or checksum, so re-ingestion creates duplicates.
- Deleting the document row but not its vectors and cached answers.
- Choosing chunk size by intuition rather than measurement.

## Check yourself

<details markdown="1"><summary>How do you make ingestion idempotent?</summary>

Key every document by source ID and a content checksum. If the checksum is unchanged, skip; if changed, write a new version and mark old chunks superseded, in one transaction. Re-running the pipeline produces the same state.

</details>

<details markdown="1"><summary>What's the risk of an embedding model change, and how do you handle it?</summary>

Old and new vectors aren't comparable. Re-embed everything into a new index, run evals on both, switch reads atomically, then retire the old index.

</details>

## Build it

Ingest a set of Markdown or PDF documents with structure-aware chunks, section-path prefixes, source IDs and checksums. Re-run it and prove no duplicates appear; delete one document and prove it can't be retrieved.

## What comes next

[8.3 Hybrid search and re-ranking](/08-rag/03-hybrid-search-and-reranking).
