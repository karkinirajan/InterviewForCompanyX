---
title: Authentication and authorization
level: 2
summary: Proving who a user is (sessions, JWTs, OAuth) and deciding what they may do (roles, ownership checks, row-level security), without the classic holes.
outcomes: Choose between server sessions and JWTs | Explain the OAuth authorization code flow with PKCE | Prevent IDOR with object-level authorization checks
---

## Why this matters

Auth bugs are the most damaging bugs: one missing check exposes every customer's data. AI features add a new twist, because a model must never be the thing that decides who may see what.

## Core ideas

- **Authentication (authn):** who are you? Passwords, OAuth/OIDC login, passkeys, API keys.
- **Authorization (authz):** what may you do? Roles (RBAC), attributes (ABAC), ownership ("is this your order?").
- **Session cookie:** the server stores session state; the browser holds an opaque ID in an `HttpOnly` cookie. Easy to revoke.
- **JWT:** a signed token carrying claims (user id, expiry). Servers verify it without a lookup; hard to revoke before expiry, so keep access tokens short-lived and use rotating refresh tokens.
- **OAuth 2.0 / OpenID Connect:** delegate login or access to another provider ("Sign in with Google", "connect your HubSpot"). The **authorization code flow with PKCE** is the safe default.
- **Password storage:** a slow, salted hash (Argon2id, bcrypt). Never encryption, never plain hashing.

## How to do it

### Object-level authorization (the check people forget)

```python
@router.get("/v1/orders/{order_id}")
async def get_order(order_id: int, user: CurrentUser, repo: OrderRepo):
    order = await repo.get(order_id)
    if order is None or order.customer_id != user.id:   # same 404 for "missing" and "not yours"
        raise HTTPException(404)
    return order
```

Without the ownership check, any logged-in user can read any order by changing the number. That's **IDOR** (insecure direct object reference), number one on most API security lists.

### Defence in depth for multi-tenant data

Filter by tenant in every query **and** enable Postgres row-level security as a second wall, so a forgotten filter returns nothing instead of another tenant's data ([C4](#c4)).

### Authorization in AI features

- Retrieval must apply the user's permissions **before** documents reach the model ([Q8](#q8)).
- A tool the agent calls runs with the **user's** permissions, checked in code, never because the prompt says so ([Q25](#q25)).
- "A system prompt is not a security boundary."

## Why this way

Sessions suit classic web apps on one domain (simple, revocable). JWTs suit many services verifying identity without a shared session store, or mobile clients; pay for that with short expiry and refresh rotation. OAuth avoids handling other providers' passwords at all.

## Common mistakes

- Checking that a user is logged in but not that they own the resource.
- Long-lived JWTs stored in `localStorage` (readable by any injected script).
- Rolling your own crypto or password hashing.
- Trusting a `tenant_id` sent by the client.

## Check yourself

<details markdown="1"><summary>What is IDOR and how do you prevent it?</summary>

Insecure direct object reference: accessing another user's object by changing an ID. Prevent it with an ownership or permission check on every object access, in server code, ideally centralised in the repository layer, plus RLS as a backstop.

</details>

<details markdown="1"><summary>Why is PKCE used in the OAuth code flow?</summary>

It binds the authorization code to the client that started the flow (via a one-time secret), so an intercepted code can't be exchanged by an attacker. It's required for public clients like SPAs and mobile apps and recommended for all.

</details>

## Build it

Add login with hashed passwords (Argon2id) and session cookies to your FastAPI service, then write a test proving user A gets 404 on user B's order.

## What comes next

[3.5 Caching and Redis](/03-backend/05-caching-and-redis).
