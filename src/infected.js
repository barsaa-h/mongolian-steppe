import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { mat, mulberry } from "./parts.js";
import { smokeTexture } from "./textures.js";

// The bible's colour grammar: RED fed and fast, GREY sunken and trembling,
// WHITE still and frosted. States drive tint, posture and motion.
export const INFECTED_STATES = ["red", "grey", "white"];

const STATE_LOOK = {
  red: {
    tint: 0xffb4a0,
    emissive: 0x38100a,
    emissiveIntensity: 0.5,
    swayAmp: 0.0,
    tremble: 0.0,
    steam: 0.5,
    lean: 0.16,
    skin: 0xc46a52,
  },
  grey: {
    tint: 0xa8b2b0,
    emissive: 0x000000,
    emissiveIntensity: 0,
    swayAmp: 0.008,
    tremble: 0.0035,
    steam: 0.18,
    lean: 0.07,
    skin: 0x99a5a2,
  },
  white: {
    tint: 0xe4edf2,
    emissive: 0x0a1016,
    emissiveIntensity: 0.12,
    swayAmp: 0.016,
    tremble: 0.0,
    steam: 0.22,
    lean: 0.0,
    skin: 0xd6e0e6,
  },
};

const crowdUniform = { value: 0 };
const crowdMats = new Map();

export function infectedStateLook(state) {
  return STATE_LOOK[state] || STATE_LOOK.white;
}

function injectCrowdMotion(material, look, cacheKey) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCrowdTime = crowdUniform;
    shader.vertexShader = "uniform float uCrowdTime;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `
      #include <begin_vertex>
      vec4 crowdWorld = modelMatrix * vec4(transformed, 1.0);
      float crowdPhase = crowdWorld.x * 1.7 + crowdWorld.z * 1.3;
      float sway = sin(uCrowdTime * 0.55 + crowdPhase) * ${look.swayAmp.toFixed(4)};
      float tremble = sin(uCrowdTime * 21.0 + crowdPhase * 9.0) * ${look.tremble.toFixed(4)};
      transformed.x += sway + tremble;
      transformed.z += cos(uCrowdTime * 0.42 + crowdPhase * 1.1) * sway * 0.6;
    `);
  };
  material.customProgramCacheKey = () => cacheKey;
  return material;
}

// Crowd/standing-figure material per state. World-space sway and tremble run
// in the vertex shader, so even merged hundreds-cost crowds animate.
export function crowdMaterial(state = "white", cloth = 0x4a4a44) {
  const key = `${state}:${cloth}`;
  if (!crowdMats.has(key)) {
    const look = infectedStateLook(state);
    const material = mat({ color: cloth });
    material.emissive = new THREE.Color(look.emissive);
    material.emissiveIntensity = look.emissiveIntensity;
    material.userData.state = state;
    crowdMats.set(key, injectCrowdMotion(material, look, `crowd-${state}`));
  }
  return crowdMats.get(key);
}

// Skin material per state so heads and hands read flushed/ashen/frosted.
export function crowdSkinMaterial(state = "white") {
  const key = `skin:${state}`;
  if (!crowdMats.has(key)) {
    const look = infectedStateLook(state);
    const material = mat({ color: look.skin });
    material.emissive = new THREE.Color(look.emissive);
    material.emissiveIntensity = look.emissiveIntensity;
    material.userData.state = state;
    crowdMats.set(key, injectCrowdMotion(material, look, `crowd-skin-${state}`));
  }
  return crowdMats.get(key);
}

export function crowdUniformTime() {
  return crowdUniform;
}

export function updateInfected(t) {
  crowdUniform.value = t;
}

// One low-poly standing figure as a group of two merged meshes: cloth body
// plus per-state skin for the bare head and hands. State sets the lean.
export function buildStandingFigure({ x = 0, z = 0, yaw = 0, seed = 0, state = "white", scale = 1 } = {}) {
  const look = infectedStateLook(state);
  const rand = mulberry(seed * 977 + 31);
  const height = (1.42 + rand() * 0.24) * scale;
  const shoulder = 0.34 + rand() * 0.08;
  const clothKey = [0x4a4a44, 0x50443c, 0x3e4a50, 0x554a3e, 0x464038][(rand() * 5) | 0];
  const body = [];
  const bare = [];
  const place = (list, geometry, px, py, pz, ry = 0) => {
    geometry.rotateY(ry);
    geometry.translate(px, py, pz);
    list.push(geometry);
  };
  place(body, new THREE.BoxGeometry(shoulder, height * 0.44, 0.22), 0, height * 0.72, 0);
  for (const side of [-1, 1]) {
    place(body, new THREE.BoxGeometry(0.12, height * 0.52, 0.14), side * 0.1, height * 0.26, 0);
  }
  place(bare, new THREE.BoxGeometry(0.17, 0.2, 0.19), 0, height * 0.97, look.lean * 0.6);
  for (const side of [-1, 1]) {
    place(bare, new THREE.BoxGeometry(0.1, height * 0.42, 0.11), side * (shoulder / 2 + 0.015), height * 0.63, 0);
  }
  const group = new THREE.Group();
  const bodyMesh = new THREE.Mesh(mergeGeometries(body, false), crowdMaterial(state, clothKey));
  bodyMesh.userData.part = "body";
  const bareMesh = new THREE.Mesh(mergeGeometries(bare, false), crowdSkinMaterial(state));
  bareMesh.userData.part = "bare";
  for (const mesh of [bodyMesh, bareMesh]) {
    mesh.geometry.computeVertexNormals();
    group.add(mesh);
  }
  group.position.set(x, 0, z);
  group.rotation.y = yaw;
  group.scale.setScalar(scale);
  group.userData.infectedState = state;
  return group;
}

// A whole field of the Standing as few merged meshes (one per cloth tone plus
// one skin mesh per state). Deterministic for a seed; world transforms baked.
export function buildCrowd({ positions, seed = 0, state = "white" } = {}) {
  const group = new THREE.Group();
  const bodies = new Map();
  const bare = [];
  positions.forEach(([x, z, yaw], i) => {
    const rand = mulberry(seed * 613 + i * 29 + 7);
    const figure = buildStandingFigure({ x, z, yaw, seed: seed * 100 + i, state, scale: 0.94 + rand() * 0.14 });
    figure.updateMatrixWorld(true);
    const clothKey = figure.children[0].material.color.getHexString();
    if (!bodies.has(clothKey)) bodies.set(clothKey, []);
    bodies.get(clothKey).push(bake(figure.children[0]));
    bare.push(bake(figure.children[1]));
  });
  for (const [clothKey, pieces] of bodies) {
    const mesh = new THREE.Mesh(mergeGeometries(pieces, false), crowdMaterial(state, parseInt(clothKey, 16)));
    mesh.userData = { infectedState: state, part: "body", count: pieces.length };
    group.add(mesh);
  }
  const bareMesh = new THREE.Mesh(mergeGeometries(bare, false), crowdSkinMaterial(state));
  bareMesh.userData = { infectedState: state, part: "bare", count: bare.length };
  group.add(bareMesh);
  return group;
}

function bake(mesh) {
  const geometry = mesh.geometry.clone();
  geometry.applyMatrix4(mesh.matrixWorld);
  return geometry;
}

// Positions helpers for the two big script crowd shapes.
export function crowdRing({ center = [0, 0], radius = 10, count = 60, seed = 0 } = {}) {
  const rand = mulberry(seed * 151 + 5);
  const positions = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.1;
    const r = radius * (0.94 + rand() * 0.12);
    positions.push([
      center[0] + Math.sin(a) * r,
      center[1] + Math.cos(a) * r,
      a + Math.PI,
    ]);
  }
  return positions;
}

export function crowdRows({ origin = [0, 0], dir = [0, 1], across = 10, rows = 4, spacing = 1.6, seed = 0 } = {}) {
  const rand = mulberry(seed * 193 + 11);
  const perpendicular = [-dir[1], dir[0]];
  const positions = [];
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < across; i++) {
      const depth = row * spacing * (0.9 + rand() * 0.2);
      const side = (i - (across - 1) / 2) * spacing + (rand() - 0.5) * 0.5;
      positions.push([
        origin[0] + dir[0] * depth + perpendicular[0] * side,
        origin[1] + dir[1] * depth + perpendicular[1] * side,
        Math.atan2(dir[0], dir[1]) + (rand() - 0.5) * 0.4,
      ]);
    }
  }
  return positions;
}

// Hero dressing: tint an existing figure's materials toward a state and mark
// it, so close-ups read RED/GREY/WHITE without new models. Steam anchors are
// returned for attachSteam.
export function dressInfected(figure, state = "grey") {
  const look = infectedStateLook(state);
  const tinted = new Map();
  figure.traverse((object) => {
    if (!object.isMesh || !object.material) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const next = materials.map((source) => {
      const key = `${source.uuid}:${state}`;
      if (!tinted.has(key)) {
        const clone = source.clone();
        clone.color = new THREE.Color(source.color || 0xffffff).multiply(new THREE.Color(look.tint));
        clone.emissive = new THREE.Color(look.emissive);
        clone.emissiveIntensity = look.emissiveIntensity;
        clone.userData = clone.userData || {};
        clone.userData.infectedState = state;
        tinted.set(key, clone);
      }
      return tinted.get(key);
    });
    object.material = Array.isArray(object.material) ? next : next[0];
  });
  figure.userData.infectedState = state;
  return figure;
}

// Steam wisps above infected anchors; deterministic puffs, like chimney smoke.
// height lifts the emitter to head height above each anchor's origin.
export function attachSteam(scene, anchors, { strength = 1, height = 1.5 } = {}) {
  const puffs = [];
  const steam = smokeTexture();
  anchors.forEach((anchor, index) => {
    const count = 2;
    for (let i = 0; i < count; i++) {
      const material = new THREE.SpriteMaterial({
        map: steam,
        color: 0xdfe4e2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(0.5, 0.5, 1);
      scene.add(sprite);
      puffs.push({
        sprite,
        anchor,
        phase: (i / count) + index * 0.37,
        rise: 1.1 + (index % 3) * 0.2,
        strength: strength * (anchor.userData?.infectedStrength ?? 1),
      });
    }
  });
  return function update(t) {
    for (const puff of puffs) {
      const p = (t * 0.32 + puff.phase) % 1;
      const a = puff.anchor.position;
      puff.sprite.position.set(
        a.x + Math.sin(p * 7 + puff.phase * 9) * 0.09 + p * 0.22,
        a.y + height + p * puff.rise,
        a.z + Math.cos(p * 6 + puff.phase * 7) * 0.08
      );
      const s = 0.22 + p * 0.6;
      puff.sprite.scale.set(s, s, 1);
      puff.sprite.material.opacity = Math.sin(p * Math.PI) * 0.24 * puff.strength;
    }
  };
}
