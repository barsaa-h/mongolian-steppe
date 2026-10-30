# Brief CH01d round 2 — Rebuild Altan (same worktree, continue)

Your round-1 DNA edits to `artifacts/episode-1-cast/dna/altan.json` are still in this worktree; keep them as the starting point. The rebuild was blocked by `flock: cannot open lock file ... Read-only file system`. The manager's fault: the lock file didn't exist yet. **It exists now** (`/home/barsaa/ms-workers/.blender.lock`), so flock only opens it and needs no write outside the worktree.

Now finish the original brief `docs/agents/workers/briefs/CH01d-altan-fix.md` (read it again):
- Rebuild Altan headless through the lock: `flock /home/barsaa/ms-workers/.blender.lock /home/barsaa/apps/blender-5.2.2-linux-x64/blender -b ...`.
- Regenerate her QA images and `full.png`/`face.png`.
- **Look at them**, and iterate the DNA up to 4 times.
- Make `artifacts/episode-1-cast/altan/qa/altan-before-after.png`. Your `qa/before/` copies are good inputs; delete that folder afterwards, or keep only what the sheet needs.
- Run all checks again: `test_recipes` must pass after the rebuild.

**Clothing:** `male_casualsuit03` is acceptable as a cardigan only if it reads as a little girl's knitted cardigan over a skirt at 3 years old. If it reads as a boy's or man's jacket, try another option and say what you saw. White tights are a nice-to-have; leave them out if the adapter lacks them.

If a Blender run fails, paste the log tail and fix your invocation. Don't stop after the first failure.
