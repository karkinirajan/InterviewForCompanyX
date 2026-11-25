---
title: How to learn engineering
level: 0
summary: 'Deliberate practice, retrieval, spaced repetition and building in public: the study habits that turn this guide into skill.'
outcomes:
- Run a weekly study loop
- Use retrieval practice instead of rereading
- Build a portfolio that proves skill rather than lists it
keypoints:
- Retrieval beats rereading. Answer before you look.
- Spaced repetition. Review after a day, a week, a month.
- Deliberate practice means working just beyond your ability, on one weakness, with fast feedback.
- Learn a codebase by running it, following one request end to end, and reading the tests.
- Use AI coding assistants to review your work, not to replace it. Never keep code you can't explain.
- A portfolio proves skill when its README states decisions, numbers with baselines, and known gaps.
projects:
- name: Flashcard drill from the question bank
  stack:
  - Python
  - SQLite
  - Typer
  build: A CLI that asks a random check-yourself question, times your spoken answer, records your 0/1/2 score and schedules the next review (SM-2 style).
  practises: Spaced repetition and a small data model.
- name: Codebase tour log
  stack:
  - Any open-source FastAPI or Django project
  - Markdown
  build: Clone a real project, run it, trace one request end to end, and write a one-page "how it works" with a diagram.
  practises: Reading unfamiliar code, which is the skill you'll use most at work.
---

## Why this matters

Most people learn engineering by reading tutorials and feeling productive. Then they freeze in an interview, or in front of an unfamiliar codebase, because recognising an idea is not the same as producing it. The fix is well studied: practise *recalling* and *applying*, not re-reading.

## Core ideas

- **Retrieval practice.** Trying to remember something strengthens memory far more than reading it again. That's why every lesson ends with questions you answer before looking.
- **Spaced repetition.** Revisit material just as you're about to forget it: after a day, a week, a month. The "mark complete" button is a reminder to come back in a week.
- **Deliberate practice.** Work just beyond your current ability, on a specific weakness, with fast feedback. Building the same CRUD app five times isn't deliberate practice; adding auth, then caching, then a queue to it is.
- **Generation.** Explaining a topic in your own words, or writing the code from a blank file, exposes gaps that reading hides.

## The weekly loop

1. **Monday:** pick two or three lessons. Read each once, quickly.
2. **Tuesday to Thursday:** build each lesson's exercise. Get stuck, read docs, finish it.
3. **Friday:** answer the check-yourself questions out loud, recorded, with a timer at two minutes per answer. Mark lessons complete only if you passed.
4. **Weekend:** review last week's lessons and last month's (spaced repetition). Write a short note in your own words on one thing you learned.

## Learning in a codebase you didn't write

At work, most learning happens inside an existing system. A reliable method:

1. Run it locally first. If you can't run it, you can't learn it.
2. Follow one request end to end: route → handler → service → database → response.
3. Read the tests; they're the most honest documentation.
4. Make a tiny change, see it break, fix it.
5. Write down what surprised you. That list becomes your questions for the team.

## Using AI coding assistants while learning

AI assistants make you faster and can also stop you from learning. Rules that keep the benefit:

- **Write it yourself first** for anything in this guide's exercises; ask the assistant to review afterwards.
- **Never accept code you can't explain.** If an interviewer opens your repository, "the agent wrote it" is not an answer; "I specified it, reviewed it and gated it" is. See [S9](#s9).
- **Ask for explanations, not just answers:** "why this and not that?" is the question that builds judgment.

## Build a portfolio that proves, not lists

Recruiters and interviewers open repositories. A strong portfolio project:

- solves a real problem, ideally your own;
- has a README that says what it does, how to run it, and **what's not finished**;
- records decisions (short ADRs, see [2.4](/02-software-lifecycle/04-code-review-and-documentation));
- has tests and CI;
- has numbers you can defend: what you measured, how, against what baseline.

One honest, finished, well-documented project beats ten tutorials. Part 13 shows real examples.

## Common mistakes

- Re-reading instead of recalling.
- Collecting courses instead of finishing one project.
- Claiming numbers you can't explain. Every metric on your CV needs a baseline, a measurement method and your share of the work.
- Learning AI before learning to ship software.

## Check yourself

<details markdown="1"><summary>Why answer questions before opening the answer?</summary>

Retrieval practice: the effort of recalling strengthens memory far more than rereading, and it shows you exactly what you don't know.

</details>

<details markdown="1"><summary>What four things should a portfolio README contain?</summary>

What it does; how to run it; decisions and trade-offs; and honestly, what isn't finished or verified.

</details>

## Build it

Set up your study system: a notes folder (one Markdown file per lesson, in your own words) and a calendar reminder for the Friday out-loud review.

## What comes next

Part 1: [Foundations](/01-foundations). If you're already working as an engineer, skim each lesson's check-yourself questions and only read what you can't answer.
