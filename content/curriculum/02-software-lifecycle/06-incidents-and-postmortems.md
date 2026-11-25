---
title: Incidents, on-call and postmortems
level: 2
summary: 'Detecting, mitigating and learning from production failures: severity, roles, the mitigate-first mindset and blameless postmortems.'
outcomes:
- Run the first 15 minutes of an incident
- Write a blameless postmortem with real action items
- Tell a "what broke in production" story well
keypoints:
- Alert on symptoms users feel, and link every alert to a runbook.
- In the first 15 minutes, assess impact, find what changed, and **mitigate first** (rollback, flag off, failover).
- Run blameless postmortems. Ask how the system allowed it, and assign owners and dates to actions.
- '"A generic error message is an outage you can''t see." Name every failure class.'
- 'AI incidents: provider outage, silent model drift, cost spikes, injection-driven actions.'
projects:
- name: Chaos day for your own app
  stack:
  - Docker Compose
  - toxiproxy
  - Grafana
  build: Inject latency and failures into the database and an external API, observe the alerts, follow your runbook, and write a postmortem.
  practises: Detection, mitigation and blameless write-ups.
- name: Status page + incident bot
  stack:
  - Next.js
  - Slack API
  - Postgres
  build: A slash command that opens an incident, assigns roles, posts timed updates and generates a postmortem skeleton from the timeline.
  practises: Incident roles and communication.
---

## Why this matters

Everything breaks eventually. What distinguishes strong engineers is how fast they notice, how calmly they mitigate, and whether the same failure happens twice. "Tell me about something that broke in production" is among the most common interview questions.

## Core ideas

- **Detection:** alerts on symptoms users feel (error rate, latency, failed jobs, cost spikes), not on every CPU blip.
- **Severity:** a shared scale (SEV1 = major user impact) decides who gets woken up.
- **Roles:** an incident commander coordinates; others investigate; one person communicates.
- **Mitigate first, then fix:** roll back, turn off the flag, fail over, scale up. Root-cause later.
- **Blameless postmortem:** the question is "how did the system allow this?", not "who did it?". People hide mistakes in blame cultures, and the system never improves.

## The first 15 minutes

1. Acknowledge the alert; open an incident channel; name an incident commander.
2. **Assess impact:** who is affected, since when, how badly?
3. **What changed?** Recent deploys, config changes, flag flips, provider status pages.
4. **Mitigate:** roll back the last deploy, disable the feature, switch provider, shed load.
5. Communicate status at regular intervals, even "still investigating".
6. Once stable, keep evidence (logs, dashboards) for the postmortem.

## Postmortem template

```markdown
## Summary        one paragraph: what happened, impact, duration
## Timeline       detection → mitigation → resolution, with times
## Root cause(s)  the chain of conditions, not a person
## What went well / what didn't
## Action items   owner + due date; prevent, detect sooner, mitigate faster
```

## A real "what broke" story, in shape

From the casebook ([S2](#s2)): an AI compliance app requested a model name that didn't exist, so **every** evaluation failed, and the UI showed one generic "capacity reached" message for every failure, which hid the cause. The fix wasn't only the model name: each failure class got its own status code and message (401, 422, 429 with `Retry-After`, 502 for model failure, 503 for missing configuration), and input validation replaced pasting raw request bodies into the prompt. The lesson: **"A generic error message is an outage you can't see."**

## AI-specific incidents

- Provider outage or rate limiting → fallback provider or honest degradation ([Q12](#q12)).
- Quality regression after a silent model update → pin model versions; evals on sampled traffic.
- Cost spike from a loop or an abusive user → per-tenant budgets and alerts ([Q37](#q37)).
- Prompt injection causing unwanted actions → tool-level authorization ([Q25](#q25)).

## Common mistakes

- Debugging the root cause while users are still affected.
- Postmortems with action items like "be more careful".
- Alerts nobody acts on, which teach the team to ignore alerts.

## Interview follow-ups

- **"What makes a good alert?"** Actionable, tied to user impact, low false-positive rate, with a runbook link and an owner.
- **"Tell me about an incident you handled."** Impact, detection, mitigation first, root cause, and the permanent changes (tests, alerts, process). Own your part honestly.

## Check yourself

<details markdown="1"><summary>An error-rate alert fires 10 minutes after a deploy. First move?</summary>

Assess impact quickly, then roll back the deploy (mitigate), and investigate afterwards. A recent change is the most likely cause.

</details>

<details markdown="1"><summary>Why blameless?</summary>

Because people only report mistakes honestly when they're safe, and the real causes are almost always systemic: missing tests, missing alerts, confusing tooling. Blame stops the learning.

</details>

## Build it

Write a postmortem for a bug you've caused or seen, using the template, with at least one action item each for prevention, detection and mitigation.

## What comes next

Part 3: [Backend engineering](/03-backend), the core of the full-stack skill set and the home of every AI integration.
