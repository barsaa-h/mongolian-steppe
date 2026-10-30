# Brief G01 round 2 — Continue the Godot test; you now have the GPU (same worktree)

You stopped after the GPU probe failed. That was the manager's fault: the sandbox hid `/dev/dri` and the display. **This run has full access**, so the display (`DISPLAY=:0`, `WAYLAND_DISPLAY=wayland-0`) and `/dev/dri/renderD128` are visible.

The worker rules still apply:
- Write only inside your worktree.
- Keep Godot's user data in `episodes/EP01/godot/.godot-home` through the XDG variables.
- Don't run Blender.
- Don't touch other processes or windows.

**Do the whole original brief now:** `docs/agents/workers/briefs/G01-godot-render-test.md`. Read it again; build, pose, light, render, compare, write RESULTS.md.
- First re-run your probe (Forward+, then Mobile, then OpenGL compatibility) and record which ones work.
- **Lesson for this round:** if rendering fails, still build the full scene (scene authoring and imports work headless), and report the exact render command and error. Never stop at a probe.
- Render windows will briefly appear on the user's screen; that's expected. Keep each render run under about 5 minutes.
