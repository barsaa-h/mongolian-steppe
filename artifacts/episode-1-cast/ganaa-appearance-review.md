> Historical design review. Ganaa’s active approved identity is in `dna/ganaa.json`; current work is indexed in [Character Master](../character-master/README.md).

# Ganaa appearance review — draft

## Evidence and choices

The script establishes Ganaa as a 46-year-old KAMAZ driver, Tsetsegmaa's husband and Altan's father. It does not prescribe his face, hair or clothes. His broad jaw, hooded eyes, low bridge, wind-worn skin and work jacket are artistic choices, not script facts.

This draft makes restrained adjustments to the jaw, bridge, mouth, asymmetry, under-eye age, skin detail and stubble. The existing fitted hair and suit-based jacket remain. The earlier attempt to shorten the hair made it disappear into the scalp; it was discarded. The hairline is still unnaturally straight, and the jacket reads more like a suit than worn workwear. The changes are subtle and do not yet establish a finished realism standard.

Compare `../character-master/archive/ganaa-designs/ganaa-appearance-review/lineup.png`, `profiles-comparison.png`, `face.png`, and the expression images under `qa/`. The lineup replaces only Ganaa's image; the other actors retain their previous QA renders. His likeness and signature traits still require human judgment. Do not mark this draft approved based on technical checks.

## Source and promotion

The candidate source is `dna/review/ganaa.json`; the candidate build is `../character-master/archive/ganaa-designs/ganaa-appearance-review/`. The active `dna/ganaa.json`, compiled recipe, and existing gallery remain unchanged while this candidate is reviewed. After explicit human acceptance, promote the candidate DNA to `dna/ganaa.json`, regenerate the recipe and actor, and rerun the full cast checks. Preserve any manual edits in the existing generated actor folder before replacing it.

To rebuild the isolated candidate:

```sh
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa --dna artifacts/episode-1-cast/dna/review/ganaa.json --output artifacts/episode-1-cast/ganaa-appearance-review
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/character-master/scripts/qa_actor.py -- artifacts/episode-1-cast/ganaa-appearance-review
```

## Follow-on work

First review Ganaa's face and age before choosing whether to improve the shared fitted hairline and create a period-appropriate work jacket. After the benchmark is accepted, review the remaining principals together for face distinctiveness and visible signature traits. Clothing deformation, facial performance and scene integration remain later production work.
