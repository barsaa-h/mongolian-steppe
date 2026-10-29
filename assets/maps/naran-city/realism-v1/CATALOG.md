# Building and prop catalog — v001

Existing project meshes remain the source for the town buildings. New modules are generic low-poly artistic interpretations, not verified historical product models. All dimensions below are metres.

## Reused source families

The inherited instance register contains the following 17 types. Counts include retained/hidden originals (notably fences) and are not a count of rendered assets. Meshes and the original master remain available.

| Family | Instance register |
|---|---:|
| Bench | 18 |
| Stall | 24 |
| Car | 15 |
| Apartment | 13 |
| Dumpster | 4 |
| House | 342 |
| Fence | 2055 |
| Gate | 411 |
| Barrel | 419 |
| Crate | 425 |
| Ger | 69 |
| BusStop | 3 |
| WaterKiosk | 3 |
| Pole | 252 |
| Rock | 28 |
| Apartment3 | 2 |
| Apartment5 | 2 |

## New shared prop modules

Each module is built once and linked into households or work yards; small contextual additions are batched.

| Module | Width × depth × height | Triangles / shared mesh | Purpose |
|---|---|---:|---|
| firewood | 1.45 × 0.94 × 0.68 | 444 | Household winter fuel stacked on ground bearers. |
| coal_bin | 1.8 × 1.3 × 1.1 | 68 | Open household coal storage with a low shovelling front. |
| privy | 1.22 × 1.335 × 2.1 | 56 | Simple detached timber household toilet. |
| shed | 3.2 × 2.218 × 2.66 | 56 | Small domestic tool and fuel store with paired doors. |
| small_timber_house | 6.2 × 4.955 × 4.4 | 212 | Single-storey timber home with painted door, framed windows and chimney. |
| hay_stack | 2.6 × 1.8 × 1.88 | 32 | Covered-shape loose hay reserve on timber bearers. |
| water_cart | 1.6 × 3.009 × 1.48 | 276 | Hand-drawn two-wheel water tank cart. |
| bicycle | 0.56 × 2.034 × 1.144 | 1584 | Utilitarian upright bicycle with a simple diamond frame. |
| tractor | 2.066 × 3.49 × 2.62 | 564 | Generic older blue agricultural tractor with enclosed cab. |
| farm_trailer | 2.371 × 4.177 × 1.54 | 288 | Single-axle timber-sided agricultural trailer and tow drawbar. |
| loading_pallet | 1.2 × 0.9 × 0.21 | 96 | Reusable timber loading pallet. |
| repair_bench | 1.8 × 0.712 × 1.21 | 132 | Outdoor timber repair workbench with a small metal vice. |
| sandpit | 2.84 × 2.84 × 0.36 | 60 | Timber-edged communal play sandpit. |
| climbing_frame | 1.505 × 2.265 × 1.982 | 792 | Painted steel ladder and overhead-rung playground frame. |

## Constrained household treatments

Six recurring households: timber care, ger/fuel, repair trade, mixed family, brick/garden and patched extension. Existing main dwelling type is retained; a family name is a treatment category and does not convert every existing house into that construction type. All plots have fuel, water storage, a gate/door link and sanitation. Sheds, gardens, workbenches and bikes follow the family. Eight ger plots also receive a timber house. Wood/painted timber uses separate boards; rust metal remains panelled.

## Apartment combinations actually authored

The original three/four/five-floor kit silhouettes remain recognizable. Five facade treatments and three roof treatments are combined across 17 blocks; these are additive variants, not 17 distinct building series. Roof vents fit the actual 2.8 m-floor source kits.

| Existing kit / treatment family | XY | Actual additions |
|---|---|---|
| Apartment / cared_for / flat_service | 235, -340 | flush service hatch; renewed entrance trim |
| Apartment / panel_repairs / vent_renewal | 305, -340 | renewed duct cover; vertical panel-joint repairs |
| Apartment / weather_streaks / patched_metal | 375, -340 | two metal roof repair sheets; runoff beneath six sills |
| Apartment / partial_repaint / flat_service | 475, -340 | flush service hatch; repainted plinth and gable patch |
| Apartment / mixed_windows / vent_renewal | 235, -430 | renewed duct cover; two repaired timber window frames and curtains |
| Apartment / cared_for / patched_metal | 315, -430 | two metal roof repair sheets; renewed entrance trim |
| Apartment / panel_repairs / flat_service | 395, -430 | flush service hatch; vertical panel-joint repairs |
| Apartment / weather_streaks / vent_renewal | 475, -430 | renewed duct cover; runoff beneath six sills |
| Apartment / partial_repaint / patched_metal | 235, -495 | two metal roof repair sheets; repainted plinth and gable patch |
| Apartment / mixed_windows / flat_service | 315, -495 | flush service hatch; two repaired timber window frames and curtains |
| Apartment / cared_for / vent_renewal | 395, -495 | renewed duct cover; renewed entrance trim |
| Apartment / panel_repairs / patched_metal | 475, -495 | two metal roof repair sheets; vertical panel-joint repairs |
| Apartment3 / weather_streaks / flat_service | 160, 337.5 | flush service hatch; runoff beneath six sills |
| Apartment3 / partial_repaint / vent_renewal | 480, 562.5 | renewed duct cover; repainted plinth and gable patch |
| Apartment5 / mixed_windows / patched_metal | 320, 487.5 | two metal roof repair sheets; two repaired timber window frames and curtains |
| Apartment5 / cared_for / flat_service | 560, 412.5 | flush service hatch; renewed entrance trim |
| Apartment / panel_repairs / vent_renewal | 420, -370 | renewed duct cover; vertical panel-joint repairs |

## Commerce, roads and occupation

Four reused market shops + canteen + two kiosks + converted apartment window. Uses and exact coordinates are in `city-manifest.json` and the master-map inset. Road materials separate old asphalt, gravel and compacted dirt. Local footpaths, repair patches, frost pockets, institution gates and agricultural work surfaces are contextual batched meshes.

No traffic signals, LEDs, modern branded fleets or destruction modules were added. Exact vehicle years, shop goods/lettering, architectural series and final close-up finish still need review.
