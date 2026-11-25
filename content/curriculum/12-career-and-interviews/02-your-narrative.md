---
title: Your narrative
level: 1
summary: '"Tell me about yourself", why this role, strongest skill, weakness, and what to say when you don''t know, with templates and a worked example.'
outcomes:
- Deliver a 60–90 second introduction with no notes
- Answer motivation and weakness questions honestly and well
- Handle "I don't know" without losing credibility
keypoints:
- 'Intro in 60–90 s: identity → home stack → three pieces of evidence → one scale proof → why this role.'
- Every noun needs a dossier and every number a baseline, method and mechanism.
- Answer "why move" with ownership you gained and the depth you want.
- Pick a real weakness, show the mitigation, give a plan.
- 'Not knowing: principle → what you''d verify → what you''d test → the metric.'
projects:
- name: Pitch recorder
  stack:
  - Browser MediaRecorder
  - Next.js
  - a speech-to-text API
  build: Record your intro, get a transcript with duration and filler-word count, and keep versions to compare over time.
  practises: Rehearsal with measurable feedback.
- name: Portfolio landing page
  stack:
  - Next.js
  - MDX
  - Vercel
  build: A one-page site whose structure mirrors your intro (identity, three projects with honest status, contact), consistent with your CV.
  practises: One story told everywhere.
---

## Why this matters

The first two minutes set the frame for the whole interview. A tight introduction tells the interviewer which follow-up questions to ask, so choose nouns you have dossiers behind.

## Tell me about yourself (60–90 seconds)

Template:

1. **Identity in one line:** what you are and what you spend your time on.
2. **Home stack:** two or three technologies you're strongest in.
3. **Three pieces of evidence:** recent, relevant, each with one memorable detail.
4. **One scale or performance proof** (if you have it, defensible).
5. **Why this role, in one sentence.**

Worked example (from the casebook author's own preparation):

> "I'm a backend engineer who spends most of his time making LLMs behave inside real products. Python is home: FastAPI, Django, Postgres with pgvector, Redis and Celery, on AWS.
>
> Three pieces of recent work show how I do it. reelslicer is my own product, live on EC2 and Vercel: long videos in, captioned clips out, in English, Hindi and Nepali. The model can only answer with segment numbers, so it can't invent timestamps, and every metric that judges it is mutation-tested. SmartClaim judges wound-care documentation against 46 Medicare coverage criteria through strict JSON-schema outputs, with clinical text treated as untrusted data. And as a subcontractor I built parts of a production financial-intelligence RAG platform: a knowledge graph plus Qdrant, ColBERT re-ranking, and RAGAS and DeepEval regression suites in Langfuse.
>
> On the backend side, I scaled a Django platform to 12,000 requests a minute at 99.99% uptime, and cut API latency 72% with an async FastAPI and Redis redesign.
>
> I want to stop working in slices and own one integration layer, which is what this role describes."

**Gate:** under 90 seconds, no notes, every noun has a dossier behind it, every number has an answer to "how did you measure that?".

## Why move from freelancing (or your current job)?

> "Freelancing taught me ownership: nobody else answers the client at 2 a.m. The ceiling is scope. I arrive for a slice, hand it over, and never live with my architecture for three years. I want one product line, peers who review my work and whose work I review, and the long loop where evals and observability actually compound."

If asked "will you fit a team?": point to team practices you already run (ADRs, protected branches, CI gates, reviews).

## Strongest skill

> "Backend engineering for AI features. Calling a model is the easy part; the value is the service around it: contracts, validation, retries, consent, measurement, deployment. That's what turns a demo into something a team can run."

## Weakness (pre-decided, real, with a plan)

Pick a genuine gap relevant to the role, show you've mitigated it, and say how you'd close it. Example:

> "Running these systems at very large scale under formal compliance regimes. I've designed for it (consent, no provider storage, audit-safe logs), but I haven't operated a BAA-covered deployment, and I haven't shipped on [the company's managed agent platform]. I'd learn both fastest inside a team that already runs them."

## When you don't know

> "I haven't run that in production, so I won't overstate it. My understanding is [principle]. Before choosing, I'd verify [the unknown], test [the risk], and judge it on [metric]."

## Common mistakes

- A chronological life story instead of a focused pitch.
- Clichéd weaknesses ("I work too hard").
- Bluffing; experienced interviewers detect it within two follow-ups.

## Check yourself

<details markdown="1"><summary>What's the "gate" for a good introduction?</summary>

Under 90 seconds without notes; every noun backed by a dossier; every number defensible with baseline, method and mechanism.

</details>

## Build it

Write your own introduction with the five-part template, record it three times, and cut anything you couldn't defend under three follow-up questions.

## What comes next

[12.3 Story bank](/12-career-and-interviews/03-story-bank).
