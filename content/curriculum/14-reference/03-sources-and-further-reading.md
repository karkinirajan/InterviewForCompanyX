---
title: Sources and further reading
level: 0
summary: The primary sources behind the guide and where to go deeper on each part.
outcomes:
- Know where to verify a claim and where to go deeper
keypoints:
- Prefer current official docs over memory, including this guide.
- Date-sensitive material (managed agent runtimes, model features) is marked with its research date.
- The original interview manual lives in `content/archive/leapfrog-2026/` and the tag `leapfrog-2026-final`.
projects:
- name: Docs freshness checker
  stack:
  - Python
  - httpx
  - GitHub Actions (weekly)
  build: Check every external link in the guide weekly and open an issue for broken or redirected ones.
  practises: Keeping a reference trustworthy.
- name: Release-notes digest
  stack:
  - Python
  - RSS/Atom feeds
  - an LLM API
  - email
  build: A weekly digest of provider and framework release notes, summarised with links, to keep the guide current.
  practises: Staying current efficiently.
---

## Primary documentation

Always prefer current official docs over memory (including this guide), especially for fast-moving AI products.

| Topic | Source |
|---|---|
| Python, uv | [python.org docs](https://docs.python.org/3/) · [uv](https://docs.astral.sh/uv/) |
| FastAPI, Pydantic | [FastAPI](https://fastapi.tiangolo.com/) · [Pydantic](https://docs.pydantic.dev/) |
| Django | [Django docs](https://docs.djangoproject.com/) |
| Postgres, pgvector | [PostgreSQL docs](https://www.postgresql.org/docs/) · [pgvector](https://github.com/pgvector/pgvector) |
| React, Next.js | [react.dev](https://react.dev/) · [Next.js docs](https://nextjs.org/docs) (version-matched docs ship in `node_modules/next/dist/docs/`) |
| HTTP errors | [RFC 9457 problem details](https://www.rfc-editor.org/rfc/rfc9457) |
| App configuration | [The Twelve-Factor App](https://12factor.net/) |
| Security | [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) |
| Model APIs | Each provider's API reference and release notes (Anthropic, OpenAI, Google, AWS Bedrock) |
| MCP | [Model Context Protocol](https://modelcontextprotocol.io/) |

## Managed agent runtimes (researched November 2026)

- [Amazon Bedrock AgentCore FAQs](https://aws.amazon.com/bedrock/agentcore/faqs/)
- [AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)
- [AgentCore Runtime: how it works](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html)
- [AgentCore Runtime: isolated sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html)
- [Policy and Evaluations announcement](https://aws.amazon.com/fr/blogs/aws/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/)
- [Runtime Instances](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances-how-it-works.html)
- Industry examples: [Cohere Health on AgentCore](https://aws.amazon.com/blogs/machine-learning/how-cohere-health-digitizes-clinical-policies-using-amazon-bedrock-agentcore) · [Bluesight on Bedrock](https://aws.amazon.com/blogs/machine-learning/building-an-agentic-ai-solution-at-bluesight-with-amazon-bedrock/)

## Project sources

The casebook (Part 13) is drawn from the author's own repositories (public READMEs, ADRs and commit histories), private project notes, and the portfolio library confirmed in November 2026. Repository metrics are as recorded then.

## Where this guide came from

The guide began as a two-hour interview-preparation manual for an AI Integration Engineer role (November 2026). That original manual is archived unchanged in the repository under `content/archive/leapfrog-2026/` and in the git tag `leapfrog-2026-final`.

## What comes next

[14.4 Code kit](/14-reference/04-code-kit).
