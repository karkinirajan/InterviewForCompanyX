---
title: Question bank
level: 2
summary: All 44 numbered interview questions grouped by topic, with links to their model answers, plus how to drill them.
outcomes: Find the model answer to any common applied AI question in seconds | Drill questions by topic with the 0/1/2 scale
---

## How to drill

Pick five questions at random, answer each out loud in 60–120 seconds in the shape **principle → implementation → trade-off → your proof**, then open the answer and score yourself 0/1/2 ([12.5](/12-career-and-interviews/05-technical-interview-playbook)). Every lesson's *check yourself* section is extra drill material.

## The numbered questions

| Group | Questions |
|---|---|
| RAG | [Q1 pipeline](#q1) · [Q2 debug](#q2) · [Q3 chunking](#q3) · [Q4 vector DBs](#q4) · [Q5 hybrid](#q5) · [Q6 re-rank](#q6) · [Q7 evals](#q7) · [Q8 tenants](#q8) · [Q9 updates](#q9) · [Q10 hallucination](#q10) |
| Integration | [Q11 Claude in FastAPI](#q11) · [Q12 failures](#q12) · [Q13 bad JSON](#q13) · [Q14 streaming](#q14) · [Q15 switching models](#q15) · [Q16 rate limits](#q16) · [Q17 schema vs tools](#q17) · [Q18 many providers](#q18) · [Q19 reasoning tokens](#q19) |
| Prompts & evals | [Q20 versioning](#q20) · [Q21 eval stack](#q21) · [Q22 non-determinism](#q22) · [Q23 LLM judge](#q23) · [Q24 golden set](#q24) |
| Security | [Q25 injection](#q25) · [Q26 guardrail layers](#q26) · [Q27 OWASP](#q27) · [Q28 PII/PHI](#q28) · [Q29 SSRF](#q29) · [Q30 secrets](#q30) |
| Agents | [Q31 agent or pipeline](#q31) · [Q32 frameworks](#q32) · [Q33 MCP](#q33) · [Q34 runaway agents](#q34) · [Q35 safe drafting agent](#q35) |
| Ops & cost | [Q36 dashboard](#q36) · [Q37 cost](#q37) · [Q38 latency](#q38) |
| Speech | [Q39 speech-to-text](#q39) |
| Judgment | [Q40 fine-tuning](#q40) · [Q41 AI coding assistants](#q41) · [Q42 backend basics](#q42) · [Q43 frontend collaboration](#q43) · [Q44 self-critique](#q44) |

## Design drills

[D1 document intake](#d1) · [D2 LLM gateway](#d2) · [D3 permissioned RAG](#d3) · [D4 MVP to production](#d4)

## Classic questions by part

| Part | Where to drill |
|---|---|
| Foundations | Check-yourself sections in [Part 1](/01-foundations) |
| Lifecycle | [Part 2](/02-software-lifecycle): testing, CI/CD, incidents |
| Backend | [Part 3](/03-backend): API design, SQL, auth, caching, queues, resilience |
| Frontend | [Part 4](/04-frontend): React, Next.js, AI interfaces |
| Cloud & security | [Part 5](/05-cloud-devops-security): Docker, AWS, observability, AppSec, compliance |
| System design | [Part 6](/06-system-design): fundamentals, framework, classic drills |
| Behavioural | [Story bank](/12-career-and-interviews/03-story-bank), [behavioural prompts](/12-career-and-interviews/04-behavioral-and-culture) |

## The one-liners worth memorising

- "Let the model choose; let code compute."
- "A system prompt is not a security boundary."
- "You don't eliminate hallucination. You engineer containment."
- "A generic error message is an outage you can't see."
- "A passing test suite only proves the tests pass."
- "An unevaluated RAG system is a demo."
- "Agents are for workflows where the next step depends on the last result. If the steps are known, it's a pipeline."
- "A cheaper answer that makes the user ask twice isn't cheaper."

## What comes next

[14.2 Glossary](/14-reference/02-glossary).
