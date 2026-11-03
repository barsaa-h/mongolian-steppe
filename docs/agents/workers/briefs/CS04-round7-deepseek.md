# CS04 round 7 (DeepSeek): Altan's hair, eyes and neck

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/CS04` (round 6 delivered). Continue numbering. **Only Altan changes this round.** Don't touch the adults.

## Manager review of round 6
Better: rosy round cheeks, a button-nose hint, a small soft mouth, the toddler body. Irina/Dulmaa hairlines are fine now.

Fix (Altan only):
1. **Her hair is an adult bob with two pointed side flaps** that stick out beside the cheeks like blades, so her face looks inset between two panels. Give her a **child's haircut**: a rounded short bob (or two small pigtails) that follows the skull, ends around the jaw/ear line, with **no pointed corners**. You may build/reshape a child hair mesh in the child branch. Soft fringe, a bit of forehead visible.
2. **Eyes are big black orbs** (very dark iris filling the opening, almost no white). Keep them a bit large and round for a child, but: a **warm dark-brown** iris with a visible lighter lower rim, a black pupil, one small catchlight, and **some eye white visible at both sides**. The upper lid still covers the very top of the iris. Eyes not drooping.
3. **The face texture is blurry** compared with the adults (smeared nose/mouth zone). Paint her features at the same crispness as the adults (painted at 4–8× and box-filtered, like your adult path), keeping them soft.
4. **Neck:** in the full body she has a thin, long neck. A 3-year-old's neck is short and relatively thick: shorten and thicken it; head sits close to round shoulders.
5. Chin: soften the one pointed jaw vertex in 3/4.

## Deliverables
- Fixes in `scripts/ps2_face.py`, `scripts/build-cast.py` (child branch only), `assets/cast/roster.json` (altan `faceArt`/child shape only; height stays 0.95).
- Rebuild altan (`CAST_SKIP_REPORT=1`). `npm test` must pass; morph deltas ≤ 1 cm; clothes still fit with no intersections in idle/walk.
- `artifacts/stylized-cast-qa/cs04/round7-altan.png` (close-up front/3/4/profile + full body front/3/4, your `facewide.mjs` is fine), `round7-altan-vs-round6.png`, `round7-altan-vs-tsetsegmaa.png`, updated `report.md`.
- At least 3 render → look → fix rounds; look at every image.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with changes, test output, evidence paths, and what still looks wrong.
