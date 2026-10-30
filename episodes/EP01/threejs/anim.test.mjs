import assert from 'node:assert/strict';
import { Bone, Group, Vector3 } from 'three';
import { PoseActor, ease, solveLimb } from './src/anim.js';
assert.equal(ease(-1),0); assert.equal(ease(2),1); assert.equal(ease(.5),.5);
const group=new Group(),upper=new Bone(),lower=new Bone(),hand=new Bone();
upper.name='upper';lower.name='lower';hand.name='hand';lower.position.y=1;hand.position.y=1;
group.add(upper);upper.add(lower);lower.add(hand);group.updateMatrixWorld(true);
solveLimb(upper,lower,hand,new Vector3(1,1,0),new Vector3(0,0,1));
assert.ok(hand.getWorldPosition(new Vector3()).distanceTo(new Vector3(1,1,0))<1e-5);
const actor=new PoseActor(group,7);actor.save('a');lower.rotateX(.5);actor.save('b');
actor.sample([{time:0,pose:'a'},{time:2,pose:'b'}],1);
const halfway=lower.quaternion.clone();actor.sample([{time:0,pose:'a'},{time:2,pose:'b'}],0);
actor.sample([{time:0,pose:'a'},{time:2,pose:'b'}],1);assert.ok(lower.quaternion.angleTo(halfway)<1e-7);
assert.ok(Math.abs(lower.quaternion.length()-1)<1e-8);
console.log('ANIM_OK: ease bounds, two-bone contact, repeatable seek, normalized quaternion');

// Exercise the real exported hierarchy without textures or a browser renderer.
const { readFile }=await import('node:fs/promises');
const { GLTFLoader }=await import('three/addons/loaders/GLTFLoader.js');
for(const id of ['ganaa','altan','party-guest-01','party-guest-02']){
  const bytes=await readFile(new URL(`../../../artifacts/episode-1-cast/${id}/character.glb`,import.meta.url));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
  const hierarchy={asset:json.asset,scenes:json.scenes,scene:json.scene,nodes:json.nodes.map(node=>{
    const {mesh,skin,camera,extensions,...rest}=node;return rest;
  }),skins:json.skins.map(skin=>({joints:skin.joints}))};
  const gltf=await new GLTFLoader().parseAsync(JSON.stringify(hierarchy),'');
  const actor=new PoseActor(gltf.scene,11);assert.equal(Object.keys(actor.bones).length,137);
  assert.ok(actor.bones['wrist.R'],'preserve original dotted joint names');
  actor.reset();const target=actor.point('wrist.R').add(new Vector3(0,.06,.03));
  actor.limb('R',target,new Vector3(-.6,.7,.3));
  assert.ok(actor.point('wrist.R').distanceTo(target)<1e-4);
  actor.save('reach');actor.reset();actor.save('rest');
  actor.sample([{time:0,pose:'rest'},{time:2,pose:'reach'}],2);
  assert.ok(actor.point('wrist.R').distanceTo(target)<1e-4);
  actor.life(.5,new Vector3(0,1,2));
  for(const bone of Object.values(actor.bones))assert.ok(Number.isFinite(bone.quaternion.length()));
  console.log('REAL_RIG_OK',id,'137 joints, contact error < 0.1 mm, pose restore, life finite');
}
