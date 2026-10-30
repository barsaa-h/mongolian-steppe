# Brief CH01d — Fix Altan (3-year-old girl), so she reads as a cute, real toddler

**Department:** characters (`docs/agents/02-characters.md`). Read `AGENTS.md` (Character work) and `artifacts/character-master/DNA.md` first. Altan is the emotional centre of the birthday scene. The user looked at the animatic stills and says **"Altan seems very weird."** The manager's review of these images agrees:
- `artifacts/episode-1-cast/altan/full.png`, `qa/front.png`
- `/home/barsaa/ms-workers/R02/episodes/EP01/renders/animatic_v0.1/still_B24_S002.png`, `still_B26_S003.png`, `still_B23_S001.png` (outside your worktree; read them only)

## Problems
1. **Outfit reads as naked or adult.**
   - The dress is `female_elegantsuit01` (an adult blazer suit, shrunk) in `#bd8b72`, almost the same colour as her skin.
   - In close-ups the collar and blazer look like an adult suit, and the colour reads as bare skin.
   - **Fix:** give her clothing that reads as a toddler's best party dress. Use any child-fitting option the generator or `assets/sources/makehuman-core/clothes/` offers; check how the kid actors (`kid-puddle-girl`, `kiosk-boy`) are dressed.
   - The colour must contrast clearly with her skin. 1990s Mongolian children's party clothes were things like:
     - a red, dark pink or cherry velvet or knit dress;
     - or a knitted cardigan over a dress;
     - with white tights.
   - Keep it muted enough for the PS2 look, but warm and festive. Record it as an artistic choice in the DNA.
2. **The mouth and chin look deformed.**
   - The neutral face has a bulge or pucker under the lower lip, and the mouth area looks lumpy and swollen. In the close-up (B26_S003) it reads as a deformity or an expression.
   - Neutral must be neutral. Look at `lower_lip_fullness`, `chin_length` (-0.38 is extreme), `chin_width`, `mouth_width`, `cheek_fullness`/`cheekbone_prominence`, and the child base's interaction with them.
   - Target: soft round toddler cheeks, a small closed relaxed mouth, a small soft chin.
3. **The eyes read small and sleepy, as if half-closed.** Toddlers have relatively large eyes, a strong epicanthic fold for a Mongolian child, and an open, alert look. Adjust `eye_size`, `eye_opening` and the lid folds carefully. Don't make it anime.
4. **Hair.**
   - Thin, flat, dark strands are glued over the face edge, and the ponytail reads stringy.
   - Give her fuller toddler hair: two small pigtails, a short bob with bangs, or a ponytail with soft bangs.
   - The paper crown (a prop on the head) must still sit right.
5. **Skin.** The texture reads dirty and noisy in close-up. Lower `detail`, keep a healthy, slightly rosy toddler cheek, and avoid grey patches.

Keep her identity distinct from the other children (`dna.py report` must pass). Keep the shared rig, topology and expression controls unchanged (rules in AGENTS.md). Use `kid-puddle-girl` and the other kid DNA files as references for values that work on the child base.

## Process
- Edit `artifacts/episode-1-cast/dna/altan.json`, then rebuild Altan with the existing build script (find the exact command in `artifacts/episode-1-cast/README.md`, `build_actor.py` and `build_all.py`). This also regenerates her QA images (front, profile, three-quarter, smile, blink, visemes) and `full.png`/`face.png`.
- **Blender:** headless only, and **always through the lock**: `flock /home/barsaa/ms-workers/.blender.lock <blender> -b ...` (a Grok job also uses Blender). No Blender MCP.
- **Iterate:** after each rebuild, **look at** `full.png`, `face.png` and `qa/front.png`, `qa/three-quarter.png`, `qa/smile.png`, and ask yourself: "would a Mongolian parent call this a cute 3-year-old girl?" Up to 4 iterations.
- Make `artifacts/episode-1-cast/altan/qa/altan-before-after.png`: before (from git `HEAD`) vs after: full, face, front clay, three-quarter, smile, with labels.

## Checks (paste the tails)
- `python3 artifacts/character-master/scripts/dna.py compile artifacts/episode-1-cast/dna/altan.json /tmp/altan.json`
- `python3 artifacts/character-master/scripts/dna.py report artifacts/episode-1-cast/dna <worktree>/div.json`, which must report `passed: True`; then delete div.json.
- `python3 artifacts/character-master/scripts/test_dna.py`, `python3 artifacts/episode-1-cast/scripts/test_recipes.py`, `npm test`.

## Allowed paths
`artifacts/episode-1-cast/dna/altan.json`, `artifacts/episode-1-cast/altan/**`, `artifacts/episode-1-cast/recipes/altan.json`, and `artifacts/episode-1-cast/cast.json` (Altan's entry only). **Don't touch other actors or shared scripts.** If a shared-script bug blocks you, describe it in the report instead.

## Report
- The values changed (before → after) and why.
- The clothing asset and colours.
- Iterations, with what you saw each time.
- The before/after sheet path.
- Honest remaining weak spots.
