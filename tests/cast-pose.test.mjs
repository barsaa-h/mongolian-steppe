import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {readGeometryGLB} from './helpers/glb.mjs';
import {CAST} from '../src/cast.js';
import cab from '../assets/cast/cab.json' with {type:'json'};

test('all exported cast geometry has normalized valid skin weights and script-scale standing height',async()=>{
 for(const actor of CAST.filter(a=>a.kind!=='voice')){
  const {scene}=await readGeometryGLB(actor.id);
  scene.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(scene);
  assert.ok(Math.abs(box.max.y-box.min.y-actor.height)<.025,actor.id+' height');
  scene.traverse(mesh=>{
   if(!mesh.isSkinnedMesh)return;
   const weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex;
   for(let i=0;i<weights.count;i++){
    let sum=0;
    for(let j=0;j<4;j++){
     sum+=weights.getComponent(i,j);
     assert.ok(indices.getComponent(i,j)<mesh.skeleton.bones.length,actor.id+' bone index');
    }
    assert.ok(Math.abs(sum-1)<.002,`${actor.id} vertex ${i}: ${sum}`);
   }
  });
 }
});
test('the authored driver keeps both palms on the wheel and reaches his cheek, including after seeking',async()=>{
 const gltf=await readGeometryGLB('ganaa'); const mixer=new THREE.AnimationMixer(gltf.scene);
 const clip=gltf.animations.find(c=>c.name==='hour-five');assert.ok(Math.abs(clip.duration-30)<.001);
 const action=mixer.clipAction(clip).play();
 function point(name){return gltf.scene.getObjectByName(name).getWorldPosition(new THREE.Vector3());}
 function sample(t){action.reset().play();mixer.setTime(t);gltf.scene.updateMatrixWorld(true);}
 for(const t of [0,4,8,13,16,20,25,28,29.5]){
  sample(t);
  const rise=Math.sqrt(cab.wheelRadius**2-cab.gripX**2);
  const center=new THREE.Vector3(...cab.wheelCenter).sub(new THREE.Vector3(...cab.driverOrigin));
  for(const [name,sign] of [['grip-left',1],['grip-right',-1]]){
   const target=center.clone().add(new THREE.Vector3(sign*cab.gripX,rise*Math.cos(cab.wheelTilt),rise*Math.sin(cab.wheelTilt)));
   assert.ok(point(name).distanceTo(target)<.006,`${name} at ${t}: ${point(name).toArray()} target ${target.toArray()}`);
  }
 }
 sample(22.15);assert.ok(point('grip-right').distanceTo(point('cheek-contact'))<.012);
 const impact=point('grip-right');sample(4);sample(22.15);assert.ok(impact.distanceTo(point('grip-right'))<1e-6);
});

test('cast arm segments retain plausible proportions after source rig resizing',async()=>{
 for(const profile of CAST.filter(a=>a.kind!=='voice'&&a.kind!=='infant')){
  const {scene}=await readGeometryGLB(profile.id);scene.updateMatrixWorld(true);
  for(const side of ['left','right']){
   const upper=scene.getObjectByName(`upper_arm_${side}`).getWorldPosition(new THREE.Vector3());
   const elbow=scene.getObjectByName(`forearm_${side}`).getWorldPosition(new THREE.Vector3());
   const wrist=scene.getObjectByName(`hand_${side}`).getWorldPosition(new THREE.Vector3());
   const ratio=upper.distanceTo(elbow)/elbow.distanceTo(wrist);
   assert.ok(ratio>.6&&ratio<1.65,`${profile.id} ${side} arm ratio ${ratio}`);
  }
 }
});
