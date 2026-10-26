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
window.__master = { scene, select, frame, setTime, setTest, setExpression, setPerformance, getActor: () => actor, getState: () => ({ loaded, preset, testing, localTime }) };
frame();
select(preset);
