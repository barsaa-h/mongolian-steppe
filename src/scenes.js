import * as THREE from "three";
import cabLayout from "../assets/cast/cab.json" with { type: "json" };
import { DURATION, filmState, SHOTS } from "./filmTimeline.js";
import { createSoundtrack } from "./filmSound.js";
import {
  buildRoom, buildTubeLight, updateTubeLights, lightInterior,
  buildHospitalBed, buildIVStand, buildCabinet, buildLocker, buildDoor,
  buildNurseryCot, buildNursesStation, buildBoilerPipe, buildVentGrille,
  buildLaundryHatch, buildWaitingBench, interiorWallMaterial, floorMaterial,
  ceilingMaterial,
} from "./interior.js";
import { buildStandingFigure, buildCrowd, crowdRows, crowdRing, attachSteam, updateInfected } from "./infected.js";
import { ACT_STAGES } from "./sceneStages.js";
import { solid } from "./parts.js";

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

// Episode 2 staging: the maternity wing floor plan with the corridor spine,
// nursery glass, ER, Room 4, OR, ward, the boiler-pipe beat and the dawn car
// park of the Standing. Camera path and cues follow the approved dialogue.
const EP2_CUES = [
  { start: 1.0, end: 4.4, speaker: "ОЮУН", text: "...долоо, найм, ес. Ес. Бүгд байна." },
  { start: 7.0, end: 10.6, speaker: "БОЛОР", text: "Хөөх, пизда! Наадах чинь гүйдэг юм байна ш дээ! ЭМЧ ЭЭ!" },
  { start: 11.6, end: 13.4, speaker: "БОЛОР", text: "...Ээ, зогсчихлоо. Эмч ээ, хараач." },
  { start: 13.7, end: 15.7, speaker: "ОЮУН", text: "Халуун хоолой руу очлоо... Яагаад?" },
  { start: 18.0, end: 22.0, speaker: "РАДИО", text: "Өнөөдөр Наран хотод тэнгэр цэлмэг, хур тунадас орохгүй." },
];

const ep2Nursery = {
  id: "ep2-nursery",
  duration: 24,
  shots: [
    { id: "corridor", start: 0, end: 6, lens: 40 },
    { id: "er", start: 6, end: 11, lens: 44 },
    { id: "boiler", start: 11, end: 16, lens: 42 },
    { id: "dawn", start: 16, end: 24, lens: 48 },
  ],
  state(seconds) {
    const time = Math.max(0, Math.min(24, seconds));
    const shot = this.shots.find(s => time >= s.start && time < s.end) || this.shots.at(-1);
    return {
      time,
      shot,
      shotProgress: (time - shot.start) / (shot.end - shot.start),
      subtitle: EP2_CUES.find(cue => time >= cue.start && time < cue.end) || null,
      fade: time < 0.7 ? 1 - time / 0.7 : Math.max(0, Math.min(1, (time - 23.2) / 0.8)),
      location: THREE.MathUtils.clamp(1 - Math.abs(time - 1.5) / 1.0, 0, 1),
    };
  },
  async build() {
    const { loadCharacter } = await import("./character.js");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2c3138, 3, 46);
    scene.background = new THREE.Color(0x20252c);
    lightInterior(scene, { warm: 0xc9d4dc, level: 0.7 });

    const wall = interiorWallMaterial(2);
    const slab = (w, h, d, x, y, z) => scene.add(addSlab(w, h, d, x, y, z, wall));
    function addSlab(w, h, d, x, y, z, material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      return mesh;
    }
    const floor = floorMaterial("linoleum");
    const corridorFloor = new THREE.Mesh(new THREE.PlaneGeometry(3, 24), floor);
    corridorFloor.rotation.x = -Math.PI / 2;
    corridorFloor.position.set(0, 0, -12);
    scene.add(corridorFloor);
    const corridorCeiling = new THREE.Mesh(new THREE.PlaneGeometry(3, 24), ceilingMaterial());
    corridorCeiling.rotation.x = Math.PI / 2;
    corridorCeiling.position.set(0, 3, -12);
    scene.add(corridorCeiling);

    // Corridor west wall with ER, Room 4 and OR door gaps.
    for (const [z0, z1] of [[0, -3.3], [-4.7, -10.45], [-11.55, -16.3], [-17.7, -24]]) {
      slab(0.12, 3, z0 - z1, -1.56, 1.5, (z0 + z1) / 2);
    }
    // Corridor east wall: solid, nursery glass band, station opening, ward door.
    slab(0.12, 3, 8, 1.56, 1.5, -4);
    slab(0.12, 1.1, 4, 1.56, 0.55, -10);
    slab(0.12, 0.7, 4, 1.56, 2.65, -10);
    slab(0.12, 3, 0.6, 1.56, 1.5, -12.3);
    slab(0.12, 3, 2.9, 1.56, 1.5, -15.85);
    slab(0.12, 3, 5.3, 1.56, 1.5, -21.35);
    // South end: ER double doors gap.
    slab(0.6, 3, 0.12, -1.2, 1.5, 0.06);
    slab(0.6, 3, 0.12, 1.2, 1.5, 0.06);
    slab(1.8, 0.8, 0.12, 0, 2.6, 0.06);
    // North end: laundry hatch gap.
    slab(1.075, 3, 0.12, -0.9625, 1.5, -24.06);
    slab(1.075, 3, 0.12, 0.9625, 1.5, -24.06);
    slab(0.85, 1.2, 0.12, 0, 2.4, -24.06);

    // Rooms off the spine; each buildRoom has its door gap on its +z wall,
    // rotated toward the corridor.
    const er = buildRoom({ w: 8, d: 6, h: 3, x: -4.5, z: -4, wall: 2, floor: "tile", doorWidth: 1.4 });
    er.rotation.y = Math.PI / 2;
    scene.add(er);
    const room4 = buildRoom({ w: 4, d: 4, h: 3, x: -3.5, z: -11, wall: 1, floor: "linoleum", doorWidth: 1.1 });
    room4.rotation.y = Math.PI / 2;
    scene.add(room4);
    const or = buildRoom({ w: 5, d: 4, h: 3, x: -3.5, z: -17, wall: 2, floor: "tile", doorWidth: 1.4 });
    or.rotation.y = Math.PI / 2;
    scene.add(or);
    const ward = buildRoom({ w: 7, d: 6, h: 3, x: 4.5, z: -18, wall: 0, floor: "linoleum", doorWidth: 1.4 });
    ward.rotation.y = -Math.PI / 2;
    scene.add(ward);

    // Nursery: glass wall to the corridor, nine glowing cots inside.
    slab(0.12, 1.1, 4, 4.56, 0.55, -10);
    slab(0.12, 0.7, 4, 4.56, 2.65, -10);
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x9ab4b8, transparent: true, opacity: 0.16, depthWrite: false,
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 4), glassMat);
    glass.position.set(1.56, 1.65, -10);
    scene.add(glass);
    slab(5, 3, 0.12, 3.5, 1.5, -12.06);
    slab(5, 3, 0.12, 3.5, 1.5, -7.94);
    slab(0.12, 3, 4, 6.06, 1.5, -10);
    const nurseryFloor = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 4), floorMaterial("tile"));
    nurseryFloor.rotation.x = -Math.PI / 2;
    nurseryFloor.position.set(3.5, 0.001, -10);
    scene.add(nurseryFloor);
    const nurseryCeiling = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 4), ceilingMaterial());
    nurseryCeiling.rotation.x = Math.PI / 2;
    nurseryCeiling.position.set(3.5, 3, -10);
    scene.add(nurseryCeiling);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cot = buildNurseryCot();
        cot.position.set(2.4 + col * 1.0, 0, -8.9 - row * 1.0);
        cot.rotation.y = Math.PI;
        scene.add(cot);
      }
    }

    // Nurses' station recess with the ward's one phone.
    const stationFloor = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), floor);
    stationFloor.rotation.x = -Math.PI / 2;
    stationFloor.position.set(2.75, 0.001, -13.5);
    scene.add(stationFloor);
    slab(0.12, 3, 1.8, 4.06, 1.5, -13.5);
    slab(2.5, 3, 0.12, 2.75, 1.5, -12.54);
    slab(2.5, 3, 0.12, 2.75, 1.5, -14.46);
    const stationCeiling = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), ceilingMaterial());
    stationCeiling.rotation.x = Math.PI / 2;
    stationCeiling.position.set(2.75, 3, -13.5);
    scene.add(stationCeiling);
    const station = buildNursesStation({ w: 1.9 });
    station.position.set(2.4, 0, -13.5);
    station.rotation.y = -Math.PI / 2;
    scene.add(station);

    // Service passage beyond the hatch, opening onto the dawn car park.
    const passageFloor = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3), floorMaterial("concrete"));
    passageFloor.rotation.x = -Math.PI / 2;
    passageFloor.position.set(0, 0, -25.5);
    scene.add(passageFloor);
    slab(0.12, 3, 3, -1.1, 1.5, -25.5);
    slab(0.12, 3, 3, 1.1, 1.5, -25.5);
    const passageCeiling = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3), ceilingMaterial());
    passageCeiling.rotation.x = Math.PI / 2;
    passageCeiling.position.set(0, 3, -25.5);
    scene.add(passageCeiling);
    const apron = new THREE.Mesh(new THREE.PlaneGeometry(48, 22), floorMaterial("concrete"));
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(0, -0.01, -38);
    scene.add(apron);
    const house = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 6), floorMaterial("concrete"));
    house.position.set(0, 2.5, -42.8);
    scene.add(house);
    for (const x of [-2.4, 2.4]) {
      const chimney = addCyl(0.45, 0.5, 3.2, solid(0x5a5048), x, 6.6, -41.6);
      scene.add(chimney);
    }
    for (const x of [-2.2, 0, 2.2]) {
      const windowPane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.55),
        new THREE.MeshLambertMaterial({ color: 0x2c2018, emissive: 0xc86a24, emissiveIntensity: 0.85 })
      );
      windowPane.position.set(x, 1.7, -39.79);
      scene.add(windowPane);
    }
    function addCyl(rt, rb, h, material, x, y, z) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 7), material);
      mesh.position.set(x, y, z);
      return mesh;
    }
    const boilerGlow = new THREE.PointLight(0xff8a30, 2.2, 26, 1.4);
    boilerGlow.position.set(0, 2.2, -38.8);
    scene.add(boilerGlow);

    for (const z of [-3, -9, -15, -21]) {
      const tube = buildTubeLight(1.3, (z + 3) / 6);
      tube.position.set(0, 2.96, z);
      scene.add(tube);
    }
    for (const z of [-5.8, -14.8]) {
      const vent = buildVentGrille();
      vent.position.set(-1.46, 2.2, z);
      vent.rotation.y = Math.PI / 2;
      scene.add(vent);
    }
    const hatch = buildLaundryHatch();
    hatch.position.set(0.44, 0.8, -24.02);
    hatch.rotation.y = Math.PI;
    scene.add(hatch);
    const pipe = buildBoilerPipe({ length: 4, y: 1.4 });
    pipe.position.set(-1.42, 0, -20.5);
    pipe.rotation.y = Math.PI / 2;
    scene.add(pipe);

    const bedEr1 = buildHospitalBed();
    bedEr1.position.set(-5.6, 0, -2.6);
    scene.add(bedEr1);
    const bedEr2 = buildHospitalBed();
    bedEr2.position.set(-6.4, 0, -6.2);
    bedEr2.rotation.y = 0.5;
    scene.add(bedEr2);
    for (const z of [-1.4, -6.6]) {
      const bench = buildWaitingBench();
      bench.position.set(-6.8, 0, z);
      bench.rotation.y = Math.PI / 2;
      scene.add(bench);
    }
    const bed4 = buildHospitalBed();
    bed4.position.set(-4.2, 0, -11.8);
    bed4.rotation.y = Math.PI / 2;
    scene.add(bed4);
    const iv4 = buildIVStand();
    iv4.position.set(-3.2, 0, -10.6);
    scene.add(iv4);
    const bedOr = buildHospitalBed();
    bedOr.position.set(-4.4, 0, -17.4);
    bedOr.rotation.y = Math.PI / 2;
    scene.add(bedOr);
    const orCabinet = buildCabinet();
    orCabinet.position.set(-5.2, 0, -15.8);
    scene.add(orCabinet);
    for (const [x, z, yaw] of [[3.0, -19.6, 0.2], [5.6, -19.2, -0.3], [4.4, -16.6, 0.1]]) {
      const bed = buildHospitalBed();
      bed.position.set(x, 0, z);
      bed.rotation.y = yaw;
      scene.add(bed);
    }

    // The Standing: burned-out runner at the boiler pipe, sprinters bursting
    // from the ER, and the dawn ring around the boiler house.
    const burned = buildStandingFigure({ x: -1.05, z: -20.5, yaw: -Math.PI / 2, seed: 61, state: "red" });
    scene.add(burned);
    const runners = [];
    for (let i = 0; i < 3; i++) {
      const runner = buildStandingFigure({ x: 0, z: 0, seed: 70 + i, state: "red" });
      runner.rotation.x = 0.14;
      scene.add(runner);
      runners.push(runner);
    }
    const ring = crowdRing({ center: [0, -37.5], radius: 9.2, count: 88, seed: 12 });
    const ringCrowd = buildCrowd({ positions: ring, seed: 12, state: "white" });
    scene.add(ringCrowd);
    const dawnCrowd = buildCrowd({
      positions: crowdRows({ origin: [-6, -31], dir: [-1, -0.2], across: 6, rows: 3, spacing: 1.7, seed: 13 }),
      seed: 13,
      state: "white",
    });
    scene.add(dawnCrowd);

    const chimneyAnchor = new THREE.Object3D();
    chimneyAnchor.position.set(0, 8.1, -41.6);
    scene.add(chimneyAnchor);
    const nearRing = ring.slice(0, 4).map(([x, z]) => {
      const anchor = new THREE.Object3D();
      anchor.position.set(x, 0, z);
      scene.add(anchor);
      return anchor;
    });
    const updateSteam = attachSteam(scene, [chimneyAnchor, ...nearRing], { strength: 1.4, height: 0 });
    const updateSteamBurned = attachSteam(scene, [burned], { strength: 1, height: 1.55 });

    const oyun = await loadCharacter({ id: "oyun" });
    oyun.group.position.set(0.8, 0, -5.6);
    oyun.group.rotation.y = Math.PI / 2;
    scene.add(oyun.group);
    const bolor = await loadCharacter({ id: "bolor" });
    bolor.group.position.set(0.5, 0, -20.2);
    bolor.group.rotation.y = -Math.PI / 2 + 0.25;
    scene.add(bolor.group);

    const penlight = new THREE.SpotLight(0xd8e8e0, 3.2, 9, 0.42, 0.6, 1.4);
    penlight.position.set(0.8, 1.5, -5.6);
    const penTarget = new THREE.Object3D();
    penTarget.position.set(2.6, 1.0, -10);
    scene.add(penTarget, penlight);
    penlight.target = penTarget;

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateSteam(time);
      updateSteamBurned(time);
      oyun.setTime(time);
      bolor.setTime(time);
      // Sprinters burst from the ER into the corridor during shot two, then
      // hold still off-camera.
      const p = THREE.MathUtils.clamp((time - 6.3) / 3.6, 0, 1);
      runners.forEach((runner, i) => {
        const k = THREE.MathUtils.clamp(p * 1.25 - i * 0.16, 0, 1);
        const x = -3.1 + k * 2.4;
        const z = -5.4 + k * 1.5;
        runner.position.set(x, 0, z);
        runner.rotation.y = Math.atan2(2.4, 1.5);
      });
      penlight.intensity = time < 6 ? 2.1 : 0;

      const s = time < 6
        ? { id: "corridor", p: time / 6 }
        : time < 11
          ? { id: "er", p: (time - 6) / 5 }
          : time < 16
            ? { id: "boiler", p: (time - 11) / 5 }
            : { id: "dawn", p: (time - 16) / 8 };
      if (s.id === "corridor") {
        camera.position.set(0.7, 1.55, -1.5 - s.p * 3);
        camera.lookAt(1.5, 1.3, -9.5);
      } else if (s.id === "er") {
        camera.position.set(-0.35 + s.p * 0.1, 1.6, -1.7);
        camera.lookAt(-2.8, 1.05, -5.4);
      } else if (s.id === "boiler") {
        camera.position.set(0.8, 1.68, -18.1 + s.p * 0.5);
        camera.lookAt(-1.2, 0.95, -20.8);
      } else {
        const k = s.p * s.p * (3 - 2 * s.p);
        camera.position.set(0, 1.45 + k * 0.5, -25.6 - k * 5.2);
        camera.lookAt(0, 1.7, -37.5);
      }
    }

    return { scene, update, actor: () => oyun };
  },
};

export const SCENES = {
  "hour-five": hourFive,
  "kit-preview": kitPreview,
  "ep2-nursery": ep2Nursery,
  ...ACT_STAGES,
};

export function getScene(id) {
  const scene = SCENES[id];
  if (!scene) {
    throw new Error(`Unknown scene "${id}". Available: ${Object.keys(SCENES).join(", ")}`);
  }
  return scene;
}
