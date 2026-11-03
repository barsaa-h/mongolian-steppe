# E16 round 2 (DeepSeek): fix the cab cinematography (B11) and the yard bursts (B01)

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E08` (panel player, B01/B11 rendered in round 1; contacts `out/panels/B01/contact.jpg`, `out/panels/B11/contact.jpg`). The cast is being rebuilt elsewhere: don't polish faces, but posing/framing/lighting are yours.

## Manager review
**Everywhere: arms.** The yard guard (B01 P02–P05) and others stand with both arms straight out sideways/forward (T-pose-like). Any actor not doing a gesture must stand with **arms relaxed down** (slight elbow bend, hands near the thighs), weight on one leg. Find why the rest pose leaks (missing idle clip on this GLB? A-pose bind with no clip applied? a gesture not cleared?) and fix it in the controller/player with a test: in every panel, each hand of a non-gesturing actor must be below the hip line and within 25 cm of the thigh. Add that to `panel-check`.

**B11 (KAMAZ cab, afternoon) doesn't work:**
- Cameras are inside geometry or at odd top-down angles (P05, P06, P07, P08, P15); walls/seat backs fill frames; Dasha is seen from behind with a hand on her head (P01, P03, P10, P12).
- Restage like a real car scene: **driver-side and passenger-side singles through the windscreen from outside** (classic car-interior coverage: camera on the bonnet looking in, slightly off-axis), a **two-shot from the dashboard** looking back at both, a **POV insert** of the enamel bowl in Ganaa's hand with steam, Dasha's hands taking it, her drinking (face visible, 3/4), handing it back, Ganaa noticing the stain and turning the bowl to the clean side (insert), the photo behind the sun visor (insert), the wing mirror (insert). Hide geometry that blocks a camera only if it's a removable cab part (e.g. the near door panel for a cutaway), never by moving cameras inside walls.
- Light: afternoon daylight through the windscreen (bright exterior, faces lit by soft window light, a little bounce), not the brown haze in round 1.
- The bowl must read in every insert: right size (13 cm), enamel white with the blue rim, steam via your FX kit.
- Dasha (Russian, 24, damaged arm per the script) faces camera in at least 4 panels.

**B01 (freight yard):**
- The burst inserts (P07 flashlight on gravel, P09 empty gravel, P16 flashlight dying) sit on a flat **blown-out white** patch: frame them on dark textured gravel/snow between rails, the flashlight beam raking across the ground, the light the only bright thing.
- P05: the flashlight beam disc on the wagon door is a hard flat circle: make it a soft falloff spot.
- P12/P13 (Irina in the dispatch office, B01's end): she stands; she should sit at her desk (like your B02 work) and the frame should be less orange/blown.

## Rules
- Write only in this worktree's `episodes/EP01/threejs/src/{panel,stylized,fx,sets}/**`, `panels/**`, `tools/**`, `out/**`. No commits. Don't touch `AGENTS.md` or the cast GLBs.
- `npm test`, `stylized_check.mjs`, `panel-check.mjs`, `set-check.mjs` pass; determinism kept.
- At least 3 render → look → fix rounds; look at every frame.
- Final `## Report:` with files, commands + output, evidence (both contact sheets), what still looks wrong.
