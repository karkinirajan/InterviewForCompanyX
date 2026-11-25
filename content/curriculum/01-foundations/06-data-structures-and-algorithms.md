---
title: Data structures and algorithms that matter
level: 1
summary: Big-O, the handful of data structures that solve most problems, the recurring interview patterns, and a protocol for live coding rounds.
outcomes:
- Estimate time and space complexity of your code
- Pick the right structure for lookup, ordering and queues
- Run a coding interview in a calm, structured way
keypoints:
- Know Big-O for time **and** space. A set or dict lookup is O(1), a list scan O(n).
- Eight patterns cover most problems. Hash map, two pointers, sliding window, stack, heap, BFS/DFS, intervals, binary search.
- Top-k means a heap. Rank fusion means a hash map of scores. These show up in AI work too.
- 'Round protocol: restate → brute force → pattern → code → walk an example and edge cases → complexity.'
- Think out loud. Silence is the most common avoidable failure.
projects:
- name: Pattern drill repo
  stack:
  - Python
  - pytest
  - GitHub Actions
  build: One solved problem per pattern with tests and a comment on complexity, all running in CI.
  practises: The eight patterns and writing tested solutions fast.
- name: Top-k search engine toy
  stack:
  - Python
  - heapq
  - collections.Counter
  build: Index a folder of text files and return the top-k documents for a query by term frequency, using a heap.
  practises: Hash maps and heaps in a realistic setting; a preview of retrieval.
---

## Why this matters

Two reasons. At work, the wrong data structure turns a 50 ms endpoint into a 5 s one when data grows. In hiring, many companies (including AI consultancies) still run an algorithm-style coding round, and candidates with strong project experience fail it for lack of practice.

## Core ideas

**Big-O** describes how cost grows with input size *n*: O(1) constant, O(log n) halving, O(n) one pass, O(n log n) sorting, O(n²) nested loops over the same data. Interviewers want both time and space.

| Structure | Good at | Python | TypeScript |
|---|---|---|---|
| Array / list | Index access O(1), append O(1) amortised | `list` | `Array` |
| Hash map | Lookup/insert by key O(1) average | `dict` | `Map` / object |
| Hash set | Membership O(1) average | `set` | `Set` |
| Stack | Last-in first-out | `list.append/pop` | `push/pop` |
| Queue / deque | First-in first-out | `collections.deque` | array with care, or a deque |
| Heap | Repeatedly take the smallest/largest O(log n) | `heapq` | custom or library |
| Tree / graph | Hierarchies and relationships | dicts of lists | `Map<string, string[]>` |

## The patterns that cover most interview problems

| Pattern | Signal in the problem | Example |
|---|---|---|
| Hash map | "Find pairs", "count", "seen before" | Two-sum, anagram groups |
| Two pointers | Sorted array, pairs, palindromes | Remove duplicates in place |
| Sliding window | "Longest/shortest contiguous subarray with…" | Longest substring without repeats |
| Stack | Matching brackets, "next greater" | Valid parentheses |
| Heap | "Top k", "k-th largest", merging sorted lists | Top-k frequent words |
| BFS / DFS | Grids, graphs, trees, shortest path in unweighted graph | Number of islands |
| Intervals | Overlaps, scheduling | Merge intervals |
| Binary search | Sorted data, or "smallest value that satisfies…" | Search in rotated array |

The same ideas show up in AI work: **top-k with a heap** is how retrieval picks candidates, and **rank fusion** ([C2](#c2)) is a hash map of scores.

## How to do it: the coding-round protocol

1. **Restate** the problem and confirm one example out loud.
2. **State the brute force** and its complexity in one sentence. This proves you understand the problem before optimising.
3. **Name the pattern** (from the table) and why it fits.
4. **Write typed, readable code**; name variables for the reader.
5. **Walk one example through your code by hand,** then an edge case: empty input, one element, duplicates, negatives.
6. **Give final time and space complexity.**

Think out loud the whole time. Silence is the most common way to fail a round you could have passed.

## Why this way

Interviewers grade communication and process as much as the final code. A clear brute force plus a correct optimisation, explained, beats a silent perfect answer that took the full hour.

## Common mistakes

- Jumping into code before agreeing on the example.
- Optimising before having anything that works.
- Forgetting edge cases (empty list, a single element).
- Using `list.pop(0)` (O(n)) as a queue in Python; use `deque.popleft()`.

## Interview follow-ups

- **"Can you do better than O(n log n)?"** Ask whether the input has structure: bounded values (counting sort), only top-k needed (heap, O(n log k)), or already sorted (two pointers).
- **"What if the data doesn't fit in memory?"** Stream it, use external sorting or chunked processing, or approximate structures (count-min sketch, HyperLogLog).
- **"How would you test your solution?"** Example cases, edge cases (empty, one, duplicates, negatives, very large), and a brute-force reference for randomised comparison.

## Check yourself

<details markdown="1"><summary>What's the time complexity of checking `x in my_list` versus `x in my_set` in Python?</summary>

O(n) for a list (scans every element), O(1) on average for a set (hash lookup).

</details>

<details markdown="1"><summary>"Return the 10 most frequent words in a large text." Approach and complexity?</summary>

Count with a hash map (O(n)), then use a heap of size k to keep the top 10 (O(m log k) for m distinct words), or sort the counts (O(m log m)). Mention `collections.Counter.most_common` in Python.

</details>

## Build it

Solve one problem from each pattern row (eight total), timed at 30 minutes each, speaking the protocol out loud. Record one session and listen to it.

## What comes next

Part 2: [The software delivery lifecycle](/02-software-lifecycle), how teams turn requirements into running software.
