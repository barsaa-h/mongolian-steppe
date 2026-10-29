import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft cuff stays skinned and preserves the shoulder animation after export', async () => {
  const gltf = await readGeometryGLB('cuff-study', new URL('../artifacts/episode-1-cast/ganaa-cuff-study/character.glb', import.meta.url));
  let cuff;
  gltf.scene.traverse(object => { if (object.userData.role === 'Clothes.RolledCuff') cuff = object; });
  assert.ok(cuff?.isSkinnedMesh && cuff.userData.edge_vertices > 2);
  const weights = cuff.geometry.attributes.skinWeight;
  for (let i = 0; i < weights.count; i++) {
    let sum = 0;
    for (let j = 0; j < 4; j++) sum += weights.getComponent(i, j);
    assert.ok(Math.abs(sum - 1) < .002, `cuff vertex ${i}: ${sum}`);
  }
  const clip = gltf.animations.find(c => c.name === 'Cheek_Block');
  const top = gltf.scene.getObjectByName('ClothesTop');
  assert.ok(clip && top?.morphTargetDictionary?.ShoulderReach !== undefined);
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(clip).play();
  const value = time => { mixer.setTime(time); return top.morphTargetInfluences[top.morphTargetDictionary.ShoulderReach]; };
  assert.equal(value(20), 0);
  assert.equal(value(23), 1);
  assert.equal(value(25), 0);
  assert.equal(value(23), 1);
});
