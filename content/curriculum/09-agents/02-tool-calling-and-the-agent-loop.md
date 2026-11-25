---
title: Tool calling and the agent loop
level: 4
summary: How a model requests tool calls, how your code executes them safely, and how to write the loop yourself before reaching for a framework.
outcomes:
- Define tools with tight schemas
- Implement an agent loop with validation, authorization and limits
- Put guardrails in the tools rather than the prompt
keypoints:
- 'Loop: model → tool calls → validate args → **authorise in code** → execute narrowly → return result as data → check budgets → repeat.'
- "Keep tools narrow with strict schemas (`additionalProperties: false`)."
- Tools run with the **user's** permissions and return minimal data.
- Tool results are untrusted input to the next turn and an injection channel.
- Put invariants in the tools, e.g. "the account can't go negative, whatever the model says".
projects:
- name: Hand-written agent loop
  stack:
  - Python
  - an LLM API
  - SQLite
  - pytest
  build: A loop with three tools over a fake shop DB, step budget, argument validation and tests where the model asks for another user's data.
  practises: Understanding every framework's core.
- name: Personal finance agent (read-only)
  stack:
  - TypeScript
  - Vercel AI SDK
  - Plaid sandbox or CSV
  - Postgres
  build: Answer spending questions with tools that only read and aggregate, with spending invariants enforced in the tools.
  practises: Tool design and guardrails in code.
---

## Why this matters

Every agent framework is a variation of one loop. Writing it yourself once makes frameworks understandable and makes it obvious where safety checks belong.

## The loop

```text
messages = [system, user]
repeat:
    reply = model(messages, tools)
    if reply has no tool calls: return reply             # finished
    for each tool call:
        validate arguments against the tool's schema
        authorize: may THIS user do THIS with THESE arguments?
        execute the narrow operation (with timeout)
        append the result (as data) to messages
    enforce budgets: steps, tokens, time, dollars
```

## How to do it

```python
TOOLS = [{
    "name": "get_order",
    "description": "Fetch one order belonging to the current user.",
    "input_schema": {"type": "object",
                     "properties": {"order_id": {"type": "integer", "minimum": 1}},
                     "required": ["order_id"], "additionalProperties": False},
}]

async def run_tool(name: str, args: dict, user: User) -> dict:
    if name == "get_order":
        order = await orders.get(int(args["order_id"]))
        if order is None or order.customer_id != user.id:   # authorization in code
            return {"error": "not_found"}
        return order.public_view()                           # only what the model needs
    return {"error": "unknown_tool"}
```

## Guardrails belong in the tools

The model can be confused or manipulated; the tool can't. A casebook simulation ([P8](#p8)) shows the pattern: the price tool only shows data up to the simulated moment (no look-ahead); search results published after it, or undated, are dropped; orders must be positive whole shares at a real price; cash can never go negative; read-check-write runs under a lock; tool servers require a shared secret beyond loopback. **Whatever the model says, the account can't go negative.**

## Design rules for tools

- Narrow and specific (`get_order`, not `run_sql`).
- Strict schemas; reject unknown fields.
- Run with the **user's** permissions, checked in code.
- Return minimal data; tool results are untrusted input to the model on the next turn (they can contain injected instructions, [S3](#s3)).
- Idempotent where possible; side effects behind approval ([9.6](/09-agents/06-controlling-agents)).

## Common mistakes

- Generic tools (`execute_query`, `http_get` on any URL).
- Trusting tool arguments because "the model generated them".
- Returning whole database records into the context.

## Interview follow-ups

- **"The model calls a tool with invalid arguments. What happens?"** Schema validation rejects them; return a structured error as the tool result so the model can correct itself, count it against the step budget, and stop after repeated failures.
- **"Parallel tool calls?"** Run independent read-only calls concurrently with timeouts; serialise writes; return results in a stable order.
- **"How much data should a tool return?"** The minimum the model needs, trimmed and structured, because results cost tokens and are an injection channel.

## Check yourself

<details markdown="1"><summary>Where does authorization for a tool call happen?</summary>

In the tool implementation on the server, using the authenticated user's identity and permissions, never in the prompt and never based on what the model claims.

</details>

<details markdown="1"><summary>Why are tool results a prompt-injection risk?</summary>

They're text the model reads on the next step. A web page, email or Slack message returned by a tool can contain instructions; the model may follow them unless the system constrains what tools and outputs can do.

</details>

## Build it

Write the loop above with two tools against a fake database, a 6-step budget, argument validation and an authorization test where the model asks for another user's order.

## What comes next

[9.3 MCP and agent protocols](/09-agents/03-mcp-and-agent-protocols).
