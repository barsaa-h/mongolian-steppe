import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadCharacter as loadCastCharacter, loadMongolianMan } from "./character.js";
import { CAST, getCastMember } from "./cast.js";
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

const ui = Object.fromEntries(["cast", "garment", "palette", "headwear", "motion", "expression", "detail", "status", "controls"]
  .map((id) => [id, document.getElementById(id)]));
for (const [id, items] of [["garment", GARMENTS], ["palette", PALETTES], ["headwear", HEADWEAR]]) {
  for (const item of items) ui[id].add(new Option(item.name, item.id));
}
const cast = CAST.filter(member => member.kind !== "voice");
for (const member of cast) ui.cast.add(new Option(member.name, member.id));
ui.cast.add(new Option("Legacy wardrobe · 320 outfits", "legacy"));
ui.cast.value = "ganaa";
document.getElementById("cast-count").textContent = `${cast.length} visible characters · ${CAST.length - cast.length} voice roles documented in the roster.`;
let outfitId = DEFAULT_OUTFIT;
let currentId = "ganaa";
let isLoading = true;
let faceView = false;
let performanceTime = 0;
let performancePlaying = true;
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
  if (currentId !== "legacy") return;
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
function displayProfile() {
  const legacy = currentId === "legacy";
  const profile = legacy ? null : character.profile;
  document.getElementById("wardrobe").hidden = !legacy;
  document.getElementById("expression-controls").hidden = legacy;
  document.getElementById("cast-name").textContent = legacy ? "Legacy wardrobe" : profile.name;
  document.getElementById("viewport-name").textContent = `${legacy ? "Legacy body" : profile.name} / character study`;
  document.getElementById("cast-facts").textContent = legacy
    ? "Original shared body · reusable wardrobe"
    : `${profile.age === null ? "Age unspecified" : profile.age === 0 ? "Newborn" : `Age ${profile.age}`} · Episode ${profile.episodes.join(", ")} · ${profile.height.toFixed(2)} m`;
  document.getElementById("cast-relationships").textContent = legacy ? "" : profile.relationships.map(value => {
    const [id, relationship] = value.split(":");
    const name = CAST.find(member => member.id === id)?.name
      || id.replaceAll("-", " ").replace(/^./, letter => letter.toUpperCase());
    return `${relationship.replaceAll("-", " ")} → ${name}`;
  }).join(" · ");
  document.getElementById("cast-behavior").textContent = legacy
    ? "Explore the original silhouette, palette, and headwear combinations."
    : profile.behavior;
  const motions = legacy ? ["idle", "walk", "wave", "rest"] : character.motions;
  for (const option of ui.motion.options) {
    option.disabled = !motions.includes(option.value) || (option.value === "hour-five" && currentId !== "ganaa");
    option.hidden = option.disabled;
  }
  if (ui.motion.selectedOptions[0].disabled) ui.motion.value = motions.includes("idle") ? "idle" : "rest";
  updatePerformanceControls();
}

async function loadSelectedCharacter() {
  const request = ++loading;
  const id = ui.cast.value;
  isLoading = true;
  ui.controls.disabled = true;
  document.getElementById("retry").hidden = true;
  ui.status.classList.remove("error");
  ui.status.textContent = `Loading ${id === "legacy" ? "Legacy wardrobe" : getCastMember(id).name}…`;
  try {
    const options = { rotationY: 0, detail: ui.detail.value };
    const loaded = id === "legacy"
      ? await loadMongolianMan({ ...options, outfit: outfitId })
      : await loadCastCharacter({ ...options, id });
    if (request !== loading) { loaded.dispose(); return; }
    character?.dispose();
    character = loaded;
    currentId = id;
    performanceTime = 0;
    performancePlaying = true;
    scene.add(character.group);
    displayProfile();
    character.setMotion(ui.motion.value);
    character.setExpression?.(ui.expression.value);
    focusFace(faceView);
    ui.status.textContent = `${ui.detail.value === "hero" ? "Main" : "Background"} character · ${loaded.info.textureWidth}px texture · ${loaded.info.rigBones} rig bones`;
  } catch (error) {
    if (request !== loading) return;
    const retry = document.getElementById("retry");
    retry.hidden = false;
    retry.onclick = () => { ui.cast.value = id; loadSelectedCharacter(); };
    console.error("Character could not load", error);
    ui.status.classList.add("error");
    ui.status.textContent = "Character could not load. Retry below, or choose another character.";
    if (character) {
      ui.cast.value = currentId;
      ui.detail.value = character.detail;
    }
  } finally {
    if (request === loading) {
      isLoading = false;
      ui.controls.disabled = !character;
    }
  }
}
ui.cast.addEventListener("change", loadSelectedCharacter);
ui.detail.addEventListener("change", loadSelectedCharacter);

function updatePerformanceControls() {
  const active = currentId === "ganaa" && ui.motion.value === "hour-five";
  document.getElementById("performance").hidden = !active;
  document.getElementById("performance-scrub").value = performanceTime;
  document.getElementById("performance-time").textContent = `${performanceTime.toFixed(2)} / 30.00 s`;
  const button = document.getElementById("performance-play");
  button.textContent = performancePlaying ? "Pause performance" : "Play performance";
  button.setAttribute("aria-pressed", String(performancePlaying));
}
ui.motion.addEventListener("change", () => {
  character?.setMotion(ui.motion.value);
  performanceTime = 0;
  performancePlaying = true;
  updatePerformanceControls();
  focusFace(faceView);
});
function setExpression(name) {
  if (currentId === "legacy") return;
  character?.setExpression(name);
  ui.expression.value = name;
}
ui.expression.addEventListener("change", () => setExpression(ui.expression.value));
function setPerformanceTime(seconds) {
  if (currentId === "legacy" || !character || isLoading) return;
  if (!Number.isFinite(seconds)) throw new Error("Performance time must be finite");
  const changedMotion = currentId === "ganaa" && character.motions.includes("hour-five") && ui.motion.value !== "hour-five";
  if (changedMotion) {
    ui.motion.value = "hour-five";
    character.setMotion("hour-five");
  }
  performanceTime = THREE.MathUtils.clamp(seconds, 0, currentId === "ganaa" ? 30 : Infinity);
  performancePlaying = false;
  character.setTime(performanceTime);
  if (changedMotion) focusFace(faceView);
  updatePerformanceControls();
}
document.getElementById("performance-scrub").addEventListener("input", event => setPerformanceTime(event.target.valueAsNumber));
document.getElementById("performance-play").addEventListener("click", () => {
  performancePlaying = !performancePlaying;
  updatePerformanceControls();
});

function focusFace(face) {
  faceView = face;
  controls.autoRotate = false;
  document.getElementById("rotate").setAttribute("aria-pressed", "false");
  const height = character?.profile?.height || 1.5;
  const faceHeight = character?.profile?.kind === "infant" ? 0.8 : 0.93;
  const seated = currentId === "ganaa" && ui.motion.value === "hour-five";
  const head = seated && character.group.getObjectByName("head");
  const headPoint = head ? head.getWorldPosition(new THREE.Vector3()) : null;
  controls.minDistance = height * 0.08;
  controls.maxDistance = height * 4;
  controls.target.set(0, height * (face ? faceHeight : 0.53), height * 0.01);
  camera.position.set(height * (face ? 0.01 : 0.42), height * (face ? faceHeight + 0.015 : 0.72), height * (face ? 0.39 : 1.9));
  if (headPoint) {
    controls.target.set(0, face ? headPoint.y + 0.09 : 0.45, headPoint.z);
    camera.position.set(face ? 0.025 : 0.7, face ? headPoint.y + 0.10 : 0.8, headPoint.z + (face ? 0.57 : 2.8));
  }
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
loadSelectedCharacter();

// Existing inspection hooks remain available to local scene tooling.
window.__character = {
  scene, camera,
  async select(id) {
    const canonical = id === "legacy" ? id : getCastMember(id).id;
    if (canonical !== "legacy" && !cast.some(member => member.id === canonical)) throw new Error("Voice roles have no character model");
    ui.cast.value = canonical;
    await loadSelectedCharacter();
  },
  setTime: setPerformanceTime,
  setExpression,
  orbit(yaw = 0, pitch = 0.14, zoom = 1) {
    const distance = (character?.profile?.height || 1.5) * 1.87 * zoom;
    camera.position.set(Math.sin(yaw) * distance, controls.target.y + Math.sin(pitch) * distance,
      Math.cos(yaw) * Math.cos(pitch) * distance);
    controls.update();
  },
  setAuto(value) { controls.autoRotate = value; },
  getState: () => ({ id: currentId, loaded: Boolean(character) && !isLoading,
    outfit: currentId === "legacy" ? outfitId : character?.profile?.outfit,
    detail: ui.detail.value, motion: ui.motion.value, expression: ui.expression.value,
    time: performanceTime, playing: performancePlaying }),
};
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (character && !isLoading) {
    if (currentId === "ganaa" && ui.motion.value === "hour-five") {
      if (performancePlaying) {
        performanceTime = (performanceTime + dt) % 30;
        character.setTime(performanceTime);
        updatePerformanceControls();
      }
    } else if (performancePlaying) character.update(dt);
  }
  controls.update();
  if (psx) pipeline.render();
  else {
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
