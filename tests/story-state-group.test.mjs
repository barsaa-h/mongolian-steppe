import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {readGeometryGLB} from './helpers/glb.mjs';
import {loadCharacter} from '../src/character.js';

test('story visibility applies to multi-material group parents as well as meshes', async () => {
  const original = GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync = async () => {
    const gltf = await readGeometryGLB('ganaa', new URL('../assets/cast/candidates/ganaa/dna-v1.glb', import.meta.url));
    const rag = new THREE.Group();
    rag.name = 'MultiMaterialRag';
    rag.userData.states = 'hour-five,turning';
    rag.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()));
    gltf.scene.add(rag);
    return gltf;
  };
  try {
    const actor = await loadCharacter({id: 'ganaa', assetVersion: 'dna-candidate'});
    const rag = actor.group.getObjectByName('MultiMaterialRag');
    assert.equal(rag.visible, false);
    actor.setStoryState('hour-five'); assert.equal(rag.visible, true);
    actor.setStoryState('healthy'); assert.equal(rag.visible, false);
    actor.dispose();
  } finally { GLTFLoader.prototype.loadAsync = original; }
});
