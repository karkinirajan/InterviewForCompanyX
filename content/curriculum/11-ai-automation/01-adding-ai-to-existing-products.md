---
title: Adding AI to existing products
level: 4
summary: Finding the right first AI feature in a brownfield system, integrating it without destabilising the product, and measuring whether it helped.
outcomes: Choose a first AI feature by value, risk and measurability | Integrate behind flags, adapters and existing auth | Prove impact with a before/after metric
---

## Why this matters

Clients and employers usually have a working product and want "AI in it". The engineering challenge is respecting the existing architecture (its auth, data model, conventions and deploy process) while adding a dependency with new failure modes.

## Choosing the first feature

Score candidates on four axes:

| Axis | Prefer |
|---|---|
| Value | Saves measurable time or improves a measurable outcome |
| Risk | Low cost of a wrong answer, or a human reviews before effect |
| Data | Inputs already available, with clear permission to use them |
| Measurability | A baseline exists (time per ticket, error rate, conversion) |

Good first features: drafting (replies, summaries, descriptions) with human review; classification and routing; extraction into forms that a person confirms; search over internal knowledge. Risky first features: autonomous actions, anything touching money or health decisions without review.

## Integrating without breaking things

- **Respect the architecture:** the frontend talks to the backend API, which calls a service, which calls the model adapter; no shortcuts from the UI to the model with a key in the browser.
- **Reuse existing auth and permissions;** the AI feature sees only what the user may see.
- **Feature flag** the feature; launch to internal users, then a percentage.
- **Async where slow:** queue long work; show status.
- **Fallback:** the old workflow still works if the model is down.
- **Sanitise output** for the existing UI (a casebook example sanitises AI-drafted descriptions on the way out so editor markup can't run script, [P12](#p12)).

## Proving it helped

Before launch, record the baseline. After launch, compare the same metric for users with and without the feature (or before/after with care), plus quality signals (edit rate, acceptance) and cost per task. Report the number with its baseline, period and method.

## Common mistakes

- Starting with the flashiest feature instead of the most measurable one.
- A new parallel auth path for the AI service.
- No baseline, so success can't be shown.

## Check yourself

<details markdown="1"><summary>A support team wants AI. What's a strong first feature and why?</summary>

Suggested reply drafts that agents edit and send: clear value (handle time), low risk (human sends), data available (ticket + knowledge base), measurable (handle time, edit distance, acceptance).

</details>

## Build it

Pick a product you know; score three candidate AI features on the four axes and write a one-page plan for the winner, including the baseline metric.

## Worked example: a rollout plan

**Feature:** AI-drafted replies in an existing support desk.

1. **Week 0:** baseline: median handle time, CSAT, reopen rate for the target queue.
2. **Week 1:** adapter + prompt + 50-ticket eval set; drafts behind a flag, internal team only.
3. **Week 2:** 10% of agents; log draft acceptance, edit distance, handle time; daily review of bad drafts.
4. **Week 3:** fix the top failure categories; re-run evals; expand to 50%.
5. **Week 4:** compare flag-on vs flag-off agents on handle time and quality; decide on full rollout.

Kill switch at every stage: the flag turns drafts off without a deploy.

## Interview follow-ups

- **"The client wants it in two weeks."** Ship the smallest slice that keeps guardrails: drafts only, human sends, one queue, flag-gated, with logging. Say what's deferred (automation, more queues) and why.
- **"How do you avoid breaking the existing product?"** Separate service or module behind an interface, async calls with timeouts, the old workflow as fallback, and no schema changes that old code can't handle.

## More check-yourself

<details markdown="1"><summary>Why compare flag-on and flag-off users instead of before and after?</summary>

Before/after comparisons mix in seasonality, staffing and other changes. Running both groups at the same time isolates the feature's effect.

</details>

## What comes next

[11.2 Workflow automation](/11-ai-automation/02-workflow-automation).
