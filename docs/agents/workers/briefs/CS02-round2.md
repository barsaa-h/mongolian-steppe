# CS02 round 2 (Codex): make the hands read as hands

Good start: the 30-bone finger rig, five fingers, 432 tris per hand and passing tests. Keep it all and continue in this worktree.

## Manager review of `artifacts/stylized-cast-qa/cs02/ganaa-*.png`
1. **The palm is a flat rectangular box,** longer than it is wide, with hard edges. Real palm: about as wide as it is long, with a thicker heel; a rounded back with knuckle bumps; a slightly cupped inside; a soft thenar pad (the thumb muscle) at the base of the thumb; and a tapered wrist that disappears into the sleeve.
2. **The thumb is a thin stick sticking out sideways at ~60°.** It must be as thick as the index finger at its base, leave the palm at the heel side, and in `relaxed` lie alongside the index finger at ~25–35°, slightly in front of the palm. Two visible segments plus the metacarpal.
3. **The knuckle shading reads as stripes.** Alternating light and dark bands on each finger look like segments of a toy. Use one soft darker line at each joint crease (on the palm side) and a slightly lighter knuckle on the back; make the nails a subtle lighter patch at the tip, on the back side only.
4. **`fist` doesn't close:** the fingers stop as claws under the box. In a fist, the finger tips touch the palm, the knuckles form the front edge, and the thumb wraps across the middle phalanges of index/middle.
5. **`spread` pinches the fingers together** (they converge to a point). Spread must fan them out ~10–15° between neighbours, with the thumb out ~50°. Check your +Z spread sign per hand (mirrored on the left).
6. **`idle`:** the arms hang straight like a mannequin, and the left hand is a white blob (a prop? a broken weight?). Do the relaxed idle from the original brief: arms 10–15° out, elbows slightly bent, palms facing the thighs, fingers in `relaxed`.
7. Render the hands from **three angles** (back of hand, palm side, thumb side), close, with the same neutral key/fill, for ganaa (male), tsetsegmaa (female) and altan (child, 3 years old: shorter, chubbier fingers).

## Rules (unchanged)
- Blender only via `bash .cache/cs02/run_blender.sh <args>`. End your own Blender scripts with `import os; os._exit(0)`. **Never leave a Blender process running.**
- Only `scripts/build-cast.py` (your new hand/rig functions and their call hooks), `assets/cast/hand-poses.json`, the rebuilt GLBs, and `artifacts/stylized-cast-qa/cs02/**`. **Don't touch** `recolor_texture`, `reshape_face`, `face_details` or `hairstyle`: the manager is rewriting them in another branch.
- **Failures are yours to debug.** Use your full budget. Look at every image you render. Update `report.md`, honestly.
