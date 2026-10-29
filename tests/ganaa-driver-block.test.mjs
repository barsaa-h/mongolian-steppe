import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import cab from '../assets/cast/cab.json' with {type:'json'};
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft driving block exports a seekable seated pose with wrists near the wheel', async () => {
 const url = new URL('../artifacts/episode-1-cast/ganaa-driver-study/character.glb', import.meta.url);
 const gltf = await readGeometryGLB('ganaa-study', url);
 const clip = gltf.animations.find(c => c.name === 'Driving_Block');
 assert.ok(clip, 'missing baked blocking clip');
 const mixer = new THREE.AnimationMixer(gltf.scene);
 mixer.clipAction(clip).play();
 const rise = Math.sqrt(cab.wheelRadius ** 2 - cab.gripX ** 2);
 const center = new THREE.Vector3(...cab.wheelCenter).sub(new THREE.Vector3(...cab.driverOrigin));
 function sample(time) {
  mixer.setTime(time);gltf.scene.updateMatrixWorld(true);
  return ['wristL', 'wristR'].map(name => gltf.scene.getObjectByName(name).getWorldPosition(new THREE.Vector3()));
 }
 const wrists = sample(.5);
 for (const [index, sign] of [1, -1].entries()) {
  const target = center.clone().add(new THREE.Vector3(sign * cab.gripX, rise * Math.cos(cab.wheelTilt), rise * Math.sin(cab.wheelTilt)));
  assert.ok(wrists[index].distanceTo(target) < .006, `wrist ${index} misses wheel target`);
 }
 sample(.1);
 for (const [index, position] of sample(.5).entries()) assert.ok(position.distanceTo(wrists[index]) < 1e-6);
});
