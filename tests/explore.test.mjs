import assert from "node:assert/strict";
import { test } from "node:test";
import * as THREE from "three";
import { exploreStep, flatBasis } from "../src/explore.js";

test("camera-flat right points +x when the camera looks down -z", () => {
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 1, 0);
  const { forward, right } = flatBasis(camera);
  assert.ok(forward.z < -0.9, `forward ${forward.toArray()}`);
  assert.ok(right.x > 0.9, `right ${right.toArray()}`);
});

test("running follows the camera and the +z face turns into the move", () => {
  const step = exploreStep(
    { x: 0, y: 0, z: 0, yaw: 0, flying: false },
    {
      forward: 1,
      strafe: 0,
      ascend: 0,
      sprint: false,
      flyToggle: false,
      lookY: -0.2,
      flatForward: { x: 0, z: -1 },
      flatRight: { x: 1, z: 0 },
    },
    1,
    () => 0,
  );
  assert.ok(step.z < -5, `moved ${step.z}`);
  assert.ok(Math.abs(step.x) < 0.05);
  assert.ok(Math.abs(step.yaw - Math.PI) < 0.02, `yaw ${step.yaw}`);
  assert.equal(step.motion, "walk");
  assert.equal(step.y, 0);
});

test("strafe uses the camera right and flying climbs with look and space", () => {
  const strafed = exploreStep(
    { x: 0, y: 0, z: 0, yaw: 0, flying: false },
    {
      forward: 0,
      strafe: 1,
      ascend: 0,
      sprint: false,
      flyToggle: false,
      lookY: 0,
      flatForward: { x: 0, z: -1 },
      flatRight: { x: 1, z: 0 },
    },
    1,
    () => 0,
  );
  assert.ok(strafed.x > 5);
  assert.ok(Math.abs(strafed.yaw - Math.PI / 2) < 0.02);

  const lifted = exploreStep(
    { x: 0, y: 1, z: 0, yaw: 0, flying: false },
    {
      forward: 1,
      strafe: 0,
      ascend: 1,
      sprint: false,
      flyToggle: true,
      lookY: 0.5,
      flatForward: { x: 0, z: -1 },
      flatRight: { x: 1, z: 0 },
    },
    1,
    () => 0,
  );
  assert.equal(lifted.flying, true);
  assert.ok(lifted.y > 5, `height ${lifted.y}`);
});

test("a blocked step slides instead of entering the obstacle", () => {
  const step = exploreStep(
    { x: 0, y: 0, z: 0, yaw: 0, flying: false },
    {
      forward: 1,
      strafe: 1,
      ascend: 0,
      sprint: false,
      flyToggle: false,
      lookY: 0,
      flatForward: { x: 0, z: -1 },
      flatRight: { x: 1, z: 0 },
    },
    1,
    () => 0,
    (x, z) => z < -0.2,
  );
  assert.ok(step.x > 1, "slides along x");
  assert.ok(step.z > -0.25, "does not cross the blocked z");
});
