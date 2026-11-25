---
title: The SDLC end to end
level: 1
summary: The stages from idea to operation, who owns what, and the artefacts each stage leaves behind, with the AI-specific additions.
outcomes:
- Name the SDLC stages and their outputs
- Explain waterfall, agile and continuous delivery as trade-offs
- Describe what "owning a feature across the SDLC" means in an interview
keypoints:
- 'Stages: discover → requirements → design → build → verify → release → operate → learn.'
- 'AI adds work at each stage: quality, latency and cost budgets; an eval plan; canary or shadow releases; drift monitoring.'
- Waterfall, agile and continuous delivery are trade-offs. Choose by uncertainty and the cost of mistakes.
- Owning a feature across the SDLC means you can describe what you did *before* the code and *after* the merge.
projects:
- name: Feature dossier
  stack:
  - Markdown
  - GitHub Projects
  build: Take one feature from idea to production on paper, with a problem statement, acceptance criteria, design notes, test plan, rollout plan and runbook.
  practises: Thinking past the code to the whole lifecycle.
- name: Changelog-driven release
  stack:
  - GitHub Actions
  - Conventional Commits
  - release-please
  build: A repo that generates release notes and versions automatically from commit messages on merge to main.
  practises: Release discipline and traceability.
---

## Why this matters

Job descriptions say "own the feature across the SDLC". Interviewers test it by asking what you'd do *before* writing code and *after* merging it. Juniors describe coding; seniors describe the whole loop.

## The stages

| Stage | Question it answers | Typical artefact | AI-specific addition |
|---|---|---|---|
| Discover | What problem, for whom, worth how much? | Problem statement, metrics | Is a model even needed? What does a wrong answer cost? |
| Requirements | What must it do, and not do? | User stories, acceptance criteria | Quality bar (e.g. ≥ 95% field accuracy), latency and cost budgets |
| Design | How will it work? | Design doc, ADRs, API contract | Prompt/schema design, eval plan, fallback path |
| Build | Make it | Code, tests | Prompts as versioned code |
| Verify | Does it work? | Tests, review, QA | Evals on a golden set ([10.2](/10-production-ai/02-evaluation)) |
| Release | Ship safely | CI/CD, feature flags, canary | Shadow or canary for model and prompt changes ([Q15](#q15)) |
| Operate | Is it still working? | Dashboards, alerts, runbooks | Quality drift, cost per task, refusals ([Q36](#q36)) |
| Learn | What do we change? | Postmortems, metrics review | User corrections feed the eval set |

## Process models as trade-offs

- **Waterfall:** each stage completes before the next. Predictable on paper; expensive when you learn late that a requirement was wrong. Still common where regulation demands documented phases.
- **Agile (Scrum, Kanban):** short cycles, working software each iteration, requirements refined as you learn. Most product teams work this way.
- **Continuous delivery:** every merged change is releasable; deploys happen many times a day behind tests and flags. It needs strong automation to be safe.

No model is "right". Pick by how much is unknown and how expensive mistakes are.

## How to "own a feature across the SDLC"

Say what you did at each stage, not just the code:

> "I clarified the acceptance criteria with the product owner, wrote a one-page design with the API contract and a fallback for when the provider is down, built it behind a flag with tests and an eval set, rolled it out to 5% of users with dashboards for latency, cost and correction rate, and wrote the runbook."

## Common mistakes

- Starting with code before agreeing what "done" means.
- No plan for operations: who gets paged, which dashboard shows it's broken.
- Treating AI features as done once the demo works. Without evals and monitoring, quality silently drifts.

## Interview follow-ups

- **"Walk me through how you delivered a feature."** Use the stages: what you clarified, the design and its trade-off, how you tested and released it (flags, canary), what you monitored, and what you learned.
- **"How is the SDLC different for an AI feature?"** Quality bars and eval sets in requirements, prompt/schema design, evals as release gates, shadow or canary rollouts, and drift monitoring in operations.

## Check yourself

<details markdown="1"><summary>Which SDLC stages does an AI feature add work to, and what work?</summary>

Requirements (quality, latency and cost budgets; cost of a wrong answer), design (prompt and schema, eval plan, fallback), verify (evals on a golden set), release (shadow or canary for model and prompt changes) and operate (drift, cost per task, refusals, user corrections).

</details>

<details markdown="1"><summary>When would you argue for a more waterfall-like process?</summary>

When requirements are stable and well understood, or when regulation requires documented sign-off between phases (some medical, financial and government work), and the cost of late change is very high.

</details>

## Build it

Take a feature you've built. Write one line per SDLC stage describing what you did, or what you'd do now. The gaps are your learning list.

## What comes next

[2.2 Requirements, estimation and agile](/02-software-lifecycle/02-requirements-estimation-agile).
