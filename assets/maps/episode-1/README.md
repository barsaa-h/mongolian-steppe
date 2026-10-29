# Episode 1 environment map pack

**Editable layout development, authored through Blender MCP on 28 October 2026.** Open [EP01-Map.blend](EP01-Map.blend) and use Blender's scene selector:

| Scene | Work in this pass | Status |
| --- | --- | --- |
| `EP01_Cafe` | 14 × 10 m interior, real 1.8 m front opening, staff/store exits, removable roof, counter, kitchen/steamer, heater, tables/chairs, ledger, forecourt, petrol pump/bollards, road and truck placement proxy | Spatial draft. Uses the recovered café footprint and actor anchors. |
| `EP01_BorderRoad` | 6.6 m road, shoulders, sloped terrain, pickup anchors, sign, connected overhead wires, sparse dry grass/larch and local frost | Local pickup layout; not a real surveyed border route. |
| `EP01_FreightYard` | Two rail lines, hollow boxcar with a 2.2 m open side door, office/window/recorder, loading area, heat pipe and floodlights | Fictional yard geometry; no infected/guard performance. |
| `EP01_Apartment` | Living room, kitchen, separate guest-infant bedroom, corridor, bath/store openings, birthday table, landing and two stair flights to courtyard | Proposed full-floor blocking layout. No crowd or baby character supplied. |

Scenes use metres, X east / Y north / Z up. Independent cinematic sets remain at their local origins. Regional journey distances stay in the [world route ledger](../../../artifacts/character-master/sources/world/data/regional_routes.csv); this is not a continuous full-length Ulan-Ude-to-Naran landscape.

## Files

- `EP01-Map.blend`: native source, named collections/parts, cameras, packed 128 px textures, door hinges and layout anchors.
- `author_episode1.py`: source used by Blender MCP. Its four `build_*` functions require a scene without those names; it deliberately refuses to overwrite an existing authored scene. Use the native file for subsequent manual edits.
- `glb/`: four static environment exports. No characters, rigs, cameras or lights are exported.
- `previews/`: rendered views and overview board for layout review.
- `qa-report.json`: actual mesh/texture/budget checks and sampled physical route tests.
- `verify_in_blender.py`: measures the live native geometry, re-exports all four sets and saves the source with matching QA hashes.
- `check_map.py`: small standalone source/export/clearance self-check.

`CAFE | removable roof` and `HOME | removable ceiling` are separate collections for cutaway inspection. Layout anchor collections are hidden in renders. The KAMAZ is explicitly a proxy; the cab, protected satchel position, escape, collision and fire still need proper vehicle/character blocking.

## Verification and editing

The current pack passes 11 layout checks: café attack/escape/staff routes and front opening; apartment bedroom/living and exit routes, entry floor support and stair rises; road width; boxcar opening and office camera sightline. The four scenes contain 27,622 native triangles in total, at most 200 per object, and 14 packed 128 × 128 textures. Review caught and corrected a 20 cm apartment threshold gap and a camera aimed into the office window jamb; both now have regression checks.

After editing the native file, run this through Blender MCP in the open project:

```python
from pathlib import Path
exec(Path('/home/barsaa/mongolian-steppe/assets/maps/episode-1/verify_in_blender.py').read_text())
result = verify_export()
```

Then run `python3 assets/maps/episode-1/check_map.py` from the repository root. The standalone check validates the saved file/export hashes, isolated GLB scenes and the recorded layout results. It intentionally fails after a source or export changes without fresh QA. The saved file was also reopened in background Blender to confirm all four scenes, packed textures and both corrected layouts.

The [overview board](previews/episode1-map-overview.jpg) shows the main sets; [the office view](previews/freight-yard-office.png) verifies the window framing. These are 1280 × 720 layout renders, not a final episode look benchmark. Texture wear, dressing, atmosphere and final lighting remain development work.

## Production boundaries

The [current source hierarchy](../../../artifacts/character-master/production/SOURCES.md), [readiness plan](../../../artifacts/character-master/sources/planning/NARAN_PRODUCTION_READINESS_PLAN_v1.1.md) and [café continuity notes](../../../artifacts/character-master/sources/cafe/docs/CONTINUITY_CHECK.md) govern this work. Exact terrain, architecture, furniture and material colors here are artistic choices for review. The existing characters and runtime scenes remain unchanged.

These layouts need the actual character rigs, seated/reaching/contact tests, camera/acting review, the KAMAZ cab and livestock passenger interiors, forty-guest birthday occupancy, temporary voices and retiming. Sampled obstacle boxes establish space along selected routes; they do not certify dynamic contact, medical/building standards, continuous collision safety or finished shots. New GLBs are not yet wired into the live Three.js player.
