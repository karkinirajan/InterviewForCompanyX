---
title: Testing strategy
level: 1
summary: The testing pyramid, what to test at each level, test doubles, coverage versus mutation testing, and how testing changes for non-deterministic AI features.
outcomes:
- Choose unit, integration and end-to-end tests deliberately
- Mock external services without lying to yourself
- Explain why mutation testing beats coverage as a quality signal
keypoints:
- 'Pyramid: many unit tests, fewer integration tests, a handful of E2E tests.'
- Wrap external APIs in adapters you own and test your logic against fakes.
- Coverage shows code ran. **Mutation testing** shows the tests would catch a bug.
- 'For AI features, make the deterministic parts deterministic: schema tests, fake providers, evals with thresholds.'
- Flaky tests destroy trust. Fix or quarantine them; never `sleep()`.
projects:
- name: Mutation-tested pricing module
  stack:
  - Python
  - pytest
  - mutmut
  build: Discount and tax rules at 100% coverage, then run mutmut and add assertions until no mutants survive.
  practises: The difference between running code and checking it.
- name: LLM-feature test harness
  stack:
  - Python
  - pytest
  - Pydantic
  - recorded JSON fixtures
  build: A summariser behind an adapter, tested with recorded good, invalid, refused and truncated replies, plus a tiny eval set with a threshold.
  practises: Testing non-deterministic features deterministically.
---

## Why this matters

Tests are what let a team change code without fear. A good suite catches regressions in seconds; a bad one is slow, flaky and passes while the product is broken. Interviewers increasingly ask how you'd test an AI feature, which requires knowing ordinary testing well first.

## Core ideas

- **Unit tests:** one function or class, no network or database. Fast, many.
- **Integration tests:** several parts together, often with a real database (in a container) and fake external APIs.
- **End-to-end (E2E) tests:** drive the real UI or API like a user (Playwright, Cypress). Slow, few, high confidence.
- **The pyramid:** many unit tests, fewer integration tests, a handful of E2E tests. Inverting it gives a slow, flaky suite.
- **Test doubles:** *stubs* return canned answers; *mocks* also check how they were called; *fakes* are working lightweight implementations (an in-memory repository).
- **Contract tests:** check that two services agree on a request/response shape.
- **Coverage:** which lines ran during tests. High coverage doesn't mean the tests check anything.
- **Mutation testing:** deliberately inject bugs (flip `>` to `>=`, delete a line) and see whether any test fails. Surviving mutants show tests that run code without verifying it.

## How to do it

A good unit test has one reason to fail, a descriptive name and the Arrange → Act → Assert shape:

```python
def test_category_is_derived_from_score_not_from_model() -> None:
    result = screen_cv(fake_model_reply={"score": 91, "category": "reject"})
    assert result.category == "strong"   # code decides the category, not the model
```

For an external API (payments, a model provider): wrap it in an adapter class you own; unit-test your logic against a fake adapter; keep a small set of integration tests that hit a sandbox or recorded responses; run real calls in a separate, scheduled suite.

## Testing AI features

| Layer | How | When |
|---|---|---|
| Deterministic code around the model | Normal unit tests with a fake provider | Every commit |
| Output contract | Schema validation tests with recorded replies, including bad ones | Every commit |
| Behaviour quality | Evals on a labelled set with thresholds ([10.2](/10-production-ai/02-evaluation)) | On prompt/model change, nightly |
| Live provider | A small smoke suite against the real API | Scheduled, before release |

The rule: **make the deterministic parts deterministic and quarantine the rest** ([Q22](#q22)).

## Why this way

Fast tests run on every change, so they catch bugs while the change is fresh. Mutation testing measures what coverage can't: whether a test would notice the code being wrong. As one casebook project puts it: "a passing test suite only proves the tests pass" ([S5](#s5)).

## Common mistakes

- Tests that assert nothing meaningful ("it didn't throw").
- Mocking the thing you're testing.
- Sleeping in tests (`sleep(2)`) instead of waiting for a condition, which makes them flaky.
- Live LLM calls in unit tests: slow, costly and non-deterministic.

## Check yourself

<details markdown="1"><summary>You have 95% coverage. Are your tests good?</summary>

Not necessarily. Coverage shows which lines ran, not whether their results were checked. Mutation testing or reviewing the assertions tells you whether tests would catch a bug.

</details>

<details markdown="1"><summary>How do you unit-test code that calls an LLM?</summary>

Put the model behind an interface; in unit tests, inject a fake that returns recorded good and bad replies (valid JSON, invalid JSON, refusal, timeout). Test that your code validates, retries and falls back correctly. Judge quality separately with evals.

</details>

## Build it

Take a small function with branches, write tests to 100% line coverage, then run a mutation tool (mutmut for Python, Stryker for TypeScript) and kill the survivors.

## What comes next

[2.4 Code review and documentation](/02-software-lifecycle/04-code-review-and-documentation).
