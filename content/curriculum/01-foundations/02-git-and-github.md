---
title: Git and GitHub
level: 0
summary: How git stores history, the branch-and-pull-request workflow teams use, and how to recover from the mistakes everyone makes.
outcomes:
- Explain commits, branches, remotes and merges
- Work in a feature-branch and pull-request flow
- Recover from a bad commit, a conflict or a missing upstream branch
keypoints:
- Commits are snapshots in a graph; branches are movable names; `origin/main` is your last fetched view of the remote.
- 'Daily flow: branch → small commits → push with `-u` → pull request → review → merge.'
- Use `revert` on shared history; save `amend` and `reset` for local-only commits.
- '`[origin/main: gone]` means the remote branch doesn''t exist. Push it with `git push -u origin main`.'
- A committed secret is leaked. Rotate it first, then clean the history.
projects:
- name: Team-flow sandbox repo
  stack:
  - Git
  - GitHub
  - GitHub branch protection
  build: A repo with protected `main`, a PR template, required reviews, and deliberately created merge conflicts that you then resolve.
  practises: The full PR workflow and conflict resolution.
- name: Git bisect detective
  stack:
  - Git
  - Python
  - pytest
  build: Write a 30-commit history where one commit introduces a bug, then find it with `git bisect run pytest`.
  practises: Why small commits matter; automated debugging with history.
---

## Why this matters

Git is how teams change code safely together. Every feature you ship goes through it, every reviewer reads your commits, and interviewers often open your GitHub before the call. Fluency here is assumed from day one.

## Core ideas

- **Commit:** a snapshot of the whole project plus a message, an author and a pointer to its parent. Commits form a history graph.
- **Branch:** a movable name pointing at a commit. `main` is just a branch the team agrees is the source of truth.
- **HEAD:** what you have checked out right now.
- **Working tree → staging area → commit:** you edit files, `git add` stages the changes you want, `git commit` records them.
- **Remote:** another copy of the repository, usually on GitHub, named `origin` by convention. `fetch` downloads, `push` uploads, `pull` = fetch + merge (or rebase).
- **Upstream (tracking) branch:** the remote branch your local branch compares itself with. `git status` uses it to say "ahead 2, behind 1".
- **Merge vs rebase:** merge joins histories with a merge commit; rebase replays your commits on top of another branch for a straight line. Never rebase commits others have already pulled.

## How to do it: the daily flow

```bash
git switch main && git pull                 # start from the latest main
git switch -c feat/add-health-check         # one branch per change
# ...edit...
git status; git diff                        # see what changed
git add -p                                  # stage in reviewed chunks
git commit -m "Add /health endpoint with DB check"
git push -u origin feat/add-health-check    # -u sets the upstream
# open a pull request on GitHub, get review, merge
```

Good commit messages say **why**, in the imperative: "Retry provider calls only on transient errors", not "fixed stuff".

## Recovering from common situations

| Situation | Fix |
|---|---|
| Typo in the last commit message (not pushed) | `git commit --amend` |
| Forgot a file in the last commit (not pushed) | `git add file && git commit --amend --no-edit` |
| Undo a pushed commit | `git revert <sha>` (a new commit that undoes it; safe on shared branches) |
| Throw away local changes to a file | `git restore file` |
| Merge conflict | Open the file, keep the right lines, remove the `<<<<<<<` markers, `git add`, continue |
| `git pull` says the remote ref wasn't fetched / `[origin/main: gone]` | The branch doesn't exist on the remote (empty or recreated repository). Push it: `git push -u origin main` |
| Committed a secret | Rotate the secret **first** (assume it's leaked), then remove it from history; deleting the file in a new commit isn't enough |

## Why this way

- **Feature branches + pull requests** give every change a review, a CI run and a revert point. Trunk-based development (small branches merged daily, often behind feature flags) is the same idea at high speed.
- **Small commits** make review possible and `git bisect` (binary search for the commit that broke something) useful.
- **Revert over reset on shared branches:** rewriting public history breaks everyone else's copy.

## Common mistakes

- One giant commit per day with the message "updates".
- Committing generated files, `node_modules`, `.env`, build output. Use `.gitignore`.
- Force-pushing to `main`. Protect the branch in GitHub settings.
- Not pulling before starting work, then fighting conflicts later.

## Check yourself

<details markdown="1"><summary>What's the difference between `git fetch` and `git pull`?</summary>

`fetch` downloads new commits and updates remote-tracking branches (`origin/main`) without touching your work. `pull` fetches and then merges (or rebases) into your current branch.

</details>

<details markdown="1"><summary>You pushed a bug to main an hour ago and others have pulled. How do you undo it?</summary>

`git revert <sha>` and push. It adds a new commit that undoes the change without rewriting shared history.

</details>

<details markdown="1"><summary>You committed an API key. Is deleting the file and committing again enough?</summary>

No. The key is still in history and may already have been scraped. Rotate the key immediately, then clean history if needed, and add the file to `.gitignore`.

</details>

## Build it

Create a repository, protect `main` on GitHub (require pull requests), make a feature branch, open a PR against yourself, create a deliberate merge conflict between two branches, and resolve it.

## What comes next

[1.3 How the web works](/01-foundations/03-how-the-web-works): what happens between typing a URL and seeing a page, which is where most backend and frontend work lives.
