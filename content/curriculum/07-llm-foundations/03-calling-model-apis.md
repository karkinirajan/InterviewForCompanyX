---
title: Calling model APIs like a production engineer
level: 3
summary: Messages, system prompts, streaming, structured output, tool calling and reasoning settings, wrapped in an adapter with timeouts, limits and validation.
outcomes:
- Call a model API with streaming, structured output and tool use
- Wrap providers behind an adapter your business logic depends on
- Treat refusals, truncation and invalid output as failures
keypoints:
- Put the model behind an **adapter** you own, with one client created at startup.
- Check `stop_reason`. Truncation and refusals are failures, not partial results.
- Use native structured output **and** still validate with Pydantic.
- With tool calling, the model proposes and your server validates, authorises and runs a narrow operation.
- Log tokens, model, prompt version, latency and outcome on every call, and never log secrets.
projects:
- name: Provider-agnostic SDK
  stack:
  - Python
  - httpx
  - Pydantic
  - Anthropic and OpenAI SDKs
  - pytest
  build: One `ChatModel` interface, two adapters, a fake for tests, streaming, structured output and token accounting.
  practises: The adapter pattern and failure handling.
- name: Structured extractor service
  stack:
  - FastAPI
  - an LLM API
  - Pydantic
  - SSE
  build: An endpoint that extracts a schema from text, streams progress events, and handles truncation, refusal and invalid JSON explicitly.
  practises: Q11, Q13, Q14 in code.
---

## Why this matters

Every applied AI feature starts with this call. Done naively, it's one line; done properly, it's an adapter with configuration, limits, validation, telemetry and tests. Interviewers ask exactly this: "How would you integrate Claude into a FastAPI or Django app?"

## Core ideas

- **Messages:** a list of turns (`user`, `assistant`), plus a **system prompt** that sets role, rules and output format.
- **Parameters:** model ID (pin a dated version where offered), `max_tokens`, temperature, stop sequences, reasoning effort where supported.
- **Streaming:** receive tokens as they're generated (SSE under the hood).
- **Structured output:** ask the API to return JSON matching a schema (native JSON-schema modes or forced tool use), then **validate it yourself anyway**.
- **Tool calling:** you describe functions; the model replies with a request to call one with arguments; *your code* decides whether and how to run it and sends back the result.
- **Usage:** every response reports input/output tokens. Log them.
- **Stop reasons:** an answer that stopped because it hit `max_tokens` is incomplete. A refusal is not an answer.

## How to do it

### A minimal adapter

```python
from typing import Protocol
from pydantic import BaseModel

class Completion(BaseModel):
    text: str
    input_tokens: int
    output_tokens: int
    stop_reason: str

class ChatModel(Protocol):
    async def complete(self, system: str, user: str, *, max_tokens: int) -> Completion: ...

class AnthropicChat:
    def __init__(self, client, model: str) -> None:      # client created once, in lifespan
        self._client, self._model = client, model

    async def complete(self, system: str, user: str, *, max_tokens: int) -> Completion:
        msg = await self._client.messages.create(
            model=self._model, max_tokens=max_tokens, system=system,
            messages=[{"role": "user", "content": user}],
        )
        text = "".join(b.text for b in msg.content if b.type == "text")
        return Completion(text=text, input_tokens=msg.usage.input_tokens,
                          output_tokens=msg.usage.output_tokens, stop_reason=msg.stop_reason)
```

Business logic depends on `ChatModel`, never on a vendor SDK. Tests inject a fake. A second provider is one more class.

### Treat these as failures, not partial results

```python
if c.stop_reason == "max_tokens":
    raise IncompleteOutput()                 # paid, but unusable: don't parse half a JSON object
result = Extraction.model_validate_json(c.text)   # raises on invalid shape → handled upstream
```

<a id="q11"></a>

### Q11. Integrating Claude into FastAPI or Django: the hard parts?

- Provider adapter behind an interface; business logic never imports an SDK.
- One shared async client per provider (lifespan); connection reuse; per-call timeouts.
- Sync Django: don't block workers on long generations; stream via ASGI or push to Celery.
- Stream end to end without buffering (`X-Accel-Buffering: no`).
- Structured output via forced tool use or JSON schema, validated with Pydantic.
- Secrets in a manager, read by name, kept out of `repr` and logs.
- Client-side RPM and TPM limits; honor `Retry-After`.
- `max_tokens` per request class; per-tenant budgets; spend alerts.
- Trace every call: model, prompt version, tokens, cache hits, latency, cost, outcome.

<a id="q13"></a>

### Q13. Invalid JSON, refusals, truncation?

Prefer native strict schemas. Validate every reply. A refusal and an incomplete reply (output limit hit) are failures, not partial results ([P2](#p2)). One repair attempt only for low-risk tasks. Never coerce invalid data into a consequential decision.

<a id="q14"></a>

### Q14. Streaming to the UI?

SSE for one-way streams, WebSockets when the client sends mid-stream. Typed events (token, status, citation, done, error). Propagate cancellation so "Stop" stops the bill. Persist only after completion and validation. Code: [C3](#c3); UI side: [4.5](/04-frontend/05-building-ai-interfaces).

<a id="q17"></a>

### Q17. Structured output vs tool calling?

Structured output: "answer in this shape". Tool calling: "ask the application to run this operation". Safe flow: model proposes → server validates → server authorizes → narrow operation runs → result returns. The model never gets raw database or shell access.

<a id="q19"></a>

### Q19. Reasoning models: what changes?

Thinking tokens cost money and latency, and may count against the output limit. If they do, a high thinking level can exhaust the limit and return a paid, incomplete reply. Set thinking per task, size the output limit with headroom, treat "incomplete" as a failure.

## Why this way

The adapter isolates vendor churn (SDKs and models change often), makes testing cheap, and gives one place for telemetry and limits. Validating even "strict" structured outputs costs microseconds and catches the rare violation before it reaches a database.

## Common mistakes

- Creating a new SDK client per request.
- Parsing output without checking the stop reason.
- Letting tool calls execute without server-side authorization.
- Logging full prompts with user data.

## Check yourself

<details markdown="1"><summary>Why put the model behind an interface your code owns?</summary>

To swap or add providers without touching business logic, to inject fakes in tests, and to centralise timeouts, limits, telemetry and error mapping.

</details>

<details markdown="1"><summary>A reply hit the output token limit mid-JSON. What do you do?</summary>

Treat it as a failure (log it, don't parse partial JSON); decide on one retry with a larger limit or less thinking if the task allows, otherwise fall back or queue for review. Then fix the root cause: output schema too large, thinking budget too high, or limit too low.

</details>

## Build it

Implement the adapter for two providers, a fake for tests, structured output into a Pydantic model, stop-reason checks, and token logging. Stream one endpoint through FastAPI.

## What comes next

[7.4 Prompt engineering](/07-llm-foundations/04-prompt-engineering).
