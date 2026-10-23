import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GARMENTS, HEADWEAR } from "./wardrobe.js";

export const GARMENT_BONES = [
  "pelvis", "spine", "chest", "head", "upper_arm_left", "forearm_left",
  "upper_arm_right", "forearm_right", "thigh_left", "thigh_right",
];

function weights(geometry, choose) {
  const indices = [];
  const values = [];
  const position = geometry.attributes.position;
  const point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const pairs = choose(point);
    for (let slot = 0; slot < 4; slot++) {
      indices.push(pairs[slot] ? GARMENT_BONES.indexOf(pairs[slot][0]) : 0);
      values.push(pairs[slot]?.[1] ?? 0);
    }
  }
  geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(indices, 4));
  geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(values, 4));
  return geometry;
}

function bodyWeights(point) {
  if (point.y < 0.8) {
    const leg = point.x >= 0 ? "thigh_left" : "thigh_right";
    const amount = THREE.MathUtils.clamp((0.8 - point.y) * 1.4, 0, 0.48);
    return [["pelvis", 1 - amount], [leg, amount]];
  }
  const chest = THREE.MathUtils.clamp((point.y - 0.87) / 0.3, 0, 1);
  return [["spine", 1 - chest], ["chest", chest]];
}

function rings(rows, segments, split = false, necklineDip = 0) {
  const positions = [];
  const uv = [];
  const indices = [];
  for (let row = 0; row < rows.length; row++) {
    const { y, x, z } = rows[row];
    for (let i = 0; i <= segments; i++) {
      const angle = i / segments * Math.PI * 2;
      const dip = necklineDip * Math.max(0, (y - 1.06) / 0.225) * Math.max(0, Math.cos(angle)) ** 3;
      positions.push(Math.sin(angle) * x, y - dip, Math.cos(angle) * z);
      uv.push(i / segments * 3, row / (rows.length - 1) * 3);
      if (!row || i === segments) continue;
      if (split && row < 3 && (i === 0 || i === segments - 1)) continue;
      const a = (row - 1) * (segments + 1) + i;
      const b = row * (segments + 1) + i;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return weights(geometry, bodyWeights);
}

function placed(geometry, x, y, z, bone, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
    new THREE.Vector3(...scale),
  );
  geometry.applyMatrix4(matrix);
  return weights(geometry, () => [[bone, 1]]);
}

function sleeve(side, segments, padded, light) {
  const shoulder = new THREE.Vector3(side * 0.1765, 1.216, -0.025);
  const elbow = new THREE.Vector3(side * 0.2234, 1.006, -0.054);
  const wrist = new THREE.Vector3(side * 0.2654, light ? 0.85 : 0.785, -0.001);
  const radius = padded ? 0.077 : 0.068;
  const points = [shoulder, shoulder.clone().lerp(elbow, 0.55), elbow,
    elbow.clone().lerp(wrist, 0.5), wrist];
  const positions = [];
  const uv = [];
  const indices = [];
  const skinIndices = [];
  const skinWeights = [];
  const upper = GARMENT_BONES.indexOf(`upper_arm_${side > 0 ? "left" : "right"}`);
  const lower = GARMENT_BONES.indexOf(`forearm_${side > 0 ? "left" : "right"}`);
  const axis = wrist.clone().sub(shoulder).normalize();
  const normal = new THREE.Vector3(0, 0, 1).cross(axis).normalize();
  const binormal = new THREE.Vector3().crossVectors(axis, normal);
  for (let row = 0; row < points.length; row++) {
    const r = THREE.MathUtils.lerp(radius, 0.046, row / 4);
    for (let i = 0; i <= segments; i++) {
      const angle = i / segments * Math.PI * 2;
      const point = points[row].clone().addScaledVector(normal, Math.cos(angle) * r)
        .addScaledVector(binormal, Math.sin(angle) * r);
      positions.push(...point.toArray());
      uv.push(i / segments * 2, row / 4 * 3);
      const blend = row < 2 ? 0 : row === 2 ? 0.5 : 1;
      skinIndices.push(upper, lower, 0, 0);
      skinWeights.push(1 - blend, blend, 0, 0);
      if (row && i < segments) {
        const a = (row - 1) * (segments + 1) + i;
        const b = row * (segments + 1) + i;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildGarmentGeometry(garmentId, headwearId, detail = "hero") {
  const garment = GARMENTS.find((item) => item.id === garmentId);
  if (!garment) throw new Error(`Unknown garment: ${garmentId}`);
  if (!HEADWEAR.some((item) => item.id === headwearId)) throw new Error(`Unknown headwear: ${headwearId}`);
  if (!["hero", "crowd"].includes(detail)) throw new Error(`Unknown character detail: ${detail}`);
  const segments = detail === "hero" ? 24 : 10;
  const parts = { cloth: [], trim: [], hat: [], fur: [] };
  const pad = garment.padded ? 0.014 : 0;
  const body = [
    { y: garment.hem, x: garment.flare, z: garment.flare * 0.62 },
    { y: garment.hem + 0.025, x: garment.flare - 0.003, z: garment.flare * 0.62 },
    { y: (garment.hem + 0.82) / 2, x: (garment.flare + 0.17) / 2, z: 0.115 },
    { y: 0.82, x: 0.17 + pad, z: 0.117 + pad },
    { y: 0.9, x: 0.167 + pad, z: 0.117 + pad },
    { y: 1.06, x: 0.181 + pad, z: 0.116 + pad },
    { y: 1.2, x: 0.204 + pad, z: 0.107 + pad },
    { y: 1.235, x: 0.18 + pad, z: 0.09 + pad },
    { y: 1.285, x: 0.068, z: 0.059 },
  ];
  parts.cloth.push(rings(body, segments, garment.split, garment.sleeves ? 0 : 0.17));
  parts.trim.push(rings([
    { y: garment.hem, x: garment.flare + 0.001, z: garment.flare * 0.62 + 0.001 },
    { y: garment.hem + (garment.ornament ? 0.025 : 0.012), x: garment.flare, z: garment.flare * 0.62 + 0.001 },
  ], segments));

  if (garment.sleeves) {
    for (const side of [-1, 1]) {
      parts.cloth.push(sleeve(side, segments, garment.padded, garment.light));
      parts.cloth.push(placed(new THREE.SphereGeometry(garment.padded ? 0.077 : 0.067, segments, 10),
        side * 0.177, 1.213, -0.025, `upper_arm_${side > 0 ? "left" : "right"}`, [1, 0.85, 1]));
      parts.trim.push(placed(new THREE.CylinderGeometry(0.049, 0.052, 0.035, segments),
        side * 0.2654, garment.light ? 0.85 : 0.79, -0.001,
        `forearm_${side > 0 ? "left" : "right"}`, [1, 1, 1], [0, 0, side * 0.18]));
    }
  }

  if (!garment.jacket) {
    parts.trim.push(placed(new THREE.CylinderGeometry(0.181 + pad, 0.181 + pad, 0.059, segments),
      0, 0.864, 0, "spine", [1, 1, 0.69]));
  }
  if (garment.collar) {
    parts[garment.fur ? "fur" : "cloth"].push(placed(
      new THREE.CylinderGeometry(garment.fur ? 0.094 : 0.072, 0.078, garment.fur ? 0.06 : 0.037, segments),
      0, 1.285, 0, "chest", [1, 1, 0.9]));
  }

  const closures = garment.jacket ? 5 : 4;
  for (let i = 0; i < closures; i++) {
    const y = 1.2 - i * 0.068;
    const x = garment.jacket ? 0 : 0.09 - i * 0.037;
    parts.trim.push(placed(new THREE.SphereGeometry(0.009, detail === "hero" ? 8 : 4, 5),
      x, y, 0.12 + pad, y > 1.05 ? "chest" : "spine", [1.5, 0.55, 0.6]));
  }
  const lapel = new THREE.BoxGeometry(garment.ornament ? 0.022 : 0.009, 0.3, 0.007);
  parts.trim.push(placed(lapel, garment.jacket ? 0 : -0.015, 1.095, 0.12 + pad,
    "chest", [1, 1, 1], [0, 0, garment.jacket ? 0 : 0.49]));

  if (garment.pockets) {
    for (const side of [-1, 1]) {
      parts.cloth.push(placed(new THREE.BoxGeometry(0.075, 0.08, 0.014), side * 0.095, 0.94, 0.122 + pad, "spine"));
      parts.trim.push(placed(new THREE.BoxGeometry(0.078, 0.008, 0.016), side * 0.095, 0.983, 0.124 + pad, "spine"));
    }
  }
  if (garment.padded && detail === "hero") {
    for (const y of [0.95, 1.02, 1.09, 1.16]) {
      parts.trim.push(placed(new THREE.TorusGeometry(0.187 + pad, 0.0015, 4, segments),
        0, y, 0, "chest", [1, 0.64, 1], [Math.PI / 2, 0, 0]));
    }
  }
  if (garment.ornament && detail === "hero") {
    for (const side of [-1, 1]) {
      parts.trim.push(placed(new THREE.TorusGeometry(0.027, 0.0035, 5, 12),
        side * 0.11, 1.12, 0.123, "chest", [1, 1.4, 1]));
    }
  }

  if (headwearId !== "none") {
    const head = (geometry, y, scale = [1, 1, 1]) => placed(geometry, 0, y - 0.025, -0.005, "head", scale);
    if (headwearId === "pointed") {
      parts.hat.push(head(new THREE.CylinderGeometry(0.012, 0.132, 0.145, segments), 1.566));
      parts.hat.push(head(new THREE.CylinderGeometry(0.135, 0.137, 0.022, segments), 1.49, [1, 1, 0.94]));
      parts.trim.push(head(new THREE.CylinderGeometry(0.123, 0.128, 0.012, segments), 1.507));
      parts.trim.push(head(new THREE.SphereGeometry(0.014, 8, 6), 1.646));
    } else if (headwearId === "felt") {
      parts.hat.push(head(new THREE.SphereGeometry(0.106, segments, 12, 0, Math.PI * 2, 0, Math.PI / 2), 1.46, [1, 0.75, 0.94]));
      parts.trim.push(head(new THREE.CylinderGeometry(0.108, 0.108, 0.018, segments), 1.464, [1, 1, 0.94]));
    } else {
      parts.hat.push(head(new THREE.SphereGeometry(0.108, segments, 10, 0, Math.PI * 2, 0, Math.PI / 2), 1.475, [1, 0.8, 0.94]));
      parts.fur.push(head(new THREE.CylinderGeometry(0.12, 0.116, 0.065, segments), 1.46, [1, 1, 0.94]));
      for (const side of [-1, 1]) {
        parts.fur.push(placed(new THREE.SphereGeometry(0.043, 10, 8), side * 0.094, 1.414, -0.017, "head", [0.42, 1.35, 0.8]));
      }
    }
  }
  const result = {};
  for (const [kind, geometries] of Object.entries(parts)) {
    if (!geometries.length) continue;
    result[kind] = mergeGeometries(geometries);
    for (const geometry of geometries) geometry.dispose();
    result[kind].computeBoundingSphere();
  }
  return result;
}
