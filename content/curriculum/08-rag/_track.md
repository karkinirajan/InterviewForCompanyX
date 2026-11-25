---
title: Retrieval-augmented generation
kicker: Embeddings · ingestion · hybrid search · pgvector · evaluation · advanced RAG
summary: Grounding model answers in your own documents: from embeddings and chunking to hybrid retrieval, permissions, evaluation and graph-based retrieval.
---

RAG (retrieval-augmented generation) is the most common production pattern in applied AI: find the relevant pieces of your own data, put them in the context, and have the model answer from them, with citations.

It's also where many AI projects quietly fail: retrieval misses the right passage, the wrong tenant's document leaks in, or nobody measures quality. This part builds the pipeline step by step and ends with how to evaluate and debug it.

> **Say:** "An unevaluated RAG system is a demo."
