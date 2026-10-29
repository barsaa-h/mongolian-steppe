# 03 — Environments (maps) agent

**Mission:** build every place in the story, at human scale, with working doors, sightlines and routes. Each set must hold up in a wide shot and wherever the camera comes close.

**Owns:** `assets/maps/` (`episode-1/`, `naran-city/`, and new `episode-2/` and later).
**Read first:** [EP01 map progress](../production/episode-1-map-progress.md), [Naran city progress](../production/naran-city-progress.md), [realism story constraints](../production/naran-realism-story-constraints.md), the [World Bible](../../artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md) and its location CSV, [1998 research](../research/naran-1998-environment.md).

## Where things stand
- `assets/maps/episode-1/EP01-Map.blend` holds four graybox scenes: `EP01_Cafe`, `EP01_BorderRoad`, `EP01_FreightYard`, `EP01_Apartment`. They have measured openings and a QA report, but no hero detail.
- `assets/maps/naran-city/Naran-City-Master.blend` is the 3.3 × 3.0 km town: 20 anchored locations, 60 streets, 411 households and 17 apartment blocks. `realism-v1/` is the late-November realism draft.
- Removed 29 Oct: the old ep1–ep10 graybox `.blend`/GLB maps from the earlier five-episode plot.

## EP01 locations (beat sheet: six primary environments)

| Location | Beats | Exists | Missing for v4.2 |
| --- | --- | --- | --- |
| Ulan-Ude freight yard + dispatch office | 01, 02, 06, 07 | Graybox (yard, boxcar, office, steam pipe) | Pre-dawn and morning dressing; a freight-car door that swings, keys hanging from it; the KAMAZ loading spot |
| Border checkpoint + long road | 08, 11–13 | Pickup road only | **Customs counter/queue set**, a lay-by, and changing light along the road |
| Naran market / bus stop / ТҮЦ kiosk / clinic frontage | 03, 09 | In the city master as layout | **Hero street set** pulled from the city: a patched bus, kiosk counter, frozen puddle, clinic speaker and coal smoke |
| Nyamka's shop interior | 04, 14 | — | **New set:** counter, debt-book drawer, cracked window, shutters |
| Apartment courtyard | 14 | City master | Coal truck stop, the window Altan watches from |
| Ganaa's apartment + landing | 05, 10, 21–26 | Graybox | **Kitchen door leaf** (opens inward into the kitchen, handle, no lock, can be braced). Homemade decorations, a birthday table for 12–18 people, a coat pile, a shoe rack, the stool. Sightlines: bedroom → table must be within earshot. |
| Hürel's café + forecourt | 15–18 | Graybox (14 × 10 m, counter, heater, ledger) | **Concrete guard, an exposed electrical fitting next to the dispenser** (the source of the arc), a rear door and service yard, the sign on two chains, a card table, steamed windows. A disabled state for EP08. |
| Livestock truck road + sheep | 19 | — | A night road section, a sheep crossing area, a streetlamp junction |
| Hospital gate / sign | 20 | City master anchor | Hand-painted arrow, gate queue, orderly's post |

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| E01 | **Apartment door + floorplan to S05 rules** | Kitchen door object with a hinge empty, opening inward, able to take a hand-brace from inside and a push from the hall. A path from the bedroom to the front door for Tungalag and the infant. Occupancy test: 12–18 actor marks. Camera coverage for beats 21–26. | open |
| E02 | **Café to S05 rules + M2 look-test set** | Collision line, concrete guard, electrical fitting and the dispenser, measured from the KAMAZ proxy, with a satchel-safe zone. Bring the interior up to T1/T0 where the M2 test frames look. | open |
| E03 | New sets: **border checkpoint**, **Nyamka's shop**, **market hero street**, **livestock road**, **hospital gate** | Each set is its own scene in `EP01-Map.blend` (or a linked file) with `ANCHOR.*` marks, an isolated GLB and QA | open |
| E04 | **Detail tiers** | Each set gets a T2 dressing (low-res tiling, PS2 feel) plus T0 "hot zones" where close-ups happen (the kitchen door and handle, the café counter and kettle, the KAMAZ door, the birthday table). The texel density is recorded in QA. | open |
| E05 | **Winter state for the town** | Late November: frost, trodden snow in the yards, coal smoke, frozen puddles. Keep autumn as a variant; no silent swap. The S1–S4 damage collections stay empty until EP02 and later. | open |
| E06 | **EP02 hospital** (M6) | ER desk, triage, corridor spine, maternity wing with two "pockets", OR, maintenance stair, heavy door, car park and the heating plant view. The layout must explain why Tsetsegmaa can leave while Oyun can't save everyone (EP02 question 6: no invisible walls). | open |
| E07 | Later sets as the screenplays lock | EP03 governor's office/square, EP04 School No. 2 and its workshop, EP05 cordon, EP06 culvert/creek, EP07 boiler house, EP08 burnt café (the **same geometry** as EP01), EP09 bridge and Warm Cut, EP10 weather station | deferred |

## Rules
- Use one Blender unit per meter. Never scale an actor to hide a furniture error.
- Doors, routes and sightlines are measured with checks, as the existing `check_map.py` does. Add a check before fixing a defect, so the fix is proven.
- Story geography (the 20 anchors, ~29 km café → town) is fixed until the user approves a change.
- Export only the active scene and include no character skins.

## Inbox
_(other agents add requests here)_
