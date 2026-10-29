import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft shoulder corrective follows the cheek clip and resets on out-of-order seeks', async () => {
  const gltf = await readGeometryGLB('shoulder-study', new URL('../artifacts/episode-1-cast/ganaa-shoulder-study/character.glb', import.meta.url));
  const clip = gltf.animations.find(c => c.name === 'Cheek_Block');
  const top = gltf.scene.getObjectByName('ClothesTop');
  assert.ok(clip && top?.morphTargetDictionary);
  const index = top.morphTargetDictionary.ShoulderReach;
  assert.notEqual(index, undefined);
  assert.ok(clip.tracks.some(track => track.name === 'ClothesTop.morphTargetInfluences'));
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(clip).play();
  const sample = time => { mixer.setTime(time); return top.morphTargetInfluences[index]; };
  assert.equal(sample(20), 0);
  assert.equal(sample(21.5), 1);
  assert.equal(sample(23), 1);
  assert.ok(Math.abs(sample(24) - .5) < 1e-5);
  assert.equal(sample(25), 0);
  assert.equal(sample(21.5), 1);
});
