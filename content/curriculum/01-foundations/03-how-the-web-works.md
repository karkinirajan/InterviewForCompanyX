---
title: How the web works
level: 0
summary: DNS, TCP, TLS and HTTP from a URL to a rendered page, plus the status codes, headers and caching rules every web engineer needs.
outcomes:
- Trace a request from URL to response
- Use HTTP methods, status codes and headers correctly
- Explain cookies, CORS and caching at a working level
keypoints:
- URL → DNS → TCP/QUIC → TLS → HTTP request → proxy/CDN → app → response → browser render.
- Methods have meaning. GET is safe, PUT and DELETE are idempotent, POST is neither (unless you add an idempotency key).
- Retry 429 and 5xx with backoff. Never retry 400, 401, 403, 404 or 422.
- Cookies should be `HttpOnly`, `Secure` and `SameSite`. CORS protects browsers; it isn't auth.
- Streams (SSE, LLM tokens) break when proxies buffer, so disable buffering on stream routes.
projects:
- name: HTTP inspector
  stack:
  - Python
  - FastAPI
  - httpx
  build: An endpoint that echoes method, headers, cookies and body, plus a client that demonstrates caching with ETag/304 and a 429 with Retry-After.
  practises: Status codes, headers and caching, seen from both sides.
- name: Tiny SSE clock
  stack:
  - FastAPI
  - Nginx
  - vanilla JS
  build: Stream the time every second over SSE, put Nginx in front, watch buffering break it, then fix it.
  practises: Streaming responses and proxy behaviour.
---

## Why this matters

Every API you build and every frontend you ship speaks HTTP. Bugs that look mysterious (CORS errors, stale pages, a 502 from a proxy, a streaming response that arrives all at once) are HTTP behaviour you can reason about once you know the layers.

## What happens when you open a URL

1. **DNS:** the browser asks resolvers for the IP address of `example.com` (A/AAAA records; CNAMEs point names at other names).
2. **TCP connection** to that IP on port 443 (QUIC over UDP for HTTP/3).
3. **TLS handshake:** the server proves its identity with a certificate; both sides agree keys; everything after is encrypted.
4. **HTTP request:** method, path, headers, optional body.
5. The request usually passes a **CDN** or **reverse proxy** (Nginx, a load balancer) before reaching your **application server**.
6. **HTTP response:** status code, headers, body.
7. The browser **parses HTML**, fetches CSS, JavaScript and images (more requests), builds the page and runs scripts.

## HTTP essentials

| Method | Meaning | Safe? | Idempotent? |
|---|---|---|---|
| GET | Read | Yes | Yes |
| POST | Create or trigger an action | No | No (make it so with an idempotency key) |
| PUT | Replace | No | Yes |
| PATCH | Partial update | No | Not necessarily |
| DELETE | Remove | No | Yes |

| Status | Meaning | Who should act |
|---|---|---|
| 200 / 201 / 204 | OK / created / no content | — |
| 301 / 302 / 304 | Moved / found elsewhere / not modified (use cache) | Client follows |
| 400 / 422 | Bad request / valid JSON but invalid content | Client fixes input; **don't retry** |
| 401 / 403 | Not authenticated / authenticated but not allowed | Client logs in / stop |
| 404 / 409 | Not found / conflict (e.g. duplicate) | Client |
| 429 | Too many requests (read `Retry-After`) | Client waits, then retries |
| 500 / 502 / 503 / 504 | Server bug / bad upstream / unavailable / upstream timeout | Server; client may retry with backoff |

Headers you'll meet daily: `Content-Type`, `Authorization`, `Cache-Control`, `ETag`, `Set-Cookie`, `Retry-After`, `Location`, `X-Request-ID`.

## Cookies, CORS and caching

- **Cookies** are set by the server and sent back automatically on every request to that site. Mark session cookies `HttpOnly` (no JavaScript access), `Secure` (HTTPS only) and `SameSite=Lax` or `Strict`.
- **CORS** is the browser asking the API "may a page from origin A call you?". The API answers with `Access-Control-Allow-Origin` and friends. CORS protects users' browsers; it isn't authentication, and `curl` ignores it entirely.
- **Caching:** `Cache-Control: max-age=3600` lets caches reuse a response; `no-store` forbids it (use for anything personal). `ETag` + `If-None-Match` lets clients revalidate cheaply (304).

## Streaming responses

Some responses arrive in pieces: file downloads, **Server-Sent Events (SSE)** for live updates, and token-by-token LLM output. Proxies love to **buffer** responses, which turns a stream into one late lump. That's why AI streaming endpoints send `Cache-Control: no-cache` and, behind Nginx, `X-Accel-Buffering: no` ([Q14](#q14)).

## Common mistakes

- Returning 200 with `{"error": ...}` in the body. Use the status code; clients and monitoring depend on it.
- "Fixing" CORS with `Access-Control-Allow-Origin: *` on an API that uses cookies.
- Caching personalised responses at a CDN.
- Retrying 4xx errors. They'll fail the same way, and on paid APIs you pay again.

## Check yourself

<details markdown="1"><summary>What's the difference between 401 and 403?</summary>

401: we don't know who you are (missing or invalid credentials). 403: we know who you are and you're not allowed.

</details>

<details markdown="1"><summary>Which status codes are worth retrying, and which never?</summary>

Retry 429 (respecting `Retry-After`), 502, 503, 504 and network errors, with backoff and a limit. Never retry 400, 401, 403, 404 or 422: the same request fails the same way.

</details>

<details markdown="1"><summary>Your streaming endpoint works locally but arrives all at once in production. Likely cause?</summary>

A proxy or load balancer buffering the response. Disable buffering for that route (`X-Accel-Buffering: no` for Nginx), set `Cache-Control: no-cache`, and check any compression layer.

</details>

## Build it

Use `curl -v https://example.com` and identify the DNS result, TLS handshake and response headers. Then open your browser's Network tab on any site and find one cached response (304 or "from cache") and one cookie with its flags.

## What comes next

[1.4 Python for engineers](/01-foundations/04-python-for-engineers): the backend language of most AI work.
