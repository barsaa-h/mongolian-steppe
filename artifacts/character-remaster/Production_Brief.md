# MASTER PRODUCTION BRIEF
## Cinematic PS1-Inspired Character Remaster — Blender

### YOUR ROLE

You are acting as a senior character artist, anatomical modeler, facial rigging specialist, material artist, animation technical director, and quality-assurance reviewer.

Your task is to **professionally reconstruct and improve my existing Blender character model**, not to replace it with a completely different person.

I have provided a three-angle character reference showing the current model from the front, side, and back.

The existing model is an acceptable early prototype, but it is not yet suitable for my cinematic animated horror series.

**Your primary objective: Transform the character from an overly simplified, blocky figure into a believable, emotionally expressive, PS1-inspired cinematic character suitable for 720p animation and close-up acting.**

Keep the character's recognizable identity, haircut concept, green winter jacket, white shearling collar, trousers, brown boots, and overall personality.

Do not change the character into a cartoon, anime figure, photorealistic human, or generic asset-store character.

---

# PHASE 0 — PROJECT INSPECTION AND SAFETY

Before modifying anything:

1. Inspect the real Blender project, including all meshes, materials, textures, armatures, modifiers, shape keys, animation actions, and collections.
2. Capture the existing model in front, side, back, three-quarter, and facial close-up views.
3. Record current triangle counts, skeleton configuration, texture resolutions, object names, and rigging limitations.
4. Create a protected backup of the original project.
5. Never destructively overwrite the only existing model or animation.
6. Maintain consistent object naming, file organization, and transform conventions.
7. If existing topology prevents proper facial animation, explain the issue and locally rebuild the necessary geometry.
8. If existing animations are present, preserve them and retarget or repair their compatibility where necessary.

Do not start with subdivision or global smoothing. Diagnose the underlying issues first.

**Deliverable:** A baseline technical audit showing what needs reconstruction and what can safely be reused.

---

# PHASE 1 — CORRECT HUMAN ANATOMY AND BODY PROPORTIONS

## 1.1 Overall anatomy

The current character's body looks overly rigid and toy-like. Correct the anatomical structure while retaining the low-poly artistic identity.

Target a believable adult male silhouette.

Suggested proportional guidelines:

- Total character height: approximately 7–7.3 head heights.
- Correct the apparent head-to-body ratio without making the head tiny.
- Make the shoulder structure anatomically plausible rather than a rectangular block.
- Create natural transitions between neck, clavicles, shoulders, chest, ribs, waist, pelvis, and legs.
- Preserve believable musculature underneath winter clothing.
- Ensure the pelvis supports the torso naturally.
- Position elbows, wrists, knees, and ankles at anatomically sensible heights.
- Make the hands proportionate to the forearms and face.
- Correct the side silhouette so the head, shoulders, chest, pelvis, knees, and feet align in a believable standing posture.

Do not mechanically force every measurement to a fixed ratio if doing so damages the character's identity.

## 1.2 Clothing must follow the body

The jacket should feel like fabric worn over an actual person.

Improve:
- Shoulder slope and sleeve attachment.
- Natural volume around the upper arms.
- Chest and abdomen contours.
- Jacket thickness and hem structure.
- Sleeve-to-wrist transitions.
- Trouser volume around thighs, knees, and calves.
- Fabric compression where trousers meet the boots.

Avoid perfectly cylindrical arms, rectangular torsos, and straight tube-like legs.

## 1.3 Hands

Rebuild the hands to include:
- Proper palm volumes.
- Separate, naturally shaped fingers.
- Anatomically positioned thumbs.
- Knuckle structure.
- Small nail details where visible.
- Functional finger joints.
- Natural relaxed poses.

The hands must be capable of gripping objects, showing fear, pointing, grabbing, and expressive gestures.

## Acceptance test

Render orthographic front, side, and rear views plus a three-quarter perspective.

The character must look like a believable human wearing winter clothing, even without facial features or textures.

Do not continue until the silhouette is convincing.

---

# PHASE 2 — FULL FACIAL ANATOMY RECONSTRUCTION

**THIS IS THE MOST IMPORTANT PHASE OF THE PROJECT.**

The current facial design is too primitive to communicate nuanced human emotions.

The goal is not to make the face photorealistic. The goal is to make the face structurally capable of believable acting.

## 2.1 Skull and facial structure

Rework the head using anatomically informed, intentionally simplified forms.

Improve:
- Forehead slope and brow ridge.
- Temples and side skull.
- Eye socket depth.
- Nasal bridge, tip, nostrils, and alar wings.
- Cheekbone structure.
- Nasolabial region.
- Upper and lower lips.
- Chin and jawline.
- Lower cheek volume.
- Ear anatomy and attachment.
- Jaw-to-neck transition.

Keep deliberate polygon planes where they enhance the retro style, but remove large unnatural facial blocks.

Avoid a perfectly flat forehead-to-cheek transition.

## 2.2 Eye reconstruction

The eyes are critical for conveying emotion.

Rebuild with:
- Properly inset eyeballs.
- Functional upper and lower eyelids.
- Eye corners.
- Iris and pupil geometry or suitable textures.
- Controlled sclera visibility.
- Subtle tear-duct anatomy.
- Eyelid thickness.
- Simple but believable eyelashes.
- Eyebrows with an improved silhouette and movable controls.

Eyes must convey:
- Fear.
- Exhaustion.
- Sadness.
- Anger.
- Suspicion.
- Shock.
- Pain.
- Happiness.
- Emotional numbness.

The existing sleepy-looking eyes must not become a permanent restriction on expressions.

## 2.3 Mouth reconstruction

The current mouth is too simplistic.

Build a functional mouth system with:
- Upper and lower lip volumes.
- Real mouth opening.
- Distinct mouth corners.
- Inner mouth surfaces.
- Teeth.
- Tongue, where required.
- Jaw articulation.
- Facial geometry supporting lip compression, stretching, curling, and asymmetry.

The mouth must be capable of dialogue and crying, screaming, laughing, trembling, and breathing.

Do not fake every expression by replacing mouth textures.

## 2.4 Facial topology

Create deformation-friendly topology with edge loops following facial muscles.

Prioritize:
- Concentric loops around each eye.
- Several controlled loops around the lips.
- Clean paths between the nose, cheek, and mouth corners.
- Sufficient cheek geometry for smiling and tension.
- Brow geometry for raising and compressing expressions.
- Stable topology around the jaw and chin.

Use enough geometry to avoid visible facial tearing, angular mouth distortion, or eyelid intersection.

Retain the recognizable low-poly style through controlled surface shaping and materials, not by sacrificing the mesh's animation capability.

## Acceptance test

Produce close-up renders of the neutral face from:
1. Front.
2. Left three-quarter.
3. Right three-quarter.
4. Full side.
5. Slightly above.
6. Slightly below.

The facial structure must look convincing from every angle.

---

# PHASE 3 — PROFESSIONAL FACIAL ANIMATION SYSTEM

Create a robust facial rig suitable for dramatic character acting.

Prefer a combined bone-driven and shape-key system when appropriate.

## 3.1 Required facial controls

Provide independently adjustable controls for at least:

**Eyes**
- Blink left and right.
- Eyelid widening.
- Eye squinting.
- Eye gaze direction.
- Upper and lower eyelid adjustments.

**Eyebrows**
- Inner brow raising.
- Outer brow raising.
- Brow lowering.
- Brow compression.
- Independent left and right movement.

**Mouth**
- Jaw opening.
- Mouth closing.
- Smile left and right.
- Frown left and right.
- Lip pressing.
- Lip stretching.
- Lip puckering.
- Mouth rounding.
- Upper lip raising.
- Lower lip movement.
- Mouth corner asymmetry.

**Face**
- Cheek raising.
- Cheek compression.
- Nose wrinkling.
- Subtle asymmetrical tension.
- Facial pain reactions.

Provide corrective shape keys where combined expressions otherwise produce bad geometry.

## 3.2 Speech animation

Create phoneme or viseme controls for dialogue.

At minimum support readable versions of:
- AA
- EE
- OH
- OO
- FV
- MBP
- L
- WQ

Ensure speech shapes can combine with emotion without collapsing the face.

The character must be able to speak naturally while angry, terrified, sad, exhausted, or smiling.

## 3.3 Emotional performance test

Create and save facial poses for:

1. Neutral — natural resting expression.
2. Quiet sadness — slightly raised inner brows, heavy eyes, tense lips.
3. Fear — wide eyes, forehead tension, open mouth.
4. Anger — compressed brows, tense jaw, asymmetrical mouth.
5. Shock — sudden eye widening and jaw drop.
6. Grief — distorted lips, narrowed or tearful eyes.
7. Physical pain — compressed eyes, facial tension, clenched jaw.
8. Subtle happiness — cheek involvement, soft smile, altered eye shape.
9. Exhaustion — reduced eyelid openness and relaxed facial tension.
10. Zombie-like vacant expression — impaired gaze, asymmetric jaw and weakened muscle response.

Do not create exaggerated cartoon expressions.

Emotions should feel human and cinematic.

## 3.4 Animation quality standards

Test:
- Slow blinking.
- Eye tracking.
- Mouth opening.
- Dialogue transition sequences.
- Combined eyebrow and eye motion.
- Expressions transitioning from neutral to fear.
- Crying transitions.
- Pain reactions.
- Angry speech.
- Asymmetrical facial tension.

All expressions must interpolate smoothly.

No clipping, inverted surfaces, mouth tearing, eyelid penetration, or harsh unnatural shape-key transitions.

**Critical requirement:** Emotional expressions must remain recognizable when rendered at 1280×720, including medium close-up shots where the face is relatively small on screen.

A beautiful static model with poor facial animation is a failed deliverable.

---

# PHASE 4 — REBUILD THE HAIR

The current hairstyle resembles a smooth black helmet or mud-like object.

Replace it with a deliberate stylized haircut that follows believable hair growth and direction.

## 4.1 Hair silhouette

Preserve the overall short dark haircut and recognizable outline.

Improve:
- Natural hairline.
- Direction of growth from the crown.
- Side hair volume.
- Hair separation around the temples.
- Front fringe structure.
- Back-of-head layering.
- Asymmetrical hair clumps.
- Visible strand groupings.

## 4.2 Geometry

Use stylized sculpted hair clumps or hair cards, whichever produces a stronger result.

Preferred appearance:
- Medium-sized primary clumps defining the silhouette.
- Smaller secondary clumps breaking the uniform surface.
- Select fine strand details near the forehead and sideburns.
- No perfectly smooth hair cap.
- No randomly scattered spaghetti strands.
- No excessive realistic hair simulation.

The geometry should deliberately support the hairstyle's overall direction.

## 4.3 Hair materials

Use very dark brown-black hair rather than completely featureless pure black.

Introduce:
- Subtle directional highlights.
- Material variation across clumps.
- Slight roughness variation.
- Controlled warm and cool tones.
- Consistent appearance under dim lighting.

The hair must remain readable in night scenes without looking wet or plastic.

## Acceptance test

Show hair from front, side, rear, and above under neutral lighting.

The hair must read as actual stylized hair, not one solid helmet-shaped object.

---

# PHASE 5 — NATURAL SKIN AND MATERIAL RECONSTRUCTION

The existing skin looks too uniform and orange-brown.

Create believable human skin suitable for a stylized Mongolian character.

Do not assume there is one universal Mongolian skin color. Preserve the character's established identity while refining his complexion toward natural warm-to-neutral human skin tones.

## 5.1 Skin color

Use layered, restrained color variation.

Examples:
- Slight redness around cheeks and nose.
- Subtle darker variation near eyes.
- Natural tonal separation around the lips.
- Slightly different color on ears.
- Soft warmth on the forehead.
- Subtle shadows and color variation around jaw and neck.

Avoid:
- Uniform orange surfaces.
- Excessive brown shadow patches.
- Gray, lifeless complexion unless required for a scene.
- Random high-contrast skin noise.
- Photorealistic pore textures that clash with the retro style.

## 5.2 Skin geometry and shader

Use controlled angular forms with selective smooth shading.

Do not globally subdivide everything.

Preserve some planar changes in the:
- Forehead.
- Cheeks.
- Nose.
- Jaw.
- Chin.

Use restrained subsurface scattering where the rendering engine supports it effectively.

Tune roughness and specular response to prevent waxy or plastic skin.

Skin must look convincing under:
- Overcast daylight.
- Warm interior lighting.
- Cold moonlight.
- Firelight.
- Dark horror-scene lighting.

## 5.3 UV and texture quality

Allocate sufficient texture space to the face.

Suggested starting point:
- Head texture: 1024×1024 for ordinary animation, with a 2048×2048 option for demanding close-ups.
- Clothing atlas: 2048×2048 where justified.
- Hair atlas: 1024×1024, adjustable according to the selected implementation.
- Separate masks or maps only when they add visible value.

Optimize UV texel density and avoid wasting texture space.

Use deliberate artistic texture design rather than random procedural noise.

Important: A 720p render target is not a texture-resolution setting. The aim is a face that remains readable at the final on-screen size.

---

# PHASE 6 — CLOTHING DETAIL AND MATERIAL QUALITY

Retain the recognizable outfit.

## 6.1 Green winter jacket

Improve:
- Main jacket silhouette.
- Fabric thickness.
- Seams and panel boundaries.
- Pocket depth and openings.
- Zipper construction.
- Collar attachment.
- Sleeve cuffs.
- Natural wrinkles.
- Fabric tension around shoulders, elbows, and stomach.

Keep the jacket practical, rugged, and visually appropriate for a rural Mongolian setting.

## 6.2 White shearling collar

The existing collar contains many very pronounced white lumps.

Rebuild it with:
- More believable fabric backing.
- Layered fleece volume.
- Irregular but restrained clumps.
- Softer transitions.
- Distinct separation between textile and fleece.

It should resemble shearling or fleece, not popcorn, stones, or snowballs.

## 6.3 Trousers

Improve:
- Waist-to-hip anatomy.
- Crotch structure.
- Thigh volume.
- Knee definition.
- Ankle taper.
- Cloth folds.
- Material response.

Avoid the appearance of two perfectly straight vertical tubes.

## 6.4 Boots

Improve:
- Sole thickness.
- Heel structure.
- Toe box.
- Laces and eyelets.
- Ankle structure.
- Material boundaries.
- Contact with the ground.

Make the boots believable without overloading them with unnecessary detail.

---

# PHASE 7 — FULL BODY RIGGING AND DEFORMATION

The character must be capable of acting in serious cinematic scenes.

Create or upgrade an animator-friendly skeleton.

Required capabilities:
- Natural walking and running.
- Crouching and kneeling.
- Sitting.
- Falling.
- Crawling.
- Reaching.
- Grabbing objects.
- Fighting.
- Limping.
- Holding a weapon or tool.
- Turning the head independently.
- Expressive hand poses.
- Controlled shoulder and spine movement.
- Stable foot contact.

Use IK/FK systems where appropriate.

Add corrective deformation for:
- Raised shoulders.
- Bent elbows.
- Deep knee bends.
- Hip rotation.
- Neck movement.
- Wrist bending.

Test poses with extreme and ordinary joint angles.

Avoid candy-wrapper twisting, mesh collapse, detached sleeve appearances, and unnaturally cylindrical bending.

## Body acting

This is a cinematic character.

Support subtle performances such as:
- Shoulder tension.
- Uneven breathing.
- Fearful posture.
- Exhaustion.
- Shivering.
- Heavy breathing after running.
- Head hesitation.
- Slow emotional collapse.

The character should feel alive even when not talking.

---

# PHASE 8 — HORROR AND ZOMBIE PRODUCTION READINESS

My series contains zombies, injuries, torn clothing, and physically damaged characters.

Design the system to support these effects without destroying the original model.

## 8.1 Modular damage system

Create optional, separately controllable damage assets.

Examples:
- Torn sleeves.
- Damaged jacket surfaces.
- Blood or dirt decals.
- Facial injuries.
- Bruising and discoloration.
- Exposed damaged clothing layers.
- Dirty or matted hair.
- Torn trouser variations.

Use independent collections or controlled mesh variations.

Never permanently bake damage into the clean master character.

## 8.2 Severable body parts

Prepare the character for controlled dismemberment effects where the production requires them.

Potential separation zones:
- Neck.
- Shoulder.
- Elbow.
- Wrist.
- Waist.
- Knee.
- Ankle.

Create clean modular cut variants with matching internal cap geometry, independent attachment controls, and appropriate stylized wound materials.

The clean character should not display visible seams or gaps during ordinary animation.

These effects may use prepared alternate meshes rather than relying on live boolean operations.

## 8.3 Zombie variants

Create a reusable workflow for zombie-specific variations.

Support:
- Discolored skin.
- Sunken cheeks.
- Reduced facial vitality.
- Asymmetrical facial poses.
- Blank or unfocused eyes.
- Irregular mouth posture.
- Dirt and decay.
- Torn clothing.
- Stiff or unstable body movement.

Zombies should remain anatomically recognizable humans.

Avoid turning them into humorous blocky creatures.

Preserve the same cinematic visual language as the human cast.

---

# PHASE 9 — VISUAL STYLE AND RENDERING

## 9.1 Artistic direction

The finished character should appear to belong to a modern cinematic game inspired by late-1990s and early-2000s survival horror.

Key traits:
- Recognizable low-poly silhouette.
- Intentional angular geometry.
- Believable anatomy.
- Detailed expressive face.
- Controlled retro textures.
- Cinematic lighting.
- Strong facial readability.
- Serious, grounded atmosphere.

Do not create:
- A LEGO-like figure.
- A Roblox-style character.
- A realistic MetaHuman.
- A Pixar cartoon.
- An anime character.
- An unmodified PS1-era 500-polygon figure.

## 9.2 Rendering workflow

Use the current project's Blender-compatible rendering workflow.

Prepare consistent previews with:
- Neutral studio lighting.
- Soft directional light.
- Nighttime cinematic lighting.
- Warm interior lighting.

Avoid using attractive dramatic lighting to hide geometry problems.

First prove the model looks good under neutral lighting.

Then test cinematic lighting.

## 9.3 Final resolution tests

Render actual 1280×720 test frames.

Evaluate:
- Full body.
- Medium shot.
- Head-and-shoulders shot.
- Close-up.
- Extreme facial close-up.

Also render selected 1920×1080 samples to identify geometry or shading problems.

The model must not depend on artificial image sharpening to appear detailed.

---

# PHASE 10 — PERFORMANCE AND EXPORT

The character may be animated in Blender and potentially used in other 3D pipelines.

Maintain clean:
- Mesh topology.
- Object names.
- Armature hierarchy.
- Shape-key names.
- UV maps.
- Materials.
- Texture file paths.
- Scene organization.

Prefer a primary cinematic-quality character and an optimized LOD version if necessary.

The cinematic version should prioritize acting and deformation quality over arbitrary polygon limits.

When exporting GLB or another requested exchange format:
- Preserve the functional skeleton.
- Preserve supported facial morph targets.
- Preserve materials and textures where possible.
- Test export by importing the result into a fresh scene.
- Verify whether corrective drivers or Blender-specific controls require baking or conversion.

Do not claim a successful export solely because a file was written.

---

# PHASE 11 — REQUIRED QUALITY ASSURANCE

Perform the following evaluations before declaring success.

### A. Visual anatomy test
- Front silhouette believable.
- Side silhouette believable.
- Three-quarter silhouette believable.
- Correct head-to-body proportions.
- Natural shoulder, pelvis and leg relationships.

### B. Facial test
- Eyeballs positioned correctly.
- Eyelids close naturally.
- Brows move independently.
- Mouth opens without distortion.
- Teeth do not penetrate the lips.
- Emotions are clearly distinguishable.
- Expressions transition smoothly.
- Facial features remain recognizable at 720p.

### C. Hair test
- Hairline reads naturally.
- Directional clumps are visible.
- Hair is not a solid black helmet.
- Hair remains readable in dark scenes.

### D. Skin/material test
- No overly orange skin.
- No random muddy discoloration.
- No plastic-looking roughness.
- No excessive texture noise.
- Good readability in dark and bright lighting.

### E. Rig test
- Walking and arm movements deform naturally.
- Fingers bend correctly.
- Shoulders and elbows do not collapse.
- Neck rotation does not break the collar.
- Facial acting works during head movement.

### F. Horror readiness test
- Clean model preserved.
- Damage variations do not corrupt original assets.
- Separation meshes are properly prepared.
- Zombie materials remain compatible with the character rig.

If any test fails, revise the relevant stage rather than declaring the work complete.

---

# PHASE 12 — FINAL DELIVERABLES

Deliver:

1. **Character_Master.blend** — the complete updated character project.
2. **Character_Cinematic.glb** — optimized interchange model where supported.
3. **Character_Textures/** — organized texture maps.
4. **Character_Rig_Documentation.md** — skeleton, shape keys, controls, naming, compatibility, and usage.
5. **Character_Comparison/** — before-and-after renders.
6. **Character_Expressions/** — facial emotion test images and saved poses.
7. **Character_Animation_Tests/** — body and facial motion demonstrations.
8. **Character_Horror_Variants/** — optional zombie and damage-ready variations.

Produce a comparison contact sheet with the original and improved character using identical camera angles, approximate framing, neutral lighting, and render settings.

Provide a close-up emotion contact sheet with at least eight substantially different expressions.

Keep project files organized, editable, and suitable for future character iterations.

---

# EXECUTION PRIORITY

Work in this order:

**Priority 1: Facial anatomy and emotional expression.**

**Priority 2: Overall body proportions and human silhouette.**

**Priority 3: Hair reconstruction.**

**Priority 4: Skin tone and facial materials.**

**Priority 5: Facial and body rigging.**

**Priority 6: Clothing and accessories.**

**Priority 7: Horror damage systems.**

**Priority 8: Performance, export, and final quality control.**

Each completed phase should generate visual evidence for inspection.

Do not spend most of the effort polishing the boots or jacket while the face still looks primitive.

Do not perform destructive topology edits after creating animation shape keys without handling their dependencies.

Do not silently abandon difficult requirements.

If direct project access, rigging tools, or export capabilities are missing, state the limitation precisely rather than pretending the stage was completed.

# FINAL ARTISTIC STANDARD

This is not a background NPC.

This is a principal character for a dark, emotionally serious cinematic animation.

The audience must be capable of recognizing terror through his eyes, grief through his mouth, and exhaustion through his posture.

He should still resemble a character from a retro 3D horror game, but he should move and express emotion with the subtlety of a believable human.

**Preserve the retro aesthetic. Remove the toy-like anatomy. Make the face perform. Make the character feel alive.**

The project is complete only when these qualities are demonstrated in actual animation tests, not just attractive still images.