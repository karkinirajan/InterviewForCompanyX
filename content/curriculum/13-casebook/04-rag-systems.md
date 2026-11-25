---
title: "P3, P4 · RAG systems: graph-backed financial RAG and a re-ranked retrieval API"
level: 4
summary: Two retrieval systems: a production financial-intelligence platform combining a temporal knowledge graph with vector search, and a medical decision-support API using a vector index plus re-ranking.
outcomes: Explain when a knowledge graph complements vector search | Describe a retrieve-then-re-rank API with clean failure semantics | Present subcontract work without overclaiming
---

<a id="p3"></a>

## P3 · Financial intelligence RAG (production, subcontract)

- **Problem:** financial questions are temporal and multi-hop; plain vector search can't order events or walk relationships.
- **Stack:** Graphiti + FalkorDB temporal knowledge graph (replacing the deprecated Zep Community Edition) · Qdrant dense retrieval · ColBERT re-ranking · six Pydantic entity types (Company, FinancialEvent, AnalystRating, FinancialMetric, MacroEvent, Sector) with validation **cross-checked against the graph** · Langfuse tracing · RAGAS + DeepEval regression suites.
- **Role:** subcontractor. **[fill]** the components personally built. Never name the end client.
- **Why a graph:** document-to-structured-data products often use graph stores for relationships; the same reason applies here.
- **Follow-ups:** [Q6](#q6) ColBERT · [Q7](#q7) evaluation · [Q10](#q10) hallucination · story [S1](#s1).

**What to learn from it:** retrieval and generation fail differently; measure them separately, and use a graph when relationships and time are the question.

<a id="p4"></a>

## P4 · FastKwan: TCM retrieval API (Pinecone + Cohere Rerank)

- **What:** a FastAPI service for Traditional Chinese Medicine decision support. `POST /syndrome`: a chat model extracts symptoms (NER) → Pinecone finds 30 candidate syndromes → **Cohere Rerank to top 5**. `POST /prescription`: same symptoms in a prescriptions namespace (50 candidates) → rerank. `POST /lifestyle`: **MongoDB Atlas Search autocomplete** on the disease name.
- **Precision note:** Atlas Search serves a separate lexical endpoint; it isn't fused with Pinecone results. Describe it accurately.
- **Reliability details worth quoting:** upstream failures return **502 with a fixed message** (details only in server logs); a missing setting returns **503 naming the missing variables**; `/health` always open; query 1–4,000 characters; nothing required just to start the server.
- **Numbers (repository):** 68 tests, 100% line coverage. First commit Jul 2023. **[confirm]** client or own.
- **Use when they say "Pinecone" or "reranking".** → [Q4](#q4), [Q6](#q6)

**What to learn from it:** a simple retrieve-then-re-rank design with clean failure semantics is often all a product needs.

## Check yourself

<details markdown="1"><summary>How do you present subcontract work honestly?</summary>

State the role (subcontractor), name only the components you personally built, describe the system's architecture without the end client's name, and separate your measured results from the team's.

</details>

## What comes next

[13.5 Agents and guardrails](/13-casebook/05-agents-and-guardrails).
