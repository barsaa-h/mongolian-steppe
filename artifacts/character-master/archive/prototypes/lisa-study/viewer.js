import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ui = Object.fromEntries(['viewer', 'status', 'compare', 'solo', 'body', 'face', 'back', 'turntable', 'clip', 'play', 'time', 'time-label', 'lighting', 'pixels'].map(id => [id, document.getElementById(id)]));
const stage = ui.viewer.parentElement;
const renderer = new THREE.WebGLRenderer({ canvas: ui.viewer, antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0, 0);
const camera = new THREE.PerspectiveCamera(32, 1, .02, 30);
const controls = new OrbitControls(camera, ui.viewer);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = .22;
controls.maxDistance = 7;
controls.autoRotateSpeed = .7;
const subjects = [];
const scenes = [0, 1].map(() => {
  const scene = new THREE.Scene();
  const hemi = new THREE.HemisphereLight(0xe3eadb, 0x4f594d, 1.6);
  const key = new THREE.DirectionalLight(0xffecd5, 2.0);
  key.position.set(-2.5, 4, 4);
  const fill = new THREE.DirectionalLight(0xaec8df, .7);
  fill.position.set(3, 2, 2);
  const rim = new THREE.DirectionalLight(0xc1d6ce, 1.4);
  rim.position.set(1, 3, -3);
  scene.add(hemi, key, fill, rim);
  scene.userData.lights = { hemi, key, fill, rim };
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshLambertMaterial({ color: 0x24312a, transparent: true, opacity: .5 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.012;
  scene.add(floor);
  return scene;
});
let compare = true;
let playing = false;
let selected = -1;
let time = 0;
let duration = 1;
let loaded = false;

function resize() {
  const width = stage.clientWidth, height = stage.clientHeight;
  const scale = ui.pixels.checked ? Math.min(1, 360 / height) : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(1);
  renderer.setSize(Math.round(width * scale), Math.round(height * scale), false);
  ui.viewer.style.imageRendering = ui.pixels.checked ? 'pixelated' : 'auto';
  camera.aspect = width / (compare ? 2 : 1) / height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
ui.pixels.addEventListener('change', resize);

function frame(view = 'body') {
  const face = view === 'face';
  controls.target.set(0, face ? 1.52 : .9, 0);
  camera.position.set(face ? .025 : .45, face ? 1.54 : 1.02, (face ? .79 : 3.7) * (view === 'back' ? -1 : 1));
  controls.update();
  ui.body.setAttribute('aria-pressed', String(!face));
  ui.face.setAttribute('aria-pressed', String(face));
}
for (const view of ['body', 'face', 'back']) ui[view].addEventListener('click', () => frame(view));
for (const [id, value] of [['compare', true], ['solo', false]]) ui[id].addEventListener('click', () => {
  compare = value;
  stage.classList.toggle('compare', value);
  ui.compare.setAttribute('aria-pressed', String(value));
  ui.solo.setAttribute('aria-pressed', String(!value));
  resize();
});
ui.turntable.addEventListener('change', () => { controls.autoRotate = ui.turntable.checked; });
ui.lighting.addEventListener('change', () => {
  const cold = ui.lighting.value === 'corridor';
  for (const scene of scenes) {
    const { hemi, key, fill, rim } = scene.userData.lights;
    hemi.intensity = cold ? .55 : 1.6;
    key.intensity = cold ? 1.6 : 2;
    key.color.setHex(cold ? 0xabc9ce : 0xffecd5);
    key.position.set(cold ? .2 : -2.5, cold ? 5 : 4, cold ? .6 : 4);
    fill.intensity = cold ? .2 : .7;
    rim.intensity = cold ? .7 : 1.4;
  }
});

function setPlaying(value) {
  playing = value;
  ui.play.textContent = value ? 'Pause' : 'Play';
  ui.play.setAttribute('aria-pressed', String(value));
}
function pose(seconds) {
  time = seconds;
  for (const subject of subjects) {
    subject.mixer.setTime(seconds);
    subject.root.updateMatrixWorld(true);
  }
  ui.time.value = String(seconds);
  ui['time-label'].value = `${seconds.toFixed(2)} / ${duration.toFixed(2)} s`;
}
function selectClip(index) {
  selected = index;
  setPlaying(false);
  for (const subject of subjects) {
    subject.mixer.stopAllAction();
    if (index >= 0) subject.mixer.clipAction(subject.clips[index]).play();
  }
  duration = index < 0 ? 1 : Math.min(...subjects.map(subject => subject.clips[index].duration));
  ui.time.max = String(duration);
  ui.time.disabled = ui.play.disabled = index < 0;
  pose(0);
}
ui.clip.addEventListener('change', () => selectClip(Number(ui.clip.value)));
ui.play.addEventListener('click', () => setPlaying(!playing));
ui.time.addEventListener('input', () => { setPlaying(false); pose(ui.time.valueAsNumber); });

async function load() {
  const loader = new GLTFLoader();
  try {
    const files = await Promise.all([loader.loadAsync('./LISA-original.gltf'), loader.loadAsync('./night-shift.glb')]);
    files.forEach((gltf, index) => {
      gltf.scene.updateMatrixWorld(true);
      if (!index) gltf.scene.traverse(object => { if (object.isSkinnedMesh) object.pose(); });
      const root = new THREE.Group();
      root.name = index ? 'night-shift' : 'lisa-original';
      root.add(gltf.scene);
      if (!index) root.rotation.z = Math.PI;
      root.updateMatrixWorld(true);
      let bounds = new THREE.Box3().setFromObject(root);
      root.scale.setScalar(1.7 / bounds.getSize(new THREE.Vector3()).y);
      root.updateMatrixWorld(true);
      bounds = new THREE.Box3().setFromObject(root);
      const center = bounds.getCenter(new THREE.Vector3());
      root.position.set(-center.x, -bounds.min.y, -center.z);
      root.traverse(object => {
        if (!object.isMesh) return;
        object.frustumCulled = false;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          material.roughness = 1;
          material.metalness = 0;
        }
      });
      scenes[index].add(root);
      subjects.push({ root, mixer: new THREE.AnimationMixer(gltf.scene), clips: gltf.animations });
    });
    if (subjects.some(subject => subject.clips.length !== 18)) throw new Error('Expected 18 source clips in each model');
    subjects[0].clips.forEach((clip, index) => ui.clip.add(new Option(`Clip ${String(index + 1).padStart(2, '0')} · ${clip.duration.toFixed(2)} s`, String(index))));
    ui.clip.disabled = false;
    loaded = true;
    ui.status.textContent = 'Both models ready. Orbit or choose a source animation.';
    frame();
    selectClip(-1);
  } catch (error) {
    ui.status.classList.add('error');
    ui.status.textContent = `Could not load the study: ${error.message}`;
    const retry = document.createElement('button');
    retry.className = 'retry';
    retry.textContent = 'Reload study';
    retry.onclick = () => location.reload();
    ui.status.after(retry);
    console.error(error);
  }
}

frame();
resize();
load();
let last = performance.now();
renderer.setAnimationLoop(now => {
  const delta = Math.min((now - last) / 1000, .1);
  last = now;
  if (playing && selected >= 0) pose((time + delta) % duration);
  controls.update();
  const size = renderer.getSize(new THREE.Vector2());
  renderer.setScissorTest(true);
  const width = compare ? Math.floor(size.x / 2) : size.x;
  for (const index of compare ? [0, 1] : [1]) {
    const x = compare ? index * width : 0;
    renderer.setViewport(x, 0, width, size.y);
    renderer.setScissor(x, 0, width, size.y);
    renderer.render(scenes[index], camera);
  }
});
window.__lisaStudy = { scenes, subjects, selectClip, pose, frame, getState: () => ({ loaded, selected, time, duration, playing, compare }) };
