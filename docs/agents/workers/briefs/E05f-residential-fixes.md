# Brief E05f — Fixes after manager review of round 4 (same worktree)

Round 4's apartments improved: rotated and L-shaped blocks, garage rows, all story corridors kept. **Two problems block the merge:**

1. **East residential (`plan-east-residential.png`) is still a grid**, just denser: a 6×4 rectangle of near-straight orthogonal lanes with equal blocks. The brief asked for lanes bent away from the old grid lines. The private houses south of the apartments (`plan-apartments.png`) are also a regular 2×12 grid.
   - Fix it with your ger approach: recursive subdivision with ±8–20° jittered cuts and a varying split position, **plus**:
     - make the district outline irregular rather than a rectangle (move the corners 15–40 m and follow the existing roads);
     - let 1–2 lanes run diagonally, following an old track toward a road junction;
     - give block sizes real variance.
   - Apply the not-a-grid metrics to residential districts too: heading std above 15°, and an axis-aligned edge share below 40%. Add these as tests for east, west and apartment-south.
2. **Roadside households were deleted.** In v001 there are rows of houses along the North approach, along the roads west of the east district, and along the diagonal south roads. In v002 those strips are empty.
   - **Nothing that existed in v001 may disappear** unless the area is replaced by v002 parcels.
   - Restore the roadside ribbon housing as subdivided plots facing their road: irregular frontage widths of 14–28 m, varied depths, some gaps.
   - Add a test: every v001 household centre lies inside a v002 parcel, or within 30 m of one (allowing for a reshaped plot), or is listed in an explicit `removed_with_reason` list. That list should be empty unless there's a real reason.

**Also:**
- Apartment courtyards are sparse in the close-up. Raise the courtyard life to the round-4 brief's ranges and make it visible in `plan-apartments-closeup.png`.
- Keep everything that passed: the ger district, N12, the routes, determinism, no traffic lights.

## Done when
- All tests pass, including the new ones; the v1 tests pass; `npm test` passes.
- The images are regenerated and you've looked at them. **East residential must not read as a grid at a glance.**
- The report includes the metrics per district and the count of restored roadside plots.

## Allowed paths
`assets/maps/naran-city/realism-v2/**` only.
