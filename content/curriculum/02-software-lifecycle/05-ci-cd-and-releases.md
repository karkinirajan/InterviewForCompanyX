---
title: CI/CD and release strategies
level: 2
summary: Pipelines that lint, type-check, test and deploy on every change, plus feature flags, canaries, blue-green deploys and safe database migrations.
outcomes: Design a CI pipeline with fast, parallel quality gates | Choose a release strategy for a risky change | Ship database changes without downtime
---

## Why this matters

Continuous integration catches mistakes minutes after they're made. Continuous delivery makes releasing boring, which is the goal. Teams that deploy many times a day aren't braver; they have better automation.

## Core ideas

- **CI (continuous integration):** every push runs the checks: format, lint, type-check, unit tests, build, security scans.
- **CD (continuous delivery/deployment):** every green build is deployable (delivery), or is deployed automatically (deployment).
- **Environments:** dev → staging (production-like) → production. Promote the **same build artefact**; don't rebuild per environment.
- **Quality gate:** a check that blocks merging when it fails. Never lower a gate silently to get a build through.

## A typical pipeline

```yaml
# .github/workflows/ci.yml (shape, not a full file)
on: [push, pull_request]
jobs:
  lint:  { steps: [checkout, setup, "ruff check .", "ruff format --check ."] }
  types: { steps: [checkout, setup, "mypy --strict src"] }
  test:  { steps: [checkout, setup, "pytest -q --maxfail=1"], services: [postgres] }
  build: { needs: [lint, types, test], steps: ["docker build -t app:${{ github.sha }} ."] }
  deploy-staging: { needs: build, if: "github.ref == 'refs/heads/main'" }
```

Run independent jobs in parallel; keep the whole pipeline under ~10 minutes so people don't stop waiting for it.

## Release strategies

| Strategy | How | Use when |
|---|---|---|
| Rolling | Replace instances a few at a time | Default for stateless services |
| Blue-green | Run new version alongside old; switch traffic at once; switch back to roll back | Need instant rollback |
| Canary | Send a small % of traffic to the new version, watch metrics, expand | Risky changes, including model or prompt changes |
| Feature flag | Code ships dark; turned on per user or % | Decouple deploy from release; A/B tests |
| Shadow | New version gets copies of real traffic; its output is logged, not used | New models or scoring logic ([P7](#p7)'s shadow model) |

## Database migrations without downtime: expand → migrate → contract

1. **Expand:** add the new column/table, nullable or with a default. Old code still works.
2. **Migrate:** deploy code that writes both; backfill old rows in batches.
3. **Switch reads** to the new structure.
4. **Contract:** after everything uses the new shape, drop the old column.

Never rename or drop a column in the same deploy as the code that stops using it.

## Releasing AI changes

A prompt or model change is a behaviour change with no compiler to catch mistakes. Treat it like code: versioned, reviewed, gated by evals in CI, released by canary or shadow, with instant rollback by repointing a version label ([Q15](#q15), [Q20](#q20)).

## Common mistakes

- Building different artefacts for staging and production.
- Flaky tests that everyone re-runs until green; fix or quarantine them.
- Migrations that lock large tables during business hours.
- Shipping a new prompt straight to 100% of traffic.

## Check yourself

<details markdown="1"><summary>What's the difference between a canary and a feature flag?</summary>

A canary routes a slice of *traffic* to a new *deployment*; a feature flag turns *behaviour* on or off inside one deployment, often per user. They're often combined.

</details>

<details markdown="1"><summary>How do you rename a column used by a live service?</summary>

Expand (add the new column), dual-write and backfill, switch reads, then contract (drop the old column) in a later release.

</details>

## Build it

Add a GitHub Actions workflow to a project with parallel lint, type and test jobs, and a build job that depends on all three.

## What comes next

[2.6 Incidents, on-call and postmortems](/02-software-lifecycle/06-incidents-and-postmortems).
