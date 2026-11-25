---
title: "Advanced RAG: query rewriting, graphs and agentic retrieval"
level: 4
summary: Query transformation, metadata and temporal filters, knowledge-graph retrieval for multi-hop questions, and letting an agent decide what to retrieve.
outcomes: Choose an advanced technique for a specific failure | Explain when a knowledge graph beats vector search | Decide when retrieval should be agentic
---

## Why this matters

Basic hybrid RAG handles most questions. The rest (multi-hop, time-dependent, comparative, or vague questions) need targeted techniques. Use them to fix measured failures, not because they're fashionable.

## Techniques by failure

| Failure in your evals | Technique |
|---|---|
| Vague or conversational queries | **Query rewriting:** turn the chat turn into a standalone search query |
| Questions with several parts | **Decomposition:** split into sub-queries, retrieve for each, merge |
| Vocabulary mismatch | **Hypothetical answer embedding (HyDE)** or synonym expansion |
| Time-sensitive questions ("latest", "as of Q2") | **Metadata and temporal filters** on dates and versions |
| Multi-hop questions (A relates to B relates to C) | **Knowledge-graph retrieval** |
| Questions that need several lookups depending on what's found | **Agentic RAG:** retrieval as a tool the model calls iteratively |
| Long documents where small chunks lose context | **Parent-child / contextual chunks** |

## Knowledge graphs for retrieval

A knowledge graph stores entities (companies, people, events, metrics) and typed relationships, often with time. Vector search finds similar text; a graph answers "who is connected to whom, how, and when".

Casebook example ([P3](#p3)): financial questions are temporal and multi-hop, so a temporal knowledge graph handled relationships over time, a vector database handled similar text, ColBERT re-ranked, and extracted entities were validated against the graph with Pydantic types. Regression suites (RAGAS, DeepEval) gated changes, with tracing in Langfuse. The lesson: **retrieval and generation fail differently, so measure them separately** ([S1](#s1)).

## Agentic RAG

Instead of one retrieval step, the model gets search tools and decides what to look up next. More flexible, but slower, costlier and harder to evaluate. Use it when the next lookup genuinely depends on the last result ([Q31](#q31)), with step and token budgets ([Q34](#q34)).

## Common mistakes

- Adding a graph database before measuring that vector + lexical retrieval fails on multi-hop questions.
- Agentic retrieval for simple lookups, multiplying latency.
- Query rewriting that drops important constraints from the user's question.

## Check yourself

<details markdown="1"><summary>When does a knowledge graph beat vector search?</summary>

For questions about relationships and their changes over time, multi-hop reasoning across entities, and aggregations over structured facts, where similarity of text doesn't capture the connection.

</details>

## Build it

Find three failing questions in your RAG eval set, classify each failure, apply the matching technique, and measure whether it fixed them without breaking others.

## Worked example: query rewriting in a conversation

```text
Turn 1  user: "What's our parental leave policy?"
Turn 2  user: "And for contractors?"
```

Searching for "And for contractors?" retrieves nothing useful. A rewriting step (a small, cheap model call with the conversation) produces the standalone query *"parental leave policy for contractors"*. Keep the user's constraints (dates, names, negations) intact, log the rewritten query next to the original, and evaluate rewriting separately: retrieval recall with and without it on multi-turn test cases.

## Contextual chunk headers

Before embedding, prepend a short generated or structural header to each chunk: *"Employee handbook › Leave › Parental leave (2026 revision): …"*. Chunks then carry their context, which noticeably helps retrieval for passages that say "this policy" or "the above" without naming the subject.

## Interview follow-ups

- **"GraphRAG or vector RAG?"** Start with hybrid vector + lexical; add a graph when evals show multi-hop or temporal questions failing and the domain has clear entities and relationships worth maintaining.
- **"What does agentic RAG cost you?"** More calls and latency, less predictable behaviour, harder evaluation; mitigate with step budgets and by keeping single-shot retrieval as the default path.

## More check-yourself

<details markdown="1"><summary>Why must query rewriting be evaluated separately?</summary>

It can silently drop or change constraints, hurting retrieval for some queries while helping others. Measuring recall with and without it on multi-turn cases shows whether it helps overall and where it breaks.

</details>

## What comes next

Part 9: [Agents](/09-agents).
