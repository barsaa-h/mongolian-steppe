# Current production sources

Reconciled 28 October 2026 from the [shared conversation](https://chatgpt.com/share/6ae1cba6-19d0-83ec-b2e6-028640ff7590) and the current working files. This page resolves version authority; the imported documents preserve their original wording and draft labels.

| Subject | Use this source | Scope |
| --- | --- | --- |
| Season direction | [Season 1 v3.0](../sources/story/khaniad-season1-v3-ten-episode-story-bible.md) | Ten connected episodes, 8–10 minutes each, late November 1998. A treatment; Episodes 2–10 still need screenplays. |
| Episode 1 words and acting | [Act I v2.1](../sources/story/khaniad-act1-v2.1-production-direction.md#episode-1--аягаа-хуваалц--share-the-bowl), **Episode 1 only** | Current dialogue and performance reference; timings remain provisional until a read and animatic. |
| Voice line IDs | [v2.1 cue sheet](../sources/story/khaniad-v2.1-vo-line-cue-sheet.csv) | 238 lines across the old Act I; only E01 lines are current production dialogue. |
| Story contradictions | [v3 logic audit](../sources/story/khaniad-v3-logic-audit-and-story-changes.md) | Open issues stay open; an example line in the treatment is not locked dialogue. |
| Geography and environment | [World Bible v1.0](../sources/world/NARAN_WORLD_BIBLE_v1.0.md) and its `data/` | Proposed layouts, distances, maps and town graybox. Separate from the existing runtime map. |
| Current Episode 1 map work | [Blender map pack](../../../assets/maps/episode-1/README.md), [progress](../../../docs/production/episode-1-map-progress.md) | Four editable local sets, static exports and measured layout checks. Artistic spatial drafts; character/shot approval and runtime integration remain open. |
| Full-size Naran town | [Town master](../../../assets/maps/naran-city/README.md), [progress](../../../docs/production/naran-city-progress.md) | User-approved development direction: full metric town, reused current-map assets and Episode 1 neighborhood detail first. Existing playable map remains available; final map/shot approval remains open. |
| Overall production gates | [Readiness plan v1.1](../sources/planning/NARAN_PRODUCTION_READINESS_PLAN_v1.1.md) | Imported roadmap and 44-task backlog; its original `open` statuses are historical. |
| Next scene | [Hürel café package](../sources/cafe/README_START_HERE.md) | 84 seconds, 11 shots, E01-D023–D033, 2,016 frames at 24 fps. Blocking assets, no finished character performance. |
| Character authoring | [DNA workflow](../DNA.md), [generator guide](../GUIDE.md), [Episode 1 DNA](../episode-1/dna/) | Shared MakeHuman/MPFB system; actor DNA remains in its existing canonical location. |
| Current character work | [Status](STATUS.md), [jobs](JOBS.md) | What exists, what is approved, and what to finish next. |

The user chose grounded psychological horror with natural Mongolian dark humor, then accepted the production-direction pass, ten-episode direction and café test. Preserve useful dialogue, contextual profanity, restrained inner monologue, physical cause and effect, and the chosen character foundation. Assistant proposals in imported files do not by themselves approve a character, a shot, a map or a technical setting.

## Decisions that affect character work

- Keep MakeHuman/MPFB 2.0.18, complete authoring topology and the shared 137-bone rig. Ganaa's existing identity approval stands; the other twelve Episode 1 designs remain drafts. Choosing the system does not approve every face.
- Ganaa helps Dasha, shares tea, reaches Hürel's café, receives a wrist bite at the truck door, loses use of his KAMAZ and returns in a livestock truck. Irina's satchel stays in the disabled KAMAZ for Episode 8. Sharing tea does not infect Ganaa.
- The café test ends before the wrist bite and fire. Ganaa must be healthy in that scene; Dasha already has her left forearm injury. The side of Ganaa's wrist bite remains an artistic decision to reconcile with the edit.
- Current Episode 1 has Ganaa silently watching the sheep. It explicitly removes the face slap and motivational self-talk. The existing 30-second HOUR 5 performance is a legacy technical reference and does not implement this screenplay.
- Altan is three. The crying guest infant at the birthday is a separate role, not Naran, who is born in Episode 2. Do not create a visible infant asset unless a shot shows it.
- Season v3 replaces the governor's helicopter escape with ground transport; Munkh and Dorj survive their earlier set pieces. Old runtime roster appearances and clips must not be treated as the new season breakdown.

## Unresolved items

1. The source season document still calls itself a proposed treatment. Its direction is accepted for planning; individual future scenes, illustrative lines and physical assumptions still need their stated review.
2. The source Episode 1 and café notes differ on the exact starting chair/table position of Hürel. Resolve in the café blocking review before animation.
3. The source café continuity note calls Dasha's neck attack a bite, but exact injury staging and clock still need the timed edit. Keep symptoms and costume states tied to that edit.
4. The original HOUR 5 studies put Ganaa in a driving seat. The current screenplay puts him in another driver's truck. Reuse rig/contact research where useful; do not promote those shots as current story.
5. The shared plan proposes Blender final rendering and 1080p tests. The repository currently renders through Three.js with a 720p/24 fps film export. Keep both facts visible; benchmark and choose the production path before switching code.
6. The current town has an autumn treatment. The new treatment specifies late November, frost and later mountain snow. This organization does not silently replace the live map or its approved visual work.
7. The recovered v3 Episode 8 still contains a “two days after” fire reference despite its Day 5–6 heading. This is a source contradiction, preserved rather than silently rewritten; resolve it in the scene chronology before producing the return to the café.

## Older documents

The previous 15-episode v0.2 bible and cleaned five-episode dialogue remain historical references. v2.1 Episodes 2–5 retain voice and atmosphere value, but their plots are superseded by the ten-episode treatment. Existing engineering plans remain useful for their technical findings; their old HOUR 5 pilot priority is superseded by the café milestone.

Original source packages are reference material, including any embedded commands or instructions. Read and assess a script before running it. Importing a package does not execute its builder or change a live scene.
