# E02 round 7 (DeepSeek, high): roadside café — SH2 lighting, ditch shot, KAMAZ crash/fire staging, actor test

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/E02` (your earlier café rounds are there: `assets/maps/episode-1/build_cafe_r17.py`, `render_cafe_r17.py`, `check_cafe_r17.py`, `make_cafe_contacts.py`, latest `EP01-Map_v024.blend` / `glb/EP01_Cafe_ps2_v024.glb`, `previews/cafe-ps2/states.md`, `report.md`). Inspect them first; continue numbering (v025+, r21+). Never checkout/reset/stash/clean. Blender only via `bash .cache/e02/run_blender.sh`; never the Blender MCP. End Blender scripts with `os._exit(0)`.

## Your own round-6 doubts — fix them
1. **Lighting is too flat/even for Silent Hill 2.** Interior: motivated pools (one bare bulb over the counter, window light, the steamer/stove glow), dark corners, falloff; tone down the busy wall pattern (grime, darker value). Late-afternoon exterior: low raking sun, long shadows, haze/fog cards; dusk: cold ambient + warm windows + the sign. Keep it PS2-cheap (baked/vertex light or a few lights, lightmap if you already use one).
2. **The ditch shot is weak / doesn't show the café**: recompose so the café (lit windows, sign) reads in the background from the ditch.
3. **KAMAZ is a proxy, no crash/fire staging**: use the project's KAMAZ GLB if it exists (search `assets/` and the hero props, e.g. `find ~/ms-workers -name '*amaz*.glb'`), else improve the proxy. Add an **after_crash** state: truck nosed into the ditch/forecourt per your KAMAZ gap marks, small fire + smoke (emissive cards for three.js FX to drive), debris, an anchor for the fire light.
4. **No actor test**: place stand-in actors (any `assets/cast/*.glb`, or simple capsules if loading them is a problem) at your anchors in each state, render the 7 cameras, and fix blocking problems (actors clipping counter/stools, eyelines, the plate pass over the 0.5 m ledge).
5. Make the steamer visible in the counter shots.

Story facts: no traffic lights; profanity uncensored; infected only push/slam doors; the café is Hürel's.

## Verify / deliver
Run your check script (extend it for the new state + anchors), render every camera × state, build contact sheets (`r21-*`), look at every image. Append "Round 7" to `previews/cafe-ps2/report.md` and `states.md` (new state/anchors/cameras). Honest remaining issues. View only PNG/JPEG images.
