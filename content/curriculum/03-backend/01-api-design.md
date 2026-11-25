---
title: API design
level: 1
summary: 'Designing HTTP APIs that clients can rely on: resources, errors, pagination, versioning, idempotency and contracts.'
outcomes:
- Design a REST resource with correct methods and status codes
- Return errors clients can act on
- Make writes safe to retry with idempotency keys
keypoints:
- Nouns in paths, HTTP methods for verbs, one consistent shape for errors and pagination.
- Errors are data. Give every failure the client handles differently its own status and stable code (RFC 9457).
- Use cursor pagination for large or changing lists, offset only for small static ones.
- '**Idempotency keys** make POST safe to retry: store the result per key and replay it.'
- Additive changes need no new version; breaking changes do. Publish an OpenAPI contract.
projects:
- name: Document evaluation API
  stack:
  - FastAPI
  - Postgres
  - SQLAlchemy
  - Pydantic
  - pytest
  build: Create an evaluation (with Idempotency-Key), poll status, fetch result and list history with cursor pagination and an RFC 9457 error taxonomy.
  practises: Status codes, idempotency, pagination, contracts.
- name: Public bookmarks API with SDK
  stack:
  - Django REST Framework
  - drf-spectacular
  - openapi-typescript
  build: A versioned REST API with an OpenAPI spec and a generated TypeScript client used by a tiny frontend.
  practises: Contract-first design and safe versioning.
---

## Why this matters

An API is a promise to every client that uses it: frontends, mobile apps, other services, and partners you'll never meet. Breaking that promise is expensive. Good API design makes clients simple and failures understandable.

## Core ideas

- **Resources and verbs:** nouns in paths (`/orders/42`), HTTP methods for actions ([1.3](/01-foundations/03-how-the-web-works)).
- **Consistent shapes:** same naming style, same error format, same pagination everywhere.
- **Errors as data:** a stable machine-readable code plus a human message. [RFC 9457 problem details](https://www.rfc-editor.org/rfc/rfc9457) is a good standard shape.
- **Pagination:** offset (`?page=3`) is simple but slow and unstable on large, changing tables; cursor pagination (`?after=<opaque>`) is stable and fast.
- **Versioning:** additive changes don't need a new version; breaking changes do (`/v2/` or a header).
- **Idempotency:** retrying a request must not create a second order. Clients send an `Idempotency-Key`; the server stores the result for that key and returns it on repeats.
- **Contract:** an OpenAPI spec (FastAPI generates one) documents and lets you test the promise.

## How to do it

```text
POST   /v1/orders                  create (Idempotency-Key header)   → 201 + Location
GET    /v1/orders?status=open&after=c_9f2  list with cursor          → 200
GET    /v1/orders/{id}             read                              → 200 / 404
PATCH  /v1/orders/{id}             partial update                    → 200 / 409 / 422
POST   /v1/orders/{id}/cancel      action that isn't CRUD            → 202 / 409
```

Error body:

```json
{ "type": "https://api.example.com/errors/rate-limited",
  "title": "Too many requests",
  "status": 429,
  "detail": "Limit is 20 evaluations per hour.",
  "retry_after_seconds": 120 }
```

### Designing error taxonomies

Every failure the client might handle differently gets its own status and code. A real example from an AI app ([P2](#p2)): `401` not signed in · `422` invalid form · `413` body too large · `429` rate limited with `Retry-After` · `503` provider quota or missing configuration · `502` the model failed or refused. Each maps to a distinct message in the UI, so a user (and an on-call engineer) knows what actually happened.

## Why this way

- Cursor pagination doesn't skip or duplicate items when rows are inserted mid-scroll, and stays fast at page 10,000.
- Idempotency keys turn "did my payment go through?" from a support ticket into a safe retry.
- Distinct error codes make failures diagnosable from the status code alone, the opposite of the "generic error message" outage ([S2](#s2)).

## Common mistakes

- `200 OK` with an error in the body.
- Leaking internal errors or provider messages to clients (they can contain stack traces or even API keys).
- Breaking changes without a version bump (renaming a field, changing a type).
- Unbounded list endpoints with no pagination.

## Check yourself

<details markdown="1"><summary>How does an idempotency key work on the server?</summary>

The server stores the key with the request's result (in a table with a unique constraint, or Redis with a TTL). A repeat with the same key returns the stored result instead of executing again. A repeat with the same key but a different body is rejected.

</details>

<details markdown="1"><summary>Offset or cursor pagination for an activity feed?</summary>

Cursor: the feed changes constantly, so offsets skip or repeat items, and deep offsets get slow.

</details>

## Build it

Design (on paper) the API for a "document evaluation" service: create an evaluation, poll status, fetch result, list history. Include the error taxonomy.

## What comes next

[3.2 Python web frameworks](/03-backend/02-python-web-frameworks).
