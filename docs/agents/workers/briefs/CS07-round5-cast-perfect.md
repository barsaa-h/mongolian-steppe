# CS07 round 5 (DeepSeek, max): perfect Ganaa + Altan, then roll the pipeline out to Tsetsegmaa, Hürel, Dasha

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/CS07`. It holds uncommitted work by the manager (Claude); **never** `git checkout`/`reset`/`stash`/`clean` there and never revert files you did not write. Back up a GLB before overwriting it (`.cache/cs07/<id>-r5-before.glb`).

## Target (user decisions, final)
The EP01 cast must look like **Silent Hill 2 (2001)**: realistic human faces and proportions, low-poly (≈10–12k tris per character, head ≈3.5–4k), detail carried by **one continuous painted head texture with soft baked shadows**, hair cards with a strand texture, clothes whose folds/wear are **in the texture**. Not stylized, not heavy. The user's verdicts: the previous low-poly faces "looked so weird"; round 4 (current state) fixed most of it — the bodies are "okay".

## The pipeline (already working — learn it before changing it)
One command per character, ~90 s: `bash tools/build_cast.sh ganaa|altan [--rebake|--remesh]`
1. `--remesh`: `scripts/l4d_export.py --stage mesh` (MPFB full-res actor → decimated low mesh; symmetric head decimation; mouth cavity split off before decimation and re-welded after; ONE continuous cylindrical head UV wrap in rect `face` = (0,.2,.5,1); cavity faces in rect `cavity` = (.905,.105,.99,.185)), then `--stage bake` (CPU diffuse + normal, writes `uvhead.json`).
2. `--rebake`: `.cache/cs07/bake_emit.py` (Cycles EMIT selected→active; modes `body` = skin only with MakeHuman cavity faces deleted, `cards` = brows/lashes) and `.cache/cs07/bake_ao.py` (AO on the low mesh + hair, cavity hidden).
3. `tools/compose_atlas.py <cache> <skin_hex> <weather>` → `diffuse-ao.png` + cleaned `normal.png` (hole fill, red-ring/speck removal, AO, EYEFIX iris repair, teeth dimming, cavity colour).
4. `--stage assemble` → `assets/cast/l4d/<id>.glb`.
5. `tools/glb_patch.py` (real MakeHuman hair texture, tinted with `tools/hair_tex.py`; specs in `tools/specs/<id>.json`).
6. `tools/hair_fix.py` (ear cut-out of the hair cap, cap UV re-projection onto strands, bob shrink, scalp paint, `--renormal`, `--cavity-dark`).
Blender: always `bash .cache/cs07/run_blender.sh ...` (own lock, safe_run, timeout). Never the Blender MCP.
Review: `VIEWS=front,tq,profile,body SIZE=420 node tools/review/fc.mjs <out.png> tex <glb>...` (three.js on the GPU, same as the episode). Look at every image you make. View only PNG/JPEG.

## Part A — perfect Ganaa and Altan (do this first)
Fix, each verified on a before/after sheet:
1. **Clothes look flat** (Ganaa's dark jacket and jeans, Altan's red dress): bake folds into the texture — use the high-res clothes normal/AO (Cycles AO/normal from `HIGH.Clothes.*` selected→active onto the low clothes rects `cloth.top` (.76,.69,.992,.984) / `cloth.bottom` (.76,.43,.992,.68)), add seams, wear at cuffs/elbows/hem, slight dirt. Ganaa is a 1998 long-haul KAMAZ driver (worn padded work jacket, sweater, trousers, boots). Altan is 3 (party dress, tights, felt boots). SH2 James's jacket is the quality bar: strong painted folds and shading.
2. **Hands paler than the arms** (visible on `artifacts/review/2026-11-03/53-cast-r4-bodies.jpg`): match hand/forearm tone across the wrist seam (the `body` rect is a CPU flat fill; the hands come from the emit bake).
3. **Lip line flecks** on Ganaa close-ups (tiny light specks in the hairline lip gap) and the small orange speck on top of Ganaa's hair.
4. **Ears** read blocky/flat-lit in 3/4 and profile: improve (decimation protection or texture shading).
5. Then a final close look: anything else that reads wrong at close-up — fix it or list it.
Do **not** change face shapes/DNA (the user hasn't asked) unless something is clearly broken.

## Part B — roll out to Tsetsegmaa, Hürel, Dasha (in that order)
Their full-res actors are in `artifacts/episode-1-cast/<id>/` (Character-Master.blend, dna.json). Generalise `tools/build_cast.sh` (it has Ganaa/Altan-specific numbers: skin hex, `--ear` z-coordinates, hair choice) — derive per-character values from the mesh/DNA instead of hard-coding where you can, and add a case per character. Use the character's own MakeHuman hair (tint from DNA). Story facts: Tsetsegmaa is Altan's mother; Hürel runs the roadside café; Dasha is infected later (his damaged arm is assumed the right) — build them in their **normal** state. For each: front/tq/profile/body sheet; fix what reads wrong.

## Deliver
- GLBs in `assets/cast/l4d/` (+ `.json`), sheets in `artifacts/character-master/qa/cs07/round5/`: `ganaa-altan-before-after.png`, `bodies.png`, `cloth-closeup.png`, `<id>-sheet.png` per new character, `lineup.png` (all five at the same scale, full body).
- `artifacts/character-master/qa/cs07/round5/report.md`: what you changed (files, functions), per-character tri counts, what still looks wrong (honest).
