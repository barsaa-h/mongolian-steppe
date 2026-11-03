# BM02 round 4 (Codex): continue

Good progress: the hands now read as human hands, and the body is opaque and solid. Keep that. Remaining fixes, in order:

1. **Altan's face collapses** into a beak/triangle (`altan-face.png`). The child head decimates badly. Protect the face region by vertex count, not ratio: the eyes, lids, nose, mouth and cheek loops must survive for heads of any size. Compare the silhouette against the source in front and profile.
2. **The face reads soft/blobby** (Ganaa). Keep more of the face: about 1500–2000 tris for the face mask on adults, about 1200 on children. Bake the source normal detail into the atlas as shading (AO/cavity) so the nose/lid/lip forms survive.
3. **Hair is a blocky helmet.** Use hair cards from the source hair mesh (decimated cards, alpha-test MASK), or a shell that follows the skull with a jagged alpha-tested hairline. No flat polygon cap.
4. **The mouth in `speak` shows dark blobs/teeth gaps.** One clean dark mouth interior, with teeth only if they look right.
5. Add a numeric check to `ps2_check.mjs` that catches a face collapse: the projected face silhouette area/width ratios vs the source within ±15%.

Don't tune the exporter to one actor. The bases are being re-sculpted (BM01), so it must work generically. Same Blender rules as last round (wrapper, `os._exit(0)`, never leave Blender running). Update `report.md`.

---
## How to run Blender here
- `bash .cache/bm02/run_blender.sh <blender args>`. It keeps Blender's user folder inside this worktree (MPFB logs there), waits on the shared lock, and adds `timeout 900` and `-noaudio`.
- End every Blender script with `import os; os._exit(0)` after saving, so Blender cannot hang on exit and keep the lock. **Never leave a Blender process running.** If you interrupt one, make sure it's gone.
- `EGL_BAD_MATCH` is a harmless warning.
- Builds/caches go in `.cache/bm02/`. Never use `~/.config`, `~/.cache` or `/tmp`.

## How to work
This is a long job; use your full budget. **Failures are yours to debug, not reasons to stop.** Stop only if Blender cannot start at all. Look at every image you render before calling something fixed. Write `report.md` before you run out.

