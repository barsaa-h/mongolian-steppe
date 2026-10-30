# Brief G01 round 2 — Build the Godot scene; the manager runs the GPU renders (same worktree)

You stopped after the GPU probe failed. Your sandbox has no display or GPU, and it stays that way. **That's fine: the manager runs the renders outside the sandbox.** Never stop at a probe again.

**Your job: do everything in `docs/agents/workers/briefs/G01-godot-render-test.md` except the actual GPU render.**
- Read it again.
- Author the project headless: `godot --headless --path episodes/EP01/godot --import`, plus `--headless --script` tools to build or validate scenes. Keep Godot's user data in `episodes/EP01/godot/.godot-home` through the XDG variables.
- Build `scenes/B23_S001.tscn` with the room, the four actors, the poses, the dressing, the lights, the environment and both cameras from the JSON, plus the auto-quit at the end of the 8 s clip.
- Make a camera switch via a command-line user arg (e.g. `-- --cam=S004 --still=4.0` renders one still frame at 4.0 s and quits) so single stills can be rendered quickly.
- Validate headless:
  - the scene loads with no errors;
  - the actors import with their skeletons, and the bone names you pose exist;
  - camera positions are converted correctly (print them and compare with the JSON).

**Write `episodes/EP01/godot/render.sh`, which the manager will run.** It must:
1. Set the XDG variables.
2. Render stills of S001 and S004 at 1920×1080 with Forward+ (Vulkan), timed, to `compare/B23_S001_godot.png` and `compare/B23_S004_godot.png`.
3. Render the 8 s clip with Movie Maker (`--write-movie`, `--fixed-fps 24`) at 1920×1080 and at 960×540, timed, and encode each to MP4 with ffmpeg.
4. Repeat the 540p clip with the Mobile renderer (`--rendering-method mobile`) and with `--rendering-driver opengl3`.
5. Write all timings to `compare/timings.txt`.
6. Build `compare/compare_B23.png` from the Blender stills in `inputs/blender_v0.1/` vs the Godot stills; a small Python/PIL script is fine.

Each step logs to `compare/logs/` and must not abort the others when it fails.

Write `RESULTS.md` with everything except the timings and the visual verdict; leave clearly marked placeholders for those. Report the exact command to run.
