# E08 round 4 (DeepSeek, high): the leftover weak EP01 panels

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/E08` (your earlier work is there, uncommitted: keep it; never checkout/reset/stash/clean). Read the Round 3 section of `episodes/EP01/threejs/out/panels/REVIEW.md` first. Tools: `tools/panel-stills.mjs` (`--swiftshader --beat=Bxx`), `tools/panel-check.mjs`, `tools/panels-lint.mjs`, `tools/panel-overview.py`.

## Manager review of round 3
Accepted: B07 faces, B17 bite inserts, B19 cab variety, B22 P15, B25 P09.
**B20 sign was NOT fixed** (your report said it read correctly; it still read mirrored on P01/P02/P15). The manager fixed it: `addBackFaces` in `src/sets/loadSet.js` now places a plain copy toward the viewer (registry `offset: -0.125`); the plane is double-sided and the road saw its back. Do not touch it. Lesson: when a fix is about text or direction, crop and enlarge the still and actually read it before claiming it.

## Style rules (unchanged, do not break)
SH2-style living panels: one composed frame per panel, motivated light, fog, darkness. Dialogue = faces; backs only for deliberate staging. Story facts are law: bite on Ganaa's **left wrist**; kitchen door opens **inward**, **no lock**; infected only push/slam doors; no traffic lights in Naran 1998; no pharmacy scene. Do not change line ids, durations or the continuity contract.

## Fix list (your round-3 leftovers), in priority order
1. **B17 P25 face_in_mirror** — dark back-of-head. No mirror geometry exists: either stage it as Ganaa's face in the truck's side mirror/dark cab glass (a small reflective plane or a second camera rendered into a texture in the panel player), or re-block as a clear 3/4 close on his face lit by the dash. It must read as his face.
2. **B17 P16 left_hand_on_handle** — a back at the door; make it an insert on his **left** hand on the handle.
3. **B03 P08 / P10** — the boy's back / coughing coal from behind: re-block to faces. Tame the kiosk seller profile hotspot (bulb) without killing the practical look.
4. **B10 P07 / P09** — Altan is below the tabletop: give him a seat/stool or kneeling-on-chair height in the panel (actor offset/anchor), so his face reads; P07 less table-heavy.
5. **B19 P08** — "his face in the glass": a real reflection read (dark glass with his faint face) if feasible with the same technique as #1, else a stronger profile against the window.
6. Anything else on `EP01-all.jpg` that is a back where a face should be, or a near-black panel with no read.

## Verify
Re-render every beat you touch, crop and look at every changed still, run `panel-check.mjs` + `panels-lint.mjs` (must pass), rebuild `out/panels/EP01-all.jpg`. Append a "Round 4" section to `REVIEW.md` with before/after per panel and honest remaining issues. View only PNG/JPEG images. No Blender, no commits.
