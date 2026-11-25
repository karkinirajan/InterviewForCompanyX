---
title: Data fetching, state and forms
level: 2
summary: Server state versus client state, caching and revalidation, race-free fetching, and forms with validation and good error states.
outcomes: Separate server state from UI state | Fetch without races, with loading, error and empty states | Build forms that validate on both client and server
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
