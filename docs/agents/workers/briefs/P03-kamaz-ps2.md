# P03 (Codex): the KAMAZ truck, PS2 / Silent Hill 2 style, intact + disabled

**Worker:** Codex. Read `AGENTS.md`, `docs/agents/04-props-vehicles.md` (the KAMAZ row and task P03), `docs/agents/05-look-lighting.md`, and the legacy `assets/cast/cab.json` (the measured driver seat). Story sources under `artifacts/character-master/sources/story/` are read-only (beats 06–18).

## Goal
A hero **KAMAZ-5320-family Soviet cargo truck** (1990s, tired, rural Mongolia: a flatbed with a canvas tarp or a box body, mud and rust, a cracked bumper, a sun-bleached orange or faded blue cab; label the colour choice as artistic), built **procedurally in Python** for the PS2 / Silent Hill 2 look:
- low-poly, chunky silhouettes, 64–256 px pixel textures with painted grime, `Closest` filtering, no mipmaps;
- **exterior ≤ 6k tris, cab interior ≤ 4k tris, ≤ 8 textures in total.**
- Use SH2 *techniques* only; no real-brand logos (a generic Cyrillic plate and an unbranded grille are fine).

## Contents
- **Exterior:** a cab-over-engine cab, a big bumper, round headlights, wide mirrors on arms, a step ladder, mudflaps, double rear wheels, the fuel tank, the flatbed with the tarp, a Mongolian-style number plate (made-up characters).
- **Cab interior (T0, close-ups happen here):** a bench/driver seat matching `cab.json`, with **space behind the seat for the satchel**; a sun visor; the dash with round gauges; a big thin steering wheel; a **heater vent** (Dasha leans on it); a radio; a gear stick; a **driver door that opens** (a hinged object with its pivot at the hinge) and a passenger door that opens. Windows are see-through.
- **Two states** as separate collections/objects in one file:
  1. `KAMAZ_intact`;
  2. `KAMAZ_disabled`, after the café collision: a crushed front corner/bumper, a cracked windshield (a texture), one headlight smashed, a flat front tyre, the cab tilted slightly. **Not burned out**, and the cab stays recognisable and intact enough that the satchel is safe.
- Empties: `ANCHOR.driver_seat`, `ANCHOR.passenger_seat`, `ANCHOR.satchel`, `ANCHOR.door_L_handle`, `ANCHOR.door_R_handle`, `ANCHOR.step_L`, `LIGHT.headlight_L/R`, `LIGHT.cab_dome`.

## Deliverables
- `assets/props/kamaz/build_kamaz.py` → saves `assets/props/kamaz/KAMAZ_v001.blend` (new versions `v002`… on every rebuild; never overwrite).
- `assets/props/kamaz/check_kamaz.py`: tri/texture budgets; the seat matches `cab.json` within 3 cm; the satchel box (40 × 30 × 15 cm) fits behind the seat without intersecting anything; both doors swing 70° without hitting the body; the disabled state is distinct from intact.
- GLBs: `assets/props/kamaz/glb/KAMAZ_intact.glb` and `KAMAZ_disabled.glb` (only the truck, nearest filtering, no mipmaps).
- In `assets/props/kamaz/previews/`, stills ≤ 960×540 (Eevee, moody night light with a headlight glow, plus one neutral grey studio view): 3/4 front, side, rear, cab interior from the passenger seat, interior from the driver's door, disabled 3/4 front, and a close-up of the disabled front. Open and judge every image.
- `assets/props/kamaz/previews/report.md`: check output, tris/textures, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds (`r1-*`, `r2-*`, `r3-*` previews). It must read instantly as a Soviet KAMAZ from the 3/4 front at night.

## Rules
- Blender headless only via `bash .cache/p03/run_blender.sh --python <script> -- <args>`. You have your own lock, and a safe runner always exits Blender, even on errors. Run it in the foreground and wait; never cancel because of the lock. Never use the Blender MCP.
- Write only under `assets/props/kamaz/`. No commits.
- **Failures are yours to debug, not reasons to stop. Use your full budget.**
