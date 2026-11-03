# BM01 round 3, now with Codex: continue Grok's work in this worktree

Grok ran out of credit partway through. **Its work in this worktree is good: keep it, continue it, and don't start over.**

## How to run Blender here (already solved, so use this)
- Use **`bash artifacts/character-master/work/bm01/run_blender.sh <blender args>`** (call it with `bash`). It sets `BLENDER_USER_*` to `.cache/bm01/blender-user` inside this worktree, so MPFB can write its log, and it adds the lock and the timeout. Example: `artifacts/character-master/work/bm01/run_blender.sh --python artifacts/character-master/scripts/build_character.py -- <dna.json> ...`. See how Grok called it in `work/bm01/` (its build and panel scripts are there).
- Builds go to `.cache/bm01/`. Never use `~/.config`, `~/.cache` or `/tmp`.
- If Blender won't start in your sandbox, stop at once and report the exact error.

The `Rules` section of the brief below still applies, except the lock line: the wrapper replaces it.

## Manager review of your current state (from your own panels)
1. **Base M brows are broken.** They read as solid black cardboard strips with a see-through hole in the inner/middle part (`base-m-eyes-*.png`, `base-m-clay-front.png`). Brows must be soft hair strokes, `#15110e`, denser at the inner head, tapering at the tail, no hole, no hard outline. Fix it in `appearance.py`, not per character.
2. **The eye variants don't work.** You found the cause yourself: expression shape keys override the raw vertex edit. The `base-c-eyes-*` panels are byte-identical. Apply the eye targets as part of the identity/basis (before the expression keys are made, or bake them into the basis and the keys), then prove it: 4 variants per base that are visibly different.
3. **`base-f-eyes-almond` shows a white ring of sclera above the iris** (staring, bug-eyed). That is exactly the user's #1 complaint. The upper lid must cover the top 15–25% of the iris in neutral on every variant, and the lower lid must touch the iris bottom. Add a numeric check to `qa_actor.py` (iris-top vs upper-lid-margin distance at neutral) and make it fail on a sclera show above the iris.
4. **Base F is still "Base M with volume down"** in the front clay. She needs her own structure: a softer and lower brow bone, fuller anterior cheek fat pads, a smaller narrower jaw and chin, a shorter philtrum, a slightly smaller nose with a soft tip, and a slimmer neck. Compare her against Base M at thumbnail size: they should read as different people, not two weights of one.
5. **Base C face:** the cranium is better. Now the cheeks are puffy and droopy (jowl-like) and the mouth area is heavy. Brief: round cheeks *without* puffiness, so lift the volume to the upper cheek (zygoma/malar) and take it off the lower face. Its brows read as a single hard black line: use child brows, sparse and lighter.
6. **Profiles: all three noses are tiny and the mid-face is very flat.** A low nasal *bridge* is right, but the nose tip and alae still need adult projection on M/F (≈ 1.8–2.2 cm tip projection from the alar crease), and the lips need some profile. Check against `references/base-profiles`.
7. **Lighting of the panels:** the "after" clay is lit much darker than the audit. Use the same light for before and after, so they can be compared.

## Still to do from the original brief (below)
5 test faces per base (+ `distinctiveness.json`, which you started), `child-ages.png` (3 and 10 beside an adult), the textured panels, the composed sheets named in the brief, `qa_actor.py` passing for every base, and `report.md`.

**Budget your turns:** fix 1–3 first (they block everything), then 4–6, then the evidence. If you run low, write `report.md` before you run out, saying what is left.

---
# Original brief
# Brief BM01: Finish the three base models (Base M, Base F, Base C child)

**Worker:** Grok (reassigned from Codex, whose sandbox cannot write the MPFB log folder). **Priority:** #1. The EP01 cast is rebuilt on these bases this week.

## Why
The user's direction, 31 Oct 2026:
- Build **very good base models** first, in the lineage Ganaa was built on (MakeHuman/MPFB + the DNA system).
- Children need their own base.
- Then customize *everything* per character, so each one feels like their own person.

Ganaa's face is **not approved**; it is a draft. The downloaded Vinrax PSX man is rejected as a base, and so is the brief CS01. The ChatGPT procedural system (tag `archive/codex-character-system-v2`) had the right idea (everything is a spec with controls) but primitive results. Our DNA system already provides that spec. What failed was the base quality.

The final episode look is **PS2-era stylized realism** (Silent Hill 2 cutscene, rendered in three.js with fog, grain and dark practical light). A separate job (BM02, Grok) converts any built actor into a low-poly PS2 GLB. **Your job is the anatomy and the identity**: bases that read as real Mongolian people at thumbnail size, so the PS2 conversion has something good to simplify.

## Read first
1. `docs/plans/2026-10-28-base-models-plan.md`: **the plan you are finishing.** Section 3 is the "Ganaa bar", section 6 lists phases B2–B4, and section 8 holds the user's answers. In particular: *human proportions and structure first, "as human as possible", 2K skin is enough.*
2. `artifacts/character-master/DNA.md` and `scripts/dna.py`, `build_character.py`, `sculpt.py`, `qa_actor.py`.
3. `work/sculpt/base_m.py` (how Base M was built), and the existing `sculpt/base-m.target`, `base-f.target` and `base-c.target` (from 29 Oct).
4. The references in `artifacts/character-master/references/base-m`, `base-f`, `base-c` and `base-profiles`.
5. `AGENTS.md`: the DNA/MPFB system is the character source; the PS2 style is only the episode output (BM02).

## Tasks
1. **Audit** the current Base M/F/C. Build a neutral clay lineup (front + profile + 3/4) of each base and of the existing Ganaa/Tsetsegmaa/Altan DNA. Write what reads wrong: stretched, inflated, uncanny eye area, wrong proportions, child reading as a shrunk adult.
2. **Base M:** fix the open items in the plan (the brow-ridge highlight band, thin brows, overly warm/pink skin; brows near-black `#15110e`). Mongolian adult man: broad flat cheekbones, low nasal bridge, single or low eyelid fold with an inner fold, straight black hair.
3. **Base F:** a hero Mongolian adult woman. Not Base M feminized: her own structure, softer brow bone, fuller cheek fat pads, smaller jaw, single/hooded lid variants.
4. **Base C, age 3–10:** real child proportions. A large cranium relative to the face, short nose with a low bridge, round cheeks *without puffiness*, small chin, a short neck, about 4.5–5 heads tall at age 3. Altan (3) and Sarnai (10) must both read correctly. Note the existing DNA `base: child` macros.
5. **Eye area**, the user's top complaint across the whole project: the lids meet the iris, no white ring around the iris, visible lid thickness, believable epicanthic variants. **Each base needs ≥ 3 eye-shape variants** as DNA-selectable options, because the user wants every character's eyes different.
6. **Five test faces per base** (fictional people, made from DNA values only) that read as *different people* at thumbnail size (a squint test), plus the numeric distinctiveness report.
7. Keep everything that works: the 137-bone rig, expressions (neutral recovers exactly), clothes fitting, UVs, GLB export. `qa_actor.py` must pass for every base build.

## Rules
- Blender headless only, through the **new lock** (the file already exists; the old one is held by a stuck process):
  `timeout 900 flock -w 600 /home/barsaa/ms-workers/.blender-v2.lock blender -b --factory-startup --python-exit-code 1 ...`. If it times out or won't start, stop and report; don't wait forever. Never use the Blender MCP.
- Builds go in `~/.cache/khaniad-builds/<id>-bm01`. If the sandbox denies that, use `.cache/bm01/` inside your worktree. Never use `/tmp`.
- Write only under `artifacts/character-master/**` (scripts, `sculpt/*.target`, presets, `work/`), `work/sculpt/**` and `artifacts/episode-1-cast/dna/bases/**`. Do **not** rebuild or overwrite the published cast (`artifacts/episode-1-cast/<id>/`, `assets/cast/**`). Don't touch `src/` or `episodes/`. No commits.
- Bases stay `draft`; the user approves them.

## Evidence (`artifacts/character-master/qa/bm01/`)
- `audit.png` + `audit.md`: the before state.
- For each base: `base-<m|f|c>-clay.png` (front/profile/3/4, neutral material), `base-<x>-faces5.png` (five test faces, clay), `base-<x>-eyes.png` (eye variants, close-up), and `base-<x>-textured.png`.
- `child-ages.png`: Base C at 3 and 10 beside an adult for scale.
- `report.md`: what changed, the check results, and **what still looks wrong**, honestly.
