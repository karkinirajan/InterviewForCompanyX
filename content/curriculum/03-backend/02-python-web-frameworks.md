---
title: 'Python web frameworks: FastAPI, Django, Flask'
level: 1
summary: What each framework is for, how requests flow through them, dependency injection and lifespan in FastAPI, and when to choose which.
outcomes:
- Build a typed FastAPI service with dependencies and lifespan-managed clients
- Explain Django's ORM, admin and request cycle
- Choose a framework for a new service and defend it
keypoints:
- FastAPI suits APIs, AI gateways and streaming; Django suits model-heavy products with admin and auth; Flask suits small services.
- Create one shared HTTP client per external service in `lifespan`, and use dependencies so tests can swap in fakes.
- 'Layer it: router → service → repository. Business logic never imports the web framework.'
- Django N+1 is fixed with `select_related` (FK joins) and `prefetch_related` (batched relations).
- Never block a sync Django worker or an async loop on a long model call.
projects:
- name: Same app, two frameworks
  stack:
  - FastAPI
  - Django
  - Postgres
  - pytest
  build: Build a small notes API in both frameworks with identical endpoints and tests, then write a one-page comparison.
  practises: Framework trade-offs from experience, not opinion.
- name: Weather proxy with dependency overrides
  stack:
  - FastAPI
  - httpx
  - Redis
  - pytest
  build: Call a public weather API through a lifespan client, cache results in Redis, and test with dependency overrides and a fake client.
  practises: Lifespan, dependency injection, testable layering.
---

## Why this matters

These three frameworks run most Python backends you'll meet. AI services in particular lean on FastAPI (async, typed, streaming-friendly), while many established products run on Django. You should be productive in both and able to explain the trade-off.

## The three in one table

| | FastAPI | Django (+ DRF) | Flask |
|---|---|---|---|
| Style | Async-first, typed, minimal | Batteries included | Minimal, sync-first |
| Validation | Pydantic built in | Forms / DRF serializers | Bring your own |
| ORM | Bring your own (SQLAlchemy, SQLModel) | Django ORM + migrations | Bring your own |
| Admin, auth | Bring your own | Built in | Extensions |
| Streaming / SSE | Natural | Possible via ASGI | Possible |
| Best for | APIs, AI gateways, microservices | Products with lots of models, admin, auth | Small services, prototypes |

## How a FastAPI service is structured

```python
from contextlib import asynccontextmanager
from typing import Annotated
import httpx
from fastapi import Depends, FastAPI, HTTPException

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=httpx.Timeout(10, connect=3))  # one shared client
    yield
    await app.state.http.aclose()

app = FastAPI(lifespan=lifespan)

def get_http(request) -> httpx.AsyncClient:   # dependency: easy to override in tests
    return request.app.state.http

@app.get("/v1/weather/{city}")
async def weather(city: str, http: Annotated[httpx.AsyncClient, Depends(get_http)]):
    r = await http.get(f"https://weather.example/api/{city}")
    if r.status_code == 404:
        raise HTTPException(404, "Unknown city")
    r.raise_for_status()
    return r.json()
```

Key habits: **one shared client per external service**, created in `lifespan` (connection reuse); **dependencies** for anything you'll want to fake in tests; **Pydantic models** for request and response bodies; layered code (router → service → repository) so business logic doesn't import the web framework.

## Django in brief

Request → URL router → view (or DRF viewset) → ORM → template or serializer → response. Strengths: migrations, admin, auth, a huge ecosystem. Watch for:

- **N+1 queries:** use `select_related` (joins) and `prefetch_related` (separate batched query).
- **Long work in a sync view** blocks a worker. Long model calls go to Celery or an async view ([Q11](#q11)).
- **Version pinning:** know which release is LTS (5.2 is; 6.0 isn't) when you write it on a CV.

## Why this way

Pick by the product, not fashion: an AI gateway or a streaming chat service suits FastAPI; a CRUD-heavy product with an admin and many models suits Django; a two-endpoint internal tool suits either or Flask. A team's existing expertise usually outweighs small technical differences.

## Common mistakes

- Creating a new HTTP client per request (no connection reuse, slow, and can exhaust sockets).
- Business logic inside route functions, untestable without HTTP.
- Blocking calls inside `async def` routes.

## Check yourself

<details markdown="1"><summary>Why create the HTTP client in lifespan instead of per request?</summary>

Connection pooling and TLS session reuse make calls much faster; one client is shared safely across requests and closed cleanly at shutdown.

</details>

<details markdown="1"><summary>What's the N+1 problem and how does Django fix it?</summary>

Loading a list (1 query) and then a related object for each item (N queries). `select_related` joins foreign keys into the first query; `prefetch_related` loads many-to-many or reverse relations in one extra query.

</details>

## Build it

Build a FastAPI service with one endpoint that calls a public API through a lifespan-managed client, a dependency you override in a pytest test with a fake, and Pydantic response models.

## What comes next

[3.3 Relational databases and SQL](/03-backend/03-relational-databases-and-sql).
