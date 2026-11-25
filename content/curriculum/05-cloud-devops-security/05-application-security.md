---
title: Application security
level: 2
summary: The OWASP Top 10 in practice, input handling, SSRF, secrets management and supply-chain hygiene, plus where AI adds new attack surface.
outcomes:
- Recognise and prevent the most common web vulnerabilities
- Defend outbound requests against SSRF
- Manage secrets so they never leak through code, logs or errors
keypoints:
- The OWASP Top 10 in practice. IDOR, injection, XSS, misconfiguration, vulnerable dependencies, auth failures, SSRF.
- Use parameterised queries, escape output by default, add a CSP header, and never build shell commands from input.
- '**SSRF**: require https, resolve the host and block private/loopback/link-local addresses (re-check redirects), and send no credentials.'
- Keep secrets out of code, logs, errors and `repr`, and refuse to start with placeholder values.
- AI adds prompt injection, output handling and excessive agency on top of all of this.
projects:
- name: Secure URL fetcher
  stack:
  - Python
  - httpx
  - ipaddress
  - pytest
  build: A "fetch and summarise this URL" endpoint with full SSRF protection and tests for 127.0.0.1, 169.254.169.254, private IPs and redirects.
  practises: SSRF defence, the classic AI-tool vulnerability.
- name: Deliberately vulnerable app, then fixed
  stack:
  - Flask
  - SQLite
  - OWASP ZAP
  - Bandit
  build: Build an app with five planted vulnerabilities (SQLi, XSS, IDOR, debug on, a committed secret), scan it, fix each one and keep a write-up.
  practises: Recognising and fixing the top vulnerabilities.
---

## Why this matters

Security bugs are cheap to prevent and catastrophic to discover in production. Many of the worst AI incidents are classic web security failures in new clothing: injection, missing authorization, unvalidated output, servers fetching attacker-chosen URLs.

## The classic list (OWASP Top 10, in practice)

| Risk | Prevent with |
|---|---|
| Broken access control (IDOR) | Object-level checks on every access; RLS ([3.4](/03-backend/04-authentication-and-authorization)) |
| Injection (SQL, command) | Parameterised queries; never build shell commands from input |
| Cross-site scripting (XSS) | Escape output by default; sanitise any HTML you render; CSP header |
| Security misconfiguration | DEBUG off in production; no default credentials; minimal exposed ports |
| Vulnerable dependencies | Lockfiles, automated updates, `pip-audit` / `npm audit` in CI |
| Authentication failures | Slow password hashing, MFA, rate-limited login |
| SSRF | Validate and restrict outbound URLs (below) |
| Logging failures | Log security events, never secrets |

## SSRF: when your server fetches a URL

Any feature where the server fetches a URL someone else supplied (webhooks, "import from URL", image fetchers, vendor-issued download links, agent web tools) can be abused to reach internal addresses like cloud metadata endpoints or admin services.

Defences:

1. Require `https`.
2. Resolve the hostname and **refuse private, loopback and link-local addresses** (and re-check after redirects).
3. Allow-list hosts where possible.
4. Never send your API keys to storage or third-party hosts.
5. Stream large downloads with size limits and timeouts.

Real examples: a clip service requires presigned storage URLs to be https and not private, loopback or link-local ([P1](#p1)); a lead-scoring platform checks every URL it calls on a user's behalf ([P7](#p7)). This is interview question [Q29](#q29).

## Secrets management

- Read secrets by name from the environment or a secrets manager; never commit them.
- Keep them out of `repr`, logs and error bodies, and scrub provider error messages (they can echo the key).
- Refuse to start with placeholder secrets (`changeme`).
- Rotate on any suspected exposure.
- See [Q30](#q30) for the full answer.

## Where AI adds attack surface

Prompt injection, sensitive data in prompts and logs, model output rendered as HTML, tools with too much power, and unbounded consumption (cost attacks). Part 10 covers the OWASP Top 10 for LLM applications ([Q27](#q27)).

## Common mistakes

- Rendering user or model content with `dangerouslySetInnerHTML` without sanitising.
- Error pages that print stack traces or environment variables.
- Allowing any URL in "fetch this page for me" features.

## Check yourself

<details markdown="1"><summary>An "import from URL" feature fetches whatever URL a user pastes. What's the risk and the fix?</summary>

SSRF: the server can be pointed at internal services or cloud metadata. Require https, resolve the host and block private, loopback and link-local ranges (checking redirects too), allow-list where possible, set size and time limits, and never forward credentials.

</details>

<details markdown="1"><summary>How do you stop an API key leaking through errors?</summary>

Never include upstream error bodies verbatim in responses; scrub known secret patterns from logged errors; keep keys out of object representations; return a fixed message to clients and log details server-side.

</details>

## Build it

Add SSRF protection to a URL-fetching endpoint and write tests for `http://127.0.0.1`, `http://169.254.169.254`, a private IP, and a redirect to a private IP.

## What comes next

[5.6 Privacy and compliance](/05-cloud-devops-security/06-privacy-and-compliance).
