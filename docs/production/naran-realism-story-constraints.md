# Naran realism pass — story constraints and change impact

28 October 2026. **Audit baseline, not a screenplay or geography approval.** This ledger protects the existing town during exterior realism work. No source, location, road, set or Blender scene was changed by this audit.

## Authority and labels

- **Story fact:** the current production decision or required dramatic relationship. [Production sources](../../artifacts/character-master/production/SOURCES.md) resolves authority: [v2.1 Episode 1](../../artifacts/character-master/sources/story/khaniad-act1-v2.1-production-direction.md) supplies current words/acting; only that episode is current. Its Episodes 2–5 are historical. [Season v3](../../artifacts/character-master/sources/story/khaniad-season1-v3-ten-episode-story-bible.md) supplies the accepted ten-episode direction; future episodes are treatments, not locked screenplays. The [logic audit](../../artifacts/character-master/sources/story/khaniad-v3-logic-audit-and-story-changes.md) records deliberate corrections and open issues.
- **Layout proposal:** the [World Bible](../../artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md), its [location registry](../../artifacts/character-master/sources/world/data/naran_locations.csv), metric dimensions/distances and floorplans. They are fictional design coordinates, not surveyed Mongolian geography. **Preserve the current registered XY and IDs in this pass**; provisional status does not authorize an unrecorded move.
- **Artistic assumption:** exact terrain, street alignment, entrances, utilities, infill, material wear and weather staging authored in the town. These need review where they affect travel, visibility or escape. Added detail does not approve a floorplan or shot.

The [Blender map plan](blender-map-master-plan.md) and [quality/density plan](quality-density-master-plan.md) retain engineering history. Their old pilot priority, autumn/runtime treatment, helicopter cabin package and PSX/texture budgets do not override the current source hierarchy. This pass does not choose a new render pipeline.

## Protected location register

Coordinates are **X east, Y north, metres**, central square at (0,0), Z up. Every identity and XY below currently agrees between CSV and [town-layout.json](../../assets/maps/naran-city/town-layout.json). N11/N17 and industrial compounds are district/grounds anchors; do not treat every registry rectangle as one building.

| ID | Identity / XY | Relationship and use to retain |
| --- | --- | --- |
| N01 | Central Square (0, 0) | Civic gathering/announcement space; public approach to offices, EP3/5. |
| N02 | Governor Office (-120, 170) | Northwest of square; dispatch/papers, public streets to N13. No rooftop escape. |
| N03 | Radio Office (-270, 260) | Northwest civic cluster, distinct from N02; switchboard/fax/archive. |
| N04 | Naran Hospital (760, 300) | East/northeast; town-side ER, west service lane, maternity to east. |
| N05 | Maternity Wing (840, 350) | Separate hospital identity; locked ward/nursery access, EP2/7. |
| N06 | Heating Plant (1330, 755) | Northeast of hospital; twin-stack heat/ash/coal landmark, distinct from N20. |
| N07 | School No.2 (-720, -230) | West/southwest shelter; main hall/classroom wing, public and service gates. |
| N08 | School Workshop (-760, -360) | South of N07 across open yard; separately lockable cough annex. |
| N09 | Police Office (-370, 195) | Civic cluster; intake/escort, EP2–5. Police-held exterior is not maternity. |
| N10 | Town Market (-275, -80) | Southwest of square; stalls and delivery bay, EP1/3. |
| N11 | Naran Apartments (335, -410) | Southeast 3–5-floor microdistrict, enclosing N12's neighborhood. |
| N12 | Ganaa Apartment (420, -370) | Four-floor party exterior within N11, EP1. Keep entry/courtyard route readable. |
| N13 | Municipal Garage (-330, -560) | South motor pool; governor's fuel-limited ground convoy, EP3. |
| N14 | Fuel Store (945, -400) | Southeast guarded reserve; fuel authorization has a physical source, EP3. |
| N15 | Grain Warehouse (710, 940) | Northern industry; agricultural/freight silhouette, EP3. |
| N16 | Rail Siding (90, 1070) | Northern freight margin; atmosphere, not usable evacuation transit. Not RG01 Ulan-Ude yard. |
| N17 | Ger District (-1180, -650) | Outer southwest lived-in households, fences, coal heat and water kiosk, EP3–5. |
| N18 | Town West Gate (-1300, -210) | Town exit toward western bypass/cordon, EP5/6; not the checkpoint itself. |
| N19 | Town North Gate (-40, 1180) | Approach toward regional border highway, EP1/8; not the café or border. |
| N20 | Hospital Boiler Annex (960, 470) | Rear hospital refuge/door for Oyun and newborn, EP2/7; not town heating plant. |

## Protected dramatic geography

| Area | Story facts / consequence | Existing layout proposal and realism-pass restriction |
| --- | --- | --- |
| EP1 arrival / N12 | Ganaa returns in **another driver's livestock truck** with birthday mittens; his disabled KAMAZ and unopened satchel stay at RG04. Sheep/broadcast beat remains outside town; no self-slap or narrated fantasy. At home, Altan is three; the crying infant is a guest's baby in the next room, not newborn Naran. End on Ganaa's turn before the attack. | [layout.py](../../assets/maps/naran-city/layout.py) fixes north-boundary arrival through N19, south through town then east to drop-off (420,-390), with foot entry to (420,-379.2). Preserve that access and N12's four-floor identity. Existing separate apartment interior still needs floor/entrance alignment. Do not fill its courtyard/entry with detail that prevents unloading or crowd egress. |
| Apartment staging | Forty guests means arrivals through the evening, distributed across rooms/landing. Tsetsegmaa, Altan and Dulmaa escape and reach hospital; their route cannot terminate in scenery. Infant cry must reach Ganaa; named actors need feasible positions. | World Bible proposes L-shaped stair, 1.2–1.5 m landing, entry corridor, connected kitchen/living room, bedroom, bathroom and courtyard window/balcony. These are unapproved blocking dimensions. No extra escape route, enlarged hidden room or sealed entrance to solve a dressing problem. Crowd/infant/sound tests remain open. |
| N04/N05/N20, EP2 | Four zones: public ER; restricted maternity; nursery/procedure pocket; laundry/service/back yard. Separate (A) infected corridor, (B) family route to police-held **town-side** exterior, (C) Oyun/newborn laundry/maintenance escape, (D) remaining mothers/infants. Door statuses, reachability and seconds left cause Oyun's lock choice. Surgery takes real elapsed hours/cuts. | Keep public, west-service, maternity-service and boiler approaches available in the town layout. The exterior shells do not prove a connected medical floorplan. Do not bridge zones, open a new rescue shortcut or merge the two survivor groups during realism work. Record lock side/owner, people on either side and alternate-exit obstruction before detailed escape staging. |
| Hospital return, EP7 | Narantsetseg stays **inside sealed N05**, identifiable through wired-glass service window from exterior passage. Tsogt can see her but cannot simply enter. Oyun/newborn shelter at N20; medical warmth, water/formula diminish. Service gate, ambulance bay, dispensary return and UAZ loading/start/escape need actual routes. | Keep wired-glass viewing frontage and exterior passage available for future blocking; do not put Narantsetseg in car park or N06 crowd. UAZ needs keys, driver, finite gasoline, infant/Dorj/equipment space. Horses/riders remain separate; one van is not a bus. |
| N07/N08, EP4 | School is an emergency shelter. Unbitten Munkh is separated in workshop across yard while truly bitten pupil stays in main building. Public exit is padlocked outside; teacher has service-gate key. Anu helps child through window, passes camera through fence; Munkh releases latch and survives. | Preserve distinct shells/open yard and named `School access` / `School escape lane`. No decorative fence without a usable camera opening, handoff sightline, latch and route to escape lane. Workshop lock versus Munkh reaching latch needs timed blocking; do not silently invent how he escapes. Show why alternate doors cannot solve the scene. |
| N06 / heat | Working heat attracts nearby exhausted infected; it is also civilian survival infrastructure. EP6 riders see the plant glow and weak light at N20 as their destination. N06 is a recognizable northeast landmark, not an infinite infected generator. | Keep plant separate from hospital boiler and retain plausible sightlines. Pipes/steam/light require a working or residual heat source and a shot state. Buried heating mains and exact network routing are artistic studies; do not expose convenient new warm shortcuts or extend town heat to distant Warm Cut. |
| N01–03 / N13–14, EP3 | Office/radio evidence and fuel reserve produce a ground convoy from municipal garage. Crowd noise/siren wakes nearby infected, not people tens of kilometres away. Governor's public announcement and retained dated fax matter. | Keep public-street separation between civic offices, depot and garage. No private roof/underground shortcut. Do not turn all exits into clear evacuation capacity or erase the guarded fuel source through ordinary dressing. |
| N18 / west evacuation | School survivors go toward west cordon; Tsetsegmaa, Altan and Dulmaa depart alive in a **westbound civilian agricultural convoy**. Anu/Munkh/Erdene take ridge/relay route; no invented final reunion. EP6 injured Dorj survives; lost pack horse and stores create later UAZ need. | West gate is only town threshold. Cordon RG06 is proposed ~13 km southwest by road; retain queue/inspection/controlled bypass, ditch/retreat and horse-capable ridge/culvert trail logic outside this town pack. New decorative roads must not create an unexplained bypass around quarantine. |
| N19 / north return | EP8 deliberately goes toward junction/café for petrol, water, shelter and evidence known via Tsetsegmaa. KAMAZ is diesel; UAZ is gasoline. Café damage/ledger/satchel/driver-seat geometry must match EP1. | RG03 junction is ~27 km from Naran; RG04 café ~2 km beyond it (~29 km from town), then backtrack toward repeater. Do not move café onto N19, add it to town infill, or obtain petrol from KAMAZ. Regional sets keep separate local origins. |

## Regional route limits and unresolved source conflicts

These issues are recorded, **not fixed by moving assets**:

| Issue | Source evidence / impact | Required disposition |
| --- | --- | --- |
| EP1 clock | Current script: dawn Ulan-Ude, afternoon pickup, late-afternoon café, night birthday. World proposal adds ~235 km to border plus customs, 23 km to café and 29 km to town; wrist bite should progress over hours. | Lock a 24-hour strip before final travel animation. Town arrival is only a local segment; don't compress regional distances to fit screen minutes. |
| N12 dimensions | CSV says 43×13 m; current JSON footprint is 46×18 m; generic World Bible prototype is 48×13 m. Town README says interior alignment remains open. | Existing exterior is an artistic override, not proof interior fits. Log any reconciliation and affected entry/stair/party shots; preserve XY and four floors. |
| Grounds versus buildings | N06 registry 130×95 m but JSON hall 64×36 m; N13 registry 115×75 m but JSON hall 100×28 m. N11/N17 are district extents. | Treat these as compound versus shell scopes until checked, not automatic contradictions or permission to shrink functional yards. |
| Hospital continuity | N04 and N05 footprints are separate proxies (27.5 m X / 14 m Y bounding gaps); access lanes are not internal corridors. Historical v2.1 EP2 uses “stairs too narrow for two babies,” now explicitly replaced by v3 separated pockets. | Draw connected four-zone blocking, accessible latch and service-window viewpoint; preserve v3 choice. Do not copy legacy ten-cot/bolted-stair staging as current canon. |
| School date / locks | v3 EP4 heading says Day1 afternoon recording; its hook and World Bible timeline say Day0 recording. Workshop is locked, yet Munkh later releases escape latch. | Keep recording/world clocks distinct; resolve lock-to-latch movement in animatic. Neither issue authorizes merging workshop into school. |
| Café chronology | v3 EP8 heading Day5–6 includes “two days after” fire wording. Production sources explicitly flags this. | Preserve matching EP1/EP8 damage; settle elapsed fire/cooling/residual-heat state before return shots. |
| Warm Cut design / distance | v3 describes industrial warm drainage/pipe and a manually closable warm exhaust; World Bible proposes natural warm seep and rejects endless abandoned-pipe heat. Ledger separates Lower Bridge→Warm Cut by 6 km and Warm Cut→station by 20 km, whereas treatment puts Warm Cut beneath final usable bridge / station traverse. | Thermal source, bridge identities, exact final segment and mechanical sacrifice require scene/engineering reconciliation. Do not attach these regional obstacles to town mains. The EP6 local failed culvert is a **different** obstacle. |
| Season endpoint | v3 EP10 header Day8–10; World Bible timeline Day8–9. Storm forecast/window, last transfer distance and station occupancy remain provisional. | Keep finite station (proposal: three staff, ~12 adults equivalent main room plus separately heated vestibule). Don't solve crowding with extra rooms or magic fuel. |
| Legacy technical plans | Blender plan lists ep9 aircraft cabin and old ep7 priority; quality plan mentions HOUR5 cab/older scene completeness; source hierarchy now prioritizes café and current story. | Reuse technical findings only. No helicopter restoration, driving-seat return, automatic runtime replacement or implicit render-setting change. |

Governor's regional path remains **N13 → failed southern relief post (Days2–5) → western agricultural bypass → Lower Bridge**, consuming time/fuel (proposed post→bridge 64 km). Survivors' path remains **Naran → Upper Junction → café detour/backtrack → repeater → Lower Bridge → Warm Cut → Cold Station**. Regional lengths are estimates in [regional_routes.csv](../../artifacts/character-master/sources/world/data/regional_routes.csv), not the town drawing's line lengths.

## Change ledger and acceptance boundary

| Change ID | Audit result / affected scenes | Current action |
| --- | --- | --- |
| NR-00 | Story/source audit; EP1–10 geography recorded above. | Documentation only. No coordinate, road, entrance, evidence, weather state or scene change. |
| NR-01 | Exterior realism may affect N12 arrival/egress, N04–05–20 access, N07–08 gates, N06 landmark sightlines and evacuation roads. | Restrict dressing to changes preserving those functions. Any intended functional change must append its own row with before/after coordinates/route, scenes that break, already-built shots, reason, continuity checker and approval status. |

**Leave untouched:** existing playable runtime map; the four separate Episode1 local sets; regional café and its evidence/damage geometry; character DNA/rigs; N01–N20 identities/XY; this baseline's arrival/foot-entry path and protected service/escape functions. Reuse exterior assets without overwriting these source sets. Keep normal town, breach, aftermath and hard-winter dressing in separate states; early-state realism must not add later fire, abandonment or blizzard damage.

**Verified in this audit:** all 20 JSON anchor XY match CSV; all 60 JSON roads (names, widths and points) and 17 arrival points match `layout.py`; complete JSON parsed (443 footprint records). Arrival polyline is 2,671.5 m within town. Foot entry is a further 10.8 m. These are static metadata checks, not turning-radius, collision, visibility, actor or escape validation.

**Still required before scene approval:** World Bible Tests A–G with actors/vehicles, apartment crowd/sound/egress, four-zone hospital medical/timing review, school handoff/gate blocking, regional fuel/time/grade continuity and station capacity. This audit did not open Blender, inspect rendered sightlines, benchmark runtime or verify external historical/medical/thermal claims.
