import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { buildGarmentGeometry, GARMENT_BONES } from "./characterGarments.js";
import { createCharacterAnimator } from "./characterAnimation.js";
import { DEFAULT_OUTFIT, GARMENTS, PALETTES, getOutfit } from "./wardrobe.js";

const MODEL_URL = "assets/male_casual/male_casual.fbx";
const ORIGINAL_ATLAS = "assets/male_casual/man_tex.png";
const REFINED_ATLAS = "assets/male_casual/man_tex-refined.png";
const geometryCache = new Map();
const materialCache = new Map();
let modelPromise;
let atlasPromise;
let weave;

export function classifyAtlasPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const light = (max + min) / 510;
  const saturation = d === 0 ? 0 : d / (255 - Math.abs(max + min - 255));
  let hue = 0;
  if (d) {
    if (max === r) hue = 60 * ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else hue = 60 * ((r - g) / d + 4);
  }
  if (hue >= 195 && hue <= 245 && saturation > 0.4) return [0, 1, 0];
  if (hue >= 160 && hue <= 200 && saturation > 0.05) return [1, 0, 0];
  if (saturation < 0.12 && light < 0.3) return [0, 0, 1];
  return [0, 0, 0];
}

async function loadAtlases() {
  const loader = new THREE.TextureLoader();
  const [original, refined] = await Promise.all([
    loader.loadAsync(ORIGINAL_ATLAS), loader.loadAsync(REFINED_ATLAS),
  ]);
  for (const map of [original, refined]) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.magFilter = THREE.LinearFilter;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.anisotropy = 8;
  }
  const canvas = document.createElement("canvas");
  canvas.width = original.image.width;
  canvas.height = original.image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(original.image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const data = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    const mask = classifyAtlasPixel(pixels[i], pixels[i + 1], pixels[i + 2]);
    data[i] = mask[0] * 255;
    data[i + 1] = mask[1] * 255;
    data[i + 2] = mask[2] * 255;
    data[i + 3] = 255;
  }
  const mask = new THREE.DataTexture(data, canvas.width, canvas.height);
  mask.flipY = true;
  mask.needsUpdate = true;
  return { original, refined, mask };
}

function fabricTexture() {
  if (weave) return weave;
  const data = new Uint8Array(32 * 32 * 4);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const value = 244 + ((x % 4 === 0 || y % 4 === 0) ? -4 : 0) + ((x * 17 + y * 13) % 3);
      const i = (y * 32 + x) * 4;
      data.set([value, value, value, 255], i);
    }
  }
  weave = new THREE.DataTexture(data, 32, 32);
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
  weave.repeat.set(8, 8);
  weave.magFilter = THREE.LinearFilter;
  weave.minFilter = THREE.LinearMipmapLinearFilter;
  weave.generateMipmaps = true;
  weave.anisotropy = 4;
  weave.colorSpace = THREE.SRGBColorSpace;
  weave.needsUpdate = true;
  return weave;
}

function materials(palette) {
  if (materialCache.has(palette.id)) return materialCache.get(palette.id);
  const result = {
    cloth: new THREE.MeshStandardMaterial({ color: palette.cloth, map: fabricTexture(), roughness: 0.95, side: THREE.DoubleSide }),
    trim: new THREE.MeshStandardMaterial({ color: palette.trim, roughness: 0.54, metalness: 0.22 }),
    hat: new THREE.MeshStandardMaterial({ color: palette.hat, map: fabricTexture(), roughness: 0.95, side: THREE.DoubleSide }),
    fur: new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.trim).lerp(new THREE.Color(0x70645a), 0.55), map: fabricTexture(), roughness: 1, side: THREE.DoubleSide }),
  };
  materialCache.set(palette.id, result);
  return result;
}

function skinMaterial(atlases, detail) {
  const uniforms = {
    atlasMask: { value: atlases.mask },
    coatColor: { value: new THREE.Color() },
    trouserColor: { value: new THREE.Color() },
    bootColor: { value: new THREE.Color() },
    blinkAmount: { value: 0 },
  };
  const material = new THREE.MeshStandardMaterial({
    map: detail === "hero" ? atlases.refined : atlases.original,
    roughness: 0.83, metalness: 0,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `
      #include <common>
      uniform sampler2D atlasMask;
      uniform vec3 coatColor;
      uniform vec3 trouserColor;
      uniform vec3 bootColor;
      uniform float blinkAmount;
    `).replace("#include <map_fragment>", `
      #include <map_fragment>
      vec3 region = texture2D(atlasMask, vMapUv).rgb;
      float shade = clamp(dot(sampledDiffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)) * 5.5 + 0.55, 0.5, 1.35);
      diffuseColor.rgb = mix(diffuseColor.rgb, coatColor * shade, region.r);
      diffuseColor.rgb = mix(diffuseColor.rgb, trouserColor * shade, region.g);
      diffuseColor.rgb = mix(diffuseColor.rgb, bootColor * shade, region.b);
      float eyeLeft = 1.0 - smoothstep(0.75, 1.0, length((vMapUv - vec2(0.639, 0.825)) / vec2(0.024, 0.010)));
      float eyeRight = 1.0 - smoothstep(0.75, 1.0, length((vMapUv - vec2(0.718, 0.825)) / vec2(0.024, 0.010)));
      vec3 eyelid = texture2D(map, vMapUv - vec2(0.0, 0.033)).rgb;
      diffuseColor.rgb = mix(diffuseColor.rgb, eyelid, max(eyeLeft, eyeRight) * blinkAmount);
    `);
  };
  material.customProgramCacheKey = () => "character-atlas-v1";
  return { material, uniforms };
}

export async function loadMongolianMan({ position = new THREE.Vector3(), rotationY = 0.35,
  outfit = DEFAULT_OUTFIT, detail = "hero" } = {}) {
  getOutfit(outfit);
  if (!["hero", "crowd"].includes(detail)) throw new Error(`Unknown character detail: ${detail}`);
  modelPromise ??= new FBXLoader().loadAsync(MODEL_URL).catch((error) => { modelPromise = undefined; throw error; });
  atlasPromise ??= loadAtlases().catch((error) => { atlasPromise = undefined; throw error; });
  const [source, atlases] = await Promise.all([modelPromise, atlasPromise]);
  const model = clone(source);
  const skin = skinMaterial(atlases, detail);
  model.traverse((child) => {
    if (!child.isMesh) return;
    child.material = skin.material;
    child.castShadow = child.receiveShadow = true;
    child.frustumCulled = false;
  });
  const bounds = new THREE.Box3().setFromObject(model);
  const height = bounds.max.y - bounds.min.y;
  if (!Number.isFinite(height) || height <= 0) throw new Error("Character model has invalid bounds");
  const scale = 1.5 / height;
  model.scale.setScalar(scale);
  model.position.set(-(bounds.min.x + bounds.max.x) * scale / 2,
    -bounds.min.y * scale, -(bounds.min.z + bounds.max.z) * scale / 2);

  const group = new THREE.Group();
  group.name = "Mongolian character";
  group.add(model);
  group.updateMatrixWorld(true);
  const garmentBones = GARMENT_BONES.map((name) => {
    const bone = model.getObjectByName(name);
    if (!bone?.isBone) throw new Error(`Character rig is missing ${name}`);
    return bone;
  });
  const skeleton = new THREE.Skeleton(garmentBones);
  const animation = createCharacterAnimator(model);
  let wardrobe;
  let currentOutfit;

  function setOutfit(id) {
    const selection = getOutfit(id);
    const palette = PALETTES.find((item) => item.id === selection.palette);
    const key = `${selection.garment}/${selection.headwear}/${detail}`;
    if (!geometryCache.has(key)) {
      geometryCache.set(key, buildGarmentGeometry(selection.garment, selection.headwear, detail));
    }
    const next = new THREE.Group();
    const surfaces = materials(palette);
    for (const [kind, geometry] of Object.entries(geometryCache.get(key))) {
      const mesh = new THREE.SkinnedMesh(geometry, surfaces[kind]);
      mesh.name = `wardrobe-${kind}`;
      mesh.bind(skeleton, new THREE.Matrix4());
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      next.add(mesh);
    }
    if (wardrobe) group.remove(wardrobe);
    wardrobe = next;
    group.add(wardrobe);
    const garment = GARMENTS.find((item) => item.id === selection.garment);
    skin.uniforms.coatColor.value.set(garment.sleeves ? palette.cloth : palette.trim);
    if (!garment.sleeves) skin.uniforms.coatColor.value.lerp(new THREE.Color(0xe2d8c4), 0.6);
    skin.uniforms.trouserColor.value.set(palette.trousers);
    skin.uniforms.bootColor.value.set(palette.leather);
    currentOutfit = selection;
  }
  setOutfit(outfit);
  group.position.copy(position);
  group.rotation.y = rotationY;
  const baseY = position.y;

  return {
    group,
    detail,
    setOutfit,
    getOutfit: () => currentOutfit,
    setMotion: animation.setMotion,
    update(dt) { skin.uniforms.blinkAmount.value = animation.update(dt).blink; },
    setState({ bob = 0, bodyYaw = 0 }) {
      group.position.y = baseY + bob;
      group.rotation.y = rotationY + bodyYaw * 0.5;
    },
    dispose() {
      group.removeFromParent();
      skin.material.dispose();
      skeleton.dispose();
      const skeletons = new Set();
      model.traverse((child) => { if (child.isSkinnedMesh) skeletons.add(child.skeleton); });
      for (const instance of skeletons) instance.dispose();
    },
    info: { textureWidth: skin.material.map.image.width, rigBones: garmentBones.length },
  };
}
