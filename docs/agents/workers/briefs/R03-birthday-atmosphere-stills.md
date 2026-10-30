# Brief R03 — The birthday has no life: dress the room, vary the people (STILLS ONLY)

You continue in your R02 worktree. Your R02 build script, shot file, contact sheet and stills are there, uncommitted. The video render was stopped by a laptop restart, and **we're not rendering video now**. The user and the manager reviewed `episodes/EP01/animatic/contact_sheet_v0.1.png`.

**The user's words:** *"there's no vibe, birthday party on table almost nothing, people's movement seems weird, all of them doing same movement, no balloon or something, and room looks like basement, just seems so empty. Learn about 1990s Mongolia."*

## Output: pictures only
- **No MP4, no full-sequence render.**
- **Blender:** headless, Eevee, 960×540, and **always through the lock**: `flock /home/barsaa/ms-workers/.blender.lock <blender> -b ...` (a Codex job also uses Blender, to rebuild Altan). Keep each Blender run short.
- **Deliverables:**
  1. `episodes/EP01/animatic/stills_v0.2/<shot>.png`: one frame per shot from the middle of the shot (15). For B23 (mittens) and B26 (door), add extra frames at the key moments named below.
  2. `episodes/EP01/animatic/stills_v0.2/room_wide_A.png`, `room_wide_B.png`, `room_wide_C.png`: three establishing views of the dressed room from different corners, at eye height.
  3. `episodes/EP01/animatic/contact_sheet_v0.2.png`, labelled with the shot ID, lens and moment.
  4. `episodes/EP01/animatic/before_after_v0.2.png`: 4 pairs of v0.1 vs v0.2 at the same frame and camera.

## 1. Research first: a 1990s Mongolian apartment birthday
Write `episodes/EP01/animatic/REFERENCE_1990s_birthday.md`.
- If you have web search, use it to verify. If you don't, mark each item "common knowledge, to verify". The user is Mongolian and will correct it.
- The manager's starting list follows. Dress from it, and add what you find.

**The room** (a late-Soviet panel apartment, 2–3 rooms, in a provincial aimag centre; the family is poor-to-ordinary):
- wallpaper (faded floral or striped) on all walls, not bare concrete;
- a big **wall carpet (хивс)** in maroon/red patterns hung behind the sofa or bed;
- a **Soviet wall unit (сервант / "стенка")** with glass doors: crystal glasses, a china tea set, a few books, a small ornament or photo;
- an old TV on a stand with a lace doily, maybe a cassette player;
- a sofa or a fold-out bed with a blanket, plus stools brought in for guests;
- painted wooden floor or linoleum, with a rug;
- a window with tulle net curtains plus heavier drapes, a cast-iron radiator under it, potted plants on the sill, and night outside (late November, cold, a dark-blue window);
- framed family photos, a wall calendar;
- a **ceiling lamp with 3–5 glass shades, warm incandescent light**; the room must be warmly lit, not dim grey. Add bounce and fill so faces read. Light it like a warm home at night, with the warmest pool over the table. The cold and dark belong outside the window and in the hallway.

**The table** (pulled out to the room centre, everything people could get together):
- a tablecloth or oilcloth;
- a **birthday cake with 3 candles** in front of Altan's seat;
- potato salad, carrot salad, a meat salad (the "capital" salad), a plate of buuz or khuushuur, boortsog, sliced sausage and bread;
- candies (wrapped sweets) in bowls, apples and a few oranges (a treat);
- bottles: lemonade or soda, juice, one vodka bottle among the adults;
- a tea thermos and cups, mismatched plates, forks, glasses;
- crumbs, a few used napkins. **It must look full and lived-in.**

**Party decoration:**
- **balloons** (6–12, mixed colours, slightly uneven, some taped to the wall or lamp, one or two on the floor);
- a paper garland or streamers;
- a handwritten "Төрсөн өдрийн мэнд" sign is an artistic choice; mark it as one.
- A wrapped present or two near Altan.
- **Mittens:** the mitten pair Ganaa brings must read clearly (red or white knitted, child-size). The second mitten lies visibly on the table at `ANCHOR.MITTEN_2_TABLE` from the moment it's put down.

**People in winter:** coats in a pile in the hallway, slippers on feet.

## 2. Build the dressing without touching the map
- Write `assets/maps/episode-1/build_birthday_dressing.py`, run headless. It creates `assets/maps/episode-1/sets/EP01_Apartment_BirthdayDressing_v001.blend` with a collection `Dress.Birthday` (props, wallpaper and wall-carpet planes laid over the existing walls, lights).
- **Link** that collection into the shot file from your build script. **Don't modify `EP01-Map.blend`**, and keep `check_map.py` passing.
- Low-poly is fine: this is the PS2 look. Simple shapes with good colours and textures beat detail (see the procedural or texture approach in `assets/maps/episode-1/textures/`).
- Nothing may block the door, the anchors, or the camera paths of the 15 shots. Check that every camera still sees its subject.

## 3. People must move like individuals
Right now every guest does the same movement. Give each guest a **different** small action, with different timing offsets and speeds:
- one talks with hand gestures;
- one sips tea from a cup;
- one laughs, leaning back;
- one sits on a stool eating;
- one holds a plate;
- one adjusts a child's crown or takes a photo;
- one stands with arms crossed;
- one watches Altan and Ganaa and smiles.

No two may share the same action at the same phase. Ganaa, Altan, Tsetsegmaa, Dulmaa, Tungalag and Sükhee keep their story blocking from the R02 brief; just make their poses natural (weight shifts, not a T-pose stiffness).

**Story rules (hard):**
- Ganaa's **left** wrist is wrapped and kept away from Altan; he gives the mitten with his **right** hand.
- Altan ends with one mitten on and one on the table.
- The infant is never framed.
- The kitchen door opens **inward** only a fraction, then black.
- No jump scares.

## 4. Fix the readability problems from the v0.1 review
1. **B23 (mittens):** a mitten must be visible in Ganaa's right hand, then on Altan's hand, and the second one on the table. Add key-moment stills: `B23_mitten_give`, `B23_mitten_on`.
2. **B25_S001/S002:** currently just a green sleeve on a brown door. Frame so we see **Ganaa's face and shoulder** bracing the door from inside the kitchen: MCU, a 35–50 mm lens, from the kitchen side.
3. **The door-fraction moment:** pull back so we see the door edge open a crack inward, the dark gap, and Ganaa's braced shoulder. Add the still `B26_door_fraction`.
4. **B26_S002:** Sükhee is smiling with his hands on his hips. He must be **approaching** the kitchen door, then pushing, with a heavy, wrong, blank posture and no smile.
5. **B24_S003:** the camera looks past a wall edge at backs. Reframe so Tsetsegmaa stopping Tungalag reads.
6. **B25_S003:** a hand goes through a wall. Fix the pose or position.

If you change a shot, update its `notes` (and `status`) in `episodes/EP01/shotlist.csv` and say why.

**Altan's look is not your job.** Codex is rebuilding `artifacts/episode-1-cast/altan/` at the same time. Your shot file links her, so render your **final** stills last. If `altan/Character-Master.blend` changed during your run, the new Altan shows up automatically.

## Self-check (look at every image yourself)
- Does the room read as a warm, crowded 1990s Mongolian flat at a child's party, not a basement?
- Is the table full?
- Are there balloons?
- Do the guests all move differently?
- Do the story rules hold?
- Are the faces visible in CU/MCU?

Then run `npm test` and `python3 assets/maps/episode-1/check_map.py`.

## Allowed paths
- `episodes/EP01/shots/**`, `episodes/EP01/tools/**`, `episodes/EP01/animatic/**`, `episodes/EP01/renders/**`
- `episodes/EP01/shotlist.csv` (the 15 rows)
- `assets/maps/episode-1/build_birthday_dressing.py`, `assets/maps/episode-1/sets/**`

## Report
- The research list (verified vs to-verify).
- What was dressed.
- The guest action table.
- The shots changed.
- Image paths.
- Blender time used.
- Honest weak spots.
