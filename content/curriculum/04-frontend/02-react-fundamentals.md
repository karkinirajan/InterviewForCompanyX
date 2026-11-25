---
title: React fundamentals
level: 1
summary: Components, props, state, effects and the rendering model, with the patterns that keep components predictable.
outcomes: Build components with props and state | Use effects correctly (and avoid them when you can) | Model UI state so impossible states can't happen
---

## Why this matters

React is the most widely used UI library and the default for AI product frontends. Most React bugs come from misunderstanding when components re-render and what effects are for.

## Core ideas

- **Components** are functions that return UI from **props** (inputs) and **state** (memory).
- **Rendering:** when state or props change, React calls the component again and updates the DOM to match. Rendering should be pure: no side effects.
- **State updates are asynchronous and immutable:** `setItems([...items, item])`, never `items.push(item)`.
- **Effects** (`useEffect`) synchronise with things outside React: subscriptions, timers, non-React widgets. They are **not** for deriving data from props or state.
- **Keys** identify list items across renders; use stable IDs, not array indexes.
- **Lifting state up:** shared state lives in the closest common parent; context for truly global things (theme, current user).

## How to do it

```tsx
type Status = "idle" | "loading" | "error" | "done";

function AskBox({ onAsk }: { onAsk: (q: string) => Promise<string> }) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [answer, setAnswer] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try { setAnswer(await onAsk(question)); setStatus("done"); }
    catch { setStatus("error"); }
  }

  return (
    <form onSubmit={submit}>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button disabled={status === "loading" || !question.trim()}>Ask</button>
      {status === "error" && <p role="alert">Couldn't get an answer. Try again.</p>}
      {status === "done" && <p>{answer}</p>}
    </form>
  );
}
```

Derived values (like "is the button disabled") are computed during render, not stored in state or synced with effects.

## Why this way

Pure rendering + immutable updates make components predictable and fast to diff. One status value (or a discriminated union) instead of several booleans prevents contradictory states like `loading && error`.

## Common mistakes

- `useEffect` to copy props into state, causing stale or doubled renders.
- Missing dependencies in effect arrays (stale closures).
- Index keys in lists that reorder, mixing up item state.
- Fetching in effects without handling races (the slower old request overwriting the newer one). Use a data library or abort controllers ([4.4](/04-frontend/04-data-fetching-state-forms)).

## Check yourself

<details markdown="1"><summary>When should you use `useEffect`?</summary>

To synchronise with something outside React (subscriptions, timers, imperative widgets, browser APIs). Not to compute values from props or state; compute those during render.

</details>

<details markdown="1"><summary>Why not store `isLoading`, `isError` and `data` as three separate states?</summary>

They can contradict each other. A single status (or a discriminated union with data attached) makes impossible states unrepresentable.

</details>

## Build it

Build the `AskBox` with a fake `onAsk` that sometimes fails, and Testing Library tests for loading, error and success.

## What comes next

[4.3 Next.js and the App Router](/04-frontend/03-nextjs-app-router).
