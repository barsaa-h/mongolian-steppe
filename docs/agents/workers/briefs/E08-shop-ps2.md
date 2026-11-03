# E08 (DeepSeek): Nyamka's shop (ТҮЦ) + its courtyard front, PS2 / Silent Hill 2 style

You build a **new set** in this worktree (`~/ms-workers/E08`). Read `AGENTS.md`, `docs/agents/03-environments.md` (the "Nyamka's shop interior" and "Apartment courtyard" rows, Rules), `docs/agents/04-props-vehicles.md` (shop props), `docs/agents/05-look-lighting.md`, and the beat sheet `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (beats 03, 04, 14), all read-only. For style reference, look at the finished sibling set built the same way: `/home/barsaa/ms-workers/E07/assets/maps/episode-1/build_freightyard_ps2.py` and its previews in `/home/barsaa/ms-workers/E07/assets/maps/episode-1/previews/freightyard-ps2/r12-contact.jpg` (read-only; copy techniques, not files). You can view images: **open every render you make and judge it.**

## Story (never change)
- Beat 04: Tsetsegmaa buys **candles, flour and a cheap birthday sweet**. Shopkeeper **Nyamka** keeps a **pencilled household debt notebook** (in a drawer under the counter). Tsetsegmaa pays part, and the rest is written down. Regulars **Bataa** and **Togoo** stand and bicker inside or by the door. There's an **old shop phone**. It's the place where the neighbourhood gathers and rumours spread.
- Beat 14: evening. **Nyamka pulls the shutters partway down.** Outside is the apartment courtyard where a **coal delivery truck** stops (leave a truck bay `ANCHOR.coal_truck`). Altan runs out thinking it's her father's truck.
- The set is in Naran, a small Mongolian town, in November 1998: poor, post-Soviet, cold.

## Build
- **Shop interior** (~4 × 5 m):
  - a wooden counter with a glass display front (sweets, cigarettes, matches), and the debt notebook and a pencil on the counter (`PROP.debt_notebook`, plus the drawer as a separate object);
  - an abacus, a scale with weights, and a rotary phone on the wall or counter;
  - shelves behind: flour sacks, a candles box, bread, jars, tea bricks, bottles (vodka/airag), canned goods, matches and soap;
  - a calendar, a small TV or radio, a heater, a bare bulb, a cracked window with frost, a curtain to the back room;
  - a worn linoleum floor and a doormat;
  - grime and handwritten price cards.
- **Exterior front:**
  - a small kiosk/shop front at the ground floor of a 5-storey Soviet panel block (just enough of the block to frame it);
  - a hand-painted Cyrillic sign «ДЭЛГҮҮР» or «ТҮЦ» (label it an artistic choice);
  - **roll-down metal shutters** that move as a separate object (open, half and closed states, or a pivot/slide);
  - a step, an ice patch, coal dust on the snow, a bench, a bin, a lamp over the door.
  - The courtyard: trodden snow, a frozen puddle, a coal pile, the bay for the coal truck, a laundry line, a swing frame.
- **Marks:** `ANCHOR.*` for Nyamka, Tsetsegmaa, Bataa, Togoo, Altan and the coal truck; camera marks for beats 04 and 14; `LIGHT.*` empties for every practical.
- **States:** `day` (beat 04, a cold flat morning) and `evening` (beat 14: dusk, warm shop light, shutters half down).
- **Budget:** ≤ 25k tris, ≤ 12 textures (atlas), 64–256 px pixel textures with painted grime, nearest filtering, no mipmaps.

## Deliverables
- `assets/maps/episode-1/build_shop_ps2.py`: build into a new scene `EP01_Shop`, saved as `assets/maps/episode-1/EP01-Map_shop_v001.blend` (then `v002`…). Never overwrite `EP01-Map.blend` or a version.
- `glb/EP01_Shop_ps2.glb`: this scene only.
- `check_shop_ps2.py`: budgets, the shutters move, the notebook drawer opens, the counter is passable behind for Nyamka (≥ 0.6 m), 4 standing marks inside without overlap, the truck bay is clear (≥ 3 × 8 m), and the existing `check_map.py` still passes.
- In `previews/shop-ps2/`, stills at 960×540 (Eevee):
  - interior wide from the door;
  - the counter close (notebook, sweets, candles);
  - from behind the counter toward the door;
  - the shop front by day;
  - the shop front in the evening with the shutters half down;
  - the courtyard wide with the truck bay.

  Keep each round (`r1-*`, `r2-*`, …).
- `previews/shop-ps2/report.md`: check output, budgets, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds. It must read as a real, poor 1998 Mongolian neighbourhood shop: cramped, warm inside, and cold outside.

## Rules
- Blender headless only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` (it adds `-b`, your own lock, and a safe runner that always exits Blender). Run it in the foreground. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits.
- Don't name your scripts after Python stdlib modules (no `inspect.py`, `types.py`, …).
- **Failures are yours to debug, not reasons to stop.**
