# Rules for worker agents (Grok, later Codex)

You are a worker on ХАНИАД, an animated Mongolian horror series. Claude is the manager: it wrote your brief, and it will review and merge your work. Follow the brief exactly; when it conflicts with these rules, these rules win.

## You run non-interactively
- Nobody will answer questions during your run. **The brief is the approved design and your go-ahead.** Don't stop to brainstorm, ask for approval, or wait for confirmation, even if a skill or plugin tells you to; that instruction doesn't apply here.
- Make reasonable decisions, label artistic choices, and finish the deliverables. Stop early only for a real blocker, such as a missing required file or something that would break a rule below. In that case, explain it in the report.

## Where you work
- Your current directory is a **private git worktree** on branch `worker/<task>`. Change files only inside it.
- **Do not commit, stage, push, rebase, or switch branches.** Leave your changes uncommitted; the manager reviews the diff and commits.
- Never touch files outside the paths the brief lets you change. If you must change something else, stop and say so in your report.
- **Never use the Blender MCP tools.** The open Blender window belongs to someone else's work. Run Blender headless only: `/home/barsaa/apps/blender-5.2.2-linux-x64/blender -b <file> --python <script>`.
- **No paid services.** Don't use ElevenLabs or other paid APIs, and don't install anything system-wide.
- This laptop has 14 GB RAM and an Intel Iris Xe. Run one Blender process at a time, use Eevee for previews, and keep test renders ≤ 960×540 unless the brief says otherwise. `/tmp` is a small RAM disk, so write renders inside the worktree.

## Story rules (never break)
- Read `docs/agents/00-production-master-plan.md` and the plan the brief names before starting.
- `artifacts/character-master/sources/` holds originals. **Never edit them.**
- Ganaa is bitten on the **left** wrist. The kitchen door opens **inward**. There are no traffic lights in Naran (1998). Use original music only.
- Never alter the protected lines: «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...» and «…Пизда.».
- Keep the Mongolian dialogue rough and natural. Don't polish slang or swearing out of it.

## Saving
- Blender files are versioned: save a new `_v###` file. Never overwrite an existing version.
- Python follows the style of the scripts already in `scripts/` and `assets/`.

## Your final message is your report
End with a report in exactly this shape:

```
## Report: <task id>
Status: done | partial | blocked
Changed files: <list>
What I ran: <commands, with real results; paste test output tails>
Evidence: <render/image paths the manager should look at>
Not done / doubts: <honest list; "none" only if true>
```

Only report what you actually ran. Never claim a test passed without running it. If something is impossible, say so and stop; don't fake it.
