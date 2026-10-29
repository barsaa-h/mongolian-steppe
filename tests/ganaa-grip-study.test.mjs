import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import cab from '../assets/cast/cab.json' with {type:'json'};
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft grip has sampled hand surfaces close to the wheel without deep vertex penetration', async () => {
 const url = new URL('../artifacts/episode-1-cast/ganaa-grip-study/character.glb', import.meta.url);
 const gltf = await readGeometryGLB('ganaa-grip', url);
 const clip = gltf.animations.find(c => c.name === 'Driving_Block');
 assert.ok(clip);
 const mixer = new THREE.AnimationMixer(gltf.scene);
 mixer.clipAction(clip).play();mixer.setTime(.5);gltf.scene.updateMatrixWorld(true);
 const center = new THREE.Vector3(...cab.wheelCenter).sub(new THREE.Vector3(...cab.driverOrigin));
 const normal = new THREE.Vector3(0, -Math.sin(cab.wheelTilt), Math.cos(cab.wheelTilt));
 for (const name of ['HandsL', 'HandsR']) {
  const mesh = gltf.scene.getObjectByName(name);
  assert.ok(mesh?.isSkinnedMesh, name);
  let minimum=Infinity, closest=Infinity;
  const point=new THREE.Vector3();
  for(let i=0;i<mesh.geometry.attributes.position.count;i++) {
   mesh.getVertexPosition(i,point);mesh.localToWorld(point);point.sub(center);
   const axial=point.dot(normal), radial=Math.sqrt(Math.max(0,point.lengthSq()-axial*axial));
   const distance=Math.hypot(radial-cab.wheelRadius,axial)-.025;
   minimum=Math.min(minimum,distance);closest=Math.min(closest,Math.abs(distance));
  }
  assert.ok(minimum >= -.001, `${name}: vertex penetrates ${-minimum}m`);
  assert.ok(closest < .006, `${name}: closest sampled vertex is ${closest}m from rim`);
 }
});


test('body and facial attachments retain the additive expression shapes', async () => {
 const url = new URL('../artifacts/episode-1-cast/ganaa-grip-study/character.glb', import.meta.url);
 const {scene} = await readGeometryGLB('ganaa-expression-check', url);
 for (const name of ['BodySkin', 'Eyebrows', 'Teeth', 'Tongue']) {
  const mesh = scene.getObjectByName(name);
  assert.ok(mesh?.morphTargetDictionary, `${name} has no expression targets`);
  for (const expression of ['smile', 'frown', 'blink', 'viseme_A', 'viseme_E', 'viseme_O', 'viseme_M']) {
   assert.notEqual(mesh.morphTargetDictionary['EXP.' + expression], undefined, `${name}: ${expression}`);
  }
 }
});
