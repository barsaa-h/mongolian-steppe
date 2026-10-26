# Character-master default characters — improvement plan

**Focus:** `artifacts/character-master/`, especially its five default preset
characters (`default`, `male`, `child`, `heavy`, `slim-tall`).
**Date:** 2026-10-27. Draft for human review; nothing is rebuilt or locked yet.

## What exists today

The DNA system built on 2026-10-26 gave the 13 episode-1-cast actors full
identity DNA, seven additive expressions, and a QA lineup. The master's
generator already shares that engine (`scripts/dna.py`, `facial.py`,
`appearance.py` validate the full DNA schema), but the five master presets
never adopted it. They are still low-level recipes.

## Findings (defects in the current defaults)

1. **All five characters share one generic face.** Every preset has
   `targets: {}` and the generator injects a hardcoded, identical
   `master_dna()` (same eyes, brows, skin detail) for each. `heavy` and
   `slim-tall` are literally the same face as `male`; only bodies and clothes
   differ. This is the single largest quality gap.
2. **Expressions are fragile and partial.** `build_character.py` adds control
   morphs only when `config['name'] in {'Default', 'Male'}` — a name-string
   check. Renaming a recipe silently drops expressions, and `child`,
   `heavy`, `slim-tall` GLBs have no expression morphs at all.
3. **No Talk_Check clip** in master builds; only the elbow/knee/finger
   `Deformation_Check`. The cast builds already have the talk clip to port.
4. **The recipe schema cannot express identity.** `config.py` validates only
   `name/height_m/body/skin/hair/outfit/shoes/targets/tints`. There is no
   recipe-level way to set face controls, asymmetry, age features, eyes, brows
   or skin detail without dropping to raw upstream target paths.
5. **Default female visual defects** (seen in `default/full.png`,
   `default/face.png`): washed-out pale skin inconsistent with the chosen
   `young_asian_female` atlas, near-invisible eyebrows, flat dead eyes with no
   catchlight, and a cap-like ponytail with a harsh hairline.
6. **Child looks adult around the edges:** adult source skin textures (README
   admits this), adult button shirt/jeans/belt outfit, no pediatric styling.
7. **Renders and QA are minimal:** two PNGs per character (front full + face),
   no profile/three-quarter, no neutral matching-material lineup across the
   five, no expression sheet, and no face-distance/distinctiveness report —
   all of which exist for the cast.
8. **Hygiene:** `scripts/__pycache__/*.pyc` files are tracked in git, and the
   working tree holds 224 uncommitted changes spanning the DNA work.
9. **Docs point away from home:** `DNA.md` lives in character-master but every
   command references `artifacts/episode-1-cast/…`; the master presets are
   described as "legacy".

## Plan

### Phase 0 — Baseline hygiene (small, do first)
- Add `__pycache__/` to `.gitignore`; untrack the `.pyc` files.
- Commit or otherwise stabilize the current uncommitted DNA work so the
  default-character rebuilds below have a clean diff base.

### Phase 1 — Let the recipe express identity (generator work)
- Extend `config.py` with optional, backwards-compatible fields:
  `face`, `asymmetry`, `age`, `eyes`, `brows`, `skin_detail`,
  `facial_hair`. Missing fields keep today's look. Reuse the existing
  validation in `dna.py` (`FACE_CONTROLS`, `resolve_appearance`) instead of
  duplicating it.
- Replace `master_dna(config)`'s hardcoded block with the resolved recipe
  values (falling back to the same defaults).
- Replace the `config['name'] in {'Default', 'Male'}` condition with
  unconditional control-morph generation (or an explicit recipe flag), so
  every character gets expressions regardless of name.
- Port the `Talk_Check` clip generation from the cast builder into
  `build_character.py`.
- Extend `test_config.py` for the new fields (valid, missing, out-of-range,
  face-vector completeness).

### Phase 2 — Give the five defaults identities (character work)
Write full DNA for each preset — distinct face vector, separate age controls,
2–3 visible signature traits each, per-character eyes/brows/skin. Artistic
choices labeled as such; all stay `draft` until human approval.
- `default` (female): first real facial identity; fix the observed defects —
  skin tone consistent with the atlas, visible brows, eye catchlight/wetness,
  and a hair choice without the cap look if the library allows.
- `male`, `heavy`, `slim-tall`: three distinct faces (jaw, nose, brow, cheek
  differences), not one face on three bodies.
- `child`: pediatric face controls; keep the adult-skin-texture limitation
  documented unless child skin art is added (new art = separate license
  check); swap to a child-appropriate outfit from the fitted library.
- Rebuild all five into their existing marker-protected output folders.

### Phase 3 — QA parity with the cast
- Extend `stage()` / add a master `qa_all` pass: neutral matching-material
  bald lineup of the five, grayscale counterpart, profile and
  three-quarter views, and an expression sheet per character.
- Produce a face-distance report across the five (reuse `dna.py report`) so
  distinctness is measured, not assumed.
- Extend `check_browser.mjs` to exercise expression morphs and the talk clip
  on all five GLBs, not just the two that have them today.
- **Gate:** show the human the lineup, profiles and expression sheets;
  identify failures; iterate. Approval is explicit, not inferred.

### Phase 4 — Docs and viewer
- Update `README.md` recipe-field table with the new fields; state that the
  presets are now full-DNA characters.
- Reconcile `DNA.md` so the master workflow references its own paths, with
  the cast as the downstream consumer.
- Expose the DNA sliders/appearance controls for all five examples in
  `index.html`/`viewer.js` (currently only female/male).

## Constraints carried over
- Pinned MPFB 2.0.18 / MakeHuman core, 137-bone rig, 19,158-vertex authoring
  body stay untouched. No new runtime dependencies or paid services.
- `targets` remain additive; opposed extremes need visual fit checks.
- Distinct faces come from face controls — hair, clothing and skin tone do
  not establish identity.
- Manual edits stay out of generated output folders; the builder may replace
  anything under a `.character-master-output` marker.

## Completed verification (2026-10-27)

- Phase 0: `__pycache__/` untracked and ignored; the uncommitted DNA session
  work committed as the baseline before any new changes.
- Phase 1: recipe schema accepts optional `face`, `asymmetry`, `age`, `eyes`,
  `brows`, `skin_detail`, `facial_hair` and `hair_dna`, validated by
  `dna.py validate_recipe_extras` and compiled by `recipe_targets`. All five
  characters now get 113 `FACE.*` control morphs, seven `EXP.*` expression
  morphs and the `Talk_Check` clip regardless of name. 10 config tests, 9 DNA
  tests, 5 cast recipe tests and the project node suite pass.
- Phase 2: five distinct identities built and rebuilt over three rounds (hair
  and stubble fixes between rounds). The shared stubble layer now uses fine
  grain on a geometric beard mask instead of blobs over the whole head.
- Phase 3: `scripts/qa_all.py` renders each character's matching-material bald
  turnaround and expression sheet, assembles `qa/lineup.png` and the grayscale
  counterpart, and fails on near-identical faces. All ten pairs pass
  (closest pair 0.141 vs threshold 0.055). The browser check exercises
  expression morphs and the talk clip on every GLB and passes; the native
  check passes. See `artifacts/character-master/qa/`.
- Phase 4: README recipe table and QA sections updated; DNA.md describes the
  master presets; the viewer loads every character's own recipe, with face
  sliders applying deltas relative to the baked identity.
- Human review still pending: the designs stay draft. Remaining defects to
  review: the child's wide-eyed stare, the smile expression closing the eyes
  (shared expression-unit quirk, also present in the episode cast), pencil-thin
  eyebrow source textures, the adult skin atlas on the child, and the default
  bob partly covering one eye.
