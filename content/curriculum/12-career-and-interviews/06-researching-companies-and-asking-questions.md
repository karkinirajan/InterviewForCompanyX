---
title: Researching companies and asking questions
level: 1
summary: Building a verified company brief, finding the pattern in what they ship, connecting it to your work, and asking questions that show judgement.
outcomes:
- Build a one-page verified company brief
- Name the pattern behind a company's products and your parallel
- Ask three questions that lead to a real conversation
keypoints:
- 'One-page brief: verified facts, what they ship, stack and partners, domain constraints, interview format, your parallel.'
- Name the pattern behind their products once, and connect it to your work.
- '"Why us" covers the work, the domain and the growth, each specific.'
- Ask two or three questions that show judgement, and close with "anything to clarify?"
projects:
- name: Company brief generator
  stack:
  - Python
  - a search API
  - an LLM API with citations
  build: Given a company name, collect sources and draft a cited one-page brief that you then verify by hand.
  practises: Research with sources you check.
- name: Question bank for interviewers
  stack:
  - Markdown
  build: Twenty questions to ask companies, grouped by topic (AI platform, evals, team, growth), with what each answer tells you.
  practises: Interviewing the company back.
---

## Why this matters

"Why us?" separates candidates who applied everywhere from candidates who chose. Specific research also lets you connect your projects to their products, which makes the rest of the interview easier.

## The company brief (one page)

1. **Facts:** founded, size, locations, leadership, ownership. Verify from the company's site, filings or reputable press; note sources.
2. **What they ship:** products, case studies, marketplace listings, open-source work, engineering blog posts.
3. **Stack and partnerships:** cloud partner tiers, competencies, frameworks mentioned in job ads.
4. **Domain constraints:** regulated industries (health, finance), compliance regimes.
5. **Interview format:** candidate reports (Glassdoor and similar). Treat them as hints, not facts.
6. **Your parallel:** for each product, which of your projects shares its shape.

## Name the pattern

Most companies' products share a shape. Saying it once shows understanding. Example from a real preparation for an AI consultancy whose products were document and voice intake for healthcare:

> "Your products are document or voice intake, extraction, deterministic validation, routing, and human review for exceptions. That's the shape of what I build."

## "Why us?" in 45 seconds

Three reasons: **the work** (a specific product and how it connects to yours), **the domain** (why its constraints suit how you work), **the growth** (what you want to own long-term and why this place offers it).

## Questions to ask them

Pick two or three; tailor them to what you learned:

1. "For client work, is [their managed AI platform] the default, or does it depend on each client's constraints?"
2. "How are prompt and model changes gated today? Is building that harness part of this role?"
3. "What's the hardest integration problem right now: extraction accuracy, latency, cost, or compliance?"
4. "How do reviewer corrections feed back into evaluation?"
5. "Is there a shared AI platform team, or does each product team integrate directly? Where would this role sit?"
6. "What does success look like at 90 days?"

**Always close with:** "Is there anything in my background you'd like me to clarify?"

Keep salary questions for the HR stage, not the technical round.

## Common mistakes

- Repeating the company's homepage back to them.
- Presenting candidate-report rumours as facts.
- Asking questions answered on their website.

## Check yourself

<details markdown="1"><summary>What makes a "why us" answer convincing?</summary>

Specifics: a named product and how it connects to your work, a domain reason tied to how you work, and a growth reason that this company in particular can satisfy.

</details>

## Build it

Write a one-page brief for a company you'd like to work for, with sources, the pattern sentence, and three tailored questions.

## What comes next

[12.7 Day-of checklist and after](/12-career-and-interviews/07-day-of-and-after).
