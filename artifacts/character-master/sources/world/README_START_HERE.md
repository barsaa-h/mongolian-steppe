# NARAN WORLD BIBLE V1.0 — START HERE

This is a **fictional production design kit** for ХАНИАД / THE COUGH. Maps are story schematics, not GPS or verified Mongolian city maps. Treat all lengths and floorplans as provisional until storyboard and scale tests.

## What to open

1. `NARAN_WORLD_BIBLE_v1.0.md` — complete creative/technical world plan and production rules.
2. `maps/01_region_story_map.png` — highway, cafe, town, checkpoint, bridges, Cold Station.
3. `maps/02_naran_town_plan.png` — town blueprint; building coordinates are also in `data/naran_locations.csv`.
4. `maps/03_hospital_escape_study.png` — experimental hospital blocking only; confirm door and nursery access before final modeling.
5. `3d/naran_town_blockout_v1.glb` — geometry-only Blender-importable graybox, 1 unit = 1 metre; X east, Y north, Z up. No characters, materials beyond simple vertex colors, detailed terrain or interiors.
6. `data/asset_inventory.csv` — stable IDs, priority and state variants. `data/regional_routes.csv` — proposed route lengths.

## Importing to Blender

**File → Import → glTF 2.0 (.glb/.gltf)** → `3d/naran_town_blockout_v1.glb`. Import scale **1.0**. Measure Naran hospital placeholder or four-storey apartment to confirm dimensions; import an existing character rig at height approximately 1.65–1.85m *or its actual established height*, not by arbitrary visual scaling. Save imported blockout as a new `.blend` file. This package does **not** contain an actual `.blend` file.

If you edit scene geometry, revise `data/naran_locations.csv` and maps intentionally. Don't overwrite the only graybox without an updated version ID.

## Rebuilding the kit

`python build_world_assets.py` uses Python, `matplotlib`, `numpy` and `trimesh` to regenerate SVG + PNG + GLB + CSV; ensure matching versions installed in your environment.

## Source documents

`docs/` contains snapshots of our Season v3 narrative treatment, v3 logic audit and Episode 1 v2.1 production-direction source. Those snapshots establish the context; they are not newly invented finished screenplays.

**Suggested first design review:** confirm the Naran–café–station route, test apartment→hospital geography, and then make a playable **hospital/ward** graybox before creating fine textures.
