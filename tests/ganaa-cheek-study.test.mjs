import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft cheek block preserves duration, moves right hand and keeps left hand steady after seeking', async () => {
  const gltf = await readGeometryGLB('ganaa-cheek-study', new URL('../artifacts/episode-1-cast/ganaa-cheek-study/character.glb', import.meta.url));
  const clip = gltf.animations.find(c => c.name === 'Cheek_Block');
  assert.ok(clip);
  assert.ok(Math.abs(clip.duration - 30) < 1e-5);
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(clip).play();
  const point = name => {
    const bone = gltf.scene.getObjectByName(name);
    assert.ok(bone, name);
    return bone.getWorldPosition(new THREE.Vector3());
  };
  function sample(time) {
    mixer.setTime(time); gltf.scene.updateMatrixWorld(true);
    return {left: point('wristL'), right: point('wristR')};
  }
  const wheel = sample(20);
  const cheek = sample(22.15);
  assert.ok(cheek.right.distanceTo(wheel.right) > .15, 'right hand must leave the wheel');
  assert.ok(cheek.left.distanceTo(wheel.left) < 1e-5, 'left wrist must stay in its driving pose');
  const returned = sample(25);
  assert.ok(returned.right.distanceTo(wheel.right) < 1e-5, 'right wrist returns to its driving pose');
  sample(2); const again = sample(22.15);
  assert.ok(again.right.distanceTo(cheek.right) < 1e-6, 'out-of-order seeks must be deterministic');
});
