---
title: Computers, operating systems and the terminal
level: 0
summary: 'Processes, memory, files, permissions and the shell: what actually happens when your code runs, and how to drive a machine from the command line.'
outcomes:
- Explain processes, threads, memory and the file system in plain words
- Navigate, search and inspect a Linux machine from the terminal
- Read environment variables, exit codes and logs with confidence
keypoints:
- A **process** has its own memory; **threads** share it. Shared memory is fast and risks race conditions.
- Config and secrets reach apps through **environment variables**, never committed files.
- Exit code 0 means success. CI, scripts and orchestrators branch on it.
- 'Core commands: `ps`, `lsof -i :PORT`, `tail -f`, `grep -rn`, `df -h`, `free -h`, `curl -i`.'
- Fix permissions instead of reaching for `sudo` or root.
projects:
- name: Server health script
  stack:
  - Bash
  - systemd timer
  - curl
  build: A script that checks disk, memory, a process and an HTTP health endpoint, and exits non-zero on any failure; run it on a timer and log results.
  practises: Exit codes, process and port inspection, scheduling.
- name: Mini process supervisor
  stack:
  - Python
  - subprocess
  - signal
  build: Start a child process, restart it on crash with backoff, forward SIGTERM for clean shutdown, and log exit codes.
  practises: Processes, signals and what systemd and Docker do for you.
---

## Why this matters

Every server you'll deploy to is a Linux machine you'll mostly reach through a terminal. When something breaks in production (a process dies, a disk fills, a port is taken, a permission is wrong), the fix starts with a few shell commands. Engineers who are comfortable here debug in minutes what others debug in hours.

## Core ideas

- **Process:** a running program with its own memory. Has a PID, a parent, an owner, open files and an exit code.
- **Thread:** a unit of execution inside a process; threads share the process's memory. Shared memory is fast and the source of race conditions.
- **Memory:** the **stack** holds function calls and local variables; the **heap** holds longer-lived objects. Running out of memory gets a process killed (on Linux, by the OOM killer).
- **File system:** everything is a file under `/`: your code, config, logs, even devices. Files have an owner, a group and permissions (`rwx` for owner, group, others).
- **Environment variables:** key/value settings a process inherits from its parent. This is how config and secrets reach your app (`DATABASE_URL`, `OPENAI_API_KEY`).
- **Exit code:** `0` means success; anything else is failure. CI systems, shell scripts and container orchestrators all decide what to do next from it.
- **Standard streams:** `stdin`, `stdout`, `stderr`. Pipes (`|`) connect one program's output to another's input.
- **Ports and sockets:** a server process listens on a port (for example 8000); only one process can bind a given port and address.

## How to do it: the commands you'll actually use

```bash
pwd; ls -la; cd ~/project          # where am I, what's here, go somewhere
cat file; less file; head -n 50 file; tail -f app.log   # read files; follow a log
grep -rn "DATABASE_URL" .          # search text recursively with line numbers
find . -name "*.py" -mtime -1      # files changed in the last day
ps aux | grep uvicorn              # is my server running?
lsof -i :8000                      # what is using port 8000?
kill <pid>; kill -9 <pid>          # ask nicely; then force
df -h; du -sh *                    # disk full? what's big?
free -h; top                       # memory and CPU
env | grep API                     # which variables are set (never print values in shared logs)
chmod 600 .env; chown app:app dir  # permissions and ownership
echo $?                            # exit code of the last command
curl -i http://localhost:8000/health   # talk HTTP from the shell
```

Learn to combine them: `grep ERROR app.log | tail -n 20`, `ps aux | sort -k4 -nr | head` (top memory users).

## Why this way

- **Why Linux?** Most servers, containers and cloud services run it. macOS is close enough (Unix); on Windows, use WSL.
- **Why the terminal when there are GUIs?** It's scriptable, works over SSH on a server with no screen, and is reproducible: a command in a runbook does the same thing every time.
- **Why environment variables for config?** They keep secrets and per-environment settings out of the code (one of the [twelve-factor](https://12factor.net/config) app rules) so the same build runs in dev, staging and production.

## Common mistakes

- Running everything as `root` or with `sudo` "to make it work". Fix the permission instead.
- Committing `.env` files. Add them to `.gitignore` on day one.
- `kill -9` first. It skips cleanup; try a normal `kill` and wait.
- Printing secrets while debugging (`echo $API_KEY`) into a terminal that's being shared or logged.

## Interview follow-ups

- **"A container keeps getting killed with exit code 137."** That's SIGKILL, usually the OOM killer. Check memory limits and usage, look for leaks or unbounded caches, and raise the limit only after understanding the growth.
- **"How do you find what's slowing a server?"** `top`/`htop` for CPU and memory, `iostat` for disk, `ss`/`lsof` for connections, application logs and traces for request-level detail.
- **"Difference between SIGTERM and SIGKILL?"** SIGTERM asks the process to shut down cleanly (it can finish requests); SIGKILL stops it immediately with no cleanup. Orchestrators send TERM, wait, then KILL.

## Check yourself

<details markdown="1"><summary>What's the difference between a process and a thread?</summary>

A process has its own memory space; threads run inside a process and share its memory. Threads are cheaper to create and communicate through shared memory, which also makes race conditions possible. Processes are isolated: a crash in one doesn't corrupt another.

</details>

<details markdown="1"><summary>Your API won't start: "address already in use". What do you do?</summary>

Find what holds the port (`lsof -i :8000` or `ss -ltnp`), decide whether it's a stale copy of your own server or something else, stop it cleanly (`kill <pid>`), or run on a different port.

</details>

<details markdown="1"><summary>Why does CI care about exit codes?</summary>

A non-zero exit code is how a test runner, linter or build tells the pipeline it failed. If a script swallows errors and exits 0, CI goes green on a broken build.

</details>

## Build it

On a Linux machine or WSL: start a simple web server (`python3 -m http.server 8000`), find its PID and port with `ps` and `lsof`, request it with `curl -i`, follow its output, then stop it with `kill`. Write the commands down as a mini runbook.

## What comes next

[1.2 Git and GitHub](/01-foundations/02-git-and-github): the other tool you'll use every day.
