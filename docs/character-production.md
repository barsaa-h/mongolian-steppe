# Character production

> For new character authoring use [Character Master](../artifacts/character-master/README.md) and the shared MakeHuman/MPFB DNA workflow. The API and Vinrax pipeline below document the current legacy runtime. Keep that runtime working while the café test proves the new actors; it is not the chosen source for new identities.

The cast studio includes 48 on-screen actors from the Episodes 1–5 dialogue master,
plus two documented voice roles. Each visible actor has an editable `.blend` and
an embedded-texture GLB under `assets/cast/`. The roster, aliases and authored
appearance fields are documented in [cast.md](cast.md); source credits are in
[asset-sources.md](asset-sources.md).

```js
import { loadCharacter } from "./character.js";
const actor = await loadCharacter({ id: "ganaa", detail: "hero" });
scene.add(actor.group);
actor.setMotion("hour-five");
actor.setTime(22.15); // absolute seconds; deterministic scrubbing
actor.setExpression("fear"); // neutral returns to the authored expression
// For continuous preview instead: actor.update(deltaSeconds).
actor.dispose();
```

Cast actors expose `motions`, `profile`, `group`, `setMotion`, `setTime`,
`setExpression`, `update`, `getOutfit`, `dispose` and `info`. Expressions are
neutral, fear, hunger and resolve. Adults/teenagers have idle, walk, wave and
cough previews; infants have idle. Ganaa additionally has `hour-five`.
No speech audio or phoneme-level lip sync is provided. The performance has
manually timed mouth movement, gaze, holds and body action.

Cast geometry shares two edited Vinrax base topologies. Faces, body proportions,
hair and role-specific clothes are authored from roster fields; these are not
scanned likenesses. Hero/crowd currently use the same exported cast asset.
The full cast has designs and preview rigs; only Ganaa has finished scene blocking.

## Legacy wardrobe

The legacy male base retains ten garment shapes × eight palettes × four headwear
choices. These 320 combinations belong to one character identity. They are not
48 interchangeable wardrobes and do not auto-fit the new female or child models.

Run `npm run start:character`, then open `http://localhost:5174/character.html`.
The town still uses `npm start` on port 5173.

## Inspecting the character

The studio renders at the viewport's native resolution by default. Face close-up
centers the face; Full body resets framing. Turntable rotates the camera. The
optional PSX preview uses the existing scene post-processing. Mouse orbit, zoom,
and pan are supplied by Three.js OrbitControls.

Idle includes subtle breathing, looking, and texture-based blinks. Walk and Wave
are procedural previews that move the existing body bones. Rest pose resets all
animated bones. These previews are not baked motion-capture clips, a locomotion
controller, or dialogue lip sync.

Garments have normalized skin weights, using a dedicated skeleton that references
the base model's bones. Sleeves blend upper-arm and forearm influences; hems blend
pelvis and thigh influences. Hats use the head bone. Clothes continue to deform
after moving the whole character into a scene. Their deformation is skeletal;
there is no cloth simulation or collision solver.

## Wardrobe

The silhouettes are classic deel, riding deel, winter deel, summer deel,
ceremonial deel, work jacket, quilted jacket, wool waistcoat, travel coat, and
herder robe. They vary in hem length, flare, collar, sleeve coverage, padding,
slits, pockets, and ornament. Palettes coordinate fabric, trim, trousers, leather,
and headwear. Headwear is a pointed hat, felt cap, winter cap, or bare head.

`src/wardrobe.js` is the source of truth. IDs have the form
`classic-deel/indigo/pointed`. The studio's JSON export records the ID, detail
profile, and motion selection. It is a configuration export, not a GLB or FBX export.

## Reusing the character

```js
import * as THREE from "three";
import { loadMongolianMan } from "./character.js";

const actor = await loadMongolianMan({
  position: new THREE.Vector3(0, 0, 0),
  rotationY: 0,
  outfit: "riding-deel/teal/felt",
  detail: "hero", // "crowd" for a compact atlas and simpler garments
});
scene.add(actor.group);
actor.setMotion("walk");

// In the existing render loop, with delta in seconds:
actor.update(delta);

// Swap clothes without reloading the FBX or resetting the pose:
actor.setOutfit("work-jacket/umber/none");

// When removing an actor:
actor.dispose();
```

The earlier `group` and `setState({ bob, bodyYaw })` interface remains available
to the town. Call `update(delta)` in consumers that need the new skeletal previews.

The FBX and atlases load once. SkeletonUtils gives each actor its own body rig.
Garment geometry is cached by silhouette, headwear, and detail; fabric textures
and wardrobe materials are shared. Tint uniforms preserve one shared atlas
instead of uploading another large bitmap for every outfit. Disposing an actor
releases its skeleton textures and body material while retaining shared resources.

Background detail reduces garment segments and omits small ornament. The body mesh
remains the original base topology. No 100-character performance budget has been
established; profile the intended shot and hardware before deciding cast density.

## Texture provenance

- Original: `assets/male_casual/man_tex.png`, 256 × 256, retained unchanged.
- Refined: `assets/male_casual/man_tex-refined.png`, 1254 × 1254, generated with the
  built-in ImageGen tool using the original atlas as the edit target.
- The existing FBX UVs and skeleton are retained. This is texture refinement,
  not a new facial mesh or a retopology pass.
- Clothing masks come from the original atlas. The refined image supplies the
  facial and surface detail; shader tinting preserves skin while recoloring clothing.

Generation prompt (the requested resolution was 2048; the returned asset is 1254):

> Use case: precise-object-edit. Asset type: production 3D character UV diffuse
> texture atlas, square 2048x2048 high resolution. The input is the EDIT TARGET,
> a 256x256 full-body male UV texture, NOT a portrait or reference sheet. Enhance
> it into a sharp detailed hand-painted game texture. ABSOLUTE UV INVARIANTS:
> retain the EXACT normalized location, size, orientation, outline and spacing
> of EVERY existing UV island and every facial landmark. Do not rearrange,
> enlarge, center, rotate, or add any island. Maintain exact shirt-front top-left,
> shirt-back top-mid-left, frontal face upper center-right, side head upper-right,
> blue trouser legs left half lower region, arms/hands lower-middle-right, shoes
> bottom right. Keep clothing cyan/teal shirt and blue pants hues for a runtime
> recoloring mask. Improve ONLY detail and finish: refined natural adult Mongolian
> male face with crisp dark brows, clean eyelids and warm dark brown irises, short
> dark hair, subtle moustache and beard stubble, warm natural skin, restrained
> painterly skin planes, tasteful fabric weave and stitching. Keep recognizable
> original landmark placement, eyes around normalized x .64/.73 y .17, mouth
> x .69 y .285 (use actual source alignment as authoritative). Flat albedo texture
> with no directional lighting, no cast shadows, no ambient background, no words,
> no watermark, no new objects. Treat the input as a pixel-aligned UV layout.
> Sharp 2K painted detail with correct anatomical texture, not pixel art and not
> a rendered person. Preserve solid atlas coverage and existing dark unused areas.

## Verification and production limits

`npm run check` tests all 320 IDs, geometry and weights for every garment/headwear
pair in both detail profiles, fabric masks, independent animation state, and real
FBX garment binding/deformation, then compiles the town and studio.

This base supports outfit exploration and body-motion blocking. Distinct lead
characters still need authored faces, body proportions, hair, and expressions.
Dialogue needs a facial rig and visemes. The original Vinrax asset permits project use with credit; see the recorded
source terms in asset-sources.md. Garment fit in extreme poses and the
entire future cast remain production QA work.
