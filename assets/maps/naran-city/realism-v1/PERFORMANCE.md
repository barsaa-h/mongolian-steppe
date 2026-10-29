# Native performance and verification — v001

Final saved file SHA-256: `4f3619600cc04862ddb83113510366ecb20bd779392640e309996fd5faec1a0b`.

Blender 5.2.2 LTS, Linux x86_64; background Eevee, 1280 × 800. This is an observed run on this host, not a cross-machine benchmark. Native validation used two CPU threads; final comparison rendering used four. GPU/driver identity and interactive viewport frame rate were not measured.

| Measurement | Result |
|---|---:|
| Compressed native file | 37.98 MiB |
| Original scene mesh objects, including hidden assets | 23,048 |
| Original triangles, including hidden assets | 776,964 |
| Updated mesh objects, including hidden assets | 25,060 |
| Updated visible mesh objects | 18,675 |
| Updated unique visible mesh datablocks | 4,604 |
| Updated visible triangles | 1,873,075 |
| Read-only native validation | 127.805 s |
| Validation peak resident memory | 1627.5 MiB |
| Final eight-render peak resident memory | 2497.1 MiB |
| Final render calls, total (excludes load/exit overhead) | 234.331 s |

Original and updated triangle scopes differ (all versus visible); do not treat these rows as a measured percentage increase. Timber-board silhouettes cost additional geometry; linked prop meshes and batching limit new object overhead. Hidden source/replaced assets remain editable and inflate total datablock counts.

| Identical camera | Before render seconds | After render seconds |
|---|---:|---:|
| aerial | 22.923 | 19.599 |
| apartment | 42.840 | 36.634 |
| ger-district | 29.813 | 35.299 |
| market | 35.284 | 33.357 |
| entrance | 32.150 | 27.585 |
| street | 31.734 | 29.340 |
| ger-street | 38.230 | 27.512 |
| agriculture | 32.332 | 25.005 |

Times include ordinary scene/render preparation and concurrent host activity. They are not a controlled speed comparison; the before and after processes ran at different times.

## Verification evidence

- **32/32 reopened native checks passed** for the SHA above. See `qa-report.json` for full measurements and sampling limits.
- All 20 anchor XYZ and all 60 original road names/widths/centerlines preserved; two connected farm tracks added. Maximum sampled grade 7.31% against the 8% layout limit.
- 22,485 sampled body-lane rays found no new solid obstruction; 252 inherited utility poles remain clear of streets.
- All 34 roof vents supported; the school path avoids the school/workshop shells; new household modules fit their own parcel polygons; every recorded gate approach stays outside its own yard.
- Original native master and byte-identical backup retain SHA `d2ca395f9c1642cb8fb7aa6e2253b4b4e1b19839d1eefddc5734078c1a19f9c0`.
- Six layout unit tests and the 14-module deterministic self-check passed. Existing Episode 1 native/export preservation checker passed. Project Node test suite passed 73/73 tests; the realism pass does not change runtime code.
- Eight matching before/after images exist and were visually inspected; independent reviews and corrections are retained alongside this report.

## Organization and practical limits

New work is separated into landscape, parcels, apartments, services, institutions and agricultural/work-yard collections. Linked modules share geometry; batched mesh islands can be edited by purpose/material. Packed images keep the native file portable. Existing and new templates plus replaced original details are hidden, not discarded.

This scene is heavier than the compact playable map. No runtime export replacement, LOD/streaming, actor crowd performance, interactive viewport FPS, exhaustive collisions or full door/vehicle dynamics were measured. Institutions remain exterior shells. Numerical checks do not approve historical specificity, art, medical timing, actor blocking or story continuity.
