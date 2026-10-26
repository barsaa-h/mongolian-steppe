import * as THREE from "three";
import cabLayout from "../assets/cast/cab.json" with { type: "json" };
import { DURATION, filmState, SHOTS } from "./filmTimeline.js";
import { createSoundtrack } from "./filmSound.js";
import { buildRoom, buildTubeLight, updateTubeLights, lightInterior, buildHospitalBed, buildIVStand, buildCabinet, buildLocker, buildDoor } from "./interior.js";
import { buildStandingFigure, buildCrowd, crowdRows, attachSteam, updateInfected } from "./infected.js";

// Scene registry: each module is a self-contained stage for the film player.
// build() loads its own cast and sets; state()/duration/shots follow the
// filmTimeline.js shape so the exporter keeps working unchanged.

function smoothstep(x, min, max) {
  return THREE.MathUtils.smoothstep(x, min, max);
}

const hourFive = {
  id: "hour-five",
  duration: DURATION,
  shots: SHOTS,
  state(seconds) {
    const s = filmState(seconds);
    s.location = Math.max(0, 1 - Math.max(0, s.time - 2) / 0.7);
    s.endTitle = smoothstep(s.time, 28.7, 29.5);
    return s;
  },
  soundtrack: () => createSoundtrack(),
  async build() {
    const [
      { buildWorld, worldState },
      { approachCurve, positionKamaz },
      { terrainHeight },
      { buildSheep },
      { loadCharacter },
    ] = await Promise.all([
      import("./world.js"),
      import("./winter.js"),
      import("./terrain.js"),
      import("./parts.js"),
      import("./character.js"),
    ]);

    const { scene, apply } = buildWorld();
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
    const driver = await loadCharacter({ id: "ganaa" });
    driver.setMotion("hour-five");
    driver.group.position.fromArray(cabLayout.driverOrigin);
    truck.add(driver.group);

    const localPoint = new THREE.Vector3();
    const target = new THREE.Vector3();

    function update(time, camera) {
      const state = filmState(time);
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
      camera.lookAt(target);
    }

    function truckPoint(x, y, z, result) {
      return result.set(x, y, z).applyMatrix4(truck.matrixWorld);
    }

    return { scene, update, actor: () => driver };
  },
};

// Phase A staging QA: a hospital corridor built entirely from the interior
// kit, with all three infected states and a small crowd of the Standing.
const PREVIEW_CUES = [
  { start: 2.5, end: 6, speaker: "БОЛОР", text: "…Ээ, зогсчихлоо. Эмч ээ, хараач." },
  { start: 7.5, end: 12, speaker: "ОЮУН", text: "Халуун хоолой руу очлоо... Яагаад?" },
];

const kitPreview = {
  id: "kit-preview",
  duration: 14,
  shots: [
    { id: "corridor", start: 0, end: 7, lens: 40 },
    { id: "faces", start: 7, end: 14, lens: 46 },
  ],
  state(seconds) {
    const time = Math.max(0, Math.min(14, seconds));
    const shot = this.shots.find(s => time >= s.start && time < s.end) || this.shots.at(-1);
    return {
      time,
      shot,
      shotProgress: (time - shot.start) / (shot.end - shot.start),
      subtitle: PREVIEW_CUES.find(cue => time >= cue.start && time < cue.end) || null,
      fade: time < 0.7 ? 1 - time / 0.7 : Math.max(0, Math.min(1, (time - 13.2) / 0.8)),
    };
  },
  async build() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2c3034, 4, 30);
    scene.background = new THREE.Color(0x1c1f24);
    lightInterior(scene, { warm: 0xd8e2d8, level: 0.9 });

    const corridor = buildRoom({
      w: 2.8, d: 16, h: 3.0, x: 0, z: -8, wall: 2, floor: "tile", windowWidth: 1.6,
    });
    scene.add(corridor);
    const ward = buildRoom({ w: 4.6, d: 4.2, h: 3.0, x: 4.1, z: -3, wall: 0, floor: "linoleum" });
    scene.add(ward);
    for (const z of [-11.5, -8, -4.5]) {
      const tube = buildTubeLight(1.3, (z + 11.5) / 7);
      tube.position.set(0, 2.96, z);
      scene.add(tube);
    }
    for (const z of [-10.2, -6.8]) {
      const door = buildDoor({ open: z === -6.8 ? 0.9 : 0.12, glazed: true });
      door.position.set(-1.31, 0, z);
      door.rotation.y = Math.PI / 2;
      scene.add(door);
    }
    const bedA = buildHospitalBed();
    bedA.position.set(4.6, 0, -4.4);
    bedA.rotation.y = Math.PI / 2;
    scene.add(bedA);
    const bedB = buildHospitalBed();
    bedB.position.set(3.6, 0, -1.9);
    bedB.rotation.y = Math.PI / 2;
    scene.add(bedB);
    const stand = buildIVStand();
    stand.position.set(5.6, 0, -3.4);
    scene.add(stand);
    const cabinet = buildCabinet();
    cabinet.position.set(-1.2, 0, -9.5);
    cabinet.rotation.y = Math.PI / 2;
    scene.add(cabinet);
    const locker = buildLocker();
    locker.position.set(-1.2, 0, -13.2);
    locker.rotation.y = Math.PI / 2;
    scene.add(locker);

    // The three states at the corridor's end: RED fed, GREY sinking, WHITE still.
    const heroes = [];
    const heroStates = ["red", "grey", "white"];
    heroStates.forEach((state, i) => {
      const figure = buildStandingFigure({
        x: -0.8 + i * 0.8, z: -12.8 - i * 0.5, yaw: Math.PI, seed: 41 + i, state,
      });
      scene.add(figure);
      heroes.push(figure);
    });
    const crowd = buildCrowd({
      positions: crowdRows({ origin: [0, -14.6], dir: [0, -1], across: 2, rows: 4, spacing: 1.5, seed: 77 }),
      seed: 77,
      state: "white",
    });
    scene.add(crowd);
    const updateSteam = attachSteam(scene, heroes, { strength: 1, height: 1.55 });

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateSteam(time);
      const p = time < 7
        ? (time - 0) / 7
        : (time - 7) / 7;
      if (time < 7) {
        camera.position.set(0.3, 1.55, -2.5 - p * 5.5);
        camera.lookAt(-0.2, 1.35, -12);
      } else {
        camera.position.set(1.1 - p * 0.7, 1.62, -10.4 - p * 0.7);
        camera.lookAt(-0.4, 1.32, -13.2);
      }
    }

    return { scene, update };
  },
};

export const SCENES = {
  "hour-five": hourFive,
  "kit-preview": kitPreview,
};

export function getScene(id) {
  const scene = SCENES[id];
  if (!scene) {
    throw new Error(`Unknown scene "${id}". Available: ${Object.keys(SCENES).join(", ")}`);
  }
  return scene;
}
