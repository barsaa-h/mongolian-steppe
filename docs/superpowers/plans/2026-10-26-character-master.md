# Character Master Implementation Plan

> Historical implementation plan/specification. Current source authority, chosen design, Episode 1 status and remaining work are in [Character Master](../../../artifacts/character-master/README.md). Its [jobs](../../../artifacts/character-master/production/JOBS.md) now prioritize the café test; completed boxes here describe the original implementation scope, not finished-shot approval.

**Goal:** Deliver a clean, modular, agent-editable character source with verified
adult/child and body-build variations.

**Architecture:** A thin Blender build script uses pinned MPFB services and CC0
system assets. JSON presets are the interface; native sources remain editable,
and GLB exports need only Three.js.

**Spec:** `docs/superpowers/specs/2026-10-26-character-master-design.md`

## Scope

New work belongs in `artifacts/character-master/`, with pinned source dependencies
in `assets/sources/`. Do not edit unrelated dirty files or install global add-ons.
No dependency on the LISA mesh or textures in the reusable master.

## Tasks

- [x] Acquire pinned MPFB source and required core assets; retain licenses and
  hashes. Prove programmatic creation, skin, fitted clothes and a finger rig in a
  separate Blender background process.
- [x] Add JSON validation and deterministic agent build script. Preserve the
  full body in the native file, fit all layers, pack textures, export GLB and
  provide named shape controls/target inventory. Test bad values and paths.
- [x] Build default and four representative variations. Render default face,
  neck, hands and layer boundaries; inspect/refine materials and garment fit.
- [x] Add a minimal inspection page and actual-GLB browser check. Verify separate
  clothes, rig/fingers, normalized weights, finite poses, and preset differences.
- [x] Document exact commands, edit points, provenance, verification and limits.

## Review focus

Age and height must not produce miniature adults; skeleton changes must follow
the actual morphed body; garments must remain separate and fitted; authoring body
must survive clothing masks; bad configuration must fail before writing outputs.
The first release proves the included assets and representative presets, not an
unlimited wardrobe or polished motion library.

## Implementation notes

The source is MakeHuman/MPFB, with CC0 graphical assets and a pinned 2.0.18
background authoring dependency. LISA topology remains in its earlier study.
The render copy keeps clothing coverage masks; the complete native body retains
19,158 vertices. This prevents shirt penetration without losing the source body.
The core stitched outfit is separated at the fitted waist; adding arbitrary
wardrobe templates is outside this release.

Review identified independent smooth normals at cut wrists. The GLB regression
check failed with a normal-vector difference of 0.398 at 23 shared positions per
wrist. Face extraction now preserves source vertex normals. Final verification
checks every generated preset for matching normals at those boundaries.

Ruling: keep this character workflow in new artifact/source directories and do
not integrate or commit unrelated existing game changes. No global add-on install
or destructive changes to the open Blender scene are needed.

## Verified outcome

- Five JSON validation tests pass; viewer and browser-check JavaScript syntax pass.
- All five builds finish with CHARACTER_BUILD_OK on Blender 5.2.2 LTS.
- Native checks pass for five files: complete 19,158-vertex authoring bodies,
  editable shape keys, 137 bones, 30 finger bones, nine packed images each,
  separate parts, and finite geometry at frames 1, 25 and 49.
- Actual-GLB browser checks pass for five files: 12 skinned meshes each,
  normalized four-weight skinning, texture loading, moving finite vertices,
  and 23 shared positions on each wrist with matching normals.
- Heavy waist width exceeds the equivalent male baseline by over 5%; child head
  fraction exceeds default by over 10%; tall body height is 1.90 m.
- Desktop/mobile inspection controls pass without browser errors or horizontal
  overflow. Studio full-body, face, hand and bent-hand renders were inspected.
- All 110 selected core asset file hashes match their provenance manifest.

Limits remain those in the guide: this is an editable master, not a finished
Silent Hill 2 reproduction, PS2 LOD, animation pack or universal wardrobe.
