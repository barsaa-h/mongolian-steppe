# E02 round 6 (DeepSeek): Hürel's café, ready for beats 15–18

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E02`, continuing the café set another worker built (latest `assets/maps/episode-1/EP01-Map_v016.blend`, builders and previews in `assets/maps/episode-1/`, GLB `glb/EP01_Cafe_ps2_v016.glb`). Read the builder scripts and the latest previews first; continue numbering (v017+). Use the Blender wrapper in `.cache/`. Only view PNG/JPEG images.

## Story (law): read beats 15–18 in `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` and the v4.2 script
Hürel's roadside café in **late afternoon** turning to dusk: banter at the counter (B15), the attack inside the main room (B16–B17: Dasha bites Hürel, then Ganaa's **left wrist**), Ganaa out through the door to the KAMAZ, the forecourt/ditch (B18). Infected **push/slam** doors, never use handles. Ganaa's "Битгий шаа" and Hürel's extra food for the road.

## Do
1. **Late-afternoon state** (B15–B16): low warm sun through the windows (long light shafts across tables), practicals weak; **dusk state** (B17–B18): exterior blue hour, interior bulbs on. Two `STATE.*` switches exported (document them), and lights exported (`export_lights=True`, cameras, empties kept).
2. **Counter:** Hürel's work zone: a cloth, a pot of buuz/steamer on the stove, a plate pushed across (`ANCHOR.counter_plate`), a cash tin, a radio, cups; `ANCHOR.hurel_counter`, `ANCHOR.ganaa_counter` (stools at a sensible counter depth so they can lean and pass a plate: the panel worker found the counter 0.72 m deep and unreachable: make the serving ledge ≤ 0.5 m).
3. **Attack states (B16–B17):** a `STATE.after_attack` with overturned chairs, a knocked table, broken crockery on the floor, spilled tea, a smear on the floor (not gore-comic), the door ajar; anchors for the struggle (`ANCHOR.bite_hurel`, `ANCHOR.bite_ganaa`, `ANCHOR.door_exit`).
4. **Exterior (B18):** forecourt, the ditch, the KAMAZ spot (`ANCHOR.kamaz_forecourt`, leave a 9 × 3 m clear gap), sign readable «ХООЛНЫ ГАЗАР» (check every glyph; the sign chains must read as chains, not rods), a back path.
5. **Cameras** `CAM.*`: counter two-shot (from the end of the counter), over-the-shoulder singles for both sides, the room wide, the door from inside, the forecourt wide, the ditch.
6. Render each camera in each state (960×540), contact sheets per state, look at every image, at least 3 render → look → fix rounds; extend the checks (states, anchors, gap, no traffic lights); re-export the GLB.

## Rules
- Blender only via the wrapper in `.cache/` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only the café files in `assets/maps/episode-1/` (builders, new blend versions, café GLB, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- Final `## Report:` with files, check output, evidence (contact sheets), what still looks wrong.
