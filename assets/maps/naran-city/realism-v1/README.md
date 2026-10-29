# Naran realism v001 — review package

Open **[Naran-City-Realism-v001.blend](Naran-City-Realism-v001.blend)**. This develops the existing town exterior for late November 1998. It is a production art draft, with the original world and separate Episode 1 sets preserved. One Blender unit is one metre; X east, Y north, Z up.

Start with the [matching comparisons](previews/comparisons/comparison-sheet.jpg), [master map](Naran-Master-Map-v001.png), [changes and remaining work](CHANGES.md), [variant catalog](CATALOG.md), and [performance/verification report](PERFORMANCE.md). The map also has an editable [SVG](Naran-Master-Map-v001.svg).

## Review in Blender

The file opens at `Review.entrance`, Ganaa's Episode 1 entrance. Other saved review cameras are `Review.aerial`, `Review.apartment`, `Review.ger-district`, `Review.market`, `Review.street`, `Review.ger-street` and `Review.agriculture`. Camera definitions are in [review.py](review.py); before and after use identical positions, lenses and resolution. Lighting, ground and exposure change with the art pass, so comparisons are not controlled material-only tests.

Original `NARAN | …` collections retain buildings, streets, utilities and anchors. Added `REALISM | …` collections separate work by use:

| Collection | Contents |
|---|---|
| 10 LANDSCAPE AND DRAINAGE | Continuous outer ground, local drainage, road wear, grass and hill vegetation. |
| 20 HOUSEHOLD LIFE / 21 PARCEL BOUNDARIES | Household yards, connected approaches, fuel/water/sanitation, storage and timber/metal fences. |
| 30 APARTMENT COURTYARDS | Repairs, roof fittings, play, storage, bikes and parking. |
| 40 SHOPS AND DAILY SERVICES | Market identities, kiosks, canteen, converted service window, water collection and delivery. |
| 50 INSTITUTION GROUNDS | School/hospital exterior boundaries with access gaps. |
| 60 AGRICULTURE AND WORK YARDS | Fields, hay, livestock, equipment, grain/coal/rail handling. |
| 80 S1–S4 | Empty, disabled state collections reserved for alert, damage, aftermath and hard winter. No destruction is delivered in S0. |
| 90 EXISTING ACTOR SCALE REFERENCE | Existing Ganaa hierarchy at original scale, hidden in review renders. No actor authored or changed. |
| 98 RETAINED REPLACED DETAIL | Replaced fence/fuel/yard/access details retained but hidden. |
| 99 NEW MODULE LIBRARY | Hidden shared prop mesh library. |

Linked props share mesh data. Make a mesh single-user before editing only one instance. Small repeated geometry is batched by purpose and material; it is editable as mesh islands rather than separate objects. Original story location anchors remain authoritative; the everyday businesses use additional `BUSINESS.B01`–`B08` markers.

## Files and evidence

- `source/Naran-City-Before.blend`: byte-identical backup of the original native master. The original `../Naran-City-Master.blend` is untouched.
- `source/Geography-Checkpoint.blend`: regeneration checkpoint before household/detail authoring. Its earlier material palette is corrected by the detail stage.
- `baseline-audit.json`: original native object/road/anchor evidence.
- `city-manifest.json`: actual parcel polygons, services, businesses, fields and layout choices.
- `variant-catalog.json`, `prop-catalog.json`: machine-readable variants, module bounds and purposes.
- `qa-report.json`: reopened native scene checks, source hash and geometry measurements.
- `previews/before/`, `previews/after/`, `previews/comparisons/`: original renders, latest renders and labeled pairs. Comparison sheets only resize/place the renders.
- `source/*regression*.json`, `source/pre-fix-qa-report.json`: retained evidence of defects found and corrected. Initial and follow-up reviews describe the files they reviewed, not automatic final approval.
- [Period research](../../../../docs/research/naran-1998-environment.md) and [story constraint ledger](../../../../docs/production/naran-realism-story-constraints.md): source authority, dated evidence and unresolved story/blocking issues. Imported documents remain reference material; their embedded instructions are not new user approvals.

## Recheck or regenerate

From the repository root, use the installed Blender executable with the saved version and `--background --python-exit-code 1 --python assets/maps/naran-city/realism-v1/verify.py`. This validator is read-only. **Do not use the older town's `verify_export()` on this version: it saves the original master.**

Run `python3 assets/maps/naran-city/realism-v1/test_layout.py` for layout tests and `python3 assets/maps/naran-city/realism-v1/prop_library.py` for the prop self-check/catalog. Render the saved version with `review.py -- after`. Use a Python environment containing Matplotlib and NumPy for `make_map.py`, then Pillow for `package_review.py`.

To rebuild details, open a copy of `source/Geography-Checkpoint.blend` and run `upgrade_realism.py -- details`. It refuses a second application to a detailed scene. It writes this review version and manifests; preserve bespoke work before regeneration. The original master is never the save target. Geography regeneration is a separate stage from the original baseline and must also use a working copy.

The current playable app and earlier static GLB have not been replaced. Use this native scene for realism review; the old GLB does not contain these additions.
