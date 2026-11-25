---
title: Workflow automation across SaaS tools
level: 4
summary: Automating business processes with webhooks, APIs and tools like n8n, Zapier and Make, adding AI steps safely, and knowing when to write code instead.
outcomes:
- Build an event-driven automation with webhooks and retries
- Add AI classification or extraction steps with validation
- Choose between no-code tools and custom code
keypoints:
- Webhooks need verified signatures, a fast 200, async processing, dedupe by event ID, and tolerance for out-of-order delivery.
- Store OAuth tokens encrypted, refresh them early, and keep them out of the browser.
- AI steps return structured output that's validated, with business rules applied in code.
- Every automation needs failure alerts. Silent failure is the default otherwise.
- No-code (n8n, Zapier, Make) for standard connectors; code for complex logic, volume and testing; hybrid is common.
projects:
- name: Lead intake automation
  stack:
  - n8n (self-hosted)
  - Postgres
  - an LLM API
  - Slack
  build: Form submission → AI classification and extraction (validated) → CRM row → Slack alert, with dedupe and a failure-notification branch.
  practises: Reliable no-code-plus-AI automation.
- name: CV screener to ATS
  stack:
  - Python
  - Typer
  - Gemini or another LLM
  - Notion API
  build: The recruit-cli pattern, with bounded scores, category derived in code, dedupe by email + job, a circuit breaker after three failures and a non-zero exit on errors.
  practises: Automation guardrails in code.
---

## Why this matters

A large share of "AI integration" work is automation: when an email arrives, classify it, extract data, update the CRM, notify Slack. Businesses pay well for reliable automations, and they fail in predictable ways (duplicates, lost events, silent errors) that backend engineers know how to prevent.

## Core ideas

- **Triggers:** webhooks (push), polling (pull), schedules.
- **Webhooks:** verify signatures; respond fast (`200` then process async); expect duplicates and out-of-order delivery; store events by ID for idempotency.
- **OAuth connections** to SaaS tools; store tokens encrypted; refresh before expiry; keep tokens out of the browser ([P7](#p7)).
- **AI steps:** classification, extraction, summarisation, drafting, with structured output and validation like any model call.
- **Tools:** n8n (self-hostable, code-friendly), Zapier and Make (hosted, huge connector libraries), cloud workflow services, or custom code.

## A worked example

```text
New CV in a folder
 → extract text
 → model screening: integer score 0–100 + reasons (schema-validated)
 → category derived from score in code (never from the model)
 → clean values the destination would reject
 → dedupe by email + job ID
 → write to the recruiting database (Notion, ATS)
 → stop after 3 consecutive model failures; exit non-zero if any CV failed
```

That's the casebook's recruiting CLI ([P5](#p5)), and it shows every automation principle: validated AI output, deterministic business rules, idempotency, a circuit breaker and honest failure reporting.

## No-code or code?

| Choose a no-code tool when | Choose code when |
|---|---|
| Standard connectors exist; low volume; business users must edit flows | Complex logic, high volume, strict testing or compliance needs |
| Speed to first version matters most | You need version control, code review and CI |
| The cost per run is acceptable | Per-task pricing gets expensive at scale |

Hybrid is common: a no-code tool for triggers and connectors calling your own API for the AI and business logic.

## Common mistakes

- Processing webhooks synchronously, then timing out and receiving retries (duplicates).
- No signature verification.
- AI output written straight into a CRM without validation.
- Automations failing silently for weeks; every flow needs failure alerts.

## Interview follow-ups

- **"The CRM rate-limits your sync. What do you do?"** Queue writes, respect `Retry-After`, batch where the API allows, and spread work over time with a token bucket per integration.
- **"How do you test an automation that touches five SaaS tools?"** Sandbox accounts, recorded fixtures for each API, contract tests on the payloads you depend on, and an end-to-end smoke run on a schedule.

## Check yourself

<details markdown="1"><summary>How do you make a webhook consumer reliable?</summary>

Verify the signature; store the event with its ID (unique constraint) and return 200 quickly; process asynchronously with retries and a DLQ; make processing idempotent; alert on failures.

</details>

## Build it

Build an automation in n8n (self-hosted in Docker) or code: new form submission → AI classification with schema validation → write to a database → Slack message, with dedupe and failure alerts.

## What comes next

[11.3 Document AI](/11-ai-automation/03-document-ai).
