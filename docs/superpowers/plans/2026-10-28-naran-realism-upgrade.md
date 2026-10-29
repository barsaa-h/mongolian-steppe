# Naran realism upgrade implementation plan

> **For agentic workers:** Use superpowers:executing-plans for the shared Blender scene; period research and narrative audit may run independently.

**Goal:** Improve the existing town's geography, ordinary economic systems, neighborhood identity and cinematic usefulness while preserving its narrative layout.
**Architecture:** A versioned native scene, retaining existing assets and shared geometry; deterministic development layers authored with the current Blender helpers. Original master, registry, story sources, Episode 1 sets and runtime stay unchanged.
**Tech Stack:** Blender 5.2.2 / bpy, Python standard library + existing NumPy/Pillow/Matplotlib, existing town/source kit and Ganaa scale reference.
**Spec:** User's “KHANIAD — NARAN CITY REALISM UPGRADE”, 28 October 2026; research `docs/research/naran-1998-environment.md`; narrative ledger `docs/production/naran-realism-story-constraints.md`.

## Global constraints

- One Blender unit = one metre. N01–N20 IDs and XY, protected arrival/entry and institutional access routes remain unchanged.
- Never save over `Naran-City-Master.blend`; backup to `realism-v1/source/Naran-City-Before.blend`, output `realism-v1/Naran-City-Realism-v001.blend`.
- Existing live UI was stale: baseline and version derive from the latest disk master whose recorded SHA is verified.
- Style: grounded early-2000s horror, late-November 1998, maintained and struggling households both represented; no modern furniture/advertising/fleets/traffic lights.
- Generated additions must have a household, business, utility, movement, agriculture or climate purpose. S0 intact; later outbreak layers disabled.
- Research facts, typology borrowed from later sources and artistic choices remain labeled separately. No new character identity or geometry.
- No commits, external publication or runtime replacement requested.

## Tasks

1. Audit/backups: record master hash, scene metrics, protected objects/routes; fixed review camera manifest. Capture before aerial/street/apartment/ger/market/entrance/agriculture views. Record repetitive footprints and missing systems.
2. Geography: continuous town-to-hills surface, shallow drainage and terrain-informed outer land use; regrade existing non-story placements and roads with bounded terrain changes. Validate road grade/support and keep landmark pads/access.
3. Neighborhood systems: adapt existing compounds to constrained mixed household families with irregular fences/gates, privies/sheds/fuel/water/paths; varied maintenance. Add working commerce at real stops/frontages, practical deliveries, apartment courtyards/service structures and institutional boundaries with actual access gaps.
4. Variants/detail: facade/roof/balcony repair families, three meaningful road surface families, grain/rail/coal working yards, harvested/fallow fields/farm tracks/hay/animal pens/period-style farm equipment. Use shared meshes and batch tiny repeated detail by material/district where editable root identities are unnecessary.
5. Cinematic polish: inherited Ganaa reference at 1:1, warm practical windows, cold daylight, shallow lee snow and localized use stains. Prioritize EP1 entrance/apartment and street shots; retain consistent before/after cameras.
6. Validation/delivery: native preservation + access + terrain + road/prop clearance + finite geometry/packed image checks, final fresh-context review, matching renders, revised master map, asset/variant catalog, change/assumption/remaining-work ledger and measured performance report. Reopen final saved file and check original source hash; run Episode1 preservation check and relevant Python self-checks.

## Review focus

- Hidden template transforms must remain local-hierarchy based after reload; preserved source meshes must not be modified through shared data.
- Detail cannot obstruct protected entrances, vehicle routes, hospital gaps or school gate/escape routes.
- Changed terrain must not bury roads or float existing buildings; no finite backdrop edge/void in agreed cameras.
- Household variation must preserve connected gates/paths and plausible use rather than randomized poverty.
- Performance report distinguishes native editing/render cost from untested real-time playback. Numerical geometry checks do not approve historical specificity or cinematic art.

## Evidence strategy

Characterize original native/render state before visual changes. New layout math gets assert-based tests before implementation; native output checks compare to immutable baseline and registry. Art-only surfaces use matching renders and visual review instead of mirrored implementation tests. Existing town geometry checks are reused read-only; no original exporter is run because it saves over the original master.
