import * as THREE from "three";
import {
  asphaltTexture,
  brickTexture,
  cloneRepeat,
  concreteTexture,
  corrugatedTexture,
  dirtTexture,
  fenceTexture,
  flagTexture,
  gerRoofTexture,
  gerWallTexture,
  doorTexture,
  shadowTexture,
  stoneTexture,
  woodTexture,
  windowTexture,
  windowGlowTexture,
  shopWindowTexture,
  signTexture,
  cloudTexture,
  courtTexture,
  muralTexture,
  posterTexture,
} from "./textures.js";

const geoCache = new Map();
const matCache = new Map();
const windowMats = [];
const signMats = [];
const lampMats = [];

function cachedGeo(key, make) {
  let geo = geoCache.get(key);
  if (!geo) {
    geo = make();
    geoCache.set(key, geo);
  }
  return geo;
}

export function mat(options) {
  return new THREE.MeshLambertMaterial({ flatShading: true, ...options });
}

export function solid(color, options = {}) {
  const key = `${color}:${JSON.stringify(options)}`;
  let material = matCache.get(key);
  if (!material) {
    material = mat({ color, ...options });
    matCache.set(key, material);
  }
  return material;
}

export function boxGeo(w, h, d) {
  return cachedGeo(`box:${w}:${h}:${d}`, () => new THREE.BoxGeometry(w, h, d));
}

export function cylGeo(rt, rb, h, seg = 8) {
  return cachedGeo(`cyl:${rt}:${rb}:${h}:${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
}

export function box(w, h, d, material) {
  return new THREE.Mesh(boxGeo(w, h, d), material);
}

export function cylinder(rt, rb, h, material, seg = 8) {
  return new THREE.Mesh(cylGeo(rt, rb, h, seg), material);
}

export function addBox(parent, w, h, d, material, x, y, z, ry = 0) {
  const mesh = box(w, h, d, material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  parent.add(mesh);
  return mesh;
}

export function addCylinder(parent, rt, rb, h, material, x, y, z, seg = 8) {
  const mesh = cylinder(rt, rb, h, material, seg);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

export function windowMaterial(variant = 0) {
  const i = ((variant % 6) + 6) % 6;
  if (!windowMats[i]) {
    windowMats[i] = mat({
      map: windowTexture(i),
      emissiveMap: windowGlowTexture(i),
      emissive: 0xffc47a,
      emissiveIntensity: 0,
    });
  }
  return windowMats[i];
}

export function windowMaterials() {
  return windowMats;
}

export function shopWindowMaterial() {
  if (!matCache.has("shopWindow")) {
    matCache.set("shopWindow", mat({
      map: shopWindowTexture(),
      emissiveMap: shopWindowTexture(),
      emissive: 0xffc47a,
      emissiveIntensity: 0.08,
    }));
  }
  return matCache.get("shopWindow");
}

export function signMaterial(text, options = {}) {
  const key = `sign:${text}:${JSON.stringify(options)}`;
  if (!matCache.has(key)) {
    const texture = signTexture(text, options);
    const material = mat({
      map: texture,
      emissiveMap: texture,
      emissive: 0xffd6a0,
      emissiveIntensity: 0.06,
    });
    signMats.push(material);
    matCache.set(key, material);
  }
  return matCache.get(key);
}

export function signMaterials() {
  return signMats;
}

export function plasterMaterial(color) {
  const key = `plaster:${color}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({ map: concreteTexture(color) }));
  }
  return matCache.get(key);
}

export function brickMaterial() {
  if (!matCache.has("brick")) {
    matCache.set("brick", mat({ map: brickTexture() }));
  }
  return matCache.get("brick");
}

export function woodMaterial() {
  if (!matCache.has("wood")) {
    matCache.set("wood", mat({ map: woodTexture() }));
  }
  return matCache.get("wood");
}

export function corrugatedMaterial(tint = "#8b8b84") {
  const key = `corrugated:${tint}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({ map: corrugatedTexture(tint), side: THREE.DoubleSide }));
  }
  return matCache.get(key);
}

export function stoneMaterial() {
  if (!matCache.has("stone")) {
    matCache.set("stone", mat({ map: stoneTexture() }));
  }
  return matCache.get("stone");
}

export function gerWallMaterial() {
  if (!matCache.has("gerWall")) {
    const m = mat({ map: cloneRepeat(gerWallTexture(), 3, 1) });
    matCache.set("gerWall", m);
  }
  return matCache.get("gerWall");
}

export function gerRoofMaterial() {
  if (!matCache.has("gerRoof")) {
    const m = mat({ map: cloneRepeat(gerRoofTexture(), 3, 1), side: THREE.DoubleSide });
    matCache.set("gerRoof", m);
  }
  return matCache.get("gerRoof");
}

export function doorMaterial() {
  if (!matCache.has("gerDoor")) {
    matCache.set("gerDoor", mat({ map: doorTexture() }));
  }
  return matCache.get("gerDoor");
}

export function asphaltMaterial(rx = 10, ry = 3) {
  const key = `asphalt:${rx}:${ry}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({ map: cloneRepeat(asphaltTexture(), rx, ry) }));
  }
  matCache.get(key).userData.noSnow = true;
  return matCache.get(key);
}

export function dirtMaterial(rx = 4, ry = 4) {
  const key = `dirt:${rx}:${ry}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({ map: cloneRepeat(dirtTexture(), rx, ry) }));
  }
  return matCache.get(key);
}

export function courtMaterial() {
  if (!matCache.has("court")) {
    matCache.set("court", mat({ map: cloneRepeat(courtTexture(), 1, 1) }));
  }
  return matCache.get("court");
}

export function muralMaterial() {
  if (!matCache.has("mural")) {
    matCache.set("mural", mat({ map: muralTexture() }));
  }
  return matCache.get("mural");
}

export function posterMaterial(kind = 0) {
  const key = `poster:${kind}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({ map: posterTexture(kind) }));
  }
  return matCache.get(key);
}

export function lampMaterial() {
  if (!lampMats.length) {
    lampMats.push(mat({ color: 0x6a6458, emissive: 0xffc070, emissiveIntensity: 0 }));
  }
  return lampMats[0];
}

export function lampMaterials() {
  return lampMats;
}

export function contactShadow(w, d, opacity = 0.4) {
  const key = `shadow:${opacity.toFixed(1)}`;
  let material = matCache.get(key);
  if (!material) {
    material = new THREE.MeshBasicMaterial({
      map: shadowTexture(),
      transparent: true,
      opacity: Number(opacity.toFixed(1)),
      depthWrite: false,
      color: 0x1a1c16,
    });
    matCache.set(key, material);
  }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.scale.set(w, d, 1);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.045;
  return mesh;
}

export function groundPlane(w, d, material, x = 0, z = 0, y = 0.02) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y, z);
  return mesh;
}

export function buildFenceRun(length, tone = "warm") {
  const group = new THREE.Group();
  const key = `fenceMat:${tone}:${length.toFixed(2)}`;
  let material = matCache.get(key);
  if (!material) {
    material = mat({
      map: cloneRepeat(fenceTexture(tone), Math.max(1, length / 2.2), 1),
      side: THREE.DoubleSide,
    });
    matCache.set(key, material);
  }
  const panel = box(length, 1.5, 0.08, material);
  panel.position.y = 0.78;
  group.add(panel);
  const postColors = {
    grey: 0x6c6a62,
    blue: 0x243e58,
    green: 0x1e3c2c,
    red: 0x5a2824,
    white: 0x8a8680,
    warm: 0x6a4c30,
  };
  const postMat = solid(postColors[tone] || postColors.warm);
  const count = Math.max(2, Math.round(length / 2.4) + 1);
  for (let i = 0; i < count; i++) {
    const x = -length / 2 + (length / (count - 1)) * i;
    addBox(group, 0.15, 1.72, 0.15, postMat, x, 0.86, 0);
    // Short brace so runs read as timber posts, not a flat sheet.
    if (i < count - 1) {
      const mid = x + length / (count - 1) * 0.5;
      addBox(group, length / (count - 1) * 0.92, 0.06, 0.05, postMat, mid, 1.05, 0.04);
    }
  }
  addBox(group, length, 0.12, 0.13, postMat, 0, 1.58, 0);
  addBox(group, length, 0.1, 0.12, postMat, 0, 0.22, 0);
  addBox(group, length * 0.98, 0.05, 0.04, solid(0x4a4034), 0, 0.92, 0.05);
  return group;
}

export function buildGate(width = 3) {
  const group = new THREE.Group();
  const postMat = solid(0x6a4c30);
  addBox(group, 0.18, 1.9, 0.18, postMat, -width / 2, 0.95, 0);
  addBox(group, 0.18, 1.9, 0.18, postMat, width / 2, 0.95, 0);
  let fenceMat = matCache.get("gate:fence");
  if (!fenceMat) {
    fenceMat = mat({
      map: cloneRepeat(fenceTexture("warm"), 1.2, 1),
      side: THREE.DoubleSide,
    });
    matCache.set("gate:fence", fenceMat);
  }
  const leaf = box(width * 0.46, 1.35, 0.07, fenceMat);
  leaf.position.set(-width * 0.24, 0.75, 0.16);
  leaf.rotation.y = -0.45;
  group.add(leaf);
  const leaf2 = box(width * 0.46, 1.35, 0.07, fenceMat);
  leaf2.position.set(width * 0.24, 0.75, 0.16);
  leaf2.rotation.y = 0.45;
  group.add(leaf2);
  addBox(group, width * 0.5, 0.08, 0.5, postMat, 0, 1.6, 0.15);
  addBox(group, 0.18, 0.08, 0.28, solid(0x8a7a5a), 0, 0.95, 0.28); // latch bar
  addBox(group, 0.08, 0.18, 0.08, solid(0x5a4a34), -0.12, 0.95, 0.36);
  return group;
}

export function buildGer(scale = 1, seed = 0) {
  const rand = mulberry(seed * 43 + 5);
  const group = new THREE.Group();
  group.userData.propKind = "ger";
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(2.25, 2.32, 1.55, 14, 1, true),
    gerWallMaterial()
  );
  wall.position.y = 0.82;
  group.add(wall);

  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 2.36, 1.02, 14, 1, true),
    gerRoofMaterial()
  );
  roof.position.y = 2.1;
  group.add(roof);

  // Felt bands / rope rings so gers don't read as featureless cans.
  const bandColors = [0xc06a34, 0x8c3a2a, 0xb07a40, 0x6a4a2c];
  const band = solid(bandColors[(rand() * bandColors.length) | 0]);
  addCylinder(group, 2.34, 2.34, 0.1, band, 0, 1.45, 0, 14);
  addCylinder(group, 2.33, 2.33, 0.07, solid(0xd8c8a8), 0, 0.35, 0, 14);

  const trim = solid(0xc06a34);
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.09, 4, 12), trim);
  crown.rotation.x = -Math.PI / 2;
  crown.position.y = 2.62;
  group.add(crown);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(0.74, 12), solid(0x8c3a2a, { side: THREE.DoubleSide }));
  cap.rotation.x = -Math.PI / 2;
  cap.position.y = 2.6;
  group.add(cap);

  const poleMat = woodMaterial();
  const up = new THREE.Vector3(0, 1, 0);
  const poleGeo = cylGeo(0.035, 0.035, 1, 4);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const start = new THREE.Vector3(Math.sin(a) * 0.8, 2.56, Math.cos(a) * 0.8);
    const end = new THREE.Vector3(Math.sin(a) * 2.28, 1.58, Math.cos(a) * 2.28);
    const dir = end.clone().sub(start);
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.scale.y = dir.length();
    pole.position.copy(start).add(end).multiplyScalar(0.5);
    pole.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    group.add(pole);
  }

  const frameMat = solid(0xa6462f);
  addBox(group, 0.12, 1.5, 0.12, frameMat, -0.54, 0.75, 2.22);
  addBox(group, 0.12, 1.5, 0.12, frameMat, 0.54, 0.75, 2.22);
  addBox(group, 1.3, 0.14, 0.18, frameMat, 0, 1.5, 2.22);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.36), doorMaterial());
  door.position.set(0, 0.7, 2.26);
  group.add(door);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.62, 0.14, 14), solid(0x8c7c58));
  base.position.y = 0.07;
  group.add(base);

  const chimney = addCylinder(group, 0.06, 0.07, 1.5, solid(0x55565c), -1.05, 2.72, -0.5, 5);
  addCylinder(group, 0.1, 0.1, 0.08, solid(0x44454a), -1.05, 3.49, -0.5, 5);
  // Guy-rope stubs around the skirt — cheap silhouette detail from overview.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.2;
    const peg = addCylinder(group, 0.03, 0.04, 0.35, solid(0x5a4a34), Math.sin(a) * 2.7, 0.18, Math.cos(a) * 2.7, 4);
    peg.rotation.z = Math.sin(a) * 0.35;
  }

  group.scale.setScalar(scale);
  return group;
}

export function buildOuthouse() {
  const group = new THREE.Group();
  let body = matCache.get("outhouse:body");
  if (!body) {
    body = mat({ map: cloneRepeat(fenceTexture("grey"), 2, 1) });
    matCache.set("outhouse:body", body);
  }
  addBox(group, 1.25, 1.7, 1.35, body, 0, 0.85, 0);
  const roofMat = corrugatedMaterial("#7c7468");
  const roof = box(1.55, 0.1, 1.7, roofMat);
  roof.position.set(0, 1.78, 0.04);
  roof.rotation.x = -0.12;
  group.add(roof);
  addBox(group, 1.0, 0.1, 0.08, woodenDoorMat(), 0, 1.08, 0.69);
  addBox(group, 0.05, 1.1, 0.06, solid(0x5a4a34), 0.12, 0.6, 0.7);
  addCylinder(group, 0.07, 0.08, 1.4, solid(0x55524c), 0.48, 2.1, -0.32, 5);
  return group;
}

function woodenDoorMat() {
  let material = matCache.get("outhouse:door");
  if (!material) {
    material = mat({ map: cloneRepeat(woodTexture(), 1, 1) });
    matCache.set("outhouse:door", material);
  }
  return material;
}

export function buildWoodpile() {
  const group = new THREE.Group();
  const logMat = woodMaterial();
  const endMat = solid(0xb08a5c);
  const logGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.4, 5);
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 4 - row; i++) {
      const log = new THREE.Mesh(logGeo, logMat);
      log.rotation.z = Math.PI / 2;
      log.position.set(0, 0.12 + row * 0.17, -0.3 + i * 0.19 + row * 0.09);
      group.add(log);
      const end = new THREE.Mesh(new THREE.CircleGeometry(0.09, 5), endMat);
      end.position.set(0.701, 0.12 + row * 0.17, -0.3 + i * 0.19 + row * 0.09);
      end.rotation.y = Math.PI / 2;
      group.add(end);
    }
  }
  addBox(group, 1.5, 0.08, 0.9, solid(0x4a3424), 0, 0.04, 0);
  return group;
}

export function buildCoalPile(radius = 0.8) {
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(radius, radius * 0.7, 7),
    solid(0x35322f)
  );
  mesh.position.y = radius * 0.35;
  return mesh;
}

export function buildBarrel(color = 0x4a6a8a) {
  const group = new THREE.Group();
  addCylinder(group, 0.32, 0.34, 0.85, solid(color), 0, 0.425, 0, 10);
  addCylinder(group, 0.345, 0.345, 0.08, solid(0x3a3a38), 0, 0.62, 0, 10);
  addCylinder(group, 0.345, 0.345, 0.08, solid(0x3a3a38), 0, 0.24, 0, 10);
  addCylinder(group, 0.28, 0.28, 0.04, solid(0x555a5c), 0, 0.86, 0, 10);
  return group;
}

export function buildClothesline(length = 6, seed = 0) {
  const rand = mulberry(seed * 29 + 3);
  const group = new THREE.Group();
  const postMat = solid(0x6a4c30);
  addCylinder(group, 0.06, 0.08, 2.3, postMat, -length / 2, 1.15, 0, 5);
  addCylinder(group, 0.06, 0.08, 2.3, postMat, length / 2, 1.15, 0, 5);
  addCylinder(group, 0.04, 0.04, 0.6, postMat, -length / 2, 2.25, 0, 5).rotation.z = Math.PI / 2;
  addCylinder(group, 0.04, 0.04, 0.6, postMat, length / 2, 2.25, 0, 5).rotation.z = Math.PI / 2;

  const points = [];
  for (let i = 0; i <= 10; i++) {
    const x = -length / 2 + (length / 10) * i;
    const y = 2.25 - Math.sin((i / 10) * Math.PI) * 0.28;
    points.push(new THREE.Vector3(x, y, 0));
  }
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x3a3630 })
  );
  group.add(line);

  const cloths = [];
  const colors = [0xc8c0a8, 0x8a5a5a, 0x5a7a8a, 0xd8c070, 0xb8b0a0, 0x7a8a6a, 0x9a4a3a, 0x4a5a6a, 0xd0d0c8];
  const count = 4 + ((rand() * 3) | 0);
  for (let i = 0; i < count; i++) {
    const x = -length * 0.35 + i * (length * 0.7 / Math.max(1, count - 1));
    const h = 0.55 + rand() * 0.45;
    const w = 0.4 + rand() * 0.28;
    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 2, 2),
      solid(colors[(rand() * colors.length) | 0], { side: THREE.DoubleSide })
    );
    cloth.position.set(x, 2.2 - h * 0.5, 0.02 + (rand() - 0.5) * 0.04);
    cloth.rotation.y = (rand() - 0.5) * 0.15;
    group.add(cloth);
    cloths.push(cloth);
  }
  return { group, cloths };
}

export function buildSolarPanel() {
  const group = new THREE.Group();
  const frame = box(1.15, 0.06, 0.75, solid(0x9a9a94));
  frame.rotation.x = -0.55;
  frame.position.y = 1.1;
  group.add(frame);
  const panel = box(1.0, 0.03, 0.62, solid(0x243a5a));
  panel.rotation.x = -0.55;
  panel.position.set(0, 1.14, 0);
  group.add(panel);
  const legMat = solid(0x6a6a64);
  addCylinder(group, 0.04, 0.04, 1.0, legMat, 0.3, 0.5, -0.2, 4);
  addCylinder(group, 0.04, 0.04, 1.0, legMat, -0.3, 0.5, -0.2, 4);
  addCylinder(group, 0.04, 0.04, 0.5, legMat, 0.3, 0.25, 0.22, 4);
  addCylinder(group, 0.04, 0.04, 0.5, legMat, -0.3, 0.25, 0.22, 4);
  return group;
}

export function buildSatelliteDish() {
  const group = new THREE.Group();
  const pole = addCylinder(group, 0.04, 0.05, 1.7, solid(0x6a6a64), 0, 0.85, 0, 5);
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.42),
    solid(0xc8c0b0, { side: THREE.DoubleSide })
  );
  dish.rotation.x = Math.PI * 0.72;
  dish.rotation.z = 0.4;
  dish.position.set(0.1, 1.55, 0.08);
  group.add(dish);
  addCylinder(group, 0.015, 0.015, 0.45, solid(0x55524c), 0.1, 1.55, 0.3, 4).rotation.x = 0.9;
  return group;
}

export function buildAntenna(height = 3) {
  const group = new THREE.Group();
  addCylinder(group, 0.025, 0.04, height, solid(0x6a6a64), 0, height / 2, 0, 4);
  addBox(group, 1.1, 0.03, 0.03, solid(0x6a6a64), 0, height * 0.8, 0);
  addBox(group, 0.85, 0.03, 0.03, solid(0x6a6a64), 0, height * 0.65, 0);
  addBox(group, 0.03, 0.04, 0.5, solid(0x6a6a64), 0.3, height * 0.8, 0.2);
  return group;
}

export function buildTrashCan() {
  const group = new THREE.Group();
  addCylinder(group, 0.25, 0.22, 0.7, solid(0x5a6a5a), 0, 0.35, 0, 8);
  addCylinder(group, 0.27, 0.27, 0.06, solid(0x3a4a3a), 0, 0.72, 0, 8);
  addBox(group, 0.08, 0.18, 0.04, solid(0x3a4a3a), 0.26, 0.55, 0);
  addBox(group, 0.08, 0.18, 0.04, solid(0x3a4a3a), -0.26, 0.55, 0);
  addBox(group, 0.35, 0.08, 0.02, solid(0x8a5a3c), 0, 0.4, 0.23); // rust stripe
  return group;
}

export function buildBench() {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, 1.8, 0.06, 0.18, wood, 0, 0.48, 0.12);
  addBox(group, 1.8, 0.06, 0.18, wood, 0, 0.48, -0.05);
  addBox(group, 1.8, 0.06, 0.18, wood, 0, 0.48, -0.22);
  addBox(group, 1.8, 0.12, 0.06, wood, 0, 0.78, -0.28);
  addBox(group, 1.8, 0.12, 0.06, wood, 0, 0.62, -0.28);
  const metal = solid(0x3a3a38);
  addBox(group, 0.06, 0.48, 0.42, metal, -0.78, 0.24, -0.05);
  addBox(group, 0.06, 0.48, 0.42, metal, 0.78, 0.24, -0.05);
  addBox(group, 0.08, 0.05, 0.45, metal, -0.78, 0.04, -0.05);
  addBox(group, 0.08, 0.05, 0.45, metal, 0.78, 0.04, -0.05);
  return group;
}

export function buildCrate() {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, 0.55, 0.45, 0.45, wood, 0, 0.225, 0);
  addBox(group, 0.58, 0.05, 0.48, solid(0x8a6a44), 0, 0.44, 0);
  addBox(group, 0.5, 0.05, 0.02, solid(0x8a6a44), 0, 0.28, 0.23);
  return group;
}

export function buildGasCylinder() {
  const group = new THREE.Group();
  addCylinder(group, 0.22, 0.24, 0.8, solid(0xb04a32), 0, 0.4, 0, 10);
  addCylinder(group, 0.08, 0.08, 0.12, solid(0x6a6a64), 0, 0.86, 0, 6);
  return group;
}

export function buildIceBox() {
  const group = new THREE.Group();
  addBox(group, 0.85, 0.65, 0.55, solid(0xc8c4b4), 0, 0.325, 0);
  addBox(group, 0.88, 0.08, 0.58, solid(0x9aa0a0), 0, 0.66, 0);
  addBox(group, 0.7, 0.03, 0.4, solid(0x5a605e), 0, 0.7, 0);
  return group;
}

export function buildPerson(options = {}) {
  const {
    coat = 0x2b4a7a,
    pants = 0x3a3630,
    hat = 0x8c2f24,
    skin = 0xc79a72,
    scale = 1,
    backpack = false,
    child = false,
    stance = false,
  } = options;
  const root = new THREE.Group();
  const coatMat = solid(coat);
  const pantsMat = solid(pants);
  const skinMat = solid(skin);
  const hatMat = solid(hat);
  const bootMat = solid(0x3a2e24);

  const legs = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.1, 0.72, 0);
    const shin = box(0.15, 0.68, 0.17, pantsMat);
    shin.position.y = -0.34;
    leg.add(shin);
    const foot = box(0.16, 0.12, 0.26, bootMat);
    foot.position.set(0, -0.68, 0.05);
    leg.add(foot);
    root.add(leg);
    legs.push(leg);
  }

  const torso = new THREE.Group();
  root.add(torso);

  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.29, 0.72, 8), coatMat);
  robe.position.y = 0.98;
  torso.add(robe);

  if (!child) {
    addCylinder(torso, 0.245, 0.245, 0.075, solid(0xd0a04a), 0, 1.06, 0, 8);
    addBox(torso, 0.07, 0.06, 0.03, solid(0xe0c060), 0, 1.06, 0.245);
  }

  const lapel = box(0.16, 0.3, 0.03, solid(0xc8a050));
  lapel.position.set(0.06, 1.17, 0.2);
  lapel.rotation.z = -0.4;
  torso.add(lapel);

  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.25, 1.28, 0);
    const sleeve = box(0.13, 0.55, 0.15, coatMat);
    sleeve.position.y = -0.28;
    arm.add(sleeve);
    const cuff = box(0.14, 0.08, 0.16, solid(0xc8a050));
    cuff.position.y = -0.54;
    arm.add(cuff);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), skinMat);
    hand.position.y = -0.61;
    arm.add(hand);
    arm.rotation.z = side * (stance ? -0.18 : -0.08);
    torso.add(arm);
    arms.push(arm);
  }

  const head = new THREE.Group();
  head.position.y = 1.48;
  torso.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.145, 8, 6), skinMat);
  head.add(skull);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), solid(0x2b211a));
  hair.position.y = 0.02;
  head.add(hair);
  if (child) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.155, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5), hatMat);
    cap.position.y = 0.03;
    head.add(cap);
  } else {
    addCylinder(head, 0.19, 0.2, 0.045, hatMat, 0, 0.1, 0, 8);
    addCylinder(head, 0.02, 0.17, 0.18, hatMat, 0, 0.19, 0, 8);
    addCylinder(head, 0.18, 0.18, 0.03, solid(0xc8a050), 0, 0.115, 0, 8);
  }

  if (backpack) {
    addBox(torso, 0.28, 0.38, 0.16, solid(0x8c4a3a), 0, 1.02, -0.22);
    addBox(torso, 0.2, 0.1, 0.02, solid(0xd8c090), 0, 1.1, -0.31);
  }

  root.scale.setScalar(scale);
  return { group: root, legs, arms, torso, head };
}

export function buildSheep(seed = 0) {
  // Child order is load-bearing for film.js: [0]=body, [1]=head, [2..3]=ears, [4..7]=legs.
  const rand = mulberry(seed * 97 + 41);
  const group = new THREE.Group();
  group.userData.propKind = "sheep";
  const wools = [0xd8d2bc, 0xcfc4a8, 0xe2d8c4, 0xb9ae96, 0xd0c8b0];
  const skins = [0x4a4038, 0x5a4838, 0x3a3228];
  const wool = solid(wools[(rand() * wools.length) | 0]);
  const dark = solid(skins[(rand() * skins.length) | 0]);
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 1), wool);
  body.scale.set(1.2 + rand() * 0.18, 0.86 + rand() * 0.1, 0.88 + rand() * 0.1);
  body.position.y = 0.66;
  group.add(body);
  const head = box(0.22, 0.24, 0.2, dark);
  head.position.set(0.58, 0.78, 0);
  group.add(head);
  addBox(group, 0.1, 0.14, 0.04, dark, 0.58, 0.92, 0.11).rotation.x = 0.35;
  addBox(group, 0.1, 0.14, 0.04, dark, 0.58, 0.92, -0.11).rotation.x = -0.35;
  for (const x of [-0.32, 0.28]) {
    for (const z of [-0.18, 0.18]) {
      addBox(group, 0.09, 0.4 + rand() * 0.05, 0.09, dark, x, 0.22, z);
    }
  }
  // Detail after the film-indexed parts: muzzle, wool clumps, horns, tail.
  addBox(group, 0.16, 0.12, 0.14, dark, 0.72, 0.7, 0);
  for (let i = 0; i < 4; i++) {
    const clump = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14 + rand() * 0.08, 0), wool);
    clump.position.set((rand() - 0.5) * 0.65, 0.55 + rand() * 0.4, (rand() - 0.5) * 0.5);
    clump.scale.set(1 + rand() * 0.35, 0.8 + rand() * 0.25, 1 + rand() * 0.3);
    group.add(clump);
  }
  if (rand() < 0.45) {
    for (const side of [-1, 1]) {
      const horn = cylinder(0.025, 0.04, 0.22, dark, 5);
      horn.position.set(0.5, 0.98, side * 0.1);
      horn.rotation.z = side * 0.55;
      horn.rotation.x = side * 0.35;
      group.add(horn);
    }
  }
  const tail = box(0.08, 0.14, 0.08, wool);
  tail.position.set(-0.55, 0.72, 0);
  group.add(tail);
  group.scale.setScalar(0.9 + rand() * 0.22);
  return group;
}

export function buildHorse(seed = 0) {
  const rand = mulberry(seed * 59 + 17);
  const group = new THREE.Group();
  group.userData.propKind = "horse";
  const coats = [0x8a5a36, 0x6a4a2c, 0xa87848, 0x4a3a28, 0xc8b090];
  const coat = solid(coats[(rand() * coats.length) | 0]);
  const dark = solid(0x3a2a1c);
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), coat);
  body.scale.set(1.5, 0.8, 0.76);
  body.position.y = 1.12;
  group.add(body);
  const neck = box(0.34, 0.8, 0.38, coat);
  neck.position.set(0.86, 1.48, 0);
  neck.rotation.z = -0.4;
  group.add(neck);
  const head = box(0.34, 0.3, 0.28, coat);
  head.position.set(1.18, 1.76, 0);
  head.rotation.z = -0.15;
  group.add(head);
  addBox(group, 0.2, 0.16, 0.22, dark, 1.34, 1.68, 0);
  addBox(group, 0.08, 0.24, 0.06, dark, 1.04, 1.95, 0.1).rotation.z = 0.2;
  addBox(group, 0.08, 0.24, 0.06, dark, 1.04, 1.95, -0.1).rotation.z = 0.2;
  addBox(group, 0.12, 0.84, 0.14, dark, 0.7, 1.6, 0.12).rotation.z = -0.4;
  for (const x of [-0.55, 0.5]) {
    for (const z of [-0.28, 0.28]) {
      addBox(group, 0.14, 1.05, 0.15, coat, x, 0.53, z);
      addBox(group, 0.16, 0.12, 0.18, dark, x, 0.06, z);
    }
  }
  const tail = box(0.12, 0.6, 0.12, dark);
  tail.position.set(-0.95, 1.05, 0);
  tail.rotation.z = 0.5;
  group.add(tail);
  const mane = box(0.12, 0.5, 0.08, dark);
  mane.position.set(0.72, 1.7, 0);
  mane.rotation.z = -0.35;
  group.add(mane);
  group.scale.setScalar(0.92 + rand() * 0.16);
  return group;
}

export function buildDog(seed = 0) {
  const rand = mulberry(seed * 71 + 9);
  const group = new THREE.Group();
  group.userData.propKind = "dog";
  const coats = [0x9a7a52, 0x6a5a48, 0xc8b090, 0x4a4038, 0xb08a5c];
  const coat = solid(coats[(rand() * coats.length) | 0]);
  const dark = solid(0x4a3a2a);
  addBox(group, 0.55, 0.24, 0.22, coat, 0, 0.36, 0);
  addBox(group, 0.22, 0.22, 0.2, coat, 0.36, 0.5, 0);
  addBox(group, 0.1, 0.1, 0.18, dark, 0.47, 0.54, 0);
  addBox(group, 0.08, 0.12, 0.06, dark, 0.32, 0.6, 0.07).rotation.z = 0.2;
  addBox(group, 0.08, 0.12, 0.06, dark, 0.32, 0.6, -0.07).rotation.z = 0.2;
  for (const x of [-0.18, 0.18]) {
    for (const z of [-0.07, 0.07]) {
      addBox(group, 0.06, 0.28, 0.06, dark, x, 0.14, z);
    }
  }
  const tail = box(0.06, 0.3, 0.06, coat);
  tail.position.set(-0.32, 0.48, 0);
  tail.rotation.z = 0.7;
  group.add(tail);
  addBox(group, 0.24, 0.04, 0.24, solid(0x8c2f24), 0.12, 0.48, 0);
  group.scale.setScalar(0.9 + rand() * 0.25);
  return group;
}

export function buildBird() {
  const group = new THREE.Group();
  const wingMat = solid(0x2e2c28, { side: THREE.DoubleSide });
  const wingGeo = new THREE.PlaneGeometry(0.95, 0.24);
  const left = new THREE.Group();
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.x = -0.34;
  left.add(leftWing);
  const right = new THREE.Group();
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.x = 0.34;
  right.add(rightWing);
  group.add(left, right);
  return { group, left, right };
}

export function buildCar(color = 0x9a3a2e, type = "sedan", seed = 0) {
  const rand = mulberry((seed || Math.abs(color) || 1) * 43 + (type === "van" ? 5 : type === "uaz" ? 11 : 2));
  const group = new THREE.Group();
  group.userData.propKind = "car";
  const paint = solid(color);
  const glass = solid(0x3a4a50);
  const tire = solid(0x2a2a28);
  const chrome = solid(0x9a9a92);
  const light = solid(0xd8cc9a);
  const red = solid(0x8c2a22);
  const rust = solid(0x8a5a3c);

  function wheels(xs, zs, radius) {
    for (const x of xs) {
      for (const z of zs) {
        const wheel = cylinder(radius, radius, 0.22, tire, 10);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, radius + 0.02, z);
        group.add(wheel);
        const hub = cylinder(radius * 0.4, radius * 0.4, 0.24, chrome, 8);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(x, radius + 0.02, z);
        group.add(hub);
      }
    }
  }

  function weather() {
    if (rand() < 0.7) {
      addBox(group, 0.55 + rand() * 0.5, 0.08, 0.35, rust, (rand() - 0.5) * 2.4, 0.7 + rand() * 0.4, 0.88);
    }
    if (rand() < 0.55) {
      addBox(group, 0.4, 0.06, 0.28, rust, (rand() - 0.5) * 2.0, 0.62, -0.9);
    }
    // Side mirrors and radio stub — period clutter that reads at medium distance.
    for (const z of [-0.95, 0.95]) addBox(group, 0.12, 0.08, 0.18, chrome, 0.9, 1.15, z);
    addCylinder(group, 0.015, 0.015, 0.55, chrome, -0.4, 1.7, 0.2, 4);
  }

  if (type === "van") {
    addBox(group, 4.5, 0.9, 1.9, paint, 0, 0.78, 0);
    addBox(group, 4.3, 0.95, 1.84, paint, 0, 1.68, 0);
    addBox(group, 4.32, 0.48, 1.86, glass, 0, 1.72, 0);
    addBox(group, 4.36, 0.12, 1.86, paint, 0, 2.2, 0);
    addBox(group, 0.14, 0.5, 1.9, paint, 2.2, 1.65, 0);
    addBox(group, 0.03, 0.5, 1.7, glass, 2.28, 1.68, 0);
    addBox(group, 0.24, 0.28, 0.34, light, 2.3, 0.82, 0.7);
    addBox(group, 0.24, 0.28, 0.34, light, 2.3, 0.82, -0.7);
    addBox(group, 0.3, 0.16, 1.9, chrome, 2.32, 0.55, 0);
    addBox(group, 4.55, 0.16, 1.92, chrome, 0, 0.46, 0);
    wheels([-1.45, 1.45], [-0.92, 0.92], 0.36);
    addBox(group, 0.02, 0.3, 0.6, red, -2.27, 0.9, -0.5);
    addBox(group, 0.02, 0.3, 0.6, red, -2.27, 0.9, 0.5);
    addBox(group, 0.54, 0.14, 0.06, solid(0xe0e0d0), -2.32, 0.7, 0);
    weather();
  } else if (type === "uaz") {
    // Boxy Soviet-era jeep silhouette common in 1990s Mongolia.
    addBox(group, 3.6, 0.7, 1.85, paint, 0, 0.72, 0);
    addBox(group, 2.4, 0.85, 1.78, paint, -0.2, 1.45, 0);
    addBox(group, 1.1, 0.7, 1.7, paint, 1.15, 1.2, 0);
    addBox(group, 2.2, 0.55, 1.7, glass, -0.25, 1.5, 0);
    addBox(group, 0.04, 0.55, 1.55, glass, 1.72, 1.35, 0);
    addBox(group, 3.7, 0.16, 1.9, chrome, 0, 0.4, 0);
    addBox(group, 0.22, 0.2, 0.3, light, 1.85, 0.7, 0.65);
    addBox(group, 0.22, 0.2, 0.3, light, 1.85, 0.7, -0.65);
    addBox(group, 0.14, 0.16, 0.28, red, -1.82, 0.7, 0.65);
    addBox(group, 0.14, 0.16, 0.28, red, -1.82, 0.7, -0.65);
    addBox(group, 0.9, 0.08, 1.7, solid(0x4a4038), -0.1, 1.95, 0); // soft top hint
    wheels([-1.15, 1.15], [-0.95, 0.95], 0.4);
    weather();
  } else {
    addBox(group, 4.1, 0.55, 1.72, paint, 0, 0.66, 0);
    addBox(group, 2.15, 0.5, 1.58, glass, -0.1, 1.18, 0);
    addBox(group, 2.25, 0.14, 1.64, paint, -0.1, 1.46, 0);
    addBox(group, 0.13, 0.44, 1.62, paint, -1.16, 1.18, 0);
    addBox(group, 0.13, 0.44, 1.62, paint, 0.97, 1.18, 0);
    addBox(group, 2.2, 0.05, 0.08, chrome, -0.1, 1.38, 0.8);
    addBox(group, 2.2, 0.05, 0.08, chrome, -0.1, 1.38, -0.8);
    addBox(group, 0.2, 0.22, 0.34, light, 2.02, 0.68, 0.58);
    addBox(group, 0.2, 0.22, 0.34, light, 2.02, 0.68, -0.58);
    addBox(group, 0.16, 0.18, 0.3, red, -2.02, 0.68, 0.58);
    addBox(group, 0.16, 0.18, 0.3, red, -2.02, 0.68, -0.58);
    addBox(group, 4.2, 0.14, 1.78, chrome, 0, 0.42, 0);
    addBox(group, 0.52, 0.14, 0.05, solid(0xe0e0d0), -2.1, 0.58, 0);
    wheels([-1.32, 1.32], [-0.84, 0.84], 0.32);
    weather();
  }
  return group;
}

export function buildSwingSet() {
  const group = new THREE.Group();
  const metal = solid(0x8a3a2c);
  const barY = 2.45;
  // Worn pads under the A-frame feet.
  for (const [x, z] of [[-1.55, -1.55], [1.55, -1.55], [-1.55, 1.55], [1.55, 1.55]]) {
    addBox(group, 0.45, 0.05, 0.45, solid(0x8a7a5a), x, 0.03, z);
  }
  addCylinder(group, 0.06, 0.07, barY, metal, 0, barY / 2, -1.1, 5).rotation.x = 0.22;
  addCylinder(group, 0.06, 0.07, barY, metal, 0, barY / 2, 1.1, 5).rotation.x = -0.22;
  addCylinder(group, 0.06, 0.07, 0.9, metal, 1.6, barY / 2, -1.6, 5).rotation.z = 0;
  addCylinder(group, 0.06, 0.07, 0.9, metal, -1.6, barY / 2, -1.6, 5);
  addCylinder(group, 0.06, 0.07, 0.9, metal, 1.6, barY / 2, 1.6, 5);
  addCylinder(group, 0.06, 0.07, 0.9, metal, -1.6, barY / 2, 1.6, 5);
  const top = box(3.4, 0.08, 0.08, metal);
  top.position.y = barY;
  group.add(top);

  const swings = [];
  for (const x of [-0.7, 0.7]) {
    const pivot = new THREE.Group();
    pivot.position.set(x, barY, 0);
    addCylinder(pivot, 0.012, 0.012, 1.1, solid(0x55524c), -0.22, -0.55, 0, 4);
    addCylinder(pivot, 0.012, 0.012, 1.1, solid(0x55524c), 0.22, -0.55, 0, 4);
    addBox(pivot, 0.6, 0.06, 0.26, solid(0x4a3426), 0, -1.1, 0);
    group.add(pivot);
    swings.push(pivot);
  }
  return { group, swings };
}

export function buildSlide() {
  const group = new THREE.Group();
  const metal = solid(0x6a7a8a);
  const yellow = solid(0xd0a040);
  addBox(group, 1.1, 0.1, 1.1, yellow, -1.2, 1.55, 0);
  for (const x of [-1.65, -0.75]) {
    for (const z of [-0.45, 0.45]) {
      addCylinder(group, 0.05, 0.06, 1.55, metal, x, 0.78, z, 5);
    }
  }
  addBox(group, 0.06, 1.2, 0.5, metal, -1.7, 2.1, 0);
  addBox(group, 0.06, 1.2, 0.5, metal, -0.7, 2.1, 0);
  const ramp = box(2.6, 0.08, 1.0, solid(0x8aa0a8));
  ramp.position.set(0.55, 0.82, 0);
  ramp.rotation.z = -0.48;
  group.add(ramp);
  for (const z of [-0.48, 0.48]) {
    const rail = box(2.6, 0.16, 0.06, metal);
    rail.position.set(0.55, 0.9, z);
    rail.rotation.z = -0.48;
    group.add(rail);
  }
  for (let i = 0; i < 5; i++) {
    addCylinder(group, 0.025, 0.025, 0.9, metal, -1.75, 0.3 + i * 0.28, 0.05, 4);
  }
  return group;
}

export function buildHoop() {
  const group = new THREE.Group();
  addCylinder(group, 0.08, 0.11, 3.1, solid(0x6a6a64), 0, 1.55, 0, 6);
  addBox(group, 0.08, 1.0, 1.7, solid(0xd8d4c4), 0, 3.3, 0);
  addBox(group, 0.05, 0.5, 0.6, solid(0x8c2f24), 0.05, 3.32, 0);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 4, 10), solid(0xc85a2c));
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0.42, 2.85, 0);
  group.add(rim);
  addCylinder(group, 0.16, 0.24, 0.5, solid(0x3a3a38), 0, 3.7, 0, 6);
  return group;
}

export function buildSandbox() {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, 3.2, 0.28, 0.18, wood, 0, 0.14, 1.5);
  addBox(group, 3.2, 0.28, 0.18, wood, 0, 0.14, -1.5);
  addBox(group, 0.18, 0.28, 3.0, wood, 1.5, 0.14, 0);
  addBox(group, 0.18, 0.28, 3.0, wood, -1.5, 0.14, 0);
  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 3.0),
    solid(0xc8b078)
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0.06;
  group.add(sand);
  for (const [x, z, s] of [[-0.6, 0.4, 0.35], [0.7, -0.5, 0.28], [0.1, 0.7, 0.22]]) {
    const mound = new THREE.Mesh(new THREE.SphereGeometry(s, 5, 3), solid(0xd2bc88));
    mound.position.set(x, 0.1, z);
    mound.scale.y = 0.45;
    group.add(mound);
  }
  addBox(group, 0.35, 0.08, 0.18, solid(0x8a6a44), 0.9, 0.18, 0.9); // toy crate hint
  return group;
}

export function buildTree(kind = "poplar", seed = 0) {
  const rand = mulberry(seed * 131 + 7);
  const group = new THREE.Group();
  group.userData.propKind = "tree";
  const trunkMat = woodMaterial();
  const greens = [0x5f7246, 0x6d7c4a, 0x556a40, 0x7a8450, 0x66784a];
  const golds = [0xa39953, 0xb0a25b, 0x8f8846, 0xb5a86b, 0x897542, 0xc4a45a, 0x9a6a38];
  const browns = [0x8a7450, 0x6a5a40, 0x9a8060];

  if (kind === "winter") {
    const height = 6 + rand() * 3;
    addCylinder(group, 0.06, 0.22, height, trunkMat, 0, height / 2, 0, 5);
    for (let i = 0; i < 9; i++) {
      const branch = cylinder(0.025, 0.07, 1.8 + rand() * 1.3, trunkMat, 4);
      const angle = i * 2.4;
      branch.position.set(Math.sin(angle) * 0.48, height * (0.38 + i * 0.06), Math.cos(angle) * 0.48);
      branch.rotation.set(Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5);
      group.add(branch);
    }
  } else if (kind === "poplar" || kind === "autumn") {
    const height = 6.5 + rand() * 3.4;
    addCylinder(group, 0.11 + rand() * 0.04, 0.2 + rand() * 0.06, height, trunkMat, 0, height / 2, 0, 5);
    // Low fork branches for silhouette variety.
    for (let i = 0; i < 3; i++) {
      const branch = cylinder(0.03, 0.07, 1.4 + rand() * 1.1, trunkMat, 4);
      const angle = i * 2.1 + rand();
      branch.position.set(Math.sin(angle) * 0.35, height * (0.35 + rand() * 0.25), Math.cos(angle) * 0.35);
      branch.rotation.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
      group.add(branch);
    }
    const crowns = 4 + ((rand() * 3) | 0);
    const autumnBias = kind === "autumn" ? 0.78 : 0.18;
    for (let i = 0; i < crowns; i++) {
      const p = crowns === 1 ? 0.5 : i / (crowns - 1);
      const roll = rand();
      const palette = roll < autumnBias * 0.55 ? golds : roll < autumnBias ? browns : greens;
      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.85 + rand() * 0.45, 0),
        solid(palette[(rand() * palette.length) | 0])
      );
      crown.position.set((rand() - 0.5) * 1.0, height * (0.55 + p * 0.42), (rand() - 0.5) * 1.0);
      crown.scale.set(0.85 + rand() * 0.45, 1.15 + rand() * 0.7, 0.85 + rand() * 0.45);
      crown.rotation.y = rand() * Math.PI;
      group.add(crown);
    }
    // Sparse bare twigs near the top for late-autumn readability.
    if (kind === "autumn" && rand() < 0.65) {
      for (let i = 0; i < 4; i++) {
        const twig = cylinder(0.015, 0.03, 0.9 + rand() * 0.7, trunkMat, 3);
        const angle = rand() * Math.PI * 2;
        twig.position.set(Math.sin(angle) * 0.55, height * (0.85 + rand() * 0.15), Math.cos(angle) * 0.55);
        twig.rotation.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);
        group.add(twig);
      }
    }
  } else if (kind === "bush") {
    const trunkH = 0.55 + rand() * 0.35;
    addCylinder(group, 0.06, 0.1, trunkH, trunkMat, 0, trunkH / 2, 0, 4);
    const palette = rand() < 0.55 ? golds : greens;
    for (let i = 0; i < 4 + ((rand() * 2) | 0); i++) {
      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.4 + rand() * 0.35, 0),
        solid(palette[(rand() * palette.length) | 0])
      );
      crown.position.set((rand() - 0.5) * 1.0, 0.75 + rand() * 0.65, (rand() - 0.5) * 1.0);
      crown.scale.set(1.0 + rand() * 0.4, 0.7 + rand() * 0.35, 1.0 + rand() * 0.4);
      group.add(crown);
    }
  } else {
    const height = 2.8 + rand() * 1.8;
    addCylinder(group, 0.16, 0.3, height, trunkMat, 0, height / 2, 0, 5);
    for (let i = 0; i < 4; i++) {
      const palette = rand() < 0.35 ? golds : greens;
      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.1 + rand() * 0.6, 0),
        solid(palette[(rand() * palette.length) | 0])
      );
      crown.position.set((rand() - 0.5) * 1.6, height + (rand() - 0.2) * 1.2, (rand() - 0.5) * 1.6);
      crown.scale.set(1.15, 0.85 + rand() * 0.35, 1.15);
      crown.rotation.y = rand() * Math.PI;
      group.add(crown);
    }
  }
  return group;
}

export function buildRock(seed = 0) {
  const rand = mulberry(seed * 53 + 3);
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.4 + rand() * 0.7, 0),
    stoneMaterial()
  );
  mesh.position.y = 0.3;
  mesh.scale.set(1 + rand() * 0.7, 0.6 + rand() * 0.6, 1 + rand() * 0.7);
  mesh.rotation.set(rand() * 3, rand() * 3, rand() * 3);
  return mesh;
}

export function buildGrassTuft(seed = 0) {
  const rand = mulberry(seed * 31 + 11);
  const group = new THREE.Group();
  group.userData.propKind = "grass";
  const green = solid(rand() < 0.35 ? 0xb2a56a : rand() < 0.55 ? 0x8a7a48 : 0x7e804e);
  for (let i = 0; i < 5; i++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32 + rand() * 0.35, 3), green);
    blade.position.set((rand() - 0.5) * 0.4, 0.18 + rand() * 0.08, (rand() - 0.5) * 0.4);
    blade.rotation.z = (rand() - 0.5) * 0.6;
    blade.rotation.y = rand() * Math.PI;
    group.add(blade);
  }
  return group;
}

export function buildYardShed(seed = 0) {
  const rand = mulberry(seed * 19 + 7);
  const group = new THREE.Group();
  group.userData.propKind = "shed";
  const body = mat({ map: cloneRepeat(fenceTexture(rand() < 0.5 ? "grey" : "warm"), 1.6, 1) });
  const w = 2.2 + rand() * 0.5;
  const d = 1.6 + rand() * 0.35;
  const h = 1.55 + rand() * 0.35;
  addBox(group, w, h, d, body, 0, h / 2, 0);
  const roof = box(w + 0.25, 0.1, d + 0.3, corrugatedMaterial(rand() < 0.5 ? "#7c7468" : "#8b8b84"));
  roof.position.set(0, h + 0.08, 0.05);
  roof.rotation.x = -0.12;
  group.add(roof);
  addBox(group, 0.7, 1.15, 0.05, woodenDoorMat(), 0, 0.6, d / 2 + 0.02);
  addBox(group, 0.08, 0.08, 0.08, solid(0x5a4a34), 0.22, 0.7, d / 2 + 0.04);
  if (rand() < 0.55) addBox(group, 0.35, 0.25, 0.04, solid(0x3a4a50), -w * 0.25, h * 0.7, d / 2 + 0.03);
  return group;
}

export function buildBollard(color = 0x8a3a2c) {
  const group = new THREE.Group();
  addCylinder(group, 0.12, 0.14, 0.85, solid(color), 0, 0.42, 0, 8);
  addCylinder(group, 0.13, 0.13, 0.08, solid(0xd8d0c0), 0, 0.86, 0, 8);
  return group;
}

export function buildTireStack(count = 3, seed = 0) {
  const rand = mulberry(seed * 17 + 5);
  const group = new THREE.Group();
  group.userData.propKind = "tires";
  const rubber = solid(0x2a2a28);
  const n = Math.max(1, count | 0);
  for (let i = 0; i < n; i++) {
    const tire = cylinder(0.34, 0.34, 0.18, rubber, 10);
    tire.position.set((rand() - 0.5) * 0.08, 0.1 + i * 0.17, (rand() - 0.5) * 0.08);
    tire.rotation.x = Math.PI / 2;
    tire.rotation.z = (rand() - 0.5) * 0.15;
    group.add(tire);
  }
  return group;
}

export function buildCloud(x, y, z, scale, seed = 0) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    map: cloudTexture(),
    transparent: true,
    depthWrite: false,
    fog: false,
    opacity: 0.85,
    color: 0xffffff,
  });
  const geometry = new THREE.PlaneGeometry(1, 0.5);
  for (let i = 0; i < 3; i++) {
    const plane = new THREE.Mesh(geometry, material.clone());
    plane.position.set((i - 1) * 0.48, (i % 2) * 0.06, 0);
    plane.scale.set(1.1, 1.1, 1);
    group.add(plane);
  }
  group.position.set(x, y, z);
  group.scale.setScalar(scale);
  group.userData.seed = seed;
  group.userData.material = material;
  return group;
}

export function buildFlagPole() {
  const group = new THREE.Group();
  const poleMat = solid(0xb8b4a8);
  addCylinder(group, 0.06, 0.09, 6.2, poleMat, 0, 3.1, 0, 6);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 4), solid(0xd8b45a));
  cap.position.y = 6.24;
  group.add(cap);
  const geometry = new THREE.PlaneGeometry(1.9, 1.2, 8, 4);
  geometry.translate(0.95, 0, 0);
  const cloth = new THREE.Mesh(geometry, mat({ map: flagTexture(), side: THREE.DoubleSide }));
  cloth.position.set(0.06, 5.55, 0);
  cloth.userData.isFlag = true;
  cloth.userData.basePositions = geometry.attributes.position.array.slice();
  group.add(cloth);
  return { group, cloth, basePositions: cloth.userData.basePositions };
}

export function buildPowerPole(options = {}) {
  const { transformer = false, lamp = false, wood = false } = options;
  const group = new THREE.Group();
  const poleMat = wood ? woodMaterial() : stoneMaterial();
  addCylinder(group, 0.13, 0.22, 10.2, poleMat, 0, 5.1, 0, 6);
  const crossMat = solid(0x6a5a44);
  addBox(group, 0.13, 0.13, 2.4, crossMat, 0, 8.6, 0);
  addBox(group, 0.11, 0.11, 2.0, crossMat, 0, 9.35, 0);
  const insulator = solid(0x5a6a5a);
  for (const z of [-1.0, 0, 1.0]) {
    addCylinder(group, 0.07, 0.07, 0.18, insulator, 0, 8.74, z, 5);
  }
  for (const z of [-0.7, 0.7]) {
    addCylinder(group, 0.06, 0.06, 0.15, insulator, 0, 9.47, z, 5);
  }
  if (transformer) {
    addCylinder(group, 0.36, 0.36, 1.1, solid(0x6a6a62), 0, 7.3, 0, 8);
    addCylinder(group, 0.42, 0.42, 0.08, solid(0x55554e), 0, 7.72, 0, 8);
    addCylinder(group, 0.42, 0.42, 0.08, solid(0x55554e), 0, 6.88, 0, 8);
    addBox(group, 0.1, 0.9, 0.1, crossMat, 0.32, 7.3, 0.3);
  }
  if (lamp) {
    addCylinder(group, 0.05, 0.05, 1.5, solid(0x6a6a64), 0, 7.3, 0.7, 5).rotation.x = Math.PI / 2;
    const head = box(0.5, 0.18, 0.28, lampMaterial());
    head.position.set(0, 7.35, 1.45);
    group.add(head);
  }
  return group;
}

export function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
