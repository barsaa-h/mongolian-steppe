> Historical design review. Ganaa’s active approved identity is in `dna/ganaa.json`; current work is indexed in [Character Master](../character-master/README.md).

# Ganaa eye revision — draft

Ganaa is 46. This draft reduces iris scale, adjusts lids and eyebrow proportions, softens the source brow texture's alpha edges, and corrects the previously misplaced under-eye tint. The corrected tint uses the lateral eye position; the old code used the midpoint between eyes. Iris scaling uses the approximate texture centers. The brow and under-eye changes live in the shared appearance system and affect future rebuilds; other actors have not been rebuilt with them.

Use `../character-master/archive/ganaa-designs/ganaa-eye-final/comparison.png`, `profiles.png`, and `lineup.png` to compare. The lineup uses the revised Ganaa image and the existing renders for other actors. The skin still reads smoothly in the studio render, the eyebrows retain a uniform painted appearance, and the closed eyelids appear swollen in the clay blink. The exported browser view also shows angular eye highlights. These remain visual failures even though geometry and expression tests pass. Do not approve this candidate on automated checks alone.

The editable candidate is `dna/review/ganaa-eye-final.json`; its build is `../character-master/archive/ganaa-designs/ganaa-eye-final/`. Existing active cast DNA and generated actor remain unchanged. To regenerate:

```sh
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa --dna artifacts/episode-1-cast/dna/review/ganaa-eye-final.json --output artifacts/episode-1-cast/ganaa-eye-final
blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/character-master/scripts/qa_actor.py -- artifacts/episode-1-cast/ganaa-eye-final
```

Keep the DNA draft until explicit creative acceptance; protect existing generated-folder edits before promoting it.
