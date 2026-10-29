# Brief CH01c — DNA fixes for the v4.2 cast review (no Blender; the rebuild comes later)

**Department:** characters (`docs/agents/02-characters.md`, CH01). The manager reviewed `artifacts/episode-1-cast/qa/v4.2-new-cast-review.png`, which shows the 12 new or rebuilt actors in clay front/profile and dressed. Fix the DNA files only. **Don't run Blender**: another job is using it. A Grok job will rebuild from your DNA afterwards.

## Read first
`AGENTS.md` (Character work), `artifacts/character-master/DNA.md` (all of it), `artifacts/character-master/production/EP01-cast-v4.2.md`, the review sheet image, and `artifacts/character-master/scripts/dna.py` (fields, ranges, `compile` and `report`).

## Problems to fix
1. **`kiosk-boy` (7 years, base child):** the face reads as a child, but the dressed body reads as a short, stocky adult.
   - Use the body and age controls the DNA exposes, comparing with `altan` (3, also base child) and the existing kid actors (`kid-puddle-boy`, `kid-puddle-girl`, `kid-teaser`) to see which values give child proportions: a larger head-to-body ratio, a slimmer build, shorter limbs, about 1.20–1.25 m tall.
   - Explain which fields you changed and why.
2. **Repeated costumes.** The generator has very few clothing assets: 24 actors use `male_casualsuit05`. See `assets/sources/makehuman-core/clothes/` for what exists (male_casualsuit01–06, male_worksuit01, male_elegantsuit01, female_casualsuit01–02, female_elegantsuit01, female_sportsuit01).
   - For the 12 actors, assign assets and colours so that **no two of the 12 share the same asset + top-colour family**, and they differ visibly from the principals they share scenes with: Ganaa, Tsetsegmaa, Dulmaa, Hürel, Sükhee, and the party guests in `cast.json`.
   - Specifically: `bus-passenger` and `kiosk-seller` both have the purple `male_casualsuit05`. `car-driver`, `second-driver` and `orderly` all have similar navy jackets.
   - Choose 1998 provincial-Mongolia working clothes:
     - drivers: work jackets, quilted coats, flat caps where the hair asset allows;
     - the orderly: a pale work coat (`male_worksuit01` in an off-white or pale-blue top colour fits);
     - Pasha the loader: a work suit in Soviet blue-grey.
   - Female roles must use female assets.
   - Keep colours muted and period-plausible (no saturated modern colours).
   - Record the choices as artistic choices in each DNA `face_design` or `source` note, as the existing files do.
3. **Expression-like neutral faces.** In the clay neutral views, `door-neighbour` looks like she's smiling, `older-neighbour-woman`'s face looks warped and sagging, and `bus-passenger`'s eyes look pinched.
   - Identity sculpting must not read as an expression. Keep identity and expression separate (see DNA.md and AGENTS.md).
   - Reduce the mouth-corner, cheek and lid values that create the expression, while keeping each face distinct.
   - For the older woman, keep her age believable at about 60–70, but reduce the extremes that warp her.
4. **`gate-bleeding-man`:** his wound is part of his scene state, not his identity. Check whether the DNA `states` field can carry an injured-forearm state (see how `dasha` handles hers). If it can, add a `bandaged-forearm` state; if it can't, say so.

## Checks (run them and paste the tails)
- `python3 artifacts/character-master/scripts/dna.py compile artifacts/episode-1-cast/dna/<id>.json /tmp/<id>.json` for each changed file.
- `python3 artifacts/character-master/scripts/dna.py report artifacts/episode-1-cast/dna /tmp/div.json`, which must report `passed: True`. Paste the nearest distances for the 12.
- `python3 artifacts/character-master/scripts/test_dna.py` and `python3 artifacts/episode-1-cast/scripts/test_recipes.py`.
  - test_recipes may need `recipes/<id>.json` regenerated. If a script outside Blender does that (check `dna.py compile` output paths and `build_all.py`), use it. If it needs Blender, leave the recipes and say so.
- `npm test`.

## Report
- A table of the 12, with the asset + colours before → after.
- The kiosk-boy body changes.
- The face values changed for the three expression issues.
- The distance results.

## Allowed paths
`artifacts/episode-1-cast/dna/<the 12 ids>.json`, `artifacts/episode-1-cast/cast.json` (matching wardrobe and colour fields only), and `artifacts/episode-1-cast/recipes/<the 12 ids>.json` only if regenerated without Blender. The 12 ids are: bus-driver bus-passenger kiosk-boy kiosk-seller door-neighbour older-neighbour-woman car-driver second-driver gate-bleeding-man orderly cousin yard-loader.
