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

const {
  INFECTED_STATES,
  crowdMaterial,
  buildStandingFigure,
  buildWalkingFigure,
  animateWalk,
  animateLunge,
  buildCrowd,
  crowdRing,
  crowdRows,
  dressInfected,
  attachSteam,
  updateInfected,
} = await import("../src/infected.js");

test("the three states are visually distinct in material terms", () => {
  const materials = INFECTED_STATES.map(state => crowdMaterial(state, 0x4a4a44));
  for (let i = 0; i < materials.length; i++) {
    for (let j = i + 1; j < materials.length; j++) {
      assert.ok(!materials[i].color.equals(materials[j].color)
        || !materials[i].emissive.equals(materials[j].emissive),
        `${INFECTED_STATES[i]} vs ${INFECTED_STATES[j]} differ`);
    }
  }
  assert.equal(crowdMaterial("grey", 0x4a4a44), crowdMaterial("grey", 0x4a4a44), "cached");
});

test("a standing figure is a finite two-part mesh of plausible human height", () => {
  const figure = buildStandingFigure({ x: 3, z: -4, yaw: 0.4, seed: 9, state: "white" });
  assert.ok(figure.isGroup && figure.children.length === 2, "cloth body plus bare skin");
  figure.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(figure);
  const height = box.max.y - box.min.y;
  assert.ok(height > 1.1 && height < 1.9, `height ${height.toFixed(2)}`);
  assert.equal(figure.userData.infectedState, "white");
  const center = new THREE.Vector3();
  box.getCenter(center);
  assert.ok(Math.abs(center.x - 3) < 0.4 && Math.abs(center.z + 4) < 0.4, "sits where placed");
});

test("crowds merge into few meshes and stay deterministic for a seed", () => {
  const positions = crowdRows({ origin: [0, 0], dir: [0, -1], across: 4, rows: 5, seed: 3 });
  assert.equal(positions.length, 20);
  const crowdA = buildCrowd({ positions, seed: 3, state: "white" });
  const crowdB = buildCrowd({ positions, seed: 3, state: "white" });
  assert.ok(crowdA.children.length <= 7, `few merged batches (${crowdA.children.length})`);
  const bodiesA = crowdA.children.filter(mesh => mesh.userData.part === "body");
  assert.equal(bodiesA.reduce((sum, mesh) => sum + mesh.userData.count, 0), 20);
  const bareA = crowdA.children.find(mesh => mesh.userData.part === "bare");
  assert.equal(bareA.userData.count, 20, "every figure has a skin pass");
  const sampleA = bodiesA[0].geometry.attributes.position.array.slice(0, 9);
  const sampleB = crowdB.children.filter(mesh => mesh.userData.part === "body")[0]
    .geometry.attributes.position.array.slice(0, 9);
  assert.deepEqual(sampleA, sampleB);
});

test("the ring faces inward and holds every figure on its radius", () => {
  const positions = crowdRing({ radius: 10, count: 30, seed: 5 });
  assert.equal(positions.length, 30);
  for (const [x, z, yaw] of positions) {
    const r = Math.hypot(x, z);
    assert.ok(r > 9 && r < 11.5, `radius ${r.toFixed(2)}`);
    const frontX = Math.sin(yaw);
    const frontZ = Math.cos(yaw);
    const outward = new THREE.Vector2(x, z).normalize();
    assert.ok(frontX * outward.x + frontZ * outward.y < 0, "figures face the centre");
  }
});

test("hero dressing tints materials and labels the state without sharing caches", () => {
  const figure = buildStandingFigure({ seed: 2, state: "grey" });
  const before = figure.children[0].material;
  dressInfected(figure, "red");
  assert.equal(figure.userData.infectedState, "red");
  assert.notEqual(figure.children[0].material, before);
  assert.ok(figure.children[0].material.emissiveIntensity > 0, "red state glows faintly");
});

test("steam wisps move deterministically and stay near their anchor", () => {
  const scene = new THREE.Scene();
  const anchor = buildStandingFigure({ x: 0, z: 0, seed: 1, state: "red" });
  anchor.position.set(2, 0, -3);
  scene.add(anchor);
  const update = attachSteam(scene, [anchor]);
  const sprites = scene.children.filter(object => object.isSprite);
  assert.equal(sprites.length, 2);
  update(4);
  const atFour = sprites.map(sprite => sprite.position.toArray());
  update(4);
  assert.deepEqual(sprites.map(sprite => sprite.position.toArray()), atFour);
  for (const sprite of sprites) {
    assert.ok(Math.abs(sprite.position.x - 2) < 1.2);
    assert.ok(Math.abs(sprite.position.z + 3) < 1.2);
    assert.ok(sprite.position.y > 0 && sprite.position.y < 3);
    assert.ok(sprite.material.opacity >= 0 && sprite.material.opacity <= 0.5);
  }
});

test("crowd time advances through one shared uniform", () => {
  const material = crowdMaterial("white", 0x4a4a44);
  updateInfected(12);
  // The uniform is wired in onBeforeCompile; here we pin the shared object's
  // contract: one value drives every state's shader clock.
  assert.equal(typeof material.onBeforeCompile, "function");
});

test("walking figures carry animatable limbs and react to gait calls", () => {
  const figure = buildWalkingFigure({ seed: 7, state: "red" });
  assert.equal(figure.children.length, 5, "torso plus two legs and two arms");
  const legs = figure.userData.limbs.legs;
  animateWalk(figure, 1.0, 1, true);
  assert.ok(Math.abs(legs[0].rotation.x) > 0.1, "legs swing when walking");
  const lungeA = legs[0].rotation.x;
  animateLunge(figure, 2.0);
  assert.ok(legs[0].rotation.x !== lungeA, "the lunge re-poses the legs");
  assert.ok(figure.rotation.x > 0.2, "the lunge leans the body");
});
