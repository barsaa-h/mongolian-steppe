import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import * as characters from '../src/character.js';
import {DNA_CAST, getCastMember} from '../src/cast.js';

const manifest = new URL('../assets/cast/dna/', import.meta.url);

test('every published DNA actor has a matching GLB, hash and supported kind', () => {
 const ids = Object.keys(DNA_CAST);
 assert.ok(ids.length >= 43, 'the EP01 v4.0 cast is published');
 for (const id of ids) {
  const entry = DNA_CAST[id];
  const file = new URL(entry.file, manifest);
  assert.equal(statSync(file).size, entry.bytes, `${id} size`);
  assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), entry.sha256, `${id} hash`);
  assert.ok(['adultMale', 'adultFemale', 'teenMale', 'teenFemale', 'child'].includes(entry.kind), `${id} kind`);
 }
});

test('roles that exist only in the DNA cast resolve, and DNA assets load at rest with EXP expressions', async () => {
 assert.equal(getCastMember('nyamka').name, DNA_CAST.nyamka.name);
 assert.throws(() => getCastMember('not-a-role'), /Unknown cast/);
 const {GLTFLoader} = await import('three/examples/jsm/loaders/GLTFLoader.js');
 const {readGeometryGLB} = await import('./helpers/glb.mjs');
 const original = GLTFLoader.prototype.loadAsync;
 const paths = [];
 GLTFLoader.prototype.loadAsync = url => {
  paths.push(url);
  const id = url.split('/').pop().replace('.glb', '');
  return readGeometryGLB(id, new URL(url.replace('assets/cast/dna/', ''), manifest));
 };
 try {
  for (const id of ['nyamka', 'party-guest-03', 'ganaa']) {
   const actor = await characters.loadCharacter({id, assetVersion: 'dna'});
   assert.equal(paths.at(-1), `assets/cast/dna/${id}.glb`);
   assert.ok(actor.motions.includes('rest') && actor.motions.includes('Talk_Check'));
   actor.setExpression('blink');
   actor.setExpression('neutral');
   actor.dispose();
  }
  await assert.rejects(() => characters.loadCharacter({id: 'oyun', assetVersion: 'dna'}), /asset version/);
 } finally {
  GLTFLoader.prototype.loadAsync = original;
 }
});
