# CS07 round 6 (DeepSeek, max): fix the close-up defects on all five cast members

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/CS07` (your round-5 work + the manager's, uncommitted: keep it; never checkout/reset/stash/clean; never revert files you did not write). Back up each GLB before overwriting (`.cache/cs07/<id>-r6-before.glb`). Blender only via `bash .cache/cs07/run_blender.sh`; never the Blender MCP. Read your round-5 report first: `artifacts/character-master/qa/cs07/round5/report.md`.

## Manager changes since your round 5 (keep them)
- **Altan has a new face (user pick "D")**: `.cache/cs07/altan-bob-build` was rebuilt from a DNA with age.years 5 (height still 0.95 m, story age 3), bigger eyes, slimmer cheeks/jaw. Do not change her DNA or revert it; the old source is in `altan-bob-build-r4`.
- `tools/compose_atlas.py` scalp paint: limited to above the hairline in the front sector (`hair_z = eye_z + 0.23*span`), because Altan's bangs made the scalp mask paint hair onto her forehead/brows. Keep the idea; tune it if needed.

## Target (unchanged)
Silent Hill 2 (2001)-tier: realistic faces, low-poly (≈10–13k tris), detail in one continuous painted head texture with soft baked shading; clothes with painted folds. Clean, not grimy — these are ordinary people in 1998, not zombies.

## Fix list (manager review of round 5), priority order
1. **Mouths.** Tsetsegmaa shows dark triangular fang-like shards in the lip line (cavity/teeth faces poking through); Altan's mouth is pursed with dark specks at both corners; Ganaa/Hürel lip seam reads dark-open. Target: a closed, soft lip line on every character at the `mouth` view, no shards, no specks. Check the cavity-face selection, the lip pinch and the cavity push for each character.
2. **Chin/jaw mottling.** The source facial-hair/stubble paint stretched over large triangles makes dirty chins. Women and the child (Tsetsegmaa, Altan, Dasha): no stubble at all. Men (Ganaa, Hürel): a soft even shadow only if their DNA `facial_hair` asks for it.
3. **Hairline outline.** Hürel and Dasha have a thick black band along the hairline (scalp paint too dark/too wide or the cap edge). It should be a soft transition from skin to hair colour, a few mm wide.
4. **Hair colour.** Dasha reads platinum blonde; her DNA hair is `#615443`. The tint gain makes light colours too light. Fix `hair_tex.py` so the result matches the DNA hex in mean tone (verify by measuring the rendered hair mean vs the DNA colour for all five; report the numbers).
5. **Clothes print.** Ganaa's jacket and Dasha's jacket show camouflage-like dark blotches from the source garment print. Remove the source print completely (flat DNA colour), then add the painted folds/seams/wear on top. Ganaa: worn dark work jacket; it must not read as camo.
6. **Dirt on Altan.** Her dress hem and felt boots have dark blotches; she is dressed for a party: clean dress, light wear only. Tsetsegmaa's boots show light skin-coloured holes at the shins — fix.
7. **Hürel:** skin reads orange/red-brown — bring him to a natural weathered Mongolian tone in the same family as Ganaa; remove the black cuff blocks (close or fill the open cuff).
8. **Altan's eye area:** a faint dark mark near one brow remains — clean it.
9. Then a full close look at every character (`front,tq,profile,mouth,ear,body`) and fix or list whatever still reads wrong.

## Deliver
GLBs in `assets/cast/l4d/`; sheets in `artifacts/character-master/qa/cs07/round6/`: per character `<id>-before-after.png` (round-5 vs now, incl. `mouth` view), `lineup.png`; `report.md` with what changed (files/functions), tri counts, hair-tone numbers, and honest leftovers. `node --test tests/l4d-cast.test.mjs` must pass. View only PNG/JPEG; look at every image you make.
