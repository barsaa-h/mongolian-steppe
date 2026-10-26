import assert from "node:assert/strict";
import { test } from "node:test";
import * as THREE from "three";

// Canvas drawing is exercised in the browser; these checks inspect structure.
const gradient = { addColorStop() {} };
const context = new Proxy({}, {
  get(_, key) {
    if (key === "measureText") return text => ({ width: text.length * 10 });
    if (key === "createLinearGradient" || key === "createRadialGradient") return () => gradient;
    return () => {};
  },
});
globalThis.document = { createElement: () => ({ getContext: () => context }) };

const { buildRoom, buildTubeLight, tubeLightMaterials, updateTubeLights, buildDoor, buildHospitalBed, buildDesk, buildChair, buildCabinet, buildLocker, buildIVStand, buildChalkboard, buildStairs } = await import("../src/interior.js");

function finiteTree(group) {
  let meshes = 0;
  group.traverse(object => {
    if (!object.isMesh) return;
    meshes += 1;
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox;
    for (const value of [...box.min.toArray(), ...box.max.toArray()]) {
      assert.ok(Number.isFinite(value), "geometry stays finite");
    }
  });
  return meshes;
}

test("a room is a closed box with floor, walls, ceiling and skirting", () => {
  const room = buildRoom({ w: 4, d: 5, h: 3 });
  const box = new THREE.Box3().setFromObject(room);
  assert.ok(box.max.x - box.min.x >= 4);
  assert.ok(box.max.z - box.min.z >= 5);
  assert.ok(Math.abs(box.max.y - 3) < 0.35, `ceiling height ${box.max.y}`);
  assert.ok(finiteTree(room) > 8);
});

test("a doorway leaves a real floor-to-lintel gap in the front wall", () => {
  const closed = buildRoom({ w: 4, d: 4, doorWidth: 0 });
  const open = buildRoom({ w: 4, d: 4, doorWidth: 1.1 });
  // World boxes near the front plane (z≈2): the closed room has one wall slab;
  // the open room has two side segments plus a lintel above head height. The
  // band starts above the skirting board so trim never counts as wall.
  const frontPieces = room => {
    room.updateMatrixWorld(true);
    const pieces = [];
    for (const child of room.children) {
      if (!child.isMesh) continue;
      const b = new THREE.Box3().setFromObject(child);
      if (b.min.z > 1.98 && b.max.z < 2.35) pieces.push(b);
    }
    return pieces;
  };
  assert.equal(frontPieces(closed).length, 1);
  const openPieces = frontPieces(open);
  assert.equal(openPieces.length, 3);
  assert.equal(openPieces.filter(b => b.min.y > 1.9).length, 1, "a lintel closes the gap above head height");
  const blocked = openPieces.filter(b => b.min.x < 0.3 && b.max.x > -0.3 && b.min.y < 1.9);
  assert.equal(blocked.length, 0, "nothing blocks the opening below the lintel");
});

test("windows add a night-glow glass plane with emissive light", () => {
  const room = buildRoom({ w: 4, d: 4, windowWidth: 1.6 });
  let emissive = 0;
  room.traverse(object => {
    if (object.isMesh && object.material.emissiveMap) emissive += 1;
  });
  assert.equal(emissive, 1);
});

test("tube lights register for flicker and stay deterministic", () => {
  const before = tubeLightMaterials().length;
  buildTubeLight(1.3, 0);
  buildTubeLight(1.3, 0);
  buildTubeLight(1.3, 1);
  const materials = tubeLightMaterials();
  assert.equal(materials.length, before + 2);
  const first = materials.map(m => m.emissiveIntensity);
  updateTubeLights(3);
  const atThree = materials.map(m => m.emissiveIntensity);
  updateTubeLights(3);
  assert.deepEqual(materials.map(m => m.emissiveIntensity), atThree);
  assert.notDeepEqual(first, atThree);
});

test("furniture kit builds finite, grounded pieces", () => {
  for (const [name, piece] of [
    ["bed", buildHospitalBed()],
    ["desk", buildDesk()],
    ["chair", buildChair()],
    ["cabinet", buildCabinet()],
    ["locker", buildLocker()],
    ["iv stand", buildIVStand()],
    ["chalkboard", buildChalkboard()],
    ["stairs", buildStairs()],
  ]) {
    const box = new THREE.Box3().setFromObject(piece);
    assert.ok(box.min.y > -0.15, `${name} sits on the floor`);
    assert.ok(finiteTree(piece) > 0, `${name} has geometry`);
  }
});

test("an open door leaf actually rotates open", () => {
  const shut = buildDoor({ open: 0 });
  const wide = buildDoor({ open: Math.PI / 2 });
  const leafAngle = door => {
    const leaf = door.children.at(-1);
    return leaf.rotation.y;
  };
  assert.equal(Math.abs(leafAngle(shut)), 0);
  assert.ok(Math.abs(Math.abs(leafAngle(wide)) - Math.PI / 2) < 1e-6);
});
