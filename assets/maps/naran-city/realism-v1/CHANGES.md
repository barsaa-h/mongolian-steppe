# Naran v001 — changes, everyday systems and review limits

29 October 2026. This is an exterior realism development version of the existing town. The full user brief remains the quality target; a passing geometry report is not final art approval.

## What changed

- Extended the terrain to a continuous 20 × 20 km landscape with coherent distant hill masses and a shallow western drainage swale. The town and outer ground share one mapped material, removing the obvious rectangular color join/black horizon. Existing landmark pads stay at their previous elevations. Other placements and roads follow bounded terrain changes.
- Kept the 60 original street alignments and added two connected agricultural tracks. Main asphalt, residential gravel and dirt approaches have distinct materials; selective repair patches, shoulder breakup, ruts and drainage follow road use. Converted the new display-color palette to linear shader values so old asphalt reads darker than earth.
- Reused all 411 existing household centers and dwellings. Six deterministic service/condition families add practical fuel, water containers, privies, storage, trades and dormant gardens. Eight ger properties also contain small timber houses. Maintenance differs across 205 maintained, 138 ordinary and 68 patched households; these labels describe art treatments, not residents' worth or measured income.
- Rebuilt plot edges with modest skew/depth variation, separate timber boards and posts, metal panels and existing gates. Household dwelling/gate orientation now follows the nearest road; gate approaches return toward that road from outside the yard. Non-story household centers remain fixed. This fixes some inherited backward approaches, without moving named landmarks or roads.
- Reused the 17 apartment blocks, including three-, four- and five-floor kits. Nonhero lengths vary within a constrained set; five actual facade treatment families and three roof families add entrance trim, joint repairs, runoff, plinth/gable repaint, repaired frames/curtains, roof sheets, service hatches and renewed ducts. All added vents are supported on actual source-kit roofs. N12 retains its original root transform and scale.
- Added courtyard storage, carpet racks, bikes, play equipment and shoulder parking. The Episode 1 unloading/entry pocket stays clear.
- Adapted four existing market shells for groceries, bread, vehicle parts and pharmacy trade. Contrasting signboards, shutters, hoods, crates, workbenches and loading pockets establish their uses. Added a canteen, two kiosks and a converted apartment service window.
- Developed the three existing water points, civic waiting/crossing spaces, school and hospital grounds, plant coal/maintenance yards, grain loading and freight storage. Added fallow and harvested fields, farm repair, hay, tractor/trailer and a small livestock yard beyond the dense center.
- Kept intact S0 dressing separate from disabled future-state collections. No fire, blood, ruined infrastructure or outbreak crowd was added.

## Everyday-life test

| Resident's need | Where it is represented |
|---|---|
| Buy bread and ordinary food | B02 ТАЛХ beside B01 ХҮНС at N10; B07 service-window grocery by the apartments. |
| Eat, buy medicine or repair parts | B05 ГУАНЗ, B04 ЭМИЙН САН, B03 СЭЛБЭГ. |
| Park without blocking a door | Apartment shoulder pockets and existing market/municipal parking. |
| Children play | Courtyard sandpits/climbing frames and the supervised school yard. |
| Store winter fuel | Firewood and coal storage inside each household plot; plant stockpiles in the industrial yard. |
| Collect/store water | Three existing ger-district kiosks with worn approaches, carts, ice edges and household containers. Kiosk catchment/queue capacity remains uncalibrated. |
| Receive goods | Market unloading pockets/trailer, grain ramps and farm/freight work yards with connected approaches. Truck turning and delivery animation remain untested. |
| Explain different upkeep | Repainted entrances, repaired frames/sheets, maintained timber versus patched enclosures; functioning businesses rather than universal abandonment. |

These systems are represented by exterior geometry. Shops, sheds, privies and institutions are not furnished, operable simulation spaces.

## Protected story geography and documented proposals

All N01–N20 identities/XYZ, the Episode 1 north-entry route, drop-off `(420,-390)` and foot entry `(420,-379.2)` stay intact. The source apartment/café/local Episode 1 files and character assets are unchanged. N04/N05/N20 remain distinct; N06 is the town heating plant. Rail remains atmosphere, not a new evacuation option. The western cordon and regional café remain separate distant locations.

The added school fence retains the north public gap, west service access and south workshop gap, with a footpath east of N07 and a link back to the original west escape lane. Gateway signs now have structural crossbars. Hospital boundaries retain distinct gaps for original public/service/diagonal approaches. The initial shed on East avenue was moved to `(945,390)`. These are exterior access proposals; they do not approve the lock/camera handoff or hospital escape timing. Full change-impact details are in the story constraint ledger.

## Still needs work

- The preserved town remains visibly regular and sparsely occupied at aerial scale. Plot-edge and repair variation improves local reading; this pass does not achieve fully organic settlement density or several fundamentally different apartment architectural series. Further district work should use chosen shot corridors and source reference, rather than another global prop scatter.
- Hero close-ups still need bespoke surface painting, grounded road-edge/ditch geometry, more convincing frozen rut/pothole profiles and richer trade-specific goods. Current cracks/patches and field stubble are restrained low-poly studies. Long field rows remain visibly procedural.
- No people/crowds or operating business activity are staged in the comparison views. The sheep, tractor, wagons and household modules are generic silhouettes; they need close-up refinement if featured.
- N12's exterior/interior floor and entrance alignment, forty-guest party/egress, infant sound geography and actual driver/vehicle blocking remain open. Institutional shells do not resolve hospital medical zones or timed school latch/camera action.
- Household containment, road support/grade, route samples and specific school/roof tests do not constitute exhaustive pairwise collisions, door operation, foundation contact, turning radii, pedestrian accessibility or dynamics validation.
- No runtime replacement, new GLB integration, streaming/LOD pass or playable frame-rate benchmark was performed. The editable native scene is the current deliverable.

## Assumptions requiring art/story review

The exact plot dimensions/density, frontage reorientation, business positions, generic Cyrillic sign design, roof/repair combinations, field/yard layout, hill vegetation and dry-cold shallow-frost weather are artistic choices. They are not a real-town survey or evidence of a specific November 1998 day. Mongolian resident/language review and final shot art approval remain open. Exact apartment series, vehicle/rolling-stock model years, shop packaging and heat-network engineering need reference checks before hero use.

The retained source hierarchy and story ledger also record unresolved N12 footprint, regional journey times, school recording date/locks, Episode 8 fire chronology and Warm Cut heat/geography questions. This environment pass does not silently settle them.
