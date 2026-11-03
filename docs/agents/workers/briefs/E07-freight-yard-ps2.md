# E07 (Codex): Ulan-Ude freight yard + dispatch office as a PS2 / Silent Hill 2 set

**Worker:** Codex. Read `AGENTS.md`, `docs/agents/03-environments.md` (the freight yard row and Rules), `docs/agents/04-props-vehicles.md` (freight-yard props, boxcar row), `docs/agents/05-look-lighting.md`, `assets/maps/episode-1/README.md`, the EP01 beat sheet (`artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md`, beats 01, 02, 06, 07) and the script (`EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`), all read-only. The graybox is the scene `EP01_FreightYard` in `assets/maps/episode-1/EP01-Map.blend` (yard, boxcar, office, steam pipe).

## Why it matters
Beat 01, "A man standing where he shouldn't", is **the opening shot of the whole series**. It must instantly set the Silent Hill 2 mood: pre-dawn, freezing, fog, sodium/tungsten lamps, steam, the silhouette of a man between freight cars.

## Goal
Turn `EP01_FreightYard` into a shootable **PS2-era set**:
- a Russian (Ulan-Ude, Buryatia) freight yard in November 1998, pre-dawn, plus the morning state for beats 06–07;
- low-poly, 64–256 px pixel textures with painted grime, nearest filtering, no mipmaps;
- Silent Hill 2 *techniques* only.

## Contents (keep the graybox layout, measured openings and marks)
- **Tracks:** 3–4 parallel tracks with sleepers and ballast, frozen puddles, a switch lever, buffer stops.
- **Freight cars:** a Soviet-style boxcar with its **sliding door ajar**, which swings/slides as a separate object with its pivot. **The guard's keys hang from it** (a story prop). Add a tank car and an open gondola with coal. Use rust, faded Cyrillic stencils and made-up wagon numbers (no real logos).
- **Steam pipe:** an insulated overhead pipe run on supports, with valves, leaking steam (emit-able empties `FX.steam_*` for three.js later) and icicles.
- **Dispatch office:** a small brick/plank hut with a lit window, a door, a stove pipe, and a desk inside with a phone, a ledger, a kettle, a calendar, a wall clock and a key board. Make the interior good enough for a close shot.
- **Lights:** tall lamp posts with sodium/tungsten heads pooling light in fog, plus a flashlight mark. Add `LIGHT.*` empties for every practical.
- **The KAMAZ loading spot:** an empty marked bay (the KAMAZ asset comes from another job; leave `ANCHOR.kamaz_park`).
- **Dressing:** snow banks, coal piles, cargo straps, pallets, oil drums, a fence with a gate, a guard's booth.
- **Anchors:** `ANCHOR.*` actor and camera marks for beats 01, 02, 06 and 07, including the hero opening camera: low, between two freight cars, looking down the track into fog at the standing man's mark.
- **Two states:** `pre-dawn` (beats 01–02) and `morning` (beats 06–07) as light/visibility collections, with the geometry shared.
- **Budget:** ≤ 30k tris, ≤ 14 textures (atlas).

## Deliverables
- `assets/maps/episode-1/build_freightyard_ps2.py` → new versions `assets/maps/episode-1/EP01-Map_yard_v001.blend` (then `v002`…). Never overwrite `EP01-Map.blend` or a version.
- `glb/EP01_FreightYard_ps2.glb` (this scene only, nearest filtering, no mipmaps).
- `check_freightyard_ps2.py`: budgets, the boxcar door slides without intersecting, the keys are on the door, the KAMAZ bay is clear (≥ 3 × 9 m), the office door opens, and the existing `check_map.py` still passes.
- In `previews/freightyard-ps2/`, stills at 960×540 (Eevee, fog/volume on, dark): **the hero opening shot**, the yard wide, the boxcar door with the keys close, the steam pipe, the dispatch office exterior, the office interior, and the morning wide. Keep each round (`r1-*`, `r2-*`, …). Open and judge every one.
- `previews/freightyard-ps2/report.md`: check output, budgets, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds. The hero shot must look like the first frame of a Silent Hill game.

## Rules
- Blender headless only via `bash .cache/e07/run_blender.sh --python <script> -- <args>` (your own lock, so don't add another; a safe runner always exits Blender). Run it in the foreground. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits.
- **Failures are yours to debug, not reasons to stop. Use your full budget.**
