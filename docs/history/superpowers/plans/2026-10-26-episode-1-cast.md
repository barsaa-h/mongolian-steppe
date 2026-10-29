# Episode 1 cast production

> Historical implementation plan/specification. Current source authority, chosen design, Episode 1 status and remaining work are in [Character Master](../../../../artifacts/character-master/README.md). Its [jobs](../../../../artifacts/character-master/production/JOBS.md) now prioritize the café test; completed boxes here describe the original implementation scope, not finished-shot approval.

Use the approved reusable MakeHuman/MPFB Blender source and retain its editable
anatomy, separate clothes/hands, 137-bone rig, packed materials and GLB output.
Read the full available animation script and preserve exact source ages/roles.

- [x] Read cleaned dialogue Episodes 1–5 and all available bible outlines; identify Episode 1 cast.
- [x] Research period Mongolian references and document evidence versus artistic decisions.
- [x] Create recipes for nine principal roles, the unnamed opening runner and three anonymous young-adult party guests.
- [x] Build unique faces, appropriate ages, skin detail, hair, role-specific clothes and required visual identifiers.
- [x] Preserve healthy/infected state distinction for Ganaa and Dasha; do not alter existing film assets.
- [x] Export Blender/GLB, render face/body comparisons, verify actual files and provide a stable cast inspector.

Scope: new artifacts/episode-1-cast plus selected CC0 dependency additions.
Do not replace assets/cast or existing character-master presets/outputs, change
screenplay, animate entire episode, invent voice bodies, or use paid Tripo runs.
Reuse the existing master generator via a thin episode-specific build adapter.

## Review and verification

One fresh-context review found no important code/data correctness defects.
The three recipe tests preserve nine canonical identities and script ages,
exclude voice-only roles, validate local targets/assets, require distinct facial
recipes and verify toddler/infection continuity. Additional core assets were
retrieved from the official second mirror with ZIP CRC and per-file SHA-256
checks (107 files). The first mirror was too slow.

First native verification passed all 13 files: complete source bodies, active
shape keys, 137 bones/30 finger bones, packed images, required props, finite
geometry at frames 1/25/49. Full actual-GLB browser verification passed all 13:
loading, skin weights, wrist shading, moving vertices, state controls, portrait
board, mobile width and no request/page errors. The existing five-preset master
browser regression also passed after adding optional inspector settings.

Art QA changed the toddler hair to expose her face, strengthened facial shape
contrasts, softened procedural creases, and fit Dulmaa's sash/trim against the
evaluated garment surface rather than the original unfitted coordinates.
Final verification after the last trim adjustment passed all 13 native files and all 13 GLBs; the portrait board and story-state checks passed. The final tied-back/short hairstyles were rebuilt and included in that verification.

## Face revision — user feedback

- [x] Inspect shared eye assets/materials and original face renders.
- [x] Give all 13 recipes individual eyelid/inner-fold, cheek, jaw, nose and mouth targets.
- [x] Strengthen East Asian appearance while retaining Irina/Dasha's prior casting, as explicitly requested.
- [x] Replace 96-vertex eyeballs with fitted 1,064-vertex smooth eyes; correct roughness/iris saturation and remove visible stock lash cards.
- [x] Rebuild all native files/GLBs and face/body renders, refresh gallery and embedded recipes/guides.
- [x] Verify all 13 native files and actual GLBs, source hashes, recipe/export equality and download links.

Verification: four recipe tests, five master configuration tests and all 38
project tests passed. Native/browser reports both passed 13 actors, including
new eye geometry/material checks, deformation, packed textures, wrist shading,
story states, portraits and mobile width. Original lash assets remain available
in hidden AUTHORING; visible lash cards caused the eye spikes. New high-poly eye
sources retain their CC0 license and a separate three-file SHA-256 manifest.
The live gallery was opened in the in-app browser and left in face inspection.
No new facial performance animation, blinking or lip sync was authored.
