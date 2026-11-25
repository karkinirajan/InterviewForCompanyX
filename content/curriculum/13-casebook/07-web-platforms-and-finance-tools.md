---
title: "P14–P19 · Web platforms and finance tools"
level: 3
summary: The remaining projects named on the resume and GitHub profile (an AI task board, a 3D storefront, a CMS, a budget app, an AI-guided philosophy explainer and an options-hedging tool), each with what it proves.
outcomes:
- Explain each project in one breath with its stack
- Point to the engineering decision worth quoting in each
- Connect each project to the lesson it demonstrates
keypoints:
- "**TexecN (P14):** AI helpers on Groq that fall back through three models when rate-limited; roles enforced server-side (a viewer can't write)."
- "**Sheesh Shoes (P15):** Next.js 16 + Drizzle + Postgres 17 behind PgBouncer + Redis + Auth.js, a Three.js product viewer, and Playwright, axe and k6 tests."
- "**Everest Smart Traders (P16):** Supabase CMS with Zod validation, allow-list HTML sanitising, and tests on Postgres-in-WASM (PGlite)."
- "**Budget tracker (P17):** Prisma + Postgres, `decimal.js` for money, OAuth via NextAuth, an installable PWA."
- "**Spinoza's Ethics (P18):** six interactive SVG diagrams plus a Groq-powered \"Geometric Advisor\"."
- "**Delta hedging (P19):** Black–Scholes greeks, implied volatility by bisection, a portfolio-level hedge, fail-closed design, and an order only on exact confirmation."
projects:
- name: AI task board with model fallback
  stack: [Next.js, Supabase, next-auth, Groq SDK, dnd-kit]
  build: A Kanban board whose AI helpers (task from a sentence, subtasks, risk scan) fall back through three models on rate limits, with roles enforced in server code.
  practises: Fallback chains and server-side authorization in a product.
- name: Options greeks calculator
  stack: [Python, pytest, FastAPI]
  build: Black–Scholes price and greeks plus implied volatility by bisection, checked against textbook values, behind an API that rejects out-of-range inputs.
  practises: Numerical correctness, fail-closed validation.
---

## Why this matters

Every project on a CV is an invitation to a follow-up question. These six are listed on the resume or the GitHub profile, so each needs an answer ready: what it is, how it's built, and the one decision worth talking about. The facts below come from each project's own README.

<a id="p14"></a>

## P14 · TexecN: AI-assisted task manager (toexecutenow.com)

- **What:** a Kanban board (Draft, 2Execute, Executing, Executed) for personal and team work, with subtasks, attachments, timers, automations ("when a task becomes overdue, set priority to high"), workspaces with owner/admin/member/viewer roles, chat with `@ai` replies, and Slack, Discord and Notion integrations.
- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase (Postgres), next-auth, Groq, dnd-kit.
- **Decisions worth quoting:** AI helpers **fall back through three models when one is rate-limited** ([Q12](#q12)); roles are enforced server-side, so a viewer can read the board and chat but can't change tasks or write; a daily cron sends due-task reminders.
- **Lessons it demonstrates:** [10.1](/10-production-ai/01-reliability-for-llm-calls), [3.4](/03-backend/04-authentication-and-authorization), [11.2](/11-ai-automation/02-workflow-automation).

<a id="p15"></a>

## P15 · Sheesh Shoes: athletic footwear store (sheeshshoes.com)

- **What:** e-commerce for the Nepal market, rebuilt from a design MVP.
- **Stack:** Next.js 16 (App Router, Turbopack, Cache Components), React 19 server components, Tailwind CSS 4, Drizzle ORM, PostgreSQL 17 behind **PgBouncer**, Redis 7, Auth.js v5, Argon2, S3-compatible storage, and **Three.js** for the 3D product view.
- **Quality:** Vitest, Playwright, axe-core (accessibility) and **k6** (load); a `gates` script that refuses private keys anywhere in the working directory; a one-command Docker stack (Postgres, Redis, migrations and seed, app, PgBouncer, Nginx).
- **Lessons it demonstrates:** [3.3](/03-backend/03-relational-databases-and-sql) (pooling), [4.3](/04-frontend/03-nextjs-app-router), [5.1](/05-cloud-devops-security/01-linux-docker-nginx), [2.3](/02-software-lifecycle/03-testing-strategy).

<a id="p16"></a>

## P16 · Everest Smart Traders: marketing site and CMS

- **What:** a marketing site plus admin CMS for a supplier and installer of gate automation and smart locks.
- **Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, Supabase (Postgres, Auth, Storage), Zod v4, `sanitize-html` with an allow-list, `next/image` + sharp; tests with Vitest and **PGlite** (Postgres in WASM).
- **Decisions worth quoting:** every form goes through Zod; CMS HTML is cleaned with an allow-list before rendering (output handling, [Q27](#q27)); route groups separate the public site, admin and auth; a generated sitemap and structured data for SEO.
- **Lessons it demonstrates:** [5.5](/05-cloud-devops-security/05-application-security), [4.4](/04-frontend/04-data-fetching-state-forms).

<a id="p17"></a>

## P17 · Budget tracker: personal finance app

- **What:** accounts, transactions, budgets with over-budget alerts, goals, loans, subscriptions, and analytics charts; an installable PWA.
- **Stack:** Next.js 16 (server components), TypeScript, Tailwind CSS 4, Radix UI + shadcn/ui, **Prisma 6** + PostgreSQL (Supabase), NextAuth v5 (Google and GitHub OAuth), Zod, react-hook-form, Chart.js, **decimal.js**, and the AI SDK with Groq and Google providers.
- **Decisions worth quoting:** money handled with a decimal library, never floats ([1.4](/01-foundations/04-python-for-engineers)); charts lazy-loaded and kept off the server render.
- **Lessons it demonstrates:** [3.4](/03-backend/04-authentication-and-authorization) (OAuth), [4.4](/04-frontend/04-data-fetching-state-forms).

<a id="p18"></a>

## P18 · Spinoza's Ethics: interactive visualisation

- **What:** a visual guide to Spinoza's *Ethics* with **six interactive SVG diagrams** (system, hierarchy, flow, parallelism, affects, power and virtue) and a **Geometric Advisor** that answers questions in Spinoza's geometric style.
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Groq (Llama 3.3 70B), react-markdown, Vercel.
- **Use it for:** explaining a complex domain through interface design, and a small, cheap LLM feature with a clear persona ([7.4](/07-llm-foundations/04-prompt-engineering)).

<a id="p19"></a>

## P19 · Delta hedging platform (IG demo API)

- **What:** reads the option positions of an IG **demo** account, prices each with **Black–Scholes** (greeks and implied volatility from the option's own market price), nets deltas across the whole portfolio, and works out the trade in the underlying that makes it delta-neutral. A dashboard and a small JSON API show the result.
- **Decisions worth quoting:**
  - Greeks (price, delta, gamma, vega, theta, rho) from the standard library, checked against textbook values; **no input is clamped**, so out-of-range volatility or time is an error, not a silently different number.
  - Implied volatility by **bisection**, which always converges inside its interval or says the price isn't attainable; when none is found, the configured default is used **and labelled**.
  - **Fails closed:** an unreadable strike, type or expiry, or an untradeable market, blocks the plan.
  - **Dry run by default.** An order needs `confirm: true` *and* the previewed direction and size; if the book moved, it returns 409 with the new plan. The order confirmation is read back, so ACCEPTED or REJECTED is recorded.
  - Refuses to start against anything but the demo environment; no secrets in logs, URLs, pages or errors; strict CSP.
  - Honest scope: it never hedges by itself, and there's no background loop.
- **Stack:** Python, Flask, the IG REST API, NumPy for portfolio arithmetic, Docker, pytest.
- **Lessons it demonstrates:** human confirmation of side effects ([Q35](#q35), [9.6](/09-agents/06-controlling-agents)), fail-closed validation, idempotent and checked writes.

## Interview follow-ups

- **"What's delta, and why hedge it?"** Delta is how much an option's price moves per unit move in the underlying. A delta-neutral portfolio isn't hurt by small moves; you rebalance as delta changes (gamma).
- **"Why bisection for implied volatility?"** Price increases monotonically with volatility, so bisection on a bracketing interval always converges; Newton's method is faster but can diverge where vega is tiny.
- **"Why PgBouncer in front of Postgres?"** Serverless and many app instances open far more connections than Postgres handles well; a pooler multiplexes them onto a small pool.

## Check yourself

<details markdown="1"><summary>Which of these projects shows a model fallback chain, and why does it matter?</summary>

TexecN: its Groq helpers fall back through three models when one is rate-limited, so a provider limit degrades quality slightly instead of breaking the feature.

</details>

<details markdown="1"><summary>How does the delta-hedging tool stop a stale preview from being executed?</summary>

The order request must repeat the previewed direction and size; if the book changed, the server recalculates and returns 409 with the new plan instead of placing the old order.

</details>

## What comes next

[13.8 Resume and profile, claim by claim](/13-casebook/08-resume-and-profile-claims), where every statement on the CV and GitHub profile is mapped to the lesson that defends it.
