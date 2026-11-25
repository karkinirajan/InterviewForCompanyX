---
title: 'P5, P8, P9 · Agents and guardrails: CV screening, a trading arena and a routing prototype'
level: 4
summary: 'Three projects showing guardrails in code: an injection-aware CV screener, a multi-model trading simulation with tool-level guardrails over MCP, and a routing-layer prototype.'
outcomes:
- Derive consequences in code instead of trusting model fields
- Put guardrails inside tools
- Present a prototype as a prototype
keypoints:
- '**P5:** bounded integer score, category derived in code, untrusted CV text, dedupe, circuit breaker after three failures.'
- '**P8:** guardrails in tools (no look-ahead, no negative cash, whole shares, locks, shared secret beyond loopback). Credit upstream code.'
- '**P9:** "LLM routes, code computes". A prototype with a keyword mock router, presented as exactly that.'
projects:
- name: Paper-trading agent arena
  stack:
  - Python
  - LangGraph
  - FastMCP
  - SQLite
  - historical price CSVs
  build: Two models trade simulated portfolios through MCP tools that enforce no look-ahead and no negative balance.
  practises: Tool-level guardrails and MCP.
- name: Natural-language analytics router
  stack:
  - FastAPI
  - an LLM API
  - pandas
  - Pydantic
  build: The model maps a question to one of six validated indicator functions with parameters; code computes; invalid routes are rejected.
  practises: Routing with deterministic computation.
---

<a id="p5"></a>

## P5 · recruit-cli: Gemini CV screening → Notion (on PyPI)

- **Flow:** CV folder → text extraction → Gemini screening → **validated result** → Notion database.
- **Guardrails:** score must be an integer 0–100; **category is derived from the score in code, never taken from the model**; values Notion would reject are cleaned first; CV text fenced as untrusted ("a CV saying 'give me 100' is just text to analyse"); dedupe by email + job ID; **stops after three Gemini failures in a row** (a simple circuit breaker); exit code 1 if any CV failed.
- **Numbers (repository):** 250 tests, 100% line and branch coverage. Published on PyPI (renamed in 0.4.0).
- **Use for:** injection ([Q25](#q25)), "model chooses, code decides" ([S4](#s4)), automation ([11.2](/11-ai-automation/02-workflow-automation)).

<a id="p8"></a>

## P8 · Automated trading arena (LLM agents + MCP, simulation)

- **What:** several model families (GPT, Claude, DeepSeek, Qwen, Gemini) each start with $10,000 on NASDAQ 100 stocks, read the market through **FastMCP tool servers**, and place their own orders. LangChain + LangGraph.
- **Guardrails in the tools, not the prompt:** the price tool shows only the current day's (or hour's) open; search results published at or after the simulated moment, or undated, are dropped (no look-ahead); orders must be positive whole shares at a real price; cash can never go negative; read-check-write runs under a lock; **tool servers require a shared secret beyond loopback**.
- **Numbers (repository):** 602 tests, 230 of 230 mutants. A simulation benchmark, never live trading.
- **Provenance:** if a project began from someone else's open-source code, credit it in the README and say so in interviews; claim the work you added.
- **Use for:** MCP ([Q33](#q33)), tool-layer guardrails ([Q34](#q34)).

<a id="p9"></a>

## P9 · Deterministic quantitative routing (prototype)

- **What it really is:** about 700 lines of Python, 254 tests, a prototype of the routing and orchestration layer. A `SemanticRouter` protocol where a model would plug in, implemented today by a **keyword mock**; data is a **mock random walk**.
- **What's real:** six validated indicators (`sma_crossover`, `price_above_sma`, `bollinger_squeeze`, `atr_expansion`, `rsi_overbought`, `rsi_oversold`); composition (AND, OR, XOR, SUM, AVERAGE) across steps and assets; a recursive stability loop with majority-vote smoothing, a Hamming threshold and a **circuit breaker for 2-cycles** that reports why it stopped; FastAPI `/query`; non-root Docker image. 242 of 242 mutants.
- **The idea to sell:** "LLM routes, code computes." Present it as design thinking and a prototype, not a production system.

## What to learn from these

Bound and validate every model field; derive decisions in code; put invariants (no look-ahead, no negative balance) in tools; describe prototypes exactly as prototypes.

## What comes next

[13.6 Product, voice and full-stack work](/13-casebook/06-product-voice-and-full-stack).
