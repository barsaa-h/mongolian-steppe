import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as characters from '../src/character.js';
test('cast loading rejects unknown, voice-only and invalid detail before fetching',async()=>{
 assert.equal(typeof characters.loadCharacter,'function');
 await assert.rejects(()=>characters.loadCharacter({id:'missing'}),/Unknown cast/);
 await assert.rejects(()=>characters.loadCharacter({id:'radio'}),/voice/i);
 await assert.rejects(()=>characters.loadCharacter({id:'ganaa',detail:'cinema'}),/detail/);
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
