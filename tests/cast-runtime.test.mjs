import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as characters from '../src/character.js';
test('cast loading rejects unknown, voice-only and invalid detail before fetching',async()=>{
 assert.equal(typeof characters.loadCharacter,'function');
 await assert.rejects(()=>characters.loadCharacter({id:'missing'}),/Unknown cast/);
 await assert.rejects(()=>characters.loadCharacter({id:'radio'}),/voice/i);
 await assert.rejects(()=>characters.loadCharacter({id:'ganaa',detail:'cinema'}),/detail/);
 await assert.rejects(()=>characters.loadCharacter({id:'irina',assetVersion:'dna-candidate'}),/asset version/);
 await assert.rejects(()=>characters.loadCharacter({id:'ganaa',assetVersion:'unknown'}),/asset version/);
});

test('repeated absolute samples preserve authored expressions and manual override returns to the clip',async()=>{
 const {GLTFLoader}=await import('three/examples/jsm/loaders/GLTFLoader.js');
 const {readGeometryGLB}=await import('./helpers/glb.mjs');
 const original=GLTFLoader.prototype.loadAsync;
 GLTFLoader.prototype.loadAsync=()=>readGeometryGLB('ganaa');
 try{
  const actor=await characters.loadCharacter({id:'ganaa'});
  actor.setMotion('hour-five');
  function surface(actor){let mesh;actor.group.getObjectByName('ganaa-body').traverse(o=>{if(!mesh&&o.isMesh&&o.morphTargetDictionary?.fear!==undefined)mesh=o;});return mesh;}
  const body=surface(actor);
  const value=name=>body.morphTargetInfluences[body.morphTargetDictionary[name]];
  actor.setTime(18);const expected=[value('fear'),value('hunger')];
  assert.ok(expected[0]>0&&expected[1]>0);
  actor.setTime(18);assert.deepEqual([value('fear'),value('hunger')],expected);
  actor.setExpression('fear');assert.equal(value('fear'),1);
  actor.setExpression('neutral');assert.deepEqual([value('fear'),value('hunger')],expected);
  const second=await characters.loadCharacter({id:'ganaa'});
  second.setMotion('hour-five');second.setTime(25);
  const other=surface(second);
  assert.notEqual(other,body);assert.notEqual(other.skeleton,body.skeleton);
  assert.notDeepEqual(other.morphTargetInfluences,body.morphTargetInfluences);
  second.dispose();actor.setTime(18);assert.deepEqual([value('fear'),value('hunger')],expected);
  actor.dispose();
 }finally{GLTFLoader.prototype.loadAsync=original;}
});


test('the explicitly selected DNA candidate starts at rest and seeks facial tests independently',async()=>{
 const {GLTFLoader}=await import('three/examples/jsm/loaders/GLTFLoader.js');
 const {readGeometryGLB}=await import('./helpers/glb.mjs');
 const original=GLTFLoader.prototype.loadAsync;
 const paths=[];
 GLTFLoader.prototype.loadAsync=url=>{
  paths.push(url);
  return readGeometryGLB('ganaa',new URL('../assets/cast/candidates/ganaa/dna-v1.glb',import.meta.url));
 };
 try{
  const actor=await characters.loadCharacter({id:'ganaa',assetVersion:'dna-candidate'});
  assert.equal(paths[0], 'assets/cast/candidates/ganaa/dna-v1.glb');
  const bandage=actor.group.getObjectByName('StoryForearmBandage');
  assert.ok(bandage);
  assert.equal(bandage.visible,false,'healthy candidate hides bandage');
  actor.setStoryState('hour-five');actor.setTime(19);actor.setTime(0);assert.equal(bandage.visible,true);
  const second=await characters.loadCharacter({id:'ganaa',assetVersion:'dna-candidate'});
  assert.equal(second.group.getObjectByName('StoryForearmBandage').visible,false,'instances do not share state');
  actor.setStoryState('healthy');assert.equal(bandage.visible,false);
  assert.throws(()=>actor.setStoryState('imaginary'),/unavailable/i);
  second.dispose();
  assert.equal(actor.info.rigBones, 137);
  assert.ok(actor.motions.includes('rest'));
  assert.ok(actor.motions.includes('Talk_Check'));
  actor.setMotion('Talk_Check');actor.setTime(0.5);
  const first=[];actor.group.traverse(o=>{if(o.morphTargetInfluences)first.push([...o.morphTargetInfluences]);});
  actor.setTime(0.1);actor.setTime(0.5);
  const again=[];actor.group.traverse(o=>{if(o.morphTargetInfluences)again.push([...o.morphTargetInfluences]);});
  assert.deepEqual(again,first);
  actor.setMotion('rest');
  actor.setExpression('smile');
  const smiling=[];actor.group.traverse(o=>{if(o.morphTargetDictionary?.['EXP.smile']!==undefined)smiling.push(o.morphTargetInfluences[o.morphTargetDictionary['EXP.smile']]);});
  assert.ok(smiling.length>0 && smiling.every(value=>value===1));
  actor.setExpression('neutral');
  actor.group.traverse(o=>{if(o.morphTargetDictionary?.['EXP.smile']!==undefined)assert.equal(o.morphTargetInfluences[o.morphTargetDictionary['EXP.smile']],0);});
  assert.throws(()=>actor.setExpression('hunger'),/unavailable/i);
  actor.dispose();
 }finally{GLTFLoader.prototype.loadAsync=original;}
});
