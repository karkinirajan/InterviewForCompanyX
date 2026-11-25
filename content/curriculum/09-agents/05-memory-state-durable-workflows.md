---
title: Memory, state and durable workflows
level: 4
summary: Conversation memory, long-term user memory, explicit agent state, checkpoints, and durable execution for long-running or multi-step AI processes.
outcomes:
- Design short- and long-term memory without leaking data
- Model agent state explicitly with checkpoints
- Use durable workflows for steps that must survive crashes
keypoints:
- Short-term memory is the trimmed or summarised conversation. Long-term memory is retrieved facts, scoped per user.
- Keep explicit, typed agent state, checkpointed after every step.
- Durable workflows replay to the last completed step after crashes, which suits long waits and approvals.
- Make steps idempotent and save paid outputs before parsing.
- Users must be able to see and delete what's remembered about them.
projects:
- name: Durable document workflow
  stack:
  - Temporal or Inngest
  - Python or TypeScript
  - an LLM API
  build: Extract → validate → wait for human approval (hours) → write, surviving worker restarts without repeating paid steps.
  practises: Durable execution.
- name: Assistant with user memory
  stack:
  - FastAPI
  - pgvector
  - Graphiti or a facts table
  - Next.js
  build: Remember preferences across sessions with a "what you remember about me" page and delete buttons, all scoped by user.
  practises: Memory design and privacy.
---

## Why this matters

Agents and AI pipelines run for seconds to hours. Without explicit state and durability, a crash, deploy or timeout loses the work (and the money spent on it), and memory features can leak one user's data into another's context.

## Core ideas

- **Short-term memory:** the conversation so far, trimmed or summarised to fit the context window.
- **Long-term memory:** facts and preferences extracted from past sessions and retrieved when relevant (a RAG problem over the user's own history). Temporal knowledge graphs (like the open-source Graphiti library behind Zep) store facts with validity over time.
- **Agent state:** an explicit, typed object (messages, plan, intermediate results, step count, budget used), not just an ever-growing message list.
- **Checkpoints:** saving state after each step, so a run can resume, be inspected, or wait for human input.
- **Durable execution:** workflow engines (Temporal, cloud durable-function services, Vercel Workflows and similar) persist each step's result; after a crash, the workflow replays to where it was and continues without re-running completed steps.

## How to do it

- Scope every memory record by user and tenant; retrieval applies the same filters as any RAG ([Q8](#q8)).
- Let users see and delete what's remembered about them.
- Store agent state in a database (or the framework's checkpointer), keyed by run ID.
- Make every step idempotent and save paid model outputs before parsing ("never pay twice", [P1](#p1)).
- Use a durable workflow when a process has many steps, external waits (human approval, webhooks), or runs longer than a request.

```text
run_id → step 1 extract (saved) → step 2 validate (saved) → step 3 wait for approval (hours)
       → crash/deploy → resume at step 3 → step 4 write (idempotency key) → done
```

## Common mistakes

- Unbounded conversation history, so cost grows each turn until the context overflows.
- Memory shared across users by a missing filter.
- In-memory state in a web process, lost on restart.

## Check yourself

<details markdown="1"><summary>What's the difference between short-term and long-term memory for an assistant?</summary>

Short-term is the current conversation in the context window (trimmed or summarised). Long-term is information persisted across sessions and retrieved when relevant, which needs scoping, retention and user control like any personal data.

</details>

<details markdown="1"><summary>When do you need a durable workflow engine instead of a queue?</summary>

When a process has many dependent steps, long waits (human approval, external callbacks) or must resume exactly where it stopped after failures, with each completed step's result preserved.

</details>

## Build it

Add checkpointing to your agent so a run can be killed mid-way and resumed without repeating completed tool calls or model calls.

## What comes next

[9.6 Controlling agents](/09-agents/06-controlling-agents).
