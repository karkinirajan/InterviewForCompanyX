---
title: Code review and documentation
level: 1
summary: How to give and receive review, what reviewers look for, and the lightweight documents (README, ADRs, runbooks) that keep a codebase understandable.
outcomes: Prepare a pull request that's easy to review | Review others' code for correctness, not taste | Write an ADR and a runbook
---

## Why this matters

Review is how a team shares knowledge and catches mistakes before users do. Documentation is how decisions survive the people who made them. Both are visible in your public repositories, and interviewers read them.

## Preparing a pull request

- **Small:** under ~400 changed lines when possible. Large PRs get rubber-stamped.
- **One purpose:** don't mix a refactor with a feature.
- **Description:** what changed, why, how you tested it, anything risky, screenshots for UI.
- **Self-review first:** read your own diff in the PR view before asking anyone.

## What a reviewer checks, in priority order

1. **Correctness:** does it do what it claims, including edge cases and errors?
2. **Security and data:** auth checks, input validation, secrets, injection, data leaks.
3. **Failure behaviour:** timeouts, retries, what the user sees when it breaks.
4. **Tests:** do they prove the change works, and would they catch a regression?
5. **Design:** does it fit existing patterns? Is something duplicated that already exists?
6. **Readability:** names, structure, comments that explain *why*.
7. **Style:** leave this to linters and formatters.

Phrase comments as questions or suggestions, label nits ("nit:"), and approve once blocking issues are fixed.

## Reviewing AI-related changes

Add these checks: Is the prompt versioned and covered by an eval case? Is model output validated before use? Is untrusted text (user input, documents, tool results) kept separate from instructions? Are cost and token limits set? Is there a fallback? See the prompt checklist [C5](#c5).

## Documentation that earns its keep

| Document | Purpose | Length |
|---|---|---|
| README | What it is, how to run it, how to test it, status and known gaps | 1–2 screens |
| ADR (architecture decision record) | One decision: context, options, choice, consequences | Half a page |
| Runbook | How to diagnose and fix a known failure | A checklist |
| API reference | Generated from code (OpenAPI) where possible | Generated |

An ADR template:

```markdown
# ADR 0011: The model returns segment numbers, never timestamps
Status: accepted
Context: Clip cut points must fall on word boundaries; models invent plausible timestamps.
Decision: Number transcript segments; the model may only answer with segment numbers.
Consequences: Hallucinated timestamps become impossible; cut precision is limited by segmentation.
```

That's a real decision from a casebook project ([P1](#p1), [S4](#s4)).

## Common mistakes

- Review comments about taste while a missing auth check goes unnoticed.
- READMEs that describe the plan, not the current reality.
- Decisions living only in chat threads that disappear.

## Check yourself

<details markdown="1"><summary>What should a reviewer look at before style?</summary>

Correctness, security and data handling, failure behaviour, and whether the tests actually prove the change.

</details>

<details markdown="1"><summary>What four parts does an ADR have?</summary>

Context, the decision, the options considered (often inside context), and the consequences, plus a status.

</details>

## Build it

Write two ADRs for decisions in a project of yours, and a README section called "Known gaps" that lists what isn't finished or verified.

## What comes next

[2.5 CI/CD and releases](/02-software-lifecycle/05-ci-cd-and-releases).
