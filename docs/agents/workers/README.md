# Worker agents: Claude manages, Grok (later Codex) builds

The user's setup (29 Oct 2026): **Claude is the manager.** Claude turns a plan task (E01, A06, …) into a detailed brief, sends it to a worker CLI, reviews the result, and merges only what passes. Codex is paused while its usage quota is low; **Grok is the active worker.**

## Running a job
```sh
scripts/grok-worker.sh <TASK-ID> docs/agents/workers/briefs/<brief>.md [light|standard|heavy]
```
- Creates a git worktree `~/ms-workers/<TASK-ID>` on branch `worker/<TASK-ID>`, made from `main`.
- Runs `grok -p` inside it under `--sandbox workspace`, so the worker can only write to its own worktree and temp folders. The Blender and ElevenLabs MCP servers are switched off, and git commit/add/push/checkout/reset are denied.
- Shared rules: [WORKER_RULES.md](WORKER_RULES.md), passed with `--rules`. The worker ends with a fixed-format report.
- Logs go to `.worker-runs/<TASK-ID>/` (ignored by git): the brief copy, the JSON result with cost, and stderr.

| Profile | For | Model / effort / turns |
| --- | --- | --- |
| light | docs, audits, research, checks | grok-4.7 · medium · 40 |
| standard | code, Blender Python, single-set builds | grok-4.7 · high · 120 |
| heavy | hard multi-file or cross-department problems | grok-4.7 · xhigh · 200 |

- The context window stays at 256k (the default). Briefs list the files to read, so the worker doesn't need 500k.
- `grok-4.7-build-fast` costs twice as much, so it isn't used.
- Subagents are off to keep cost predictable.

## The manager's review checklist
1. Read the report, then `git -C ~/ms-workers/<id> diff --stat` and the diff itself.
2. Re-run the brief's checks myself (`npm test`, the set's `check_map.py`, etc.). Never trust "passed" without running it.
3. Look at the renders/evidence images.
4. Check the story rules: left wrist, inward door, protected lines, no traffic lights.
5. Pass: commit on `worker/<id>` and merge into `main`. Fail: send a follow-up brief into the same worktree with specific fixes.
6. Afterwards: `git worktree remove ~/ms-workers/<id>` and delete the branch.

Blender jobs run one at a time (14 GB RAM).
