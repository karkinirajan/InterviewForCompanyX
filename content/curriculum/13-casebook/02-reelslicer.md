---
title: 'P1 · reelslicer: an AI clip service with a measurement layer'
level: 4
summary: A personal product that turns long videos into captioned vertical clips in English, Hindi and Nepali, built so every quality claim is measured and the model is fenced in.
outcomes:
- Explain how the model is constrained to segment numbers
- Describe the measurement layer and why it came first
- Present the honest status and the path to production
keypoints:
- The model returns **segment numbers, never timestamps**, so hallucinated times and mid-word cuts are impossible.
- Paid, non-deterministic `propose` is split from free, deterministic `select`, so rules can be retuned without paying again.
- Every output records the prompt version and SHA-256 fingerprint, pinned by a test.
- Consent defaults to no. The command prints a plan first, and holdout items are excluded.
- 'Honest status: vendor adapters and live `propose` never run; the golden set is empty; no auth yet. D4 is the path to production.'
projects:
- name: Clip finder, simplified
  stack:
  - Python
  - faster-whisper
  - an LLM API
  - FFmpeg
  build: Transcribe a video, number its sentence segments, ask a model for start/end segment numbers, and cut clips on word boundaries.
  practises: Constraining model output structurally.
- name: Measurement layer first
  stack:
  - Python
  - jiwer
  - grapheme library
  - pytest
  - mutmut
  build: WER/CER over grapheme clusters plus clip precision@k, mutation-tested, before any model work.
  practises: Measure before you build.
---

<a id="p1"></a>

## P1 · reelslicer (own product, 2026)

**One line:** an AI-assisted clip service for English, Hindi and Nepali creators, built so every claim about quality is measured. Live at reelslicer.com.

**Why it's a strong case study:** it's owned end to end, recent, and touches LLM integration, prompts/evals, guardrails, frontend and SDLC, with decisions written down in 14 ADRs.

| Layer | What it is |
|---|---|
| `packages/eval` (`reelseval`) | The measurement layer: WER/CER counted over **grapheme clusters** (a changed vowel sign is one error), script correctness (native vs romanized vs wrong script), word-timing error, clip precision/recall/acceptance at k, cut quality, golden-set manifests with consent and dev/holdout split, engine bake-off, annotator agreement |
| `services/pipeline` (`reelspipeline`) | Adapters for **five speech vendors** (ElevenLabs Scribe, Sarvam Saaras REST and Batch, Gemini transcription, AssemblyAI, Google Chirp) behind one command; clip finding with a Gemini Flash model; offline forced word aligner; prosody signals; caption packs |
| `services/renderer` (`reelsrender`) | 9:16 rendering with FFmpeg + libass, Devanagari captions **verified by measurement** (highlight direction, shaping, font coverage, safe area), −14 LUFS audio |
| `apps/api` + `apps/web` | FastAPI studio backend + Next.js 16 studio (clip workbench, disagreement review, safe-zone overlay, shareable delivery page) |
| Deploy | Next.js on Vercel + Cloudflare; FastAPI + FFmpeg + libass + Noto Devanagari + **Nginx + systemd on EC2**; private S3 bucket with SSE, least-privilege IAM role, optional 5-minute S3 sync timer |

## Decisions worth quoting (from the ADRs)

1. **The model chooses segment numbers, never seconds** (ADR 0011). The transcript is cut into numbered segments at sentence ends and pauses; the model answers with first and last segment. It can't invent a timestamp, and a cut can't fall mid-word. → [S4](#s4)
2. **Propose is paid and non-deterministic; select is free and deterministic.** `propose` is the only step that calls out; `select` re-applies length, overlap, ranking and padding rules offline, so rules can be retuned without paying the model again.
3. **Prompt version + SHA-256 fingerprint of everything the model is told**, recorded in every output and **pinned by a test**: reword the prompt without bumping `PROMPT_VERSION` and CI fails. → [Q20](#q20)
4. **Untrusted text both ways.** The prompt says the transcript is data, but the real defense is the reply: numbers bounded and checked, titles cleaned of control and direction-override characters, cut at 1,000 code points. → [Q25](#q25)
5. **Consent defaults to no** (ADR 0005). Nothing leaves the machine without consent on the item, a key in the environment and `--yes`; the command prints a plan first. Holdout items are excluded unless asked for.
6. **Every unmeasured number is a recorded placeholder** (ADR 0002): clip length 15–60 s, 15 candidates, at most 10 clips, 0.2 s padding, medium thinking, 16,384 output tokens. Pinned by tests; tuned only after a baseline exists.
7. **Paid answers are never lost:** raw replies saved before parsing, files written whole or not at all, a failed write is a failed item, not a crash.
8. **HTTP layer** (`http.py`): retry only network errors, 429 and 5xx; honor `Retry-After` capped at 30 s, else exponential from 1 s; 4 attempts; audio re-read on every attempt; API key kept out of `repr` and scrubbed from error bodies; **presigned storage URLs must be https and not private, loopback or link-local** (SSRF hardening). → [Q29](#q29), [C1](#c1)

**Numbers:** 1,435 tests across four packages · mypy strict, 93 source files · mutation checks (know which run you quote: one README total didn't equal the sum of its parts, and a combined run reported a different figure) · CI with parallel lint, types, tests jobs · 14 ADRs · 18 research chapters.

## Honest status

Golden set is empty; vendor adapters are built against vendor docs and have **never run against a real vendor**; `propose` has **never run against the live model**; the live studio transcribes locally with faster-whisper (CPU, int8, word timestamps, VAD). Job tracking is in memory (threads); persistence is SQLite in WAL mode; no auth yet. Hindi and Nepali captions not yet reviewed by native readers.

Say it precisely before anyone finds it; it reads as rigor, not weakness. **What would change for production:** [D4](#d4).

## 60-second pitch

> "reelslicer is my own product: long videos in, captioned vertical clips out, in English, Hindi and Nepali. What makes it interesting for this role is how the model is fenced in. Gemini proposes clips, but it can only answer with segment numbers from a table I give it, so it can't invent a timestamp or cut mid-word. Proposing is the only paid, non-deterministic step; selection is deterministic and offline, so I can retune rules without paying again. Every output records the prompt version and a hash of the prompt, and a test fails if someone rewords the prompt without bumping the version. Nothing is sent to any of the five speech vendors without consent on the item and an explicit flag. It's live on EC2 and Vercel with 1,435 tests. And I'll be straight: the vendor adapters haven't run against live APIs yet; that's the next step, and the evaluation harness to judge them is already built."

## Follow-ups

Why segments not timestamps ([S4](#s4)) · how you'd measure clip quality ([Q24](#q24)) · what breaks at scale ([D4](#d4)) · WER on Devanagari ([Q39](#q39)) · many vendors behind one interface ([Q18](#q18)) · what thinking tokens do to your output limit ([Q19](#q19)).

## What to learn from it

Measure first; constrain the model's answer space; split paid non-deterministic steps from free deterministic ones; never pay twice; record every unmeasured number as a placeholder.

## What comes next

[13.3 SmartClaim](/13-casebook/03-smartclaim).
