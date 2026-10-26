import * as THREE from "three";
import cabLayout from "../assets/cast/cab.json" with { type: "json" };
import { buildWorld, worldState } from "./world.js";
import { approachCurve, positionKamaz } from "./winter.js";
import { terrainHeight } from "./terrain.js";
import { buildSheep } from "./parts.js";
import { loadCharacter } from "./character.js";
import { createPipeline } from "./psx.js";
import { DURATION, filmState } from "./filmTimeline.js";
import { createSoundtrack } from "./filmSound.js";

const renderMode = new URLSearchParams(location.search).has("render");
document.body.classList.toggle("render", renderMode);
const canvas = document.getElementById("film");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.04, 2000);
const { scene, apply } = buildWorld();
const pipeline = createPipeline(renderer, scene, camera);
const dusk = worldState(0.71);
const road = approachCurve();
const truck = scene.getObjectByName("ganaa-kamaz");
const crossing = road.getPointAt(0.593);
const heading = road.getTangentAt(0.593);
const right = new THREE.Vector3(heading.z, 0, -heading.x);
const flock = [];
for (let i = 0; i < 6; i++) {
  const sheep = buildSheep();
  sheep.scale.setScalar(0.86 + i % 3 * 0.08);
  sheep.traverse(object => { if (object.isMesh) object.castShadow = object.receiveShadow = true; });
  scene.add(sheep);
  flock.push(sheep);
}

for (const side of [-1, 1]) {
  const light = new THREE.SpotLight(0xffd3a0, 10, 27, 0.34, 0.75, 1.2);
  light.position.set(side, 1.7, 3.6);
  light.target.position.set(side, -0.5, 22);
  truck.add(light, light.target);
}

const exhaust = [];
for (let i = 0; i < 8; i++) {
  const puff = new THREE.Mesh(new THREE.SphereGeometry(0.13, 5, 4),
    new THREE.MeshBasicMaterial({ color: 0xb0b6c2, transparent: true, opacity: 0.1, depthWrite: false }));
  truck.add(puff);
  exhaust.push(puff);
}

let driver;
const localPoint = new THREE.Vector3();
const target = new THREE.Vector3();
let time = 0;
let playing = false;
let ready = false;
let previous = performance.now();
let audioContext, audioBuffer, audioSource;

const playButton = document.getElementById("play");
const replayButton = document.getElementById("replay");
const scrub = document.getElementById("scrub");
const speaker = document.getElementById("speaker");
const subtitle = document.getElementById("subtitle");
const locationCard = document.getElementById("location");
const endTitle = document.getElementById("endTitle");
const shade = document.getElementById("shade");

function truckPoint(x, y, z, result) {
  return result.set(x, y, z).applyMatrix4(truck.matrixWorld);
}

function renderAt(seconds) {
  if (!ready) return;
  const state = filmState(seconds);
  time = state.time;
  apply(dusk, 0.26 + time / 300);
  positionKamaz(truck, road, state.truckU);
  const moving = time < 15 || time > 28;
  if (moving) truck.position.y += Math.sin(time * 19) * 0.012;
  truck.updateMatrixWorld(true);
  for (const wheel of truck.userData.wheels) wheel.rotation.x = -state.truckU * road.getLength() / 0.68;
  driver.setTime(time);

  for (let i = 0; i < flock.length; i++) {
    const walk = THREE.MathUtils.clamp((time - 12.8 - i * 0.4) / 10, 0, 1);
    const offset = -7.5 + walk * 15;
    const x = crossing.x + right.x * offset + heading.x * (i % 3 - 1) * 1.2;
    const z = crossing.z + right.z * offset + heading.z * (i % 3 - 1) * 1.2;
    const sheep = flock[i];
    sheep.position.set(x, terrainHeight(x, z), z);
    sheep.rotation.y = Math.atan2(-right.z, right.x);
    sheep.children[0].position.y = 0.66 + (walk > 0 && walk < 1 ? Math.sin(time * 10 + i) * 0.025 : 0);
    for (let leg = 0; leg < 4; leg++) sheep.children[leg + 4].rotation.z = walk > 0 && walk < 1 ? Math.sin(time * 10 + leg * Math.PI + i) * 0.25 : 0;
  }
  exhaust.forEach((puff, i) => {
    const phase = (time * 0.55 + i / exhaust.length) % 1;
    puff.position.set(1.25 + phase * 0.7, 0.9 + phase * 0.55, -2 - phase * 1.5);
    puff.scale.setScalar(0.4 + phase * 2);
    puff.material.opacity = (1 - phase) * 0.16;
  });

  const p = state.shotProgress;
  switch (state.shot.id) {
    case "valley":
      camera.position.set(-220 + p * 9, 18 - p, 100 - p * 5);
      truckPoint(0, 2.7, 7, target);
      break;
    case "wrist":
      truckPoint(0.84, 2.49, 3.28, camera.position);
      truckPoint(0.86, 2.28, 2.94, target);
      break;
    case "tracking":
      truckPoint(-0.02, 2.72, 3.27, camera.position);
      truckPoint(0.65, 2.50, 2.84, target);
      break;
    case "ganaa":
      truckPoint(-0.02 + p * 0.03, 2.72, 3.27, camera.position);
      truckPoint(0.65, 2.50, 2.84, target);
      break;
    case "crossing":
      camera.position.set(crossing.x - right.x * 9 + heading.x * 18, terrainHeight(crossing.x, crossing.z) + 4.5,
        crossing.z - right.z * 9 + heading.z * 18);
      target.set(crossing.x - heading.x * 4, terrainHeight(crossing.x, crossing.z) + 1.8, crossing.z - heading.z * 4);
      break;
    case "sheep":
      truckPoint(0.65, 3.1, 3.4, camera.position);
      target.set(crossing.x + right.x * p * 2, terrainHeight(crossing.x, crossing.z) + 0.7, crossing.z + right.z * p * 2);
      break;
    case "hunger":
      truckPoint(-0.02, 2.69, 3.27, camera.position);
      truckPoint(0.65, 2.49, 2.85, target);
      break;
    case "resolve":
      truckPoint(-0.02 - p * 0.02, 2.70, 3.27, camera.position);
      truckPoint(0.65, 2.50, 2.85, target);
      break;
    case "home":
      camera.position.set(-185 + p * 3, 13 + p, 40 - p * 3);
      target.set(-40, 6, -20);
      break;
  }
  camera.position.add(localPoint.set(Math.sin(time * 1.6) * 0.008, Math.sin(time * 1.1) * 0.006, 0));
  camera.fov = state.shot.lens;
  camera.updateProjectionMatrix();
  camera.lookAt(target);
  speaker.textContent = state.subtitle?.speaker || "";
  subtitle.textContent = state.subtitle?.text || "";
  shade.style.opacity = state.fade;
  locationCard.style.opacity = Math.max(0, 1 - Math.max(0, time - 2) / 0.7);
  endTitle.style.opacity = THREE.MathUtils.smoothstep(time, 28.7, 29.5);
  scrub.value = time;
  document.getElementById("clock").textContent = `00:${Math.floor(time).toString().padStart(2, "0")} / 00:30`;
  pipeline.render();
}

function setPlaying(value) {
  if (!ready) return;
  if (audioSource) { audioSource.stop(); audioSource = null; }
  if (value && time >= DURATION) renderAt(0);
  playing = value;
  if (playing && !renderMode) {
    if (!audioContext) {
      audioContext = new AudioContext();
      const samples = createSoundtrack();
      audioBuffer = audioContext.createBuffer(1, samples.length, 24000);
      audioBuffer.copyToChannel(samples, 0);
    }
    audioContext.resume();
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0, time);
  }
  previous = performance.now();
  playButton.textContent = playing ? "Ⅱ Pause" : "▶ Play";
  playButton.setAttribute("aria-label", playing ? "Pause film" : "Play film");
}

playButton.addEventListener("click", () => setPlaying(!playing));
replayButton.addEventListener("click", () => { renderAt(0); setPlaying(true); });
scrub.addEventListener("input", () => { setPlaying(false); renderAt(Number(scrub.value)); });
window.addEventListener("keydown", event => {
  if (event.target.matches("input, button, a")) return;
  if (event.code === "Space") { event.preventDefault(); setPlaying(!playing); }
  if (event.code === "KeyR") { renderAt(0); setPlaying(true); }
});
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  pipeline.setSize(innerWidth, innerHeight);
  renderAt(time);
});
pipeline.setSize(innerWidth, innerHeight);

window.__film = {
  seek: seconds => { setPlaying(false); renderAt(seconds); },
  play: () => setPlaying(true),
  pause: () => setPlaying(false),
  state: () => ({ ready, time, playing, duration: DURATION, shot: filmState(time).shot.id }),
  scene, camera,
  actor: () => driver,
};

async function load() {
  driver = await loadCharacter({ id: "ganaa" });
  driver.setMotion("hour-five");
  driver.group.position.fromArray(cabLayout.driverOrigin);
  truck.add(driver.group);
  ready = true;
  playButton.disabled = replayButton.disabled = false;
  document.getElementById("status").hidden = true;
  renderAt(0);
}
load().catch(error => {
  console.error(error);
  document.getElementById("status").textContent = "Could not load the film. Reload to try again.";
});

function frame(now) {
  if (ready && playing && !renderMode) {
    const next = Math.min(DURATION, time + (now - previous) / 1000);
    renderAt(next);
    if (next >= DURATION) setPlaying(false);
  }
  previous = now;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
