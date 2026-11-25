---
title: Relational databases and SQL
level: 1
summary: Modelling data in Postgres, writing correct SQL, indexing for real queries, transactions and isolation, and reading query plans.
outcomes:
- Model entities with keys, constraints and relations
- Add the right index for a slow query using EXPLAIN ANALYZE
- Use transactions correctly and avoid race conditions
keypoints:
- Put invariants in the database with constraints (NOT NULL, UNIQUE, CHECK, FKs).
- Make the index match the query, e.g. `(tenant_id, created_at DESC)` for "this tenant's latest".
- Read `EXPLAIN ANALYZE`. A Seq Scan on a selective filter means a missing index.
- Prevent races with atomic conditional updates, `SELECT … FOR UPDATE`, or unique constraints.
- Use `timestamptz`, store money as integer cents or `numeric`, and never rename a column in one step.
projects:
- name: Inventory service with no overselling
  stack:
  - Postgres
  - FastAPI
  - asyncpg
  - locust
  build: A stock and orders schema with constraints; hammer "buy the last item" with concurrent requests and prove nothing oversells.
  practises: Transactions, locking, atomic updates.
- name: Query tuning lab
  stack:
  - Postgres in Docker
  - pgbench
  - generate_series
  build: Load 5M rows, write five slow realistic queries, then fix each with the right index, recording EXPLAIN ANALYZE before and after.
  practises: Indexing and reading query plans.
---

## Why this matters

The database outlives every service written against it. Bad data models cause bugs no amount of application code can fix, and missing indexes are the most common cause of slow endpoints. For AI work, Postgres also becomes your vector store ([8.4](/08-rag/04-vector-stores-and-pgvector)).

## Core ideas

- **Tables, rows, columns;** a **primary key** identifies a row; a **foreign key** references another table's key.
- **Constraints** (`NOT NULL`, `UNIQUE`, `CHECK`, foreign keys) make invalid data impossible. Put rules in the database when they must always hold.
- **Normalisation:** store each fact once. Denormalise deliberately, for read speed, with a plan to keep copies in sync.
- **Index:** a sorted structure (B-tree by default) that makes lookups fast and writes slightly slower.
- **Transaction:** a group of statements that commit together or not at all (ACID).
- **Isolation levels:** Postgres defaults to *read committed*; *repeatable read* and *serializable* prevent more anomalies at more cost.

## How to do it

```sql
CREATE TABLE customers (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status      text NOT NULL CHECK (status IN ('open','paid','cancelled')),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_customer_created ON orders (customer_id, created_at DESC);
```

The index matches the query it serves: "this customer's latest orders".

```sql
EXPLAIN ANALYZE
SELECT id, total_cents FROM orders
WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
```

Read the plan: a `Seq Scan` on a large table for a selective filter means a missing index; compare estimated and actual rows to spot stale statistics.

### Avoiding race conditions

Two requests buy the last item at once. Options:

- An atomic update with a condition: `UPDATE stock SET qty = qty - 1 WHERE sku = $1 AND qty > 0` and check the row count.
- `SELECT ... FOR UPDATE` inside a transaction to lock the row.
- A unique constraint so the second insert fails, and handle the error.

## Why this way

Constraints catch bugs from every code path, including scripts and future services. Composite indexes ordered like your `WHERE` and `ORDER BY` let Postgres read just the rows it needs. Atomic conditional updates avoid locks entirely when they fit.

## Common mistakes

- Indexing every column "just in case" (slower writes, wasted memory).
- Storing money as floats.
- `timestamp` without time zone; use `timestamptz`.
- Read-then-write logic in application code without a transaction or lock.
- Running migrations that rewrite large tables during peak traffic ([2.5](/02-software-lifecycle/05-ci-cd-and-releases)).

## Interview follow-ups

- **"Your index isn't being used. Why?"** Possible causes: a function on the column (`lower(email)` needs an expression index), a type mismatch, low selectivity (the planner prefers a scan), stale statistics (`ANALYZE`), or a column order that doesn't match the filter.
- **"Explain isolation levels briefly."** Read committed (Postgres default) sees committed data per statement; repeatable read sees one snapshot per transaction; serializable makes concurrent transactions behave as if run one by one, at the cost of retries on conflicts.
- **"How do you add a NOT NULL column to a 100M-row table?"** Add it nullable (or with a constant default, which is cheap in modern Postgres), backfill in batches, add a `CHECK … NOT VALID` then `VALIDATE`, then set NOT NULL, avoiding a long lock.
- **"SQL or NoSQL?"** Default to Postgres for relational data and transactions; choose a document or key-value store for a specific access pattern or scale need, not by fashion.

## Check yourself

<details markdown="1"><summary>An endpoint filters by `tenant_id` and sorts by `created_at`. Which index?</summary>

A composite index on `(tenant_id, created_at DESC)`, matching the filter then the sort, so Postgres reads rows in order and stops at the limit.

</details>

<details markdown="1"><summary>How do you stop two concurrent requests from overselling stock?</summary>

Use an atomic conditional update (`... WHERE qty > 0`) and check the affected row count, or lock the row with `SELECT ... FOR UPDATE` in a transaction.

</details>

## Build it

Create the schema above in a local Postgres (Docker), insert 1M orders with `generate_series`, time the customer query with and without the index using `EXPLAIN ANALYZE`.

## What comes next

[3.4 Authentication and authorization](/03-backend/04-authentication-and-authorization).
