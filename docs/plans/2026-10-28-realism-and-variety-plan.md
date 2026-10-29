# Realism and variety plan: faces that belong in a horror story

Created 2026-10-28 after the Base M review. Status: **proposed.** Extends the
[base models plan](2026-10-28-base-models-plan.md); keeps its tooling (sculpt layers, DNA, QA).

## 1. What the user sees, and why

| Complaint | Real cause in the pipeline |
| --- | --- |
| **"They still look similar"** | Everyone shares the same eye asset, the same single brow card and texture, ~5 skin photos, 9 helmet hair meshes, the same studio light and the same blank neutral. Identity lives in small proportion sliders, and Base M added even more shared structure. Real people differ first in **big** things: face length vs width, cheekbone height, eye shape type, nose type, coloring, hair, age marks and resting expression. |
| **"Eyes look weird"** | No eyelashes (the stock cards were removed), so the lid rim is bare. Clean bright sclera with no tear line, no pink inner corner, no lid thickness or shadow; an iris that looks painted on; eyes too open, so they stare. Every character has the same eye. |
| **"Eyebrows need more difference"** | One brow mesh shape and five similar textures for everyone, placed the same way. |
| **"Baby looks so weird"** | Altan is an adult mesh with toddler sliders: wrong skull-to-face ratio, puffy pursed lips, adult skin photo. Needs the planned child base (Base C). |
| **"They look funny" (vs a horror script)** | Toy-like smooth skin, saturated pink lips, even bright studio light, a wide-eyed staring neutral and no imperfections. The script asks for ordinary tired people in dim practical light: a crowded concrete flat at night, a roadside café, a truck cab. Horror comes from realism plus small wrong details (sweat, pallor, stillness), never from cartoon faces. |

## 2. The look target

**Grounded early-2000s survival-horror realism:** ordinary, imperfect, tired faces that hold up in
close-ups lit by practical lights. Keep the current detail level (as you asked), and get realism from
**form, color and light**, not polygon count.

- Faces are judged in **scene lighting**, not only studio light. Every review sheet shows the
  character under (a) neutral studio, (b) warm tungsten party light, (c) café fluorescent and (d) a
  night truck cab.
- The resting face is never a blank doll stare. Each character gets a slight **resting expression**
  (tired lids, a faint frown, a habitual mouth set), plus idle blinks and eye movement in motion.
- Skin is never clean plastic. Every adult gets uneven tone, under-eye darkness, pores, a little oil
  sheen and age- or life-appropriate marks.

## 3. Workstreams

### W1. Look-dev scene and review sheet (first; everything else is judged here)
- A Blender look-dev file with the four lighting rigs above and the actual shot lenses, plus a
  three-quarter close-up and a mid shot.
- A review-sheet generator: reference photo | model in four lights | profile | lineup thumbnail.
  This replaces the current studio-only renders for all approvals.
- **Done when:** you can open one image per character and judge it in the light it will actually be
  seen in.

### W2. Eyes, rebuilt (shared; biggest single realism gain)
- **Lashes:** a dense dark upper lash line (short and straight for most Mongolian characters), a sparse
  lower line, fitted to the lid and following blinks.
- **Lid realism:** visible lid thickness, a wet line, a pink inner corner (caruncle), soft shadow of the
  upper lid on the eyeball, slightly off-white sclera with faint vessels and darker edges.
- **Iris depth:** a dark limbal ring, a soft refraction look in Blender, dark brown to near-black
  irises for most of the cast (grey or blue for the Russian characters).
- **Eye-shape types as sculpt layers:** monolid, low-crease, hooded, deep-set, tired or droopy. Each
  character picks one, so eyes stop being identical.
- **Per-person eye states:** yellowed sclera for elders, red-rimmed for a drinker (Sükhee) or fever
  (Ganaa, Dasha), tired heavy lids (Oyun).
- **Done when:** a close-up at party light reads as a living person's eye, and five characters'
  eyes are distinguishable with the rest of the face covered.

### W3. Brow library
- About ten painted brow types: thick straight; thick tapered; bushy unkempt (elder men); sparse
  short; patchy; thin plucked 1990s (party women); natural female; faint child; grey elder; and one
  with a scar gap.
- Per-character placement: height above the eye, inner gap, angle and asymmetry.
- **Done when:** you can tell the cast apart by their brows alone in the lineup.

### W4. Face-structure variety (the fix for "they all look similar")
- From the reference grids, build **face-type layers** within each base:
  - Men: long-narrow, broad-flat, square-jawed, soft-round, bony-lean, heavy.
  - Women: oval, round, broad-cheekbone, long-lean, soft-heavy.
- Each character = base + one face type + personal sculpt + DNA sliders, with bigger
  differences between characters, not smaller ones.
- The distinctiveness check measures the **final face shape** (including sculpt layers), not just
  slider values. Plus a **squint test**: a blurred thumbnail lineup and a silhouette lineup, where
  every face must be recognizable.
- **Done when:** in a blurred lineup of the Episode 1 cast, no two people could be swapped.

### W5. Skin and color
- A wider skin-tone range: wind-darkened herders and drivers, pale indoor officials, a flushed cook,
  sallow elders.
- Under-eye darkness, uneven redness, oil on the T-zone, pores and blemishes; less saturated, more
  natural lips.
- Life and age layers from the base models plan: teen acne, drinker's capillaries, smoker's lines,
  weathering, age spots.
- Story-state skin: fever sweat and flush, pallor, the infected red line, blood, frost.
- **Done when:** no face reads as plastic in party light.

### W6. Hair
- Hair-card styles from the base models plan, with soft painted hairlines; slightly messy by default.
  Nobody in this story has salon hair.

### W7. Base C and the toddler (Altan), the child (Sarnai), and later the infant
- A real toddler sculpt: large cranium with a small lower face, short nose with a low bridge, round
  cheeks without puffy pursed lips, short neck, a toddler skin texture, fine wispy hair.
- Ten-year-old proportions for Sarnai from the same base.
- The infant (Naran) stays its own asset later.
- **Done when:** Altan reads as a real three-year-old girl in the party shot and the sad final
  "Хамт" moment.

### W8. Resting expressions and life in motion
- Each character's neutral carries a resting expression layer (Ganaa: easy half-smile lines;
  Tsetsegmaa: tired watchfulness; Dulmaa: pursed, inspecting; Irina: frown; Hürel: warm, sweaty;
  Sükhee: loose and drunk).
- Idle blink and eye-movement layers, so living characters never stare. That makes the turned
  Ganaa's **stillness** in the final scene land as the horror the script asks for.

### W9. Review protocol
- Per character: the review sheet (W1) next to their reference images, then your yes or no.
- Nothing is approved on scripts or scores.

## 4. Order

1. **W1** look-dev and review sheets (short; needed to judge everything else).
2. **W2** eyes, then **W3** brows (shared, highest visible impact).
3. **W4** face types on Base M, then Base F; rebuild the Episode 1 men and women on them.
4. **W5** skin and **W6** hair.
5. **W7** Base C and Altan.
6. **W8** resting expressions, then the full Episode 1 lineup review with you.
7. Then the café test (C05–C09) with the finished Ganaa, Hürel and Dasha.

## 4a. Progress, 2026-10-29

- **W1:** `scripts/lookdev.py` renders story-light review sheets.
- **W2 eyes:**
  - Lash lines, wet line and caruncle, built on the stock lash roots.
  - Iris size and pupils at 38%.
  - Warm white sclera with faint veins.
  - The recessed stock iris pit filled; it caused the "ghost iris" and the inner-corner notch.
- **Brows:**
  - Lifted onto the measured brow bone (DNA `brows.lift`).
  - True colors and 1.45× card height.
- **Stubble:** beard shadow plus fine whiskers (it used to show as blotches).
- **The user approved Ganaa's look** (Base M, eyes, brows).
- **Base F v1** built.
- **Eye-shape types:** monolid, hooded, almond, deep-set, round, upturned, downturned, puffy,
  small-round. They are assigned per character so eye areas differ.
- **Final script:** the user supplied `EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (25-min pilot).
  The full cast it requires is in `artifacts/character-master/production/EP01-v4-CAST.md`. 11 new roles
  now have full draft DNA: Nyamka, Bataa, Togoo, loader, customs officer, cousin, livestock driver,
  café driver, hospital guard, pharmacist, coal driver.
- **Dulmaa is Tsetsegmaa's mother.** They share high cheekbones as an intended family resemblance;
  their other features were pushed apart after the user saw them as too similar.

## 5. What I need from you

- **Per-character reference images** (prompts are in
  `artifacts/character-master/references/PROMPTS.md`), especially Altan, Tsetsegmaa, Dulmaa, Hürel,
  Sükhee and Dasha. With your permission I can generate them with your grok CLI instead.
- **Three or four images of the mood you imagine** (a scene, not a face): for example a 1990s
  Mongolian apartment party at night, a roadside café, a truck cab. These set the lighting target
  for W1.
