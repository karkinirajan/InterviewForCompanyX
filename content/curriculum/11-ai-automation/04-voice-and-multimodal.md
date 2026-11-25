---
title: Voice and multimodal AI
level: 4
summary: 'Speech-to-text, text-to-speech, voice agents and vision inputs: normalising media, measuring quality per language, and handling vendor differences.'
outcomes:
- Integrate speech-to-text with measured quality per language
- Design an adapter across speech vendors without hiding real differences
- Know the latency budget of a voice agent
keypoints:
- Normalise audio (16 kHz mono WAV) so every vendor gets identical input.
- Measure WER/CER per language (grapheme clusters for Devanagari), script correctness and timing error.
- The adapter hides transport, not semantics. Declare which capabilities each vendor actually has.
- Read data terms before uploading anyone's audio, and record consent per item.
- 'Voice agents: STT → LLM → TTS (or speech-to-speech). Pauses over about a second feel broken, so support barge-in.'
projects:
- name: STT bake-off
  stack:
  - Python
  - ffmpeg
  - two STT APIs + Whisper
  - jiwer
  build: Transcribe 20 recordings in two languages with three engines and report WER/CER and timing error per engine and language.
  practises: Vendor selection on evidence.
- name: Voice FAQ agent
  stack:
  - Pipecat or LiveKit Agents
  - Deepgram
  - an LLM API
  - a TTS API
  build: A phone-style voice bot answering from a small FAQ with barge-in and a latency budget measured per turn.
  practises: Real-time voice pipelines.
---

## Why this matters

Voice agents (phone systems, assistants), transcription, captioning and image understanding are fast-growing AI integration areas. They add media handling, strict latency budgets and language-specific quality problems.

<a id="q39"></a>

## Q39. Integrating speech-to-text into a product?

- **Normalize input** (16 kHz mono WAV) so every vendor sees the same audio ([P10](#p10)).
- **Measure per language and audio type:** WER and CER, counted over grapheme clusters for scripts like Devanagari; **script correctness** (some models romanize or translate instead of transcribing); timing error at median and p95 ([P1](#p1)).
- **Know what each vendor returns:** word timings, chunk timings, diarization, language detection; design the interface around those differences ([S10](#s10)).
- **Data terms:** some vendors train on uploads unless you opt out; read them before sending anyone's audio. Consent per item.
- **Voice agents** (phone IVR, assistants) need the same measurement discipline plus a latency budget.

## Core ideas

- **WER/CER:** word/character error rate; for scripts with combining marks, count over grapheme clusters (what a reader sees as one character), or a changed vowel sign counts wrongly.
- **Diarization:** who spoke when.
- **Streaming vs batch STT:** streaming for live conversations; batch for recordings (cheaper, often more accurate).
- **Voice agent loop:** audio in → STT → LLM → TTS → audio out, or a native speech-to-speech model. Every stage adds latency; users notice pauses above roughly a second.
- **Vision inputs:** screenshots, photos, scanned pages sent to multimodal models; useful for extraction and UI understanding; validate outputs like any model output.

## The adapter hides transport, not semantics

One interface across vendors is valuable (one command, consistent errors, consent checks), but vendors genuinely differ: some give word-level timings, some only segments; some diarize; some detect language. The interface should **declare** which capabilities each adapter has, rather than pretend they're identical. Casebook: five speech vendors behind one planned, consent-gated command ([P1](#p1)); four providers plus local Whisper in a transcription platform ([P10](#p10)).

## Common mistakes

- Comparing vendors on a few English samples, then launching in other languages.
- Sending user audio before checking vendor data terms.
- Voice agents with no barge-in (user can't interrupt) and long silent pauses.

## Check yourself

<details markdown="1"><summary>Why count WER over grapheme clusters for Devanagari?</summary>

A visible character can be several Unicode code points (a consonant plus a vowel sign). Counting code points over-penalises or misattributes errors; grapheme clusters match what a reader sees.

</details>

## Build it

Transcribe the same ten recordings with two STT providers (or one provider plus local Whisper), normalised to 16 kHz mono, and compute WER per recording against your own reference transcripts.

## What comes next

[11.5 Capstone: ship an AI feature end to end](/11-ai-automation/05-capstone-ship-an-ai-feature).
