# CS05 round 2 (DeepSeek): the men all look like brothers; nobody is dressed for November

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your cast rollout in `~/ms-workers/CS04` (read `artifacts/stylized-cast-qa/cs05/report.md`). Principals (ganaa, hurel, tsetsegmaa, dulmaa, irina, altan) stay **bit-identical**: gate every change behind per-actor flags and prove it again.

## Manager review of round 1 (33 actors built, tests pass, good women/kids variety)
1. **Every man has the same face.** Same skull, the base mesh's moustache shelf (a dark wedge on every upper lip), the same small dot eyes, the same brow. Sükhee, yard-runner, Togoo, livestock-driver, cafe-driver, coal-driver, hospital-guard read as one person with different hair. Fix at the **geometry** level, per actor:
   - a per-actor `cleanLip` flag that flattens the modelled moustache shelf into a normal upper lip (geometry + paint), so clean-shaven men are clean-shaven; real moustaches/stubble only where chosen (paint);
   - per-actor head/face shape controls in `reshape_face` (gated, default = current): face width, jaw width/squareness, chin length, cheekbone height/width, brow-ridge depth, nose length/width/bridge height, lip fullness, eye spacing, head length; use them widely (±15–25 %);
   - eye variety for men: opening size, lid weight (heavy/hooded/open), tilt, iris colour (Russians: grey/blue/hazel), a few with bags/crow's feet; brows thick/thin/straight/arched/grey.
2. **The Russians don't look Russian.** yard-guard, yard-runner, yard-loader, customs-officer (and Dasha, who's fine): narrower faces, longer and higher-bridged noses, deeper-set eyes with a **double lid**, lighter/pinker skin, light hair where suitable. They must read as Russian next to the Mongolian men.
3. **Wardrobe ignores the season.** EP01 is November; outdoor roles must wear **padded winter coats / Soviet work jackets (ватник), sheepskin or padded deels, hats** (ushanka, knitted caps, fur hats), felt boots or work boots: yard-guard (uniform coat + ushanka), yard-runner (work jacket with a damp, open collar: script fact), yard-loader (ватник, knitted cap), customs-officer (uniform greatcoat + uniform hat), livestock-driver (padded deel + fur hat), cafe-driver, coal-driver (work jackets), hospital-guard (uniform coat), the town ensemble (coats, hats, scarves). Indoor roles (party guests, Nyamka in her shop, the cousin) keep indoor clothes; give party guests some 1998 party touches (cardigans, a deel, a pressed shirt). The yard-guard's current green blobby hat must go.
4. Re-check lookalikes: produce a **men-only face grid** (front + 3/4) and a **Russians vs Mongolians** grid; no two men may read as the same person at medium-shot size. Fix the pairs you listed (party-guest-02 vs 05, 04 vs 07).

## Deliverables
- Code in `scripts/build-cast.py`/`ps2_face.py` (gated), roster updates, rebuilt GLBs (`CAST_SKIP_REPORT=1`).
- `artifacts/stylized-cast-qa/cs05/round2-men.png`, `round2-russians-vs-mongolians.png`, `round2-crowd-lineup.png` (full body, same scale), `round2-principals-unchanged.png`, updated `report.md`.
- `npm test` passes; morph deltas ≤ 1 cm; clothes skin to the rig with no intersections in idle/walk.
- At least 3 render → look → fix rounds; look at every image.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with changes, test output, evidence paths, and what still looks wrong.
