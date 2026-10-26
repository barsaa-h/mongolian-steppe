import assert from "node:assert/strict";
import { test } from "node:test";
import * as THREE from "three";
import { terrainHeight, groundGeometry } from "../src/terrain.js";
import { surfaceHeight, townHeight } from "../src/district.js";
import { approachCurve, mountainGeometry } from "../src/winter.js";

test("the approach asphalt remains above the rendered terrain", () => {
  const ground = new THREE.Mesh(groundGeometry(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  ground.rotation.x = -Math.PI / 2;
  ground.updateMatrixWorld(true);
  const curve = approachCurve();
  const ray = new THREE.Raycaster();
  ray.ray.direction.set(0, -1, 0);
  for (let i = 0; i <= 100; i++) {
    const p = curve.getPointAt(i / 100);
    ray.ray.origin.set(p.x, 60, p.z);
    const hit = ray.intersectObject(ground)[0];
    assert.ok(hit && hit.point.y < terrainHeight(p.x, p.z) + 0.075,
      `terrain breaks through the road at ${i}%`);
  }
  ground.geometry.dispose();
  ground.material.dispose();
});

test("the winter approach joins the existing road without a height jump", () => {
  const curve = approachCurve();
  const end = curve.getPointAt(1);
  assert.ok(Math.abs(end.x + 162) < 1e-9);
  assert.ok(Math.abs(end.z) < 1e-9);
  assert.ok(Math.abs(surfaceHeight(end.x, end.z)) < 1e-9);
  for (let i = 0; i <= 100; i++) {
    const p = curve.getPointAt(i / 100);
    assert.ok(Number.isFinite(surfaceHeight(p.x, p.z)));
    assert.equal(surfaceHeight(p.x, p.z), terrainHeight(p.x, p.z));
    if (i) {
      const previous = curve.getPointAt((i - 1) / 100);
      assert.ok(Math.abs(terrainHeight(p.x, p.z) - terrainHeight(previous.x, previous.z)) < 0.8);
    }
  }
});

test("yard embankments meet the terrace and surrounding terrain continuously", () => {
  for (const side of [-1, 1]) {
    for (const z of [43, 66, 89]) {
      assert.ok(Math.abs(surfaceHeight(side * 102.001, z) - townHeight(side * 102, z)) < 0.001);
      assert.ok(Math.abs(surfaceHeight(side * 119.999, z) - terrainHeight(side * 120, z)) < 0.001);
      for (let x = 102; x <= 120; x++) assert.ok(Number.isFinite(surfaceHeight(side * x, z)));
    }
  }
});

test("mountains form a closed, deterministic ring with finite geometry", () => {
  const a = mountainGeometry(475, 105, 731);
  const b = mountainGeometry(475, 105, 731);
  const positions = a.attributes.position;
  assert.deepEqual(positions.array, b.attributes.position.array);
  assert.equal(positions.count, a.attributes.color.count);
  assert.equal(positions.count % 3, 0);
  for (const name of ["position", "normal", "color"]) {
    for (const value of a.attributes[name].array) assert.ok(Number.isFinite(value), name);
  }
  // Each radial strip closes its final two triangles against its first vertex.
  for (let strip = 0; strip < 9; strip++) {
    const start = strip * 600;
    const last = start + 597;
    for (let axis = 0; axis < 3; axis++) {
      assert.ok(Math.abs(positions.array[start * 3 + axis] - positions.array[last * 3 + axis]) < 0.001);
    }
  }
  a.dispose();
  b.dispose();
});
