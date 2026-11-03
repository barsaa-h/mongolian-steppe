# CS04 round 6 (DeepSeek): Altan's face, Irina's hairline

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/CS04` (round 5 delivered; read `artifacts/stylized-cast-qa/cs04/report.md`). Continue numbering. Altan's height stays 0.95 m (user decision).

## Manager review of round 5 (three.js)
Very good: the stepped bands are gone; Ganaa, Hürel, Tsetsegmaa and Dulmaa now look like the same people with readable, soft faces. **Don't change the adults' faces** except Irina's hairline below. Altan's body proportions are now a real toddler (big head, short legs, crown at Tsetsegmaa's waist). Keep that.

Fix:
1. **Altan's face reads odd, not cute/childlike.** At front/3/4: the eyes are spread far apart and very wide/droopy, there's almost no nose, the mouth is a thin line, the lower face is wide and flat, and in Eevee there's a **red smear at the mouth/chin**. Make a 3-year-old Mongolian girl:
   - eyes closer together (about one eye-width apart), slightly larger and rounder than the adults' but still almond with the single lid; the outer corners not drooping;
   - a small, soft **button nose** with a visible tip highlight and soft nostril shadows;
   - a small, full mouth (short width, a soft pink lower lip, no outline), no red smear;
   - full round cheeks with cold-rosy colour, a soft round chin (not pointed in 3/4), a bigger forehead (raise or thin the modelled fringe if needed; you may reshape the child hair mesh);
   - check the face mesh: if the adult head mesh makes the lower face too wide/flat, reshape it in the child branch (rounder cheeks, shorter lower face, softer jaw).
2. **Altan's neck and shoulders:** the head sits directly on stiff, padded-looking shoulder points. Give her a short visible neck and soft round shoulders (dress sleeves rounded, no shoulder-pad corners).
3. **Irina and Dulmaa's hairline:** pass the recolour's hair mask into `clean_face` (your own idea from round 5) so the hair edge is a soft, slightly irregular transition, not a 1-texel staircase; no pale forehead wedge.

## Review
Three.js: `VIEWS=front,tq,profile SIZE=380 node .cache/cs04/facecheck.mjs <out.png> tex assets/cast/altan.glb ...`, and your same-scale Eevee Altan vs Tsetsegmaa scene. Look at Altan at close-up and at full body; she must read as an ordinary, sweet 3-year-old at both.

## Deliverables
- Fixes in `scripts/ps2_face.py`, `scripts/build-cast.py` (face/child code only), `assets/cast/roster.json` (`faceArt`/child shape only).
- Rebuild altan, irina, dulmaa (and the others only if shared code changed: then rebuild all six and confirm the adults didn't change visibly). `CAST_SKIP_REPORT=1`.
- `npm test` must pass; morph deltas ≤ 1 cm; hands/finger rig untouched.
- `artifacts/stylized-cast-qa/cs04/`: `round6-altan.png` (close-up front/3/4/profile + full body front/3/4), `round6-altan-vs-tsetsegmaa.png`, `round6-irina-dulmaa.png`, updated `report.md`.
- At least 3 render → look → fix rounds; look at every image.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with changes, test output, evidence paths, and what still looks wrong.
