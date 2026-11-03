# CS07 round 7 (DeepSeek, max): remove the lip-seal shelf, fix hair helmets and leftovers

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/CS07` (uncommitted work by you and the manager: keep it; never checkout/reset/stash/clean). Back up GLBs to `.cache/cs07/<id>-r7-before.glb` first. Blender only via `bash .cache/cs07/run_blender.sh`. Read `artifacts/character-master/qa/cs07/round6/report.md` (your last round).

## Manager review of round 6
Accepted: clean chins, flat clean clothes (no camo), Hürel's skin tone, Hürel's cuffs, Altan's clean dress, boot holes closed, the Basis-shape-key bug fix (`apply_shape_delta`), hair tint normalisation.

## Fix list, priority order
1. **REGRESSION — lip-seal shelf.** `seal_lips()` (k = 0.15 at the seam rising to 1.0 at ±30 mm) now cuts a horizontal step/crease across the whole lower face, cheek to cheek, on Altan (worst: it reads as a ventriloquist-dummy jaw), Tsetsegmaa and Hürel; visible in front and 3/4 at normal distance (see your `altan-before-after.png`, `all-closeups.png`). The pinch must be **local to the lips**: limit it to the lip area (≈ mouth-corner to mouth-corner horizontally, a few mm above/below the seam), with a smooth radial falloff to zero well inside the cheeks, and never move cheek/chin vertices. No visible crease outside the lips at front/tq/profile at 420 px and at the `mouth` view. The lips should look softly closed, like the round-4 source faces. If a local pinch can't close the gap cleanly, prefer closing via the lip vertices only (weld/merge the inner lip rims) over moving surrounding skin.
2. **Ganaa's hair reads as a black helmet** with flat black sideburn blocks (front/tq): the `--cap-trim`/cap UV change made the under-cap a flat dark slab. Restore strand texture on the cap and a soft temple/sideburn edge.
3. **Hürel's hairline** still has a thick black outline band in front/tq — same fix.
4. **Dasha's hair** still reads golden blonde in every review image. Rendered colour is what the audience sees: make it read clearly medium-brown under both the studio review and the `sh2` look (check hair material roughness/specular too, not only albedo). Report rendered means under both.
5. **Tsetsegmaa's boot tops** have ragged jagged rims (`boots.png`) — make a clean cuff edge.
6. Altan's outer-canthus crease (your leftover) — fix if you can without changing her face shape.
7. Final close look at all five (front, tq, profile, mouth, ear, body) for anything new you introduced.

Do not change DNA/face shapes (Altan's face D is the user's pick).

## Deliver
GLBs in `assets/cast/l4d/`; `artifacts/character-master/qa/cs07/round7/`: `<id>-before-after.png` (round 6 vs now, incl. mouth view), `lineup.png`, `all-closeups.png`, `report.md` (changes, numbers, honest leftovers). `node --test tests/l4d-cast.test.mjs` must pass. Look at every image you make; view only PNG/JPEG.
