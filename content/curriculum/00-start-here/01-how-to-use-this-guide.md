---
title: How to use this guide
level: 0
summary: How the book is organised, what every lesson contains, and the fastest route through it for your current level.
outcomes:
- Pick the right starting part for your level
- Use IDs, search and previews to move around
- Know what "done" means for a lesson
keypoints:
- Two modes. **Look it up** (search with `/`, read key points first) or **follow through** (the interview route, or the book in order).
- Applied AI sits on top of full-stack engineering, so the parts are ordered that way.
- Every lesson has the same shape. Key points → why → core ideas → how → why this way → mistakes → check yourself → two projects → next.
- Level badges (L0–L4) show when a topic starts to be *expected* of you.
- IDs (Q, D, C, P, S, glossary) are stable. Hover to preview, click to jump.
- Done means you can answer the check-yourself questions out loud, with a trade-off and an example.
projects:
- name: Personal study tracker
  stack:
  - Next.js
  - TypeScript
  - localStorage
  build: A small app listing the lessons you're studying, with a 0/1/2 score per check-yourself question and a "review again" date one week later.
  practises: Spaced repetition and honest self-scoring; React state and persistence.
- name: Notes vault with backlinks
  stack:
  - Markdown
  - Obsidian or Git
  - a static site generator
  build: One Markdown note per lesson in your own words, with links between related notes, published as a private static site.
  practises: Generation (writing in your own words) and building your own reference.
---

## Why this matters

A curriculum is only useful if you know where you are in it. This guide covers ground from "what is a terminal" to "design a multi-tenant agent platform", so reading it front to back is right for an intern and a waste of time for a mid-level engineer. This lesson tells you how to find your own route.

## How the book is organised

The guide has fifteen **parts**, numbered 0 to 14 like chapters. Each part has 3 to 8 **lessons**, numbered like sections (`8.3` is the third lesson of Part 8).

| Parts | Layer | What you get |
|---|---|---|
| 0 | Orientation | The map and a study method |
| 1–2 | Foundations and delivery | Tools, languages, the web, and how software gets shipped by teams |
| 3–5 | Full-stack core | Backend, frontend, cloud, DevOps, security |
| 6 | System design | Turning requirements into architectures, including AI systems |
| 7–11 | Applied AI | LLMs, RAG, agents, production AI and automation |
| 12 | Career | Interviews, stories, growth |
| 13 | Casebook | Real project write-ups to learn from and to present |
| 14 | Reference | Question bank, glossary, code kit, sources |

The order is deliberate. **Applied AI sits on top of full-stack engineering, not beside it.** An LLM feature is an API call inside a web service, behind auth, writing to a database, observed in production. Engineers who skip Parts 3–5 build demos; engineers who have them build products.

## What every lesson contains

Every lesson follows the same shape, so you always know where to look:

1. **Why this matters**: the problem the topic solves, and when you'll meet it at work.
2. **Core ideas**: the concepts, defined plainly.
3. **How to do it**: concrete steps, commands or code.
4. **Why this way**: the trade-offs, the alternatives, and when to choose each. This is the part interviews test.
5. **Common mistakes**: what goes wrong in real codebases.
6. **Check yourself**: questions with hidden answers. Answer out loud *before* you open them.
7. **Build it**: a small exercise.
8. **What comes next**: where the topic leads.

Each lesson carries a **level badge** (L0 intern to L4 applied AI engineer). The level is where the topic starts to be *expected* of you, not where you're first allowed to read it.

## Navigating

- **Search:** press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd>. Search covers lessons, headings and IDs.
- **IDs:** reusable items have short IDs: interview questions `Q1`–`Q44`, design drills `D1`–`D4`, code `C1`–`C5`, project case studies `P0`–`P13`, stories `S1`–`S11`, glossary terms. Hover an ID link (for example [Q12](#q12)) to preview it; click to jump.
- **Progress:** mark a lesson complete at the bottom of the page. Progress lives in your browser only.
- **Study timer:** each lesson has a timer sized to its reading time plus ten minutes of practice.

## Suggested routes

| You are | Start at | Then |
|---|---|---|
| Intern or student | [0.2](/00-start-here/02-the-career-map), then Part 1 in order | Parts 2–4, one lesson a day |
| Junior engineer | Skim Part 1's check-yourself questions; read what you can't answer | Parts 2–5 properly, then 6 |
| Mid-level full-stack engineer moving into AI | [7.1](/07-llm-foundations/01-from-full-stack-to-applied-ai) | Parts 7–11 in order, dipping back into 3 and 5 when a lesson points there |
| Preparing for an interview next week | [12.5](/12-career-and-interviews/05-technical-interview-playbook) and the [question bank](/14-reference/01-question-bank) | Your weakest part, then the [design drills](/06-system-design/04-ai-system-design-drills) |

## What "done" means

A lesson is done when you can answer every check-yourself question **out loud, in under two minutes each, with a trade-off and an example**, without opening the answer. Reading it is not done.

## Check yourself

<details markdown="1"><summary>Why does the applied AI material come after backend, frontend and cloud?</summary>

Because an AI feature is a software feature. It runs inside an API, needs auth and data access, has to be deployed, observed and secured, and is shown in a UI. The model call is one line; the system around it is the job.

</details>

<details markdown="1"><summary>What does an L2 badge on a lesson tell you?</summary>

That a mid-level engineer is expected to know this topic well. Juniors can and should read it; it's a signal of when the gap starts to hurt, not a gate.

</details>

## What comes next

[0.2 The career map](/00-start-here/02-the-career-map) describes the five levels in detail, so you can place yourself honestly.
