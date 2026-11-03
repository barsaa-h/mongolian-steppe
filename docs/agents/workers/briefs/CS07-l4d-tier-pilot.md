# CS07 (DeepSeek, max): a better cast base: Left 4 Dead / Silent Hill 2-tier pilot (Ganaa + Altan)

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/CS07` (fresh from `main`). Read `AGENTS.md`, `artifacts/character-master/DNA.md`.

## Why
The user's verdict on the current EP01 cast (the Vinrax PSX pack, `scripts/build-cast.py`): "almost every one of them looks so bad, nothing professional"; Altan "looks alien". References in `artifacts/character-master/qa/cs07/ref/` (`33-cast-crowd-lineup.png`, `28-altan-round7.png`, `34-base-compare.png`). An earlier MPFB→PS2 attempt (`37-bm02-mpfb-ps2.png`, its exporter is `artifacts/character-master/scripts/ref/bm02_ps2_export.py`) was also crude: blobby hair, smeared face texture, a bird-like child. And the full-resolution MakeHuman cast was **too heavy for the user's laptop** (Iris Xe, 14 GB).

The user wants: **"better characters, not much heavy, but good details, like Left 4 Dead or Silent Hill 2 (2001)."** That's the target: realistic human proportions and faces with real geometry (eye sockets, eyelids, nose, lips, cheekbones, jaw), detail carried by **textures and a baked normal map**, not by polygons.

## Target budget (per character, in three.js)
- **10–15k triangles total** (body+head+clothes+hair+eyes+teeth). Head ~2.5–3.5k tris with clean edge flow around eyes and mouth (keep the MakeHuman topology's loops, reduce rings elsewhere), hands ~800 each with 5 fingers.
- **One or two materials**: a 1024² (head may get its own 1024²) **diffuse** + a **normal map baked from the full-resolution MPFB mesh** (skin pores/wrinkles/clothes folds come for free), optional baked AO multiplied into the diffuse. Hair: **alpha-tested hair cards** (MPFB's hair assets, decimated, alphaTest ≥ 0.5, double-sided), never a solid blob.
- **Eyes**: separate eye meshes with a real iris/pupil texture and a wet highlight (a small spec), set in the sockets, lids closing over them for blink.
- Rig: keep the bone names/contract the three.js controller uses (`episodes/EP01/threejs/src/stylized/` — read `README.md`, `actor.js`, `hands.js`, `ik.js`: list the bones it expects and map MPFB's 137-bone rig onto them; five-finger chains). Morphs: `speak blink fear hunger resolve gaze smile frown` (≤ 1 cm deltas). Clips `idle`, `walk` like today's cast.

## Build the pilot
- **Ganaa** (46, Mongolian KAMAZ driver; DNA in `artifacts/episode-1-cast/ganaa/dna.json`; padded work jacket over a sweater, trousers, boots; tired, kind, stubble).
- **Altan** (3-year-old Mongolian girl, **0.95 m**; MakeHuman supports toddler ages: build from the base with age ≈ 3 years, real toddler proportions: big cranium, round cheeks, small nose and chin, short limbs, round belly; a red A-line dress, tights, felt boots, a short rounded bob or two small pigtails). She must read as a sweet ordinary child at close-up, not a doll or an alien.
- Use the existing MPFB 2.0.18 pipeline (`artifacts/episode-1-cast/scripts/build_actor.py`, sources in `assets/sources/mpfb2-2.0.18`): build the full-res actor, then write a **new** converter `scripts/l4d_export.py` (do not reuse the BM02 decisions blindly; learn from its failures): decimate per part with protected face loops, bake diffuse + normal (+AO) from full-res to the low mesh in Blender Cycles (CPU is fine), transfer weights, build hair cards, export GLB to `assets/cast/l4d/<id>.glb` + `<id>.json` (tri counts per part, texture sizes, bones, morphs).
- Mongolian faces: epicanthic fold/single lid, flatter nose bridge, fuller cheeks for Ganaa; skin tone from the DNA. No painted-on mask: the face is the head's own geometry and baked skin.

## Review (look at every image; at least 5 build → look → fix rounds)
- `VIEWS=front,tq,profile,body SIZE=420 node .cache/cs07/facecheck.mjs <out.png> tex assets/cast/l4d/ganaa.glb assets/cast/l4d/altan.glb` (three.js, the episode renderer). If its browser can't start in your sandbox, render with Eevee and say so.
- Deliver in `artifacts/character-master/qa/cs07/`:
  - `pilot-faces.png` (front / 3/4 / profile, neutral light), `pilot-sh2-light.png` (dim warm practical + dark fill), `pilot-body.png` (full body front/3/4, Altan next to Ganaa at the same scale: she comes to about his thigh),
  - `pilot-vs-vinrax.png` (today's `assets/cast/ganaa.glb`/`altan.glb` from `main` vs the new ones),
  - `pilot-morphs.png` (blink, speak, smile, frown on Ganaa),
  - `report.md`: budgets (tris per part, textures), what you did, what still looks wrong, honest.
- A node test `tests/l4d-cast.test.mjs`: each pilot GLB ≤ 15k tris, ≤ 2 textures of ≤ 1024² (+ hair), required bones + morphs present, Altan height 0.95 ± 0.02 m.

## Rules
- Blender only via `bash .cache/cs07/run_blender.sh --python <script> -- <args>` in the foreground (adds `-b`, its own lock, a safe runner, `timeout 900`; if a bake needs longer, split it into steps). Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only `scripts/l4d_export.py`, `assets/cast/l4d/**`, intermediates under `.cache/cs07/`, `artifacts/character-master/qa/cs07/**`, `tests/l4d-cast.test.mjs`; reading anything is fine. Don't modify `scripts/build-cast.py`, the existing cast or DNA files. No commits. Don't touch `AGENTS.md`.
- `npm test` must still pass.
- Failures are yours to debug. Use your full budget.
- Final `## Report:` with files, commands + output, evidence paths, budgets, and what still looks wrong.
