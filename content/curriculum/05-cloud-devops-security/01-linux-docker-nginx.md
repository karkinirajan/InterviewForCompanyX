---
title: Linux servers, Docker and Nginx
level: 2
summary: Packaging services as containers, writing small secure Dockerfiles, running multi-service stacks with Compose, and putting Nginx in front.
outcomes:
- Write a multi-stage, non-root Dockerfile
- Run an app, database and worker together with Docker Compose
- Configure Nginx as a reverse proxy, including for streaming
keypoints:
- An image is the build; a container is a running instance. Order layers from rarely changed to often changed.
- Use multi-stage builds, run as non-root, add `.dockerignore`, and inject secrets at runtime.
- Compose runs API, DB, Redis and worker together locally.
- Nginx terminates TLS and proxies. Turn off buffering and raise timeouts **only** on streaming routes.
- On a VM, systemd keeps services running and restarts them.
projects:
- name: Production-shaped local stack
  stack:
  - Docker
  - Docker Compose
  - FastAPI
  - Postgres
  - Redis
  - Celery
  - Nginx
  build: One `docker compose up` brings up the API, worker, DB, cache and Nginx with TLS (mkcert) and an SSE route that streams correctly.
  practises: Containers, networking, proxying, streaming.
- name: Single-VM deploy
  stack:
  - Ubuntu
  - systemd
  - Nginx
  - Certbot
  - uv
  build: Deploy a FastAPI app to a small VM with systemd units, Nginx, Let's Encrypt and log rotation, with no Docker, so you see what containers abstract away.
  practises: Linux service management and reverse proxies.
---

## Why this matters

Containers make "works on my machine" work everywhere: CI, staging and production run the same image. Nginx (or a cloud load balancer) sits in front of almost every web service, terminating TLS and routing requests.

## Core ideas

- **Image:** a read-only filesystem snapshot plus a start command. **Container:** a running instance of an image, isolated with its own processes and network.
- **Layers and caching:** each Dockerfile instruction makes a layer; order them so rarely-changing steps (installing dependencies) come before often-changing ones (copying source).
- **Multi-stage builds:** build in a full image, copy only the result into a small runtime image.
- **Docker Compose:** declares several containers (API, Postgres, Redis, worker) and their networks and volumes for local development.
- **Reverse proxy:** receives client requests and forwards them to app servers; handles TLS, compression, static files, timeouts and buffering.
- **systemd:** the Linux service manager that keeps a process running and restarts it if it dies (for non-container deploys on a VM).

## How to do it

```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.12-slim AS build
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY src ./src
RUN uv sync --frozen --no-dev

FROM python:3.12-slim
RUN useradd --create-home app
WORKDIR /app
COPY --from=build --chown=app:app /app /app
USER app
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "myservice.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```nginx
server {
  listen 443 ssl;
  server_name api.example.com;
  client_max_body_size 25m;

  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 120s;
  }
  location /v1/chat/stream {
    proxy_pass http://127.0.0.1:8000;
    proxy_buffering off;              # stream tokens as they arrive
    proxy_read_timeout 300s;
  }
}
```

## Why this way

Small, non-root images reduce attack surface and pull time. Multi-stage builds keep compilers and caches out of production. Turning off proxy buffering only on streaming routes keeps the benefits of buffering elsewhere.

## Common mistakes

- Running containers as root.
- Copying the whole repository (including `.env` and `.git`) into the image; use `.dockerignore`.
- Baking secrets into images; inject them at runtime.
- Default proxy timeouts (often 60 s) cutting off long model responses.

## Check yourself

<details markdown="1"><summary>Why copy the lockfile and install dependencies before copying source code?</summary>

So the dependency layer is cached and only rebuilt when dependencies change; source edits then rebuild only the final, fast layers.

</details>

<details markdown="1"><summary>Your SSE endpoint streams locally but not behind Nginx. What do you change?</summary>

Disable buffering for that location (`proxy_buffering off;` or the app sends `X-Accel-Buffering: no`), raise `proxy_read_timeout`, and make sure compression isn't buffering the stream.

</details>

## Build it

Containerise your FastAPI service with the Dockerfile above and run it with Postgres, Redis and a worker in Docker Compose. Put Nginx in front and stream through it.

## What comes next

[5.2 Cloud fundamentals with AWS](/05-cloud-devops-security/02-cloud-fundamentals-aws).
