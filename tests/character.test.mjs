import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { GARMENTS, PALETTES, HEADWEAR, OUTFITS, getOutfit } from "../src/wardrobe.js";
import { buildGarmentGeometry, GARMENT_BONES } from "../src/characterGarments.js";
import { createCharacterAnimator } from "../src/characterAnimation.js";
import { classifyAtlasPixel } from "../src/character.js";

test("clothing masks tint fabric and leather without recoloring warm skin", () => {
  assert.deepEqual(classifyAtlasPixel(44, 81, 82), [1, 0, 0]);
  assert.deepEqual(classifyAtlasPixel(23, 65, 123), [0, 1, 0]);
  assert.deepEqual(classifyAtlasPixel(30, 30, 30), [0, 0, 1]);
  assert.deepEqual(classifyAtlasPixel(199, 145, 120), [0, 0, 0]);
  assert.deepEqual(classifyAtlasPixel(220, 180, 153), [0, 0, 0]);
});

test("the wardrobe provides 320 unique usable combinations and rejects unknown IDs", () => {
  assert.equal(OUTFITS.length, 320);
  assert.equal(new Set(OUTFITS.map((outfit) => outfit.id)).size, 320);
  for (const outfit of OUTFITS) {
    assert.ok(GARMENTS.some((item) => item.id === outfit.garment));
    assert.ok(PALETTES.some((item) => item.id === outfit.palette));
    assert.ok(HEADWEAR.some((item) => item.id === outfit.headwear));
    assert.equal(getOutfit(outfit.id), outfit);
  }
  assert.throws(() => getOutfit("missing"), /Unknown outfit/);
});

test("every garment has finite geometry and normalized weights on valid bones", () => {
  for (const garment of GARMENTS) {
    for (const headwear of HEADWEAR) {
      for (const detail of ["hero", "crowd"]) {
        const pieces = buildGarmentGeometry(garment.id, headwear.id, detail);
        for (const geometry of Object.values(pieces)) {
          const { position, skinIndex, skinWeight } = geometry.attributes;
          assert.ok(position.count > 0);
          for (let i = 0; i < position.count; i++) {
            assert.ok(Number.isFinite(position.getX(i)) && Number.isFinite(position.getY(i)) && Number.isFinite(position.getZ(i)));
            let sum = 0;
            for (let component = 0; component < 4; component++) {
              sum += skinWeight.getComponent(i, component);
              assert.ok(skinIndex.getComponent(i, component) < GARMENT_BONES.length);
            }
            assert.ok(Math.abs(sum - 1) < 1e-6);
          }
          geometry.dispose();
        }
      }
    }
  }
});

test("animation changes real bones, stays independent, and returns to the rest pose", () => {
  const makeRig = () => {
    const root = new THREE.Group();
    for (const name of [...GARMENT_BONES, "shinL", "shinR", "foot_left", "foot_right", "neck"]) {
      const bone = new THREE.Bone();
      bone.name = name;
      root.add(bone);
    }
    return root;
  };
  const first = makeRig();
  const second = makeRig();
  const animation = createCharacterAnimator(first);
  animation.setMotion("walk");
  animation.update(0.2);
  assert.ok(first.getObjectByName("thigh_left").quaternion.angleTo(new THREE.Quaternion()) > 0.05);
  assert.equal(second.getObjectByName("thigh_left").quaternion.angleTo(new THREE.Quaternion()), 0);
  animation.setMotion("rest");
  animation.update(0.1);
  assert.ok(first.getObjectByName("thigh_left").quaternion.angleTo(new THREE.Quaternion()) < 1e-6);
  assert.throws(() => animation.setMotion("invalid"), /Unknown motion/);
  assert.throws(() => animation.update(NaN), /finite/);
  assert.throws(() => animation.update(-1), /nonnegative/);
});

test("animation is continuous frame to frame and deterministic (no flicker)", () => {
  const makeRig = () => {
    const root = new THREE.Group();
    const names = [...GARMENT_BONES, "spine", "head", "chest", "neck",
      "thigh_left", "thigh_right", "shinL", "shinR",
      "foot_left", "foot_right", "upper_arm_left", "upper_arm_right",
      "forearm_left", "forearm_right", "hand_left", "hand_right"];
    for (const name of names) {
      const bone = new THREE.Bone();
      bone.name = name;
      root.add(bone);
    }
    return root;
  };
  const snapshot = (rig) => {
    const poses = [];
    rig.traverse((bone) => {
      if (!bone.isBone) return;
      poses.push([bone.name, bone.quaternion.x, bone.quaternion.y, bone.quaternion.z, bone.quaternion.w]);
    });
    return poses;
  };
  for (const motion of ["idle", "walk", "wave"]) {
    const rig = makeRig();
    const animation = createCharacterAnimator(rig);
    animation.setMotion(motion);
    let previous = snapshot(rig);
    for (let frame = 1; frame <= 601; frame++) {
      animation.update(1 / 60);
      const current = snapshot(rig);
      let maxStep = 0;
      for (let i = 0; i < current.length; i++) {
        assert.ok(current[i].slice(1).every(Number.isFinite), `non-finite pose on frame ${frame} of ${motion}`);
        assert.equal(current[i][0], previous[i][0]);
        maxStep = Math.max(maxStep, new THREE.Quaternion(
          current[i][1] - previous[i][1], current[i][2] - previous[i][2],
          current[i][3] - previous[i][3], current[i][4] - previous[i][4]).length());
      }
      if (frame === 1) {
        assert.ok(maxStep < 2.2, `${motion} onset must stay within an authored pose offset, not a teleport (${maxStep.toFixed(3)} rad)`);
      } else {
        assert.ok(maxStep < 0.085, `${motion} jumps ${maxStep.toFixed(3)} rad between frames ${frame - 1} and ${frame}`);
      }
      previous = current;
    }
  }
  const first = makeRig();
  const second = makeRig();
  for (const rig of [first, second]) {
    const animation = createCharacterAnimator(rig);
    animation.setMotion("walk");
    for (let i = 0; i < 240; i++) animation.update(1 / 60);
  }
  const left = snapshot(first).map((pose) => pose.slice(1).join());
  const right = snapshot(second).map((pose) => pose.slice(1).join());
  assert.deepEqual(left, right, "identical frame sequences must produce identical poses");
  animationSnapBoundCheck(makeRig);
});

function animationSnapBoundCheck(makeRig) {
  const rig = makeRig();
  const animation = createCharacterAnimator(rig);
  animation.setMotion("walk");
  for (let i = 0; i < 180; i++) animation.update(1 / 60);
  const before = new THREE.Vector3().setFromEuler(
    new THREE.Euler().setFromQuaternion(rig.getObjectByName("thigh_left").quaternion));
  animation.setMotion("idle");
  animation.update(1 / 60);
  const after = new THREE.Vector3().setFromEuler(
    new THREE.Euler().setFromQuaternion(rig.getObjectByName("thigh_left").quaternion));
  assert.ok(before.distanceTo(after) < 0.6, "motion switches must stay within a blendable jump, not a full teleport");
}

test("the real FBX rig keeps garments in place at rest and deforms them during a wave", async () => {
  const manager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(manager);
  // Image decoding needs a browser; the actual FBX geometry and skeleton load here.
  textureLoader.load = () => new THREE.Texture();
  manager.addHandler(/\.png$/i, textureLoader);
  const file = await readFile(new URL("../assets/male_casual/male_casual.fbx", import.meta.url));
  const source = new FBXLoader(manager).parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), "");
  const model = clone(source);
  const bounds = new THREE.Box3().setFromObject(model);
  const scale = 1.5 / (bounds.max.y - bounds.min.y);
  model.scale.setScalar(scale);
  model.position.set(-(bounds.min.x + bounds.max.x) * scale / 2, -bounds.min.y * scale,
    -(bounds.min.z + bounds.max.z) * scale / 2);
  const root = new THREE.Group();
  root.add(model);
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(GARMENT_BONES.map((name) => model.getObjectByName(name)));
  const geometry = buildGarmentGeometry("classic-deel", "pointed").cloth;
  const mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial());
  mesh.bind(skeleton, new THREE.Matrix4());
  root.add(mesh);
  root.updateMatrixWorld(true);
  skeleton.update();
  const position = geometry.attributes.position;
  let sleeveVertex = -1;
  for (let i = 0; i < position.count; i++) {
    const original = new THREE.Vector3().fromBufferAttribute(position, i);
    assert.ok(mesh.applyBoneTransform(i, original.clone()).distanceTo(original) < 1e-6);
    if (original.x < -0.23 && original.y < 0.9) sleeveVertex = i;
  }
  assert.ok(sleeveVertex >= 0);
  const rest = new THREE.Vector3().fromBufferAttribute(position, sleeveVertex);
  const animation = createCharacterAnimator(model);
  animation.setMotion("wave");
  animation.update(0.1);
  root.updateMatrixWorld(true);
  skeleton.update();
  const waved = mesh.applyBoneTransform(sleeveVertex, rest.clone());
  assert.ok(waved.y > rest.y + 0.3, "sleeve rises with the raised arm");
  assert.equal(source.getObjectByName("upper_arm_right").quaternion.angleTo(
    model.getObjectByName("upper_arm_right").quaternion) > 0.1, true);
  root.position.set(4, 2, -3);
  root.updateMatrixWorld(true);
  skeleton.update();
  assert.ok(mesh.applyBoneTransform(sleeveVertex, rest.clone()).distanceTo(waved) < 1e-6,
    "placing a character in the town must not offset its clothes twice");
  geometry.dispose();
  mesh.material.dispose();
  skeleton.dispose();
});
