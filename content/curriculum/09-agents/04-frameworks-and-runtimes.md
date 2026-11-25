---
title: Agent frameworks and runtimes
level: 4
summary: LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen and cloud agent SDKs in one breath each, and managed runtimes such as Amazon Bedrock AgentCore.
outcomes:
- Describe the main frameworks and when each fits
- Explain what a managed agent runtime provides
- Decide between managed and self-managed agent infrastructure
keypoints:
- LangChain composes integrations; **LangGraph** handles state, checkpoints and interrupts; LlamaIndex is data-first; CrewAI and AutoGen are multi-agent; vendors ship their own SDKs.
- Write the loop by hand once, then pick a framework for the features you actually need.
- Managed runtimes (e.g. **AgentCore**) give isolated sessions, memory, a tool gateway (MCP), identity, Cedar policy, observability and evals.
- Choose managed for isolation, long sessions and governance; self-managed for simple pipelines, cost at volume and portability.
- Cloud platforms like Bedrock keep inference inside the customer's boundary, which matters in regulated work.
projects:
- name: LangGraph agent with human interrupt
  stack:
  - Python
  - LangGraph
  - Postgres checkpointer
  - an LLM API
  build: Rebuild your hand-written agent with checkpoints and an approval interrupt before the write tool, resumable after restart.
  practises: Graph state, checkpoints, HITL.
- name: Deploy an agent to a managed runtime
  stack:
  - AWS Bedrock AgentCore or equivalent
  - Strands Agents
  - CDK
  build: Deploy a small agent with a Gateway-hosted tool and a Cedar policy denying one action; inspect traces.
  practises: Mapping your patterns onto managed services.
---

## Why this matters

Job descriptions list frameworks by name. You don't need all of them; you need to know what each is for, have depth in one, and understand that the hard parts (state, tools, budgets, evals) are the same everywhere.

<a id="q32"></a>

## Q32. Frameworks in one breath

| Framework | One line |
|---|---|
| LangChain | Integration and composition library |
| LangGraph | Explicit state, checkpoints, human-in-the-loop interrupts; a solid production choice ([P8](#p8)) |
| LlamaIndex | Data-first: connectors, indexing, query engines |
| CrewAI | Role-based multi-agent teams |
| AutoGen | Microsoft's multi-agent conversation framework |
| Strands Agents | AWS's open-source agent SDK; pairs with AgentCore |
| Provider agent SDKs | Vendors' own SDKs for building agents on their models (e.g. OpenAI Agents SDK, Claude Agent SDK) |
| AgentCore | Not a framework: AWS's platform to run and govern agents from any of these (below) |

**How to choose:** start with your own loop for small tools-based assistants; use a graph/state framework (LangGraph or similar) when you need checkpoints, branches and human interrupts; use a data framework (LlamaIndex) when retrieval is the centre; avoid multi-agent frameworks until a single agent demonstrably fails.

## Managed runtimes: Amazon Bedrock AgentCore

AgentCore is a worked example of what a managed agent platform provides. Summary as researched in November 2026 (check current docs before relying on specifics):

**One line:** AWS's platform to build, deploy, connect, govern and evaluate agents. Framework-agnostic (LangGraph, LangChain, CrewAI, Strands, custom) and model-agnostic.

| Service | What it does | The pattern it manages for you |
|---|---|---|
| **Runtime** | Each session in its own **microVM** (isolated CPU, memory, filesystem; sanitized at end); long sessions (up to 8 hours, ending after 15 min idle); HTTP, MCP, A2A, AG-UI; WebSocket streaming; persistent "Runtime Instances" for longer-lived sessions | Session isolation = tenant safety by construction |
| **Memory** | Short-term (session events) and long-term (facts, preferences, summaries) | Conversation and user memory ([9.5](/09-agents/05-memory-state-durable-workflows)) |
| **Gateway** | APIs and Lambdas → **MCP tools** with central auth; per-user MCP sessions; model invocation with **fallback** (added Oct 2026); a web-answer connector for cited web answers | Tool hosting, fallback chains ([Q12](#q12)) |
| **Identity** | Inbound JWT/IAM; outbound OAuth and API keys via a token vault | Agents act with the caller's permissions |
| **Policy** | **Cedar** rules on the Gateway: deterministic allow or deny on every tool call, outside the model | Authorization never lives in the prompt |
| **Observability** | Step traces, tokens, latency; OpenTelemetry; CloudWatch; a metric isolating platform overhead | Agent tracing ([10.5](/10-production-ai/05-observability-and-cost)) |
| **Evaluations** | LLM-as-judge and code evaluators, online and batch | Eval gates ([10.2](/10-production-ai/02-evaluation)) |
| **Built-in tools** | Browser and Code Interpreter in isolated sessions | Safe execution of model-written code |
| **Around it** | CLI, CDK constructs, an agent registry | IaC and governance |

> **Say:** "Its design is the one I'd hand-build anyway: isolated sessions, tools behind MCP with central auth, deterministic policy outside the model, traces and evals as first-class, and model fallback in the gateway. Moving to it is mapping patterns I already use onto managed services."

| Choose a managed runtime when | Choose self-managed when |
|---|---|
| Multi-tenant isolation matters; long sessions; cloud-native client; you want managed identity, policy, evals | Short deterministic pipelines; steady high volume where cost dominates; portability across clouds |

## Amazon Bedrock essentials

- **Converse API:** one message format across Bedrock models.
- **Guardrails:** content filters, denied topics, PII redaction, contextual grounding checks, automated reasoning checks.
- **Knowledge Bases** (managed RAG), prompt caching, batch inference, cross-region inference profiles.
- **Posture:** HIPAA-eligible; data not used to train base models; PrivateLink; KMS.

> **Say:** "A cloud model platform matters in regulated work because inference stays inside the customer's cloud boundary, under the same IAM, network controls and audit trail as everything else."

Google Cloud (Vertex AI, its agent builder) and Azure (Azure AI Foundry) offer comparable building blocks; the questions you ask of each are the same.

## Common mistakes

- Choosing a framework before writing the loop by hand once.
- Assuming a managed runtime removes the need for evals and authorization design.

## Check yourself

<details markdown="1"><summary>Is AgentCore a framework like LangGraph?</summary>

No. It's a runtime and governance platform: isolation, memory, tool gateway, identity, policy, observability and evals for agents built with any framework.

</details>

<details markdown="1"><summary>What does Cedar policy on a tool gateway give you that a prompt can't?</summary>

Deterministic, auditable allow/deny decisions on every tool call, evaluated outside the model, so a manipulated model still can't call a tool it isn't permitted to.

</details>

## Build it

Rebuild your 9.2 agent in LangGraph with a checkpoint and a human-approval interrupt before a write tool. Compare the code with your hand-written loop.

## What comes next

[9.5 Memory, state and durable workflows](/09-agents/05-memory-state-durable-workflows).
