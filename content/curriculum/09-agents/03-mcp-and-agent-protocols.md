---
title: MCP and agent protocols
level: 4
summary: The Model Context Protocol for exposing tools and data to any compatible client, plus agent-to-agent and agent-to-UI protocols, and their security implications.
outcomes: Explain what MCP standardises and why it matters | Build and secure a small MCP server | Recognise A2A and AG-UI and what they're for
---

## Why this matters

Before MCP, every AI client needed custom integration code for every tool. MCP is now widely supported by assistants, IDEs and agent platforms, and exposing your service as an MCP server is an increasingly common requirement.

<a id="q33"></a>

## Q33. MCP?

An open protocol exposing tools, resources and prompts to any compatible client: M×N integrations become M+N. Every MCP server is new attack surface. Casebook example: FastMCP tool servers with a shared secret required beyond loopback ([P8](#p8)). Managed agent gateways can turn existing APIs and functions into MCP tools with central authentication ([9.4](/09-agents/04-frameworks-and-runtimes)).

## Core ideas

- **Server** exposes **tools** (actions), **resources** (readable data) and **prompts** (templates).
- **Client** (an assistant, IDE or agent) discovers and calls them.
- **Transports:** local (stdio) for tools on your machine; HTTP for remote servers.
- **Auth:** remote servers need real authentication and per-user authorization (OAuth is the common choice).

## How to do it

```python
from fastmcp import FastMCP

mcp = FastMCP("orders")

@mcp.tool()
async def get_order_status(order_id: int) -> str:
    """Return the status of one of the current user's orders."""
    user = current_user()                      # from the authenticated session
    order = await orders.get(order_id)
    if order is None or order.customer_id != user.id:
        return "not found"
    return order.status
```

## Related protocols

| Protocol | Connects | Use |
|---|---|---|
| MCP | Model/agent ↔ tools and data | Tool and context integration |
| A2A | Agent ↔ agent | Delegating tasks between independent agents |
| AG-UI | Agent ↔ user interface | Streaming agent events and state to frontends |

## Security checklist for MCP servers

- Authenticate every remote connection; never expose an unauthenticated server beyond localhost.
- Authorize per tool call with the user's identity.
- Treat tool descriptions from third-party servers as untrusted (they're text the model reads).
- Least privilege: separate read-only and write tools; approval for side effects.
- Log every call (who, which tool, arguments without secrets, outcome).

## Check yourself

<details markdown="1"><summary>What problem does MCP solve?</summary>

It standardises how AI clients discover and call tools and data, so each tool is implemented once as a server and works with every compatible client: M clients × N tools becomes M + N integrations.

</details>

<details markdown="1"><summary>Why is a third-party MCP server a security risk?</summary>

Its tool descriptions and outputs are text the model reads (an injection channel), its tools may have broad side effects, and it may receive sensitive data. Vet it like any dependency, restrict its permissions and require approval for risky calls.

</details>

## Build it

Expose two tools from your project as an MCP server, connect it to an MCP-capable client, and add authentication for the HTTP transport.

## What comes next

[9.4 Frameworks and runtimes](/09-agents/04-frameworks-and-runtimes).
