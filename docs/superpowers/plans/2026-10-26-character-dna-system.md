# Character DNA System Implementation Plan

> Historical implementation plan/specification. Current source authority, chosen design, Episode 1 status and remaining work are in [Character Master](../../../artifacts/character-master/README.md). Its [jobs](../../../artifacts/character-master/production/JOBS.md) now prioritize the café test; completed boxes here describe the original implementation scope, not finished-shot approval.

> Execute inline in the existing checkout; preserve unrelated work and leave changes uncommitted.

**Goal:** Make characters data-driven and prove facial differences independently of costume.
**Architecture:** Adopt the existing pinned MPFB/CC0 mesh, rig and target library. Compile semantic DNA into the existing generator. Keep identity and age data separate; add expression-only shape keys to the generated neutral geometry and export them to GLB. Reuse fitted clothes and source topology.
**Tech Stack:** Python, Blender/MPFB, Three.js, existing Pillow/Playwright.
**Spec:** User attachment `13c558ce-6c75-4cd0-a7f9-d6d1eff358e8/Pasted text.txt`.

## Global constraints

- Preserve canonical script ages/identities and Irina/Dasha's casting.
- Existing game/film assets and master presets remain compatible.
- Child/adult/elder baselines share topology/rig; children use pediatric morphs, not uniform adult scaling.
- Ancestry palettes are art direction, not measured ethnic averages or claims about individual ancestry.
- No customization UI; agents edit DNA. No paid service or new runtime dependency.
- DNA remains draft until human review; no automatic creative approval or locking.

## Review focus

- NaN, misspelled controls, unsafe paths and age/base contradictions fail validation.
- Changing age leaves identity values untouched; duplicates are caught even when clothes/skin differ.
- Expression neutral restores exactly; blinks and mouth shapes survive export and do not alter identity.
- Clothing stays fitted after body changes; toddler detail restrictions survive generation.
- QA renders use the same framing/material/visibility, so hair and color cannot hide similarity.

## Units

1. DNA and diversity: semantic control catalogue (~55), child/adult/elder recipes, constrained deterministic drafting, full validation, migration of 13 characters, face-group distances and age/body spread. Tests for invalid input, deterministic output, age independence and duplicate rejection.
2. Native shape/material layers: source-index preservation, additive neutral/smile/frown/blink/A/E/O/M shapes, eyebrow thickness/color, eye finish, skin detail and optional stubble. Keep source libraries and fitted costumes. Native and GLB checks must exercise morphs.
3. QA: neutral matching-material bald head lineup and grayscale counterpart, front/three-quarter/profile turnarounds, expression sheets, talk/bend deformation checks, diversity report. Produce an HTML QA report and linked image artifacts.
4. Workflow: make DNA authoritative for all 13 builds; compile old recipes only as generated outputs, link DNA/QA in gallery, record asset library and agent instructions. Rebuild all 13 and run unit/native/browser checks plus existing project tests. Perform independent final review.

## Verification

- Focused Python unit tests, project tests and syntax checks.
- All 13 native files and GLBs: packed assets, same rig, source body, finite deformation, live expression morphs, exact neutral recovery, metadata consistency.
- Visual inspection of head-only lineups/profiles/expressions; report similarity failures rather than silently rerolling named principals.

## Completed verification

- Rebuilt all 13 actors from full DNA: 60 identity controls, separate age/body/appearance fields, seven additive expressions, shared source topology and rig. Irina and Dasha retain the agreed casting. Unstated exact script ages remain null; Hurel and the guard use the artistic midpoint 55 for the stated 50s.
- Passed 8 DNA, 5 recipe and 5 legacy configuration tests, plus all 38 existing project tests. Syntax and whitespace checks passed.
- All 13 native files passed complete source topology, rig, packed assets, facial attachment movement, finite expressions, exact neutral recovery and animation checks (`/tmp/dna-final-native.log`).
- All 13 exported GLBs passed the browser checks, including all facial attachments, Talk_Check, wrist seams, rig motion, gallery/mobile behavior and rejection of a wrong character GLB (`/tmp/dna-final-browser.log`). The strengthened neutral comparison uses evaluated skinned coordinates on both sides; raw bind coordinates are a different space.
- All five original master presets passed the browser regression (`/tmp/dna-final-master-browser.log`). Browser checks used the installed Brave 156.1.98.60 with Playwright; no product dependency changed.
- Generated and inspected the matching-material bald lineup, grayscale counterpart, profiles and expression views (`artifacts/episode-1-cast/qa/`). The full source body removes costume-mask cutouts from these comparison renders. Regional face distances pass; this does not replace human visual judgment.
- A separately seeded background draft was built end to end outside the cast (`/tmp/character-dna-new-guest`), demonstrating generation without manually modelling a new actor.
- Independent six-lens review finished with no unresolved code findings. Review artifacts: `/tmp/compound-engineering-1000/ce-code-review/20261026-234402-0c7375fe/review.json`. Its non-blocking advisory notes that phase tests check bandage visibility but do not assert skin color/roughness changes.

## Human review and limits

All identities remain drafts. The profile and neutral lineup show different jaw, nose, cheek and head proportions, but passing a distance threshold does not establish final casting quality. Hair edges and subtle eyelid finishing still need an art pass. The generic expressions and bend/talk clips are technical checks; production dialogue, scene-specific cloth/contact and full infection makeup remain separate work. Existing film/game actors were not replaced.
