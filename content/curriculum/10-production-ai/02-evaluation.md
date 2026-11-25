---
title: Evaluation
level: 4
summary: Building golden sets, deterministic checks, calibrated LLM judges and online monitoring, and using them as release gates for prompt and model changes.
outcomes:
- Build a golden set with consent, a holdout and measured agreement
- Design a three-level eval stack
- Use LLM-as-judge without fooling yourself
keypoints:
- 'Three levels: deterministic checks (every PR) → calibrated LLM-as-judge (CI/nightly) → online signals (continuous).'
- Build golden sets with consent, a private **holdout**, two annotators and measured agreement.
- 'Judge biases: position, verbosity, self-preference, drift. Calibrate against humans and pin the judge.'
- Record a baseline and gate releases on no regression.
- Mutation-test your metric code, because a wrong metric corrupts every decision.
projects:
- name: Eval-gated prompt pipeline
  stack:
  - Python
  - promptfoo or DeepEval
  - GitHub Actions
  build: Every prompt PR runs deterministic checks and a judge on the dev set, compares against the baseline file and blocks on regression.
  practises: Evals as CI gates.
- name: Annotation tool with agreement
  stack:
  - Next.js
  - Postgres
  - Python (Cohen's kappa)
  build: Two annotators label outputs independently; the tool computes agreement, adjudicates disagreements and exports a golden set.
  practises: Building trustworthy labels.
---

## Why this matters

Without evaluation, every prompt tweak and model upgrade is a guess, and quality regressions reach users silently. Evaluation is what makes AI engineering *engineering*.

<a id="q21"></a>

## Q21. Your eval stack?

| Level | What | When |
|---|---|---|
| Deterministic | Schema, regex, ranges, routing exact-match, latency bounds | Every PR |
| LLM-as-judge | Rubric grading with reasons, calibrated on human labels | CI, nightly |
| Online | Sampled faithfulness, thumbs, edits, refusals, drift alerts | Continuous |

<a id="q22"></a>

## Q22. QA is worried about non-determinism.

"Make the deterministic parts deterministic and quarantine the rest." Contract tests on schemas; mocked-provider tests for app logic; a small live suite; eval thresholds as CI gates; `temperature=0` reduces variance but guarantees nothing. Casebook: a paid, non-deterministic `propose` step separated from a free, deterministic `select` step, so rules can be retuned and tested without calling the model again ([S4](#s4)).

<a id="q23"></a>

## Q23. LLM-as-judge pitfalls?

Position bias, verbosity bias, self-preference, drift when the judge changes. Calibrate on human labels, pairwise with order swapping, pin the judge, never the only signal. Treat a model's own confidence or quality score as **not ground truth** until it tracks real user acceptance.

<a id="q24"></a>

## Q24. How do you build a golden set?

Rights-cleared data with consent recorded per item; dev and private holdout split (holdout never used for tuning); two annotators independently, lint against an annotation guide, measure agreement, adjudicate; set the agreement floor from a calibration round. See [S5](#s5): build the measurement layer **before** the feature.

## How to do it

1. Define the task's success in measurable terms (field accuracy, faithfulness, acceptance rate).
2. Collect 50–200 representative cases, including edge cases and adversarial inputs; add real failures as they appear.
3. Write deterministic checks first; add a judge only for what code can't check.
4. Record a **baseline**. Every change is compared against it.
5. Gate releases: a change ships only if it doesn't regress agreed metrics beyond a threshold.
6. Online: sample production traffic for judging and human review; track drift.

```text
eval run: prompt v7 + model X on golden-dev (120 items)
  schema valid      120/120   (gate: 100%)
  field accuracy    94.2%     (baseline 92.5%, gate: ≥ 92%)
  faithfulness      0.91      (judge, calibrated κ=0.78 vs humans)
  p95 latency       2.8 s     (gate: ≤ 3.5 s)
  cost per item     $0.0042   (baseline $0.0051)
→ PASS; run holdout before release
```

(The numbers above are an illustrative format, not results from a real system.)

## Mutation-testing your metrics

A wrong metric silently ruins every decision built on it. Test your metric code like production code, including mutation testing, so a broken scorer can't report "improvement" ([S5](#s5)).

## Common mistakes

- Tuning on the same set you report.
- A single aggregate score that hides regressions in one category.
- Judges that were never compared with human labels.

## Check yourself

<details markdown="1"><summary>Why keep a private holdout set?</summary>

Repeated tuning against the dev set overfits to it. The holdout, used rarely and never for tuning, gives an honest estimate of real performance.

</details>

<details markdown="1"><summary>Name three LLM-as-judge biases and a mitigation for each.</summary>

Position bias → swap order in pairwise comparisons. Verbosity bias → rubric that rewards correctness and penalises padding, length-controlled comparisons. Self-preference → use a different model family as judge. Drift → pin the judge version and recalibrate on changes.

</details>

## Build it

Build an eval harness for your RAG or extraction project with deterministic checks, a calibrated judge on 30 human-labelled items, a baseline file, and a CI job that fails on regression.

## What comes next

[10.3 Guardrails and prompt injection](/10-production-ai/03-guardrails-and-prompt-injection).
