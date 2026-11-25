---
title: Data fetching, state and forms
level: 2
summary: Server state versus client state, caching and revalidation, race-free fetching, and forms with validation and good error states.
outcomes:
- Separate server state from UI state
- Fetch without races, with loading, error and empty states
- Build forms that validate on both client and server
keypoints:
- Server state is a cache of backend data, so use TanStack Query or SWR. Client state is UI-only.
- Design all four states for every fetch. Loading, error, **empty**, success.
- Abort stale requests, and validate forms on the client for UX and on the server for truth.
- Optimistic updates suit low-stakes actions, never money.
- Keep sensitive drafts in `sessionStorage` or on the server, never in `localStorage`.
projects:
- name: Search-as-you-type directory
  stack:
  - React
  - TanStack Query
  - FastAPI
  - Postgres full-text
  build: Debounced search with aborts, cached pages, empty and error states and keyboard navigation.
  practises: Server-state caching and race-safe fetching.
- name: Multi-step application form
  stack:
  - Next.js
  - react-hook-form
  - zod
  - server actions
  build: A shared zod schema for client and server validation, autosaved drafts in sessionStorage, and per-field server errors.
  practises: Form validation on both sides and safe drafts.
---

## Why this matters

Most frontend complexity is data: loading it, caching it, keeping it fresh and handling failure. Treating server data as local state causes stale screens, duplicate requests and race conditions.

## Core ideas

- **Server state** (orders, documents, answers) is owned by the backend: cache it, refetch it, invalidate it. Libraries like TanStack Query or SWR handle this.
- **Client/UI state** (which tab is open, form drafts) lives in components or a small store.
- **Every fetch has four states:** loading, error, empty, success. Design all four.
- **Races:** a slow old request can resolve after a newer one and overwrite it. Abort or ignore stale responses.
- **Optimistic updates:** update the UI immediately and roll back on failure; great for likes, dangerous for money.
- **Forms:** validate on the client for fast feedback, and **again on the server** for correctness.

## How to do it

```tsx
const { data, error, isPending } = useQuery({
  queryKey: ["evaluations", userId],         // cache key includes who
  queryFn: ({ signal }) => api.listEvaluations(userId, { signal }),  // abortable
});
if (isPending) return <Skeleton />;
if (error) return <ErrorState retry />;
if (!data.length) return <EmptyState cta="Run your first evaluation" />;
return <EvaluationTable rows={data} />;
```

Storage choices matter for sensitive drafts: `sessionStorage` disappears when the tab closes, `localStorage` persists across sessions on a shared computer. One casebook app keeps clinical drafts in `sessionStorage` for exactly that reason ([P2](#p2)).

## Common mistakes

- No empty state, so users stare at a blank table.
- Client-only validation.
- Global stores holding server data that silently goes stale.
- Persisting sensitive data in `localStorage`.

## Worked example: the four states

```text
loading → skeleton rows that match the final layout (no layout shift)
error   → "Couldn't load evaluations. [Retry]" plus a request ID for support
empty   → "No evaluations yet. [Run your first evaluation]" (a call to action)
success → the table, with pagination and a refresh indicator for background refetches
```

## Interview follow-ups

- **"How do you keep a list fresh after a mutation?"** Invalidate the affected query keys after success (or update the cache directly), and use optimistic updates only where rollback is harmless.
- **"How do you avoid waterfalls?"** Fetch in parallel, move data fetching up to server components or route loaders, and prefetch on hover for likely navigation.
- **"Where do you validate a form?"** Client for instant feedback, server for truth, with one shared schema (zod) so the rules can't drift.

## Check yourself

<details markdown="1"><summary>What's the difference between server state and client state?</summary>

Server state is a cached copy of data the backend owns (may be stale, needs refetching and invalidation). Client state is owned by the UI (open panels, unsaved inputs).

</details>

<details markdown="1"><summary>How do you prevent a slow earlier request from overwriting newer results?</summary>

Abort the earlier request (AbortController) when a new one starts, or ignore responses whose key no longer matches the current query. Data libraries do this for you.

</details>

## Build it

Build a search-as-you-type list with debouncing, aborting of stale requests, and all four states.

## What comes next

[4.5 Building AI interfaces](/04-frontend/05-building-ai-interfaces).
