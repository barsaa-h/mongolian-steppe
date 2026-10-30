# Brief BM01: Finish the three base models (Base M, Base F, Base C child)

**Worker:** Codex. **Priority:** #1. The EP01 cast is rebuilt on these bases this week.

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
