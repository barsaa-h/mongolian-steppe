# Character DNA System Implementation Plan

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
