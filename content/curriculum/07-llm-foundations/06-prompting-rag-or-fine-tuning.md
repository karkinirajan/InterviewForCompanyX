---
title: Prompting, RAG or fine-tuning?
level: 3
summary: When each technique fits, how they combine, and why fine-tuning is the wrong tool for facts that change.
outcomes:
- Choose between prompting, RAG and fine-tuning for a requirement
- Explain distillation and when it pays off
- Defend the choice in an interview
keypoints:
- Prompting changes behaviour and format, with fast iteration.
- RAG supplies private, changing, citable knowledge.
- Fine-tuning gives a stable format or style at scale, or distillation to a smaller model. It needs curated data and evals.
- Fine-tuning is wrong for facts that change.
- Go in order (prompt → RAG → fine-tune) and only on measured need.
projects:
- name: Prompt vs RAG comparison
  stack:
  - Python
  - pgvector
  - an LLM API
  - an eval set
  build: Answer 50 questions about a document set with prompting alone and then with RAG, and compare accuracy and citations.
  practises: Seeing why RAG exists.
- name: Small-model distillation trial
  stack:
  - Python
  - OpenAI fine-tuning or Hugging Face TRL
  - an eval set
  build: Label 500 classification examples with a large model, fine-tune a small one, and compare quality, cost and latency.
  practises: When fine-tuning pays off.
---

## Why this matters

"Should we fine-tune?" is one of the most common questions from clients and interviewers. The honest answer is usually "not first", and knowing why is a strong signal of judgment.

<a id="q40"></a>

## Q40. Prompting vs RAG vs fine-tuning?

| Need | Tool |
|---|---|
| Behaviour and format, fast iteration | Prompting |
| Private, changing, auditable knowledge with citations | RAG |
| Stable style or format at scale, or distilling a big model into a small one, with a curated dataset and evals | Fine-tuning |

Fine-tuning is wrong for facts that change. Data first, then training: one casebook roadmap fine-tunes speech recognition for a low-resource language only after consented corrections exist ([P1](#p1)).

## How they combine

1. **Start with prompting** and a strong model. Build the eval set.
2. **Add RAG** when answers depend on private or changing knowledge, or need citations.
3. **Consider fine-tuning** when, with good prompts and retrieval, you still need: a very consistent format or tone at high volume; lower latency or cost via a smaller model (distillation); or a capability prompts can't teach (a niche classification scheme), and you have hundreds to thousands of high-quality labelled examples.

Fine-tuned models still need RAG for current facts and still need evals.

## Why this way

Prompting and RAG change in minutes; fine-tuning takes data collection, training runs and re-evaluation, and locks you to a base model version. Iterating cheaply first tells you whether fine-tuning is even needed, and produces the eval set you'd need to judge it.

## Common mistakes

- Fine-tuning to "teach the model our documents". It memorises poorly, can't cite, and goes stale.
- Fine-tuning without a baseline eval to prove improvement.
- Ignoring the maintenance cost of re-training when the base model is retired.

## Check yourself

<details markdown="1"><summary>A client wants the model to "know" their 2,000-page policy manual that changes monthly. Which technique?</summary>

RAG: the knowledge is private, changes often, and answers should cite sources. Fine-tuning would go stale and couldn't cite.

</details>

<details markdown="1"><summary>When is fine-tuning a good idea?</summary>

When prompting and RAG plateau and you need a stable format or style at scale, or want a smaller, cheaper, faster model to match a larger one on a narrow task (distillation), and you have enough quality labelled data and an eval to prove the gain.

</details>

## Build it

For three features you know, write which technique you'd use first and what evidence would make you add the next one.

## What comes next

Part 8: [Retrieval-augmented generation](/08-rag).
