# E02 round 2 (Codex): finish the café set

Continue in this worktree. First re-read the original brief, `docs/agents/workers/briefs/E02-cafe-ps2-set.md`; its goal, contents and rules all still apply. Your last report (`assets/maps/episode-1/previews/cafe-ps2/report.md`) says the v003 build, the checks and **all preview renders** didn't run because you were waiting on the Blender lock.

## What changed
- **You now have your own Blender lock** (`.cache/e02/run_blender.sh` uses `~/ms-workers/.blender-e02.lock`), so nobody else blocks you. If you ever see `WAITING_FOR_BLENDER_LOCK`, **wait**: the wrapper waits up to 25 minutes on its own. Never cancel a queued run because of the lock.
- Run Blender commands **in the foreground and wait for them to finish** (a build can take a few minutes). Don't "interrupt" a running build.

## Do, in order
1. Run the corrected builder → `EP01-Map_v003.blend`, and export `glb/EP01_Cafe_ps2.glb` with **only the café scene**, `Closest`/nearest filtering, no mipmaps, ≤ 25k tris, ≤ 12 textures.
2. Run `check_cafe.py` until every check passes (fix the geometry, not the check, unless the check is wrong; say which).
3. Render the five previews (exterior wide, forecourt from the road, counter, card table, rear door) at ≤ 960×540 with dim, moody night light. **Open each image and judge it.** It must read as a cold 1998 Mongolian roadside café at night: chunky low-poly shapes, small pixel textures, grime, nothing that looks clean or modern.
4. Fix what looks wrong and render again: **at least 3 build → render → look → fix rounds**, saving `v004`, `v005`… as needed (never overwrite a version). Keep the previews of each round (`r1-*.png`, `r2-*.png`, …) so the manager can see the progress.
5. Update `report.md`: the check output, tris/textures, what each round fixed, and what still looks weak.

Failures are yours to debug, not reasons to stop. **Use your full budget**; stopping after one build is not done.
