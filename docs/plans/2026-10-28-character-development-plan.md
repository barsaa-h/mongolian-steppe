# Character development plan — ХАНИАД Season 1

Created: 2026-10-28. Status: **proposed**. Builds on, and does not replace, the active backlog in
[Character Master jobs](../../artifacts/character-master/production/JOBS.md) (C01–C14) and the
[2026-10-27 production master plan](../history/2026-10-27-character-production-master-plan.md).
Nothing here approves a design, a shot or a story decision.

## 1. Where the project stands

| Area | State today | Source |
| --- | --- | --- |
| Story | Season v3: 10 episodes × 8–10 min, Day 0–10, late November 1998. Only Episode 1 has a screenplay (v2.1); Episodes 2–10 are treatments. | `sources/story/` |
| Generator | One shared MakeHuman/MPFB 2.0.18 pipeline: 60 face controls, asymmetry, age, body, skin, brows, eyes, hair, clothing, 137-bone rig, 7 `EXP.*` shapes. Keep it. | `DNA.md`, `GUIDE.md` |
| DNA cast | 13 Episode 1 DNA actors. **Ganaa approved**; 12 drafts. Identity QA passes (78 pairs, closest 0.087 vs 0.055). | `artifacts/episode-1-cast/` |
| Runtime cast | 54 legacy roster entries (52 visible, 2 voice) in `assets/cast/`, 25-joint rig, powering the map/film. Only 9 IDs overlap the DNA cast. | `assets/cast/roster.json` |
| Known shared defects | Smile narrows eyes; brows/hairlines harsh; child uses adult skin atlas; apron/deel/skirt bound to one bone; repeated jackets/shoes; no seated/walk/act clips (only `Deformation_Check`, `Talk_Check`). | `STATUS.md`, master plan §1 |
| Next milestone | Hürel's café: 84 s, 11 shots, E01-D023–D033, Ganaa + Hürel + Dasha. Graybox and cues exist; no real rigs imported yet. | `sources/cafe/` |
| Your estimate | ~40% complete. | `README.md` |

### Gaps this plan targets (beyond the existing C-jobs)

1. **The runtime roster still describes the old 5-episode plot.** v3 changes who recurs:
   Tsetsegmaa/Altan run EP1–5 (roster says 1–2 / 1), Dulmaa returns in EP5, Oyun spans EP2 and 7–10,
   Lkhagva/Sarantuya/Bayar return in EP9–10, Anu/Munkh/Erdene run to EP10, Munkh and Dorj survive,
   Narantuya continues from EP5. `bold` (roster EP6–9) does not appear in v3. Station crew (EP10),
   radio operator (EP3), midwife and nurse-anesthetist (EP2) have no entries.
2. **No continuity-state model for a 10-day story.** Characters don't age, but they accumulate:
   bites and red lines, Dorj's knee, frost, dirt, blood, lost/borrowed clothing, Anu's camera.
   DNA has a `states` field, but only `healthy / hour-five / turning` exist and only for Ganaa.
3. **No infant base.** Naran (newborn) is on screen from EP2 to EP10; the child base covers ages 2–8.
4. **No winter wardrobe library.** The season moves to −20 °C and a blizzard; current fitted
   clothes are autumn/indoor and repeat across actors.
5. **Asset weight.** One DNA GLB is ~16–19 MB; ~45 visible DNA roles would be ~800 MB before
   guests and crowds. There is no LOD or background-instance strategy.
6. **Arcs are written, but not translated to visual/performance needs.** v3 §VI defines arcs;
   nothing yet says which expressions, gestures, props or states each arc needs.

## 2. Rules carried forward

- Keep MPFB/MakeHuman, full authoring topology and the shared rig. No new generator or paid service.
- Identity, age and additive expression stay separate. Hair/clothes never fix a look-alike face.
- Each character: full DNA, 2–3 visible signature traits, canon vs artistic choices labelled.
- Fix shared defects in shared controls/libraries/materials, then re-check every affected actor.
- DNA stays `draft` until you approve it. Code checks, renders and distance scores do not approve.
- Build only what approved shots need. Don't build EP2–10 scenes from the superseded plots.

## 3. Phases

### Phase A — Prove the café (existing C03–C09, unchanged order)

Run the existing jobs as written: reconcile EP1 chronology (C03) → review Ganaa/Hürel/Dasha together
(C04) → import real rigs into the café graybox (C05) → fix only visible shared defects (C06) → block and
bake D023–D033 (C07) → temp Mongolian reads and retime (C08) → short proof render and renderer
choice (C09).

Additions that make later phases cheaper:

- **A1. Write the first three performance profiles** (see §5) for Ganaa, Hürel and Dasha before C07:
  rest posture, gesture habits, gaze behavior, speech rhythm, signature action. Animators block from
  these; later episodes reuse the format.
- **A2. Start a shared clip library while baking C07**: `sit_idle`, `sit_to_stand`, `stand_idle`,
  `walk`, `reach_counter`, `hold_cup`, `turn_look`. Bake them on the shared rig so every DNA actor
  can use them. Add the `idle` the runtime loader expects.
- **A3. Record time and memory per actor in the café render** (C09). This data decides Phase D's LOD
  budget.

**Exit:** your review of the café proof; renderer chosen; Hürel and Dasha approved or sent back with notes.

### Phase B — Finish Episode 1 (existing C10–C13)

- Assign visible roles: freight loader, two café drivers, livestock driver, party instances; voice
  roles: radio, guest infant. New visible identities get full DNA via `dna.py draft --against`.
- Review the remaining 10 identities in batches of 3–4 (lineup + profiles + dressed view).
- Fix shared items once: child skin atlas, deel/apron/skirt weights, brow/hairline pass.
- Build Ganaa's story states in order: `healthy → bitten → wrapped (rag) → line-to-elbow → birthday → turning`.
  Choose the wrist side from the cut, then lock it in the continuity ledger (Phase C).
- Party crowd: 3 hero guests + instanced variants (Phase D3), not 40 unique close-up builds.
- Migrate runtime shots one at a time; legacy GLBs stay until each replacement passes.

**Exit:** every visible EP1 role has approved DNA, the required states, and passes its shots.

### Phase C — Season cast bible (paper work; can start in parallel with Phase A)

No Blender work. Produces the inputs every later episode needs.

- **C-1. Reconcile roster against v3.** Write `artifacts/character-master/production/SEASON-CAST.md`:
  one row per character → episodes on screen, role tier (principal / recurring / featured / background /
  voice), survives or dies (and which episode), existing legacy ID, existing DNA, action. Mark `bold`
  as unassigned rather than deleting it. Add missing roles (station crew, radio operator, midwife,
  nurse-anesthetist, convoy drivers).
- **C-2. Continuity ledger per character and day.** For each recurring character: clothing by day,
  injuries (side, depth, dressing), dirt/blood/frost, props held (Anu's camera and tape count,
  Sarnai's watch, Irina's satchel, Altan's mittens), health. This is the source for DNA `states`.
- **C-3. Arc → visual/performance translation** (§5 table, expanded per character).
- **C-4. Script facts vs open questions.** Record unstated ages (Hürel, Sükhee, Bolor, Sarantuya…),
  then pick artistic ages and mark them as artistic.

**Exit:** you approve the season cast table and the ledger format. Nothing gets built yet.

### Phase D — Shared extensions the season needs

Build each item once, in the shared system, then check it on the five master presets and the
affected actors.

| ID | Extension | Why | Acceptance |
| --- | --- | --- | --- |
| D1 | **Story-state layers** generalised from Ganaa's: wound decals/meshes by location, red-line progression, bandage/rag variants, dirt/blood/frost/sweat material layers, per-state garment swaps | Every survivor accumulates damage across 10 days | States switch deterministically from metadata; neutral identity unchanged; no generic red multiplier |
| D2 | **Winter wardrobe library**: deel (padded), sheepskin coat, quilted jackets, fur hats, felt boots, mittens, scarves, 1998 militia/army uniform, medical whites, school uniform | Late November, blizzard, institutions | MHCLO-fitted, multi-bone weights, tested in walk/sit/reach on adult, teen, elder and child bodies |
| D3 | **Background instances**: one DNA donor + seeded face/body variants + wardrobe swaps, shared textures, reduced LOD | Party guests, square crowd, cordon, convoy | Distance report passes among visible instances; per-instance cost measured against Phase A data |
| D4 | **Infant base / prop rig** for Naran and the EP2 newborns | On screen EP2–10, carried, fed, wrapped | Decide: real infant body vs swaddled prop. Swaddled prop is likely enough; confirm against shots |
| D5 | **LOD pipeline**: hero (current), mid (decimated, merged materials), far | ~800 MB at hero quality for the cast | Hero close-ups unchanged; mid/far within the budget set in A3 |
| D6 | **Expression and speech extension**: brow emotion (fear, worry, anger), jaw/lip shapes for Mongolian and Russian, independent blinks, gaze | Psychological horror lives in faces | Identity preserved at full weight; tested on toddler, adult, elder |
| D7 | **Infected performance set**: sprint (2–3 min), exhausted slowdown, heat-seeking stand, frozen/thawing, feeding | Rules in v3 §III | Reusable on any DNA actor; matches the exertion/temperature rules |
| D8 | **Horse and vehicle contacts**: mount/ride/dismount, UAZ seats, truck cab, carrying an injured adult | EP6–10 travel | Contacts within tolerance; seek-stable |

Order: D1 and D3 first (needed for EP1 finishing), D6 with C06, D2 before EP2, D4 before EP2,
D7 before EP2's corridor, D8 before EP6.

### Phase E — Episodes 2–10 (existing C14), in screenplay order

Rule: an episode enters character production only after its screenplay exists and is blockable.

Per episode:
1. Script breakdown → cast list, states, props, actions, shot sizes (reuse the C-2 ledger).
2. Reuse recurring DNA. New principals get full DNA + your identity review; featured roles batch
   review; background uses D3 instances.
3. Distinctiveness check against the **whole season pool**, not just the episode (run
   `dna.py report` over all DNA folders).
4. Build only the new wardrobe/states/clips the shots need.
5. One proof scene per episode before full production (as the café did for EP1).

Suggested DNA batches, by first appearance and recurrence:

| Batch | Episode | New principals / recurring | Featured & background |
| --- | --- | --- | --- |
| E2 | EP2 hospital | **Oyun**, Narantsetseg, Naran (D4), Bolor | Tsolmon, Dagva, Myagmar + newborn, midwife, nurse-anesthetist, bitten guest |
| E3 | EP3 governor | **Lkhagva**, **Sarantuya**, Batu | Uyanga, Dashnyam, Enkhee, Chinbat, Lodoi, radio operator, square crowd (D3) |
| E4 | EP4 school | **Anu**, **Munkh** | Nomin, Saruul, Temuujin, Bat-Erdene, Gantsetseg, Baasaa, pupils (D3) |
| E5 | EP5 cordon | **Erdene**, **Bayar**, **Narantuya** | Jargal, cordon families and bitten man, convoy drivers |
| E6 | EP6 road | **Tsogt**, **Sarnai**, **Dorj** | Horses (separate asset track) |
| E7–10 | — | Mostly recurring; new states not new faces | Station crew (EP10) |

Front-load E2–E6 DNA drafts (paper + neutral clay only) during Phase B, so identity review of the
whole season pool happens before anyone gets dressed or animated. Look-alike problems are cheapest
to fix at that stage.

## 4. Season cast at a glance (v3 treatment; mentions included)

| Character | Episodes in v3 | Fate in v3 | DNA today |
| --- | --- | --- | --- |
| Ganaa | 1 (referenced 5, 8) | Turns at birthday | **Approved** |
| Tsetsegmaa | 1–5, 8 | Survives; leaves on westbound convoy | Draft |
| Altan (3) | 1–5, 8 | Survives with mother | Draft (child skin pending) |
| Dulmaa | 1, 2, 5 | Joins convoy | Draft |
| Irina | 1 (cassette 8, 9) | — | Draft |
| Dasha / Hürel | 1 (referenced 8) | Hürel killed and stays dead | Draft |
| Oyun | 2, 7–10 | Survives | Legacy only |
| Naran (newborn) | 2–10 | Survives | Legacy only; needs D4 |
| Narantsetseg | 2 (6, 7 referenced) | Bitten in labor | Legacy only |
| Lkhagva / Sarantuya | 3, 9–10 | Survive | Legacy only |
| Anu (16) / Munkh (15) | 4–10 | Survive | Legacy only |
| Erdene (19) | 5–10 | Survives | Legacy only |
| Bayar | 5, 9–10 | — | Legacy only |
| Narantuya | 5–6, 8, 10 | — | Legacy only |
| Tsogt | (2), 6–7, 9–10 | Sacrifice in finale | Legacy only |
| Sarnai (10) | 6–8, 10 | Survives | Legacy only |
| Dorj (71) | 6–7, 10 | **Survives**, injured knee | Legacy only |

## 5. Arc → visual and performance needs (starter; expand in C-3)

| Character | Arc (v3 §VI) | Face / expression | Body / gesture | States & props |
| --- | --- | --- | --- | --- |
| Ganaa | Generous, proud, avoidant; hides the bite for one birthday | Warm laugh that the smile fix must keep; forced cheer over pain | Big host gestures; hides wrist, sleeve pulled down | Wrist bite → rag → line to elbow; gift; satchel |
| Tsetsegmaa | Not disposable grief; protects, resists, chooses | Controlled worry, flashes of anger | Altan always on hip/hand; blocks doorways | Party clothes → blood/hospital → convoy winter layers; one mitten |
| Oyun | Closed a door; later builds an alternative | Dry humor early, then none | Clinical hands, fast triage reaches | Scrubs → field winter gear; blood/wound cleaning; door guilt |
| Anu | Camera as protection → defends Munkh | Watching rather than reacting; later direct | Camera at eye, then lowered | Hi8 camera, tape/battery count by episode |
| Munkh | Falsely branded; won't instantly forgive | Guarded, dry, capable of anger | Holds distance from Anu | Smoke cough (not infection); marked by others |
| Erdene | Orders → hidden kindness → shoots → deliberates | Young face carrying exhaustion; “...Пизда.” delivery | Rifle handling, conscript posture eroding | Uniform degrading by day |
| Tsogt | Toward his wife → accepts death → sacrifice | Few words, ordinary; held-back grief | Herder movement, horse handling | Winter herder gear; finale state |
| Sarnai | Counts to keep people alive | Concentration, lips moving while counting | Small, quick, watches others | Watch; horse-race habits |
| Dorj | Elder bond with Sarnai; survives; becomes family | Signature wrestler's gesture | Limp after EP6 | Knee injury, transport cost |
| Lkhagva | Intelligent, afraid, evasive; survives | Calm surface, eyes that move first | Official posture, hands busy with paper | Suit → road clothes; papers |
| Sarantuya | Knows where forms went → chooses a record | Restraint | Carries folders | Original stamped document (EP9) |
| Bayar | Exploits fear in procedural language | Polite menace | Uniform authority | Fuel/goods he trades |

## 6. Decisions (answered 2026-10-28)

1. **Renderer: hybrid.** Blender for close-up/hero shots, Three.js GLB for wide shots, crowds and the
   playable map. The laptop (16 threads, Iris Xe, 14 GB RAM) builds an actor in ~50 s; measure Blender
   seconds/frame in the café proof (C09) before committing any long sequence to Blender. Character
   builds already support both: the GLB is unchanged and the native file gets render-only smoothing.
2. **Start EP2–6 principal DNA drafts now** (neutral clay only, no wardrobe/animation).
3. **Naran gets a real infant body.** Needs a new infant base below the 2–8 child base (Phase D4).
4. **`bold` retired from the season cast** (decided by Claude at the user's request). He comes from the
   old 15-episode bible's Act II, appears in neither the v3 treatment nor v2.1 Episode 1, and no v3
   beat needs him. The legacy runtime GLB stays until the map migrates; no DNA is built for him.
5. **Legacy runtime cast:** the user had no preference. Keep the map on legacy GLBs and migrate one role
   at a time after its DNA actor is approved (no visible regression in the meantime).

## 6a. Shared look fixes, 2026-10-28

The cast looked wrong for shared reasons, not per-face DNA alone:

- **Iris at half size**: `appearance.aim_irises` spread .42 → .26 (iris now spans ~31° of the eyeball).
- **Grey sclera**: the source photo sclera is ~150/255; `paint_face_maps.paint_eyes` lifts it to warm
  off-white and paints lid shadow on the upper eyeball and the corners (works in GLB too).
- **Pencil-line brows**: `paint_brows` repainted hair-by-hair across the eyebrow card's full UV strip.
- **Scratch-line wrinkles**: crow's feet now fan from the outer eye corner (they used to cross the
  cheeks); forehead lines are waved and broken.
- **Faceted silhouette**: render-only Subdivision (viewport 0 / render 1) on skin and hands, added after
  the GLB export.
- **Clay QA brows** kept their alpha (a solid card read as a carved groove in the lineup).
- **Ganaa review candidate** `dna/review/ganaa-v2.json`: lower face less boxy, lids no longer opened to
  compensate for the old tiny iris. The approved `ganaa.json` is unchanged until the user accepts v2.

## 7. Immediate next steps (this week)

1. C03: reconcile EP1 chronology; record wrist side, Hürel's start position, scarf/rag states.
2. C04: Ganaa + Hürel + Dasha lineup, profiles and dressed views for your review.
3. A1: performance profiles for those three.
4. C-1 (parallel, paper only): season cast table from v3 — fixes the roster/plot mismatch on paper.
