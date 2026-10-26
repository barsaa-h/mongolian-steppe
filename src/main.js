import * as THREE from "three";
import { buildWorld, worldState } from "./world.js";
import { surfaceHeight, townHeight } from "./district.js";
import { loadMongolianMan } from "./character.js";
import { exploreStep, flatBasis } from "./explore.js";
import { createPipeline } from "./psx.js";

const TAU = Math.PI * 2;

const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(50, 1, 0.15, 2000);
const { scene, apply } = buildWorld();
const pipeline = createPipeline(renderer, scene, camera);

const view = {
  yaw: 0.82,
  pitch: 0.46,
  zoom: 1.28,
  targetYaw: 0.82,
  targetPitch: 0.46,
  targetZoom: 1.28,
  auto: false,
  target: new THREE.Vector3(-8, 0, -16),
  desiredTarget: new THREE.Vector3(-8, 0, -16),
  dragging: false,
  lastX: 0,
  lastY: 0,
};

const timeline = {
  t: 0.6,
  paused: true,
  speed: 1 / 300,
};

const presets = {
  "1": { name: "OVERVIEW", target: [-8, 0, -16], yaw: 0.82, pitch: 0.46, zoom: 1.28 },
  "2": { name: "SQUARE", target: [16, 5, -14], yaw: 0.35, pitch: 0.22, zoom: 0.46 },
  "3": { name: "SCHOOL", target: [64, 6, -28], yaw: -0.35, pitch: 0.2, zoom: 0.5 },
  "4": { name: "KHOROOL", target: [2, 5, 52], yaw: 0.2, pitch: 0.34, zoom: 0.58 },
  "5": { name: "HOSPITAL", target: [-76, 6, -16], yaw: 0.65, pitch: 0.22, zoom: 0.48 },
  "6": { name: "HEATING", target: [146, 10, -24], yaw: -0.9, pitch: 0.24, zoom: 0.55 },
  "7": { name: "CORDON", target: [-128, 4, 0], yaw: 1.05, pitch: 0.2, zoom: 0.42 },
  "8": { name: "YARDS", target: [32, 4, 66], yaw: 0.55, pitch: 0.32, zoom: 0.38 },
};

const viewName = document.getElementById("viewName");
const hudMap = document.getElementById("hudMap");
const hudPlay = document.getElementById("hudPlay");
let character = null;
const pressed = new Set();
const explore = {
  active: false,
  flying: false,
  distance: 8,
  motion: "idle",
  flyQueued: false,
};
const lookScratch = new THREE.Vector3();

function setPreset(key) {
  const preset = presets[key];
  if (!preset) return;
  view.auto = false;
  view.targetYaw = preset.yaw;
  view.targetPitch = preset.pitch;
  view.targetZoom = preset.zoom;
  view.desiredTarget.set(preset.target[0], preset.target[1], preset.target[2]);
  if (viewName) viewName.textContent = preset.name;
}

function setTime(t) {
  timeline.t = ((t % 1) + 1) % 1;
  const state = worldState(timeline.t);
  apply(state);
  document.getElementById("barFill").style.width = `${timeline.t * 100}%`;
}

function showMode(name) {
  if (viewName) viewName.textContent = name;
  if (hudMap) hudMap.hidden = explore.active;
  if (hudPlay) hudPlay.hidden = !explore.active;
}

let enterPending = false;

function enterCharacter() {
  if (!character) {
    enterPending = true;
    return;
  }
  enterPending = false;
  explore.active = true;
  explore.distance = 8;
  view.auto = false;
  view.targetYaw = character.group.rotation.y + Math.PI;
  view.targetPitch = 0.42;
  view.yaw = view.targetYaw;
  view.pitch = view.targetPitch;
  const p = character.group.position;
  view.desiredTarget.set(p.x, p.y + 1.35, p.z);
  view.target.copy(view.desiredTarget);
  placeCamera();
  showMode(explore.flying ? "FLYING" : "ON FOOT");
}

function leaveCharacter() {
  explore.active = false;
  explore.flying = false;
  if (character && explore.motion !== "idle") {
    character.setMotion("idle");
    explore.motion = "idle";
  }
  setPreset("1");
  view.auto = false;
  showMode("VALLEY");
}

async function loadCharacter() {
  try {
    character = await loadMongolianMan({
      position: new THREE.Vector3(1.6, townHeight(1.6, 40) + 0.035, 40),
      rotationY: 0.15,
      outfit: "riding-deel/teal/felt",
    });
    scene.add(character.group);
    setTime(timeline.t);
    if (enterPending) enterCharacter();
  } catch (error) {
    console.warn("Character asset unavailable", error);
  }
}
loadCharacter();

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  pipeline.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();

canvas.addEventListener("pointerdown", (e) => {
  view.dragging = true;
  view.lastX = e.clientX;
  view.lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!view.dragging) return;
  view.targetYaw -= (e.clientX - view.lastX) * 0.005;
  view.targetPitch = THREE.MathUtils.clamp(
    view.targetPitch + (e.clientY - view.lastY) * 0.004,
    explore.active ? -0.55 : 0.08,
    1.15
  );
  view.lastX = e.clientX;
  view.lastY = e.clientY;
});
canvas.addEventListener("pointerup", () => {
  view.dragging = false;
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (explore.active) {
    explore.distance = THREE.MathUtils.clamp(explore.distance + e.deltaY * 0.012, 3.5, 28);
  } else {
    view.targetZoom = THREE.MathUtils.clamp(view.targetZoom + e.deltaY * 0.0012, 0.32, 1.8);
  }
}, { passive: false });

window.addEventListener("keydown", (e) => {
  pressed.add(e.code);
  if (e.code === "Enter" && !e.repeat) {
    enterCharacter();
    e.preventDefault();
    return;
  }
  if (e.code === "Escape") {
    if (explore.active) leaveCharacter();
    e.preventDefault();
    return;
  }
  if (explore.active) {
    if (e.code === "KeyF" && !e.repeat) explore.flyQueued = true;
    if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    return;
  }
  if (e.code === "Space") {
    timeline.paused = !timeline.paused;
    e.preventDefault();
  } else if (e.code === "BracketRight") {
    setTime(timeline.t + 0.02);
    e.preventDefault();
  } else if (e.code === "BracketLeft") {
    setTime(timeline.t - 0.02);
    e.preventDefault();
  } else if (e.code === "KeyA" && !e.repeat) {
    view.auto = !view.auto;
    e.preventDefault();
  } else if (presets[e.key]) {
    setPreset(e.key);
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => {
  pressed.delete(e.code);
});

window.__psx = {
  scene,
  camera,
  renderer,
  setTime: (t) => setTime(t),
  pause: (paused) => {
    timeline.paused = paused;
  },
  orbit: (yaw, pitch, zoom) => {
    if (yaw !== undefined) view.targetYaw = yaw;
    if (pitch !== undefined) view.targetPitch = pitch;
    if (zoom !== undefined) view.targetZoom = zoom;
  },
  view: (key) => setPreset(key),
  getState: () => ({
    t: timeline.t,
    paused: timeline.paused,
    yaw: view.yaw,
    pitch: view.pitch,
    zoom: view.zoom,
    auto: view.auto,
    character: Boolean(character),
    explore: explore.active,
    flying: explore.flying,
  }),
  pick: (x, y) => {
    const ndc = new THREE.Vector2(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.slice(0, 4).map((hit) => {
      let object = hit.object;
      const names = [];
      while (object) {
        if (object.name) names.push(object.name);
        object = object.parent;
      }
      return {
        names,
        distance: Math.round(hit.distance * 10) / 10,
        point: hit.point.toArray().map((v) => Math.round(v * 10) / 10),
        material: hit.object.material && hit.object.material.type,
      };
    });
  },
  stats: () => {
    let meshes = 0;
    let triangles = 0;
    let lines = 0;
    scene.traverse((object) => {
      if (object.isMesh) {
        meshes += 1;
        const geometry = object.geometry;
        if (geometry && geometry.index) triangles += geometry.index.count / 3;
        else if (geometry && geometry.attributes.position) triangles += geometry.attributes.position.count / 3;
      }
      if (object.isLine) lines += 1;
    });
    const box = new THREE.Box3().setFromObject(scene);
    return {
      meshes,
      triangles: Math.round(triangles),
      lines,
      mergedBatches: scene.userData.mergedBatches || 0,
      bounds: {
        min: box.min.toArray().map((v) => Math.round(v * 10) / 10),
        max: box.max.toArray().map((v) => Math.round(v * 10) / 10),
      },
      camera: camera.position.toArray().map((v) => Math.round(v * 10) / 10),
    };
  },
};

setTime(timeline.t);

const radiusBase = 132;
let lastTime = performance.now();

function frame(now = performance.now()) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (character) character.update(dt);

  if (explore.active && character) {
    const basis = flatBasis(camera);
    camera.getWorldDirection(lookScratch);
    const forward = (pressed.has("KeyW") || pressed.has("ArrowUp") ? 1 : 0)
      - (pressed.has("KeyS") || pressed.has("ArrowDown") ? 1 : 0);
    const strafe = (pressed.has("KeyD") || pressed.has("ArrowRight") ? 1 : 0)
      - (pressed.has("KeyA") || pressed.has("ArrowLeft") ? 1 : 0);
    const ascend = (pressed.has("Space") ? 1 : 0)
      - (pressed.has("ControlLeft") || pressed.has("ControlRight") ? 1 : 0);
    const here = character.group.position;
    const step = exploreStep(
      { x: here.x, y: here.y, z: here.z, yaw: character.group.rotation.y, flying: explore.flying },
      {
        forward,
        strafe,
        ascend,
        sprint: pressed.has("ShiftLeft") || pressed.has("ShiftRight"),
        flyToggle: explore.flyQueued,
        lookY: lookScratch.y,
        flatForward: basis.forward,
        flatRight: basis.right,
      },
      dt,
      surfaceHeight,
      (x, z) => bodyBlocked(here.x, here.z, x, z),
    );
    explore.flyQueued = false;
    explore.flying = step.flying;
    character.group.position.set(step.x, step.y, step.z);
    character.group.rotation.y = step.yaw;
    if (step.motion !== explore.motion) {
      character.setMotion(step.motion);
      explore.motion = step.motion;
    }
    view.desiredTarget.set(step.x, step.y + 1.35, step.z);
    showMode(step.flying ? "FLYING" : "ON FOOT");
  }

  if (!timeline.paused) {
    setTime(timeline.t + timeline.speed * dt);
  }

  if (view.auto && !view.dragging && !explore.active) {
    view.targetYaw += dt * 0.03;
  }

  view.yaw = THREE.MathUtils.damp(view.yaw, view.targetYaw, 8, dt);
  view.pitch = THREE.MathUtils.damp(view.pitch, view.targetPitch, 8, dt);
  view.zoom = THREE.MathUtils.damp(view.zoom, view.targetZoom, 8, dt);
  view.target.lerp(view.desiredTarget, 1 - Math.exp(-4 * dt));

  placeCamera();
  pipeline.render();
  requestAnimationFrame(frame);
}

function bodyBlocked(x0, z0, x1, z1) {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.04) return false;
  const origin = lookScratch.set(x0, surfaceHeight(x0, z0) + 0.95, z0);
  const direction = new THREE.Vector3(dx / dist, 0, dz / dist);
  const ray = new THREE.Raycaster(origin, direction, 0, dist + 0.45);
  ray.camera = camera;
  const hits = ray.intersectObjects(scene.children, true);
  for (const hit of hits) {
    if (!hit.object.isMesh) continue;
    let object = hit.object;
    let mine = false;
    while (object) {
      if (object === character.group) {
        mine = true;
        break;
      }
      object = object.parent;
    }
    if (mine) continue;
    if (!hit.face) return true;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if (normal.y > 0.72) continue;
    return true;
  }
  return false;
}

function placeCamera() {
  const radius = explore.active ? explore.distance : radiusBase * view.zoom;
  const cosPitch = Math.cos(view.pitch);
  camera.position.set(
    view.target.x + Math.sin(view.yaw) * cosPitch * radius,
    view.target.y + Math.sin(view.pitch) * radius,
    view.target.z + Math.cos(view.yaw) * cosPitch * radius
  );
  camera.lookAt(view.target);
}

placeCamera();
pipeline.render();
requestAnimationFrame(frame);
