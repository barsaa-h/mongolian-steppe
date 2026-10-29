> Historical design review. Ganaa’s active approved identity is in `dna/ganaa.json`; current work is indexed in [Character Master](../character-master/README.md).

# Ganaa — age, eyes and skin review

Ganaa is 46 in the script. The face, age details and clothing are artistic choices; keep the DNA in draft until human approval.

The `dna/review/ganaa-age-review.json` candidate relaxes the eyelids and brow shape, increases age and under-eye volume, and adds restrained skin texture, pigment and warmth. The shared appearance code preserves the brow hair texture and adds soft under-eye tint based on the existing age controls. Those shared changes affect characters when they are rebuilt; the existing gallery has not been regenerated.

The render remains subtle. The brow shape still has a hard, thin outer edge, and the blink shows bulging eyelids; neither should be considered visually finished merely because the movement checks pass. Hair and jacket also need further work. Compare `../character-master/archive/ganaa-designs/ganaa-age-review/face.png`, `profiles-comparison.png`, `lineup.png`, and `qa/` with the prior review. The lineup substitutes only Ganaa's new neutral render; other cast views are from their previous builds.

To regenerate this candidate without replacing the existing gallery:

```sh
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa --dna artifacts/episode-1-cast/dna/review/ganaa-age-review.json --output artifacts/episode-1-cast/ganaa-age-review
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/character-master/scripts/qa_actor.py -- artifacts/episode-1-cast/ganaa-age-review
```

Before promoting the candidate, preserve manual work in the original generated folder, obtain explicit creative approval, copy the approved DNA into the active cast source and rerun the full cast checks.
