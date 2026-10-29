# Character Integration / Blender Hand-off

## Existing models are user-owned and not embedded

The user already built characters, but the character model pack is **not present among this turn's accessible files**. We therefore use simple stage figures and named `RIG_ANCHOR_*` Blender empties. Do not mistake a primitive figure for the approved model.

### Attach a character

1. Run `blender/build_hurel_cafe_animatic.py` inside Blender to create the `.blend` scene.
2. Import your Ganaa, Hürel and Dasha rigs (FBX, GLB or another supported rig format) with their original armatures.
3. Measure rig height in metres, confirm bone/action names and feet at Z=0.
4. Parent the rig **root transform** to `RIG_ANCHOR_GANAA`, `RIG_ANCHOR_HUREL`, or `RIG_ANCHOR_DASHA`. If parenting changes position, clear the imported object's parent inverse or adjust transform so its local origin stays on the anchor.
5. Hide the corresponding `PROXY_[NAME]_BODY` and `PROXY_[NAME]_HEAD` (or their collection) in viewport AND render. Keep anchors visible for camera/route checks.
6. Scrub frames 1, 145, 769, 1369, 1537, 1681 and 1921 to inspect opening, banter, Dasha reaction and physical beat. Reblock anchor paths with actual walking, sitting, reaching and attacking actions as necessary.
7. Keep individual mouth and eye controls from the real rig: no generated lip sync is included.

## Scene asset replacements (priority order)

| Placeholder | Next proper asset | Key test |
|---|---|---|
| `COUNTER_Bar` | Scarred wooden counter + under-storage | Hürel working position and strike clearances |
| `TABLE_1` and stools | Real table set with chair legs, tea marks | Ganaa physically sits/stands and can push chair |
| `HEATER_Side` | Period metal stove/heater and vent | Dasha reaction cues and safety distance |
| `STOVE_Buuz` and `POT_Buuz` | Buuz steam pot + lid + tray | Openable lid, restrained steam |
| `PROP_HurelDebtBook` | Ledger with EP08 unpaid bill | Readable close-up, damaged variant later |
| `DOOR_Open_Leaf` | Hinged door, handle and seal | Ganaa escape through 1.8 m opening |
| `KAMAZ_*` | Full-length KAMAZ with cab and satchel | After-collision disablement, evidence survival |
| `PUMP_Petrol` | Petrol dispenser, concrete bollards, hoses | Separate petrol from the diesel truck |
| `ROOF_Liftable` | Modular roof and interior ceiling | Roof only hidden for animatic staging |

Material setup for actual PS2-inspired look is *not* locked: approve a separate still-frame look test before texturing all walls and props.

## Folder naming contract

`EP01/LOC_RG04/SC_CAFE/SH01...SH11`; objects `SET_`, `RIG_`, `PROP_`, `FX_`, `CAM_` and `SFX_`. The JSON manifest and cue CSV are the authoritative ID sources. Future sound/ADR take names: `E01-D023_T01.wav`, etc.; keep recorded takes outside source scene until approved.
