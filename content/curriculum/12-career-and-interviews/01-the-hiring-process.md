---
title: The hiring process, decoded
level: 1
summary: Typical interview stages, how to map a job description to your evidence, screening questions, and the consistency checks that sink candidates.
outcomes:
- Map every responsibility in a job description to proof from your work
- Prepare for each stage of a typical process
- Make your CV, profiles and repositories consistent before anyone checks
keypoints:
- 'Typical stages: recruiter, screening questions, coding, technical deep-dive, system design, behavioural, reference check, offer.'
- Map **every JD responsibility to proof** (a project or story) and the likely questions.
- Run the consistency audit (dates, education, numbers, repos, public claims) before applying.
- Correct errors proactively. A small awkwardness early beats a failed reference check.
projects:
- name: Application tracker with JD mapper
  stack:
  - Next.js
  - Postgres
  - an LLM API
  - zod
  build: Track applications; paste a JD to extract responsibilities and map them to your project list, highlighting gaps.
  practises: JD decoding and evidence mapping.
- name: Consistency checker
  stack:
  - Python
  - BeautifulSoup
  - a YAML "source of truth"
  build: Keep your dates, titles and numbers in one YAML file and check your portfolio site, README and CV text against it for mismatches.
  practises: Automating the consistency audit.
---

## Why this matters

Interviews follow your documents. Interviewers read your CV line by line, open your GitHub before the call, and companies often run reference checks. The dangerous questions are frequently not technical; they're about **inconsistencies between your own documents**.

## Typical stages

| Stage | What's tested | Prepare |
|---|---|---|
| Recruiter screen | Motivation, logistics, rough fit | 60-second intro; notice period; salary range researched |
| Screening form or questionnaire | Concrete experience claims | Answers you can defend live (they often get re-asked) |
| Coding round | Algorithms or practical coding | [Coding protocol](/01-foundations/06-data-structures-and-algorithms); [code kit](/14-reference/04-code-kit) |
| Technical deep-dive with the team | Your projects, design, reliability | Casebook dossiers; Q&A bank; design drills |
| System design | Architecture and trade-offs | [Part 6](/06-system-design) |
| Behavioural / culture | Collaboration, ownership, values | [Story bank](/12-career-and-interviews/03-story-bank) |
| Reference check, offer | Consistency, honesty | Make sure everything matches |

Candidate reports for consultancies often describe: phone call on experience → coding round → technical round with the team you'd join → HR and offer, with a reference check before the offer. Questions tend to follow whatever is on your CV.

## Map the job description to your evidence

Build a table before every interview:

| JD responsibility | Your proof (project, story) | Likely questions |
|---|---|---|
| Integrate LLM APIs | [P1](#p1), [P2](#p2), [P5](#p5) | [Q11](#q11), [Q18](#q18) |
| RAG | [P3](#p3), [P4](#p4) | [Q1](#q1)–[Q10](#q10) |
| Agents | [P8](#p8), [P9](#p9) | [Q31](#q31)–[Q35](#q35) |
| Prompts and evals | [P1](#p1), [P3](#p3) | [Q20](#q20)–[Q24](#q24) |
| Guardrails | [P1](#p1), [P2](#p2), [P5](#p5) | [Q25](#q25)–[Q30](#q30) |
| Monitoring | [P3](#p3) | [Q36](#q36)–[Q38](#q38) |
| Frontend collaboration | [P1](#p1), [P6](#p6) | [Q43](#q43) |
| SDLC ownership | [P1](#p1) | [D4](#d4) |

Gaps in the table are what you prepare honestly ("I haven't shipped on X; here's how I'd learn it and the patterns I already use").

The full project-by-requirement grid is the evidence matrix [X1](#x1).

## Common screening questions

Years of experience (applied vs training); production LLM integration (which APIs, for what); architecture, reliability and what broke; a RAG pipeline you built and your role; one sentence on LLM reliability; cloud platforms; prompt quality and consistency; cost and latency factors; a challenge integrating AI; notice period. Each needs an answer that links to a story or dossier.

## The consistency audit (do this before applying)

- **Dates and titles** identical across CV, LinkedIn, portfolio site and freelancing profiles.
- **Education** stated exactly as it is (a degree with an end date reads as completed).
- **One number** for things like project count, used everywhere.
- **Every metric** defensible: baseline, method, mechanism, your share ([12.5](/12-career-and-interviews/05-technical-interview-playbook)).
- **Repositories** you pin are ones you can explain line by line; credit upstream work.
- **Public claims** (e.g. compliance on a product site) are true.
- **Status** of each project stated honestly, including what was never run live.

If you find an error after applying, correct it proactively, either with a short email and an updated CV or at the start of the CV walkthrough. A small awkwardness early beats a large one at reference check.

## Check yourself

<details markdown="1"><summary>Why are document inconsistencies more dangerous than a hard technical question?</summary>

A weak technical answer costs points; an inconsistency raises doubts about honesty, which can end a process at reference or background check regardless of skill.

</details>

## Build it

Take a job description you'd apply for and build the JD → proof → questions table. Then run the consistency audit on your own documents.

## What comes next

[12.2 Your narrative](/12-career-and-interviews/02-your-narrative).
