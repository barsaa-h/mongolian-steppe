# 00 — ХАНИАД production master plan

**For every agent. Read this whole file before your department plan.**

## 1. What we are making

**ХАНИАД (THE COUGH)** is a ten-episode Mongolian animated horror series. It is set in the fictional northern town of Naran in late November 1998. The tone moves from lived-in dark comedy, to quiet dread, to sudden physical horror.

- **EP01 «АЯГАА ХУВААЛЦ» / Share the Bowl** is the 25:00 pilot (36,000 frames at 24 fps). Ganaa, a truck driver, brings a warning and a bite home to his daughter Altan's third birthday. The episode ends on the kitchen door.
- **EP02 «ХОЁР ХААЛГА» / Two Doors** opens in the same second the pilot ends. Dr. Oyun then has to choose which door to close at the hospital. Proposed length: 18–22 minutes.
- **EP03–EP10** follow the season v3 bible: the governor's cover-up, the school, the cordon, the northern road, the boiler house, the return to Hürel's café, the confrontation, and the cold station.

### Source authority (in order)

1. **[SOURCES.md](../../artifacts/character-master/production/SOURCES.md)** decides which version wins.
2. EP01 dialogue: **[v4.2 script](../../artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md)**. EP01 structure and continuity rules: **[v4.0 beat sheet](../../artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md)**.
3. EP02 opening: [v4.1 dialogue](../../artifacts/character-master/sources/story/EP02_Opening_05min_Dialogue_Handoff_v4.1.md) and the [v4.0 bridge](../../artifacts/character-master/sources/story/EP02_Emotional_Handoff_and_Continuity_v4.0.md).
4. Season, infection rules, geography and resources: the [v3 bible](../../artifacts/character-master/sources/story/khaniad-season1-v3-ten-episode-story-bible.md). Physical world: the [World Bible](../../artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md).

Story files under `sources/story/` are **originals: never edit them**. Changes go into a new version file, and the story agent records them.

## 2. The look: PS2-era horror, high-resolution close-ups

User decision, 29 October 2026. The model is how a 2001–2004 PS2 horror game presented itself: in-engine scenes plus pre-rendered FMV cutscenes (Silent Hill 2/3, Fatal Frame, Siren). Use them as a period reference for mood only. **Do not copy their designs, characters, places or shots.**

| Tier | Used for | Renderer | Texture / mesh budget | Feel |
| --- | --- | --- | --- | --- |
| **T0 Hero** | Faces in close-up, hands, hero props in insert shots (bowl, mittens, satchel, wrist, door handle) | Blender (Eevee; Cycles only for named shots) | 2K–4K textures, full MakeHuman topology + subdivision, real eye/skin/cloth detail | The "FMV" layer: rich, detailed, almost real |
| **T1 Mid** | Medium shots, two-shots, interiors | Blender Eevee | 1K textures, base topology | Still detailed; fog and grain do more of the work |
| **T2 Wide** | Establishing shots, town, roads, crowds, background actors | Three.js GLB or Blender Eevee | 256–512 textures, LOD meshes (crowd ≤ 5k tris) | Plainly PS2: low-res textures, depth fog, limited light |

Rules shared by every tier, owned by plan 05:

- One grade across all tiers: cold, desaturated exteriors; warm tungsten and coal-stove interiors; heavy atmospheric fog for depth; fine film grain; soft halation on practical lights; deep blacks that still read.
- PS2, not PSX. No vertex snapping, affine texture warping or dithering. The current Three.js `psx.js` pipeline must be retuned toward this look (task L03).
- Detail follows the story. Spend T0 only where the camera is close *and* the shot matters: the eye area, the wrist bite, the enamel bowl, the mittens, the door handle.

## 3. Pipeline

```
story lock ─► cast/DNA ─► environments + props ─► layout (cameras) ─► animation ─► look/lighting ─► render ─► edit + sound mix
   01            02             03 + 04                 08                06             05             08          08 + 07
```

- **Characters:** MakeHuman/MPFB 2.0.18 DNA, a shared 137-bone rig, `artifacts/episode-1-cast/dna/<id>.json`, built by `build_actor.py`. Never start another character pipeline.
- **Shots:** one Blender file per shot (or per sequence) in `episodes/EP01/shots/`. It **links** (does not append) maps, props and characters, so a fix upstream reaches every shot.
- **Runtime:** the Three.js app (`npm start`) stays as the T2 preview, a town walkthrough and the legacy HOUR-5 film. It is not the final renderer for close-ups.

## 4. Milestones (do them in order; parallel lanes within each)

| ID | Milestone | Done when | Lanes |
| --- | --- | --- | --- |
| **M0** | Clean repo and plans | Done 29 Oct 2026 | — |
| **M1** | **Story-lock prerequisites** | Diegetic clock audit, apartment door/floorplan rule, café ignition/geometry rule, wrist side, v4.2 cast and cue sheet all decided and written in `docs/production/continuity/` | 01 (lead), 02, 03 |
| **M2** | **Look test** | One café frame in each tier (T0 Ganaa + bowl close-up, T1 two-shot, T2 forecourt wide) with the shared grade. **User approves the look.** | 05 (lead), 02, 03, 04 |
| **M3** | **Café proof** (beats 15–17) | Ganaa, Hürel and Dasha blocked, animated, lit and rendered to a short cut with scratch audio. User shot review. | 08 (lead), 06, 05, 07 |
| **M4** | **EP01 animatic** | All 26 beats as a timed grayscale animatic with scratch voices. The three test sections from the beat sheet (03:20–05:50, 14:25–18:30, 21:05–25:00) go first. Blind screening questions answered. | 08, 07, 01 |
| **M5** | **EP01 production** | Every shot at final tier, graded, mixed, and exported at 1080p24 with Mongolian subtitles | all |
| **M6** | **EP02 prep** | Hospital/maternity environment, Oyun, Bolor, Narantsetseg, infant Naran (base I), Sükhee's bite state | 01, 02, 03, 04 |

## 5. Rules for every agent

1. **Human approval gates.** Character designs (DNA stays `draft`), the look (M2), and every finished shot need the user's approval. Show images and name the failures; never claim approval.
2. **Stay in your lane.** Write only under the paths your department owns (see the [README](README.md)). For anything outside them, write a request into the owning plan's "Inbox" section, or ask the user.
3. **Generated vs. manual.** Builders replace their output folders. Keep hand work in `work/` or source layers, never inside generated output.
4. **Machine limits.** Intel Iris Xe, 16 threads, 14 GB RAM, Blender 5.2.2 LTS.
   - Run one heavy Blender job at a time, in background mode (`blender -b`).
   - The user's open Blender (MCP) may hold the city map. Don't load characters into it.
   - `/tmp` is a 7.5 GB RAM disk. Put iteration builds in `~/.cache/khaniad-builds/<id>-<tag>` and delete them once published.
5. **Story facts are law.** The tea bowl does not infect anyone. Altan is 3. The infant at the party is Tungalag's baby, not Naran. The satchel stays in the disabled, *not burned-out* KAMAZ for EP08. The protected line stays word for word. No monster point-of-view shots, red eyes, or self-explaining speeches.
6. **Git.** Work on a branch `agent/<dept>/<task-id>`, make small commits, and run `npm test` before merging. Commit or push only when the user has asked. Never commit build caches or renders (`output/`, `episodes/*/renders/` are ignored).
7. **Reporting.** End each task by updating your plan's task table (status, evidence path) and saying plainly what is unfinished.

## 6. Hand-off contracts

| From → To | Contract |
| --- | --- |
| 01 → all | `docs/production/continuity/EP01-clock.csv` (one row per event), `EP01-states.md` (costume, wound and prop state per beat), `EP01-cast-v4.2.md` |
| 02 → 06/08 | Published actor = DNA + `Character-Master.blend` + `character.glb` + QA, listed in `assets/cast/dna/manifest.json`. Close-up shots also need a T0 variant (see 02). |
| 03 → 08 | One `.blend` per location, with named `ANCHOR.*` empties for actor marks and doors, scene-isolated GLB exports, and a QA report |
| 04 → 03/08 | `assets/props/library.blend` collections, one per prop, with state variants (e.g. `KAMAZ.intact`, `KAMAZ.disabled`) and a T0/T2 version where both are needed |
| 05 → 08 | `assets/look/` light-rig collections per location and time of day, plus the grade (compositor node group + Three.js equivalent) |
| 06 → 08 | Actions named `<shot>_<actor>_v###`, plus face/lip-sync data on the actor's shape keys |
| 07 → 08 | Scratch and final dialogue WAVs per line ID, room tones, effects and mix stems per shot |

## 7. Decisions still needed from the user

Agents: when one of these blocks you, stop and ask, and don't guess.

1. Delivery aspect ratio: 16:9, or 4:3 for PS2 authenticity?
2. Voices: native Mongolian actors for the scratch read (the beat sheet asks for this), or synthetic placeholders for the animatic only?
3. Which wrist Dasha bites (the continuity card needs it before the café shots)
4. Delivery target (YouTube, festival, other), which sets loudness and subtitle format
5. Music: none, sparse score, or diegetic only (radio, the family song)?
