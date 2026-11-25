---
title: Growing your career
level: 2
summary: The first 90 days in a new role, moving from freelance to full-time, getting to senior, and staying current in a field that changes monthly.
outcomes:
- Plan your first 90 days in a new engineering role
- Show senior-level behaviours before the title
- Keep your AI knowledge current without chasing every release
keypoints:
- 'First 90 days: run it, ship small in week one, own a feature, improve tests, evals or observability, then propose one data-backed change.'
- 'Freelance to full-time: keep the ownership, build review habits, design docs and on-call.'
- 'Senior behaviours: explicit trade-offs, named failure modes, raising others'' bar, choosing what not to build.'
- Stay current by re-running your own evals on new models rather than trusting launch claims.
projects:
- name: 90-day plan template
  stack:
  - Markdown
  - GitHub Projects
  build: A reusable first-90-days plan with weekly goals and a "first proposal" design-doc template.
  practises: Starting new roles deliberately.
- name: Model-release eval tracker
  stack:
  - Python
  - your eval sets
  - GitHub Actions on a schedule
  build: When a new model is released, run your saved evals against it and post a comparison table to a README.
  practises: Staying current with evidence.
---

## The first 90 days

| Period | Focus |
|---|---|
| Days 1–30 | Run everything locally; ship a small fix in week one; read the architecture docs, ADRs and recent postmortems; learn who owns what |
| Days 31–60 | Own a feature end to end; add one improvement to tests, evals or observability nobody asked for |
| Days 61–90 | Propose one change backed by data (a measured problem and a plan); write it as a short design doc |

## From freelance to full-time

Freelancing builds ownership, client communication and breadth. Full-time roles reward depth: living with your architecture for years, reviewing and being reviewed, and long feedback loops where evals and observability compound. Lean on the first set; deliberately build the second (code review habits, design docs, on-call).

## Getting to senior

Senior is a set of behaviours you can show before the title:

- Make trade-offs explicit in writing.
- Name failure modes before they happen.
- Raise the quality bar for others (reviews, templates, tooling).
- Choose what not to build.
- Communicate status and risk early, especially bad news.

## Staying current in AI without drowning

- Follow a few primary sources: the providers' release notes and docs, a couple of practitioner newsletters, one evaluation-focused community.
- Re-run your own evals when a new model arrives instead of trusting launch claims.
- Update this guide: when something changes, edit the lesson. Teaching it is how you keep it.

## A worked first proposal (day 60–90)

```text
Problem:  [X]% of support-assistant answers are edited heavily (edit distance > 50%);
          sampled reviews show most cite outdated policy versions.
Data:     a sample of answers over 4 weeks, with each heavy edit labelled by cause
Proposal: version-aware ingestion (supersede old chunks) + an eval set of 50 policy questions
          gated in CI.
Cost:     ~1 week; no model change.
Success:  heavy-edit rate halved in 4 weeks; no regression on the eval set.
Rollback: feature flag on the new retrieval filter.
```

(The numbers are placeholders: fill them from your team's data.) Small, measured, reversible and tied to a user-visible outcome: that's what earns trust in a new team.

## Check yourself

<details markdown="1"><summary>What should your first proposal in a new job look like?</summary>

A measured problem (with data), a small, reversible plan, the trade-offs, and how you'll know it worked, written as a short design doc.

</details>

## What comes next

Part 13: [The casebook](/13-casebook), real projects written up as case studies.
