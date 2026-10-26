import assert from "node:assert/strict";
import { test } from "node:test";
import * as THREE from "three";
import { buildKamaz } from "../src/winter.js";
import { createPipeline } from "../src/psx.js";
import { placeTown } from "../src/district.js";
import { buildWorld, worldState } from "../src/world.js";

// Canvas drawing is exercised in the browser; these checks inspect placement and render settings.
const gradient = { addColorStop() {} };
const context = new Proxy({}, {
  get(_, key) {
    if (key === "measureText") return text => ({ width: text.length * 10 });
    if (key === "createLinearGradient" || key === "createRadialGradient") return () => gradient;
    return () => {};
  },
});
globalThis.document = { createElement: () => ({ getContext: () => context }) };

test("the map keeps a 720-line antialiased image across viewport shapes", () => {
  const calls = [];
  const renderer = { setSize: (...args) => calls.push(args) };
  const { target, setSize } = createPipeline(renderer, new THREE.Scene(), new THREE.Camera());
  for (const [width, height] of [[1440, 900], [900, 1440]]) {
    setSize(width, height);
    assert.equal(target.height, 720);
    assert.equal(target.width, Math.round(720 * width / height));
    assert.deepEqual(calls.at(-1), [width, height, false]);
  }
  assert.equal(target.samples, 4);
  assert.equal(target.texture.minFilter, THREE.LinearFilter);
  assert.equal(target.texture.magFilter, THREE.LinearFilter);
  target.dispose();
});

test("every khashaa entrance crosses the street drainage and keeps its path clear", () => {
  const scene = new THREE.Scene();
  placeTown(scene);
  const yards = scene.children.filter(object => object.name.startsWith("khashaa-"));
  assert.equal(yards.length, 49);
  assert.equal(scene.children.filter(object => object.name === "street-drain").length, 10);
  for (const yard of yards) {
    const crossing = yard.getObjectByName("drain-crossing");
    const entry = yard.getObjectByName("yard-entrance");
    assert.ok(crossing && entry, yard.name);
    assert.equal(crossing.position.x, 0);
    assert.ok(Math.abs(crossing.position.z - entry.position.z) < 3);
    assert.ok(crossing.position.y > 0.065, "footbridge sits above the drain");
    for (const object of yard.children.filter(object => object.name.startsWith("winter-fuel-"))) {
      assert.ok(Math.abs(object.position.x) > 4, "fuel stays beside the entrance");
    }
  }
  const count = name => {
    let found = 0;
    scene.traverse(object => { if (object.name === name) found++; });
    return found;
  };
  assert.ok(count("fence-repair") > 0 && count("fence-repair") < yards.length);
  assert.ok(count("sheltered-frost") > 0 && count("sheltered-frost") < yards.length / 5);
  assert.ok(count("balcony-storage") > 0);
  assert.equal(count("entrance-light"), 7);
  assert.equal(count("utility-meter"), 7);
});


test("restored clouds keep their color and deterministic motion through the day cycle", () => {
  const world = buildWorld();
  const clouds = world.scene.children.filter(object => object.name === "autumn-cloud");
  assert.equal(clouds.length, 8);
  const state = worldState(0.36);
  world.apply(state, 0.36);
  const positions = clouds.map(cloud => cloud.position.toArray());
  world.apply(worldState(0), 0);
  world.apply(state, 0.36);
  assert.deepEqual(clouds.map(cloud => cloud.position.toArray()), positions);
  assert.ok(state.hemiGround.r > state.hemiGround.b, "daylight reflects warm autumn ground");
  for (const cloud of clouds) {
    for (const plane of cloud.children) assert.ok(plane.material.color.equals(state.cloudColor));
  }
});

test("the KamAZ cab has interior space above the seat rather than a solid body block", () => {
  const truck=buildKamaz();truck.updateMatrixWorld(true);
  const ray=new THREE.Raycaster(new THREE.Vector3(.65,2.7,2.55),new THREE.Vector3(0,-1,0));
  const hit=ray.intersectObject(truck,true)[0];
  assert.ok(hit && Math.abs(hit.point.y-1.93)<.001,`seat hit at ${hit?.point.y}`);
});
