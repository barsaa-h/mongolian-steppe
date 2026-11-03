# Agents

Production plans for every department (story, characters, environments, props, look, animation, sound, layout) live in [docs/agents/](docs/agents/README.md). Read [00-production-master-plan.md](docs/agents/00-production-master-plan.md) and your department's plan before working.

# Character work

**Output style (user decision, 31 Oct 2026, final):** EP01 is rendered in three.js
in a PS2-era (Silent Hill 2) style, and its cast is the **low-poly Vinrax-based
cast** seen in HOUR 5: `scripts/build-cast.py` + `assets/cast/roster.json` →
`assets/cast/<id>.glb`. The user chose fixing that pack (hands, eyes, mouth, hair,
Mongolian faces, a child base, more per-character controls) over the realistic
MakeHuman cast, which is too detailed for the look and for the laptop. For EP01
characters, change `build-cast.py`/`roster.json`, not the MPFB/DNA cast. The
MPFB/DNA workflow below stays for the archived realistic cast only.

When creating, regenerating or changing a realistic MPFB character, read
[the DNA workflow](artifacts/character-master/DNA.md) and use the shared
MakeHuman/MPFB generator.

- Give every character a full DNA file with individual face, age, body, skin and 2–3 visible signature traits.
- Change face parameters when identities look similar. Hair, clothing and skin tone do not establish a new facial identity.
- Keep identity, age and additive expression controls separate; retain the complete authoring topology and shared rig.
- Before delivering a character, run the neutral matching-material lineup, profile, expression, animation and distinctiveness checks. Show the human the lineup and profiles and identify failures.
- Improve the shared controls, fitting, libraries or material layers when a defect affects multiple characters. Keep manual edits outside generated output folders.
- Preserve script facts and explicitly label artistic choices. Keep DNA draft until the human approves it; lock only after that approval.
