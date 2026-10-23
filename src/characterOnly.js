import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadMongolianMan } from "./character.js";
import { createPipeline } from "./psx.js";
import { DEFAULT_OUTFIT, GARMENTS, PALETTES, HEADWEAR, OUTFITS, getOutfit } from "./wardrobe.js";

const canvas = document.getElementById("game");
const viewport = document.getElementById("viewport");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x11151b);
const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 40);
const pipeline = createPipeline(renderer, scene, camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.24;
controls.maxDistance = 6;
controls.maxPolarAngle = Math.PI * 0.52;
controls.autoRotateSpeed = 1;

scene.add(new THREE.HemisphereLight(0xdbe4f2, 0x77726b, 2));
const key = new THREE.DirectionalLight(0xffe6cf, 3.4);
key.position.set(2.5, 4, 4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = key.shadow.camera.bottom = -2.5;
key.shadow.camera.right = key.shadow.camera.top = 2.5;
key.shadow.camera.near = 0.1;
key.shadow.camera.far = 12;
key.shadow.normalBias = 0.015;
scene.add(key);
const rim = new THREE.DirectionalLight(0xb6cae8, 2.3);
rim.position.set(-3, 3, -2);
scene.add(rim);
const fill = new THREE.DirectionalLight(0xd5dfea, 0.8);
fill.position.set(-3, 1.5, 3);
scene.add(fill);
const ground = new THREE.Mesh(new THREE.CircleGeometry(3.5, 64),
  new THREE.MeshStandardMaterial({ color: 0x282e36, roughness: 0.95 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.008;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(6, 24, 0x444c57, 0x343c46);
grid.position.y = -0.005;
grid.material.transparent = true;
grid.material.opacity = 0.28;
scene.add(grid);

const ui = Object.fromEntries(["garment", "palette", "headwear", "motion", "detail", "status", "controls"]
  .map((id) => [id, document.getElementById(id)]));
for (const [id, items] of [["garment", GARMENTS], ["palette", PALETTES], ["headwear", HEADWEAR]]) {
  for (const item of items) ui[id].add(new Option(item.name, item.id));
}
let outfitId = DEFAULT_OUTFIT;
let character;
let loading = 0;
let psx = false;

function displayOutfit() {
  const outfit = getOutfit(outfitId);
  for (const key of ["garment", "palette", "headwear"]) ui[key].value = outfit[key];
  document.getElementById("outfit-name").textContent = outfit.name;
  document.getElementById("outfit-number").textContent = `Outfit ${OUTFITS.indexOf(outfit) + 1} / ${OUTFITS.length}`;
}
function chooseOutfit(id) {
  character?.setOutfit(id);
  outfitId = id;
  displayOutfit();
}
for (const id of ["garment", "palette", "headwear"]) {
  ui[id].addEventListener("change", () => {
    chooseOutfit(`${ui.garment.value}/${ui.palette.value}/${ui.headwear.value}`);
  });
}
for (const [id, step] of [["previous", -1], ["next", 1]]) {
  document.getElementById(id).addEventListener("click", () => {
    const index = OUTFITS.findIndex((outfit) => outfit.id === outfitId);
    chooseOutfit(OUTFITS[(index + step + OUTFITS.length) % OUTFITS.length].id);
  });
}
async function loadCharacter() {
  const request = ++loading;
  ui.controls.disabled = true;
  ui.status.classList.remove("error");
  ui.status.textContent = "Loading character…";
  try {
    const loaded = await loadMongolianMan({ rotationY: 0, outfit: outfitId, detail: ui.detail.value });
    if (request !== loading) { loaded.dispose(); return; }
    character?.dispose();
    character = loaded;
    scene.add(character.group);
    character.setMotion(ui.motion.value);
    ui.status.textContent = `${ui.detail.value === "hero" ? "Refined" : "Compact"} texture · ${loaded.info.textureWidth}px · clothing follows the rig`;
  } catch (error) {
    console.error("Character could not load", error);
    ui.status.classList.add("error");
    ui.status.textContent = "Character could not load. Check the server and asset files, then reload.";
    if (character) ui.detail.value = character.detail;
  } finally {
    if (request === loading) ui.controls.disabled = !character;
  }
}
ui.detail.addEventListener("change", loadCharacter);
ui.motion.addEventListener("change", () => character?.setMotion(ui.motion.value));

function focusFace(face) {
  controls.autoRotate = false;
  document.getElementById("rotate").setAttribute("aria-pressed", "false");
  controls.target.set(0, face ? 1.405 : 0.83, 0.015);
  camera.position.set(face ? 0.015 : 0.65, face ? 1.425 : 1.1, face ? 0.59 : 2.9);
  controls.update();
  document.getElementById("face-view").setAttribute("aria-pressed", String(face));
  document.getElementById("full-view").setAttribute("aria-pressed", String(!face));
}
document.getElementById("face-view").addEventListener("click", () => focusFace(true));
document.getElementById("full-view").addEventListener("click", () => focusFace(false));
document.getElementById("rotate").addEventListener("click", (event) => {
  controls.autoRotate = !controls.autoRotate;
  event.currentTarget.setAttribute("aria-pressed", String(controls.autoRotate));
});
document.getElementById("render-style").addEventListener("click", (event) => {
  psx = !psx;
  event.currentTarget.setAttribute("aria-pressed", String(psx));
  document.getElementById("view-label").textContent = psx ? "PSX scene preview" : "Full-resolution studio";
});
document.getElementById("export").addEventListener("click", () => {
  const outfit = getOutfit(outfitId);
  const data = { version: 1, model: "male_casual", outfit: outfit.id, detail: ui.detail.value, motion: ui.motion.value };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${outfit.id.replaceAll("/", "-")}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
function resize() {
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  pipeline.setSize(width, height);
}
new ResizeObserver(resize).observe(viewport);
resize();
focusFace(false);
displayOutfit();
loadCharacter();

// Existing inspection hooks remain available to local scene tooling.
window.__character = {
  scene, camera,
  orbit(yaw = 0, pitch = 0.14, zoom = 1) {
    camera.position.set(Math.sin(yaw) * 2.8 * zoom, controls.target.y + Math.sin(pitch) * 2.8 * zoom,
      Math.cos(yaw) * Math.cos(pitch) * 2.8 * zoom);
    controls.update();
  },
  setAuto(value) { controls.autoRotate = value; },
  getState: () => ({ loaded: Boolean(character), outfit: outfitId, detail: ui.detail.value, motion: ui.motion.value }),
};
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  character?.update(dt);
  controls.update();
  if (psx) pipeline.render();
  else {
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
