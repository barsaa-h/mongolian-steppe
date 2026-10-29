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
3. EP01 production notes for v4.2 ([`v4.2-pack/`](../../artifacts/character-master/sources/story/v4.2-pack/)): the working story clock, the kitchen-door blocking, the QA fixes and the pacing audit. EP01 timing ([`v4.3-timing/`](../../artifacts/character-master/sources/story/v4.3-timing/)): a timing overlay (birthday 90 s, kitchen door 64 s), a 197-cue recording manifest (`EP01-VO-###`), and the editing timeline.
4. EP02 opening: the [v4.2 opening](../../artifacts/character-master/sources/story/EP02_v4.2_OPENING_5_MIN_CONTINUITY.md) (replaces v4.1) and the [v4.0 bridge](../../artifacts/character-master/sources/story/EP02_Emotional_Handoff_and_Continuity_v4.0.md).
5. Season, infection rules, geography and resources: the [v3 bible](../../artifacts/character-master/sources/story/khaniad-season1-v3-ten-episode-story-bible.md). Physical world: the [World Bible](../../artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md).

6. Creator context: the user's own handoff `~/Downloads/KHANIAD_CONVERSATION_HISTORY_PLUS_COMPLETE_PROJECT_MASTER_2026-10-29.md`, sections 0–12. It is outside the repo; it's a reconstruction of the ChatGPT conversation, not a verbatim export. Its key points are summarized in §1a below.

### 1a. What the creator wants

- An adult, emotionally gripping Mongolian horror series for YouTube that international viewers can watch. After EP01–02 the audience should be thinking: *"What the fuck is happening in this town? What happens to that family? I need Episode 3."* Not just "cool zombies."
- **Make viewers love the town before it is destroyed.** Shops and kiosks, debts, neighbors, the market, the heating plant, old cars, crumbling infrastructure, ger streets, a family birthday. Minor residents have lives; they don't exist to be eaten.
- The tone is warm everyday life and dark, sometimes profane Mongolian humor turning into grounded psychological horror. Aim for one or two truly memorable scenes per episode, not a twist every minute.
- A real, lived-in 1998 town, not a flat, over-regular procedural grid. See the [city realism brief v1.1](../../artifacts/character-master/sources/world/NARAN_CITY_REALISM_AGENT_MASTER_PROMPT_v1.1.md) and its [QA checklist](../../artifacts/character-master/sources/world/NARAN_CITY_AGENT_QA_SHOT_CHECKLIST_v1.1.md).
- Limited budget and a modest laptop. Preserve existing work, keep versioned saves, and prove a vertical slice before scaling up.
- Report honestly: say what was actually inspected or run, measure durations instead of assuming them, and never claim a test that wasn't executed.

Story files under `sources/story/` are **originals: never edit them**. Changes go into a new version file, and the story agent records them.

## 2. The look: PS2-era horror, high-resolution close-ups

User decisions, 29 October 2026. The target is **Silent Hill 2 (2001)-era, human-scale stylized realism**: PS2-style low-poly stylization, but faces must show believable emotion, with correct skin, proportions, hair and eyes. It should be **not photoreal and not Lego-like**, and should read emotionally like a clean 720p cutscene rather than a muddy 480p one. Close-ups get the most detail. Treat the games of that era (Silent Hill 2/3, Fatal Frame, Siren) as mood references only. **Do not copy their designs, characters, places or shots.**

| Tier | Used for | Renderer | Texture / mesh budget | Feel |
| --- | --- | --- | --- | --- |
| **T0 Hero** | Faces in close-up, hands, hero props in insert shots (bowl, mittens, satchel, wrist, door handle) | Blender (Eevee; Cycles only for named shots) | 2K–4K textures, full MakeHuman topology + subdivision, detailed eyes, skin and cloth | The "pre-rendered cutscene" layer: rich detail, stylized, never uncanny |
| **T1 Mid** | Medium shots, two-shots, interiors | Blender Eevee | 1K textures, base topology | Detailed, with fog and grain doing more of the work |
| **T2 Wide** | Establishing shots, town, roads, crowds, background actors | Blender Eevee or Three.js GLB | 256–512 textures, LOD meshes (crowd ≤ 5k tris) | Plainly PS2: low-res textures, depth fog, limited light |

Rules shared by every tier, owned by plan 05:

- One grade across all tiers: cold, desaturated exteriors; warm tungsten and coal-stove interiors; atmospheric fog only where the weather motivates it; fine film grain; soft halation on practical lights; deep blacks that still read.
- PS2, not PSX. No vertex snapping, affine texture warping or dithering. The current Three.js `psx.js` pipeline must be retuned toward this look (task L03).
- Detail follows the story. Spend T0 only where the camera is close *and* the shot matters: the eye area, the wrist bite, the enamel bowl, the mittens, the door handle.
- Avoid gore the story doesn't need. Attacks are short and confusing, never a prolonged showpiece.

### Delivery: YouTube, full screen, best quality

- **16:9 frame at 1920 × 1080, 24 fps, Rec.709 SDR.** It fills a fullscreen YouTube player with no black bars. Compose with the action-safe area in mind, but don't letterbox.
- **Upload master: a 3840 × 2160 upscale** of the 1080p finish (Lanczos, grain re-applied after scaling), H.264 or ProRes at high bitrate. YouTube gives 1440p/2160p uploads its better codecs (VP9/AV1) and higher bitrates, so 1080p viewers also get a cleaner picture. If the render budget allows, T0 shots can render natively at 2560 × 1440.
- Mongolian subtitles burned in only for Russian lines (`[хадмал]`). Upload a separate YouTube subtitle track (SRT) for full Mongolian, plus English for international viewers.
- Audio delivered at 48 kHz, mixed to about −14 LUFS integrated, true peak ≤ −1 dBTP.

## 3. Pipeline

**Animation first** (user decision): the voices are recorded by the user **after** the animation works, and face and lip-sync animation come last.

```
story tables ─► sets/props/actors ─► SILENT animatic (cameras + subtitles + shot handles) ─► body animation ─► USER RECORDS VOICES ─► retime ─► face + lip-sync ─► light/render ─► sound, music, mix ─► YouTube
     01              03/04/02                         08                                     06                     07              08           06               05/08           07            08
```

- Animate every physical action (walking, sitting, doors, props, the truck, eating, the attack, escapes) before any voice exists. Those actions don't depend on dialogue.
- Dialogue shots carry **handles** (extra frames at the start and end) and subtitle-timed holds taken from the v4.3 timeline, so they can stretch or shrink once the real performances arrive.
- **Don't lip-sync to text durations.** Final face animation waits for the user's recordings.

- **Characters:** MakeHuman/MPFB 2.0.18 DNA, a shared 137-bone rig, `artifacts/episode-1-cast/dna/<id>.json`, built by `build_actor.py`. Never start another character pipeline.
- **Shots:** one Blender file per shot (or per sequence) in `episodes/EP01/shots/`. It **links** (does not append) maps, props and characters, so a fix upstream reaches every shot.
- **Runtime:** the Three.js app (`npm start`) stays as the T2 preview, a town walkthrough and the legacy HOUR-5 film. It is not the final renderer for close-ups.

## 4. Milestones (do them in order; parallel lanes within each)

| ID | Milestone | Done when | Lanes |
| --- | --- | --- | --- |
| **M0** | Clean repo and plans | Done 29 Oct 2026 | — |
| **M1** | **Story tables** | v4.2 cast reconciled, state tables per beat, clock and blocking sources turned into `docs/production/continuity/`. Most of the inputs already exist in the v4.2/v4.3 packs. | 01 (lead) |
| **M2** | **Birthday vertical slice** `EP01_BIRTHDAY_ANIMATIC_v0.1` | Apartment with an inward-opening kitchen door and working sightlines. Ganaa, Tsetsegmaa, Altan, Dulmaa, Tungalag + infant, Sükhee. The mitten handover. A silent **90 s birthday edit** and a **64 s door follow-up**, timed to the v4.3 timeline with subtitles. Camera views proving door-blocking checks (a)–(f). Shot list, thumbnails and an open-collision list. **User review.** | 08 (lead), 03, 06, 02, 04 |
| **M3** | **Look test** | The M2 frames plus café frames in each tier with the shared grade. Render time measured. **User approves the look.** | 05 (lead), 02, 03, 04 |
| **M4** | **Café action slice** (beats 15–18) | 60–90 s of physical action: banter blocking, the attack, the run to the truck, the wrist bite, the crash and the localized fire, all against the v4.2 text | 08, 06, 03, 04 |
| **M5** | **Full EP01 silent animatic** | All 26 beats, cameras, rough gestures, entrances and exits, vehicle staging, subtitles and handles. A measured runtime (don't force 25:00). Blind screening. | 08, 06, 01 |
| **M6** | **Body animation** | Every shot's physical performance done and checked for penetration and foot slide | 06 |
| **M7** | **Voices (by the user)** | The user records every line from the manifest. Optional local voice conversion for distinct voices. Shots retimed to the real takes. | 07, 08 |
| **M8** | **Face + lip-sync, lighting, render** | Final face animation on the real audio; T0/T1/T2 renders with the grade | 06, 05, 08 |
| **M9** | **Sound, music, mix, YouTube master** | Effects, ambience, original music, a −14 LUFS mix, a 4K upload master + SRT | 07, 08 |
| **M10** | **EP02 prep** | Hospital/maternity, Oyun, Bolor, Narantsetseg, infant Naran (base I), Sükhee's bite state | 01, 02, 03, 04 |

## 5. Rules for every agent

1. **Human approval gates.** Character designs (DNA stays `draft`), the look (M3), and every finished shot need the user's approval. Show images and name the failures; never claim approval.
2. **Stay in your lane.** Write only under the paths your department owns (see the [README](README.md)). For anything outside them, write a request into the owning plan's "Inbox" section, or ask the user.
3. **Generated vs. manual.** Builders replace their output folders. Keep hand work in `work/` or source layers, never inside generated output.
4. **Budget.** Nothing may depend on paid APIs or subscriptions (no ElevenLabs/TTS). Use free, local tools.
5. **Machine limits.** Intel Iris Xe, 16 threads, 14 GB RAM, Blender 5.2.2 LTS.
   - Run one heavy Blender job at a time, in background mode (`blender -b`).
   - The user's open Blender (MCP) may hold the city map. Don't load characters into it.
   - `/tmp` is a 7.5 GB RAM disk. Put iteration builds in `~/.cache/khaniad-builds/<id>-<tag>` and delete them once published.
6. **Story facts are law.** The tea bowl does not infect anyone. Altan is 3. The infant at the party is Tungalag's baby, not Naran. The satchel stays in the disabled, *not burned-out* KAMAZ for EP08. The protected lines stay word for word: Ganaa's flu line, and Erdene's later exhausted «…Пизда.». Natural adult Mongolian profanity stays; never censor it into a children's register. No monster point-of-view shots, red eyes, or self-explaining speeches. No traffic lights in Naran. Use only original music and melodies (the family song is original; no unlicensed songs).
7. **Git.** Work on a branch `agent/<dept>/<task-id>`, make small commits, and run `npm test` before merging. Commit or push only when the user has asked. Never commit build caches or renders (`output/`, `episodes/*/renders/` are ignored).
8. **Reporting.** End each task by updating your plan's task table (status, evidence path) and saying plainly what is unfinished.

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

## 7. Decisions

Answered by the user, 29 October 2026:

1. **Frame/delivery:** YouTube, fullscreen, best quality → 16:9, 1080p24 finish, 4K upload master (§2).
2. **Voices:** the user will voice every role personally, **after the animation is finished**. No TTS. Local pitch, formant or voice-conversion tools (Audacity, Praat, RVC/Seed-VC) may be auditioned for distinct voices, especially female voices. Guaranteed anonymity isn't possible. Horror doesn't need screaming.
3. **Bite side:** delegated to Claude → **left wrist**. The KAMAZ is left-hand drive, so Ganaa pulls the driver's door shut with his left hand and Dasha bites that wrist. His right hand is the "good hand": he guides the mitten with it, catches the kitchen door edge with it, and braces the door with it (good shoulder + right hand). He lifts the bitten left hand away from Altan's fingers.
4. **Platform:** YouTube.
5. **Music:** yes, original. It will be developed with all sound after the animation is finished.

Still open (ask when it blocks you): a native Mongolian review of the dialogue before recording; final episode runtimes for EP02 onward.
