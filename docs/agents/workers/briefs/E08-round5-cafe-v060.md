# E08 round 5 (DeepSeek, high): bring the new café (v060) into the café beats, with a runtime fire FX layer

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/E08` (your earlier work is there, uncommitted: keep it; never checkout/reset/stash/clean). Do not edit anything in `~/ms-workers/E02` (read-only source). Tools: `tools/panel-stills.mjs` (`--swiftshader --beat=Bxx`), `panel-check.mjs`, `panels-lint.mjs`, `panel-overview.py`. No Blender, no commits.

## Source
The environment worker finished café round 8 in `~/ms-workers/E02`:
- GLB: `assets/maps/episode-1/glb/EP01_Cafe_ps2_v060.glb`
- Contract (states, anchors, cameras, FX node names, KAMAZ attach transform): `assets/maps/episode-1/previews/cafe-ps2/states.md` (read Round 7 + Round 8 sections) and `report.md`.
- Reference look (Blender renders): `assets/maps/episode-1/previews/cafe-ps2/r22-contact-*.jpg` and `r22-*.png`.
States: `late_afternoon`, `dusk`, `after_attack`, `after_crash`. The KAMAZ is NOT in the set GLB; it attaches at anchors (intact / disabled with a 3.5°/2.0° crash tilt). KAMAZ GLBs: `~/ms-workers/P03/assets/props/kamaz/glb/` (copy into E08 `assets/props/kamaz/glb/`).

## Tasks
1. Copy v060 into E08 as `assets/maps/episode-1/glb/EP01_Cafe_ps2.glb` (back up the old one as `EP01_Cafe_ps2.r20.glb`), and update the café entry in `src/sets/registry.json`: state toggles (show/hide the `STATE.*` collections per panel `state`), new anchors/cameras, GLB lights, fog per time. Keep every existing panel's location/anchor id working (map renamed anchors).
2. **Runtime fire/smoke FX** in the panel player (`src/panel/`): glTF drops the FX emission gradients/alpha, so replace the tagged `FX.*` placeholder meshes at load with three.js FX: layered additive flame sprites (yellow-white core → orange → dark red, flicker/scale noise driven by panel time), ember particles rising, a dark smoke column of soft alpha sprites lit warm at the base, and a flickering orange point light. Deterministic per frame (seeded) so stills/video are stable. Cheap: it must run on a laptop iGPU.
3. Attach the KAMAZ per state (intact at the parking gap; disabled + tilt at the guard in `after_crash`).
4. Re-render B15–B18 (and any other panel set in the café/forecourt) and fix what the new set breaks: blocked cameras, actors inside the new pass-through/walls, wrong state per beat. Story: B15–B17 café attack at dusk (after_attack once the attack happens), crash/fire = `after_crash` where the script has it. Story facts are law (bite = Ganaa's **left** wrist; infected only push/slam doors).
5. Verify: `panel-check.mjs` + `panels-lint.mjs` pass; rebuild `EP01-all.jpg`; append "Round 5" to `out/panels/REVIEW.md` with before/after per changed panel. Look at every still you change (crop and enlarge for small details). View only PNG/JPEG.
