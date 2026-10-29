# Final focused review — saved scene and targeted fixes

Reviewed 29 October 2026. Scene SHA-256:

`4f3619600cc04862ddb83113510366ecb20bd779392640e309996fd5faec1a0b`

The saved blend and `qa-report.json` match this hash. All **32 native checks** pass. All eight after images were refreshed at 18:24–18:28; this final focused pass visually inspected **market, ger-street, entrance and apartment**. Earlier reviews inspected all eight matching before/after views. Six layout tests were rerun and pass. This review did not open or modify Blender.

## Resolved findings

- Original hospital road obstruction, school path through N07, floating apartment vents, obsolete atlas check and metadata-only apartment variants remain resolved. Native checks report zero road obstructions, clear school path vertices and roof support for all 34 added vents.
- School gateway signs now have 9.2 m crossbars reaching their uprights. This closes the earlier unsupported-sign defect by source geometry inspection.
- Display-to-linear palette conversion is present and visible in the refreshed views; asphalt now reads distinctly darker than the ground.
- Timber families use separate boards with joints and modest top variation. The ger-street view restores visible timber construction detail. Sheet-metal families remain solid panels.
- Market signs now have larger lettering and contrasting backing boards. Bread, parts and pharmacy identities are readable in the final market view at its native resolution.
- The entrance remains visually accessible, and apartment roof/facade additions introduce no new important defect visible in the four reviewed views.
- `CHANGES.md` accurately qualifies inherited regular spacing/sparse aerial density, generic modules, limited architectural variety, absent crowds and unvalidated actor/runtime behavior. This is a realism iteration, not final art or canon approval.

## One remaining verified P2

**Household.062's new approach crosses Household.058's rear fence and yard** (`upgrade_realism.py:248–249`; `verify.py:77–81`). The path runs from gate `(-978.066,-809.339)` directly to road edge `(-1008.380,-781.488)`. It enters the neighbouring polygon through the rear edge at `(-988.374,-799.869)` and leaves near its front gate at `(-1001.785,-787.548)`, traversing approximately 18.2 m of that yard. The native approach check tests only whether a path re-enters its own yard, so it does not detect this case.

Independent exact segment-boundary checks across all 411 parcel polygons found **zero plot overlaps** and **this one approach crossing another plot**. Route this approach around the neighbouring plot; a single waypoint `(-980,-778)` produces no boundary crossing against any parcel in the current manifest. Confirm the 1 m path's half-width clearance before accepting the detour, record its full polyline in the manifest, and include other parcels in approach validation.

This affects an ordinary outer-ger-district approach, not a protected story route. It is nevertheless a concrete functional defect in the newly authored route and should be corrected before describing all household approaches as usable. Once corrected, rerun saved-file verification and update this document's reviewed hash/evidence; the current 32-check success does not resolve this additional finding.

## Limits

No exhaustive solid pairwise collisions, foundations, turning radii, door/gate operation, pedestrian access widths, actor blocking, historical language/model validation or runtime performance test was performed. Source inspection verifies the crossbar correction; no dedicated close school render was inspected. The existing production limits in `CHANGES.md` remain applicable. Human art and canon approval are explicitly outstanding.

Verdict: previous findings resolved; fix the one neighbouring-yard approach crossing before closing this technical review.
