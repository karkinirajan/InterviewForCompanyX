---
title: Next.js and the App Router
level: 1
summary: Server and client components, rendering modes (static, dynamic, streaming), route handlers and deployment, with the security rules for server code.
outcomes: Decide what runs on the server and what on the client | Choose static, dynamic or streamed rendering per route | Keep secrets and data access on the server
---

## Why this matters

Next.js is the most common framework for React products and AI apps. The App Router changes where code runs, which affects performance, cost and security. Mistakes here leak secrets to the browser or make pages slow.

## Core ideas

- **Server components** (the default) render on the server, can read databases and secrets, and send HTML, not their JavaScript, to the browser.
- **Client components** (`"use client"`) run in the browser for interactivity: state, effects, event handlers.
- **Rendering modes:** *static* (built once, served from a CDN), *dynamic* (per request), *streamed* (send the shell first, then parts as they're ready with `Suspense`).
- **Route handlers** (`app/api/.../route.ts`) are backend endpoints inside the app. **Server actions** let forms call server functions directly.
- **Static export** (`output: "export"`) produces plain files with no server at all; this guide is built that way.
- **Version-matched docs** ship inside the `next` package (`node_modules/next/dist/docs/`); read those for the version you're on.

## How to do it

```tsx
// app/orders/page.tsx: a server component, no "use client"
import { getOrdersForUser } from "@/server/orders";   // server-only module
import { OrderFilters } from "./OrderFilters";         // a client component

export default async function OrdersPage() {
  const orders = await getOrdersForUser();             // runs on the server, checks auth
  return <><OrderFilters /><OrderTable orders={orders} /></>;
}
```

Rules: keep secrets and database access in server-only modules (the `server-only` package makes importing them from client code a build error); pass client components only the data they need; validate every route handler and server action input like any public API, because they **are** public APIs.

## Architecture note

In larger systems the frontend never talks to the database directly; it goes through the backend API → service → repository chain. Next.js server code can be that backend for small products, or a thin layer calling a separate Python API for AI-heavy ones. Decide deliberately.

## Why this way

Server components cut JavaScript shipped to the browser and keep data access close to the database. Static rendering is fastest and cheapest; reserve dynamic rendering for pages that truly differ per request.

## Common mistakes

- Putting `"use client"` at the top of everything, shipping the whole app to the browser.
- Reading `process.env.SECRET` in a client component (it's either undefined or, if prefixed `NEXT_PUBLIC_`, published to everyone).
- Trusting server-action input because "only our form calls it".

## Check yourself

<details markdown="1"><summary>What's the difference between a server and a client component?</summary>

Server components run only on the server, can access secrets and data directly, and ship no JavaScript for themselves. Client components run in the browser (and pre-render on the server), and are needed for state, effects and event handlers.

</details>

<details markdown="1"><summary>Why must server actions validate input?</summary>

They're exposed as HTTP endpoints; anyone can call them with any payload, not just your form.

</details>

## Build it

Build a Next.js page that lists items from a server-only data function and has a client-side filter component; add a route handler with input validation (zod).

## What comes next

[4.4 Data fetching, state and forms](/04-frontend/04-data-fetching-state-forms).
