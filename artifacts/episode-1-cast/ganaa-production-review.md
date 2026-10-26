# Ganaa production promotion — approved

Ganaa is the first cast member promoted to production (`review: approved` in
`dna/ganaa.json`), on the user's explicit instruction to finalize him.

## What changed from the last active build

The eyes are the headline. The previously active actor had heavily hooded slit
eyes with a dark under-eye line and barely visible irises. The un-promoted
`dna/review/ganaa-eye-final.json` candidate had already opened the lids; this
promotion adopts it with one further step:

- `eye_opening` -0.12 → 0.16 and `upper_lid_fold` 0.64 → 0.30: readable irises
  with catchlights, hooded character retained.
- Eye bags reduced (0.48/0.43 → 0.25/0.23) and skin calmed: `ruddiness` 0.23 →
  0.15, `detail` 0.26 → 0.20, `freckles` 10 → 6, `tone` 0.97 with a cool
  `undertone` -0.06 against the warm studio key light.
- Shared eye finish: roughness now `0.38 - 0.1*wetness` (was `0.48 - 0.2*wetness`),
  so the faceted low-poly eyes no longer show tight angular highlights in the
  GLB; this applies to the whole cast. The dead `refine_eyes` material override
  in `build_actor.py` (silently overwritten by `apply_appearance`) was removed.
- Age features now include `head_age` 0.38 and `brow_droop` 0.04 for the
  46-year-old read.

## Verification

- `build_all.py` revalidated all 13 DNA files, reran the face-distance report
  (passed) and rebuilt the cast; `check_native.py` and `check_browser.mjs`
  cover every actor; `qa_all.py` refreshed the matching-material lineup,
  profiles and expression sheets with the new Ganaa.
- Known remaining (not blockers): the MakeHuman skin atlas paints fixed
  under-eye creases, the brow source textures stay pencil-thin, and the hairline
  is still unnaturally straight. The smile expression still closes the eyes
  (shared expression-unit quirk).

## Candidate trail

`dna/review/ganaa-production.json` holds the promoted design; the older
candidates (`ganaa-face`, `ganaa-eye-*`, `ganaa-appearance-review`,
`ganaa-age-review`) remain as history. Rebuild at any time with:

```sh
python3 artifacts/episode-1-cast/scripts/build_all.py ganaa
```
