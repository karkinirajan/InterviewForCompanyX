---
title: Agents versus pipelines
level: 4
summary: The spectrum from a single call to a fully autonomous agent, and how to choose the least autonomous design that solves the problem.
outcomes:
- Place a design on the autonomy spectrum
- Decide between a pipeline, a router and an agent
- Explain the costs of autonomy in an interview
keypoints:
- 'Autonomy spectrum: single call → pipeline → router → tool-using assistant → agent → multi-agent.'
- '"If the steps are known, it''s a pipeline." Agents are for steps that depend on results.'
- The **router** is often the sweet spot (cheap, varied input, predictable execution).
- Each step up costs latency, money, testability and attack surface.
- '"LLM routes, code computes."'
projects:
- name: Support triage router
  stack:
  - FastAPI
  - an LLM API
  - Pydantic
  - Postgres
  build: Classify tickets into four paths with a reason; each path is a deterministic flow; measure routing accuracy on 100 labelled tickets.
  practises: The router pattern and its evaluation.
- name: Same task, three designs
  stack:
  - Python
  - LangGraph
  - an LLM API
  build: Build the order-question feature as a pipeline, a router and an agent, then compare latency, cost and eval success.
  practises: Choosing autonomy with evidence.
---

## Why this matters

"Agentic" is the most overused word in AI right now. Strong engineers pick the *least* autonomous design that works, because every step of autonomy adds latency, cost, unpredictability and attack surface.

## The autonomy spectrum

| Level | Shape | Example |
|---|---|---|
| Single call | Input → model → validated output | Classify a ticket |
| Pipeline | Fixed sequence of steps, some using models | Extract → validate → route (D1) |
| Router | Model picks one of several fixed paths | "Billing, technical or sales?" then a fixed flow |
| Tool-using assistant | Model may call tools in a loop, within a turn | Answer using search and a calculator |
| Agent | Model plans and acts over many steps toward a goal | Research a topic, draft a report |
| Multi-agent | Several agents coordinate | Planner + workers + reviewer |

<a id="q31"></a>

## Q31. Agent or pipeline?

> **Say:** "Agents are for workflows where the next step depends on the last result. If the steps are known, it's a pipeline."

Escalate deliberately, with budgets and approval gates. Often: deterministic orchestration around a few model decisions.

## How to decide

Ask:

1. Are the steps known in advance? → pipeline.
2. Is there a small set of paths? → router.
3. Does the next step depend on results you can't predict (search until found, debug until passing)? → agent, with budgets.
4. What's the cost of a wrong action? High → human approval on every side effect.

A useful idea from a casebook prototype ([P9](#p9)): **"LLM routes, code computes."** The model maps a request onto a known operation; deterministic code does the work.

## Common mistakes

- Building an agent to run a fixed five-step process.
- Letting an agent take actions with side effects without approval.
- No budget, so a confused agent loops until the bill arrives.

## Check yourself

<details markdown="1"><summary>A team wants an agent to process invoices: extract fields, validate, post to accounting. Agent or pipeline?</summary>

Pipeline. The steps are known. Use the model for extraction (and maybe classification), deterministic validation, and human review for exceptions. An agent adds cost and unpredictability for no benefit.

</details>

## Build it

Take three AI features you know and place each on the autonomy spectrum, with the reason it shouldn't move one level higher.

## Worked example: one feature, three designs

**Feature:** "Answer customer questions about their orders."

| Design | Flow | Latency | Cost | Risk |
|---|---|---|---|---|
| Pipeline | Classify intent → fetch order by ID from the session → template + one model call to phrase the answer | ~1–2 s | 1–2 calls | Low: fixed data access |
| Router | Model picks *order status*, *returns policy* or *human handoff*; each path is a fixed flow | ~1–3 s | 2 calls | Low: paths are known |
| Agent | Model has `get_order`, `search_policy`, `create_return` tools and loops until done | 3–20 s | 3–10+ calls | Medium/high: may chain tools unexpectedly; `create_return` needs approval |

Most teams should ship the router. Promote a path to an agent only when evals show users ask multi-step questions the router can't serve, for example "my order arrived damaged; can I return just one item and keep the discount?"

## Interview follow-ups

- **"Isn't an agent more flexible?"** Yes, and flexibility costs latency, money, testability and safety. I'd start with the least autonomous design and let measured failures justify each step up.
- **"How would you know it's time to add an agent?"** When eval cases or production logs show a cluster of requests whose next step depends on intermediate results, and the router's fallback rate for that cluster is high.
- **"How do you test an agent?"** Deterministic tests with a scripted fake model (tool sequences, budget exhaustion, authorization denial), plus trajectory evals on a labelled set: did it reach the goal, in how many steps, with which tools ([10.2](/10-production-ai/02-evaluation)).

## More check-yourself

<details markdown="1"><summary>Name three costs of moving one step up the autonomy spectrum.</summary>

Higher and less predictable latency; more model calls and tokens; harder testing and evaluation; larger attack surface (tools can be misused via injection); harder debugging.

</details>

<details markdown="1"><summary>What's the "router" pattern and why is it often the sweet spot?</summary>

A model classifies the request into one of a few known paths, each implemented deterministically. It handles varied input with one cheap model call while keeping execution predictable and testable.

</details>

## What comes next

[9.2 Tool calling and the agent loop](/09-agents/02-tool-calling-and-the-agent-loop).
