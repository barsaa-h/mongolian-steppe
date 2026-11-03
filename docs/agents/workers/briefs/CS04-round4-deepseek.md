# CS04 round 4 (DeepSeek): eyes less doll-like, more individual

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/CS04` (round 16 delivered; read `artifacts/stylized-cast-qa/cs04/report.md`). Continue numbering (rounds 17+, new `_v###` blends).

## Manager review (three.js render, same as the episode renderer)
Good: the face now belongs to the head (one skin, no mask edge), brows and mouths read, no beard residue. Keep all of that.

Wrong:
1. **The eyes are doll/cartoon eyes.** Every actor has the same big round brown iris with a fully visible circle, wide open. It makes adults look young and generic, and it is not Mongolian. Fix:
   - iris smaller (about 35–40 % of the eye width), and the **upper lid covers the top ~25–30 % of the iris** (no full circle visible except in `fear`);
   - opening narrower and longer: an almond with a flatter upper lid, the outer corner slightly higher than the inner, a visible single lid / epicanthic fold;
   - pupil a little smaller; one small catchlight only;
   - darker, near-black-brown iris for most; let the iris almost merge with the lash line at the top.
2. **Tsetsegmaa's outer eyelash "flicks"** read as drawn lines on the skin. Remove them; just a soft darker lash line.
3. **Tsetsegmaa's hairline:** a dark smudge band under the fringe. Make it a soft, thin shadow under the fringe edge only.
4. **Individuality:** set different eye shapes per actor in `faceArt`: Ganaa (tired, heavier lids, slight bags), Hürel (narrow, hard), Tsetsegmaa (soft almond), Dulmaa (hooded, older, droop), Irina (European: double lid, rounder but still not a doll, lighter iris), Altan (child: bigger relative to the face is fine, but still almond). Ganaa should keep a faint shadow of stubble (very subtle, not the old beard).
5. Do not change skin, mouths or brows beyond what the above needs.

## Review tool
Render in three.js with the same tool the manager uses: `VIEWS=front,tq,profile SIZE=380 node .cache/cs04/facecheck.mjs <out.png> tex assets/cast/ganaa.glb ...` (if its browser can't launch inside your sandbox, use your Eevee portrait script and say so). Also include an `eyes` view (`VIEWS=eyes`) close-up.

## Deliverables
- Fixes in `scripts/ps2_face.py`, `scripts/build-cast.py` (face code only) and `assets/cast/roster.json` (`faceArt` only).
- Rebuild ganaa, hurel, tsetsegmaa, dulmaa, irina, altan. Use `CAST_SKIP_REPORT=1` as before.
- `npm test` must pass; morph deltas ≤ 1 cm; hands, finger rig and children's clothes untouched.
- `artifacts/stylized-cast-qa/cs04/`: `round4-faces.png` (front/tq/profile, all six), `round4-eyes.png` (eye close-ups), `round4-vs-round3.png`, and an updated `report.md`.
- At least 3 render → look → fix rounds; look at every image.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with changes, test output, evidence paths, and what still looks wrong.
