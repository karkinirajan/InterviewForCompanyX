---
title: Building AI interfaces
level: 3
summary: Streaming text, stop buttons, citations, confidence, review-and-approve flows and feedback capture, and the API contract between AI backend and frontend.
outcomes:
- Stream model output to the UI with cancellation
- Show sources and uncertainty honestly
- Design human-approval flows for consequential actions
keypoints:
- Stream tokens. Time to first token is what users feel.
- '**Stop** must cancel server-side generation: abort → disconnect → close the upstream stream.'
- 'Use typed stream events: `token`, `status`, `citation`, `done`, `error`.'
- Show sources and say "not found" honestly. Render model output as sanitised Markdown, never raw HTML.
- The AI proposes and a human approves anything consequential. Capture feedback as eval data.
projects:
- name: Streaming chat with sources
  stack:
  - Next.js
  - FastAPI SSE
  - an LLM API
  - react-markdown
  build: Chat that streams typed events with status messages, a sources panel, Stop that cancels upstream, and thumbs feedback stored for evals.
  practises: The full AI UI contract.
- name: Draft-and-approve email assistant
  stack:
  - React
  - Vercel AI SDK
  - Postgres
  build: The model drafts replies; the user edits and explicitly approves; nothing sends without approval; an audit log records who approved what.
  practises: Human-in-the-loop UX and safe actions.
---

## Why this matters

Users judge an AI feature by its interface. The same model feels fast or slow, trustworthy or reckless, depending on streaming, sources, status messages and whether a human confirms risky actions. Job descriptions ask applied AI engineers to "work with frontend engineers to surface AI", and this is what that means.

## Core ideas

- **Streaming:** show tokens as they arrive. Time to first token is what users feel ([g-ttft](#g-ttft)).
- **Cancellation:** a Stop button must stop the server-side generation too, or you keep paying for tokens nobody reads ([C3](#c3)).
- **Typed events:** the stream carries more than text: `token`, `status` ("searching documents…"), `citation`, `done`, `error`.
- **Citations:** link claims to the sources used; let users open them. Verify server-side that cited IDs were actually retrieved.
- **Honest uncertainty:** "I couldn't find this in the approved documents" is a valid, designed answer.
- **Human in the loop:** drafts, not actions. The AI proposes; a person approves before anything is sent, booked or paid.
- **Feedback capture:** thumbs, edits and corrections become evaluation data.

## How to do it

### Reading an SSE stream

```ts
const res = await fetch("/v1/chat/stream", { method: "POST", body: JSON.stringify({ query }), signal });
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
let buffer = "";
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += value;
  const events = buffer.split("\n\n");
  buffer = events.pop()!;                      // keep the incomplete tail
  for (const e of events) {
    if (!e.startsWith("data: ")) continue;
    const evt = JSON.parse(e.slice(6));
    if (evt.type === "token") append(evt.text);
    else if (evt.type === "citation") addSource(evt);
    else if (evt.type === "error") showError(evt.message);
  }
}
```

`signal` comes from an `AbortController`; the Stop button calls `abort()`, which closes the connection; the server notices the disconnect and closes the upstream model stream.

### UI states for an AI answer

```text
idle → retrieving ("Searching 3 policy documents…") → streaming → done (sources, feedback)
                                                    ↘ error (specific message, retry)
                                                    ↘ insufficient evidence (say so, suggest next step)
                                                    ↘ cancelled
```

<a id="q43"></a>

## Working with frontend engineers (interview question Q43)

Agree early on: the API contract, the streaming event types, loading / error / empty / cancelled states, the citation shape, feedback events, status messages for slow steps, and which actions need confirmation. Evidence from the casebook: a Next.js studio for an AI clip service ([P1](#p1)), an operator console with a live feed and trace drawer ([P6](#p6)), and per-error messages mapped from distinct status codes ([P2](#p2)).

## Common mistakes

- A spinner for 20 seconds with no status.
- Stop buttons that only hide text while the server keeps generating.
- Rendering model output as raw HTML (an injection risk). Render Markdown safely and sanitise ([Q27](#q27)).
- Auto-executing actions the model suggests.

## Check yourself

<details markdown="1"><summary>What must happen when a user clicks Stop on a streaming answer?</summary>

The client aborts the request; the server detects the disconnect and closes the upstream provider stream so token generation (and billing) stops; partial output isn't persisted as a final answer.

</details>

<details markdown="1"><summary>Name five things to agree with frontend engineers before building an AI feature.</summary>

API contract; streaming event types; loading, error, empty and cancelled states; citation format; feedback events; status messages for slow steps; which actions need human confirmation.

</details>

## Build it

Build a chat page that streams from a FastAPI SSE endpoint (use [C3](#c3) with a fake token generator), with Stop, status messages, a sources panel and thumbs feedback.

## What comes next

Part 5: [Cloud, DevOps and security](/05-cloud-devops-security).
