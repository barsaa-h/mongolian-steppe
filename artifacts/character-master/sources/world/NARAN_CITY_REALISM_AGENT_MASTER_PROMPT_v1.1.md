# ХАНИАД — NARAN CITY REALISM & WORLD-BUILDING PASS v1.1
## MASTER EXECUTION PROMPT FOR THE BLENDER / PROCEDURAL WORLD AGENT

**Project:** ХАНИАД / THE COUGH  
**Setting:** Naran, a **fictional northern Mongolian provincial town**, **late November 1998**  
**Style:** Grounded, slightly stylized PS2-era psychological/survival horror; believable architecture, materials, scale and daily life. **Not** photorealistic, not cartoon-like, and not a modern city.  
**Input authority:** Existing Naran World Bible v1.0, `naran_town_blockout_v1.glb` or current `.blend`, `naran_locations.csv` and current town-plan images; Season 1 v3.0 ten-episode story, EP01 screenplay, approved character scale, and the ten screenshot references provided by the director.

## YOUR JOB

Continue improving the **existing** Naran scene in Blender. Do **not** create a new generic Mongolian town, do not replace the story map, and do not treat the current screenshots as target-quality references. Treat them as evidence of what is wrong.

The current town has obvious procedural repetition: apartment slabs look identical, individual houses occupy evenly spaced plots, ger compounds look like carbon copies, streets look newly paved and excessively geometric, the civic square is empty, commercial life is missing, and the ground is either an endless flat brown sheet or an unnatural black void. There are almost no coherent outskirts, terrain features, courtyards, pedestrian paths, service yards, businesses, or reasons for buildings to exist.

**Goal:** It should look like a real small northern Mongolian town that has grown over decades, with a Soviet-planned center, 1990s economic changes, a mixed residential fringe, real local businesses, agricultural outskirts, imperfect maintenance, and identifiable places where people have lived. When we turn on the outbreak state later, the everyday town must already feel worth losing.

## NON-NEGOTIABLE STORY / CANON CONSTRAINTS

1. **Preserve N01–N20 location IDs, the approximate 3.3 × 3.0 km production footprint, coordinate convention (X east, Y north, Z up; metres), and all story-critical entrances, routes and relationships** until an explicit spatial-change proposal is approved. A more natural layout can adjust secondary streets, blocks and parcels. Never silently move the hospital, Ganaa's apartment, school, governor's office, market, heating plant, rail yard or west exit.
2. Preserve EP01 Ganaa's apartment/birthday location, the hospital routes in EP02/EP07, the school containment geometry in EP04, the civic/governor/radio relationship in EP03, the heating plant's relationship to infected congregations, and the west evacuation route. **Hürel's café is a separate regional location, not another building casually inserted into town center.**
3. **Keep the existing assets and materials wherever usable.** Audit them, reuse/rebuild selectively, and create a versioned copy of the scene before changing anything. Do not delete user-authored characters, animation, cameras, named collections or saved scene files.
4. **1998, not 1898 or 2026.** A provincial town may have electricity, cars, Soviet apartment blocks and streetlamps. The director specifically wants **no traffic lights** in Naran. Also omit smartphone ads, LED signs, modern glass towers, oversized American gas stations, pristine malls, contemporary chain-store branding, and modern road markings by default.
5. **Soviet-planned town center may remain partly regular.** The solution is **layered order plus lived-in deviation**, not rotating every structure randomly. Subdivision boundaries, terrain, land use and years of construction must explain the irregularity.
6. All first-pass changes should depict **normal inhabited pre-outbreak Naran** with historically plausible wear. Do not fill it with broken glass, corpses, fire and abandoned vehicles yet. Outbreak damage belongs in separate state collections.
7. Never solve emptiness by scattering meaningless props. Every shop, path, parked vehicle, fence, shed or tree must make sense for a household, institution, business or road.

## RESEARCH BASIS — IMPLEMENT THESE OBSERVATIONS

- A World Bank account with the author's **actual 1997 photographs and observations** describes small **ТҮЦ/kiosks**, informal bazaars, private minibuses/taxis and clusters of truck drivers seeking work in 1990s Mongolia. This supports small shops, temporary stalls, transport waiting areas and commerce grafted onto older buildings, not empty perfect plazas. Source: https://blogs.worldbank.org/mn/eastasiapacific/dynamic-ulaanbaatarphotographs-from-1990s-and-the-present
- A long-term ger-settlement study identifies roadside growth, infill, and gradual upgrading of individual compounds. Treat ger areas as **evolving residential neighborhoods**, not rows of uniformly poor white tents. Source: https://www.sciencedirect.com/science/article/pii/S0169204618310351
- Research on Mongolian ger-district dwelling types shows **mixed fenced khashaa plots, gers and detached houses**, with differences in investment and improvement. Some plots are tidy and prosperous, some are improvised; do not portray everyone as destitute. Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC11522881/
- An FAO assessment from **October 1997** confirms Selenge-area wheat farming and the reorganization of state farms into many smaller enterprises in the 1990s. This makes grain storage, vehicle workshops, cultivated/stubble fields, and mixed farm assets credible on the outskirts. Source: https://www.fao.org/4/W6668E/W6668E00.htm
- **Important:** Much published ger-settlement research focuses on Ulaanbaatar and later decades. Use its morphology as a *guide*, **not as proof of exact 1998 Naran numbers or layout**. Naran is fictional and smaller. Label creative design choices as assumptions.

## TASK 1 — FIX THE UNDERLYING LANDSCAPE BEFORE DETAILING FACADES

The black and featureless land in the screenshots must disappear. Build a continuous real ground mesh, not an untextured plane. Place the town in a modest river-valley / forest-steppe edge appropriate to northern Mongolia; its topography should subtly control settlement and road shape. Use broad rolling ground, low slopes, a drainage channel/dry wash, eroded verges, sparse shrubs, patches of old grass, wind-exposed dirt, gravel, and **distant hills that form a recognizable horizon**. Larch/pine stands can appear on appropriate more distant slopes; don't cover every block in forest.

Create a terrain elevation and drainage plan first. Center-town streets can be fairly level, but the west fringe and north agricultural edge should have visible, modest elevation change. Roads should follow slopes and low crossings rather than make impossible sheer climbs. Make buildings sit *on* terrain with intentional foundations, steps and drains; no floating structures or roads clipping into soil. Late-November conditions: faded straw/earth tones, frost and small snow deposits in persistent shade where appropriate, **not uniformly green summer crops or a blizzard everywhere**.

## TASK 2 — REBUILD CITY STRUCTURE AS SEVERAL HISTORICAL LAYERS

Do not change the story landmarks; build plausible connective tissue around them.

**A. Older administrative center (N01/N02/N03/N09/N10):** modest public square with worn paving, flags and official noticeboard; adjacent post office/phone exchange, shops, pharmacy, bakery/bread counter, repair counter, newspaper kiosk, small canteen, market stall spillover. Create a real hierarchy of front doors, loading access, sidewalks, benches, bus waiting point, utility boxes and pedestrian desire paths. The square must not remain a gigantic blank concrete rectangle.

**B. Apartment microdistrict (N11/N12):** mostly 3–5-storey Soviet-era buildings on logical courtyards. Not every building is identical: use several slab lengths, roof/parapet variants, L-shaped arrangements where justified, different stairwell counts, enclosed/open balconies, patches of repainting, facade stains, patch repairs, broken/replaced windows, different curtains and lights, improvised balcony glazing, aging heating pipes, sheds and parking niches. Mix a few low buildings and ancillary structures. Preserve recognizable Ganaa's apartment façade and entrance.

**C. Everyday market/main street:** actual street-facing ground-floor businesses and informal small retail. Use Cyrillic period-appropriate generic signs such as **ХҮНСНИЙ ДЭЛГҮҮР, ТҮЦ, ГУАНЗ, ЭМИЙН САН, ТАЛХ, СЭЛБЭГ, ЗАСВАР, УС**. Add small counter windows, bread and produce crates, shutters, tarpaulin stalls, weighing scales, stacked cardboard boxes, pushcarts, and a believable bus/taxi waiting area. No current brands or neon mall aesthetic. Not every commercial building is in the same row; add corner and courtyard businesses.

**D. Ger district (N17):** create coherent but **irregular fenced khashaa** of several ages and sizes. Some contain a ger, some a timber/brick house, some both; some have a separate kitchen, wood or coal shed, latrine, gate, livestock pen, garden plot, water container or small workshop. Compounds may be carefully maintained or visibly weathered. Fences vary in timber width, repairs, height, and alignment. A few gates sag, a fence has replacement boards, a roof has one repaired patch; do not turn the neighborhood into a caricature of poverty. Add water collection point and informal paths, local corner kiosk, wood/coal delivery traces. No systematic identical-ger-on-identical-square-grid.

**E. School (N07/N08):** real schoolyard, rough sports field, faded painted playground structures, bike/foot circulation, coal/delivery access where plausible, small neighboring grocery and pedestrian entrance, boundary fence. Preserve EP04 gates, workshop annex and shelter-blocking needs.

**F. Hospital and heating/industrial edge (N04/N05/N06/N20):** ambulance turning bay, small service yard, trash/ash storage, loading access, pipes/cable trays, gate control, heating plant coal stockpile, maintenance workshop, industrial chimneys; a few work vehicles and worker pedestrian paths. Preserve EP02/EP07 escape and heater location topology.

**G. Northern rail/grain/garage edge (N13/N15/N16):** sidings that lead somewhere, loading yard, grain shed/silos scaled to town, handcarts, old forklifts, lorries and tractor trailers, tool sheds, partial disuse and repair rather than glossy logistics park. Keep operations separate from homes where plausible.

**H. Agricultural fringe outside the compact town:** harvested wheat stubble, fallow field, haystack/hay-bale yard, small vegetable plots (already harvested in November), storage sheds, windbreak tree lines, a few cattle/sheep pens, weathered tractor/harvester or machinery-repair yard, farm access tracks and a few scattered homes. Agriculture should be **outside** the dense urban core; not random lush farms between apartment towers. Scale fields as large parcels, not tiny decorative garden tiles.

## TASK 3 — ROADS MUST SHOW HISTORY, USE AND MAINTENANCE

Build three functional road categories instead of identical perfect strips:

1. **Main paved spine:** continuous and navigable, but patched asphalt, mild surface wear, inconsistent verge, repaired potholes, edge crumbling, worn or absent painted lines in places, subtle tyre staining and settlement around manholes.
2. **Secondary residential streets:** narrower, more variable; some aged asphalt, some gravel; fewer markings; parking pockets, turning radii and pedestrian edges suited to buildings.
3. **Ger/fringe/service lanes:** compacted dirt and gravel, wheel ruts, puddle/frozen-mud depressions, shallow drains, footpath shortcuts, uneven edges. Widen near loading gates and give vehicles an actual way to turn around.

Do **not** apply crack texture uniformly across every meter. Wear must respond to drainage, traffic, street age and local repairs. Add rough sidewalk slabs where appropriate and unfinished margins elsewhere. Include culverts and drainage channels where water has a destination. **No traffic lights.** Streetlights and power poles are allowed but require rational spacing and wire paths. Road signs and lane markings must be modest and period-plausible.

## TASK 4 — VARIATION WITH REASONS, NOT PURE RANDOMNESS

Build reusable variant families controlled by zoning, construction age, household resources, maintenance and terrain.

- Apartment kit: at least **4 base silhouettes**, 3–5 façade-maintenance variants, 5+ balcony/window/curtain combinations. Keep unit proportions and stairwell rhythm consistent; don't put balconies on impossible walls.
- Ger-yard kit: at least **8 meaningful compound plans** with variations in dwelling combinations, fence materials, shed placement, gate access and household use. Each yard has a serviceable path from street to gate to dwelling.
- Individual house kit: **6–10 coherent roof/wall/extension families**, with optional shed, garage, stove pipe, patched fence and small yard details. Avoid implausible hovering garages or a garage with no vehicle entry.
- Commerce: at least **8 distinct shop/kiosk/stall types**, with believable signs and delivery paths.
- Vehicles: parked *in plausible places* near apartments, garages, businesses and agriculture. Mix period-appropriate UAZ vans, older Zhiguli/Lada cars, Soviet light trucks, GAZ/ZIL/KAMAZ, tractors; leave several empty spaces. Avoid filling every street with the same model or highly polished current-generation sedans. Any vehicle selection that is historically uncertain should go on a verification list.
- Street dressing: laundry, firewood stacks, coal sacks, empty crates, tires, handcarts, fences, curb repairs, bicycles, bare trees, soot patterns, chimney smoke, utility cables and drainage features — **sparingly, with ownership and function**.

Use deterministic random seeds; do not use a global "randomize everything" button. Density, decay, size and prop distribution are driven by land-use masks and place-specific logic. No identical repeats obviously visible from one aerial or street-level shot.

## TASK 5 — DESIGN FOR CINEMA AND THE TEN-EPISODE STORY

The town is a film set, not an open-world game to be filled at equal resolution.

**Hero zones (highest detail):** N12 Ganaa entrance/courtyard and birthday route; N04/N05 hospital and service exits; N07 school gate/workshop; N02/N03 governor/radio courtyard; N06 heating plant; N10 market street. Keep actual walking/driving routes and door access. The regional café RG04 is a separate detailed set used in EP01 and revisited EP08.

**Midground zones:** recognizable neighborhood buildings, realistic courtyards, traffic and commercial rhythms, but modular geometry and selective texture variation.

**Background:** use lower-detail blocks and natural silhouettes, varied clustering, atmospheric perspective, not a fully empty void or infinite uniform housing rows. The scale of the town must look appropriate for roughly **7,000–12,000 residents (fictional planning assumption)**, not ten million residents and not a hamlet of 60 identical cabins.

Plan each neighborhood in two states: **S0 NORMAL / INHABITED** and **S2–S3 OUTBREAK / AFTERMATH**, stored in separate nondestructive collections or switches. S0 contains signs of life: a kettle, partly stocked market, chimney smoke, a car being repaired, a child's toy, washed clothes drying. Later states modify specific places **according to story events**, rather than applying city-wide fire and random blood.

Keep a list of **human-use stories** at each hero location: who lives/works here, when they last repaired something, how they receive coal/water/food, where children walk, where cars park, where the waste goes, and how emergency responders could reach it. If an asset has no answer, reconsider placing it.

## TASK 6 — HOW TO EXECUTE THE WORK IN BLENDER

**Phase 0 — Audit and protect:** inspect the actual `.blend`/GLB, names, existing geometry, scales, materials, scene structure, current generated assets, character reference height and world location registry. Save an untouched backup, then create `NARAN_CITY_v1_1_working.blend`. Capture consistent BEFORE images from eight matching camera viewpoints.

**Phase 1 — Terrain + graph:** first fix visible ground/sky horizon, then create road-centerline graph, real heights, main/secondary/service road hierarchy and district/land-use zones. Keep locked landmarks and working routes. Output an updated top-down plan and slope/road test.

**Phase 2 — Urban massing:** improve block shapes, land-use mix, apartment grouping, ger-khashaa parcel layout, markets and service areas. **Do not detail all buildings until director approves aerial and pedestrian silhouette checks.**

**Phase 3 — Lived-in variations:** add recognizable façade/yard/shop kits, surface wear, foliage, vehicles, household objects and functional clutter. Control density and variation by district.

**Phase 4 — Hero-shot polish:** put the best attention into EP01 Ganaa exterior and market route, EP02 hospital arrivals, and other story-critical sites. Build a small handful of convincingly inhabited streets rather than uniformly weak details everywhere.

**Phase 5 — Quality check and export:** identify floating objects, intersections, missing paths, scale errors, UV stretching, duplicate facades, impossible roof/garage shapes, road dead-ends and blocked story routes. Verify cinematic views at actor eye height, not just overhead.

**Blender technical expectations:** 1 Blender unit = 1 metre, named collections by district and asset category, linked/instanced repeating meshes where suitable, geometry nodes with fixed seeds, modular material variants, camera-distance LOD, no giant unique meshes for every fence plank. Use a stable `LOC_N##` naming system and separate `STATE_S0`/`STATE_S2` collections. Provide a procedural regeneration script only if the current project uses scripts; don't create dependency on new external plugins without approval.

## REVIEW / ACCEPTANCE GATES (SHOW EVIDENCE)

1. **Town overview:** continuous terrain, gentle topography, no black void, no obvious endless identical-grid settlement; all N01–N20 locations still present.
2. **Street-level civic center:** two or more active reasons to be there besides government office — shops, market and/or transport. Plausible doors, signs, people-scale clutter.
3. **Apartment district:** at least four visibly different silhouettes or clusters, believable common courtyards, parking/garages/service access; Ganaa entrance unchanged in its blocking essentials.
4. **Ger district:** at least eight recognizable yard arrangements, mixed ger + house occupancy, functioning gates, uneven lanes, sensible wear, water/fuel access; not 100 identical plots.
5. **Road close-up:** patched, cracked, potholed asphalt in selective places; dirt and gravel lanes where warranted; drainage and road grades make sense. No traffic lights.
6. **Agricultural edge:** a coherent, visible route from town to field and farm yard, appropriate late-autumn post-harvest appearance, period-plausible equipment.
7. **Season continuity:** hospital and school entrances/escapes, governor/radio routes, heating plant, west exit and café regional route remain feasible.
8. **Performance:** render at least one full-town overview, two pedestrian views, one night/dusk view and one hero-location shot with measured scene/render times. Use stand-in characters at real scale for comparison.

## REQUIRED DELIVERABLES — DO NOT REPORT SUCCESS WITHOUT THESE

- Updated **versioned `.blend`** (or compatible scene package plus scripts), keeping existing assets; original untouched.
- Updated **town master map** (PNG plus editable SVG or vector source), with N01–N20, road types, businesses, agriculture and terrain/contour representation.
- Updated **zone/road/shop/asset registry** in CSV or JSON: names, locations, categories, generation seeds, states and reuse notes.
- **BEFORE vs AFTER** image pairs from fixed cameras: town aerial, civic center, apartment courtyards, Ganaa entrance, market, ger district, north/rail approach, agricultural fringe, pedestrian road close-up.
- A short **CHANGELOG** explaining what was changed, what was left intact, what assumptions are not historically verified, and what still needs a manual modeling pass.
- A **BLOCKERS / QUESTIONS** list only for decisions that would alter story canon, landmark location, character-scale blocking or material historical claims. Make reasonable reversible decisions for all other issues.

## ART DIRECTOR'S FINAL TEST

Zoom into any ordinary 20-metre stretch of street. Ask: *Who lives here? Where do they buy bread? Where does the car enter? How do they get water, heat and fuel? What did they repair last winter? Which route would they take if the hospital called?* If the environment cannot answer these questions visually, it is not finished.

**Success is not maximum geometry or maximum dirt. Success is a believable, coherent, personally inhabited 1998 Mongolian town that remains legible for our ten-episode horror story.**
