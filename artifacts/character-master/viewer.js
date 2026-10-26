import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ui = Object.fromEntries(['viewer', 'name', 'facts', 'status', 'preset', 'full', 'face', 'hand', 'pose', 'rotate', 'wire', 'parts', 'blend', 'glb', 'recipe'].map(id => [id, document.getElementById(id)]));
const settings = JSON.parse(document.getElementById('viewer-config')?.textContent || '{}');
const stage = ui.viewer.parentElement;
const renderer = new THREE.WebGLRenderer({ canvas: ui.viewer, antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .01, 30);
const controls = new OrbitControls(camera, ui.viewer);
controls.enableDamping = true;
controls.minDistance = .12;
controls.maxDistance = 8;
controls.autoRotateSpeed = .7;
scene.add(new THREE.HemisphereLight(0xe3eadb, 0x424e40, 1.5));
for (const [color, intensity, position] of [[0xffecd5, 2, [-3, 5, 4]], [0xb2cddd, .7, [3, 2, 2]], [0xc7d8cb, 1.3, [1, 3, -3]]]) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
}
let actor;
let mixer;
let clip;
let animations=[];
let preset = settings.initial || 'default';
let loaded = false;
let testing = false;
let loading = 0;
let height = 1.7;
let localTime = 0;

function frame(view = 'full') {
  const head = actor?.getObjectByName('head');
  const wrist = actor?.getObjectByName('wristL') || actor?.getObjectByName('wrist.L');
  const point = new THREE.Vector3(0, height * .9, 0);
  if (view === 'face' && head) head.getWorldPosition(point).add(new THREE.Vector3(0, height * .015, 0));
  if (view === 'hand' && wrist) wrist.getWorldPosition(point).add(new THREE.Vector3(0, -height * .025, 0));
  if (view === 'full') {
    controls.target.set(0, height * .52, 0);
    camera.position.set(height * .52, height * .68, height * 2.1);
  } else {
    controls.target.copy(point);
    camera.position.copy(point).add(new THREE.Vector3(view === 'hand' ? height * .12 : height * .02, height * .01, height * (view === 'hand' ? .32 : .58)));
  }
  controls.update();
  for (const id of ['full', 'face', 'hand']) ui[id].setAttribute('aria-pressed', String(id === view));
}
function setTime(seconds) {
  if (!mixer) return;
  localTime = seconds;
  mixer.setTime(seconds);
  actor.updateMatrixWorld(true);
}
function setTest(value) {
  testing = value;
  ui.pose.textContent = value ? 'Rest pose' : 'Bend test';
  ui.pose.setAttribute('aria-pressed', String(value));
  if (!mixer || !clip) return;
  mixer.stopAllAction();
  if (value) mixer.clipAction(clip).play();
  setTime(0);
}
function setWire(value) {
  ui.wire.setAttribute('aria-pressed', String(value));
  actor?.traverse(object => {
    if (!object.isMesh) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.wireframe = value;
  });
}
function setExpression(name='neutral',weight=1) {
  if (!Number.isFinite(weight)||weight<0||weight>1) throw Error('Expression weight must be 0..1');
  setTest(false);
  let found=name==='neutral';
  actor?.traverse(object=>{
    if(!object.morphTargetDictionary)return;
    for(const [key,index] of Object.entries(object.morphTargetDictionary)){
      if(key.startsWith('EXP.'))object.morphTargetInfluences[index]=key===`EXP.${name}`?weight:0;
      if(key===`EXP.${name}`)found=true;
    }
  });
  if(!found)throw Error(`Unknown expression: ${name}`);
  actor?.updateMatrixWorld(true);
}
function setPerformance(value) {
  setExpression('neutral');
  if(value){
    const talk=animations.find(animation=>animation.name==='Talk_Check');
    if(!talk)throw Error('Missing Talk_Check animation');
    testing=true;mixer.clipAction(talk).reset().play();setTime(0);
  }
}
function release(root) {
  root.removeFromParent();
  const geometries = new Set(), materials = new Set(), textures = new Set(), skeletons = new Set();
  root.traverse(object => {
    if (!object.isMesh) return;
    geometries.add(object.geometry);
    if (object.skeleton) skeletons.add(object.skeleton);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const item of [...geometries, ...materials, ...textures, ...skeletons]) item.dispose();
}
async function select(id) {
  const request = ++loading;
  loaded = false;
  ui.status.textContent = `Loading ${id}…`;
  ui.status.classList.remove('error');
  try {
    const [gltf, report] = await Promise.all([
      new GLTFLoader().loadAsync(`./${id}/character.glb`),
      fetch(`./${id}/report.json`).then(response => { if (!response.ok) throw new Error(`Report: HTTP ${response.status}`); return response.json(); }),
    ]);
    if (request !== loading) { release(gltf.scene); return; }
    if(report.dnaHash){
      const identities=[];gltf.scene.traverse(object=>{if(object.userData.cast_id)identities.push(object.userData);});
      if(identities.length!==1||identities[0].cast_id!==id||identities[0].dna_hash!==report.dnaHash){
        release(gltf.scene);throw Error('Character DNA identity does not match its report');
      }
    }
    if (actor) { mixer.stopAllAction(); mixer.uncacheRoot(actor); release(actor); }
    actor = gltf.scene;
    height = report.bodyHeightM;
    preset = id;
    actor.traverse(object => {
      if (!object.isMesh) return;
      object.frustumCulled = false;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      }
    });
    scene.add(actor);
    actor.updateMatrixWorld(true);
    mixer = new THREE.AnimationMixer(actor);
    animations=gltf.animations;
    clip = gltf.animations.find(animation => animation.name === 'Deformation_Check');
    if (!clip) throw new Error('Missing deformation check animation');
    setTest(false);
    setWire(false);
    controls.autoRotate = false;
    ui.rotate.setAttribute('aria-pressed', 'false');
    ui.name.textContent = report.name;
    ui.facts.textContent = `${height.toFixed(2)} m · ${report.rigBones} bones · ${report.fingerBones} finger bones`;
    ui.parts.replaceChildren(...report.meshes.map(mesh => {
      const item = document.createElement('li');
      item.textContent = mesh.name;
      return item;
    }));
    for (const [link, file] of [['blend', 'Character-Master.blend'], ['glb', 'character.glb']]) ui[link].href = `./${id}/${file}`;
    ui.recipe.href = `./${settings.recipeFolder || 'presets'}/${id}.json`;
    ui.preset.value = id;
    loaded = true;
    frame();
    ui.status.textContent = 'Ready. Inspect the neck, hands and separate clothing objects.';
    loadDraft(id).catch(error => { ui.status.textContent = `Character ready. DNA sliders did not load: ${error.message}`; });
    document.dispatchEvent(new CustomEvent('character-loaded', { detail: { id, report } }));
  } catch (error) {
    if (request !== loading) return;
    ui.status.classList.add('error');
    ui.status.textContent = `Could not load ${id}: ${error.message}. Select an example to retry.`;
    console.error(error);
  }
}
for (const view of ['full', 'face', 'hand']) ui[view].addEventListener('click', () => frame(view));
ui.preset.addEventListener('change', () => select(ui.preset.value));
ui.pose.addEventListener('click', () => setTest(!testing));
ui.rotate.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  ui.rotate.setAttribute('aria-pressed', String(controls.autoRotate));
});
ui.wire.addEventListener('click', () => setWire(ui.wire.getAttribute('aria-pressed') !== 'true'));
new ResizeObserver(() => {
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  camera.aspect = stage.clientWidth / stage.clientHeight;
  camera.updateProjectionMatrix();
}).observe(stage);
let last = performance.now();
renderer.setAnimationLoop(now => {
  if (testing && clip) setTime((localTime + Math.min((now - last) / 1000, .1)) % clip.duration);
  last = now;
  controls.update();
  renderer.render(scene, camera);
});
const dnaFiles = { default: './default/character.json', male: './male/character.json', heavy: './heavy/character.json', 'slim-tall': './slim-tall/character.json', child: './child/character.json' };
let draft = null;
let draftBaseFace = {};
const sliderBox = document.getElementById('sliders');
const dnaLink = document.getElementById('dna-download');
const customizeNote = document.getElementById('customize-note');

function addSlider(parent, label, value, min, max, step, commit) {
  const row = document.createElement('label');
  row.textContent = label;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.style.width = '100%';
  input.addEventListener('input', () => commit(Number(input.value)));
  row.append(input);
  parent.append(row);
}
function applyDraft() {
  if (!draft || !actor) return;
  actor.traverse(object => {
    const dictionary = object.morphTargetDictionary;
    // FACE morphs are baked relative to this identity: a slider only adds the delta from the recipe value.
    if (dictionary && draft.face) {
      for (const [name, value] of Object.entries(draft.face)) {
        const base = draftBaseFace[name] || 0;
        const positive = dictionary[`FACE.${name}.pos`];
        const negative = dictionary[`FACE.${name}.neg`];
        if (positive !== undefined) object.morphTargetInfluences[positive] = Math.max(0, value - base);
        if (negative !== undefined) object.morphTargetInfluences[negative] = Math.max(0, base - value);
      }
    }
    if (!object.isMesh) return;
    const role = object.userData.role;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material?.color) continue;
      if (role === 'Body' || role === 'Hands.L' || role === 'Hands.R') material.color.setScalar(draft.skin_detail?.tone || draft.skin?.tone || 1);
      if (role === 'Eyebrows' && draft.brows?.color) material.color.set(draft.brows.color);
    }
  });
  if (dnaLink && draft) {
    const blob = new Blob([JSON.stringify(draft, null, 2) + '\n'], { type: 'application/json' });
    if (dnaLink.href.startsWith('blob:')) URL.revokeObjectURL(dnaLink.href);
    dnaLink.href = URL.createObjectURL(blob);
    dnaLink.download = `${draft.id || preset}.json`;
  }
}
function buildSliders(dna) {
  if (!sliderBox) return;
  sliderBox.replaceChildren();
  const groups = [
    ['Eyes', dna.eyes, { iris_scale: [.7, 1.3], pupil_size: [.6, 1.4], limbal_darkness: [0, 1], veins: [0, 1], catchlight: [0, 1], wetness: [0, 1], lash_density: [0, 1] }],
    ['Brows', dna.brows, { thickness: [.3, 1.5], head_thickness: [.4, 1.6], tail_thickness: [.2, 1.4], arch: [-1, 1], tail_length: [.7, 1.3], density: [0, 1], thickness_asymmetry: [-.25, .25] }],
    ['Skin', dna.skin_detail || dna.skin, { tone: [.7, 1.3], undertone: [-1, 1], ruddiness: [0, 1], pores: [0, 1], oiliness: [0, 1], age_lines: [0, 1], detail: [0, .3] }],
    ['Body', dna.body, { height_m: [.65, 2.3], weight: [0, 1], muscle: [0, 1], proportions: [0, 1], shoulders: [-1, 1], chest: [-1, 1], belly: [-1, 1], hips: [-1, 1] }],
  ];
  for (const [title, section, ranges] of groups) {
    if (!section) continue;
    const block = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = title;
    block.append(summary);
    for (const [key, range] of Object.entries(ranges)) {
      if (section[key] === undefined) continue;
      addSlider(block, key.replaceAll('_', ' '), section[key], range[0], range[1], range[1] - range[0] > 2 ? .01 : .01, value => {
        section[key] = value;
        applyDraft();
      });
    }
    sliderBox.append(block);
  }
  const face = document.createElement('details');
  const faceSummary = document.createElement('summary');
  faceSummary.textContent = 'Face';
  face.append(faceSummary);
  for (const [key, value] of Object.entries(dna.face || {})) {
    addSlider(face, key.replaceAll('_', ' '), value, -1, 1, .01, next => {
      dna.face[key] = next;
      applyDraft();
    });
  }
  sliderBox.append(face);
}
async function loadDraft(id) {
  draft = null;
  draftBaseFace = {};
  if (sliderBox) sliderBox.replaceChildren();
  const path = dnaFiles[id];
  if (!path) {
    if (customizeNote) customizeNote.textContent = 'This example has no editable recipe.';
    return;
  }
  const response = await fetch(path);
  if (!response.ok) throw new Error(`DNA: HTTP ${response.status}`);
  draft = await response.json();
  draftBaseFace = { ...(draft.face || {}) };
  buildSliders(draft);
  applyDraft();
  const live = actor?.getObjectByProperty?.('type', 'SkinnedMesh');
  let morphs = 0;
  actor?.traverse(object => { if (object.morphTargetDictionary) morphs += Object.keys(object.morphTargetDictionary).filter(name => name.startsWith('FACE.')).length; });
  if (customizeNote) customizeNote.textContent = morphs ? 'Face sliders update this view. Eye, brow and skin texture changes are in the downloaded DNA and need a rebuild.' : 'This GLB has no FACE morphs yet. Download the DNA and rebuild the base.';
}
window.__master = { scene, select, frame, setTime, setTest, setExpression, setPerformance, getActor: () => actor, getState: () => ({ loaded, preset, testing, localTime }), getDraft: () => draft, applyDraft };
frame();
select(preset);
