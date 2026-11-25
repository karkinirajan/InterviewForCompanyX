---
title: How LLMs work (for engineers)
level: 3
summary: Tokens, context windows, next-token prediction, sampling, reasoning models, multimodality and embeddings, at the depth an integrator needs.
outcomes:
- Explain tokens, context windows and sampling parameters
- Predict how prompt and output length affect cost and latency
- Explain what reasoning ("thinking") models change
keypoints:
- Models read and write **tokens**. Price, limits and latency are all counted in tokens.
- Prefill (the prompt) is parallel; decode (the answer) is sequential. Output length dominates latency.
- '`temperature=0` reduces variance; it doesn''t guarantee identical output.'
- Training knowledge is frozen and fallible. Context knowledge is current and citable, which is why RAG works.
- Put the important material at the start and end of a long context. Reasoning models trade tokens for accuracy.
projects:
- name: Token and latency explorer
  stack:
  - Python
  - provider token-counting APIs
  - matplotlib
  build: Measure token counts across languages and TTFT vs total latency across output lengths, and plot the results.
  practises: Building an intuition for tokens, cost and latency.
- name: Lost-in-the-middle experiment
  stack:
  - Python
  - an LLM API
  - pandas
  build: Hide one fact at different positions in a long context, measure recall by position, and write up the findings.
  practises: How context placement affects answers.
---

## Why this matters

You don't need to train a transformer to integrate one, but you need a correct mental model. It explains why outputs vary, why long prompts cost more, why the middle of a long context gets ignored, and why "temperature 0" doesn't make things deterministic.

## Core ideas

- **Tokens:** models read and write tokens, chunks of text (roughly ¾ of an English word on average, often more tokens per word for other languages and scripts). Pricing, limits and latency are all in tokens.
- **Next-token prediction:** the model predicts a probability distribution over the next token, picks one, appends it, and repeats. Output is generated one token at a time, which is why streaming works and why long outputs are slow.
- **Context window:** the maximum tokens of input + output the model can handle in one call. Everything the model "knows" about your request must be in it.
- **Prefill vs decode:** reading the prompt (prefill) is parallel and relatively fast; generating output (decode) is sequential. **Time to first token** depends mostly on prompt size, network and any retrieval; total time mostly on output length ([Q38](#q38)).
- **Sampling:** `temperature` scales randomness; `top_p` limits choices to the most likely tokens. Low temperature reduces variance but doesn't guarantee identical outputs.
- **Training knowledge vs context knowledge:** facts learned in training are fixed at a cutoff and can be wrong; facts you put in the context can be current and cited. That's the case for RAG.
- **Lost in the middle:** models attend best to the beginning and end of long contexts; put the most important material there.
- **Reasoning ("thinking") models:** spend extra tokens reasoning before answering. Better on hard multi-step problems; more cost and latency; thinking tokens may count against output limits ([Q19](#q19)).
- **Multimodal models:** accept images, audio or video as input; some generate them.
- **Embeddings:** a different kind of model output: a vector representing meaning, used for search and clustering ([8.1](/08-rag/01-embeddings-and-vector-search)).

## How it affects your code

| Fact | Engineering consequence |
|---|---|
| Output is sampled | Validate every reply; test with thresholds over many runs |
| Billing is per token | Budget prompts; trim context after re-ranking; cap `max_tokens` |
| Decode is sequential | Stream; keep outputs short; ask for structured, compact answers |
| Knowledge has a cutoff | Supply facts via context; don't trust recall for anything current |
| Context is finite | Choose what goes in; summarise or retrieve rather than stuff |
| Providers update models | Pin versions; re-run evals on change |

## Common mistakes

- Assuming `temperature=0` gives reproducible output.
- Dumping entire documents into the context "because it fits".
- Counting characters instead of tokens for limits.

## Interview follow-ups

- **"Why do models hallucinate?"** They generate plausible continuations, not verified facts; missing or ambiguous context makes plausible-but-wrong likely. Contain it with grounding, constrained outputs and verification ([Q10](#q10)).
- **"How would you handle a document longer than the context window?"** Retrieve the relevant parts (RAG), summarise hierarchically (map-reduce), or process in chunks with a final merge step.
- **"What do reasoning models change in your design?"** More latency and tokens, so use them for hard tasks only, cap the thinking budget, size output limits with headroom and stream status ([Q19](#q19)).

## Check yourself

<details markdown="1"><summary>Why does a long answer take much longer than a long question?</summary>

The prompt is processed in parallel (prefill); the answer is generated one token at a time (decode). Output length dominates total latency.

</details>

<details markdown="1"><summary>Does `temperature=0` make outputs deterministic?</summary>

No. It makes sampling greedy, which reduces variance, but infrastructure details (batching, hardware numerics, model updates) can still change outputs. Design for variation anyway.

</details>

<details markdown="1"><summary>What can go wrong when a reasoning model's thinking tokens count against the output limit?</summary>

A high thinking level can use up the output budget, returning a paid but incomplete reply. Set thinking per task, size the limit with headroom, and treat "incomplete" as a failure ([Q19](#q19)).

</details>

## Build it

Use a tokenizer tool for your provider to count tokens for the same paragraph in English and another language you speak. Then time a short and a long completion and compare time to first token with total time.

## What comes next

[7.3 Calling model APIs](/07-llm-foundations/03-calling-model-apis).
