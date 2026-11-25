---
title: The system design interview framework
level: 3
summary: A repeatable structure for design interviews: clarify, sketch the main path, data and auth, failure modes, evaluation and trade-offs.
outcomes: Run a 45-minute design interview without losing structure | Name three failure modes before being asked | Close with trade-offs and what you'd build first
---

## Why this matters

Design interviews are judged on how you think, communicate and prioritise. A clear framework stops you from rambling, and naming failure modes unprompted is the single strongest seniority signal.

## The frame (use it every time)

1. **Clarify (5 min):** users and their goal; scale; data types and sensitivity; latency targets; read-only or taking actions; **cost of a wrong answer**; compliance boundary; tenants.
2. **Main path (10 min):** draw the request flow end to end with the simplest components that work.
3. **Data and authorization (5–10 min):** schemas, where data lives, who may see what, where checks happen.
4. **Failure modes (5 min):** name three before they ask, each with detection and mitigation.
5. **Evaluation and observability (5 min):** how you know it works, and keeps working.
6. **Trade-offs and scale (5 min):** what you'd change at 10× and 100×; alternatives you rejected and why.
7. **Close:** what you'd build first, and what breaks first.

**Never open with a vendor name.** Start with requirements; tools come after.

## Phrases that help

- "Let me confirm the requirements before drawing anything."
- "I'll start with the simplest version that works, then harden it."
- "Three things will fail first here: …"
- "The trade-off I'm making is X for Y; if Z mattered more I'd choose W."

## What interviewers listen for, by level

| Level | Signal |
|---|---|
| Mid | A working main path, sensible components, correct data model |
| Senior | Clarifying questions that change the design; failure modes; explicit trade-offs; phasing |
| AI-specific | Where the model is allowed to decide and where code verifies; evals; cost per task; human review; data boundaries |

## Common mistakes

- Designing for Google scale when the prompt says 200 users.
- Spending 20 minutes on one box.
- Not checking time; leave room for failure modes and trade-offs.

## Check yourself

<details markdown="1"><summary>What clarifying question matters most for an AI system design, and why?</summary>

"What does a wrong answer cost?" It decides whether you need human review, deterministic validation, confidence thresholds and audit logging, or whether a best-effort answer is fine.

</details>

## Build it

Practise the frame on [D3](#d3) with a 45-minute timer, drawing on paper and speaking out loud. Record and review where you lost time.

## A worked opening (first five minutes)

> **Interviewer:** "Design a system that summarises customer support calls."
>
> **You:** "Before drawing: who reads the summaries, agents or managers? How many calls a day and how long? Do summaries need to be ready seconds after the call, or is an hour fine? Are recordings personal data under any regulation? Is a wrong summary just annoying, or does it drive actions like refunds? And is this one company or multi-tenant?"

Each answer changes the design: real-time vs batch decides streaming STT vs a queue; regulation decides vendors and redaction; "drives actions" adds human review and evidence links.

## Time plan for 45 minutes

| Minutes | Activity |
|---|---|
| 0–5 | Clarify, write requirements and numbers on the board |
| 5–15 | Main path, simplest working version |
| 15–25 | Data model, authorization, the one hard part |
| 25–32 | Three failure modes with detection and mitigation |
| 32–38 | Evals, observability, cost |
| 38–45 | Scale-up changes, trade-offs, questions |

## More check-yourself

<details markdown="1"><summary>The interviewer interrupts to go deep on one component. What do you do?</summary>

Follow them: they're telling you what they want to assess. Note on the board what you haven't covered yet and return to it if time allows.

</details>

## What comes next

[6.3 Classic drills](/06-system-design/03-classic-drills).
