# E10 round 2 (DeepSeek): road + hospital, from block-out to a finished PS2 set

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue a job another worker started in this worktree (`~/ms-workers/E10`). Read its scripts (`assets/maps/episode-1/build_road_hospital_ps2.py`, `check_road_hospital_ps2.py`, `render_road_hospital_ps2.py`), the newest `EP01-Map_road_v0xx.blend`, and `previews/road-hospital-ps2/report.md`, and open the `r4-*` previews. Continue the versions (`v005`+) and rounds (`r5-*`+). You can view images: open and judge every render. For the target quality and technique, study the finished sibling set `/home/barsaa/ms-workers/E07/assets/maps/episode-1/build_freightyard_ps2.py` and `/home/barsaa/ms-workers/E07/assets/maps/episode-1/previews/freightyard-ps2/r12-contact.jpg` (read-only).

## Manager review of r4
**Good:** the night mood, the streetlamp junction pool, the headlights on the flock, the arrow sign idea, the budgets (4.4k and 7.5k tris; there's lots of headroom).

**Fix:**
1. **The reflection shot is empty.** For beat 19, Ganaa sees his own face in the passenger side glass. Set up the shot from `ANCHOR.reflection_cam`: the cab interior is dim, the dash light is faint, the window is reflective glass, and outside is dark steppe. Put a stand-in head (a simple low-poly bust at `ANCHOR.passenger_ganaa`, a preview-only collection excluded from the GLB) so the reflection visibly shows a face. Make the glass slightly dirty, with frost at the edges.
2. **The sheep are white blobs.** Make low-poly sheep: a woolly body (an off-white/dirty-cream texture), dark faces and legs, ears, 3 pose variants (grazing, standing, looking up), all instanced. The flock spills across the road in the headlights. One sheep near the truck (`ANCHOR.sheep_throat`) faces the cab, close enough for an insert of its throat.
3. **The livestock truck:** make it a GAZ-53 style truck: a rounded cab with a long hood, round fenders, a slatted wooden cargo bed with a few sheep inside, mud and rust, a dim cab light, and the radio on the dash.
4. **The hospital gate** is bare walls and blank windows:
   - concrete panel fence with peeling paint;
   - a metal gate with bars;
   - a guard booth with a lit window, a chair, a kettle, a notebook, a small heater glow;
   - the hospital building with a few lit windows (curtains, a red cross or «ЭМНЭЛЭГ» painted over the door), a porch lamp, icicles, and a bench;
   - a bare tree and power poles.

   Put **stand-in figures** (preview-only, excluded from the GLB) at the 8 queue marks and at the guard mark: simple coats and hats, some sitting on the bench, some holding a child, to read as tired families.
5. **The arrow sign** looks typeset. Make it **hand-painted**: a plank on a post, uneven letters «ЭМНЭЛЭГ →» painted into a 128 px texture, with peeling paint.
6. **Grime:** painted (not procedural noise). Snow piles against walls, trodden paths to the gate, frozen ruts, coal dust.
7. Keep the checks passing, keep **no traffic lights**, and add a check that the preview stand-ins are excluded from both GLBs.

## Process
At least 3 rounds (`r5-*`, `r6-*`, `r7-*`), all 7 views. Update `previews/road-hospital-ps2/report.md` honestly.

## Rules
- Blender headless only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` (it adds `-b`, its own lock, and a safe runner that always exits Blender). Run it in the foreground and wait. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits. Don't name scripts after Python stdlib modules.
- Story facts: beat 19 is a night approach to Naran in the livestock truck, sheep block the road, and Ganaa's face shows in the side glass. Beat 20 is the hospital arrow sign, the queue of tired families, and the guard asking about injuries. **No pharmacy.**
