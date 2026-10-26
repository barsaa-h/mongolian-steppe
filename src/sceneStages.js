import * as THREE from "three";
import {
  buildRoom, buildTubeLight, updateTubeLights, lightInterior,
  floorMaterial, buildDesk, buildChair, buildCabinet, buildChalkboard,
  buildLaundryHatch, buildBoilerPipe,
} from "./interior.js";
import {
  buildStandingFigure, buildCrowd, crowdRows, attachSteam, updateInfected,
} from "./infected.js";
import {
  addBox, asphaltMaterial, cylinder, mat, mulberry, solid, buildGer, buildPerson, buildHorse,
  buildFenceRun, buildWoodpile, groundPlane, contactShadow,
} from "./parts.js";
import { buildUAZ, buildHelicopter } from "./vehicles.js";
import {
  corrugatedTexture, cloneRepeat, dirtTexture, snowTexture, concreteTexture,
} from "./textures.js";

// Staging sets for the remaining map plan. Each module follows the scene
// contract: id, duration, shots, state(seconds), build() -> { scene, update }.
// Scenes without approved dialogue (Episode 6+, per the master) stay silent.

const clamp01 = v => Math.max(0, Math.min(1, v));

function eased(p) {
  return p * p * (3 - 2 * p);
}

function shotId(shots, time) {
  return shots.find(s => time >= s.start && time < s.end) || shots.at(-1);
}

function makeState(shots, duration, cues, options = {}) {
  return function state(seconds) {
    const time = Math.max(0, Math.min(duration, seconds));
    const shot = shotId(shots, time);
    return {
      time,
      shot,
      shotProgress: (time - shot.start) / (shot.end - shot.start),
      subtitle: cues.find(cue => time >= cue.start && time < cue.end) || null,
      fade: time < 0.7 ? 1 - time / 0.7 : Math.max(0, Math.min(1, (time - (duration - 0.8)) / 0.8)),
      location: options.location ? options.location(time) : 0,
    };
  };
}

// EP1 hook: Ulan-Ude freight yard at night. Rails, a rusted boxcar, the yard
// office, steam lines, the guard's flashlight and Irina's window.
const YARD_SHOTS = [
  { id: "rails", start: 0, end: 4, lens: 42 },
  { id: "boxcar", start: 4, end: 8, lens: 40 },
  { id: "office", start: 8, end: 10, lens: 46 },
];

const ep1Yard = {
  id: "ep1-yard",
  duration: 10,
  shots: YARD_SHOTS,
  state: makeState(YARD_SHOTS, 10, [
    { start: 5.0, end: 7.4, speaker: "ХАРУУЛ", text: "«Мужик, ты живой?»" },
    { start: 8.2, end: 9.9, speaker: "ИРИНА", text: "«Объект бежит три минуты. Потом засыпает стоя.»" },
  ]),
  async build() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a2028, 8, 64);
    scene.background = new THREE.Color(0x141920);
    lightInterior(scene, { warm: 0x8fa4b8, level: 0.62 });
    const rand = mulberry(9001);

    const yard = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 40),
      mat({ map: cloneRepeat(dirtTexture(), 16, 12), color: 0x8a8578 })
    );
    yard.rotation.x = -Math.PI / 2;
    scene.add(yard);

    // Two rail tracks with sleepers.
    for (const z of [-3, 3]) {
      for (const x of [-1.1, 1.1]) {
        const rail = addBox(scene, 40, 0.14, 0.1, solid(0x5a5248), x, 0.14, z);
        rail.material = solid(0x6a5f50);
      }
      for (let x = -19; x <= 19; x += 1.1) {
        addBox(scene, 0.55, 0.1, 2.6, solid(0x4a3e30), x, 0.05, z);
      }
    }

    // The rusted boxcar with its door slid open onto darkness.
    const boxcar = new THREE.Group();
    addBox(boxcar, 12, 3, 2.7, mat({ map: cloneRepeat(corrugatedTexture("#6e4a38"), 6, 1) }), 0, 2.1, 0);
    addBox(boxcar, 12.2, 0.2, 2.9, solid(0x3a2e26), 0, 0.75, 0);
    addBox(boxcar, 1.5, 2.6, 0.1, solid(0x0c0e10), -2.2, 2.1, 1.37);
    for (const x of [-5, -1.7, 1.7, 5]) {
      const wheel = cylinder(0.42, 0.42, 0.24, solid(0x24262a), 8);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.42, 1.2);
      boxcar.add(wheel);
    }
    boxcar.position.set(6, 0, -3.4);
    scene.add(boxcar);

    // The thing in the boxcar: flushed, steaming, mid-lunge.
    const infected = buildStandingFigure({ x: 0, z: 0, seed: 4, state: "red" });
    infected.position.set(5.6, 0, -3.1);
    infected.rotation.y = Math.PI / 2;
    scene.add(infected);
    const updateSteamLunge = attachSteam(scene, [infected], { strength: 1.6, height: 1.5 });

    // Steam line along the fence side.
    const pipeRun = new THREE.Group();
    const pipeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 22, 8), solid(0x5a564e));
    pipeMesh.rotation.x = Math.PI / 2;
    pipeMesh.position.y = 1.2;
    pipeRun.add(pipeMesh);
    for (let i = 0; i <= 5; i++) {
      addBox(pipeRun, 0.16, 0.3, 0.14, solid(0x42403a), 0, 0.55, -11 + i * 4.4);
    }
    pipeRun.position.set(-14, 0, 8);
    scene.add(pipeRun);
    const ventAnchor = new THREE.Object3D();
    ventAnchor.position.set(-14, 1.3, 3.2);
    scene.add(ventAnchor);
    const updateVent = attachSteam(scene, [ventAnchor], { strength: 1.2, height: 0 });

    // Yard office with Irina's lit window facing the yard.
    const office = buildRoom({ w: 4.5, d: 3.2, h: 2.7, x: -8, z: -6, wall: 1, floor: "wood", windowWidth: 1.4 });
    scene.add(office);
    const officeGlow = new THREE.PointLight(0xd8a860, 1.6, 10, 1.6);
    officeGlow.position.set(-8, 1.6, -5);
    scene.add(officeGlow);

    // Floodlight mast over the tracks.
    const mast = new THREE.Group();
    addBox(mast, 0.2, 9, 0.2, solid(0x3c4044), 0, 4.5, 0);
    const flood = new THREE.PointLight(0xcfe0f0, 4.2, 44, 1.4);
    flood.position.set(0, 8.6, 0);
    mast.add(flood);
    addBox(mast, 0.7, 0.35, 0.3, solid(0xd8e0e6), 0, 8.6, 0);
    mast.position.set(-4, 0, 10);
    scene.add(mast);

    // Broken fence line and scattered junk.
    const fence = buildFenceRun(16, "grey");
    fence.position.set(-14, 0, -14);
    fence.rotation.y = 0.2;
    scene.add(fence);
    for (let i = 0; i < 10; i++) {
      const crate = addBox(scene, 0.7 + rand() * 0.5, 0.5 + rand() * 0.3, 0.7, solid(0x5a4a36),
        -18 + rand() * 34, 0.3, -14 + rand() * 22);
      crate.rotation.y = rand() * 1.2;
    }

    const guard = (await import("./character.js")).loadCharacter;
    const guardFigure = await guard({ id: "yard-guard" });
    guardFigure.group.position.set(3.2, 0, -1.4);
    guardFigure.group.rotation.y = Math.PI / 2 - 0.3;
    scene.add(guardFigure.group);
    const irinaLoader = (await import("./character.js")).loadCharacter;
    const irina = await irinaLoader({ id: "irina" });
    irina.group.position.set(-8.6, 0, -5.6);
    irina.group.rotation.y = 0;
    scene.add(irina.group);

    const guardTorch = new THREE.SpotLight(0xe8f0e0, 2.6, 12, 0.36, 0.55, 1.4);
    guardTorch.position.set(3.2, 1.5, -1.4);
    const torchTarget = new THREE.Object3D();
    torchTarget.position.set(5.4, 1.2, -3.2);
    scene.add(torchTarget, guardTorch);
    guardTorch.target = torchTarget;

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateSteamLunge(time);
      updateVent(time);
      guardFigure.setTime(time);
      irina.setTime(time);
      // The guard walks toward the open boxcar and freezes there.
      const walk = eased(clamp01(time / 3.4));
      guardFigure.group.position.set(0.6 + walk * 2.4, 0, -1.2);
      guardFigure.group.rotation.y = Math.PI / 2 - 0.15;
      guardTorch.position.copy(guardFigure.group.position).setY(1.5);
      const s = time < 4
        ? { id: "rails", p: time / 4 }
        : time < 8 ? { id: "boxcar", p: (time - 4) / 4 } : { id: "office", p: (time - 8) / 2 };
      if (s.id === "rails") {
        camera.position.set(-16 + s.p * 4, 2.2, 9 - s.p * 3);
        camera.lookAt(4, 1.8, -3.5);
      } else if (s.id === "boxcar") {
        camera.position.set(-1.8, 1.75, 1.9 - s.p * 0.7);
        camera.lookAt(4.4, 1.4, -2.4);
      } else {
        camera.position.set(-3.2, 1.75, 0.6);
        camera.lookAt(-8.1, 1.5, -4.8);
      }
    }

    return { scene, update, actor: () => guardFigure };
  },
};

// EP1 set piece: the roadside café and forecourt, the chase, the fuel pump.
const ep1Truckstop = {
  id: "ep1-truckstop",
  duration: 12,
  shots: [
    { id: "forecourt", start: 0, end: 4, lens: 40 },
    { id: "cafe", start: 4, end: 7, lens: 44 },
    { id: "chase", start: 7, end: 12, lens: 46 },
  ],
  state: makeState([
    { id: "forecourt", start: 0, end: 4, lens: 40 },
    { id: "cafe", start: 4, end: 7, lens: 44 },
    { id: "chase", start: 7, end: 12, lens: 46 },
  ], 12, [
    { start: 4.4, end: 6.4, speaker: "ХҮРЭЛ", text: "Эгчээ, энд суу. Бууз гарч байна аа..." },
    { start: 7.4, end: 9.9, speaker: "ГАНАА", text: "Даша! ХӨӨЕ! БОЛЬ! Пизда, БОЛИОЧ!" },
    { start: 10.3, end: 11.8, speaker: "ГАНАА", text: "Асаа! Асаач дээ, муу новш! Баавгай аа, гуйж байна, ЯВ!" },
  ], {
    location: time => clamp01(1 - Math.abs(time - 1.4) / 1.0),
  }),
  async build() {
    const [{ loadCharacter }, { buildKamaz }] = await Promise.all([
      import("./character.js"),
      import("./winter.js"),
    ]);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x8a9296, 30, 120);
    scene.background = new THREE.Color(0x9aa8ae);
    lightInterior(scene, { warm: 0xe8dcc2, level: 0.95 });
    scene.add(new THREE.DirectionalLight(0xfff0d0, 0.9).translateX(20).translateY(30).translateZ(10));
    const rand = mulberry(7002);

    const lot = groundPlane(50, 34, mat({ map: cloneRepeat(dirtTexture(), 14, 10) }), 0, 0, 0);
    scene.add(lot);
    scene.add(groundPlane(16, 10, asphaltMaterial(6, 4), 6, -2, 0.02));

    // Café: dining room with a big window and a counter.
    const cafe = new THREE.Group();
    const shell = buildRoom({ w: 9, d: 5, h: 3.2, wall: 0, floor: "linoleum", doorWidth: 1.2 });
    cafe.add(shell);
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x8ab0b8, transparent: true, opacity: 0.2, depthWrite: false });
    const shopfront = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.6, 0.06), glassMat);
    shopfront.position.set(0.5, 1.7, 2.53);
    cafe.add(shopfront);
    const counter = buildDesk({ w: 2.6 });
    counter.position.set(-2.6, 0, 1.4);
    cafe.add(counter);
    for (const x of [0.4, 2.2]) {
      const table = buildDesk({ w: 1.1 });
      table.position.set(x, 0, -0.8);
      cafe.add(table);
      const stool = buildChair();
      stool.position.set(x + 0.3, 0, 0.1);
      cafe.add(stool);
    }
    cafe.position.set(-8, 0, -6);
    cafe.rotation.y = 0.35;
    scene.add(cafe);

    // Fuel pumps and the sign pole.
    const pumps = [];
    for (const x of [5.5, 7.3]) {
      const pump = new THREE.Group();
      addBox(pump, 0.5, 1.5, 0.4, solid(0x9a4438), 0, 0.75, 0);
      addBox(pump, 0.55, 0.3, 0.45, solid(0xd8d0c0), 0, 1.55, 0);
      addBox(pump, 0.1, 0.6, 0.1, solid(0x2c2e30), 0.3, 1.0, 0.1);
      pump.position.set(x, 0, -1.5);
      scene.add(pump);
      pumps.push(pump);
    }
    const signPole = new THREE.Group();
    addBox(signPole, 0.3, 7, 0.3, solid(0x4a4b4b), 0, 3.5, 0);
    const signBoard = addBox(signPole, 4.2, 1.6, 0.15, solid(0x8c2f24), 0, 6.4, 0);
    signBoard.material = solid(0x8c2f24);
    signPole.position.set(12, 0, 2);
    scene.add(signPole);

    // Ganaa's KAMAZ parked at the pumps.
    const truck = buildKamaz();
    truck.position.set(7.4, 0, 0.6);
    truck.rotation.y = Math.PI / 2 + 0.15;
    scene.add(truck);

    // Fireball staging at the near pump.
    const fire = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.5 + rand() * 0.4, 1.6 + rand() * 1.2, 6),
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff9a30 : 0xffd060, transparent: true, opacity: 0 })
      );
      cone.position.set((rand() - 0.5) * 1.6, 0.8, (rand() - 0.5) * 1.2);
      fire.add(cone);
    }
    const fireLight = new THREE.PointLight(0xff8a30, 0, 26, 1.3);
    fire.add(fireLight);
    fire.position.set(5.5, 0, -1.5);
    scene.add(fire);
    const fireAnchor = new THREE.Object3D();
    fireAnchor.position.set(5.5, 1.2, -1.5);
    fireAnchor.userData.infectedStrength = 3;
    scene.add(fireAnchor);
    const updateFireSmoke = attachSteam(scene, [fireAnchor], { strength: 3.4, height: 0 });

    const hurel = await loadCharacter({ id: "hurel" });
    hurel.group.position.set(-10.4, 0, -7.2);
    hurel.group.rotation.y = 0.6;
    scene.add(hurel.group);
    const dasha = buildStandingFigure({ x: 0, z: 0, seed: 21, state: "red" });
    scene.add(dasha);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateFireSmoke(time);
      hurel.setTime(time);
      // Dasha sprints past the KAMAZ, then the pump goes up.
      const sprint = clamp01((time - 7.2) / 3.2);
      dasha.position.set(4.5 - sprint * 5.5, 0, -3.4 + sprint * 3.4);
      dasha.rotation.y = Math.atan2(-5.5, 3.4);
      const blast = clamp01((time - 10.35) / 0.5);
      const falloff = clamp01(1 - (time - 10.85) / 1.1);
      fire.children.forEach((cone, i) => {
        if (!cone.isMesh) return;
        cone.material.opacity = blast * falloff * (0.55 + i * 0.08);
        const s = 0.6 + blast * (1 + i * 0.22) * (0.8 + 0.2 * Math.sin(time * 21 + i * 2.4));
        cone.scale.set(s, s * 1.5, s);
      });
      fireLight.intensity = blast * falloff * (5.5 + Math.sin(time * 29) * 1.2);
      const s = time < 4
        ? { id: "forecourt", p: time / 4 }
        : time < 7 ? { id: "cafe", p: (time - 4) / 3 } : { id: "chase", p: (time - 7) / 5 };
      if (s.id === "forecourt") {
        camera.position.set(-2 + s.p * 2, 2.4, 9 - s.p * 2);
        camera.lookAt(6.5, 1.2, -2);
      } else if (s.id === "cafe") {
        camera.position.set(-3.4, 1.5, -1.2);
        camera.lookAt(-8.5, 1.3, -6.4);
      } else {
        camera.position.set(-6.0, 2.7, 3.6 - s.p * 0.6);
        camera.lookAt(5.6, 1.1, -1.8);
      }
    }

    return { scene, update, actor: () => hurel };
  },
};

// EP1 close: the birthday party in Ganaa's block flat.
const ep1Apartment = {
  id: "ep1-apartment",
  duration: 12,
  shots: [
    { id: "door", start: 0, end: 4, lens: 40 },
    { id: "table", start: 4, end: 8, lens: 44 },
    { id: "candles", start: 8, end: 12, lens: 46 },
  ],
  state: makeState([
    { id: "door", start: 0, end: 4, lens: 40 },
    { id: "table", start: 4, end: 8, lens: 44 },
    { id: "candles", start: 8, end: 12, lens: 46 },
  ], 12, [
    { start: 1.0, end: 3.8, speaker: "ЦЭЦЭГМАА", text: "Өө, манай төөрсөн нөхөр ирдэг юм байна! Цаг харсан уу чи, айн?" },
    { start: 4.4, end: 7.2, speaker: "СҮХЭЭ", text: "Хөөе, Ганаа! Гурав дахь таваг шүү! Яасан, замдаа өлсгөлөн зарлацан уу?" },
    { start: 8.3, end: 11.6, speaker: "ЦЭЦЭГМАА", text: "Ганаа. Над руу хар даа. Бие чинь шатаж байна. Эмч дуудъя, за?" },
  ]),
  async build() {
    const { loadCharacter } = await import("./character.js");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x241c14, 4, 26);
    scene.background = new THREE.Color(0x14100c);
    lightInterior(scene, { warm: 0xffc880, level: 0.8 });

    const flat = buildRoom({ w: 6.5, d: 5, h: 2.9, wall: 1, floor: "linoleum", doorWidth: 1.0 });
    scene.add(flat);
    const lampLight = new THREE.PointLight(0xffb060, 2.4, 14, 1.5);
    lampLight.position.set(0, 2.2, 0);
    scene.add(lampLight);
    const lampShade = addBox(scene, 0.5, 0.35, 0.5, mat({ color: 0xd8b070, emissive: 0xff9a40, emissiveIntensity: 0.9 }), 0, 2.35, 0);

    const table = buildDesk({ w: 2.6 });
    table.position.set(-0.4, 0, -1.2);
    table.scale.y = 1.15;
    scene.add(table);
    // The roast, bottles, and the cake with lit candles.
    const roast = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), solid(0x8a5a34));
    roast.position.set(-0.9, 0.92, -1.2);
    scene.add(roast);
    for (const [x, z] of [[0.1, -1.5], [0.4, -1.1], [-0.1, -0.9]]) {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.32, 6), solid(0x2e5a38));
      bottle.position.set(x, 0.95, z);
      scene.add(bottle);
    }
    const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 8), solid(0xe8dcc8));
    cake.position.set(0.75, 0.86, -1.35);
    scene.add(cake);
    const candleFlames = [];
    for (let i = 0; i < 3; i++) {
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.02, 0.09, 5),
        new THREE.MeshBasicMaterial({ color: 0xffc050 })
      );
      flame.position.set(0.68 + i * 0.07, 1.0, -1.35);
      scene.add(flame);
      candleFlames.push(flame);
    }

    // Guests: blocky party crowd around the table and along the walls.
    const guests = [];
    const guestSpots = [
      [-2.2, 0.2, 0.6], [-1.6, 0.9, 1.4], [2.9, 0.7, 0.4], [2.4, -0.6, -0.9],
      [0.2, 1.7, 2.4], [-2.6, -1.6, -0.4], [2.7, 1.5, 1.1], [1.2, 1.9, -2.0],
    ];
    const rand = mulberry(4400);
    guestSpots.forEach(([x, z, yaw], i) => {
      const person = buildPerson({
        coat: [0x8a4038, 0x4a6a5a, 0x7a5a8a, 0xb08a3a, 0x3a5a78, 0x8a6a4a, 0x6a4a5a, 0x5a7a5a][i],
        hat: 0x8c2f24,
        pants: 0x3a3630,
        stance: true,
      });
      person.group.position.set(x, 0, z);
      person.group.rotation.y = yaw;
      scene.add(person.group);
      guests.push(person);
    });

    const ganaa = await loadCharacter({ id: "ganaa" });
    ganaa.group.position.set(-0.4, 0, -0.1);
    ganaa.group.rotation.y = Math.PI;
    scene.add(ganaa.group);
    const wife = await loadCharacter({ id: "tsetsegmaa" });
    wife.group.position.set(1.0, 0, 1.1);
    wife.group.rotation.y = Math.PI + 0.3;
    scene.add(wife.group);
    const altan = await loadCharacter({ id: "altan" });
    altan.group.position.set(0.35, 0.86, -0.55);
    altan.group.rotation.y = Math.PI;
    scene.add(altan.group);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      ganaa.setTime(time);
      wife.setTime(time);
      altan.setTime(time);
      for (const person of guests) {
        person.arms[0].rotation.x = Math.sin(time * 3 + person.group.position.x * 4) * 0.25 - 0.1;
        person.arms[1].rotation.x = -Math.sin(time * 3.4 + person.group.position.z * 4) * 0.25 - 0.1;
      }
      for (const flame of candleFlames) {
        flame.scale.y = 1 + Math.sin(time * 17 + flame.position.x * 40) * 0.25;
      }
      // Mid-song Ganaa goes slack at the cliffhanger.
      if (time > 10.4) {
        ganaa.group.rotation.z = Math.sin((time - 10.4) * 2) * 0.03;
      }
      const s = time < 4
        ? { id: "door", p: time / 4 }
        : time < 8 ? { id: "table", p: (time - 4) / 4 } : { id: "candles", p: (time - 8) / 4 };
      if (s.id === "door") {
        camera.position.set(1.8 - s.p * 0.6, 1.55, 2.4);
        camera.lookAt(-0.8, 1.2, -1.2);
      } else if (s.id === "table") {
        camera.position.set(1.9, 1.6, -0.4);
        camera.lookAt(-0.9, 0.95, -1.3);
      } else {
        camera.position.set(2.5 - s.p * 0.5, 1.5, 1.6 - s.p * 0.4);
        camera.lookAt(-0.1 + s.p * 0.25, 0.95, -1.1);
      }
    }

    return { scene, update, actor: () => ganaa };
  },
};

export const ACT_ONE_STAGES = {
  "ep1-yard": ep1Yard,
  "ep1-truckstop": ep1Truckstop,
  "ep1-apartment": ep1Apartment,
};

// EP3: the Governor's night — the locked bathroom, the office with the napkin,
// the privatization banquet that explodes, and the rooftop helipad above the
// square as the crowd surges and the Mi-8 lifts without them.
const GOV_SHOTS = [
  { id: "bathroom", start: 0, end: 4, lens: 40 },
  { id: "office", start: 4, end: 7, lens: 42 },
  { id: "banquet", start: 7, end: 10.5, lens: 44 },
  { id: "helipad", start: 10.5, end: 14, lens: 48 },
];

const ep3Governor = {
  id: "ep3-governor",
  duration: 14,
  shots: GOV_SHOTS,
  state: makeState(GOV_SHOTS, 14, [
    { start: 4.3, end: 6.7, speaker: "МИНИСТР", text: "Лхагва, намайг сайн сонс. Томуу гэж мэдээл. Тэгээд л болоо." },
    { start: 7.3, end: 9.2, speaker: "ЧИНБАТ", text: "Хөөе, согтуу ал аа! Бос! Тавгаа аваад яв!" },
    { start: 10.7, end: 13.4, speaker: "ИРГЭН 1", text: "Дарга аа! Автобус нь хаана байна аа?! Хэдэн цаг хүлээх юм?!" },
  ]),
  async build() {
    const { loadCharacter } = await import("./character.js");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1c1a22, 5, 40);
    scene.background = new THREE.Color(0x121016);
    lightInterior(scene, { warm: 0xd8b880, level: 0.7 });

    // Suite layout: bathroom west, office middle, banquet east, roof above.
    const bathroom = buildRoom({ w: 2.6, d: 2.8, h: 2.8, x: -6, z: -8, wall: 2, floor: "tile", doorWidth: 0.9 });
    bathroom.rotation.y = Math.PI;
    scene.add(bathroom);
    const office = buildRoom({ w: 4.5, d: 4, h: 2.9, x: -6.2, z: -3, wall: 1, floor: "wood", windowWidth: 1.6 });
    scene.add(office);
    const banquet = buildRoom({ w: 8, d: 6, h: 3.2, x: 2.5, z: -6, wall: 1, floor: "wood", doorWidth: 1.6 });
    banquet.rotation.y = -Math.PI / 2;
    scene.add(banquet);

    addBox(scene, 1.7, 0.55, 0.8, solid(0xe4e2d8), -6, 0.28, -8.8);
        const enkhee = buildStandingFigure({ x: 0, z: 0, seed: 31, state: "grey" });
    enkhee.rotation.x = Math.PI / 2;
    enkhee.position.set(-6, 0.62, -8.8);
    scene.add(enkhee);

    const desk = buildDesk({ w: 2.0 });
    desk.position.set(-6.2, 0, -2.2);
    scene.add(desk);
    const chairG = buildChair();
    chairG.position.set(-6.2, 0, -1.4);
    chairG.rotation.y = Math.PI;
    scene.add(chairG);
    const napkin = addBox(scene, 0.26, 0.005, 0.3, solid(0xe8e0cc), -5.7, 0.785, -2.2);
    napkin.rotation.y = 0.4;
        
    // Banquet: long table, bottles and glasses, suited guests.
    addBox(scene, 4.6, 0.08, 1.2, solid(0x6a5038), 2.5, 0.76, -6);
    for (const [x, z] of [[0.9, -6], [1.9, -6], [2.9, -6], [3.9, -6]]) {
      addBox(scene, 0.1, 0.72, 0.1, solid(0x4a3a28), x, 0.36, z - 0.45);
      addBox(scene, 0.1, 0.72, 0.1, solid(0x4a3a28), x, 0.36, z + 0.45);
    }
    const rand = mulberry(3003);
    for (let i = 0; i < 7; i++) {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 6), solid(0x2e5a38));
      bottle.position.set(0.9 + i * 0.6, 0.95, -6 + (i % 2 ? 0.25 : -0.25));
      scene.add(bottle);
      for (const side of [-1, 1]) {
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.14, 5), solid(0xc8d4d4, { transparent: true, opacity: 0.55 }));
        glass.position.set(0.9 + i * 0.6, 0.87, -6 + side * (0.5 + rand() * 0.06));
        scene.add(glass);
      }
    }
    const guests = [];
    for (let i = 0; i < 6; i++) {
      const person = buildPerson({
        coat: [0x2a3038, 0x3a3a42, 0x30383a, 0x38322c, 0x2c3038, 0x40383c][i],
        hat: 0x2a2a28,
        pants: 0x26282c,
        stance: true,
      });
      person.group.position.set(0.7 + i * 0.72, 0, -6 + (i % 2 ? 1.15 : -1.15));
      person.group.rotation.y = i % 2 ? -Math.PI / 2 + 0.15 : Math.PI / 2 - 0.15;
      scene.add(person.group);
      guests.push(person);
    }
    const waiter = await loadCharacter({ id: "banquet-waiter" });
    waiter.group.position.set(2.6, 0, -4.6);
    waiter.group.rotation.y = Math.PI;
    scene.add(waiter.group);

    // Rooftop helipad: pad circle, the Mi-8 with turning rotors, the crowd
    // pouring up the stairwell below the pad edge.
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), floorMaterial("concrete"));
    roof.rotation.x = -Math.PI / 2;
    roof.position.set(2.5, 3.2, -14.5);
    scene.add(roof);
    const padRing = new THREE.Mesh(
      new THREE.RingGeometry(3.4, 3.7, 24),
      new THREE.MeshBasicMaterial({ color: 0xe8e0c8 })
    );
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.set(2.5, 3.26, -14.5);
    scene.add(padRing);
    const heli = buildHelicopter(0x4e5a52);
    heli.position.set(2.5, 3.2, -14.5);
    heli.rotation.y = 0.6;
    scene.add(heli);
    const padLight = new THREE.SpotLight(0xfff0d0, 4, 18, 0.5, 0.5, 1.4);
    padLight.position.set(2.5, 8, -14.5);
    const padTarget = new THREE.Object3D();
    padTarget.position.set(2.5, 3.2, -14.5);
    scene.add(padTarget, padLight);
    padLight.target = padTarget;
    const squareCrowd = buildCrowd({
      positions: crowdRows({ origin: [-4, -20], dir: [1, -0.25], across: 8, rows: 3, spacing: 1.6, seed: 42 }),
      seed: 42,
      state: "grey",
    });
    scene.add(squareCrowd);

    const lkhagva = await loadCharacter({ id: "lkhagva" });
    lkhagva.group.position.set(-6.2, 0, -3.6);
    lkhagva.group.rotation.y = 0.2;
    scene.add(lkhagva.group);

    const updateSteamPad = attachSteam(scene, [heli], { strength: 1.6, height: 3.4 });

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateSteamPad(time);
      lkhagva.setTime(time);
      waiter.setTime(time);
      heli.userData.rotor.rotation.y += 0.55;
      heli.userData.tailRotor.rotation.x += 0.9;
      // The banquet tips over mid-shot: guests convulse toward the table.
      const panic = clamp01((time - 8.2) / 1.6);
      guests.forEach((person, i) => {
        person.group.rotation.z = panic * Math.sin(time * 9 + i * 1.7) * 0.14;
        person.torso.rotation.x = panic * 0.3;
      });
      const s = time < 4
        ? { id: "bathroom", p: time / 4 }
        : time < 7 ? { id: "office", p: (time - 4) / 3 }
          : time < 10.5 ? { id: "banquet", p: (time - 7) / 3.5 }
            : { id: "helipad", p: (time - 10.5) / 3.5 };
      if (s.id === "bathroom") {
        camera.position.set(-4.4, 1.5, -6.8);
        camera.lookAt(-6, 0.8, -8.6);
      } else if (s.id === "office") {
        camera.position.set(-3.6, 1.55, -1.4);
        camera.lookAt(-6.2, 1.1, -2.6);
      } else if (s.id === "banquet") {
        camera.position.set(6.2, 1.7, -3.2);
        camera.lookAt(2.2, 1.0, -6.2);
      } else {
        camera.position.set(7.2 - s.p * 2.0, 7.6 - s.p * 1.4, -9.0 - s.p * 1.2);
        camera.lookAt(2.5, 3.8, -14.6);
      }
    }

    return { scene, update, actor: () => lkhagva };
  },
};

// EP4: School No. 2 — the classroom hook, the vote in the hall, the green
// night gym, and the boiler room confession before the coal chute.
const SCHOOL_SHOTS = [
  { id: "classroom", start: 0, end: 3.5, lens: 40 },
  { id: "hall", start: 3.5, end: 7, lens: 42 },
  { id: "gym", start: 7, end: 10, lens: 46 },
  { id: "boiler", start: 10, end: 12, lens: 48 },
];

const ep4School = {
  id: "ep4-school",
  duration: 12,
  shots: SCHOOL_SHOTS,
  state: makeState(SCHOOL_SHOTS, 12, [
    { start: 0.8, end: 3.0, speaker: "АНУ", text: "Номин, наашаа хар! За, Наран хотын хоёрдугаар сургуулиас шууд дамжуулж байна!" },
    { start: 4.2, end: 6.6, speaker: "ЗАХИРАЛ", text: "Хөөж гаргая гэвэл?" },
    { start: 10.3, end: 11.8, speaker: "АНУ", text: "Би... Мөнхийг гаргая гэдэг дээр гараа өргөсөн." },
  ]),
  async build() {
    const { loadCharacter } = await import("./character.js");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1e2420, 4, 30);
    scene.background = new THREE.Color(0x121614);
    lightInterior(scene, { warm: 0xc8d4c0, level: 0.75 });

    // One corridor spine with classroom, hall, and a stair down to the boiler.
    const spine = buildRoom({ w: 2.6, d: 18, h: 3, x: 0, z: -9, wall: 0, floor: "linoleum" });
    scene.add(spine);
    for (const z of [-3, -9, -15]) {
      const tube = buildTubeLight(1.2, (z + 3) / 6);
      tube.position.set(0, 2.96, z);
      scene.add(tube);
    }
    const classroom = buildRoom({ w: 6, d: 5, h: 3, x: -4.5, z: -3.5, wall: 1, floor: "linoleum", doorWidth: 1.1 });
    classroom.rotation.y = Math.PI / 2;
    scene.add(classroom);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const desk = buildDesk({ w: 1.1 });
        desk.position.set(-3.2 + col * 2.2, 0, -2.6 - row * 1.2);
        classroom.add(desk);
        const chair = buildChair();
        chair.position.set(-3.2 + col * 2.2, 0, -2.0 - row * 1.2);
        chair.rotation.y = Math.PI;
        classroom.add(chair);
      }
    }
    const chalkboard = buildChalkboard({ w: 2.6 });
    chalkboard.position.set(-6.8, 0, -3.5);
    chalkboard.rotation.y = Math.PI / 2;
    classroom.add(chalkboard);

    const hall = buildRoom({ w: 7, d: 6, h: 3.2, x: 5.2, z: -6, wall: 0, floor: "wood", doorWidth: 1.3 });
    hall.rotation.y = -Math.PI / 2;
    scene.add(hall);
    const trophy = buildCabinet();
    trophy.position.set(5.4, 0, -8.2);
    trophy.rotation.y = Math.PI / 2;
    hall.add(trophy);
    const rand = mulberry(4004);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const pupil = buildPerson({
          coat: [0x2b3a4a, 0x4a3038, 0x30403a, 0x3a3a4a][row % 4],
          hat: 0x22201e,
          pants: 0x2a2c30,
          stance: true,
          child: true,
          scale: 0.8,
        });
        pupil.group.position.set(3.6 + col * 1.1, 0, -4.0 - row * 1.1);
        pupil.group.rotation.y = -Math.PI / 2 + (rand() - 0.5) * 0.5;
        hall.add(pupil.group);
      }
    }

    // Gym: dark, green-tinted, rows of sleeping bags (lying figures).
    const gym = buildRoom({ w: 9, d: 7, h: 3.4, x: 6, z: -16, wall: 2, floor: "wood", doorWidth: 1.3 });
    gym.rotation.y = -Math.PI / 2;
    scene.add(gym);
    const gymGlow = new THREE.PointLight(0x9ac8a8, 0.7, 16, 1.6);
    gymGlow.position.set(6, 2.6, -16);
    scene.add(gymGlow);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const sleeper = buildStandingFigure({ x: 0, z: 0, seed: 50 + row * 5 + col, state: "white" });
        sleeper.rotation.x = Math.PI / 2;
        sleeper.rotation.z = (rand() - 0.5) * 0.2;
        sleeper.position.set(2.8 + col * 1.5, 0.3, -14.2 - row * 1.6);
        scene.add(sleeper);
      }
    }
    // The PE teacher stands at the equipment-room glass.
    const teacher = buildStandingFigure({ x: 0, z: 0, seed: 88, state: "white" });
    teacher.position.set(3.2, 0, -12.4);
    teacher.rotation.y = -Math.PI / 2;
    scene.add(teacher);

    // Boiler room below: the boiler, the pipe, the coal chute.
    const boilerRoom = buildRoom({ w: 4, d: 4.5, h: 2.6, x: -4, z: -14.5, wall: 2, floor: "concrete", doorWidth: 1.0 });
    boilerRoom.rotation.y = Math.PI / 2;
    scene.add(boilerRoom);
    addBox(scene, 1.4, 1.9, 1.2, mat({ color: 0x4a3c34, emissive: 0x6a2a10, emissiveIntensity: 0.35 }), -5.4, 0.95, -15.6);
    const pipe = buildBoilerPipe({ length: 3, y: 1.6 });
    pipe.position.set(-4.6, 0, -13.6);
    pipe.rotation.y = Math.PI / 2;
    scene.add(pipe);
    addBox(scene, 1.1, 0.5, 0.9, solid(0x2c2a28), -2.6, 0.25, -15.9);
    const chute = buildLaundryHatch({ width: 0.7, height: 0.6 });
    chute.position.set(-4.0, 2.0, -12.35);
    chute.rotation.y = Math.PI / 2;
    scene.add(chute);
    const boilerGlow = new THREE.PointLight(0xff7a30, 1.2, 9, 1.5);
    boilerGlow.position.set(-5.2, 1.2, -15.2);
    scene.add(boilerGlow);

    const anu = await loadCharacter({ id: "anu" });
    anu.group.position.set(-3.6, 0, -13.6);
    anu.group.rotation.y = Math.PI + 0.4;
    scene.add(anu.group);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      anu.setTime(time);
      // Shot four is Anu's confession to her own lens.
      const s = time < 3.5
        ? { id: "classroom", p: time / 3.5 }
        : time < 7 ? { id: "hall", p: (time - 3.5) / 3.5 }
          : time < 10 ? { id: "gym", p: (time - 7) / 3 }
            : { id: "boiler", p: (time - 10) / 2 };
      if (s.id === "classroom") {
        camera.position.set(-1.6, 1.5, -1.4 - s.p * 0.6);
        camera.lookAt(-5.4, 1.1, -3.6);
      } else if (s.id === "hall") {
        camera.position.set(2.4, 1.7, -3.6);
        camera.lookAt(5.6, 1.2, -6.4);
      } else if (s.id === "gym") {
        camera.position.set(1.7, 1.5, -16 + s.p * 0.6);
        camera.lookAt(6.6, 0.65, -16.9);
      } else {
        camera.position.set(-2.6, 1.4, -12.6);
        camera.lookAt(-3.7, 1.15, -13.9);
      }
    }

    return { scene, update, actor: () => anu };
  },
};

// EP5: the cordon at night — sandbags and rope, the bazaar queue, Bayar's UAZ,
// and the field of the Standing waking behind the line.
const CORDON_SHOTS = [
  { id: "queue", start: 0, end: 4.5, lens: 40 },
  { id: "barrier", start: 4.5, end: 8, lens: 44 },
  { id: "field", start: 8, end: 12, lens: 46 },
];

const ep5Cordon = {
  id: "ep5-cordon",
  duration: 12,
  shots: CORDON_SHOTS,
  state: makeState(CORDON_SHOTS, 12, [
    { start: 1.0, end: 4.2, speaker: "БАЯР", text: "За, дараагийнх! Том хүн нэг шуудай гурил! Хүүхэд тал!" },
    { start: 5.2, end: 7.6, speaker: "ЖАРГАЛ", text: "Харав уу? Танилтай л бол ямар ч гурил хэрэггүй. Гоё биз?" },
    { start: 9.0, end: 11.4, speaker: "ЭРДЭНЭ", text: "...Би... би сая хүн буудчихлаа ш дээ..." },
  ], {
    location: time => clamp01(1 - Math.abs(time - 1.6) / 1.0),
  }),
  async build() {
    const { loadCharacter } = await import("./character.js");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb8bec2, 4, 34);
    scene.background = new THREE.Color(0x8e959b);
    lightInterior(scene, { warm: 0xc9ccd0, level: 0.55 });

    const ground = groundPlane(70, 44, mat({ map: cloneRepeat(dirtTexture(), 18, 12), color: 0x9a9488 }), 0, 0, 0);
    scene.add(ground);

    // Sandbag wall across the road with a rope line and lantern.
    const rand = mulberry(5005);
    const burlap = mat({ map: cloneRepeat(concreteTexture("#b0a888"), 1, 1) });
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 12; i++) {
        const bag = addBox(scene, 0.62, 0.26, 0.36, burlap,
          -4.6 + i * 0.72 + (rand() - 0.5) * 0.08, 0.15 + row * 0.24, 0);
        bag.rotation.y = (rand() - 0.5) * 0.14;
      }
    }
    for (const x of [-4.8, 4.8]) {
      addBox(scene, 0.14, 1.9, 0.14, solid(0x5a4632), x, 0.95, 0);
    }
    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 9.6, 5),
      solid(0x8a7858)
    );
    rope.rotation.z = Math.PI / 2;
    rope.position.set(0, 1.55, 0);
    scene.add(rope);
    const lanternGlow = new THREE.PointLight(0xffb060, 1.1, 9, 1.5);
    lanternGlow.position.set(-2.4, 1.35, 0.35);
    scene.add(lanternGlow);
    const lantern = new THREE.Group();
    addBox(lantern, 0.14, 0.05, 0.14, solid(0x3c3a34), 0, 0.13, 0);
    addBox(lantern, 0.1, 0.16, 0.1,
      mat({ color: 0xd8b070, emissive: 0xffb050, emissiveIntensity: 0.55 }), 0, 0.02, 0);
    lantern.position.set(-2.4, 1.32, 0.35);
    scene.add(lantern);

    // Bayar's UAZ at the barrier.
    const uaz = buildUAZ(0x4a5a38);
    uaz.position.set(3.2, 0, -2.2);
    uaz.rotation.y = 0.12;
    scene.add(uaz);
    for (const x of [-1.2, 1.2]) {
      addBox(uaz, 0.5, 0.36, 0.36, mat({ map: cloneRepeat(concreteTexture("#c8b890"), 1, 1) }), x, 1.05, -0.3);
    }

    // The bazaar queue winding back into the fog.
    const queueSpots = [];
    for (let i = 0; i < 34; i++) {
      const row = (i / 6) | 0;
      const col = i % 6;
      queueSpots.push([
        -3.4 + col * 1.15 + (rand() - 0.5) * 0.5,
        1.8 + row * 1.5 + (rand() - 0.5) * 0.6,
        Math.PI,
      ]);
    }
    const queue = buildCrowd({ positions: queueSpots, seed: 6, state: "grey" });
    scene.add(queue);

    // The field of the Standing behind the line, waking.
    const field = buildCrowd({
      positions: crowdRows({ origin: [-8, -14], dir: [0.2, -1], across: 10, rows: 4, spacing: 2.1, seed: 8 }),
      seed: 8,
      state: "white",
    });
    scene.add(field);
    const nearField = crowdRows({ origin: [-8, -14], dir: [0.2, -1], across: 10, rows: 4, spacing: 2.1, seed: 8 }).slice(0, 3)
      .map(([x, z]) => {
        const anchor = new THREE.Object3D();
        anchor.position.set(x, 0, z);
        scene.add(anchor);
        return anchor;
      });
    const updateSteamField = attachSteam(scene, nearField, { strength: 0.8, height: 1.5 });

    const bayar = await loadCharacter({ id: "bayar" });
    bayar.group.position.set(-1.6, 0, 0.9);
    bayar.group.rotation.y = Math.PI - 0.3;
    scene.add(bayar.group);
    const erdene = await loadCharacter({ id: "erdene" });
    erdene.group.position.set(-3.6, 0, 0.7);
    erdene.group.rotation.y = Math.PI - 0.5;
    scene.add(erdene.group);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateSteamField(time);
      bayar.setTime(time);
      erdene.setTime(time);
      const s = time < 4.5
        ? { id: "queue", p: time / 4.5 }
        : time < 8 ? { id: "barrier", p: (time - 4.5) / 3.5 } : { id: "field", p: (time - 8) / 4 };
      if (s.id === "queue") {
        camera.position.set(1.8, 1.7, 6.5 - s.p * 2);
        camera.lookAt(-1.5, 1.2, 0.5);
      } else if (s.id === "barrier") {
        camera.position.set(-5.6, 1.55, 3.2);
        camera.lookAt(1.4, 1.1, -0.9);
      } else {
        camera.position.set(-4.6, 1.6, -6.5 - s.p * 1.2);
        camera.lookAt(-7.8, 1.3, -14.5);
      }
    }

    return { scene, update, actor: () => bayar };
  },
};

// EP6: the Gorge. A narrow rock pass at night; the family rides the ridge,
// then a hero stand at the gorge mouth while fresh runners pour in. Episode 6
// has no approved dialogue yet, so the staging stays silent.
const GORGE_SHOTS = [
  { id: "ridge", start: 0, end: 4, lens: 42 },
  { id: "mouth", start: 4, end: 8, lens: 44 },
  { id: "hold", start: 8, end: 11, lens: 46 },
];

const ep6Gorge = {
  id: "ep6-gorge",
  duration: 11,
  shots: GORGE_SHOTS,
  state: makeState(GORGE_SHOTS, 11, []),
  async build() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x181c24, 5, 46);
    scene.background = new THREE.Color(0x0e1118);
    lightInterior(scene, { warm: 0x9ab0c8, level: 0.45 });
    const moon = new THREE.DirectionalLight(0xaec4dc, 0.55);
    moon.position.set(-14, 22, 8);
    scene.add(moon);
    const rand = mulberry(6006);

    const ground = groundPlane(50, 34, mat({ map: cloneRepeat(dirtTexture(), 14, 10), color: 0x6e6a60 }), 0, 0, 0);
    scene.add(ground);

    // The pass: two craggy walls squeezing to a narrow mouth along z.
    const stone = (await import("./parts.js")).stoneMaterial();
    const wallGeo = (seed) => {
      const geo = new THREE.IcosahedronGeometry(3.4, 1);
      const pos = geo.attributes.position;
      const r = mulberry(seed);
      for (let i = 0; i < pos.count; i++) {
        const k = 1 + (r() - 0.5) * 0.55;
        pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * (1.1 + r() * 0.5), pos.getZ(i) * k);
      }
      geo.computeVertexNormals();
      return geo;
    };
    for (let i = 0; i < 7; i++) {
      const west = new THREE.Mesh(wallGeo(100 + i), stone);
      west.position.set(-7.5 - rand() * 1.5, 2.2 + rand() * 1.4, -13 + i * 3.6);
      west.rotation.y = rand() * 3;
      scene.add(west);
      const east = new THREE.Mesh(wallGeo(200 + i), stone);
      east.position.set(7.5 + rand() * 1.5, 2.2 + rand() * 1.4, -13 + i * 3.6);
      east.rotation.y = rand() * 3;
      scene.add(east);
    }

    // The family riding the ridge line, wrapped hooves, felt steadying.
    const riders = [];
    const riderSpots = [[-9, 4.5], [-10.5, 2.6], [-8, 0.8], [-11, -1.2]];
    riderSpots.forEach(([x, z], i) => {
      const horse = buildHorse();
      horse.scale.setScalar(0.92 + (i % 2) * 0.06);
      horse.position.set(x, 0, z);
      horse.rotation.y = -Math.PI / 2 + 0.3;
      scene.add(horse);
      const rider = buildPerson({ coat: [0x8c5a32, 0x4a5a78, 0x8a4038, 0x3a5a48][i], hat: 0x8c2f24 });
      rider.group.position.set(x, 0.86, z);
      rider.group.rotation.y = -Math.PI / 2 + 0.3;
      scene.add(rider.group);
      riders.push({ horse, rider });
    });

    // Fresh runners pouring into the mouth of the gorge.
    const pour = buildCrowd({
      positions: crowdRows({ origin: [0, -20], dir: [0, 1], across: 4, rows: 5, spacing: 1.9, seed: 61 }),
      seed: 61,
      state: "red",
    });
    scene.add(pour);
    // The hero stand: one figure, arms folded, in the mouth of the pass.
    const hero = buildPerson({ coat: 0x6a4a30, hat: 0x2a2a28, stance: true });
    hero.group.position.set(0, 0, -9.5);
    hero.group.rotation.y = Math.PI;
    hero.arms[0].rotation.z = 1.1;
    hero.arms[1].rotation.z = -1.1;
    scene.add(hero.group);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      const s = time < 4
        ? { id: "ridge", p: time / 4 }
        : time < 8 ? { id: "mouth", p: (time - 4) / 4 } : { id: "hold", p: (time - 8) / 3 };
      if (s.id === "ridge") {
        riders.forEach(({ horse, rider }, i) => {
          const drift = s.p * 3.2;
          horse.position.z = riderSpots[i][1] + drift;
          rider.group.position.z = riderSpots[i][1] + drift;
          rider.group.position.y = 0.86 + Math.sin(time * 9 + i) * 0.04;
        });
        camera.position.set(-4, 3.2, 12 - s.p * 2);
        camera.lookAt(-9.5, 1.2, 2);
      } else if (s.id === "mouth") {
        camera.position.set(2.6, 1.8, -4.4);
        camera.lookAt(0, 1.3, -9.6);
      } else {
        camera.position.set(-3.2 + s.p * 0.6, 1.6, -6.8);
        camera.lookAt(0.2, 1.25, -12.5);
      }
    }

    return { scene, update };
  },
};

// EP10: the dzud. Winter camp in a white-out, the frozen lake with the
// Standing caught in the ice, and the north pass vista over the steaming
// Warm Valley. Silent staging until the Act II dialogue is written.
const DZUD_SHOTS = [
  { id: "camp", start: 0, end: 5.5, lens: 40 },
  { id: "lake", start: 5.5, end: 10.5, lens: 44 },
  { id: "pass", start: 10.5, end: 16, lens: 48 },
];

const ep10Dzud = {
  id: "ep10-dzud",
  duration: 16,
  shots: DZUD_SHOTS,
  state: makeState(DZUD_SHOTS, 16, [], {
    location: time => clamp01(1 - Math.abs(time - 1.5) / 1.0),
  }),
  async build() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xc8d2da, 7, 80);
    scene.background = new THREE.Color(0xb2bec8);
    lightInterior(scene, { warm: 0xd8e0ea, level: 0.8 });
    scene.add(new THREE.DirectionalLight(0xe8f0f8, 0.7).translateX(-10).translateY(24).translateZ(-6));
    const rand = mulberry(1010);

    const snowGround = groundPlane(80, 120, mat({ map: cloneRepeat(snowTexture(), 18, 26) }), 0, -20, 0);
    scene.add(snowGround);

    // Winter camp: three gers, smoke, wood, horses hobbled in the white.
    for (const [x, z, s] of [[-5, -2, 0.95], [0.5, 1.5, 1.05], [-1.5, -7, 0.9]]) {
      const ger = buildGer(s);
      ger.position.set(x, 0, z);
      ger.rotation.y = rand() * 1.5;
      scene.add(ger);
      const shadow = contactShadow(5.4, 5.4, 0.22);
      shadow.position.set(x, 0.05, z);
      scene.add(shadow);
      const gerSmoke = new THREE.Object3D();
      gerSmoke.position.set(x - 1.0 * s, 3.4 * s, z - 0.5 * s);
      scene.add(gerSmoke);
      gerSmoke.userData.campSmoke = true;
    }
    const wood = buildWoodpile();
    wood.position.set(2.8, 0, -3.5);
    scene.add(wood);
    const campHorses = [];
    for (let i = 0; i < 3; i++) {
      const horse = buildHorse();
      horse.scale.setScalar(0.9);
      horse.position.set(4.5 + i * 1.4, 0, -8 + (i % 2) * 1.2);
      horse.rotation.y = rand() * 2;
      scene.add(horse);
      campHorses.push(horse);
    }
    const campSmokeAnchors = scene.children.filter(o => o.userData.campSmoke);
    const updateCampSteam = attachSteam(scene, campSmokeAnchors, { strength: 1.1, height: 0 });

    // Frozen lake: translucent ice with the Standing caught beneath it.
    const lakeIce = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 14),
      new THREE.MeshLambertMaterial({ color: 0xbdd2da, transparent: true, opacity: 0.55 })
    );
    lakeIce.rotation.x = -Math.PI / 2;
    lakeIce.position.set(-2, 0.06, -24);
    scene.add(lakeIce);
    const lakeBed = groundPlane(26, 14, solid(0x5a6870), -2, -24, -0.9);
    scene.add(lakeBed);
    const iceFigures = [];
    const iceSpots = [];
    for (let i = 0; i < 12; i++) {
      iceSpots.push([
        -13 + rand() * 22,
        -30 + rand() * 11,
        rand() * Math.PI * 2,
      ]);
    }
    for (const [x, z, yaw] of iceSpots) {
      const figure = buildStandingFigure({ x, z, yaw, seed: 30 + iceFigures.length, state: "white" });
      figure.position.y = -0.55;
      scene.add(figure);
      iceFigures.push(figure);
    }

    // Blizzard: hard white streaks crossing the wind.
    const flakes = [];
    for (let i = 0; i < 26; i++) {
      const flake = new THREE.Mesh(
        new THREE.PlaneGeometry(0.34, 0.03),
        new THREE.MeshBasicMaterial({ color: 0xf2f6fa, transparent: true, opacity: 0.5, depthWrite: false })
      );
      flake.userData.seed = rand() * 10;
      scene.add(flake);
      flakes.push(flake);
    }

    // North pass vista: the valley beyond, breathing steam in the cold.
    for (let i = 0; i < 7; i++) {
      const column = new THREE.Object3D();
      column.position.set(-22 + i * 6 + rand() * 2.5, 0, -46 - rand() * 10);
      scene.add(column);
      column.userData.vapor = true;
    }
    const vaporAnchors = scene.children.filter(o => o.userData.vapor);
    const updateVapor = attachSteam(scene, vaporAnchors, { strength: 2.2, height: 0 });
    const valleyGlow = new THREE.PointLight(0xffb060, 1.6, 44, 1.2);
    valleyGlow.position.set(-6, 3, -52);
    scene.add(valleyGlow);

    function update(time, camera) {
      updateTubeLights(time);
      updateInfected(time);
      updateCampSteam(time);
      updateVapor(time);
      for (const flake of flakes) {
        const t = time * (5 + flake.userData.seed) + flake.userData.seed * 20;
        flake.position.set(
          -30 + ((t * 4 + flake.userData.seed * 50) % 60),
          0.4 + flake.userData.seed % 3.4,
          -34 + ((t * 2.4 + flake.userData.seed * 30) % 44)
        );
        flake.rotation.y = t;
        flake.material.opacity = 0.28 + 0.22 * Math.sin(t * 2 + flake.userData.seed);
      }
      const s = time < 5.5
        ? { id: "camp", p: time / 5.5 }
        : time < 10.5 ? { id: "lake", p: (time - 5.5) / 5 } : { id: "pass", p: (time - 10.5) / 5.5 };
      if (s.id === "camp") {
        camera.position.set(8 - s.p * 3, 2.2, 6 - s.p * 2);
        camera.lookAt(-2, 1.4, -3);
      } else if (s.id === "lake") {
        camera.position.set(9.5, 1.7, -16.5 - s.p * 3);
        camera.lookAt(-3, 0.4, -25);
      } else {
        camera.position.set(4, 6.5 + s.p * 3.5, -32 + s.p * 2);
        camera.lookAt(-8, 1.5, -52);
      }
    }

    return { scene, update };
  },
};

export const ACT_STAGES = {
  ...ACT_ONE_STAGES,
  "ep3-governor": ep3Governor,
  "ep4-school": ep4School,
  "ep5-cordon": ep5Cordon,
  "ep6-gorge": ep6Gorge,
  "ep10-dzud": ep10Dzud,
};
