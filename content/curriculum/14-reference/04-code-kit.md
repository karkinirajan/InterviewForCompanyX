---
title: Code kit (C1–C5)
level: 3
summary: 'Code you should be able to write or explain from memory: typed output with retries and fallback, rank fusion, SSE streaming with cancellation, a tenant-safe pgvector schema, and a prompt review checklist.'
outcomes:
- Write C1 and C2 from memory
- Explain every line of C3 and C4
- Review a prompt with C5
keypoints:
- 'C1: typed output, transient-only retries with capped Retry-After, provider fallback, human queue as last resort.'
- 'C2: RRF in six lines. C3: SSE with disconnect check and `aclose()` to stop paying.'
- 'C4: tenant-safe pgvector (HNSW + GIN + RLS, iterative scans). C5: the prompt review checklist.'
- Type C1 and C2 from a blank file until you can do it in five minutes.
projects:
- name: Code kit as a tested package
  stack:
  - Python
  - uv
  - pytest
  - mypy --strict
  build: Package C1–C3 as a library with full tests (including fake providers and a disconnecting client) and type checking.
  practises: Turning snippets into production-grade code.
- name: pgvector starter
  stack:
  - Postgres + pgvector (Docker)
  - SQL migrations
  - Python
  build: Apply the C4 schema as migrations, seed two tenants and run hybrid queries with RRF, with RLS tests.
  practises: The data layer of RAG, end to end.
---

Python 3.11+. All snippets parse. Practise by typing them from a blank file, then compare. The real-world version of C1 in the casebook is the clip service's HTTP layer ([P1](#p1)).

<a id="c1"></a>

## C1 · Typed output, bounded retries, provider fallback

```python
from __future__ import annotations

import asyncio
import logging
import random
from collections.abc import Awaitable, Callable, Sequence
from dataclasses import dataclass
from typing import Literal

from pydantic import BaseModel, Field, ValidationError

logger = logging.getLogger(__name__)


class ReferralExtraction(BaseModel):
    urgency: Literal["routine", "urgent", "emergent"]
    icd10_codes: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    evidence_quotes: list[str]


class TransientProviderError(Exception):
    """429, 5xx, overloaded, connection reset: safe to retry."""

    def __init__(self, message: str, retry_after_s: float | None = None) -> None:
        super().__init__(message)
        self.retry_after_s = retry_after_s


class PermanentProviderError(Exception):
    """400, 401, 403, 422, content policy: retrying only repeats the cost."""


class AllProvidersFailedError(Exception):
    """Every provider failed; the caller routes the item to human review."""


@dataclass(frozen=True)
class Provider:
    name: str
    call: Callable[[str], Awaitable[str]]  # returns raw JSON text
    timeout_s: float = 20.0
    max_attempts: int = 3
    max_delay_s: float = 30.0


def _backoff_delay(provider: Provider, attempt: int, exc: Exception) -> float:
    if isinstance(exc, TransientProviderError) and exc.retry_after_s is not None:
        return min(exc.retry_after_s, provider.max_delay_s)  # provider's hint, capped
    return min(provider.max_delay_s, 2.0 ** (attempt - 1)) * random.uniform(0.5, 1.0)


async def _call_with_retries(provider: Provider, prompt: str) -> str:
    for attempt in range(1, provider.max_attempts + 1):
        try:
            async with asyncio.timeout(provider.timeout_s):
                return await provider.call(prompt)
        except (TransientProviderError, TimeoutError) as exc:
            if attempt == provider.max_attempts:
                raise
            delay = _backoff_delay(provider, attempt, exc)
            logger.warning(
                "llm.retry",
                extra={"provider": provider.name, "attempt": attempt,
                       "delay_s": round(delay, 2), "error": type(exc).__name__},
            )
            await asyncio.sleep(delay)
    raise RuntimeError("unreachable: the loop always returns or raises")


async def extract_referral(prompt: str, chain: Sequence[Provider]) -> ReferralExtraction:
    for provider in chain:
        try:
            raw = await _call_with_retries(provider, prompt)
            return ReferralExtraction.model_validate_json(raw)
        except ValidationError as exc:
            logger.error("llm.schema_violation",
                         extra={"provider": provider.name, "errors": exc.error_count()})
        except (TransientProviderError, PermanentProviderError, TimeoutError) as exc:
            logger.warning("llm.provider_failed",
                           extra={"provider": provider.name, "error": type(exc).__name__})
    raise AllProvidersFailedError("all providers failed; route to human review")
```

**Narrate:** retries only for transient errors; `Retry-After` wins but is capped; schema errors aren't retried; last resort is a human queue. **Production additions:** a circuit breaker per provider, a total deadline across the chain, per-provider prompt variants, metrics on every branch.

<a id="c2"></a>

## C2 · Reciprocal Rank Fusion

```python
from collections import defaultdict
from collections.abc import Sequence


def reciprocal_rank_fusion(
    rankings: Sequence[Sequence[str]], k: int = 60
) -> list[tuple[str, float]]:
    """Fuse ranked ID lists (e.g. dense + lexical). score(d) = sum of 1 / (k + rank)."""
    scores: defaultdict[str, float] = defaultdict(float)
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] += 1.0 / (k + rank)
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)
```

<a id="c3"></a>

## C3 · FastAPI SSE streaming with cancellation

```python
import json
import logging
from collections.abc import AsyncGenerator, Callable
from typing import Annotated, Any

from fastapi import Depends, FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
app = FastAPI()

TokenStream = Callable[[str], AsyncGenerator[str, None]]


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=4000)


def get_token_stream() -> TokenStream:
    """Provider adapter (Bedrock / Anthropic / OpenAI streaming), wired in lifespan."""
    raise NotImplementedError


def sse(payload: dict[str, Any]) -> str:
    return f"data: {json.dumps(payload)}\n\n"


@app.post("/v1/chat/stream")
async def chat_stream(
    body: ChatRequest,
    request: Request,
    stream: Annotated[TokenStream, Depends(get_token_stream)],
) -> StreamingResponse:
    async def events() -> AsyncGenerator[str, None]:
        tokens = stream(body.query)
        try:
            async for token in tokens:
                if await request.is_disconnected():
                    logger.info("chat.client_disconnected")
                    return
                yield sse({"type": "token", "text": token})
            yield sse({"type": "done"})
        finally:
            await tokens.aclose()  # close the upstream stream: stop paying for tokens

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```

<a id="c4"></a>

## C4 · pgvector: schema, indexes, tenant-safe retrieval

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     uuid         NOT NULL,
    document_id   uuid         NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
    doc_version   integer      NOT NULL,
    section_path  text         NOT NULL,
    content       text         NOT NULL,
    content_tsv   tsvector     GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    embedding     vector(1536) NOT NULL,
    embed_model   text         NOT NULL
);

CREATE INDEX document_chunks_embedding_hnsw
    ON document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX document_chunks_tsv_gin ON document_chunks USING gin (content_tsv);
CREATE INDEX document_chunks_tenant_doc ON document_chunks (tenant_id, document_id);

-- Second wall: row-level security (the app role must not own the table, or use FORCE)
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON document_chunks
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Dense candidates (inside a transaction)
SET LOCAL hnsw.ef_search = 100;
SET LOCAL hnsw.iterative_scan = relaxed_order;  -- pgvector 0.8+: keeps scanning when filters drop rows

SELECT id, section_path, 1 - (embedding <=> $1) AS cosine_similarity
FROM document_chunks
WHERE tenant_id = $2
ORDER BY embedding <=> $1
LIMIT 50;

-- Lexical candidates (ts_rank_cd is not true BM25)
SELECT id, ts_rank_cd(content_tsv, q) AS rank
FROM document_chunks, websearch_to_tsquery('english', $1) AS q
WHERE tenant_id = $2 AND content_tsv @@ q
ORDER BY rank DESC
LIMIT 50;
```

| Operator | Meaning |
|---|---|
| `<->` | L2 distance |
| `<=>` | Cosine distance (similarity = 1 − distance) |
| `<#>` | **Negative** inner product |
| `<+>` | L1 distance |

HNSW: better recall and speed, slower builds, more memory (`m`, `ef_construction`, `ef_search`). IVFFlat: faster builds, needs data before building, tune `lists` and `probes`.

<a id="c5"></a>

## C5 · "Review this prompt" checklist

Role and task clear · context separated from instructions · untrusted-content rule stated · output schema explicit · missing-information behavior defined · edge-case few-shot examples · no secrets · no wasted tokens · no reliance on the prompt for authorization · **versioned and fingerprinted, with an eval case** ([Q20](#q20)).

## Check yourself

<details markdown="1"><summary>In C1, why is `ValidationError` not retried with the same provider?</summary>

A schema violation isn't transient; repeating the same call usually repeats the failure and the cost. C1 moves on to the next provider (and in production you might allow one repair attempt for low-risk tasks).

</details>

<details markdown="1"><summary>In C3, what does `tokens.aclose()` in the `finally` block achieve?</summary>

It closes the upstream provider stream when the client disconnects or the response ends, so generation (and billing) stops instead of continuing for nobody.

</details>

<details markdown="1"><summary>In C4, why must the application role not own the table?</summary>

Table owners bypass row-level security unless `FORCE ROW LEVEL SECURITY` is set, so the tenant policy would silently not apply.

</details>

## What comes next

You've reached the end of the book. Go back to the [start page](/) to pick your next part, or open the [tech flow map](/tech-map).
