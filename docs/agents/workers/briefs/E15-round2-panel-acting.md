# E15 round 2 (DeepSeek): panels that read as acting, not posing

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your panel player in `~/ms-workers/E08` (`src/panel/player.js`, `panels/B02.json`, `panels/B15.json`, tools). Continue; keep everything deterministic.

## Housekeeping first
- The manager set Altan's height to **0.95 m** in `assets/cast/roster.json` (user decision), so `tests/cast-pose.test.mjs` should pass now; re-run `npm test`.
- The newer cast GLBs now have `smile`/`frown` morphs. Update `tools/stylized_check.mjs` so it no longer asserts they're missing (assert they're used when present instead). Both checks must pass.

## Manager review of round 1 (good start: deterministic, sets + actors + practicals work; B02's insert shots of the phone, dial, envelope, clasp and spools read well)
Fix:
1. **B15 arms are stiff and stretched**: Ganaa and Hürel hold both arms straight out onto the counter like a T-pose. Real counter acting: Ganaa leans on **one** forearm/elbow on the counter or rests both hands near the edge, shoulders relaxed, slight weight shift; Hürel stands behind, one hand on a cloth wiping, the other relaxed or on the counter edge, then pushes a plate across with one hand. Use the controller's gestures/hand poses (`grip_cup`, `relaxed`, …); if the 0.72 m counter makes reaches impossible, move the actors closer to the counter edges (their bellies ~10 cm from the edge) rather than stretching arms. No hyper-extended elbows (check: elbow angle ≥ 15° bend in every panel; add it to `panel-check`).
2. **Eye-lines:** in dialogue panels the speakers look at each other (`lookAt` the other's head), the listener reacts (small nod/blink), the speaker uses `say` with the line duration.
3. **Obstructions:** B15 P02/P03/P06 have a dark box (coffee urn/back-bar block) covering part of the frame or the face. Reframe so faces are clear: use classic over-the-shoulder singles (the listener's shoulder soft in the foreground, the speaker's face in the light, rule-of-thirds), a clean two-shot from the end of the counter.
4. **B02:** Irina's face is barely seen (P02 from behind/top, P03 profile against the wall). Add one clear **medium close-up of Irina's face** lit by the desk lamp as she listens to the dispatcher (B02-02) and again when she says «Уже утро…» (B02-03), with the handset at her ear and the cord visible. Keep the inserts.
5. **Lighting:** keep the two fill lights you added but make them subtler; faces should be lit mainly by the motivated practical (desk lamp; café bulbs), with dark backgrounds. The café walls' busy tile/stone pattern competes with faces: let the background fall off darker (fog/vignette or less fill on walls).
6. Make every panel alive: tiny breathing/blink/saccades are in the controller; confirm by rendering each panel at its start and end time and checking they differ only subtly (add a `--pair` option writing start/end strips).

## Deliverables
Updated panels, player, checks; `out/panels/B02/contact.jpg`, `out/panels/B15/contact.jpg`, start/end strips for 3 panels; `npm test`, `stylized_check`, `panel-check` all pass.

## Rules
- Write only `episodes/EP01/threejs/src/panel/**`, `panels/**`, `tools/panel-*.mjs`, `tools/stylized_check.mjs`, `out/panels/**`, small fixes in `src/stylized/**` (with tests). No Blender, never the Blender MCP. No commits. Don't touch `AGENTS.md` or the cast GLBs/roster.
- At least 3 render → look → fix rounds; look at every sheet.
- Final `## Report:` with files, commands + output, evidence, and what still looks wrong.
