# Naran — full-size Blender town

**Latest exterior development:** [Naran realism v001](realism-v1/README.md), with a separate versioned native scene, terrain/services/household improvements, matching comparisons, revised map and measured QA. Use that pack for the current realism review. The foundation master described below remains unchanged; its static GLB does not include the realism pass.

The editable town foundation for the series, developed from the World Bible's **3,300 × 3,000 m** fictional town frame. Open **`Naran-City-Master.blend`** and select `NARAN_City`. One Blender unit is one metre; X is east, Y is north and Z is up. The central square is the XY origin. Exact terrain, streets and infill remain artistic layout choices for review.

The compact playable town remains available in the application. This pack has not replaced it. The four [Episode 1 sets](../episode-1/README.md) also remain separate and intact.

## What is here

- All 20 source location IDs at their registered XY positions: civic center, hospital/maternity, heating plant, school/workshop, market, apartments, garage, fuel/grain compounds, rail siding, ger district and north/west exits.
- Roads routed outside building footprints, with smaller service lanes, terrain-following surfaces, connected apartment streets and an Episode 1 route from the north boundary to Ganaa's drop-off.
- Existing ger, house, apartment, fence, gate and street-prop models reused from the current application. Copies share mesh data; make a mesh single-user before an individual bespoke edit.
- A more detailed Episode 1 apartment neighborhood: Ganaa's four-floor exterior, courtyards, entry walk, play equipment, benches, vehicles and refuse storage.
- 411 fenced households and 17 apartment blocks, including three-, four- and five-floor variants, across 60 connected street alignments.
- Civic paving/notice board, market shopfronts, compacted yards, a painted dry-steppe ground atlas, residential utilities and courtyard dressing.
- Industrial/rail silhouettes, a buried heating-main study, sparse larch and sheltered frost in an intact early-state town.

Collections numbered 01–09 hold terrain, streets, institutions, apartments, households, infill, industry, detail and utilities. Collection 90 holds location/route anchors; 91 holds plan labels; 99 holds the reused source kit, hidden in renders. Cameras are `Naran.Overview`, `Naran.Plan`, `Naran.Arrival`, `Naran.Apartment`, `Naran.GanaaEntrance`, `Naran.GerDistrict`, `Naran.Center`, `Naran.Residential` and `Naran.Market`. The file opens on the apartment neighborhood.

The six current development renders are in `previews/`; `previews/foundation/` retains first-pass images for comparison. Use `town-plan-readable.png` or its SVG for registered locations and the arrival route.

## Files and sources

| File | Purpose |
| --- | --- |
| `Naran-City-Master.blend` | Native scene with packed textures and editable objects. |
| `glb/naran-city.glb` | Static environment export for inspection and later integration. |
| `previews/` | Actual Blender review renders and overview board. |
| `source/existing-map-kit.glb` | Seventeen reusable asset types extracted from `src/parts.js` and `src/structures.js`. |
| `source/kit-measurements.json` | Original Three.js asset bounds: X/Y/Z = east/up/south. The Blender importer converts the axes. |
| `layout.py` | Canonical registry reader, metric frame, street alignments, arrival route and elevation function. |
| `author_naran.py` | Blender MCP authoring source. Uses the existing Episode 1 map helpers for materials and basic modeling. |
| `develop_city.py` | Residential, ground-surface, civic and market development pass. Refuses a second application to the same scene. |
| `textures/town-ground.png` | Packed painted ground atlas, also retained as an editable PNG. |
| `render_previews.py`, `render_plan.py`, `render_board.py` | Blender review cameras, readable technical map (Matplotlib), and render contact sheet (Pillow). |
| `export_source_assets.mjs` | Browser-based extraction of the existing application asset builders; no runtime changes. |
| `verify_in_blender.py`, `check_city.py`, `qa-report.json` | Native mesh checks, static export and saved-file/hash verification. |
| `town-layout.json` | Native location anchors, road alignments and footprint records for the technical map. |
| `review-regressions.json`, `second-pass-regressions.json` | Native evidence for initial spatial defects and the later part-transform/pole-placement regressions. |

Story/location authority remains the [world bible](../../../artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md), its [location CSV](../../../artifacts/character-master/sources/world/data/naran_locations.csv), and the [production source hierarchy](../../../artifacts/character-master/production/SOURCES.md). Reused kit models inherit their existing project sources and credits in [asset sources](../../../docs/asset-sources.md). The café is a separate regional set roughly 29 km away in the proposed route ledger; the north exit is not the café or border. The west town exit is not the regional checkpoint thirteen kilometres away.

## Verify after editing

Open the master file, run the following through Blender MCP, then run `python3 assets/maps/naran-city/check_city.py` from the repository root:

```python
from pathlib import Path
exec(Path('/home/barsaa/mongolian-steppe/assets/maps/naran-city/verify_in_blender.py').read_text())
result = verify_export()
```

All 16 native checks pass in the delivered master. The standalone check detects stale source/export files and changed registry coordinates. Native verification checks actual terrain intersections and building bounds, street connectivity, frontage, grades, pole clearance, every reused part’s transform and packed ground color. Reopen the saved file before running verification to catch stale packed image buffers. Full authoring functions require a project without an existing `NARAN_City` scene and refuse to overwrite that scene; use the native file for ongoing edits.

To regenerate the six development views with Blender in background mode, open the master and run `render_previews.py`. Run `render_plan.py` with a Python environment containing Matplotlib to rebuild the readable location map from `town-layout.json`.

## Remaining work

This is a town layout with reusable exterior assets. Ganaa's separate interior still needs floor/entrance alignment with this exterior, actual character blocking and the birthday crowd tests. Large institutional buildings are exterior shells. Final dressing, wear, weather/lighting, opening doors and episode state changes remain work. Road/clearance samples are static spatial checks; the pack has no approved vehicle dynamics, gameplay collision or final shot timing. Rendering and streaming performance must be measured during player integration; this town is not yet a replacement runtime asset.
