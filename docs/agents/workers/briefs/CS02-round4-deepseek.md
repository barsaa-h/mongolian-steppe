# CS02 round 4 (DeepSeek): hand proportions, fist, idle

Continue in this worktree (`~/ms-workers/CS02`) from your round-3 result: `scripts/build-cast.py`, `assets/cast/hand-poses.json`, `artifacts/stylized-cast-qa/cs02/build-final.py`, `render-r4.py`, `make-sheets.py`, `check-r4.py`. Keep everything that passes:
- 30 finger bones, with local +X curl and +Z spread;
- ≤ 650 tris per hand;
- weights normalised;
- `npm test` 75/75;
- the four actors ganaa, tsetsegmaa, altan and dulmaa.

You can view images: **open every render and judge it.**

## Manager review of `ganaa-r4-sheet.jpg` and `ganaa-r4-idle.png`
**Good:** relaxed, spread and point read as hands; the thumb placement is right; the fingertips are blunt; the stripes are gone.

**Fix:**
1. **The palm is far too long.** It's ~1.4× the middle finger, so the hand reads as a paddle with short fingers. On a real adult hand, the **middle finger ≈ palm length** (wrist crease to knuckle ≈ 10 cm, middle finger ≈ 9–10 cm), and the palm is about as wide as it is long. Shorten the palm ~25–30%, lengthen the fingers ~10–15%, and move the knuckle line up accordingly (an arc, with the middle knuckle highest). Keep the thumb base at the side of the heel.
2. **`fist` and `grip` are a block with stubs** under the long palm. Once the palm is right: in `fist`, the fingers fold fully (MCP ~90°, PIP ~100°, DIP ~70°), the fingertips tuck into the palm, the row of proximal phalanges forms the flat front face of the fist, and the thumb lies across the middle phalanges of the index and middle fingers. From the back, you see 4 knuckle bumps. In `grip`, the fingers wrap a 3.5 cm cylinder (show a grey test cylinder in the grip renders).
3. **The idle pose:** one hand points a finger down, and the other hand is hidden or stubby. In `idle`, **both hands use `relaxed`** (no pointing), with the palms facing the thighs and the fingers gently curled and visible from the front and 3/4. Check `preview_clips`/the idle action for leftover point keys.
4. **The child (`altan`):** the fingers are shorter and chubbier and the palm is puffier, but with the same palm-to-finger rule (child middle finger ≈ 0.9 × palm).
5. After fixing, re-run `npm test` and `check-r4.py`, rebuild the four actors, and render `<id>-r5-sheet.jpg` and `<id>-r5-idle.png`. Do at least 2 render → look → fix rounds. Update `report.md` honestly.

## Rules (unchanged)
- Blender only via `bash .cache/cs02/run_blender.sh --python <script> -- <args>` (it adds `-b` and a safe runner that always exits Blender; it waits on the shared lock if busy). Never leave Blender running. Never use the Blender MCP.
- Write only `scripts/build-cast.py` (hand/rig/idle functions and one-line hooks), `assets/cast/hand-poses.json`, the four actors' `.glb`/`.blend` (new blend versions), and `artifacts/stylized-cast-qa/cs02/**`. **Don't touch** `recolor_texture`, `reshape_face`, `face_details` or `hairstyle`, or the `altan` block in `load_actor`.
- Don't create `.py` files named after Python stdlib modules (your `inspect.py` in `cs02/` shadows the real `inspect` for anyone running Python there); rename it to `inspect_cast.py`.
- **Failures are yours to debug. Use your budget.**
