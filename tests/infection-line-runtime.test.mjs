import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {readGeometryGLB} from './helpers/glb.mjs';
import {loadCharacter} from '../src/character.js';

test('candidate line reveal clamps, seeks independently and disposes its own geometry', async () => {
  const original = GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync = async () => {
    const asset = await readGeometryGLB('ganaa', new URL('../assets/cast/candidates/ganaa/dna-v1.glb', import.meta.url));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 1,0,0, 0,1,0], 3));
    geometry.setIndex(Array.from({length: 180}, (_, i) => i % 3));
    const line = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    line.userData = {role: 'Story.InfectionLine', states: 'hour-five,turning', reveal_segments: 30};
    asset.scene.add(line);
    return asset;
  };
  try {
    const first = await loadCharacter({id: 'ganaa', assetVersion: 'dna-candidate'});
    const second = await loadCharacter({id: 'ganaa', assetVersion: 'dna-candidate'});
    const find = actor => { let line; actor.group.traverse(o => { if (o.userData.role === 'Story.InfectionLine') line = o; }); return line; };
    const a = find(first), b = find(second);
    assert.notEqual(a.geometry, b.geometry);
    assert.equal(a.geometry.drawRange.count, 0);
    first.setInfectionProgress(.5);
    assert.equal(a.geometry.drawRange.count, 90);
    assert.equal(b.geometry.drawRange.count, 0);
    first.setInfectionProgress(3);
    assert.equal(a.geometry.drawRange.count, 180);
    first.setInfectionProgress(-1);
    assert.equal(a.geometry.drawRange.count, 0);
    first.setInfectionProgress(.5);
    assert.equal(a.geometry.drawRange.count, 90);
    assert.throws(() => first.setInfectionProgress(NaN), /finite/);
    first.setStoryState('hour-five'); assert.equal(a.visible, true);
    first.setStoryState('healthy'); assert.equal(a.visible, false);
    let disposed = false; a.geometry.addEventListener('dispose', () => { disposed = true; });
    first.dispose(); assert.equal(disposed, true);
    second.setInfectionProgress(1); assert.equal(b.geometry.drawRange.count, 180);
    second.dispose();
  } finally { GLTFLoader.prototype.loadAsync = original; }
});
