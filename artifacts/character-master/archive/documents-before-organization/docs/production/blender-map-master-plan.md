# ХАНИАД — Blender map recreation master plan

*v1.0 · 2026-10-28 · status: approved direction, not started*

## 1. Goal

Move map authoring from the procedural Three.js builders to Blender, where quality
work actually happens: sculpted silhouettes, painted low-res textures, real detail
geometry (trash, cracks, curbs, wear). The current procedural sets stay as the
**base layer**: we export them into Blender, rebuild/enhance there, and load the
results back at runtime.

Two hard rules the recreation must respect:

1. **The PSX contract holds.** Internal render stays 720 lines with ordered
   dithering and flat-ish Lambert shading. Quality comes from silhouette,
   texture painting and detail geometry — not from realism, PBR or high
   resolution. Textures are painted at 64–256 px, crunch is a feature.
2. **Runtime stays real-time.** Everything returns as GLB through the existing
   GLTFLoader. Triangle and texture budgets below are hard gates, not wishes.

## 2. Fidelity tiers

| Tier | Where the camera is | Triangles | Texture | Examples |
|---|---|---|---|---|
| **HERO** | Close shots, foreground, touched by actors | 800–3,000 | 128–256 px painted | KAMAZ cab, ger door + crown, hospital nursery glass/cots, yard office window wall, governor desk set, door of the boiler house |
| **MID** | Mid-ground, readable silhouettes | 200–800 | 64–128 px | Gers, fences, cars (already rebuilt), lamps, beds, desks, Market stalls |
| **BACKGROUND** | Far, fills the frame | ≤ 200 | shared atlas | Apartment blocks, plant hall, mountains, distant trees, crowd figures |

Rule of thumb from the series bible: if a shot's subtitle is spoken near it,
it is HERO.

## 3. Pipeline architecture

```
three.js builders (src/*.js)          Blender 5.2                    runtime
───────────────────────────          ─────────────────────          ─────────────
buildWorld()/buildSet()              map-studio.py                  mapPieces.js
   │  export BEFORE mergeStatic         │  import GLB per piece        │  swaps procedural
   ▼                                    │  collections: HERO/MID/BG    ▼  groups for GLB
scripts/export-map-glb.mjs ──GLB──► assets/maps/<set>.blend ──GLB──► assets/maps/glb/
   (headless: playwright-core          (base layer + authored          (per-piece, origin-
   + GLTFExporter, in-page)            enhancements, painting)         locked, budget-linted)
```

New pieces:

- **`scripts/export-map-glb.mjs`** — loads each set headless (playwright-core is
  installed), walks the scene graph *before* mergeStatic (add a `MAP_EXPORT`
  global the builders respect), and writes one GLB per top-level named group
  (`khashaa-3`, `hospital`, `yard-office`, …). Canvas textures embed as PNG.
  Verified legs: GLTFExporter ships with our pinned three; Blender 5.2 imports
  our GLBs (tested on `tsogt.glb`, 34 objects).
- **`scripts/map-studio.py`** — Blender toolkit: import a set GLB, sort objects
  into HERO/MID/BG collections, apply the tier budget report, create the
  enhancement layer (new authored meshes), and export selected collections back
  to `assets/maps/glb/` with origin-preserving transforms.
- **`assets/maps/`** — one .blend per set (`ep1-yard.blend`, `ep2-nursery.blend`,
  `town-overview.blend`, …). Sources stay in-repo next to the cast .blends.
- **`src/mapPieces.js`** — runtime: for each named group with an authored GLB,
  replace the procedural group with the GLB instance at the same transform.
  A per-piece switch keeps every scene runnable while a set is mid-recreation.

## 4. What "import the maps" means technically

- Export happens on the **pre-merge** scene graph: `mergeStatic` currently
  batches everything into 219 draw calls — excellent for runtime, useless for
  editing. The export flag skips it; merged batches stay runtime-only.
- Every named group keeps its name through GLB (GLTFExporter preserves node
  names), so round-trip identity is the group name, not positions.
- Origin conventions: each authored piece exports with origin at its placement
  point, Y-up (GLTF standard matches three.js), scale 1 = one metre.
- Procedural detail that already exists (leaf litter, footprints, stains,
  footprints) is **not** re-modeled — it stays procedural and composes on top.

## 5. Detail library — modeled once in Blender, reused everywhere

The life layer the user asked for. Each piece is authored once, instanced
per set. All HERO-tier quality, most under 300 tris:

| Group | Pieces |
|---|---|
| **Trash** | crumpled bag (sculpt), crushed tin can, bottle (clear + green), bottle cap, cigarette butts, torn poster scrap, cardboard box (open/crushed), broken glass shards |
| **Road wear** | crack decals (3 variants, alpha), pothole with broken edge, patched asphalt rectangle, curb crack with weeds, oil stain with rainbow sheen (painted), tar repair line |
| **Yard life** | axe in stump, chicken feeder, water barrel stand, half-buried tyre, rope coil, broken sled runner, bone pile (dog's), tin-can wind chime |
| **Building wear** | peeling paint patches (alpha), rust streak planes, cracked plaster reveal with brick behind, sagging gutter, wasp nest under eave, leaning drainpipe |
| **Interior wear** | floorboard gaps, wall stain maps (painted), dangling wire with bulb, taped cable runs, radiator drip stain, peeled wallpaper flap (alpha) |
| **Steppe/winter** | animal skull, winter-dropped antler, snow-crusted stone, frozen mud ripple, tyre tracks in snow (alpha) |

Painted texture atlas: one shared 256 px "grime" atlas + one "trash" atlas so
instancing stays cheap and the look stays unified.

## 6. Per-location work packages

Hero lists below are the pieces that get full Blender treatment; everything
else in a set is MID/BG cleanup only.

| Set | HERO pieces | New detail focus |
|---|---|---|
| **town-overview** | arch sign, ger (3 tiers), water kiosk, bus stop, heating-plant facade | road cracks on the avenue, curb wear, trash at bins, market clutter |
| **ep1-yard** | boxcar + open door interior, yard office window wall, floodlight head | rail-bed gravel, oil stains (geometry), junk piles, broken pallet |
| **ep1-truckstop** | café counter + window wall, fuel pump, KAMAZ (exists — polish cab interior) | buuz steam prop, menu board, tyre stack, spilled coal |
| **ep1-apartment** | party table set (lamb, cake, bottles), Ganaa's chair corner, lamp | wall stains, peeling wallpaper flap, cigarette tray, confetti |
| **ep2-nursery** | nursery glass wall + 9 cots, operating lamp, laundry hatch, boiler face | IV drip detail, floor scuffs, door kick plate, flicker-lit pipe run |
| **ep3-governor** | banquet table spread, governor desk (napkin + pen + phone), bathroom tub | chandelier, curtain drape, wine-stain carpet, balcony ironwork |
| **ep4-school** | classroom desk rows (one HERO desk instanced), trophy cabinet, boiler face, coal chute | chalk dust, graffiti desk tops, sleeping-bag wrinkles, dropped papers |
| **ep5-cordon** | sandbag wall section (instanced HERO bag), UAZ (exists — polish), lantern post | queue debris, flour spill, rope wear, stampede churn marks |
| **ep6-gorge** | crag wall hero rock (2-3 sculpted), Dorj stand marker (stone cairn) | scree slopes, bone/arrow litter, wind-carved edges |
| **ep7-boilerhouse** | boiler face (firebox, gauges, valve wheel), hot pipe run | soot maps, drip stains, coal scatter, wall scale |
| **ep8-truckstop** | shares ep1-truckstop HERO list + burn-damaged pump | soot + scorched forecourt variant textures |
| **ep9-cabin** | cabin wall section with portholes, bench + harness, cockpit bulkhead | rivet rows, dent panels, hanging cargo net |
| **ep10-dzud** | ger (HERO interior + exterior), frozen lake hero rock/figure cluster, boiler stove inside ger | hoofprint crunch geometry, ice pressure ridge sculpt, frost feathers on felt |

## 7. Runtime swap + QA gates

- `mapPieces.js` swap is per named group; a scene renders mixed
  (procedural base + authored pieces) during migration — no big-bang.
- Budget lint in `map-studio.py`: HERO ≤ 3k tris, MID ≤ 800, BG ≤ 200,
  textures ≤ 256 px, one material per piece where possible. The build fails
  the piece, not the set.
- Origin check: re-imported GLB must land within 1 cm of the procedural group's
  bounding-box centre; orientation within 0.5°.
- Screenshot gate (the established one): per set, before/after at the same
  seek times, side-by-side; seek-through zero-error gate; `npm run check`.
- Aesthetic gate: a 5-minute "PSX check" — does it still look like 1998 at
  720 internal lines? Detail that reads as modern is wrong, even if it is nice.

## 8. Phases

| Phase | Content | Exit |
|---|---|---|
| **0 · Pipeline** | export-map-glb.mjs + MAP_EXPORT flag + map-studio.py import/sort/report + mapPieces.js swap + budgets | one procedural group swapped for its own re-exported GLB, pixel-identical |
| **1 · Pilot set** | ep7-boilerhouse (smallest HERO list): boiler face + pipe run rebuilt, detail library first drop (trash + soot) | before/after gate + screenshot review by the human |
| **2 · Detail library** | full trash/road-wear/yard-life library authored once, instanced into ep1-yard + ep1-truckstop | two sets pass gates with library instanced |
| **3 · Interiors** | ep2-nursery, ep3-governor, ep4-school, ep9-cabin HERO pieces | each set gates |
| **4 · Town + exteriors** | town-overview HERO list, ep5-cordon, ep6-gorge, ep10-dzud, ep8 variant textures | each set gates |
| **5 · Background pass** | BG-tier cleanup across all sets (apartment blocks, mountains, plant) from shared atlas | full-season seek-through gate + human review |

Phase 0–1 proves the round-trip before any large effort is spent.

## 9. Risks

- **Budget creep** — Blender makes it easy to double triangles; the lint gate
  is the defence, plus the rule that crowd/detail complexity lives in
  instancing, not unique meshes.
- **Aesthetic drift** — sculpted assets can go "modern indie" fast; the painted
  256 px texture rule and the PSX check gate are the defence.
- **Lighting mismatch** — Blender's viewport lighting is not our sun/hemi rig;
  texture values must be authored against exported reference frames
  (the exporter saves one reference render per set).
- **Round-trip drift** — procedural builders remain the source of layout;
  authored pieces override by name. Never hand-move a base-layer object in
  Blender; enhancements are additive meshes in the HERO collection.
- **Time** — HERO pieces are hours each. The tier system exists so the effort
  lands only where the camera is.

## 10. Immediate next step

Phase 0: write the export flag + `export-map-glb.mjs`, export `ep7-boilerhouse`,
and import it into Blender via `map-studio.py` — proving the round-trip on the
smallest set before anything is rebuilt.
