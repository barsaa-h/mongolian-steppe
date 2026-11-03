# CS05 (DeepSeek): build the whole EP01 cast with the new faces

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/CS04`, where you rebuilt the faces (rounds 3–7; read `artifacts/stylized-cast-qa/cs04/report.md`). The six principals (ganaa, hurel, tsetsegmaa, dulmaa, irina, altan) now look right. **Don't change their faces or the shared painter's adult path**; any shared-code change must leave those six vertex- and atlas-identical (prove it).

## Goal
Every person who appears in EP01 exists in `assets/cast/roster.json` as a stylized PS2 actor and is built with the new face pipeline, each with a **distinct face** (eye shape/opening/tilt, brow, nose, mouth, face width, age marks, skin tone, hair) so no two read as the same person in a crowd.

The EP01 cast list is `artifacts/character-master/production/EP01-v4-CAST.md` (read it). Roles missing from the stylized roster today include: **dasha** (in roster, no faceArt), **sukhee** (no faceArt), **yard-guard** (no faceArt), **yard-runner**, **nyamka** (shopkeeper, woman), **bataa**, **togoo**, **yard-loader**, **customs-officer**, **cousin** (woman with an infant), **livestock-driver**, **cafe-driver**, **hospital-guard**, **coal-driver**, the town ensemble (**town-cougher, town-flu-joker, town-young-worker, town-water-woman, town-rug-shaker, town-clinic-father**), the children (**kid-puddle-girl, kid-puddle-boy, kid-teaser**, on the child path like Altan, ages about 6–9, so taller than Altan: ~1.15–1.30 m and less toddler-like proportions) and the party guests (**party-guest-01 … party-guest-10**). **Skip the pharmacist** (there is no pharmacy scene in EP01).

For each: add a roster entry (copy the structure of existing entries; pick a sensible Vinrax source body/clothes per role, age, sex, height, build, skin, hair, and a `faceArt` block), set `"episodes": [1]`, and use the EP01 wardrobe notes (padded winter coats for outdoor November roles, deels for older people and the livestock driver, party clothes for guests; avoid the T-shirt outfits with modern logos). Mongolian faces except the Russians (Irina, Dasha, yard-guard, yard-runner, yard-loader, customs-officer are Russian; Dasha is 24).

**Script facts to respect** (from the cast list): Dasha has a damaged arm; the yard-runner is flushed with a damp collar; Hürel wears an apron (exists). Ages as listed.

## Deliverables
- `assets/cast/roster.json` entries, built GLBs `assets/cast/<id>.glb` (and `_v###` blends as you go). Use `CAST_SKIP_REPORT=1`.
- `npm test` must pass (update tests only if they enumerate the roster and a new entry needs it; say so).
- Sheets in `artifacts/stylized-cast-qa/cs05/`: `principals-unchanged.png` (proof), `named-roles.png` (front + 3/4 face for every named role), `town-and-kids.png`, `party-guests.png`, `crowd-lineup.png` (everyone full body at the same scale in one row/grid, so height and silhouette variety reads), and `report.md` (each actor: id, role, age, height, the face choices that make them distinct; any lookalike pairs you fixed).
- Look at every sheet. Fix lookalikes (two faces too similar) by changing face parameters, not just hair or clothes.

## Review tool
`VIEWS=front,tq SIZE=300 node .cache/cs04/facecheck.mjs <out.png> tex <glbs…>`; your `facewide.mjs` for children; Eevee or your own three.js scene for the same-scale lineup.

## Rules
- Blender only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- Write only `scripts/build-cast.py`, `scripts/ps2_face.py`, `assets/cast/**`, `artifacts/stylized-cast-qa/cs05/**`, and tests only if needed.
- Final `## Report:` with files, test output, evidence paths, and what still looks wrong.
