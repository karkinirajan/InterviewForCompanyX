---
title: Privacy and compliance
level: 3
summary: Personal data, health data, GDPR and HIPAA basics, and the engineering patterns (minimisation, retention, audit, vendor terms) that make compliance real.
outcomes: Classify data and apply minimisation, retention and access rules | Explain HIPAA's key terms and what a BAA is | Decide when personal data may go to an AI provider
---

## Why this matters

Regulated data (health, financial, children's, any personal data in the EU) changes what you may build and which vendors you may send it to. Compliance is a property of the whole system and organisation, not a badge on a landing page, and claiming it falsely is worse than not claiming it.

## Core ideas

- **PII:** personal information that identifies someone (name, email, phone, ID numbers, IP addresses in some regimes).
- **Data minimisation:** collect and send only what the task needs.
- **Retention:** keep data only as long as needed; define deletion.
- **Purpose limitation:** use data only for the purpose it was collected for.
- **GDPR** (EU/UK): lawful basis, consent where required, data-subject rights (access, deletion), processor agreements, transfer rules.
- **Data residency:** some data must stay in a region or country.

<a id="hipaa"></a>

## HIPAA in five minutes

HIPAA is the US law for health information. It's the example most health-tech and many AI consultancies work under, and the concepts generalise.

| Term | Meaning |
|---|---|
| Covered entity | Providers, health plans, clearinghouses |
| Business associate | A vendor handling PHI for them (a software consultancy can be one) |
| [BAA](#g-baa) | Business Associate Agreement: required before a vendor touches PHI |
| PHI | Health information tied to an individual; Safe Harbor de-identification removes 18 identifier types |
| Minimum necessary | Use only what the task needs |
| Audit controls | Record who accessed what, when |

> **Say:** "PHI never enters a prompt unless the endpoint is covered by a BAA; otherwise I de-identify upstream and re-identify only at presentation, with an audit trail. Deterministic logic for anything safety-critical. And compliance is a property of the whole system and organisation, not something the code can claim on its own."

## Engineering patterns

- **Classify** data fields (public, internal, personal, sensitive) and attach rules to classes.
- **Redact or tokenise** before sending data to third parties, unless the endpoint is covered by the right agreement.
- **Turn off provider-side storage** when the API allows it (one casebook app sets `store: false` on clinical data, [P2](#p2)), and read each vendor's data-use and training terms.
- **Hash identifiers** sent to providers instead of emails.
- **Audit logs** record actions and field names, never values ([P12](#p12)).
- **Encryption** at rest and in transit; per-tenant keys when contracts require.
- **Browser storage:** no sensitive data in `localStorage`.

## A cautionary tale

A self-audit of a healthcare AI app found its public FAQ claimed "HIPAA compliant" while the code supported no such claim ([S2](#s2)). The claims were removed. Never let marketing copy claim a compliance status the system and organisation haven't earned.

## Check yourself

<details markdown="1"><summary>What is a BAA and when is it needed?</summary>

A Business Associate Agreement under HIPAA: a contract required before a vendor creates, receives, stores or transmits PHI on behalf of a covered entity. Without one, PHI shouldn't be sent to that vendor (including an AI API).

</details>

<details markdown="1"><summary>Name five engineering controls for personal data in an AI feature.</summary>

Minimisation; redaction or tokenisation before external calls; provider storage off and vendor terms checked; hashed user identifiers; audit logs without values; defined retention and deletion; encryption; no sensitive data in long-lived browser storage.

</details>

## Build it

Write a data-classification table for an app you know: every stored field, its class, where it may be sent, and how long it's kept.

## What comes next

Part 6: [System design](/06-system-design), where everything from Parts 3–5 comes together.
