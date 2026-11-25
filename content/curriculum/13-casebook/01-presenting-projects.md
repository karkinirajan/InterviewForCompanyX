---
title: Presenting projects
level: 2
summary: The case-study format used in this casebook, the evidence matrix mapping projects to job requirements, and rules for honest numbers.
outcomes:
- Write a case study in the standard format
- Map projects to job requirements with an evidence matrix
- Present status and numbers honestly
keypoints:
- 'Case-study format: one line, why it matters, how it''s built, decisions, numbers, honest status, pitch, follow-ups.'
- Repo metrics aren't client outcomes. Every claim needs a baseline and a method.
- 'The evidence matrix maps projects to job requirements: ● strong, ○ supporting.'
- Honest status means what's live, what never ran for real, and what's missing.
projects:
- name: Case study for your best project
  stack:
  - Markdown
  - your project's README
  build: Rewrite your best project's README in the eight-part format, including honest status and follow-up questions.
  practises: Presenting work credibly.
- name: Evidence matrix generator
  stack:
  - Python
  - YAML
  - Markdown
  build: Tag your projects with responsibility codes in YAML and generate the matrix table automatically for any JD.
  practises: Keeping evidence current.
---

## Why this matters

Projects are your strongest interview evidence, if they're presented so an interviewer can quickly see what you did, how, and how you know it works.

## The case-study format

1. **One line:** what it is and who it's for.
2. **Why it's interesting:** which skills it proves.
3. **How it's built:** layers and stack.
4. **Decisions worth quoting:** 3–8 decisions with reasons (ideally from ADRs).
5. **Numbers:** tests, coverage, mutation scores, performance, each with how it was measured.
6. **Honest status:** what's live, what's never been run for real, what's missing.
7. **60-second pitch.**
8. **Follow-ups:** the questions it invites, linked to answers.

## Rules for numbers

- Repository metrics (tests, mutation scores) are not client outcomes; never present them as such.
- Every performance or cost claim needs a baseline, a method, a mechanism and your share.
- Know which run a number came from if there were several.

<a id="x1"></a>

## X1 · Evidence matrix (project × job requirement)

Columns follow a typical applied AI job description: J1 LLM APIs · J2 RAG · J3 agents · J4 prompts/evals · J5 guardrails · J6 monitoring · J7 frontend · J8 SDLC/deploy, plus domain columns.

| | J1 | J2 | J3 | J4 | J5 | J6 | J7 | J8 | Health | Audio |
|---|---|---|---|---|---|---|---|---|---|---|
| [P1 reelslicer](#p1) | ● | | ○ | ● | ● | ○ | ● | ● | | ● |
| [P2 SmartClaim](#p2) | ● | | | ○ | ● | | ● | ○ | ● | |
| [P3 Financial RAG](#p3) | ● | ● | | ● | ○ | ● | | | | |
| [P4 FastKwan](#p4) | ● | ● | | | ○ | | | ○ | ○ | |
| [P5 recruit-cli](#p5) | ● | | | ○ | ● | | | ○ | | |
| [P6 Pilot console](#p6) | ○ | | ○ | | ● | ○ | ● | | | |
| [P7 RevOps](#p7) | ○ | | | ○ | ● | ○ | ● | ● | | |
| [P8 Trading arena](#p8) | ● | | ● | | ● | | | ○ | | |
| [P9 Quant routing](#p9) | | | ● | | ● | | | ○ | | |
| [P10 Voice stack](#p10) | ● | | | | ○ | | ● | ● | ○ | ● |
| [P11 EkJhalak](#p11) | ● | | | | | ○ | ● | ● | | |
| [P12 Backend rescues](#p12) | ○ | | | | ● | | ○ | ● | ● | |

● strong evidence · ○ supporting

## Check yourself

<details markdown="1"><summary>What belongs in a project's "honest status"?</summary>

What's live and used; what has never run against real services or users; what's missing for production (auth, persistence, scale); and which claims are unverified.

</details>

## Build it

Write your best project in the eight-part format and add it as a row in your own evidence matrix.

## What comes next

[13.2 reelslicer](/13-casebook/02-reelslicer), the flagship case study.
