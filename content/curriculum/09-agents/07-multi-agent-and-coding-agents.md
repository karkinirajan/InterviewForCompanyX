---
title: Multi-agent systems and AI coding agents
level: 4
summary: When several agents beat one, orchestrator-worker patterns, and how to use AI coding agents professionally with gates that make the output yours.
outcomes:
- Decide when multi-agent designs are justified
- Structure orchestrator-worker systems with clear ownership
- Use coding agents with review and quality gates
keypoints:
- 'Multi-agent patterns: orchestrator–workers, specialist pipelines, critique. Use them only for parallel, independent work.'
- Give each agent clear ownership (no two write the same thing), with contracts before parallel work and a final check.
- Coding agents mean you write the spec, review every diff, run mandatory CI gates and record what wasn't verified.
- '"Agents make me faster; the gates are what make the output mine."'
- Never lower a quality gate to get agent output merged.
projects:
- name: Research orchestrator
  stack:
  - Python
  - Claude Agent SDK or OpenAI Agents SDK
  - web search tool
  build: An orchestrator splits a research question into sub-questions handled in parallel by workers, then a reviewer checks citations.
  practises: Orchestrator–worker with verification.
- name: Agent-built feature, human-gated
  stack:
  - A coding agent
  - GitHub Actions
  - mutation testing
  build: Spec a feature, let a coding agent implement it on a branch, and only merge after lint, types, tests and mutation gates plus your review notes.
  practises: Professional use of coding agents.
---

## Why this matters

Multi-agent systems are popular in demos and hard in production. Separately, AI coding agents are now part of daily engineering, and job descriptions list "AI coding assistants" as a desirable skill. Interviewers want to know you use them with discipline.

## Multi-agent patterns

| Pattern | Shape | Good for |
|---|---|---|
| Orchestrator–workers | One agent splits a task; workers handle parts in parallel | Research, large refactors, broad searches |
| Pipeline of specialists | Fixed handoffs: drafter → reviewer → editor | Content with review stages |
| Debate / critique | Agents critique each other's answers | Hard reasoning, with care (cost) |

Use multiple agents when the task splits into parallel, independent parts or when separate contexts prevent one agent's context from overflowing. Costs: more tokens, harder debugging, coordination failures. A single agent with good tools is usually the right start.

Rules that make multi-agent systems work: **clear ownership** (each agent owns specific files, data or decisions; two never write the same thing), **contracts written before parallel work starts**, and a final reviewer or deterministic check.

<a id="q41"></a>

## Q41. AI coding assistants?

See story [S9](#s9). In short: use them heavily, and run them like a team: an orchestrator plus specialist agents, each owning a set of paths so two never edit the same file; contracts written before parallel work; nothing merges without lint, strict type-checking, tests and mutation checks; and a written record of what was *not* verified.

> **Say:** "Agents make me faster; the gates are what make the output mine."

## Using coding agents well

- Specify precisely: goal, constraints, files in scope, definition of done.
- Review every diff as if a junior wrote it. You must be able to explain any line in your repository.
- Keep quality gates mandatory and visible (CI), and never lower a gate to make a build pass.
- Keep secrets out of agent context.
- Record decisions and unverified areas in the repository (ADRs, a "work done / not verified" file).

## Common mistakes

- Multi-agent architecture for a task one agent (or a pipeline) handles fine.
- Merging agent output without reading it.
- Claiming work you can't explain line by line.

## Interview follow-ups

- **"Have you seen multi-agent systems fail?"** Typical failures: agents duplicating work, contradicting each other, losing context in handoffs, costs multiplying. Clear ownership, contracts and a final verifier address them.
- **"How do you keep quality high with coding agents?"** Precise specs, small diffs, mandatory CI gates (lint, types, tests, mutation), human review of every change, and a record of what wasn't verified.

## Check yourself

<details markdown="1"><summary>When is a multi-agent design justified?</summary>

When work splits into independent parallel parts, or contexts must be separated to stay within limits or isolate permissions, and the extra cost and coordination are worth the speed or quality gain, measured against a single-agent baseline.

</details>

<details markdown="1"><summary>An interviewer opens a file in your repo an agent wrote and asks you to explain it. What's the right posture?</summary>

Explain it fully, because you specified, reviewed and gated it. "An agent wrote it" isn't an answer; "I specified it, reviewed it and gated it with these checks" is.

</details>

## Build it

Use a coding agent on a real change in your project with a written spec, mandatory CI gates and a "not verified" note in the PR description.

## What comes next

Part 10: [Production AI: reliability, evaluation and safety](/10-production-ai).
