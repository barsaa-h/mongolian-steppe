# CS04 round 3 (DeepSeek): keep the seamless skin, bring the faces back to life

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue character work another worker did in this worktree (`~/ms-workers/CS04`); it ran out of quota. EP01's cast is the low-poly **Vinrax-based PS2 cast** (read `AGENTS.md`): `scripts/build-cast.py` + `scripts/ps2_face.py` + `assets/cast/roster.json` → `assets/cast/<id>.glb`. You can view images: **open every render and judge it.**

## History
- **The user's verdict on the earlier faces:** "looks weird, like glued another face on top of it." The painted face read as a mask: the face skin was lighter and smoother than the ears and neck, there was a rectangular hairline strip, blocky temple patches and leftover source beard, and the features were bold.
- **Last round (`artifacts/stylized-cast-qa/cs04/faces-before-after.png`, `report.md`, and the manager's three.js render `artifacts/stylized-cast-qa/cs04/9-faces-threejs-before-after.png`)** fixed the seam (one skin tone across face, ears, neck and hairline) but **overcorrected**:
  - the eyes became small, blurry dark dots;
  - the mouths are a faint line;
  - the brows are smudged;
  - Tsetsegmaa has dark smudges around her eyes.

  The faces lost their identity and expression.

## Goal
Keep the seamless head (one skin, soft irregular hairline, no beard residue, no mask edges), and **restore readable, characterful features at a middle strength**, between the "before" (too bold, sticker-like) and the "after" (washed out). Target: a good PS2 / Silent Hill 2-era painted face (SH2 *technique* only, no assets), where at a 3/4 medium shot you can read the eye direction, the brows' mood and the mouth shape, and the face still belongs to the head.

Concretely, in `ps2_face.py` / `face_art` / `clean_face`:
- **Eyes:** a clear almond shape, Mongolian (single lid or inner fold). A dark iris and pupil with a tiny highlight. A soft upper-lid line, about 60% of the original liner. The whites are slightly darker than the skin's highlights, not bright. **Nothing blurred:** paint at the high internal resolution (K) and keep the edges crisp at 512.
- **Brows:** clean strokes, as dark as the hair but slightly transparent, with a clear shape per character (`face_art.brow`).
- **Mouth:** visible lips, upper slightly darker, a soft seam line, corners, and a lit lower lip. **No outline.** Colour 12–20% darker and redder than the skin.
- **Nose:** soft nostril shadows plus a subtle bridge highlight.
- **No muddy smudges:** remove the dark eye-socket blotches; use a gentle socket shadow only.
- Keep the **one-skin** pipeline, the hairline feather and the beard removal from last round. Respect per-character settings (stubble for adult men only where the roster/`face_art` says so; age lines for Dulmaa).

## Process
1. Read `report.md` and the last round's changes (`git diff` on `scripts/ps2_face.py`, `scripts/build-cast.py`).
2. Build **ganaa, tsetsegmaa, dulmaa, hurel, irina, altan** (`bash .cache/cs04/run_blender.sh --python scripts/build-cast.py -- ganaa tsetsegmaa dulmaa hurel irina altan`).
3. Render front, 3/4 and profile face sheets for all six, in neutral light **and** in a dim warm SH2 key with a dark fill. Use Eevee via the wrapper; you may reuse the last worker's render scripts in `artifacts/stylized-cast-qa/cs04/`.
4. Look, fix, repeat: **at least 4 rounds** (`round-9-*`, `round-10-*`, …). In every round, compare against the before and after images above.
5. Keep morph deltas ≤ 1 cm (`speak blink fear hunger resolve gaze smile frown`), the hands/finger rig untouched, the children's clothes from last round, and `npm test` passing.

## Deliverables (`artifacts/stylized-cast-qa/cs04/`)
- `faces-final.png`: the six actors at front, 3/4 and profile, neutral light;
- `faces-final-sh2.png`: the same in a dim warm key;
- `faces-3way.png`: Ganaa and Tsetsegmaa: original (bold), last round (washed), and yours;
- an updated `report.md`: what you changed and why, tests, morph deltas, and what still looks wrong.

## Rules
- Blender headless only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>` (it adds `-b`, its own lock, and a safe runner that always exits Blender). Run it in the foreground and wait. Never use the Blender MCP.
- Write only `scripts/ps2_face.py`, `scripts/build-cast.py` (face/skin functions), `assets/cast/roster.json` (`faceArt` only), the rebuilt actors' `.glb` and new `_v0xx.blend`, and `artifacts/stylized-cast-qa/cs04/**`. No commits. Don't name scripts after Python stdlib modules.
