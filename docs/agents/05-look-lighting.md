# 05 — Look & lighting agent

**Mission:** own how ХАНИАД *looks*. That means PS2-era horror, with high-resolution, detailed close-ups, and one grade that holds across Blender and Three.js. Light every location for its story time of day.

**Owns:** `assets/look/` (lookdev scene, light-rig collections, grade node groups, reference boards, test frames), `src/psx.js` (runtime post-processing), and the lighting collections inside shot files.
**Decision (user, 29 Oct 2026):** "PS2-era horror, but close-ups in higher resolution and detailed." See the tier table in [00 §2](00-production-master-plan.md#2-the-look-ps2-era-horror-high-resolution-close-ups).

## The look in one paragraph
Wide shots feel like a 2002 console game running in-engine: modest textures, depth swallowed by fog and coal smoke, a few hard practical lights, a low-saturation cold palette. As the camera comes closer, the image becomes the "pre-rendered cutscene": skin pores, wet eyes, knitted wool, chipped enamel, sweat at the temple. Grain and fog tie the two together, so the switch never looks like two different films. The horror comes from what the light *doesn't* show.

## Palette & light motifs (from the scripts)

| Motif | Rule |
| --- | --- |
| Cold outside | Late-November steppe: blue-grey daylight, low sun, early dusk. Frost and breath vapor. Exterior night is sodium/tungsten streetlamps with deep fall-off. |
| Warm inside | Tungsten bulbs, coal-stove orange, steam. Warmth means hospitality, and later it is what draws the infected. Keep warm light sources visible in frame. |
| Heat = danger | Steam pipes, heaters and boiler glow get a slight bloom and are motivated in every shot where infected are present |
| Time passing | Beat 08's border wait shows hours passing through the light alone: morning glare → late sun. Use S01's clock for each shot's sun position. |
| Birthday | Mixed sources in a cramped room: ceiling bulb, candles at beat 22, light spilling from the hall. Beats 24–26 get darker as attention narrows. No red-eye or monster point-of-view effects. |
| Fire (beat 18) | A *localized* flame near the dispenser: flicker on faces and the cab, with smoke catching it. It must not look like a fuel-pump explosion. |

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| L01 | **Reference board** `assets/look/reference/` | PS2-era horror mood frames for each tier, used for analysis only (palette, fog density, grain size, texture resolution). Plus real 1990s Mongolian winter town and interior reference. Annotate what to take from each frame. **No** copying of game assets or shots. | open |
| L02 | **Lookdev scene** `assets/look/lookdev.blend` | A neutral turntable, a Macbeth/grey chart, the three tier cameras (T0 85 mm close-up, T1 35 mm medium, T2 24 mm wide), and the café light rig. It links in Ganaa and the bowl. | open |
| L03 | **Grade** | A Blender compositor node group `KHANIAD_Grade` (fog/depth haze, film grain, halation, a film-like tone curve, slight vignette, optional 4:3 safe frame) and the matching Three.js pass in `src/psx.js`. Retune the PSX look into PS2: **remove vertex snapping, affine warping and dithering**, keep low internal resolution as an option for T2, add exponential fog and grain. A side-by-side Blender vs. Three.js frame should be hard to tell apart in a wide shot. | open |
| L04 | **M2 look test** (lead) | Three café frames: T0 Ganaa face with the bowl, T1 Ganaa and Hürel two-shot, T2 forecourt wide with the KAMAZ. Record render time and memory per frame on this laptop. **The user approves, or gives notes.** | open |
| L05 | **Render budget** | From L04 timings, a per-tier budget for 36,000 frames. Eevee by default; list the shots that justify Cycles. A target such as ≤ 40 s/frame (T1) and ≤ 3 min/frame (T0) is a proposal to check against the timings, not a given. | open |
| L06 | **Light rigs per location × time** | Freight yard pre-dawn and morning; border day → late sun; Naran morning and midday; apartment afternoon and night; café late afternoon + fire; livestock cab at night; hospital gate at night. Each is a linkable collection. | open |
| L07 | **Winter atmosphere** | Coal smoke volumes, breath vapor, frost and steam settings, shared with 03 and 06 | open |
| L08 | **EP02 hospital lighting** | Fluorescent tubes, backup-power switch-over (ventilation slows, lights change), maternity wing. M6. | open |

## Rules
- The grade is one node group/pass, versioned. Shots link it and never fork it.
- Every light is motivated: a bulb, the stove, a window, a streetlamp, the fire, a flashlight.
- Check skin under every rig with 02's T0 actors. Make sure the eye area never goes dead or shiny-plastic.

## Inbox
_(other agents add requests here)_
