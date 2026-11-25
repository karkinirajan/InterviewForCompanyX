---
title: Requirements, estimation and agile delivery
level: 1
summary: Turning vague requests into testable acceptance criteria, estimating honestly, and working in sprints without ceremony overload.
outcomes:
- Write user stories with testable acceptance criteria
- Estimate with ranges and slice work into thin vertical increments
- Handle ambiguity and scope changes with clients and product owners
keypoints:
- A user story says who, what and why. Acceptance criteria must be testable (Given/When/Then).
- Always write the **anti-goals** (what must never happen). They prevent the worst AI incidents.
- Prefer thin vertical slices through every layer over building one layer at a time.
- Estimate in ranges, say what drives the range, and run a time-boxed **spike** for unknowns.
- Keep the agile rituals that shorten feedback; drop the ones that don't change decisions.
projects:
- name: Backlog for an AI support assistant
  stack:
  - Linear or GitHub Issues
  - Markdown
  build: Ten user stories with Given/When/Then criteria, anti-goals, estimates in ranges and one spike ticket, sliced vertically.
  practises: Turning a vague request into buildable, testable work.
- name: Estimation retro tracker
  stack:
  - Google Sheets or Airtable
  build: Log your estimate ranges against actual time for every task for a month and chart your bias.
  practises: Calibrating your own estimates with data.
---

## Why this matters

Most failed projects build the wrong thing well. Clarifying requirements is cheaper than any amount of good code, and it's the skill interviewers probe with "tell me about a time requirements were unclear".

## Core ideas

- **User story:** *As a [user], I want [capability] so that [benefit].* It names who and why, not how.
- **Acceptance criteria:** testable statements, often in Given/When/Then form. If you can't test it, it isn't a requirement yet.
- **Non-functional requirements:** latency, availability, security, privacy, cost, accessibility. They're the ones that get forgotten and then become incidents.
- **Vertical slice:** a thin piece of functionality that goes through every layer (UI → API → DB) and can be shown to a user. Prefer it over building all of one layer first.
- **Definition of done:** the team's shared checklist (tests, review, docs, deployed behind a flag, monitored).

## How to do it

### Clarifying a vague request

Ask, in this order: **who** uses it, **what problem** it solves today, **how we'll know it worked** (a metric), **what must never happen** (the anti-goals), and **constraints** (deadline, budget, data, compliance). Then write the acceptance criteria back to the requester and get a yes.

Example for an AI feature:

```text
Story: As a support agent, I want a suggested reply to each ticket
       so that I answer faster.
Given a ticket in English with order history available
When the agent opens it
Then a draft reply appears within 3 seconds (p95)
 And it cites the order or policy it relied on
 And the agent must click "Send"; nothing is sent automatically
 And if no relevant policy is found, no draft is shown, with a reason
```

The last two lines are the anti-goals. They matter more than the first.

### Estimating

- Estimate in **ranges** ("2–4 days") and say what drives the range.
- Break anything over ~3 days into smaller slices; estimates for small things are more accurate.
- Add explicit time for unknowns: a **spike** (a time-boxed investigation) before committing to an estimate for something new, like a model or vendor you haven't used.

### Agile without the theatre

Sprints, stand-ups, retros and backlogs exist to shorten feedback loops. Keep what does that: working software every week or two, a demo to real stakeholders, a short retro with one concrete change. Drop ceremonies that don't change decisions.

## Why this way

Thin vertical slices surface integration problems early and give stakeholders something real to react to. Ranges communicate uncertainty honestly; single numbers become promises.

## Common mistakes

- Accepting "make it smart" as a requirement.
- No anti-goals, so the AI feature does something nobody wanted (sends emails, changes records).
- Estimating only coding time and forgetting review, testing, deployment and the inevitable rework.

## Check yourself

<details markdown="1"><summary>A client says "add AI to our support system". What do you ask first?</summary>

Which task, for whom, and what it costs today (time per ticket, error rate); how we'll measure success; what the AI must never do (send without approval, give refunds); what data it may use and under which privacy terms; deadline and budget. Then propose the smallest slice that proves value.

</details>

<details markdown="1"><summary>What's a spike and when do you use one?</summary>

A time-boxed investigation to reduce uncertainty before estimating, for example "two days to test this vendor's extraction accuracy on 50 of our documents". Use it when the unknowns dominate the estimate.

</details>

## Build it

Write three user stories with Given/When/Then acceptance criteria and at least one anti-goal each for a feature you'd like to build.

## What comes next

[2.3 Testing strategy](/02-software-lifecycle/03-testing-strategy).
