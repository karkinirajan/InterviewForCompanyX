---
title: Agents versus pipelines
level: 4
summary: The spectrum from a single call to a fully autonomous agent, and how to choose the least autonomous design that solves the problem.
outcomes: Place a design on the autonomy spectrum | Decide between a pipeline, a router and an agent | Explain the costs of autonomy in an interview
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

## What comes next

[9.2 Tool calling and the agent loop](/09-agents/02-tool-calling-and-the-agent-loop).
