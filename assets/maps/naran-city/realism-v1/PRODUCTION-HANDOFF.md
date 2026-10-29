# Environment department handoff — 29 October 2026

Checked against `docs/agents/00-production-master-plan.md`, `03-environments.md`, `04-props-vehicles.md`, `05-look-lighting.md`, current `SOURCES.md`, EP01 v4.2 beats03/04/19–21 and the v4.0 beat sheet. This document supersedes older EP01 staging assumptions in the baseline audit for use of this review package. It does not rewrite source story files or approve a shot.

## What this version can hand over

The current native exterior is `Naran-City-Realism-v001.blend`, SHA `c7e9e5c3ffc5cb9b0bf3f810e35b1d78ab59a0f290474964a3b923f922731e0a`. It has 33 passing native checks, seven layout unit tests and eight matching rendered comparisons. The original native/autumn baseline, all 20 registered landmark XYZ, all 60 original roads and separate Episode 1 sets remain intact. Use the source file and linked collections as a town layout resource, not a shot-ready location package.

The final correction cleared Household.062's full 1 m approach around Household.058; independent polygon clipping confirmed all 411 parcels/412 approach segments clear neighboring yards. Numerical checks remain bounded static evidence, not exhaustive collision or action approval.

## Task status against the new plan

| Task | Delivered here | Still required |
|---|---|---|
| E01 apartment | N12 exterior, open entry/unloading pocket and scale reference. | Current interior: inward-opening kitchen door with hinge/no lock/bracing; 12–18 late-party actor marks, bedroom/infant egress, sound and camera checks. Roughly 40 visitors are spread over the evening. |
| E02 café/M2 | No café geometry changed. | Guard/dispenser/electrical fitting, localized fire and satchel-safe disabled cab geometry; T0/T1 look-test areas. |
| E03 new sets | Market, ordinary businesses, roads, apartment courts and hospital anchors provide reusable geography. | Dedicated Nyamka interior, market hero street/clinic frontage, customs, livestock road, hospital junction/gate; `ANCHOR.*` action marks and isolated character-free GLBs per scene. |
| E04 tiers | Existing/new low-poly exterior modules and measured native cost. | T2 texture/LOD and texel-density audit; T0 hot zones and linked shot packaging. The 1024 px town ground atlas is a draft map texture, not evidence of approved T2 budgets. |
| E05 winter | Separate late-November native, terrain/horizon/drainage, lee frost/water-point ice, preserved autumn master and empty disabled S1–S4. | Trodden snow, coal-smoke atmosphere, more convincing frozen puddles and specific morning action surfaces. Partial, not done. |
| E06/E07 | Hospital/school/industrial exterior context retained. | Medical interior/timing and all future actor/door/action tests; deferred milestones remain deferred. |

## v4.2 route and everyday-action differences

- The amber route on the map is the **legacy 2.67 km north-entry-to-apartment study** retained to protect prior layout. v4.2 beat 20 drops Ganaa under a streetlamp at a clinic-road junction. He approaches the hospital arrow/queue, sees injury questioning, then turns home. No such actor route, queue or junction choice is staged in this file. Story S01/S05 and environment E03 must resolve the exact local staging while retaining registered geography. Do not animate the legacy polyline as if it already implements v4.2.
- Beat 03 needs a patched bus, rug action, water/coal carrying, opening ТҮЦ and children around a frozen puddle. This scene has relevant commerce/utility context and some props, but no operating bus, crowd, rug action, coal-smoke volume or frozen-puddle action surface.
- B07 is a generic converted service-window grocery. It is not an approved replacement for Nyamka's beat 04 shop interior/counter/debt drawer/cracked window/shutters.
- B04 pharmacy remains credible ordinary commerce. v4.2 has no pharmacist scene; no dialogue/role should be inferred from the building.
- Beat 14 still needs the coal-truck stop and Altan's specific viewing window, and beat 20 needs a hospital arrow/orderly/queue. Neither exterior detail nor preserved arrival metadata supplies their final blocking.

## Cross-department boundaries

The 14 new modules are local environment dressing placeholders, not `assets/props/library.blend` publications or approved vehicle models. The prop department owns published props, grip/hinge conventions and hero vehicle replacements. The current daylight is review lighting, not the approved shared `KHANIAD_Grade`, heavy-fog/coal-smoke rig or M2 look test. Render aspect 1280×800 is diagnostic, not a decision about final 16:9/4:3 delivery.

Requests are recorded in the story, props and look plans' Inbox sections. No story original, character design, runtime grade, published prop library or shot was changed while aligning this handoff.

## Execution/performance note

This iteration was rendered and validated with the installed Blender while MCP was disconnected, and the final file was opened at `Review.entrance`. Earlier validation/render jobs overlapped before the new machine guidance arrived; their timings are observations under concurrent load, not approved single-job budgets. Future heavy builds must run one at a time and use `~/.cache/khaniad-builds/` for iteration output. Final scene/render hashes remain consistent.

The technical iteration is reviewable. Human art/look approval, organic town density, exact historical/language review, actor/medical/vehicle blocking and runtime performance remain outstanding.
