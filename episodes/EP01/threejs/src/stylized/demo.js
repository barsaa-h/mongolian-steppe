// 12 s cue-only scene: Ganaa walks in, kneels, gives Altan the mitten, hides his left wrist.
// Tsetsegmaa watches from the table and speaks. Nothing here is hand-posed outside the cue files.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createLook } from '../look.js';
import { StylizedActor } from './actor.js';
import { applyCueSheet, blockingYaw, Stage } from './cues.js';

const manifest = await fetch(new URL('../../shots/DEMO.json', import.meta.url)).then(response => response.json());
const FPS = manifest.fps;
const totalFrames = Math.round(manifest.duration * FPS);
const W = 1920;
const H = 1080;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0908');
scene.fog = new THREE.FogExp2('#1b1511', 0.11);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
document.body.append(renderer.domElement);

const loader = new GLTFLoader();
const room = (await loader.loadAsync('/assets/maps/episode-1/glb/apartment.glb')).scene;
scene.add(room);
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const filtered = root => root.traverse(object => {
  if (!object.isMesh) return;
  object.castShadow = object.receiveShadow = true;
  object.frustumCulled = false;
  for (const material of [object.material].flat()) {
    if (!material) continue;
    for (const key of ['map', 'normalMap', 'roughnessMap']) {
      const texture = material[key];
      if (!texture) continue;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.anisotropy = maxAniso;
      texture.needsUpdate = true;
    }
  }
});
filtered(room);

const key = new THREE.PointLight('#ffc98f', 5.2, 9, 1);
key.position.set(2.2, 2.43, -2.65);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.bias = -0.0008;
scene.add(key);
scene.add(new THREE.HemisphereLight('#c9b79c', '#2a211b', 0.28));
const moon = new THREE.DirectionalLight('#6f8fc4', 0.5);
moon.position.set(8, 3, -1.5);
moon.target.position.set(1.4, 0.8, -2.2);
scene.add(moon, moon.target);
const candle = new THREE.PointLight('#ff9d47', 1.1, 3.5, 1);
candle.position.set(2.65, 1.05, -3.05);
scene.add(candle);

function mitten() {
  const group = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: '#8e1424', roughness: 1 });
  const cuff = new THREE.MeshStandardMaterial({ color: '#b9ae9e', roughness: 1 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.033, 0.04, 4, 8), red);
  body.position.y = 0.02;
  body.scale.set(1, 1, 0.58);
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.022, 3, 6), red);
  thumb.position.set(0.03, 0, 0);
  thumb.rotation.z = -0.6;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.03, 0.03, 10), cuff);
  band.position.y = -0.04;
  band.scale.z = 0.62;
  group.add(body, thumb, band);
  group.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = object.receiveShadow = true;
    object.frustumCulled = false;
  });
  return group;
}

const stage = new Stage();
const sheets = new Map();
for (const actorDef of manifest.actors) {
  const sheet = await fetch(new URL(`../../shots/${actorDef.sheet}`, import.meta.url)).then(response => response.json());
  sheets.set(actorDef.id, sheet);
  const gltf = await loader.loadAsync(`/assets/cast/${actorDef.id}.glb`);
  const group = gltf.scene;
  scene.add(group);
  filtered(group);
  const actor = new StylizedActor(group, {
    id: actorDef.id,
    clips: gltf.animations,
    home: { position: actorDef.home, yaw: blockingYaw(actorDef.home, actorDef.face, sheet) },
  });
  stage.addActor(actor);
  applyCueSheet(actor, sheet, stage);
}

const propDef = manifest.props[0];
const prop = mitten();
scene.add(prop);
stage.addProp(propDef.id, prop, { holder: propDef.holder, hand: propDef.hand, offset: propDef.offset });

// Sit the soles on the apartment floor. Measured once from the standing pose at t = 0.
for (const actor of stage.actors.values()) {
  actor.pose(0);
  const box = new THREE.Box3().setFromObject(actor.group);
  actor.ground = Number.isFinite(box.min.y) ? -box.min.y : 0;
}

const camera = new THREE.PerspectiveCamera(38, W / H, 0.03, 40);
const { composer, grade } = createLook(renderer, scene, camera, W, H);

function cameraAt(t) {
  let shot = manifest.cameras[0];
  for (const item of manifest.cameras) if (t >= item.t) shot = item;
  camera.position.set(shot.pos[0], shot.pos[1], shot.pos[2]);
  camera.fov = shot.fov;
  camera.updateProjectionMatrix();
  camera.lookAt(shot.look[0], shot.look[1], shot.look[2]);
}

function lineAt(t) {
  for (const sheet of sheets.values()) {
    for (const cue of sheet.cues) {
      if (cue.do !== 'say' || !cue.line) continue;
      if (t >= cue.t && t <= cue.t + (cue.dur ?? 1.2)) return cue.line;
    }
  }
  return '';
}

function frame(index) {
  const t = index / FPS;
  stage.pose(t);
  cameraAt(t);
  candle.intensity = 1.1 * (0.9 + 0.08 * Math.sin(t * 13.1) + 0.04 * Math.sin(t * 29.7));
  grade.uniforms.time.value = t;
  grade.uniforms.fade.value = 1;
  composer.render();
  renderer.getContext().finish();
  const line = document.querySelector('#line');
  if (line) line.textContent = lineAt(t);
  return { index, t };
}

function diagnostics() {
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const actors = {};
  for (const [id, actor] of stage.actors) actors[id] = actor.diagnostics.slice();
  return {
    renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    three: THREE.REVISION,
    totalFrames,
    fps: FPS,
    stills: manifest.stills,
    actors,
  };
}

window.stylized = {
  frame,
  totalFrames,
  fps: FPS,
  png: () => renderer.domElement.toDataURL('image/png').split(',')[1],
  diagnostics,
};
frame(0);
document.querySelector('#status')?.remove();
window.ready = true;
if (!new URLSearchParams(location.search).has('capture')) {
  const t0 = performance.now();
  renderer.setAnimationLoop(() => frame(Math.floor(((performance.now() - t0) / 1000) * FPS) % totalFrames));
}
