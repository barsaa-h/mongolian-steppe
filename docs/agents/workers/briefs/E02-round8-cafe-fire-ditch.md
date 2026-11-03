# E02 round 8 (DeepSeek, high): café — real fire, a ditch that sells the café, less stripy walls

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`. Failures are yours to debug; use your full budget.

Work in `~/ms-workers/E02`, continuing from `build_cafe_r21.py` / v049 (your round-7 work, uncommitted: keep it; never checkout/reset/stash/clean). Blender only via `bash .cache/e02/run_blender.sh`; never the Blender MCP. New versions v050+; keep v049.

## Manager review of round 7
Accepted: motivated light (late sun / dusk practicals), counter two-shot, the steamer in the pass-through, stand-ins, `STATE.after_crash` contract. Look at `previews/cafe-ps2/r21-contact-*.jpg` yourself before starting.
Problems, in priority order:
1. **after_crash does not read as a crash.** In `forecourt_wide` the KAMAZ looks intact and parked, the fire is a small salmon glow. Needed: visible fire that reads as flame at this exposure (emissive, additive-looking cards with a hot core → orange → dark-red edge, several sizes, layered; ember sparks), dark heavy smoke column lit from below by the fire, soot on the cab, broken glass/headlight, cab nose crumpled or tilted against the guard, scorched snow. Fire light must light the cab, the snow and the café facade (warm, strong falloff). Keep it low-poly/PS2. Also give the ditch shot a fire glow on the horizon in after_crash.
2. **Ditch shot:** the café is small and far; the bank dominates. Re-place the camera (or the trench) so the café facade with its lit windows and sign fills ~⅓ of the frame over the lip of the ditch, foreground snow/grass edge dark and close. Read the beat: someone hides in the ditch looking at the café.
3. **Interior walls** read as stretched vertical pale stripes (curtain-like). Make them read as 1990s Mongolian roadside café walls: painted plaster/boards with a dado, smaller tiling, darker and less contrasty, grime near the floor and around the stove/door.
4. **Late-afternoon** exterior: windows blown white and flat sepia sky — balance windows against the exterior, give the sky a cold gradient.
5. `CAM.ots_hurel`: make a real OTS from behind Ganaa onto Hürel (move the radio or the camera).
6. Repoint the KAMAZ path note in the report only (no merge needed); remove the legacy `ANCHOR.actor_dasha_fire` if unused.

Story facts are law: no traffic lights; infected only push/slam doors; Dasha stays hidden in after_crash.

## Verify
Extend `check_cafe_r21.py` (or a r22 copy) to PASS; render all 4 states × cameras; contact sheets `r22-contact-*.jpg`; look at every still, especially after_crash forecourt and the ditch, full size. Append "Round 8" to `previews/cafe-ps2/report.md`. Honest doubts. View only PNG/JPEG.
