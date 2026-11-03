# I01 (DeepSeek): integrate everyone's work, then render the whole episode as stills

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E08` (yours: registry/loadSet/exporter, panel player, B01/B02/B11/B15, day rigs, FX in the player). Other workers built the rest in their own worktrees (read-only for you). Bring it all into **this** worktree so one tree can play the whole episode.

## Bring in (copy; for files both sides changed, merge by hand, keeping both features)
From `~/ms-workers/E09`:
- `episodes/EP01/threejs/panels/B01–B26.json`, `BREAKDOWN.md`, `tools/panels-lint.mjs` (the full 384-panel breakdown, continuity-corrected).
- `episodes/EP01/continuity/**`, `tools/continuity-lint.mjs`, `tests/continuity.test.mjs`.
- `episodes/EP01/subs/**`, `tools/subs.mjs`, `subs-check.mjs`, `edit.mjs` (+ its tests), `episodes/EP01/graphics/**`, `tools/graphics-check.mjs` (+ test), `episodes/EP01/recording/**`, `tools/vo-check.mjs` (+ test).
- `audio/**` (kit, mix.json, gen) — not the `out/` renders.
- `episodes/EP01/lipsync/**`, `tools/lipsync*.mjs`, `src/stylized/lipsync.js` and **its changes to `src/stylized/actor.js`, `cues.js`, `layers.js`** (merge with your own `holdClip`/arm-rest changes there; both must work).
- `src/fx/**`: you already copied the kit; take any newer version.
From `~/ms-workers/E10/assets/props/hero/glb/*` → `assets/props/hero/glb/` (the full props kit).
From `~/ms-workers/E06/assets/maps/episode-1/glb/EP01_Apartment_ps2.glb`: **only if** E06 isn't mid-run (check its newest file time < 10 min ago → skip and say so); the apartment's new anchors/state switch need registry updates.

## Reconcile
- **B01, B02, B11, B15**: you have rendered, fixed versions; the breakdown has the line ids/durations the subtitles and continuity rely on. Keep your staging/cameras, but make the line ids, order and per-beat durations match the breakdown (and its continuity fixes); `panels-lint`, `continuity-lint` and `panel-check` must all pass on them.
- **All other beats**: map the breakdown's `prop:<name>` placeholders to real GLBs in `assets/props/hero/glb/`; map their FX notes to the schema's `fx` entries you added (steam, breath, snow…); use the day/afternoon rigs you made (the continuity lint's 9 day-on-night warnings should go to 0); every location/anchor/cam must exist in the registry (fix with `pos`/`target` where missing and list them).
- Cast: use the current `assets/cast/*.glb` for every role id in the panels; for ids with no GLB here, copy them from `~/ms-workers/CS04/assets/cast/` (the 33-actor rollout) or map to the closest existing actor and list it. **The cast is going to be replaced** by a new, better cast later, so don't polish faces; the panel data must reference role ids, not specific meshes.

## Then render
`tools/panel-stills.mjs` for **all 26 beats** (one still per panel at mid-time) → `out/panels/<BEAT>/contact.jpg` and one overview `out/panels/EP01-all.jpg` (small thumbnails, beat headers). Look at every contact sheet; fix the worst problems (cameras in walls, actors floating/sinking, black frames, T-poses, missing props) in at least 2 rounds; list what remains per beat in `out/panels/REVIEW.md`.
Also run `edit.mjs` for B01–B03 using the rendered stills as held frames (no motion yet) with the sound kit, subs and title card → `out/master/stills_B01-B03.mp4` (ffprobe + ebur128 numbers).

## Rules
- Write only in this worktree (anything under `episodes/EP01/**`, `audio/**`, `assets/props/hero/**`, `assets/cast/*.glb` copies, set GLB copies, `tests/**`, `out/**`). Never write into other worktrees. No commits. Don't touch `AGENTS.md`. No Blender unless a set must be re-exported. View only PNG/JPEG images.
- Everything must pass: `npm test`, `stylized_check.mjs`, `panel-check.mjs`, `set-check.mjs`, `panels-lint.mjs`, `continuity-lint.mjs`, `subs-check.mjs`, `graphics-check.mjs`.
- Final `## Report:` with what you merged (and how conflicts were resolved), all check outputs, evidence, per-beat problem list.
