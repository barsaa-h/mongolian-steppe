# CS04 round 5 (DeepSeek): remove the stepped bands; make Altan a real 3-year-old

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/CS04` (round 4 delivered; read `artifacts/stylized-cast-qa/cs04/report.md`). Continue numbering (new rounds, new `_v###` blends). **User decision: Altan's height is 0.95 m** (already set in `roster.json`; keep it).

## Manager review of round 4 (three.js)
Good: the eyes are no longer dolls: lids cover the iris top, shapes differ per actor. Ganaa and Hürel read well. Keep the eyes.

Wrong:
1. **Stepped horizontal bands across the face.** On Tsetsegmaa, Dulmaa, Irina and Altan there are hard, ladder-like light/dark bands across the eyes, the nose bridge and the cheeks (pixel stair-steps, very visible in front and 3/4). The nose reads as a stack of bars glued on. Find the source (likely the restored chunky source-atlas shading, a hard-edged nose highlight/shadow mask, or a reshape mismatch with the UV) and fix it: features and shading must be smooth gradients at 512² with nearest filtering. No new hard horizontal edges in the face except the lash line, brow and lip seam.
2. **Nose:** a soft shadow on one side of the bridge, a small tip highlight, soft nostrils. No outlined bars.
3. **Hairline on Dulmaa/Irina:** the grey haze and pale V wedge at the parting: make it a soft, thin shadow under the hair edge, skin-coloured elsewhere.
4. **Altan must look 3, not like a small woman.**
   - Face: rounder and shorter (forehead larger, lower face smaller), full cheeks, small button nose, small soft mouth, eyes set lower on the face and relatively larger (still almond, Mongolian), no adult contouring, no lip colour, short soft brows. Rosy cheeks (cold).
   - Proportions in `child_body`/the toddler mapping: at 0.95 m a 3-year-old's head is about 1/4.5 of the height (head height ≈ 0.20–0.21 m), shorter legs (crotch at about 0.40 of height), short neck, round belly, no waist, short arms (fingertips at mid-thigh). Hands child-sized. Keep the child clothes (A-line dress, tights, flat boots) fitting with no intersections in idle/walk.
   - Verify the result next to Tsetsegmaa (1.55 m class) in a body render: she should come to about Tsetsegmaa's hip/waist.
5. Don't change Ganaa's or Hürel's eyes; only fix bands on them if present.

## Review tool
`VIEWS=front,tq,profile SIZE=380 node .cache/cs04/facecheck.mjs <out.png> tex <glbs…>` and for bodies `VIEWS=body,bodytq`. Note: `body` frames each GLB to its own height, so for the size comparison make your own side-by-side (e.g. Eevee with both actors in one scene).

## Deliverables
- Fixes in `scripts/ps2_face.py`, `scripts/build-cast.py` (face + child body code only) and `assets/cast/roster.json` (`faceArt`/child shape only; height stays 0.95).
- Rebuild ganaa, hurel, tsetsegmaa, dulmaa, irina, altan with `CAST_SKIP_REPORT=1`.
- `npm test` must pass; morph deltas ≤ 1 cm; hands/finger rig untouched (except child hand scale if needed: say so).
- `artifacts/stylized-cast-qa/cs04/`: `round5-faces.png`, `round5-vs-round4.png`, `round5-altan-vs-tsetsegmaa.png` (same scene, same scale, front + 3/4), updated `report.md`.
- At least 3 render → look → fix rounds; look at every image.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with changes, test output, evidence paths, and what still looks wrong.
