---
title: Python for engineers
level: 0
summary: 'The Python you need for production backends and AI work: types, data classes, errors, packaging with uv, async basics and the idioms reviewers expect.'
outcomes:
- Write typed, readable Python with dataclasses and Pydantic
- Manage projects and dependencies with uv and virtual environments
- Know when async helps and when it silently blocks
keypoints:
- Type hints + `mypy`/`pyright` + `ruff` in CI catch bugs before runtime.
- Validate with Pydantic at trust boundaries (HTTP, config, LLM output). Use dataclasses inside.
- Use one environment per project, managed by `uv`. Commit `pyproject.toml` and `uv.lock`.
- Async helps I/O-bound work only, and a blocking call inside `async def` stalls every request.
- Use `Decimal` or integer cents for money, never floats.
projects:
- name: Expense splitter API
  stack:
  - Python
  - uv
  - FastAPI
  - Pydantic
  - pytest
  - mypy
  build: Groups, expenses in Decimal, "who owes whom" settlement, full type checking and tests for edge cases (rounding, empty groups).
  practises: Typing, validation, Decimal and testing.
- name: Async link checker
  stack:
  - Python
  - httpx.AsyncClient
  - asyncio
  - Typer
  build: Crawl a site's links concurrently with a semaphore, timeouts and a report of broken links, then compare its speed with a sync version.
  practises: When async helps, bounded concurrency, timeouts.
---

## Why this matters

Python is the default language of AI tooling: every model provider ships a Python SDK first, and frameworks like FastAPI, Django, LangGraph and Pydantic are Python. Writing it like a production engineer (typed, tested, packaged) is what separates a backend that survives from a notebook that worked once.

## Core ideas

- **Everything is an object;** variables are names bound to objects. Mutable defaults (`def f(x=[])`) are shared across calls, a classic bug.
- **Type hints** (`def total(items: list[Item]) -> Decimal:`) don't change runtime behaviour, but `mypy` or `pyright` catch whole classes of bugs before they run, and editors become far more helpful.
- **Data modelling:** `@dataclass` for plain internal data; **Pydantic** models when data crosses a boundary (HTTP bodies, config, LLM output) and must be validated.
- **Errors:** exceptions are for exceptional paths. Catch the narrowest type you can handle; never `except: pass`.
- **Context managers** (`with open(...)`, `async with client:`) guarantee cleanup.
- **Generators** (`yield`) produce values lazily, which is how streaming works.
- **The GIL:** in CPython only one thread runs Python bytecode at a time. Threads still help for I/O; CPU-heavy work needs processes (or libraries that release the GIL).

## How to do it

### Project setup with uv

Never install packages into the system Python. Use a per-project environment; [uv](https://docs.astral.sh/uv/) makes it fast:

```bash
uv init myservice && cd myservice
uv add fastapi pydantic httpx          # runtime dependencies
uv add --dev pytest mypy ruff          # dev tools
uv run pytest                          # runs inside the project's environment
uv run --with markdown script.py       # one-off dependency for a script
```

Dependencies and their exact resolved versions live in `pyproject.toml` and `uv.lock`; commit both.

### Validating data at the boundary

```python
from decimal import Decimal
from pydantic import BaseModel, Field

class OrderIn(BaseModel):
    sku: str = Field(min_length=1, max_length=64)
    quantity: int = Field(gt=0, le=1000)
    unit_price: Decimal = Field(gt=0)

order = OrderIn.model_validate_json(request_body)   # raises ValidationError on bad input
```

The same pattern validates LLM output later in the guide ([C1](#c1)): never trust data you didn't produce.

### Async in one paragraph

`async def` functions run on an event loop that switches between tasks whenever one `await`s I/O. This lets one process handle thousands of concurrent network calls, which suits API servers calling databases and model providers. **But** any blocking call inside an async function (a synchronous HTTP client, `time.sleep`, a slow CPU loop) freezes every other request on that loop. Use async libraries (`httpx.AsyncClient`, `asyncpg`) or push blocking work to a thread or worker ([Q42](#q42)).

## Why this way

- **Types + a linter (ruff) + a type checker** cost minutes and save hours of review and debugging; most professional Python codebases now require them in CI.
- **Pydantic at boundaries, dataclasses inside:** validation has a cost; pay it where untrusted data enters.
- **uv over pip + virtualenv by hand:** reproducible, fast, one tool. Teams also use Poetry or pip-tools; the principle (lock files, isolated environments) is what matters.

## Common mistakes

- Mutable default arguments.
- `except Exception: pass`, which hides the bug you'll spend tomorrow looking for.
- Using `float` for money. Use `Decimal` or integer minor units (cents).
- Calling a synchronous SDK inside an `async def` route.
- `pip install` into the system interpreter, breaking OS tools.

## Check yourself

<details markdown="1"><summary>When should you use Pydantic instead of a dataclass?</summary>

When the data crosses a trust boundary and must be validated or parsed: request bodies, config, environment variables, third-party API responses and LLM outputs. Dataclasses are fine for internal data you construct yourself.

</details>

<details markdown="1"><summary>Your FastAPI service handles 5 requests a second fine but stalls at 50. You use `requests` inside `async def` handlers. Why?</summary>

`requests` is blocking: each call freezes the event loop, so requests are effectively processed one at a time. Use `httpx.AsyncClient` (or a sync `def` handler, which FastAPI runs in a thread pool).

</details>

<details markdown="1"><summary>Does the GIL make threads useless?</summary>

No. Threads release the GIL while waiting on I/O, so they help I/O-bound work. They don't speed up CPU-bound Python; use multiprocessing or native libraries for that.

</details>

## Build it

Create a uv project with a Pydantic model for an order, a function that totals a list of orders using `Decimal`, pytest tests for valid and invalid input, and `mypy --strict` passing.

## What comes next

[1.5 JavaScript and TypeScript](/01-foundations/05-javascript-and-typescript): the language of every frontend you'll build.
