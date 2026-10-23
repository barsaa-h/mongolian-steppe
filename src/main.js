import * as THREE from "three";
import { buildWorld, worldState } from "./world.js";
import { loadMongolianMan } from "./character.js";
import { createPipeline } from "./psx.js";

const TAU = Math.PI * 2;

const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(55, 1, 1, 500);
const { scene, apply } = buildWorld();
const pipeline = createPipeline(renderer, scene, camera);

const view = {
  yaw: 0.95,
  pitch: 0.38,
  zoom: 1,
  targetYaw: 0.95,
  targetPitch: 0.38,
  targetZoom: 1,
  auto: true,
  target: new THREE.Vector3(0, 4, 5),
  desiredTarget: new THREE.Vector3(0, 4, 5),
  dragging: false,
  lastX: 0,
  lastY: 0,
};

const timeline = {
  t: 0.6,
  paused: false,
  speed: 1 / 300,
};

const presets = {
  "1": { name: "OVERVIEW", target: [0, 4, 5], yaw: 0.95, pitch: 0.38, zoom: 1.14 },
  "2": { name: "APARTMENTS", target: [-28, 7, -16], yaw: 0.32, pitch: 0.2, zoom: 0.52 },
  "3": { name: "SCHOOL", target: [22, 5, -24], yaw: -0.42, pitch: 0.19, zoom: 0.45 },
  "4": { name: "GER DISTRICT", target: [0, 3, 30], yaw: 0.18, pitch: 0.24, zoom: 0.55 },
  "5": { name: "STORE", target: [54, 4, -9], yaw: 0.55, pitch: 0.2, zoom: 0.42 },
};

const viewName = document.getElementById("viewName");
let character = null;

function setPreset(key) {
  const preset = presets[key];
  if (!preset) return;
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
  if (character) {
    character.setState({
      bob: Math.sin(timeline.t * TAU * 60) * 0.007,
      bodyYaw: Math.sin(timeline.t * TAU * 12) * 0.14,
    });
  }
  document.getElementById("barFill").style.width = `${timeline.t * 100}%`;
}

async function loadCharacter() {
  try {
    character = await loadMongolianMan({
      position: new THREE.Vector3(-8.2, 0.035, 29.4),
      rotationY: 1.2,
    });
    scene.add(character.group);
    setTime(timeline.t);
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
    0.05,
    1.2
  );
  view.lastX = e.clientX;
  view.lastY = e.clientY;
});
canvas.addEventListener("pointerup", () => {
  view.dragging = false;
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  view.targetZoom = THREE.MathUtils.clamp(view.targetZoom + e.deltaY * 0.0012, 0.32, 1.8);
}, { passive: false });

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    timeline.paused = !timeline.paused;
    e.preventDefault();
  } else if (e.code === "ArrowRight") {
    setTime(timeline.t + 0.02);
    e.preventDefault();
  } else if (e.code === "ArrowLeft") {
    setTime(timeline.t - 0.02);
    e.preventDefault();
  } else if (e.code === "KeyA") {
    view.auto = !view.auto;
    e.preventDefault();
  } else if (presets[e.key]) {
    setPreset(e.key);
    e.preventDefault();
  }
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

const radiusBase = 92;
let lastTime = performance.now();

function frame(now = performance.now()) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!timeline.paused) {
    setTime(timeline.t + timeline.speed * dt);
  }

  if (view.auto && !view.dragging) {
    view.targetYaw += dt * 0.03;
  }

  view.yaw = THREE.MathUtils.damp(view.yaw, view.targetYaw, 8, dt);
  view.pitch = THREE.MathUtils.damp(view.pitch, view.targetPitch, 8, dt);
  view.zoom = THREE.MathUtils.damp(view.zoom, view.targetZoom, 8, dt);
  view.target.lerp(view.desiredTarget, 1 - Math.exp(-4 * dt));

  const radius = radiusBase * view.zoom;
  const cosPitch = Math.cos(view.pitch);
  camera.position.set(
    view.target.x + Math.sin(view.yaw) * cosPitch * radius,
    view.target.y + Math.sin(view.pitch) * radius,
    view.target.z + Math.cos(view.yaw) * cosPitch * radius
  );
  camera.lookAt(view.target);

  pipeline.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
