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
  foliageTexture,
  gerRoofTexture,
  gerWallTexture,
  doorTexture,
  grassBladeTexture,
  leafLitterTexture,
  paperTexture,
  rustTexture,
  shadowTexture,
  smokeTexture,
  stoneTexture,
  wearTexture,
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
const foliageMats = [];

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

export function planeGeo(w, h, sx = 1, sy = 1) {
  return cachedGeo(`plane:${w}:${h}:${sx}:${sy}`, () => new THREE.PlaneGeometry(w, h, sx, sy));
}

// Foliage crowns share a small set of mottled materials; world.js animates wind
// through every material returned here, which also covers the merged batches.
export function foliageMaterial(variant = 0, color = 0x6d7c4a) {
  const texVariant = variant % 2;
  const key = `foliage:${texVariant}:${color}`;
  if (!matCache.has(key)) {
    const material = mat({ map: foliageTexture(texVariant), color });
    material.userData.isFoliage = true;
    matCache.set(key, material);
    foliageMats.push(material);
  }
  return matCache.get(key);
}

export function foliageMaterials() {
  return foliageMats;
}

export function leafLitterMaterial() {
  if (!matCache.has("leafLitter")) {
    matCache.set("leafLitter", mat({
      map: leafLitterTexture(),
      alphaTest: 0.45,
      side: THREE.DoubleSide,
    }));
  }
  return matCache.get("leafLitter");
}

export function paperMaterial(kind = 0) {
  const key = `paperMat:${kind}`;
  if (!matCache.has(key)) {
    matCache.set(key, mat({
      map: paperTexture(kind),
      alphaTest: 0.4,
      side: THREE.DoubleSide,
    }));
  }
  return matCache.get(key);
}

export function weedMaterial() {
  if (!matCache.has("weed")) {
    matCache.set("weed", mat({
      map: grassBladeTexture(),
      alphaTest: 0.45,
      side: THREE.DoubleSide,
    }));
  }
  return matCache.get("weed");
}

export function groundWearMaterial() {
  if (!matCache.has("wear:ground")) {
    matCache.set("wear:ground", mat({
      map: wearTexture(),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }));
  }
  return matCache.get("wear:ground");
}

export function trackWearMaterial() {
  if (!matCache.has("wear:track")) {
    matCache.set("wear:track", mat({
      map: cloneRepeat(wearTexture(), 1, 2),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }));
  }
  return matCache.get("wear:track");
}

export function terraceWearMaterial() {
  if (!matCache.has("wear:terrace")) {
    matCache.set("wear:terrace", mat({
      map: wearTexture(),
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
    }));
  }
  return matCache.get("wear:terrace");
}

export function rustMaterial() {
  if (!matCache.has("rust")) {
    matCache.set("rust", new THREE.MeshLambertMaterial({
      map: rustTexture(),
      transparent: true,
      depthWrite: false,
      flatShading: true,
    }));
  }
  return matCache.get("rust");
}

// Irregular leaf-litter disc that sits under a tree and breaks up bare ground.
export function buildLeafCarpet(radius = 2.2, seed = 0) {
  const rand = mulberry(seed * 313 + 17);
  const segments = 12;
  const positions = [];
  const uvs = [];
  const ring = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radius * (0.72 + rand() * 0.38);
    ring.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  for (let i = 0; i < segments; i++) {
    const [ax, az] = ring[i];
    const [bx, bz] = ring[i + 1];
    for (const [x, z] of [[0, 0], [ax, az], [bx, bz]]) {
      positions.push(x, 0, z);
      uvs.push(0.5 + x / (radius * 2.2), 0.5 + z / (radius * 2.2));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, leafLitterMaterial());
  mesh.position.y = 0.045;
  return mesh;
}

// Small crop of the litter texture used as individual fallen leaves.
const LEAF_QUAD_UVS = [[0.08, 0.08], [0.42, 0.18], [0.2, 0.5], [0.58, 0.6]];

function leafQuadGeometry(corner) {
  const key = `leafQuad:${corner}`;
  return cachedGeo(key, () => {
    const geo = planeGeo(0.15, 0.1).clone();
    const [u, v] = LEAF_QUAD_UVS[corner % LEAF_QUAD_UVS.length];
    const uv = geo.attributes.uv;
    const remapped = new Float32Array(uv.array.length);
    for (let i = 0; i < uv.count; i++) {
      remapped[i * 2] = u + uv.getX(i) * 0.24;
      remapped[i * 2 + 1] = v + uv.getY(i) * 0.24;
    }
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(remapped, 2));
    return geo;
  });
}

export function buildLeafScatter(count = 8, spread = 2, seed = 0) {
  const rand = mulberry(seed * 257 + 41);
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const leaf = new THREE.Mesh(
      leafQuadGeometry((rand() * 4) | 0),
      leafLitterMaterial()
    );
    const angle = rand() * Math.PI * 2;
    const distance = Math.sqrt(rand()) * spread;
    leaf.position.set(Math.sin(angle) * distance, rand() * 0.02, Math.cos(angle) * distance);
    leaf.rotation.set(-Math.PI / 2 + (rand() - 0.5) * 0.5, rand() * Math.PI * 2, 0);
    leaf.rotation.order = "YXZ";
    group.add(leaf);
  }
  return group;
}

export function buildPaperScrap(kind = 0, seed = 0) {
  const rand = mulberry(seed * 57 + 29);
  const scrap = new THREE.Mesh(planeGeo(0.3, 0.42), paperMaterial(kind));
  scrap.rotation.order = "YXZ";
  scrap.rotation.y = rand() * Math.PI * 2;
  scrap.rotation.x = -Math.PI / 2 + (rand() - 0.5) * 0.3;
  scrap.rotation.z = (rand() - 0.5) * 0.3;
  scrap.position.y = 0.05;
  return scrap;
}

export function buildWeedTuft(seed = 0) {
  const rand = mulberry(seed * 83 + 19);
  const group = new THREE.Group();
  const material = weedMaterial();
  for (const yaw of [0, Math.PI / 2]) {
    const quad = new THREE.Mesh(planeGeo(0.38, 0.44), material);
    quad.position.y = 0.2;
    quad.rotation.y = yaw + rand() * 0.6;
    group.add(quad);
  }
  group.rotation.y = rand() * Math.PI * 2;
  return group;
}

export function buildTumblingLeaf(seed = 0) {
  const leaf = new THREE.Mesh(leafQuadGeometry(seed % 4), leafLitterMaterial());
  leaf.rotation.order = "YXZ";
  return leaf;
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
  }
  addBox(group, length, 0.12, 0.13, postMat, 0, 1.58, 0);
  addBox(group, length, 0.1, 0.12, postMat, 0, 0.22, 0);
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
  return group;
}

export function buildGer(scale = 1) {
  const group = new THREE.Group();
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

export function buildClothesline(length = 6) {
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
  const colors = [0xc8c0a8, 0x8a5a5a, 0x5a7a8a, 0xd8c070, 0xb8b0a0, 0x7a8a6a];
  for (let i = 0; i < 5; i++) {
    const x = -length * 0.32 + i * (length * 0.16);
    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.75, 2, 2),
      solid(colors[i], { side: THREE.DoubleSide })
    );
    cloth.position.set(x, 1.9, 0.02);
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
    solid(0xb5ad98, { side: THREE.DoubleSide })
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
  return group;
}

export function buildBench() {
  const group = new THREE.Group();
  const wood = woodMaterial();
  addBox(group, 1.8, 0.08, 0.45, wood, 0, 0.46, 0);
  addBox(group, 1.8, 0.35, 0.06, wood, 0, 0.72, -0.2);
  const metal = solid(0x3a3a38);
  addBox(group, 0.06, 0.45, 0.4, metal, -0.75, 0.22, 0);
  addBox(group, 0.06, 0.45, 0.4, metal, 0.75, 0.22, 0);
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

export function buildSheep() {
  const group = new THREE.Group();
  const wool = solid(0xd8d2bc);
  const dark = solid(0x4a4038);
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 1), wool);
  body.scale.set(1.25, 0.9, 0.9);
  body.position.y = 0.66;
  group.add(body);
  const head = box(0.24, 0.26, 0.22, dark);
  head.position.set(0.62, 0.78, 0);
  group.add(head);
  addBox(group, 0.1, 0.12, 0.04, dark, 0.62, 0.9, 0.12).rotation.x = 0.3;
  addBox(group, 0.1, 0.12, 0.04, dark, 0.62, 0.9, -0.12).rotation.x = -0.3;
  for (const x of [-0.35, 0.35]) {
    for (const z of [-0.2, 0.2]) {
      addBox(group, 0.08, 0.42, 0.08, dark, x, 0.21, z);
    }
  }
  return group;
}

export function buildHorse() {
  const group = new THREE.Group();
  const coat = solid(0x8a5a36);
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
  return group;
}

export function buildDog() {
  const group = new THREE.Group();
  const coat = solid(0x9a7a52);
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

let carGlassCache = null;
function carGlassMaterial() {
  if (!carGlassCache) {
    carGlassCache = new THREE.MeshLambertMaterial({
      color: 0x36444c,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      flatShading: true,
    });
  }
  return carGlassCache;
}

function carWheel(group, x, z, radius, paint, flareZ) {
  const trim = solid(0x24262a);
  const wheel = cylinder(radius, radius, 0.2, trim, 10);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(x, radius, z);
  group.add(wheel);
  const hub = cylinder(radius * 0.45, radius * 0.45, 0.21, solid(0x9a9a92), 8);
  hub.rotation.x = Math.PI / 2;
  hub.position.set(x, radius, z);
  group.add(hub);
  // Fender flare hinting at an arch over the tucked-in wheel.
  addBox(group, radius * 2.6, 0.24, 0.09, paint, x, radius + 0.28, Math.sign(z) * flareZ);
}

function carRust(group, w, h, x, y, z, face = "side") {
  const patch = new THREE.Mesh(planeGeo(w, h), rustMaterial());
  if (face === "top") patch.rotation.x = -Math.PI / 2;
  else patch.rotation.y = z > 0 ? 0 : Math.PI;
  patch.position.set(x, y, z + Math.sign(z || 1) * 0.005);
  group.add(patch);
}

export function buildCar(color = 0x9a3a2e, type = "sedan", variant = 0) {
  const group = new THREE.Group();
  const paint = solid(color);
  const glass = carGlassMaterial();
  const trim = solid(0x2c2e2c);
  const chrome = solid(0x9a9a92);
  const light = solid(0xd8cc9a);
  const red = solid(0x8c2a22);
  const worn = ((variant % 2) + 2) % 2 === 1;

  if (type === "van") {
    // Tall 4x4 "loaf" van: flat face, short protruding hood, window band with pillars.
    addBox(group, 4.25, 0.22, 1.72, solid(0x1f2220), -0.05, 0.4, 0);
    addBox(group, 4.35, 1.5, 1.9, paint, -0.05, 1.28, 0);
    addBox(group, 4.45, 0.1, 1.94, paint, -0.05, 2.08, 0);
    addBox(group, 0.4, 0.35, 1.88, paint, 2.1, 0.95, 0);
    const windshield = box(0.04, 0.55, 1.68, glass);
    windshield.rotation.z = 0.08;
    windshield.position.set(2.15, 1.62, 0);
    group.add(windshield);
    for (const z of [-0.96, 0.96]) {
      addBox(group, 3.1, 0.45, 0.03, glass, -0.1, 1.62, z);
      for (const x of [1.3, 0.4, -0.5, -1.4]) {
        addBox(group, 0.09, 0.5, 0.04, paint, x, 1.62, z);
      }
      addBox(group, 0.02, 0.7, 0.02, trim, 1.75, 1.1, z);
      addBox(group, 0.05, 0.14, 0.16, red, -2.26, 1.0, z * 0.73);
      const stalk = addBox(group, 0.03, 0.03, 0.09, trim, 2.0, 1.55, z * 1.06);
      stalk.position.z = z * 1.01;
      addBox(group, 0.05, 0.1, 0.05, paint, 2.0, 1.58, z * 1.06);
    }
    addBox(group, 0.04, 0.18, 0.5, trim, 2.31, 1.05, 0);
    for (const z of [-0.6, 0.6]) {
      const lamp = cylinder(0.09, 0.09, 0.07, light, 8);
      lamp.rotation.z = Math.PI / 2;
      lamp.position.set(2.31, 1.05, z);
      group.add(lamp);
    }
    addBox(group, 0.14, 0.14, 1.9, chrome, 2.28, 0.52, 0);
    addBox(group, 0.14, 0.14, 1.9, chrome, -2.33, 0.52, 0);
    addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), 2.36, 0.62, 0);
    addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), -2.41, 0.62, 0);
    for (const x of [-1.42, 1.42]) {
      for (const z of [-0.78, 0.78]) carWheel(group, x, z, 0.36, paint, 0.99);
    }
    const exhaust = cylinder(0.03, 0.03, 0.14, trim, 6);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(-2.3, 0.3, -0.55);
    group.add(exhaust);
    if (worn) {
      carRust(group, 0.5, 0.5, 1.6, 1.62, 0.975);
      carRust(group, 0.9, 0.4, -0.6, 0.75, -0.96);
    }
  } else {
    const hatch = type === "hatch";
    const nose = hatch ? 1.95 : 2.2;
    const tail = hatch ? -1.85 : -2.15;
    const frontAxle = hatch ? 1.08 : 1.28;
    const rearAxle = hatch ? -1.08 : -1.28;
    addBox(group, nose - tail - 0.4, 0.2, 1.5, solid(0x1f2220), 0, 0.32, 0);
    addBox(group, nose - tail, 0.34, 1.66, paint, 0, 0.62, 0);
    addBox(group, 2.3, 0.14, 1.7, solid(0x35322e), 0, 0.42, 0);
    addBox(group, hatch ? 0.95 : 1.2, 0.16, 1.58, paint, hatch ? 1.2 : 1.38, 0.87, 0);
    if (!hatch) addBox(group, 1.0, 0.16, 1.58, paint, -1.48, 0.87, 0);
    else addBox(group, 0.12, 0.5, 1.6, paint, tail + 0.06, 0.82, 0);

    // Cabin: dark tub and seats read through the transparent glass.
    addBox(group, hatch ? 2.0 : 1.7, 0.3, 1.46, solid(0x22201c), hatch ? -0.4 : -0.12, 0.97, 0);
    for (const z of [-0.36, 0.36]) {
      const seatX = hatch ? -0.55 : -0.3;
      addBox(group, 0.42, 0.12, 0.44, solid(0x2e2a24), seatX, 1.06, z);
      addBox(group, 0.12, 0.36, 0.44, solid(0x2e2a24), seatX - 0.22, 1.22, z);
    }
    const cabinCenter = hatch ? -0.45 : -0.12;
    addBox(group, hatch ? 2.05 : 1.95, 0.09, 1.56, paint, cabinCenter, 1.38, 0);
    for (const z of [-0.78, 0.78]) {
      addBox(group, hatch ? 1.9 : 1.6, 0.3, 0.03, glass, cabinCenter, 1.12, z);
      addBox(group, 0.07, 0.36, 0.04, paint, cabinCenter - (hatch ? 0.45 : 0.15), 1.12, z);
    }
    const windshield = box(0.04, hatch ? 0.46 : 0.44, 1.5, glass);
    windshield.rotation.z = hatch ? 0.42 : 0.38;
    windshield.position.set(hatch ? 0.5 : 0.6, 1.15, 0);
    group.add(windshield);
    for (const z of [-0.76, 0.76]) {
      const pillar = box(0.06, hatch ? 0.48 : 0.44, 0.06, paint);
      pillar.rotation.z = windshield.rotation.z;
      pillar.position.set(hatch ? 0.52 : 0.62, 1.15, z);
      group.add(pillar);
    }
    const rearGlass = box(0.04, hatch ? 0.55 : 0.4, 1.5, glass);
    rearGlass.rotation.z = hatch ? -0.72 : -0.5;
    rearGlass.position.set(hatch ? -1.42 : -1.02, 1.12, 0);
    group.add(rearGlass);
    for (const z of [-0.76, 0.76]) {
      const pillar = box(0.06, hatch ? 0.56 : 0.42, 0.06, paint);
      pillar.rotation.z = rearGlass.rotation.z;
      pillar.position.set(hatch ? -1.44 : -1.04, 1.13, z);
      group.add(pillar);
    }

    for (const z of [-0.835, 0.835]) {
      for (const x of [cabinCenter + 0.75, cabinCenter - 0.75]) {
        addBox(group, 0.02, 0.26, 0.02, trim, x, 0.62, z);
      }
      addBox(group, 0.12, 0.03, 0.02, chrome, cabinCenter + 0.35, 0.74, z);
      addBox(group, 0.03, 0.03, 0.09, trim, 0.55, 1.1, z * 1.02);
      addBox(group, 0.06, 0.09, 0.04, paint, 0.55, 1.15, z * 1.07);
    }
    const front = (nose - tail) / 2;
    const rear = -front;
    addBox(group, 0.05, 0.16, 0.72, trim, front + 0.005, 0.76, 0);
    addBox(group, 0.055, 0.03, 0.7, chrome, front + 0.01, 0.76, 0);
    for (const z of [-0.52, 0.52]) {
      const lamp = cylinder(0.085, 0.085, 0.06, light, 8);
      lamp.rotation.z = Math.PI / 2;
      lamp.position.set(front + 0.01, 0.78, z);
      group.add(lamp);
      addBox(group, 0.05, 0.08, 0.12, solid(0xc88030), front, 0.78, z + Math.sign(z) * 0.16);
      addBox(group, 0.05, 0.12, 0.28, red, rear - 0.01, 0.72, z);
    }
    addBox(group, 0.16, 0.13, 1.72, chrome, front + 0.08, 0.5, 0);
    addBox(group, 0.16, 0.13, 1.72, chrome, rear - 0.08, 0.5, 0);
    addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), front + 0.17, 0.56, 0);
    addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), rear - 0.17, 0.56, 0);
    for (const x of [frontAxle, rearAxle]) {
      for (const z of [-0.66, 0.66]) carWheel(group, x, z, 0.31, paint, 0.85);
    }
    const exhaust = cylinder(0.03, 0.03, 0.14, trim, 6);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(rear - 0.02, 0.28, -0.5);
    group.add(exhaust);
    if (worn) {
      carRust(group, 0.75, 0.45, hatch ? 1.2 : 1.35, 0.955, 0.12, "top");
      carRust(group, 0.6, 0.32, rearAxle - 0.35, 0.66, 0.845);
      carRust(group, 0.7, 0.3, rearAxle, 0.55, -0.845);
    }
  }
  return group;
}

export function buildSwingSet() {
  const group = new THREE.Group();
  const metal = solid(0x8a3a2c);
  const barY = 2.45;
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
  return group;
}

export function buildTree(kind = "poplar", seed = 0) {
  const rand = mulberry(seed * 131 + 7);
  const group = new THREE.Group();
  const trunkMat = woodMaterial();
  const greens = [0x5f7246, 0x6d7c4a, 0x556a40, 0x7a8450, 0x66784a];
  const golds = [0xa39953, 0xb0a25b, 0x8f8846, 0xb5a86b, 0x897542];

  // Craggy crown: identical vertex positions get identical displacement, so the
  // shell stays watertight while the silhouette stops reading as a smooth ball.
  const crown = (radius, color, stretch = 1) => {
    const geometry = new THREE.IcosahedronGeometry(radius, 1);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
      position.setXYZ(
        i,
        x * (1 + (h - 0.5) * 0.44),
        y * (1 + (h - 0.5) * 0.34) * stretch,
        z * (1 + (h - 0.5) * 0.44)
      );
    }
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, foliageMaterial((rand() * 2) | 0, color));
    mesh.rotation.y = rand() * Math.PI;
    return mesh;
  };

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
  } else if (kind === "poplar") {
    const height = 7 + rand() * 3;
    addCylinder(group, 0.1, 0.2, height, trunkMat, 0, height / 2, 0, 5);
    const tiers = 3 + ((rand() * 2) | 0);
    for (let i = 0; i < tiers; i++) {
      const p = i / Math.max(1, tiers - 1);
      const palette = rand() < 0.3 ? golds : greens;
      const blob = crown(0.85 + rand() * 0.3, palette[(rand() * palette.length) | 0], 1.9 + rand() * 0.4);
      blob.position.set((rand() - 0.5) * 0.3, height * (0.5 + p * 0.5), (rand() - 0.5) * 0.3);
      blob.scale.set(0.72, 1, 0.72);
      group.add(blob);
    }
  } else if (kind === "autumn" || kind === "elm") {
    const height = 6.5 + rand() * 3;
    addCylinder(group, 0.12, 0.22, height, trunkMat, 0, height / 2, 0, 5);
    const branches = 1 + ((rand() * 2) | 0);
    for (let b = 0; b < branches; b++) {
      const angle = rand() * Math.PI * 2;
      const branch = cylinder(0.04, 0.09, 1.5 + rand(), trunkMat, 4);
      branch.position.set(Math.sin(angle) * 0.55, height * 0.62, Math.cos(angle) * 0.55);
      branch.rotation.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
      group.add(branch);
    }
    const crowns = 3 + ((rand() * 3) | 0);
    for (let i = 0; i < crowns; i++) {
      const p = i / Math.max(1, crowns - 1);
      const palette = rand() < 0.66 ? golds : greens;
      const blob = crown(0.95 + rand() * 0.5, palette[(rand() * palette.length) | 0], 0.85 + rand() * 0.35);
      blob.position.set((rand() - 0.5) * 1.15, height * (0.58 + p * 0.42), (rand() - 0.5) * 1.15);
      group.add(blob);
    }
  } else if (kind === "bush") {
    const trunkH = 0.7;
    addCylinder(group, 0.07, 0.1, trunkH, trunkMat, 0, trunkH / 2, 0, 4);
    for (let i = 0; i < 3; i++) {
      const blob = crown(0.5 + rand() * 0.3, greens[(rand() * greens.length) | 0], 0.8);
      blob.position.set((rand() - 0.5) * 0.8, 0.9 + rand() * 0.5, (rand() - 0.5) * 0.8);
      blob.scale.set(1.1, 1, 1.1);
      group.add(blob);
    }
  } else {
    const height = 2.8 + rand() * 1.8;
    addCylinder(group, 0.16, 0.3, height, trunkMat, 0, height / 2, 0, 5);
    for (let i = 0; i < 3; i++) {
      const palette = rand() < 0.2 ? golds : greens;
      const blob = crown(1.2 + rand() * 0.6, palette[(rand() * palette.length) | 0], 0.85);
      blob.position.set((rand() - 0.5) * 1.6, height + (rand() - 0.2) * 1.2, (rand() - 0.5) * 1.6);
      group.add(blob);
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
  const green = solid(rand() < 0.25 ? 0xa29b6b : 0x7e804e);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35 + rand() * 0.25, 3), green);
    blade.position.set((rand() - 0.5) * 0.3, 0.2, (rand() - 0.5) * 0.3);
    blade.rotation.z = (rand() - 0.5) * 0.5;
    blade.rotation.y = rand() * Math.PI;
    group.add(blade);
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
