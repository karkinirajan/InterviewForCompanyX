---
title: 'Deployment platforms: Vercel, Railway, VMs and containers'
level: 2
summary: Choosing where to run each part of a product, from managed platforms to your own VM, and the configuration mistakes that break deploys.
outcomes:
- Pick a hosting option per component and justify it
- Configure environments, secrets and build settings correctly
- Diagnose a failed deploy from its build log
keypoints:
- 'Match the platform to the workload: Vercel for Next.js, container platforms for APIs, VMs for heavy media/GPU work.'
- Configure the build command, output directory, runtime version and framework preset deliberately.
- Keep separate env vars per environment, and never point previews at the production DB.
- A green build doesn't mean a correct deploy. Read failed deploy logs bottom-up to the first error.
- Long AI requests don't belong in short serverless limits. Stream them or queue them.
projects:
- name: Split deploy
  stack:
  - Vercel
  - Railway or Fly.io
  - Next.js
  - FastAPI
  - Neon Postgres
  build: Frontend on Vercel, API on a container platform, a managed DB, preview environments per PR with their own DB branch.
  practises: Multi-platform config, env management, previews.
- name: Deploy-failure museum
  stack:
  - Vercel
  - GitHub Actions
  - Markdown
  build: Deliberately reproduce five common deploy failures (wrong output dir, missing env var, version mismatch, timeout, CORS) and document each fix.
  practises: Reading build logs and platform configuration.
---

## Why this matters

Most products mix platforms: a Next.js frontend on Vercel, a Python API on a container platform or VM, a managed database. Picking well saves weeks of operations work; picking badly creates surprise bills or timeouts on long AI requests.

## Options compared

| Option | Good for | Watch for |
|---|---|---|
| Vercel | Next.js and frontend; serverless and Node/Python functions; previews per PR | Function duration and body-size limits; framework detection |
| Railway / Render / Fly.io | Containers and simple backends with little ops | Pricing at scale; regions |
| AWS ECS/Fargate, Cloud Run | Production containers with autoscaling | More configuration |
| A VM (EC2) with Nginx + systemd | Full control, long-running or heavy jobs (FFmpeg, GPUs) | You own patching, scaling, monitoring |
| Kubernetes | Many services, platform teams | Operational complexity; rarely needed early |

A real example from the casebook ([P1](#p1)): Next.js studio on Vercel; FastAPI + FFmpeg on an EC2 instance behind Nginx and systemd; a private encrypted S3 bucket with a least-privilege role. Heavy media processing doesn't fit serverless limits, so it runs on a VM.

## How to do it: deploy checklist

1. **Build settings:** framework preset, build command, output directory, runtime version.
2. **Environment variables** per environment (preview, staging, production); secrets never in the repo.
3. **Health check** endpoint that verifies dependencies.
4. **Domains and TLS.**
5. **Rollback path:** previous deployment one click away.
6. **Logs and alerts** wired before launch, not after.

## Reading a failed deploy

Read the build log from the bottom up, then find the first error. A real example: a Next.js static export built successfully, but the platform failed afterwards with *"No Output Directory named 'public' found"*. The build was fine; the project was configured with the "Other" framework preset, which expects `public/`, while `output: "export"` writes `out/`. Fix: set the framework to Next.js (in project settings or `vercel.json` `"framework": "nextjs"`), or set the output directory to `out`. The lesson: **a green build step doesn't mean a correct platform configuration.**

## Common mistakes

- Different Node or Python versions locally and in the build.
- Long AI requests on serverless functions with short time limits; move them to background jobs or streaming.
- Preview deployments wired to the production database.

## Check yourself

<details markdown="1"><summary>Where would you deploy a Next.js frontend, a FastAPI AI gateway, and a video rendering worker?</summary>

Frontend on Vercel (or similar); the gateway on a container platform with autoscaling and long timeouts for streaming; the renderer on VMs or container tasks with enough CPU/memory and no short time limits, fed by a queue.

</details>

<details markdown="1"><summary>The build succeeds but the deploy fails with "no output directory". What do you check?</summary>

The platform's framework preset and output-directory setting versus what the build actually writes (for example `out/` for a Next.js static export).

</details>

## Build it

Deploy your Next.js frontend and FastAPI backend to two platforms, with separate preview and production environment variables and a health check.

## What comes next

[5.4 Observability](/05-cloud-devops-security/04-observability).
