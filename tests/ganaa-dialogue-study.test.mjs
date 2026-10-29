import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import * as THREE from 'three';
import {CUES} from '../src/filmTimeline.js';
import {readGeometryGLB} from './helpers/glb.mjs';

test('draft text-timed face preserves technical talk and neutral, follows cues, and seeks deterministically', async () => {
  const folder = new URL('../artifacts/episode-1-cast/ganaa-dialogue-study/', import.meta.url);
  const details = JSON.parse(await readFile(new URL('dialogue-cues.json', folder)));
  assert.deepEqual(details.cues, CUES.filter(cue => cue.speaker === 'ГАНАА'));
  const gltf = await readGeometryGLB('dialogue-study', new URL('character.glb', folder));
  const clip = gltf.animations.find(action => action.name === 'Cheek_Block');
  const talk = gltf.animations.find(action => action.name === 'Talk_Check');
  assert.ok(clip && talk);
  assert.equal(clip.duration, 30);
  const meshes = ['BodySkin', 'Eyebrows', 'Teeth', 'Tongue'].map(name => {
    const mesh = gltf.scene.getObjectByName(name);
    assert.ok(mesh?.morphTargetDictionary, name);
    for (const shape of ['smile', 'frown', 'blink', 'viseme_A', 'viseme_E', 'viseme_O', 'viseme_M']) {
      assert.notEqual(mesh.morphTargetDictionary['EXP.' + shape], undefined, `${name} ${shape}`);
    }
    return mesh;
  });
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(clip).play();
  const mouth = mesh => ['A','E','O','M'].map(shape => mesh.morphTargetInfluences[mesh.morphTargetDictionary['EXP.viseme_' + shape]]);
  const sample = time => { mixer.setTime(time); return meshes.map(mouth); };
  for (const time of [0, 5, 14, 16.5, 29.5]) assert.ok(sample(time).every(weights => weights.every(value => Math.abs(value) < 1e-5)));
  for (const cue of details.cues) {
    let peak = 0;
    for (let time = cue.start; time < cue.end; time += 1/48) peak = Math.max(peak, ...sample(time)[0]);
    assert.ok(peak > .2, `no mouth movement for ${cue.text}`);
  }
  const impact = sample(22.15);
  assert.ok(meshes[0].morphTargetInfluences[meshes[0].morphTargetDictionary['EXP.blink']] > .5);
  assert.ok(meshes[0].morphTargetInfluences[meshes[0].morphTargetDictionary['EXP.frown']] > .3);
  sample(3); assert.deepEqual(sample(22.15), impact);
  mixer.stopAllAction();
  mixer.clipAction(talk).reset().play();
  mixer.setTime(.7);
  assert.ok(mouth(meshes[0]).some(value => value > .1), 'technical Talk_Check still animates the mouth');
});
