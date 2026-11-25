---
title: Behavioural and culture interviews
level: 1
summary: Mapping your stories to a company's values, answering the classic behavioural prompts, and talking about trade-offs and mistakes with maturity.
outcomes:
- Map company values to concrete evidence
- Answer the eight classic behavioural prompts
- Discuss mistakes and disagreements without defensiveness
keypoints:
- Map each company value to a concrete story.
- Short-term vs long-term means the smallest safe slice, with the trade-off said out loud.
- Disagreement means arguing with data, then committing. A mistake means owning it, the fix and the lasting change.
- Explain AI to non-engineers as making the product deterministic around a non-deterministic model.
- Say "I" for your part, and never criticise former employers.
projects:
- name: Values evidence board
  stack:
  - Notion or Markdown
  build: For three target companies, map their stated values to your stories with one-line evidence each.
  practises: Company-specific behavioural prep.
- name: Mock behavioural loop
  stack:
  - A friend or an LLM interviewer prompt
  - a timer
  - a recorder
  build: Six behavioural questions, two minutes each, recorded and self-scored on clarity, ownership and lesson.
  practises: Delivery under time pressure.
---

## Why this matters

Technical skill gets you to the final round; behaviour often decides the offer. Interviewers are asking: will this person be good to work with, own their work, and tell us the truth?

## Map values to evidence

Read the company's stated values and map each to a story. Example (values from a real consultancy's careers page):

| Value | Evidence |
|---|---|
| Customer focus | Consistent client outcomes (e.g. a 100% job-success record across many contracts) |
| Accountable freedom | Self-directed delivery; flagging problems early ([S3](#s3)) |
| Being remarkable | Measure-first engineering ([S5](#s5)) |
| Celebrating efforts | **[fill]** a time you credited a teammate or client |
| Embracing openness | Auditing your own app and writing down what was wrong ([S2](#s2)) |

## Classic prompts and angles

| Prompt | Angle |
|---|---|
| Short-term delivery vs long-term health | Ship the smallest end-to-end slice, but guardrails and observability are part of done; if the deadline forbids it, ship behind a flag with manual review and say the trade-off out loud |
| A production failure | [S2](#s2) or [S3](#s3) |
| Disagreement | Argued with data, then committed to the decision **[fill]** |
| A mistake | Small, real, with what changed afterwards **[fill]** |
| Learning fast | Docs → small spike → map one of your existing patterns → measure |
| Explaining AI to non-engineers | "LLMs are non-deterministic; here's how we make the product deterministic around them" |
| "What are you passionate about?" | Answer without the word: "AI systems people can trust in high-stakes work. A guardrail that stops one bad output satisfies me more than a demo." |
| Working in a team after freelancing | Team practices you already run: reviews, ADRs, CI gates |

## How to talk about mistakes

Own it in the first sentence, keep the blame on systems not people, describe the fix and what changed permanently (a test, an alert, a process). Interviewers distrust candidates who've "never made a mistake".

## Common mistakes

- Stories with "we" throughout, so the interviewer can't tell what you did.
- Criticising former employers or clients.
- Rambling past two minutes.

## Check yourself

<details markdown="1"><summary>How do you answer "short-term delivery vs long-term health"?</summary>

Ship the smallest end-to-end slice with guardrails and observability as part of done; if the deadline truly forbids that, ship behind a flag with manual review, state the trade-off and the debt explicitly, and schedule the fix.

</details>

## Build it

For your next target company, build the values → evidence table and fill every **[fill]** in your own story bank.

## What comes next

[12.5 Technical interview playbook](/12-career-and-interviews/05-technical-interview-playbook).
