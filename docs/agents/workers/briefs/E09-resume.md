# RESUME: your previous run was cut off by a machine restart

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

Your earlier run of this job was killed mid-work. **Don't start over.** First inspect what already exists in this worktree (`git status`, the build/check/render scripts, the newest `*_v0xx.blend`, and the newest preview round in the previews folder; open the newest images). Then continue from there: continue version and round numbers from the highest existing ones, and finish all the deliverables and rounds in the brief below.

---

# E09 (DeepSeek): Naran market street, bus stop and clinic frontage, PS2 / Silent Hill 2 style

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You build a **new hero street set** in this worktree (`~/ms-workers/E09`). Read `AGENTS.md`, `docs/agents/03-environments.md` (the row "Naran market / bus stop / ТҮЦ kiosk / clinic frontage", task E03, Rules), `docs/agents/04-props-vehicles.md` (the patched town bus, pushed car, town props), `docs/agents/05-look-lighting.md`, the beat sheet `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (beats 03 and 09), and the town layout notes in `assets/maps/naran-city/README.md`, all read-only. For technique and style, study the finished sibling set `/home/barsaa/ms-workers/E07/assets/maps/episode-1/build_freightyard_ps2.py` and `/home/barsaa/ms-workers/E07/assets/maps/episode-1/previews/freightyard-ps2/r12-contact.jpg` (read-only; copy techniques, not files). You can view images: **open every render you make and judge it.**

## Story (never change)
- **Beat 03, "Naran wakes", morning:** heating-plant smoke on the horizon; **an old patched bus fighting its starter** at the bus stop; someone shaking a rug from a balcony; a woman hauling a water can; **a ТҮЦ kiosk opening its shutters**; kids dodging a frozen puddle; road patchwork under bicycle tyres. The town must feel full of routine, **not an abandoned game level**. A radio under an open window. The shop and bus stop come back, changed, in later episodes.
- **Beat 09, midday:** the **clinic frontage** next to the market. A neighbour coughs from stove smoke. People say "phone first", but the clinic phone rarely connects; give the clinic a **loudspeaker** and a notice board. **Bataa and Togoo help push a stalled car** (leave `ANCHOR.pushed_car` and a clear 3 × 6 m push lane).
- **Place:** Naran, a small Mongolian town, November 1998. Post-Soviet, poor, cold, snow, coal smoke. **No traffic lights anywhere.**

## Build (one continuous street, about 60 × 25 m; fog hides everything beyond ~45 m)
- **Buildings:**
  - 2–3 Soviet 5-storey panel blocks (balconies with junk, laundry, a rug over a rail);
  - single-storey shops with hand-painted Cyrillic signs (artistic choice; e.g. «ХҮНСНИЙ ДЭЛГҮҮР», «ЭМНЭЛЭГ» on the clinic);
  - wooden fences, and a ger roof showing behind a fence.
- **Bus stop:** a concrete shelter with a bench and a mosaic or painted panel. **A patched PAZ-style bus**: rounded, low-poly, mismatched panels, a fogged window. Make it a separate object with `ANCHOR.bus_driver`.
- **ТҮЦ kiosk:** a small metal kiosk with a roll-up shutter (a separate movable object), a cigarette/sweets window, and a hand-written price card.
- **Market:** 4–6 stalls with plank tables and tarps (frozen meat, clothes, tea bricks, cheap toys), crates, a stove-heated container.
- **Clinic frontage:** a single-storey building with a porch, a notice board with paper notices, a loudspeaker on a pole, and a wooden bench.
- **Street:** cracked asphalt with patches and potholes, frozen puddles, trodden snow, coal dust, a ditch, power poles with sagging wires, one streetlamp, a water standpipe with ice. **No traffic lights.**
- **Life marks:** `ANCHOR.*` for the rug shaker, the water-can woman, kids ×2, the kiosk seller, a market seller ×2, Tsetsegmaa's route (start, middle, end), the coughing neighbour, and Bataa/Togoo at the car. Add `FX.smoke_*` empties on chimneys and the heating-plant stack, and `LIGHT.*` for the practicals. Add camera marks for beats 03 and 09.
- **States:** `morning` (03: low cold sun through smoke haze) and `midday` (09: flat overcast).
- **Budget:** ≤ 35k tris, ≤ 14 textures (atlas), 64–256 px pixel textures with painted grime, nearest filtering, no mipmaps.

## Deliverables
- `assets/maps/episode-1/build_market_ps2.py`: build into a new scene `EP01_Market`, saved as new versions `assets/maps/episode-1/EP01-Map_market_v001.blend` (then `v002`…). Never overwrite `EP01-Map.blend` or a version.
- `glb/EP01_Market_ps2.glb`: this scene only.
- `check_market_ps2.py`: budgets, the kiosk shutter moves, the bus is a separate object, the push lane is clear, **no object named or shaped like a traffic light**, and the existing `check_map.py` still passes.
- In `previews/market-ps2/`, stills at 960×540 (Eevee):
  - the street wide (morning);
  - the bus stop with the bus;
  - the kiosk opening;
  - the market stalls;
  - the clinic frontage (midday);
  - the pushed-car lane;
  - a Tsetsegmaa-POV walking shot.

  Keep each round (`r1-*`, `r2-*`, …).
- `previews/market-ps2/report.md`: check output, budgets, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds. Lived-in, poor, cold, busy with small routine.

## Rules
- Blender headless only via `bash .cache/e09/run_blender.sh --python <script> -- <args>` (it adds `-b`, your own lock, and a safe runner that always exits Blender). Run it in the foreground. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits. Don't name scripts after Python stdlib modules.
- **Failures are yours to debug, not reasons to stop.**
