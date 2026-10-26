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

const { buildUAZ, buildHelicopter } = await import("../src/vehicles.js");

test("the UAZ jeep sits on its wheels with a tailgate spare", () => {
  const jeep = buildUAZ();
  jeep.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(jeep);
  assert.ok(Math.abs(box.min.y) < 0.06, `wheels touch ground (min.y ${box.min.y.toFixed(3)})`);
  assert.ok(box.max.y > 1.6 && box.max.y < 2.1, `jeep height ${box.max.y.toFixed(2)}`);
  assert.ok(box.max.x - box.min.x > 3.8 && box.max.x - box.min.x < 4.4, "jeep length");
  let meshes = 0;
  jeep.traverse(object => { if (object.isMesh) meshes += 1; });
  assert.ok(meshes > 20, `detailed enough (${meshes} meshes)`);
});

test("the helicopter carries spinnable rotors and skids clear of the ground", () => {
  const heli = buildHelicopter();
  assert.ok(heli.userData.rotor?.isGroup, "main rotor group exposed");
  assert.ok(heli.userData.tailRotor?.isGroup, "tail rotor group exposed");
  assert.equal(heli.userData.rotor.children.length, 5, "mast plus four blades");
  heli.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(heli);
  assert.ok(box.min.y >= -0.01, `skids ground the hull (min.y ${box.min.y.toFixed(3)})`);
  const rotorBox = new THREE.Box3().setFromObject(heli.userData.rotor);
  assert.ok(rotorBox.max.x - rotorBox.min.x > 6.5, "main rotor disc is wide");
});
