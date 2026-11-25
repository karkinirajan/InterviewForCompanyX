---
title: JavaScript and TypeScript
level: 0
summary: The JavaScript runtime model (event loop, promises, modules) and the TypeScript types that make large frontends and Node services safe to change.
outcomes:
- Explain the event loop, promises and async/await
- Write typed TypeScript with unions, generics and narrowing
- Set up a Node project with npm and a strict tsconfig
keypoints:
- JavaScript runs one thing at a time on the event loop, so long synchronous work freezes the UI.
- '`async/await` pauses a function, not the program. A forgotten `await` gives you a Promise.'
- Model UI states with **discriminated unions**, not several booleans.
- Types vanish at runtime, so validate network data (zod) because `as T` is only a promise.
- Keep `strict` mode on in tsconfig, and avoid `any`.
projects:
- name: Typed chat state machine
  stack:
  - TypeScript
  - Vitest
  - zod
  build: A reducer for idle/streaming/done/error chat states, with zod-validated server messages and tests for every transition.
  practises: Unions, narrowing, runtime validation.
- name: Node CLI with typed config
  stack:
  - Node.js
  - TypeScript
  - zod
  - commander
  build: A CLI that loads config from env and a file, validates it with zod, and fails with clear messages.
  practises: Strict TypeScript on the backend; config validation.
---

## Why this matters

Every web UI runs JavaScript, and most serious frontends are written in TypeScript. AI products are no exception: the chat interface, the streaming text, the citations panel and the approve-or-reject buttons are all TypeScript. Many teams also run Node backends.

## Core ideas

- **Single-threaded event loop:** JavaScript runs one thing at a time; I/O happens in the background and its callbacks queue up. Long synchronous work freezes the page.
- **Promises and `async/await`:** a promise is a value that will exist later. `await` pauses the function, not the whole program.
- **Modules:** `import`/`export` (ES modules). `package.json` lists dependencies; `npm` or `pnpm` installs them; the lockfile pins exact versions.
- **`const` and `let`,** never `var`. Strict equality `===`.
- **TypeScript** adds static types that disappear at runtime. It catches mistakes at compile time and documents intent.

## TypeScript you'll use every day

```ts
// Object shapes
interface Message { id: string; role: "user" | "assistant"; text: string }

// Discriminated unions: model every state explicitly
type ChatState =
  | { status: "idle" }
  | { status: "streaming"; partial: string }
  | { status: "done"; message: Message }
  | { status: "error"; error: string };

function render(s: ChatState): string {
  switch (s.status) {          // TypeScript narrows the type in each branch
    case "idle": return "";
    case "streaming": return s.partial + "▍";
    case "done": return s.message.text;
    case "error": return `Something went wrong: ${s.error}`;
  }
}

// Generics
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;   // a cast, not a check: validate untrusted data (e.g. with zod)
}
```

Turn on `"strict": true` in `tsconfig.json` and keep it on.

## Why this way

- **Discriminated unions over boolean flags:** `isLoading`, `isError` and `data` as three separate fields can contradict each other; a union can't. This matters a lot for AI UIs with many states ([4.5](/04-frontend/05-building-ai-interfaces)).
- **Types are not validation:** `as T` trusts the server. Data from the network should be parsed with a schema library (zod, valibot) when correctness matters, just as Pydantic does in Python.
- **TypeScript on the backend** (Node, Bun, Deno) is a fine choice when the team is frontend-heavy; Python wins when you need the AI and data ecosystem.

## Common mistakes

- Forgetting `await`, so you get a `Promise` where you expected a value.
- `any` everywhere, which turns TypeScript off silently.
- Mutating React state directly instead of creating new objects.
- Floating promises with no error handling (unhandled rejections).

## Check yourself

<details markdown="1"><summary>Why does a long `for` loop freeze a web page?</summary>

JavaScript in the page runs on one thread with the rendering work. While your loop runs, the event loop can't process clicks, paints or network callbacks. Break the work up, move it to a Web Worker, or do it on the server.

</details>

<details markdown="1"><summary>Does `res.json() as User` guarantee you have a valid `User`?</summary>

No. It's a compile-time assertion with no runtime check. Validate with a schema library if the data's shape matters.

</details>

## Build it

Write a typed `ChatState` reducer in TypeScript with the four states above and unit tests (Vitest) for each transition, with `strict` mode on.

## What comes next

[1.6 Data structures and algorithms](/01-foundations/06-data-structures-and-algorithms): what you need for coding interviews and for writing code that doesn't fall over at scale.
