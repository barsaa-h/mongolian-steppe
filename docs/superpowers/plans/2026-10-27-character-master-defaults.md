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
