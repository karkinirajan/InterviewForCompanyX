---
title: Technical interview playbook
level: 2
summary: The answer shape for technical questions, defending metrics, a scored 20-question mock drill, and how to use the question bank to prepare.
outcomes: Answer in the principle → implementation → trade-off → proof shape | Defend every number on your CV | Run and score a realistic mock interview
---

## Why this matters

Technical interviews reward structure. A correct answer delivered as a ramble scores lower than a slightly less complete answer delivered clearly with a trade-off and real evidence.

## The answer shape

**Principle → implementation → trade-off → your proof.** 60 to 120 seconds.

Example for "How do you handle a provider returning 429?":

1. *Principle:* treat the model as an unreliable dependency; retry only transient failures.
2. *Implementation:* capped exponential backoff with jitter, honour a capped `Retry-After`, bounded attempts and a total deadline, breaker and validated fallback.
3. *Trade-off:* more retries improve success but add latency and cost; deadlines cap it.
4. *Proof:* "In my clip service the HTTP layer retries only network errors, 429 and 5xx, caps `Retry-After` at 30 s and makes four attempts."

<a id="m-defense"></a>

## Defending metrics

Every number on your CV will be asked about. Prepare a table:

| They'll ask | Your metric |
|---|---|
| Baseline (number, endpoint, period) | |
| How measured (p50/p95, tool, window) | |
| What changed, by impact | |
| Your share vs the team's | |
| What you'd do differently | |

If you can't fill a row honestly, stop leading with that metric. Never improvise a mechanism.

## Mock drill (20 questions, scored)

Timer on, 90 seconds each, no notes, recorded. Score **0** vague, wrong or theoretical · **1** correct but missing trade-off, implementation or example · **2** principle + implementation + trade-off + your proof. **Gate: 32 of 40.** Redo every zero.

| # | Question | Answer lives in |
|---|---|---|
| 1 | Background and why this role | [12.2](/12-career-and-interviews/02-your-narrative) |
| 2 | Walk me through your career and education | Your consistency audit ([12.1](/12-career-and-interviews/01-the-hiring-process)) |
| 3 | Tell me about your flagship project | [P1](#p1) |
| 4 | A design decision that constrained the model | [S4](#s4) |
| 5 | What broke in production? | [S2](#s2), [S3](#s3) |
| 6 | Draw a RAG system you built | [S1](#s1), [Q1](#q1) |
| 7 | Chunk size and overlap? | [Q3](#q3) |
| 8 | Vector vs hybrid search? | [Q5](#q5) |
| 9 | Tenant-safe retrieval? | [Q8](#q8), [C4](#c4) |
| 10 | Two providers behind one service? | [Q18](#q18) |
| 11 | A 429 or a timeout: what happens? | [Q12](#q12), [C1](#c1) |
| 12 | How do you version prompts? | [Q20](#q20) |
| 13 | Prompt injection from a document or tool? | [Q25](#q25) |
| 14 | What's on your AI dashboard? | [Q36](#q36) |
| 15 | Explain one CV metric: baseline, mechanism, measurement | [Metric defense](#m-defense) |
| 16 | Design document intake with human review | [D1](#d1) |
| 17 | What would you change in your project for production? | [D4](#d4) |
| 18 | What's a managed agent runtime and when would you use one? | [9.4](/09-agents/04-frameworks-and-runtimes) |
| 19 | How do you use AI coding assistants without shipping slop? | [S9](#s9) |
| 20 | Integrating speech-to-text: what do you measure? | [Q39](#q39) |

## During the interview

Think aloud; state assumptions; start simple, then add reliability, cost and security; end every design answer with what breaks first; stop talking when the answer is complete.

<a id="q44"></a>

## Q44. "What would you change in your own project?"

[D4](#d4). Having an honest answer is the point; it shows you know the difference between an MVP and production.

## Check yourself

<details markdown="1"><summary>What are the four parts of a strong technical answer?</summary>

Principle, implementation, trade-off, and proof from your own work.

</details>

## Build it

Run the mock drill this week. Score it honestly, redo every zero, and run it again in seven days.

## What comes next

[12.6 Researching companies and asking questions](/12-career-and-interviews/06-researching-companies-and-asking-questions).
