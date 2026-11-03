# E06 round 2 (Codex): apartment, second pass

Continue in this worktree from `assets/maps/episode-1/EP01-Map_apt_v006.blend` and `build_apartment_ps2.py`. Keep `check_map.py` and `check_apartment_ps2.py` passing (≤ 30k tris, ≤ 14 textures, ≥ 12 seats, the E01 door/topology checks). Blender only via `bash .cache/e06/run_blender.sh --python <script> -- <args>`: it has its own lock, so **don't also wrap it in the shared lock**. A safe runner always exits Blender. Run it in the foreground. Write only under `assets/maps/episode-1/`, with no commits, and never overwrite a version (`v007`+).

**Story facts (never change):**
- the topology from the blocking spec;
- the kitchen door opens **inward** into the kitchen, has a handle and no lock, is braced from inside and pushed from the hall, and doesn't swing into the evacuation path;
- the bedroom is within earshot of the table;
- the stair exit is crowded.

**Don't redesign the bench brace;** the manager will raise the brace question with the user. Just report what you found.

## Manager review of r4
**Good:** the living room reads as a warm, crowded birthday (the long table, the wall carpet, the sideboard, paper lanterns, the hand-written sign).

**Fix:**
1. **The tone is too candy and toy-like** (pink stripes, pastel lanterns, a clean pink checker cloth). It's a poor 1998 Mongolian flat in a horror story. Desaturate it: faded floral wallpaper in brown/green/ochre with water stains, a worn red/maroon wall carpet with a traditional pattern, an oilcloth tablecloth with a faded print, yellowed paper decorations, cigarette-smoke-yellow ceiling, scuffed brown painted floorboards with a worn path. Keep the warmth from the light, not from the paint.
2. **The kitchen is empty:**
   - a gas stove with pots and a kettle;
   - a sink with dishes;
   - a small table with stools;
   - shelves with jars;
   - a calendar;
   - a fridge (an old ZIL-style rounded fridge);
   - a **real window** (a frame, glass with frost at the edges, black night outside), not frost on a wall.

   Use a cold, dim bulb.
3. **The bedroom is a black box with a bed.** Add a window with a curtain, a wardrobe, a child's cot or small bed for Altan (3), toys on the floor, a rug, a lamp, and a photo on the wall. Use dim light.
4. **The landing exposes a void.** Close it: concrete stairs up and down with a metal railing, painted lower walls (green/blue) with a whitewashed upper half, a scratched padded front door, a neighbour's door, a dim bulb in a cage, the mailboxes. Fog the stairwell down into darkness.
5. **The corridor** reads OK. Add more coats piled on the hooks, boots spilling off the rack onto the floor, an electricity meter, and peeling wallpaper.
6. **Grime everywhere:** dirty skirting, worn door edges, light switches with dirty halos.

## Process
At least 3 rounds (`r5-*`, `r6-*`, `r7-*`), each with all 7 views, at 960×540. Open and judge every image. Update `previews/apartment-ps2/report.md` honestly. **Use your full budget**; failures are yours to debug.
