# ХАНИАД / THE COUGH — Naran Production Readiness Plan v1.1

**Status:** actionable pre-production plan, **NOT** a declaration that assets or episodes are production-ready.  
**Target:** 10 linked episodes × 8–10 min, late-November 1998; stylized, grounded Mongolian psychological horror with situational dark comedy.  
**Basis inspected:** `NARAN_WORLD_BIBLE_v1.0.md`, its 3 maps, 20-location CSV, 32-family asset inventory, regional route ledger, 97-object GLB graybox, Season 1 v3.0 story treatment, EP1 v2.1 production-directed screenplay, and v3 logic audit.  
**Highest-level principle:** **approve the physical action in a rough animatic before polishing a set.**

## 0. Executive decision: authorize a vertical slice, not full production

The world package is a **graybox proposal**. It is not ten buildable episode environments. Current 97 GLB objects are geometric proxies, not completed assets. Most critical spaces lack playable interiors or working rigs. The region diagram is schematic, not GPS-based; its road distances are assumed for writing, not measured from terrain. The hospital drawing is an **untested escape hypothesis**, not an approved floor plan. The old v2.1 dialogue direction extends through Episodes 1–5, but **Episodes 2–5 are superseded in plot by the v3 ten-episode story**. Do not produce those old scenes without rewriting them for v3.

**GO now:** storyboard/animatic; scale tests; actor/rig integration; untextured hero sets; short image/sound render benchmarks.  
**NO-GO yet:** fully dress every town district; animate all ten episodes; render final full-length scenes; pay for bulk character voice recordings; treat future episode beats as locked.

## 1. Version authority and change control

1. **Season story canon:** Season v3.0 treatment (ten episodes); unresolved details remain unresolved. 
2. **EP1 actor text/delivery:** EP1 section only from Act I v2.1 production-direction screenplay. Keep its good natural Mongolian dialogue, Russian lines and subtitle distinctions, and protected profanity. The v3 EP1 story controls any later *story* conflict.
3. **EP2–10:** new episode scripts must be written from v3; v2.1 EP2–5 are useful voice/atmosphere references **only**, not approved plot.
4. **World geography:** Naran World Bible v1.0 is provisional design; `naran_locations.csv` and `regional_routes.csv` are the current machine-readable values. If a map conflicts with an animatic, record and approve a change in both the relevant CSV and exported map.
5. **Art and technical choices:** any resolution/FPS/lighting benchmark below is a recommended **test setting**, not existing production fact.

**Change request fields:** `CR_ID | scene/episode | why | source of truth | changed art/geometry | affected shots | approvals | status`. Never silently overwrite IDs, rig names, door orientation or the only master mesh.

## 2. Critical blockers — ranked by rework risk

| Priority | Issue (actual gap) | What we must deliver | Acceptance proof |
|---|---|---|---|
| **P0** | Story/episode-version conflict | One EP1 canon file, EP2–10 screenplay ownership, numbered scene list | No scene is simultaneously marked “approved” in incompatible v2.1 and v3 storylines |
| **P0** | EP1 timing and injury | 24-hour travel/border/café/ride/party strip, Dasha and Ganaa infection clocks | Every time jump justified, bite occurs before transformation within series rule |
| **P0** | Unverified hero-scene geography | Full-size café, apartment/stairwell, hospital maternity, school/annex blockouts | Animatic shows clear entrances, exits, who can reach whom and why rescue alternatives fail |
| **P0** | Unmeasured production capacity | Two short animation/look-dev tests rendered on user's real machine | Measured scene FPS, render seconds/frame, memory use, animation hours/shot and storage; feasible target chosen |
| **P0** | Character integration unknown | Import existing character rigs, test eyes/mouth/hands, collisions, scale, cloth | At least one close-up talking shot + walk/run + reach/hold prop with acceptable deformations |
| **P1** | EP2–10 not screenplays | EP2 complete dialogue draft, blockable shot list; subsequently one episode at a time | Table read + shot-by-shot logical audit + animatic scene locks before hero art |
| **P1** | Unapproved 1998 props / travel details | Period reference pack, prop specs, UAZ/KAMAZ measurements | Hero props/vehicle layouts reviewed before closeup modeling |
| **P1** | Story logistics underdefined | Fuel, ammo, food, camera batteries/tapes, baby supplies, keys, door state and injuries sheets | Every gain/loss is recorded between scenes and appears physically plausible |
| **P1** | Performance/audio untested | Native-speaker table read, temp VO edit, sound proof | Dialogue sounds human and remains intelligible when played with Foley and room tone |
| **P1** | Town and terrain are sparse | Heights, sightlines, road gradients, local terrain, reusable background building kit | Critical chase/drive/ride/camera lines tested from exact starting and end positions |
| **P2** | Location appearance lacks state/version plan in production files | Per-shot `S0/S1/S2/S3/S4` assignments with damage, weather, time | No shot has premature burns, wrong time of day or contradictory world damage |
| **P2** | Final rendering/post untested | Output and color/sound pipeline, file naming, image sequence recovery | 1-min finished proof of concept exports with no missing frames, corrupt sound or broken subtitles |

## 3. Six delivery gates (in this order; creative work can overlap but spending should not)

### G0 — Canon and episode geography lock

**Work:** Reconcile v3 Episode 1 against v2.1 EP1; list canonical spoken lines, infected states and plot facts. Confirm café→town detour, EP8 satchel, hospital aftermath, and Tsetsegmaa/Altan route. Draw a continuous day-by-day whereabouts timeline; hour-level for EP1/2 and all crosscut crises. Route chart must specify origin, destination, travel mode, departure/arrival estimate, distance assumption, road condition and source.

**PASS:** No unexplained teleportation, no two different casualty states for the same person, all scene locations have IDs, and one named version of every scene is authoritative.

### G1 — Playable locations and blocking

**Build untextured in real metres:**
- `RG04` Hürel café, forecourt, KAMAZ door, fuel impact geometry, protected satchel zone, staff door and retreat route. EP1 damage must be compatible with EP8 exploration.
- `N12` Ganaa apartment: corridor, kitchen, main room, bedroom with guest baby, stair landing/flight and courtyard door. Place every escaping character and the sound path of the infant crying.
- `N04/N05/N20` hospital: ER, maternity, nursery and laundry/service exit, plus all locks and blocked paths. *Test every plausible alternative rescue path.*
- `N07/N08` school/gym/workshop: separate groups, camera sightlines, gate padlock, actual exits.
- `RG06 / RG09 / RG10` checkpoint, lower bridge/Warm Cut and Cold Station only to the level needed to validate v3 later beats.

**PASS:** With human-size cylinders and mock vehicles, a viewer can draw the route of each major action. No invisible wall or unshown key magically makes a story choice inevitable. Fix plot **or** layout when a blocking test fails; don't conceal errors with dialogue.

### G2 — Visual and acting vertical slice

**Primary 60–90-second test:** Hürel café **before and through the start of the attack**. Test Ganaa/Hürel close acting, dark joking, 1998 kitchen set dressing, camera composition, interior sound, glass reflection and infected reaction. Stop before attempting a final effects-heavy fuel-station fire.

**Companion tests:**
- 15–25 seconds: Ganaa + Tsetsegmaa/Altan at the birthday, using a bedroom-to-main-room sound cue and physically placed crowd stand-ins.
- 10–15 seconds: infected sprint/chase at the café parking lot or comparable safe blocking corridor, with coherent distances and contact animation.

**Suggested test export standard (approval required):** 1920×1080, 24 fps, 16:9, 48 kHz WAV, physically consistent scale; rendered image sequence before assembly. Keep the *art* in stylized PS2-era restraint; 1080p output does not require photorealistic geometry. Episode 4's diegetic camcorder footage can intentionally use its own 4:3 frame.

**PASS:** The scene is understandable **without subtitles or narration** on a silent rough cut; dialogue and pauses work with sound; face and hand animation do not distract; known hardware meets an agreed time and disk budget; output quality is worth the measured cost.

### G3 — Modular art kit and pipeline freeze

**Make reusable once:** apartment/stairwell modules; hospital doors, beds and wheeled carts; school desks and gate kits; café utensils/counter; low-detail ger plots; fences, poles, road edges; interior practical lamps; one all-purpose Mongolian road/snow/grass kit; crowd LODs. Give high-detail attention only to items touched by the camera (enamel bowl, bandage, birthday gift, satchel, locks, camera, keys, vehicle dash, evidence ledger).

**PASS:** Hero assets have `Asset_ID`, real scale, materials, textures, rig compatibility, LOD/shot tier, source file, thumbnail render, `S0..S4` variants where applicable. One street kit can be reused across multiple shots with variation without manual rebuilding.

### G4 — EP1 picture lock

**Workflow:** lock text → table read → record temp VO → boards → cut animatic → character blocking → approve acting → approve lighting → final character animation → rendered image sequence → sound design/music → color/mix → QC. Any material edit after animatic lock requires a change request naming the downstream work affected.

**PASS:** Every shot has an ID, duration, camera, location, date/time, state, visible cast, prop/FX dependencies and audio reference. The complete EP1 animatic actually runs within **8–10 minutes** with speech at believable Mongolian conversational speed, including silence and action.

### G5 — Repeatable episode production

Only then advance EP2 as the second full production target. Draft EP2 against **v3**, not the old five-episode script. Carry asset versions and production fixes forward. The other eight episodes remain at treatment/storyboard/graybox level until their scene decisions no longer threaten completed assets.

**PASS:** The team/agent can open a new shot, link existing rigs and assets, render, review, fix and publish without rebuilding the scene framework each time.

## 4. Scene and shot contract (mandatory for action; useful for dialogue)

Each shot record stores: `SHOT_ID, EP, SCENE_ID, STORY_VERSION, DAY, TIME, LOCATION_ID, INT_EXT, WORLD_STATE, WEATHER, PEOPLE_AND_PLACEMENT, ENTRANCES_EXITS, CAMERA, LENS, FRAMES_OR_DURATION, VO_CUE_IDS, AMBIENCE, FOLEY, PROPS, CHARACTER_ASSET_VERSIONS, FX, DEPENDENCIES, ESTIMATE, STATUS, OUTPUT_PATH`.

Naming recommendation: `KHD_E01_S03_SH012_v004.blend`, with rendered frames outside the original project (`renders/E01/S03/SH012/v004/`). Separate one immutable `assets/.../master.blend` from per-shot linked instances. Use a simple manifest file alongside renders with frame range, color settings, audio sync, file hashes or other verifiable identifiers.

**Review views for each hero set:** plan/top camera, human eye-height wide, character close-up, movement-path overlay, state-before/state-after. The front of one set must never lead to an impossible backstage interior.

## 5. Physical and dramatic continuity to solve before hero modeling

| Episode(s) | Requirement | Specific test |
|---|---|---|
| EP1 → EP8 | Satchel survives impact; café wreck persists | Stage collision/ignition zone away from rear-seat evidence; test later approach |
| EP1 → EP2 | Arrival, bite progression, guests to ER | Day0 timestamps and recognizable survivors; injured transport available |
| EP2 → EP7 | Oyun locks ward; Narantsetseg's whereabouts | Playable key/door/security/sightline test, physical separation lasts until EP7 |
| EP3 → EP9 | Lkhagva's warning and convoy | Two documentary evidence sources, dated, and a viable slower byroad |
| EP4 → EP5 | Munkh, Anu, false cough vs actual bite | Track whether each exposed child crosses school gate / checkpoint and why |
| EP5 → EP6 | Erdene's hidden bitten man | Same outfit/wound, duration, the consequence of Erdene's earlier silence |
| EP6 → EP10 | Injured Dorj & transport | Knee injury slows gait; UAZ seats, doors, transfer and access all physically possible |
| EP7 → EP10 | Newborn | Feed/water/warmth plan and one responsible adult for each scene |
| EP8 → EP10 | Evidence, camera, fuel | Tape recording/transfers, handoff of documents, UAZ gasoline purchases/scavenging |
| EP9 → EP10 | Warm Cut and mountain storm | Warmth mechanism confined; route grade/driving time and storm progression |

## 6. Art and animation tiers (spend detail only where visible)

- **Tier H: hero close-up:** named faces, pupils/brows/mouth deformation, hands, key props, animated doors/locks, lip-sync/shapes, readable dated documents.
- **Tier M: action/midground:** convincing silhouette, gait and contact, coat motion, credible vehicle turning and relative speeds; shared materials and careful normal/roughness treatment.
- **Tier L: distant crowds/town:** proxy or lightweight duplicate meshes, impostors beyond selected distance, grouped motion, cheap facade variants, no individually animated facial features.

**Period pass:** compare any visible 1998 sign, packaging, phone, camera, uniform, license plate, ambulance fittings and petrol pump against a dated reference, noting which visual is a deliberate fictionalization. No modern phone/dashboard/posters slipping into a close-up.

**Asset safety:** Backup every source `.blend` and external texture; avoid destructive modifiers on shared originals; keep sound stems separable (`DIA`, `FOLEY`, `AMB`, `FX`, `MUSIC`) and dialogue dry until mix. Original musical score rather than unlicensed commercial songs.

## 7. Performance, sound and psychological horror acceptance

- Professional-natural Mongolian dialogue must survive recording. Do not write new self-explanatory monologues. A native-speaker table read checks register, regional familiarity, age, pause length and profanity *in context*; v3 story beats must be followed.
- Emotion comes from a purposeful action and the voice's changing resistance to it. Cue *whom* a line is for, the objective, withheld emotion, volume, breath, interruption; avoid mechanical tags on every word.
- Environment stems exist before final mix: yard metal, café cookware/rattling sign, hot domestic stairwell, hospital ventilation/laundry cart, radio/telephone, open-steppe wind, station generator. Silence means a real reduction or absence of a specific source, not universal mute.
- Zombies have consistent sonic distance, physical speed, fatigue and heat-seeking states; if a shot implies a new rule, flag and review it before authoring FX.
- Captions/subtitles: Russian remains Russian in speech; Mongolian translations are captions. Time subtitle reading against action, not just spoken duration.

## 8. Rendering and release engineering

**Test rather than guess:** decide final render engine, sampling, shadow quality, volumetrics, motion blur, denoising, texture residency, rig count and storage from the benchmark shots. Record actual peak RAM/VRAM and average render time per frame, not only one still screenshot. At 24 fps, an 8–10-minute episode has 11,520–14,400 frames; a ten-episode season has 115,200–144,000 frames. This is why sample-based budgeting is required.

**Minimum QC per finished shot:** no missing frames; no geometry clipping in acting paths; scale/eye-lines consistent; face readable; frame-to-frame lighting stable; props match shot sheet; dialogue not buried by ambience; no compression artifacts masking detail; subtitles correct; end-to-end checked on a phone-sized screen as well as a desktop monitor.

**Security/backup:** source files, textures, audio, and scripts are versioned with backups. Don't let a code-writing agent modify published masters directly. Store reproducible build scripts and record Blender release/add-ons used for the exact render job.

## 9. Pilot execution queue: first 12 actions (do these before a full town detail pass)

1. Assign **one** EP1 canonical filename; document specific v3-vs-v2.1 differences. Preserve final approved dialogue.
2. Finish EP1 hour-level border and wrist-bite timeline; assign time-of-day and temperature per scene.
3. Import a main character into the existing town GLB to verify scale and coordinate orientation.
4. Test facial rig close-up + grasping the bowl and satchel; capture 3 angles and a few seconds of motion.
5. Graybox Hürel café with doors, counter, two driver seats and sightline from KAMAZ.
6. Graybox fuel impact and fire boundary; ensure evidence remains accessible in EP8.
7. Graybox Ganaa apartment, stairwell and guest baby's room.
8. Board **one** 60–90sec café scene and edit a rough sound-only performance.
9. Animate a no-texture camera/motion pass, review whether space and cause-and-effect read.
10. Render it with plausible lighting, establish cost and art-style target; record benchmark.
11. Create one small reusable modular art kit using those tested sets.
12. Lock complete EP1 storyboard, shots, staging and resource notes; **then** expand polished assets.

## 10. Go/no-go checklist

Production-ready for **EP1** means **ALL** of the following are true:

- [ ] One approved EP1 story/voice version and shot-by-shot animatic
- [ ] Border, bite and party timestamps internally consistent
- [ ] Café/apartment geometry supports action, escapes and camera coverage
- [ ] Existing characters pass speaking, acting, running and prop-contact tests
- [ ] 60–90-second proof-of-concept meets the chosen look and measured render budget
- [ ] 1998 hero-prop reference pass completed
- [ ] Actor/temporary voice tracks timed and subtitles reviewed
- [ ] EP1 has complete shot manifest, asset dependencies, audio/FX cues, and continuity states
- [ ] All master assets backed up/versioned and per-shot render template tested

Production-ready for **full Season 1** adds:

- [ ] Ten screenplays, dialogue reviews, storyboards and animatics approved **episode by episode**
- [ ] EP2/EP7 hospital and EP4 school blocking tests pass
- [ ] Region vehicle/fuel/injury/camera/infant and weather ledgers pass inter-episode review
- [ ] Recurring regional sets usable across all their story states
- [ ] Episode 1 produced and its actual production cost used to rescope subsequent episodes

## 11. What NOT to do yet

Do not build all 20 town locations to hero quality. Do not make 40 bespoke background faces, 1998-correct license plates for every offscreen vehicle, or a fully simulated wildfire before one chase animatic is readable. Do not let an AI modeling agent add random doors, streets, or underground connections to “improve realism.” Do not multiply zombies for atmosphere when sound or one believable threatening body works better.

**Recommended next locked deliverable:** `EP01_LAYOUT_AND_ANIMATIC_PACK_v1.0` with timecoded episode board, café/apartment Blender grayboxes, verified rig scale, temporary VO, shot IDs, and render benchmark. It is the smallest package that demonstrates a repeatable path from writing → staging → finished animation.
