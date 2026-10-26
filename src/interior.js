import * as THREE from "three";
import {
  addBox,
  box,
  cylinder,
  mat,
  planeGeo,
  solid,
  woodMaterial,
} from "./parts.js";
import {
  ceilingTexture,
  cloneRepeat,
  concreteTexture,
  linoleumTexture,
  tileTexture,
  wallpaperTexture,
  windowGlowTexture,
  windowTexture,
} from "./textures.js";

const cache = new Map();
const tubeMats = [];
const tubeLights = [];

function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

function wallMaterial(variant = 0) {
  return cached(`wall:${variant}`, () => mat({
    map: variant === 2
      ? cloneRepeat(tileTexture(), 5, 2)
      : cloneRepeat(wallpaperTexture(variant), 4, 2),
    side: THREE.DoubleSide,
  }));
}

// Hand-built walls (corridor spines with door gaps) reuse the room material.
export function interiorWallMaterial(variant = 0) {
  return wallMaterial(variant);
}

export function floorMaterial(kind = "linoleum") {
  return cached(`floor:${kind}`, () => {
    let texture;
    if (kind === "tile") texture = tileTexture();
    else if (kind === "concrete") texture = concreteTexture("#9a948a");
    else texture = linoleumTexture();
    const repeat = kind === "tile" ? 4 : 5;
    return mat({ map: cloneRepeat(texture, repeat, repeat) });
  });
}

export function ceilingMaterial() {
  return cached("ceiling", () => mat({ map: cloneRepeat(ceilingTexture(), 6, 6) }));
}

function windowMaterial() {
  return cached("interiorWindow", () => mat({
    map: windowTexture(0),
    emissiveMap: windowGlowTexture(0),
    emissive: 0x35507a,
    emissiveIntensity: 0.4,
  }));
}

// One box room: floor, four walls, optional real doorway gap and window on
// the +z wall, ceiling, skirting boards.
export function buildRoom({
  w, d, h = 3.0, x = 0, z = 0,
  wall = 0, floor = "linoleum",
  doorWidth = 0, windowWidth = 0,
  ceiling = true,
} = {}) {
  const group = new THREE.Group();
  const floorMesh = new THREE.Mesh(planeGeo(w, d), floorMaterial(floor));
  floorMesh.rotation.x = -Math.PI / 2;
  group.add(floorMesh);

  const wallMat = wallMaterial(wall);
  const t = 0.18;
  addBox(group, w, h, t, wallMat, 0, h / 2, -d / 2 - t / 2);
  addBox(group, t, h, d, wallMat, -w / 2 - t / 2, h / 2, 0);
  addBox(group, t, h, d, wallMat, w / 2 + t / 2, h / 2, 0);
  if (doorWidth > 0) {
    const seg = (w - doorWidth) / 2;
    addBox(group, seg, h, t, wallMat, -(doorWidth / 2 + seg / 2), h / 2, d / 2 + t / 2);
    addBox(group, seg, h, t, wallMat, doorWidth / 2 + seg / 2, h / 2, d / 2 + t / 2);
    addBox(group, doorWidth, h - 2.1, t, wallMat, 0, 2.1 + (h - 2.1) / 2, d / 2 + t / 2);
  } else if (windowWidth > 0) {
    const seg = (w - windowWidth) / 2;
    addBox(group, seg, h, t, wallMat, -(windowWidth / 2 + seg / 2), h / 2, d / 2 + t / 2);
    addBox(group, seg, h, t, wallMat, windowWidth / 2 + seg / 2, h / 2, d / 2 + t / 2);
    addBox(group, windowWidth, 1.0, t, wallMat, 0, 1.0 / 2, d / 2 + t / 2);
    addBox(group, windowWidth, h - 2.3, t, wallMat, 0, 2.3 + (h - 2.3) / 2, d / 2 + t / 2);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth - 0.3, 1.2), windowMaterial());
    win.position.set(0, 1.65, d / 2 + 0.02);
    group.add(win);
  } else {
    addBox(group, w, h, t, wallMat, 0, h / 2, d / 2 + t / 2);
  }
  if (ceiling) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilingMaterial());
    c.rotation.x = Math.PI / 2;
    c.position.y = h;
    group.add(c);
  }
  const skirt = solid(0x4e463a);
  addBox(group, w, 0.14, 0.05, skirt, 0, 0.07, -d / 2 + 0.03);
  addBox(group, w, 0.14, 0.05, skirt, 0, 0.07, d / 2 - 0.03);
  addBox(group, 0.05, 0.14, d, skirt, -w / 2 + 0.03, 0.07, 0);
  addBox(group, 0.05, 0.14, d, skirt, w / 2 - 0.03, 0.07, 0);
  group.position.set(x, 0, z);
  return group;
}

export function buildDoor({ width = 0.95, open = 0, glazed = false } = {}) {
  const group = new THREE.Group();
  const frameMat = solid(0x5a4a38);
  addBox(group, 0.1, 2.1, 0.16, frameMat, -width / 2 - 0.05, 1.05, 0);
  addBox(group, 0.1, 2.1, 0.16, frameMat, width / 2 + 0.05, 1.05, 0);
  addBox(group, width + 0.2, 0.1, 0.16, frameMat, 0, 2.15, 0);
  const leaf = new THREE.Group();
  const panel = box(width, 1.98, 0.06, glazed ? solid(0xcfd8d2) : woodMaterial());
  panel.position.y = 0.99;
  leaf.add(panel);
  if (glazed) {
    addBox(leaf, width * 0.7, 0.5, 0.02, solid(0x4a5860, { transparent: true, opacity: 0.5 }), 0, 1.45, 0.04);
  }
  const knob = cylinder(0.035, 0.035, 0.09, solid(0xb8a870), 6);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(width / 2 - 0.12, 1.02, 0.05);
  leaf.add(knob);
  leaf.position.x = -width / 2;
  leaf.rotation.y = -open;
  group.add(leaf);
  return group;
}

// Ceiling fluorescent tube: housing + glowing tube + a real point light.
// Tubes sharing a phase flicker together, like the same room circuit.
export function buildTubeLight(length = 1.4, phase = 0) {
  const group = new THREE.Group();
  addBox(group, 0.16, 0.07, length, solid(0x8a8a82), 0, 0, 0);
  let tubeMat = tubeMats.find(m => m.userData.tubePhase === phase);
  if (!tubeMat) {
    tubeMat = mat({ color: 0xf4f6ee, emissive: 0xd8f0e8, emissiveIntensity: 1.6 });
    tubeMat.userData.tubePhase = phase;
    tubeMats.push(tubeMat);
  }
  const glow = box(0.09, 0.04, length * 0.92, tubeMat);
  glow.position.y = -0.045;
  group.add(glow);
  const light = new THREE.PointLight(0xd8f0e2, 1.1, 9, 1.6);
  light.position.y = -0.3;
  group.add(light);
  tubeLights.push({ material: tubeMat, light, base: 1.1 });
  return group;
}

export function tubeLightMaterials() {
  return tubeMats;
}

export function updateTubeLights(t) {
  for (const entry of tubeLights) {
    const phase = entry.material.userData.tubePhase || 0;
    const stutter = Math.sin(t * 31 + phase * 17) > 0.985 ? 0.25 : 1;
    const level = (1.45 + Math.sin(t * 47 + phase * 31) * 0.08) * stutter;
    entry.material.emissiveIntensity = level;
    entry.light.intensity = entry.base * level * 0.62;
  }
}

export function buildStairs({ steps = 8, width = 1.3, rise = 0.17, run = 0.28 } = {}) {
  const group = new THREE.Group();
  const stepMat = cached("stairsConcrete", () => mat({ map: cloneRepeat(concreteTexture("#a8a49a"), 2, 2) }));
  for (let i = 0; i < steps; i++) {
    addBox(group, width, rise, run * (steps - i), stepMat, 0, rise * (i + 0.5), run * (steps - i) / 2);
  }
  return group;
}

export function buildHospitalBed() {
  const group = new THREE.Group();
  const frame = solid(0x8a8e90);
  addBox(group, 0.08, 0.5, 1.95, frame, -0.45, 0.35, 0);
  addBox(group, 0.08, 0.5, 1.95, frame, 0.45, 0.35, 0);
  addBox(group, 0.95, 0.08, 1.95, solid(0x3a3e40), 0, 0.58, 0);
  addBox(group, 0.9, 0.14, 1.85, solid(0xc8c4b0), 0, 0.69, 0);
  addBox(group, 0.9, 0.1, 0.4, solid(0xd8d4c2), 0, 0.78, -0.7);
  addBox(group, 0.06, 0.9, 0.06, frame, -0.45, 1.05, 0.95);
  addBox(group, 0.06, 0.9, 0.06, frame, 0.45, 1.05, 0.95);
  addBox(group, 0.95, 0.06, 0.06, frame, 0, 1.48, 0.95);
  for (const x of [-0.38, 0.38]) {
    for (const z of [-0.8, 0.8]) {
      const wheel = cylinder(0.07, 0.07, 0.05, solid(0x2c2e30), 8);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.07, z);
      group.add(wheel);
    }
  }
  return group;
}

export function buildDesk({ w = 1.2 } = {}) {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, w, 0.06, 0.6, wood, 0, 0.74, 0);
  addBox(group, 0.05, 0.72, 0.55, wood, -w / 2 + 0.08, 0.37, 0);
  addBox(group, 0.05, 0.72, 0.55, wood, w / 2 - 0.08, 0.37, 0);
  addBox(group, w - 0.2, 0.3, 0.5, wood, 0, 0.45, -0.05);
  return group;
}

export function buildChair() {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, 0.42, 0.05, 0.42, wood, 0, 0.45, 0);
  addBox(group, 0.42, 0.5, 0.05, wood, 0, 0.72, -0.19);
  for (const x of [-0.17, 0.17]) {
    for (const z of [-0.17, 0.17]) addBox(group, 0.05, 0.45, 0.05, wood, x, 0.22, z);
  }
  return group;
}

export function buildCabinet({ glazed = true } = {}) {
  const group = new THREE.Group();
  addBox(group, 1.1, 1.9, 0.45, solid(0x6a5a42), 0, 0.95, 0);
  if (glazed) {
    addBox(group, 0.48, 1.2, 0.03, solid(0x9ab0a8, { transparent: true, opacity: 0.4 }), -0.27, 1.25, 0.24);
    addBox(group, 0.48, 1.2, 0.03, solid(0x9ab0a8, { transparent: true, opacity: 0.4 }), 0.27, 1.25, 0.24);
  }
  for (const y of [0.5, 0.9, 1.3]) {
    addBox(group, 1.0, 0.04, 0.4, solid(0x7c6a4e), 0, y, 0.02);
  }
  return group;
}

export function buildLocker({ color = 0x5a6e62 } = {}) {
  const group = new THREE.Group();
  addBox(group, 0.5, 1.8, 0.5, solid(color), 0, 0.9, 0);
  addBox(group, 0.46, 0.85, 0.03, solid(0x46584e), 0, 1.35, 0.26);
  addBox(group, 0.46, 0.85, 0.03, solid(0x46584e), 0, 0.45, 0.26);
  for (const y of [1.35, 0.45]) {
    addBox(group, 0.04, 0.1, 0.04, solid(0x8a9290), 0.15, y + 0.2, 0.28);
  }
  for (let i = 0; i < 4; i++) {
    addBox(group, 0.5, 0.02, 0.5, solid(0x46584e), 0, 0.25 + i * 0.5, 0);
  }
  return group;
}

export function buildIVStand() {
  const group = new THREE.Group();
  const metal = solid(0x8a9092);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.7, 5), metal);
  pole.position.y = 0.85;
  group.add(pole);
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4), metal);
    leg.position.y = 0.14;
    leg.rotation.z = 0.9;
    leg.rotation.y = (i / 3) * Math.PI * 2;
    group.add(leg);
  }
  const bag = box(0.16, 0.24, 0.06, solid(0xd8e0d8, { transparent: true, opacity: 0.75 }));
  bag.position.set(0.1, 1.5, 0);
  group.add(bag);
  addBox(group, 0.01, 0.8, 0.01, solid(0xe8e8e0), 0.1, 1.05, 0);
  return group;
}

export function buildChalkboard({ w = 2.4 } = {}) {
  const group = new THREE.Group();
  addBox(group, w + 0.16, 1.2, 0.06, solid(0x5a4a38), 0, 1.6, 0);
  const slate = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.05), solid(0x2c3832));
  slate.position.set(0, 1.6, 0.045);
  group.add(slate);
  addBox(group, w * 0.7, 0.03, 0.02, solid(0xd8d4c4), -w * 0.08, 1.85, 0.055);
  addBox(group, w * 0.4, 0.03, 0.02, solid(0xd8d4c4), -w * 0.12, 1.6, 0.055);
  addBox(group, w * 0.55, 0.03, 0.02, solid(0xd8d4c4), 0, 1.35, 0.055);
  addBox(group, w, 0.06, 0.08, woodMaterial(), 0, 0.96, 0.06);
  return group;
}

// Plastic newborn cot with a faintly glowing blanket; the nursery beat counts
// these through the glass.
export function buildNurseryCot({ glow = true } = {}) {
  const group = new THREE.Group();
  const plastic = solid(0xb8c4c2);
  addBox(group, 0.34, 0.05, 0.34, plastic, 0, 0.06, 0);
  addCylinder(group, 0.025, 0.035, 0.8, plastic, -0.13, 0.45, -0.13, 5);
  addCylinder(group, 0.025, 0.035, 0.8, plastic, 0.13, 0.45, -0.13, 5);
  addCylinder(group, 0.025, 0.035, 0.8, plastic, -0.13, 0.45, 0.13, 5);
  addCylinder(group, 0.025, 0.035, 0.8, plastic, 0.13, 0.45, 0.13, 5);
  addBox(group, 0.56, 0.28, 0.3, plastic, 0, 0.9, 0);
  addBox(group, 0.5, 0.2, 0.26, solid(0xe8e4d4), 0, 0.92, 0);
  const blanket = box(0.5, 0.06, 0.24, glow
    ? mat({ color: 0xd8d0c0, emissive: 0x9a8258, emissiveIntensity: 0.9 })
    : solid(0xd8d0c0));
  blanket.position.set(0, 1.04, 0.02);
  group.add(blanket);
  return group;
}

// Nurses' counter facing the corridor, with the one phone the ward has.
export function buildNursesStation({ w = 2.2 } = {}) {
  const group = new THREE.Group();
  addBox(group, w, 1.05, 0.55, woodMaterial(), 0, 0.525, 0);
  addBox(group, w + 0.1, 0.06, 0.65, solid(0x8a9290), 0, 1.08, 0);
  addBox(group, w, 0.5, 0.5, woodMaterial(), 0, 1.35, -0.35);
  addBox(group, 0.22, 0.09, 0.16, solid(0x2c2e30), -w / 2 + 0.4, 1.15, 0.05);
  addBox(group, 0.22, 0.045, 0.05, solid(0x222426), -w / 2 + 0.4, 1.23, 0.05);
  const paper = addBox(group, 0.2, 0.005, 0.28, solid(0xd8d0b8), w / 2 - 0.35, 1.115, 0.05);
  paper.rotation.y = 0.3;
  return group;
}

// Hot boiler pipe run with brackets and a valve; burned-out infected face it.
export function buildBoilerPipe({ length = 4, y = 1.4 } = {}) {
  const group = new THREE.Group();
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, length, 8),
    mat({ color: 0x6a5648, emissive: 0x2c1408, emissiveIntensity: 0.55 }));
  pipe.rotation.x = Math.PI / 2;
  pipe.position.set(0, y, 0);
  group.add(pipe);
  for (let i = 0; i <= length; i += 1.2) {
    addBox(group, 0.16, 0.2, 0.08, solid(0x4a4238), 0.12, y, -length / 2 + i);
  }
  const valve = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 5, 10), solid(0x7c3226));
  valve.position.set(0.14, y, -length / 2 + 0.5);
  group.add(valve);
  return group;
}

export function buildVentGrille() {
  const group = new THREE.Group();
  addBox(group, 0.55, 0.45, 0.06, solid(0x5a5854), 0, 0, 0);
  for (let i = 0; i < 5; i++) {
    addBox(group, 0.45, 0.035, 0.02, solid(0x3c3a36), 0, -0.16 + i * 0.08, 0.035);
  }
  return group;
}

// The service hatch Oyun escapes through: frame, open leaf, cross bar.
export function buildLaundryHatch({ width = 0.85, height = 1.0 } = {}) {
  const group = new THREE.Group();
  const frame = solid(0x6a7072);
  addBox(group, 0.09, height + 0.14, 0.1, frame, -width / 2 - 0.045, height / 2, 0);
  addBox(group, 0.09, height + 0.14, 0.1, frame, width / 2 + 0.045, height / 2, 0);
  addBox(group, width + 0.18, 0.09, 0.1, frame, 0, height + 0.07, 0);
  addBox(group, width + 0.18, 0.09, 0.1, frame, 0, 0.045, 0);
  const leaf = addBox(group, width, height, 0.05, solid(0x9aa09e), -width / 2 - 0.02, height / 2, -0.16);
  leaf.rotation.y = -1.15;
  leaf.position.x = -width / 2;
  addBox(group, width * 0.9, 0.05, 0.05, solid(0x5a6062), 0, height / 2, 0.06);
  return group;
}

export function buildWaitingBench() {
  const group = new THREE.Group();
  const slat = solid(0x7c6a4e);
  for (const z of [-0.18, 0, 0.18]) addBox(group, 1.5, 0.05, 0.16, slat, 0, 0.45, z);
  addBox(group, 1.5, 0.4, 0.05, slat, 0, 0.72, -0.26);
  for (const x of [-0.62, 0.62]) {
    addBox(group, 0.06, 0.45, 0.5, solid(0x3a3a38), x, 0.22, 0);
  }
  return group;
}

function addCylinder(parent, rt, rb, h, material, x, y, z, seg = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

// Cheap readable base lighting for any interior stage; tube emissives sit on top.
export function lightInterior(scene, { warm = 0xe8d8b0, level = 1 } = {}) {
  const hemi = new THREE.HemisphereLight(warm, 0x3a3630, 0.85 * level);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(warm, 0.5 * level);
  key.position.set(3, 6, 2);
  scene.add(key);
  return { hemi, key };
}
