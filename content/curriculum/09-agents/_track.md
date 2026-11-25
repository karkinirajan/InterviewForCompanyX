---
title: Agents
kicker: Agents vs pipelines · tools · MCP · frameworks · memory · control · multi-agent
summary: Systems where the model decides the next step: when that's worth it, how the loop works, the protocols and runtimes around it, and how to keep it safe and bounded.
---

An **agent** is a loop in which a model chooses actions (call a tool, look something up, ask a person, finish) based on what it has seen so far. Agents are powerful for open-ended tasks and expensive, slow and risky when used where a fixed pipeline would do.

This part teaches agents as an engineering problem: explicit state, tools with narrow permissions, budgets enforced outside the model, human approval for side effects, and traces for everything.

> **Say:** "Agents are for workflows where the next step depends on the last result. If the steps are known, it's a pipeline."
