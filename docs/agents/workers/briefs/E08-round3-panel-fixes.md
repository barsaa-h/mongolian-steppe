# E08 round 3 (DeepSeek, high): fix the weakest EP01 living panels

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/E08` (your own earlier integration work is there, uncommitted: keep it; never checkout/reset/stash/clean). Your round-2 review is `out/panels/REVIEW.md` (inspect it first). Panels: `episodes/EP01/threejs/panels/B01–B26.json`; tools `tools/panel-stills.mjs` (`--swiftshader`), `tools/panel-check.mjs`, `tools/panels-lint.mjs`, `tools/panel-overview.py`. Sets: `src/sets/loadSet.js` + registry.

## Style rules (do not break)
Silent Hill 2-style "living panels": one composed frame per panel, motivated light, fog, darkness. Dialogue = faces: the speaker's face (or a clear 3/4) must read; backs only for deliberate staging. Story facts are law: the bite is on Ganaa's **left wrist**; the kitchen door opens **inward** with **no lock**; infected only push/slam doors; no traffic lights in Naran 1998; no pharmacy scene. Do not change line ids, durations or the continuity contract.

## Fix list (from your review), in priority order
1. **B07** — nearly every panel is behind Ganaa/Irina. Re-block cameras so the dialogue reads as faces (two-shot 3/4, alternating singles, one wide). Keep their positions logical.
2. **B17 P17/P18** — the left-wrist bite must be legible: a close insert on Ganaa's **left** wrist/forearm with Dasha's head at it, plus a reaction close. Make it read in one glance at 960×540.
3. **B20** — hospital sign reads mirrored from the road side: fix the sign node (rotation/scale sign or UV flip) at load time in `loadSet.js` or the set config, so the Cyrillic reads correctly; light the truck-side dialogue panels P07/P09/P10 (practical/headlight, not a flat fill).
4. **B19** — every cab single uses the windshield view: add variety (driver-side window profile, passenger POV, dash-level low angle, rear-cab looking forward) while keeping the night-cab light logic. Fix the P07 sheep-throat insert (it rendered as a white blob: exposure/material).
5. **B22 P15_he_follows** (wall close-up) and **B25 P09_no_lock** (blurry latch macro): recompose as clean, readable inserts.
6. Second tier if time: B03 bus/kiosk singles, B10/B23 back-of-head frames, B24 P09 dark doorway, B16 dark right-side attack coverage.

## Verify
Re-render every beat you touch (`panel-stills.mjs --swiftshader --beat Bxx`), look at every still you change, run `panel-check.mjs` + `panels-lint.mjs` (must pass), rebuild `out/panels/EP01-all.jpg`. Append a "Round 3" section to `out/panels/REVIEW.md` with before/after per fixed panel and honest remaining issues. View only PNG/JPEG images.
