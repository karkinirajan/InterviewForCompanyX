---
title: 'Observability: logs, metrics and traces'
level: 2
summary: Structured logs, the RED and USE metrics, distributed tracing with OpenTelemetry, and alerts on what users feel.
outcomes:
- Emit structured logs with request IDs and no secrets
- Choose metrics and alert thresholds that matter
- Trace a request across services to find where time goes
keypoints:
- Logs say what happened, metrics say how the system behaves, traces say where the time went.
- Use RED for services (Rate, Errors, Duration) and USE for resources.
- Write structured JSON logs with a propagated request ID, and **no secrets or personal data**.
- Alert on user-facing symptoms and SLO burn. Every alert links a runbook.
- 'AI adds fields per call: model, prompt version, tokens, cost, TTFT, outcome.'
projects:
- name: Observability kit for your API
  stack:
  - OpenTelemetry
  - Prometheus
  - Grafana
  - Loki
  - Jaeger
  - Docker Compose
  build: Instrument a FastAPI service with traces, RED metrics and JSON logs, build a dashboard, and set an SLO alert.
  practises: The three signals working together.
- name: LLM call tracer
  stack:
  - Langfuse (self-hosted)
  - Python
  - an LLM API
  build: Trace every model call with prompt version, tokens, cost and outcome, and build a cost-per-task view.
  practises: AI-specific observability.
---

## Why this matters

You can't fix what you can't see. Observability answers "is it working, and if not, where?" in minutes instead of hours. AI systems need it more than most: quality can degrade without a single error, and cost can spike without a traffic change.

## The three signals

| Signal | Answers | Example |
|---|---|---|
| **Logs** | What happened in this specific event? | `{"event":"llm.retry","provider":"x","attempt":2,"request_id":"..."}` |
| **Metrics** | How is the system behaving overall? | p95 latency, error rate, queue depth, cost per hour |
| **Traces** | Where did time go in this request, across services? | Span tree: API → retrieval → model → validation |

- **RED** for services: **R**ate, **E**rrors, **D**uration.
- **USE** for resources: **U**tilisation, **S**aturation, **E**rrors.
- **OpenTelemetry** is the vendor-neutral standard for emitting all three.

## How to do it

```python
logger.info("evaluation.completed", extra={
    "request_id": request_id, "tenant_id": tenant_id,
    "model": model, "prompt_version": PROMPT_VERSION,
    "tokens_in": usage.input_tokens, "tokens_out": usage.output_tokens,
    "latency_ms": elapsed_ms, "outcome": "pass",
})   # never the prompt text, document content, email or API key
```

- **Structured (JSON) logs** with consistent field names, searchable by `request_id`.
- **Propagate a request ID** from the edge through every service and job.
- **Log field names, not values,** for sensitive operations: an audit trail can record "updated fields: diagnosis, address" without the diagnosis ([P12](#p12)).

## Alerting

Alert on symptoms users feel (error rate above X% for 5 minutes, p95 above the SLO, queue age growing, cost per hour above budget). Every alert must be actionable and link to a runbook. Define **SLOs** (for example "99.5% of requests succeed in under 2 s over 30 days") and alert on burning the error budget too fast.

## What changes for AI

Add per-call fields: model and version, prompt version, tokens in/out, cache hits, cost, latency split into time-to-first-token and total, outcome (success, schema violation, refusal, fallback). Then dashboards for cost per successful task and quality signals. Part 10 covers this in depth ([Q36](#q36)).

## Common mistakes

- Unstructured `print` statements.
- Logging full prompts and documents containing personal data.
- Alert fatigue from noisy, non-actionable alerts.
- Only averages on dashboards.

## Check yourself

<details markdown="1"><summary>What are RED metrics?</summary>

Rate (requests per second), Errors (failed requests), Duration (latency distribution, as percentiles). The minimum dashboard for any service.

</details>

<details markdown="1"><summary>Why propagate a request ID?</summary>

So you can find every log line and span for one user's request across the API, workers and external calls, which turns a vague bug report into a precise timeline.

</details>

## Build it

Add JSON logging with request IDs to your service, a `/metrics` endpoint (Prometheus format) with RED metrics, and OpenTelemetry tracing for one outbound call; view a trace locally (Jaeger in Docker).

## What comes next

[5.5 Application security](/05-cloud-devops-security/05-application-security).
