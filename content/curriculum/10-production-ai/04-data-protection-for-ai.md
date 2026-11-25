---
title: Data protection for AI systems
level: 4
summary: Personal and health data in prompts, provider data terms, SSRF in AI tools, and secrets handling around model APIs.
outcomes:
- Decide what data may reach which model endpoint
- Protect outbound calls made by AI features
- Keep API keys out of logs, errors and code
keypoints:
- 'Q28: minimise, redact or tokenise before uncovered endpoints, store off, hashed IDs, audit logs without values, retention.'
- 'Q29: every server-side fetch (including presigned URLs and agent web tools) needs SSRF defences.'
- 'Q30: secrets by name, out of logs, errors and `repr`; refuse placeholders; rotate on exposure.'
- Check each vendor's storage, training use, region and agreements (DPA/BAA) before sending real data.
- Record consent per item for evaluation datasets.
projects:
- name: Privacy-safe AI logging
  stack:
  - Python
  - structlog
  - Presidio
  - pytest
  build: A logging layer that redacts PII and secrets from every AI call log, with tests proving keys and emails never appear.
  practises: Log hygiene for AI systems.
- name: Vendor terms register
  stack:
  - Airtable or Markdown
  - a small checker script
  build: A register of every AI/OCR/speech vendor's storage, training and region terms, plus a CI check that only registered vendors appear in config.
  practises: Turning data-terms diligence into a control.
---

## Why this matters

AI features move data to new places: third-party model APIs, vector stores, logs full of prompts, browser storage of drafts. Each move needs the same discipline as any data flow, applied consistently. This lesson applies [5.5](/05-cloud-devops-security/05-application-security) and [5.6](/05-cloud-devops-security/06-privacy-and-compliance) to AI.

<a id="q28"></a>

## Q28. PII and PHI?

Minimize; redact or tokenize before external calls unless the endpoint is covered ([HIPAA basics](#hipaa)); provider storage off (`store: false`, [P2](#p2)); hash user identifiers sent to providers; keep clinical drafts out of long-lived browser storage; audit logs that record field names, never values ([P12](#p12)); retention and deletion defined; obligations confirmed, not assumed.

<a id="q29"></a>

## Q29. Outbound calls and SSRF?

Any URL your server fetches on someone's behalf, including vendor-issued presigned URLs, is an attack path. Require https, resolve and refuse private, loopback and link-local addresses, send no API key to storage hosts, stream large files. Casebook: SSRF hardening for presigned storage URLs ([P1](#p1)); checking every URL called for a user ([P7](#p7)). Agents with web or HTTP tools make this critical.

<a id="q30"></a>

## Q30. Secrets?

Read keys by name from the environment or a secrets manager; say only whether a key is set; keep it out of `repr`, logs and error bodies (scrub); refuse to start with placeholder secrets ([P7](#p7)); never in git, rc files or chat. Casebook: [P1](#p1) keeps the API key out of `repr` and scrubs it from error bodies.

## Vendor data terms checklist

Before sending real user data to any model or speech/OCR vendor, check:

- Is input/output stored? For how long? Can storage be disabled?
- Is data used for training by default? Can you opt out (and did you)?
- Which regions process the data?
- Is there a data-processing agreement, and a BAA if health data is involved?
- Does consent from the data subject cover this processing?

Some speech and AI vendors train on uploads unless you opt out; read terms before sending anyone's audio or documents. Record consent per item for evaluation datasets ([Q24](#q24)).

## Common mistakes

- Logging full prompts and completions with personal data in plain text.
- Using a consumer chat app with client data.
- Embedding personal data into a shared vector index without tenant filters.

## Check yourself

<details markdown="1"><summary>Where should de-identification happen in a pipeline that calls an uncovered model API with clinical text?</summary>

Upstream, before the call: detect and replace identifiers with tokens, send only de-identified text, and re-identify only at presentation for authorised users, with an audit trail. Better still, use an endpoint covered by the right agreement.

</details>

<details markdown="1"><summary>Name four places an API key can leak in an AI service.</summary>

Source control; logs (including debug prints of config objects); error messages echoing provider responses; images or build artefacts; client-side code; shared chat or tickets.

</details>

## Build it

Add a redaction step before your model calls (emails, phone numbers, IDs), a structured log that records which fields were redacted without values, and a test proving the key never appears in any log line or error.

## What comes next

[10.5 Observability and cost](/10-production-ai/05-observability-and-cost).
