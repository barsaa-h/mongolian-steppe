import * as THREE from "three";
import {
  addBox,
  asphaltMaterial,
  buildAntenna,
  buildBarrel,
  buildBench,
  buildCar,
  buildClothesline,
  buildCoalPile,
  buildCrate,
  buildDog,
  buildFenceRun,
  buildGate,
  buildGer,
  buildGrassTuft,
  buildHorse,
  buildLeafCarpet,
  buildLeafScatter,
  buildOuthouse,
  buildPaperScrap,
  buildPerson,
  buildPowerPole,
  buildRock,
  buildSatelliteDish,
  buildSheep,
  buildSlide,
  buildSwingSet,
  buildSandbox,
  buildTumblingLeaf,
  buildTrashCan,
  buildTree,
  buildWeedTuft,
  buildWoodpile,
  contactShadow,
  dirtMaterial,
  groundPlane,
  groundWearMaterial,
  mulberry,
  plasterMaterial,
  signMaterial,
  solid,
  terraceWearMaterial,
  trackWearMaterial,
} from "./parts.js";
import {
  buildApartment,
  buildArch,
  buildBusStop,
  buildCordon,
  buildDumpster,
  buildGovernorHall,
  buildHeatingPlant,
  buildHelipad,
  buildHospital,
  buildKiosk,
  buildMarketStall,
  buildPipeRun,
  buildSchool,
  buildSchoolGym,
  buildSelfBuiltHouse,
  buildStore,
  buildUtilityBox,
  buildWaterKiosk,
  buildWaterTower,
} from "./structures.js";
import { terrainHeight } from "./terrain.js";
import { glowTexture } from "./textures.js";

const UP = new THREE.Vector3(0, 1, 0);
const PAD_X0 = -102;
const PAD_X1 = 102;
const TONES = ["blue", "green", "warm", "red", "white", "grey"];
const ROOFS = ["#8c3a2c", "#2f5e86", "#2f6a44", "#6a6860"];

export const SOUTH_ROWS = [
  { z: 20, y: 0, z0: 8.8, z1: 29 },
  { z: 43, y: 1.25, z0: 34, z1: 52 },
  { z: 66, y: 2.65, z0: 57, z1: 75 },
  { z: 89, y: 4.15, z0: 80, z1: 98 },
];
export const SOUTH_COLS = [-85, -67, -49, -31, -13, 13, 31, 49, 67, 85];
export const NORTH_ROW = { z: -84, y: 1.55, z0: -93, z1: -75 };
export const NORTH_COLS = [-90, -72, -54, -36, -18, 18, 36, 54, 72, 90];

const PLAYGROUND = { x: 13, z: 43 };

export function townHeight(x, z) {
  if (x < PAD_X0 - 2 || x > PAD_X1 + 2) return 0;
  if (z >= NORTH_ROW.z0 && z <= NORTH_ROW.z1) return NORTH_ROW.y;
  if (z > NORTH_ROW.z1 && z < -67) {
    const u = (z - NORTH_ROW.z1) / (-67 - NORTH_ROW.z1);
    return NORTH_ROW.y * (1 - u);
  }
  const rows = SOUTH_ROWS;
  if (z <= rows[0].z0) return 0;
  if (z >= rows[rows.length - 1].z1) return z < 106 ? rows[rows.length - 1].y : 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (z >= row.z0 && z <= row.z1) return row.y;
    const next = rows[i + 1];
    if (next && z > row.z1 && z < next.z0) {
      const u = (z - row.z1) / (next.z0 - row.z1);
      return row.y + (next.y - row.y) * u;
    }
  }
  return 0;
}

export function surfaceHeight(x, z) {
  if (Math.abs(x) > 102 && Math.abs(x) < 120) {
    const terrace = townHeight(Math.sign(x) * 102, z);
    const blend = THREE.MathUtils.smoothstep(Math.abs(x), 102, 120);
    return THREE.MathUtils.lerp(terrace, terrainHeight(x, z), blend);
  }
  const terrace = townHeight(x, z);
  if (terrace > 0.02) return terrace;
  return terrainHeight(x, z);
}

export function inTown(x, z) {
  return Math.abs(x) < 168 && z > -112 && z < 122;
}

function addTri(list, a, b, c) {
  list.push(...a, ...b, ...c);
}

function wedge(scene, z0, z1, y0, y1) {
  const x0 = PAD_X0;
  const x1 = PAD_X1;
  const verts = [];
  addTri(verts, [x0, y0, z0], [x0, y1, z1], [x1, y0, z0]);
  addTri(verts, [x1, y0, z0], [x0, y1, z1], [x1, y1, z1]);
  addTri(verts, [x0, 0, z0], [x1, 0, z0], [x1, 0, z1]);
  addTri(verts, [x0, 0, z0], [x1, 0, z1], [x0, 0, z1]);
  if (y0 > 0.05) {
    addTri(verts, [x0, 0, z0], [x1, y0, z0], [x1, 0, z0]);
    addTri(verts, [x0, 0, z0], [x0, y0, z0], [x1, y0, z0]);
  }
  if (y1 > 0.05) {
    addTri(verts, [x0, 0, z1], [x1, 0, z1], [x1, y1, z1]);
    addTri(verts, [x0, 0, z1], [x1, y1, z1], [x0, y1, z1]);
  }
  addTri(verts, [x0, 0, z0], [x0, 0, z1], [x0, y1, z1]);
  addTri(verts, [x0, 0, z0], [x0, y1, z1], [x0, y0, z0]);
  addTri(verts, [x1, 0, z0], [x1, y0, z0], [x1, y1, z1]);
  addTri(verts, [x1, 0, z0], [x1, y1, z1], [x1, 0, z1]);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
  const uv = new Float32Array((verts.length / 3) * 2);
  for (let i = 0; i < verts.length / 3; i++) {
    uv[i * 2] = (verts[i * 3] - x0) / (x1 - x0);
    uv[i * 2 + 1] = (verts[i * 3 + 2] - z0) / Math.max(0.001, z1 - z0);
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  scene.add(new THREE.Mesh(geo, dirtMaterial(16, 2)));
}

function terrace(scene, z0, z1, y) {
  const depth = z1 - z0;
  const width = PAD_X1 - PAD_X0;
  const z = (z0 + z1) / 2;
  if (y > 0.2) {
    addBox(scene, width, y, depth, solid(0x95866d), 0, y / 2, z);
  }
  scene.add(groundPlane(width, depth, dirtMaterial(18, 6), 0, z, y + 0.03));
  scene.add(groundPlane(9, depth - 0.4, dirtMaterial(2, 8), 0, z, y + 0.055));
  // Large faint wear blotches so the terrace dirt does not read as one flat sheet.
  const rand = mulberry(Math.round(z * 17 + y * 31) + 101);
  const patches = 4 + ((rand() * 3) | 0);
  for (let i = 0; i < patches; i++) {
    const patch = groundPlane(
      7 + rand() * 10,
      4 + rand() * 5,
      terraceWearMaterial(),
      (rand() - 0.5) * (width - 26),
      z + (rand() - 0.5) * (depth - 6),
      y + 0.04 + i * 0.0015
    );
    patch.rotation.z = rand() * Math.PI;
    scene.add(patch);
  }
}

function terraceBanks(scene) {
  for (const side of [-1, 1]) {
    const positions = [];
    for (let z = 8.8; z < 98; z += 1) {
      const z1 = Math.min(z + 1, 98);
      const point = (x, z) => [x, surfaceHeight(x, z) + 0.04, z];
      const a = point(side * 102, z), b = point(side * 120, z);
      const c = point(side * 102, z1), d = point(side * 120, z1);
      const triangles = side > 0 ? [a, c, b, b, c, d] : [a, b, c, b, d, c];
      for (const p of triangles) positions.push(...p);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    scene.add(new THREE.Mesh(geo, solid(0x999675, { side: THREE.DoubleSide })));
  }
}

function streetSign(scene, text, x, y, z, rotY = 0) {
  const group = new THREE.Group();
  addBox(group, 0.12, 2.1, 0.12, solid(0x5a5854), 0, 1.05, 0);
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.7),
    signMaterial(text, {
      width: 256, height: 64, bg: "#d8cdb0", fg: "#2b4a7a", accent: "#8c2f24",
    })
  );
  board.position.set(0, 2.05, 0.08);
  group.add(board);
  group.position.set(x, y, z);
  group.rotation.y = rotY;
  scene.add(group);
}

function placeKhashaa(scene, bags, options) {
  const {
    x, z, y, seed, tone, roof, gateNorth, house, sheep, car, dog, tree,
  } = options;
  const plot = new THREE.Group();
  plot.name = `khashaa-${seed}`;
  plot.position.set(x, y, z);
  scene.add(plot);

  const size = 14;
  const gateWidth = 3.2;
  const west = buildFenceRun(size, tone);
  west.rotation.y = Math.PI / 2;
  west.position.set(-size / 2, 0, 0);
  plot.add(west);
  const east = buildFenceRun(size, tone);
  east.rotation.y = Math.PI / 2;
  east.position.set(size / 2, 0, 0);
  plot.add(east);

  const seg = (size - gateWidth) / 2;
  const segCenter = gateWidth / 2 + seg / 2;
  const gate = buildGate(gateWidth);
  const back = gateNorth ? 1 : -1;
  if (gateNorth) {
    const south = buildFenceRun(size, tone);
    south.position.set(0, 0, size / 2);
    plot.add(south);
    const left = buildFenceRun(seg, tone);
    left.position.set(-segCenter, 0, -size / 2);
    plot.add(left);
    const right = buildFenceRun(seg, tone);
    right.position.set(segCenter, 0, -size / 2);
    plot.add(right);
    gate.position.set(0, 0, -size / 2 - 0.02);
    gate.rotation.y = Math.PI;
  } else {
    const north = buildFenceRun(size, tone);
    north.position.set(0, 0, -size / 2);
    plot.add(north);
    const left = buildFenceRun(seg, tone);
    left.position.set(-segCenter, 0, size / 2);
    plot.add(left);
    const right = buildFenceRun(seg, tone);
    right.position.set(segCenter, 0, size / 2);
    plot.add(right);
    gate.position.set(0, 0, size / 2 + 0.02);
  }
  plot.add(gate);

  const entry = groundPlane(2.4, 3.4, plasterMaterial(seed % 2 ? "#a99a7e" : "#b0a38b"),
    0, gateNorth ? -5.7 : 5.7, 0.06);
  entry.name = "yard-entrance";
  plot.add(entry);
  const bridge = addBox(plot, gateWidth, 0.12, 0.85, solid(0x8c826e),
    0, 0.08, gateNorth ? -8.3 : 8.3);
  bridge.name = "drain-crossing";

  if (seed % 3 === 1) {
    const repair = addBox(plot, 0.65, 1.35, 0.12, solid(0x9b8968),
      -segCenter + 0.4, 0.73, gateNorth ? -7.08 : 7.08);
    repair.rotation.z = seed % 2 ? 0.07 : -0.09;
    repair.name = "fence-repair";
  }

  if (seed % 7 === 0) {
    const frost = groundPlane(2.8, 0.75, solid(0xbfc1ae, { transparent: true, opacity: 0.38 }),
      3.8, gateNorth ? 6.6 : -6.6, 0.065);
    frost.name = "sheltered-frost";
    plot.add(frost);
  }

  const rotY = gateNorth ? Math.PI : 0;
  const gerScale = house ? 0.78 : 0.92;
  const gerX = house ? -3.7 : 0.2;
  const gerZ = house ? 0.2 : -0.4;
  const ger = buildGer(gerScale);
  ger.position.set(gerX, 0.02, gerZ);
  ger.rotation.y = rotY;
  plot.add(ger);
  const gerShadow = contactShadow(5.4, 5.4, 0.22);
  gerShadow.position.set(gerX, 0.05, gerZ);
  plot.add(gerShadow);

  const smoke = new THREE.Vector3(-1.05, 3.49, -0.5).multiplyScalar(gerScale);
  smoke.applyAxisAngle(UP, rotY);
  bags.smokeSources.push({
    x: x + gerX + smoke.x,
    y: y + smoke.y,
    z: z + gerZ + smoke.z,
    rise: 3.4,
    scale: 0.42,
    opacity: 0.38,
  });

  if (house) {
    const fuelWood = buildWoodpile();
    fuelWood.name = "winter-fuel-wood";
    fuelWood.position.set(-5.1, 0, back * 4.6);
    plot.add(fuelWood);
    const fuelCoal = buildCoalPile(0.65);
    fuelCoal.name = "winter-fuel-coal";
    fuelCoal.position.set(5.1, 0, back * 4.8);
    plot.add(fuelCoal);
    const home = buildSelfBuiltHouse({ roof });
    const hx = 2.5;
    const hz = -0.15;
    home.position.set(hx, 0, hz);
    home.rotation.y = rotY;
    plot.add(home);
    const stack = new THREE.Vector3(2.6, 6.15, -0.8);
    stack.applyAxisAngle(UP, rotY);
    bags.smokeSources.push({
      x: x + hx + stack.x,
      y: y + stack.y,
      z: z + hz + stack.z,
      rise: 2.4,
      scale: 0.3,
      opacity: 0.28,
    });
  } else {
    const wood = buildWoodpile();
    wood.position.set(-5.1, 0, back * 4.6);
    wood.rotation.y = 0.4;
    plot.add(wood);
    const outhouse = buildOuthouse();
    outhouse.position.set(5.1, 0, back * 4.8);
    outhouse.rotation.y = gateNorth ? 0.2 : Math.PI;
    plot.add(outhouse);
    const coal = buildCoalPile(0.7);
    coal.position.set(gerX - 1.5, 0, gerZ + 1.8);
    plot.add(coal);
    if (seed % 2 === 0) {
      const dish = buildSatelliteDish();
      dish.position.set(2.4, 0, -2.2);
      dish.rotation.y = -0.6;
      plot.add(dish);
    } else {
      const antenna = buildAntenna(2.4);
      antenna.position.set(2.2, 0, -2.4);
      plot.add(antenna);
    }
    const barrel = buildBarrel(seed % 2 ? 0x4a6a8a : 0x7a5a3a);
    barrel.position.set(-5.4, 0, -2.2);
    plot.add(barrel);
  }

  const laundry = buildClothesline(house ? 3.2 : 4.2);
  laundry.group.position.set(house ? -0.4 : -1.2, 0, back * 5.3);
  plot.add(laundry.group);
  for (const cloth of laundry.cloths) cloth.userData.dynamic = true;
  bags.clothGroups.push({ cloths: laundry.cloths, phase: seed * 0.7 });

  if (sheep) {
    const pen = new THREE.Group();
    pen.position.set(3.2, 0, back * 3.4);
    const rail = solid(0x7a5a3c);
    for (const s of [-1, 1]) {
      addBox(pen, 4.2, 0.08, 0.08, rail, 0, 0.85, s * 1.6);
      addBox(pen, 4.2, 0.08, 0.08, rail, 0, 0.42, s * 1.6);
      addBox(pen, 0.08, 0.08, 3.2, rail, s * 2.1, 0.85, 0);
      addBox(pen, 0.08, 0.08, 3.2, rail, s * 2.1, 0.42, 0);
    }
    for (const sx of [-2.1, 2.1]) {
      for (const sz of [-1.6, 1.6]) addBox(pen, 0.12, 1.05, 0.12, rail, sx, 0.52, sz);
    }
    plot.add(pen);
    const rand = mulberry(seed * 19 + 3);
    for (let i = 0; i < 3; i++) {
      const animal = buildSheep();
      const ax = x + 3.2 + (i - 1) * 0.9;
      const az = z + back * 3.4 + (i % 2) * 0.7;
      animal.position.set(ax, y, az);
      animal.rotation.y = rand() * Math.PI * 2;
      animal.userData.dynamic = true;
      scene.add(animal);
      bags.sheepList.push({ group: animal, anchorX: ax, anchorZ: az, groundY: y, phase: i * 1.7 + seed });
    }
  }

  if (car) {
    const carRand = mulberry(seed * 41 + 7);
    const parked = buildCar(seed % 2 ? 0x8a3a2e : 0x3a4a6a, seed % 3 === 0 ? "van" : "sedan", seed % 3);
    parked.position.set(4.6, -0.015, gateNorth ? -4.4 : 4.4);
    parked.rotation.y = (gateNorth ? 0.15 : Math.PI - 0.15) + (carRand() - 0.5) * 0.07;
    plot.add(parked);
  }

  if (dog) {
    const animal = buildDog();
    const ax = x + (gateNorth ? 4.2 : -4.2);
    const az = z + (gateNorth ? -3.6 : 3.6);
    animal.position.set(ax, y, az);
    animal.userData.dynamic = true;
    scene.add(animal);
    bags.dogs.push({ group: animal, anchorX: ax, anchorZ: az, groundY: y, phase: seed * 1.1 });
  }

  if (tree) {
    const planted = buildTree("autumn", seed + 5);
    planted.position.set(-5.4, 0, back * 2.4);
    planted.scale.setScalar(0.72);
    plot.add(planted);
    const carpet = buildLeafCarpet(1.9, seed + 5);
    carpet.position.set(-5.4, 0.048, back * 2.4);
    plot.add(carpet);
  }

  const bin = buildTrashCan();
  bin.position.set(5.6, 0, -back * 5.2);
  plot.add(bin);

  // Ground life: a worn path from the gate to the door, a trampled patch inside
  // the gate, weeds at the fence line, and a leaf drift on the lee side.
  const yardRand = mulberry(seed * 71 + 5);
  plot.add(groundPlane(1.15, 4.6, groundWearMaterial(), gerX * 0.5, -back * 4.3, 0.048));
  plot.add(groundPlane(2.8, 1.9, groundWearMaterial(), 0, -back * 5.7, 0.052));
  if (car) {
    for (const wx of [-0.72, 0.72]) {
      plot.add(groundPlane(0.18, 3.2, trackWearMaterial(), 4.6 + wx, -back * 5.4, 0.05));
    }
  }
  const weeds = 3 + ((yardRand() * 4) | 0);
  for (let i = 0; i < weeds; i++) {
    const weed = buildWeedTuft(seed * 9 + i);
    const side = yardRand() < 0.5 ? -1 : 1;
    weed.position.set(side * (size / 2 - 0.5 - yardRand() * 0.7), 0.01, (yardRand() - 0.5) * (size - 2));
    weed.scale.setScalar(0.7 + yardRand() * 0.5);
    plot.add(weed);
  }
  const drift = buildLeafScatter(8 + ((yardRand() * 6) | 0), 3.4, seed);
  drift.position.set(-2 + yardRand() * 4, 0.05, back * (3 + yardRand() * 2.5));
  plot.add(drift);
  if (yardRand() < 0.4) {
    const scrap = buildPaperScrap((yardRand() * 2) | 0, seed * 13 + 7);
    scrap.position.set(yardRand() * 3 - 1.5, 0.05, -back * 6.1);
    plot.add(scrap);
  }
}

function standing(scene, options, x, y, z, rotY) {
  const person = buildPerson(options);
  person.group.position.set(x, y, z);
  person.group.rotation.y = rotY;
  scene.add(person.group);
  return person;
}

function walker(scene, bags, options, a, b, speed, phase) {
  const person = buildPerson(options);
  person.group.position.set(a.x, townHeight(a.x, a.z), a.z);
  person.group.userData.dynamic = true;
  scene.add(person.group);
  bags.walkers.push({ ...person, a, b, speed, phase });
}

export function placeTown(scene) {
  const bags = {
    smokeSources: [],
    clothGroups: [],
    dogs: [],
    sheepList: [],
    swings: [],
    lampGlows: [],
    walkers: [],
    horses: [],
  };

  const lampPoolMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture(),
    color: 0xffb060,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
    opacity: 0,
  });

  function addGlow(x, y, z, size) {
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(),
      color: 0xffc070,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      opacity: 0,
    }));
    glow.scale.set(size, size, 1);
    glow.position.set(x, y, z);
    scene.add(glow);
    bags.lampGlows.push(glow);
  }

  function addPool(x, y, z) {
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lampPoolMaterial);
    pool.rotation.x = -Math.PI / 2;
    pool.scale.set(10, 7, 1);
    pool.position.set(x, y + 0.02, z);
    scene.add(pool);
  }

  const avenue = asphaltMaterial(3, 64);
  avenue.map.rotation = Math.PI / 2;
  scene.add(groundPlane(340, 12, avenue, 0, 0, 0.02));
  const walk = plasterMaterial("#b0a894");
  scene.add(groundPlane(340, 3.2, walk, 0, -7.6, 0.03));
  scene.add(groundPlane(340, 2.2, walk, 0, 7.15, 0.03));
  const lineMat = solid(0xb8b09a, { transparent: true, opacity: 0.4 });
  for (let x = -160; x <= 160; x += 6) addBox(scene, 2.4, 0.02, 0.14, lineMat, x, 0.04, 0);

  for (let i = 0; i < SOUTH_ROWS.length; i++) {
    const row = SOUTH_ROWS[i];
    terrace(scene, row.z0, row.z1, row.y);
    for (const side of [-1, 1]) {
      const drain = groundPlane(96, 0.55, solid(0x635b49), side * 54, row.z - 8.3, row.y + 0.065);
      drain.name = "street-drain";
      scene.add(drain);
    }
    if (i + 1 < SOUTH_ROWS.length) {
      const next = SOUTH_ROWS[i + 1];
      wedge(scene, row.z1, next.z0, row.y, next.y);
    }
  }
  terrace(scene, NORTH_ROW.z0, NORTH_ROW.z1, NORTH_ROW.y);
  for (const side of [-1, 1]) {
    const drain = groundPlane(96, 0.55, solid(0x635b49), side * 54, NORTH_ROW.z + 8.3, NORTH_ROW.y + 0.065);
    drain.name = "street-drain";
    scene.add(drain);
  }
  wedge(scene, NORTH_ROW.z1, -67, NORTH_ROW.y, 0);
  terraceBanks(scene);

  const hospital = buildHospital();
  hospital.name = "hospital";
  hospital.position.set(-78, 0, -26);
  scene.add(hospital);
  const boiler = hospital.userData.boilerSmoke;
  bags.smokeSources.push({
    x: hospital.position.x + boiler.x,
    y: boiler.y,
    z: hospital.position.z + boiler.z,
    rise: 6,
    scale: 0.7,
    opacity: 0.36,
  });
  scene.add(groundPlane(28, 11, plasterMaterial("#a9a296"), -78, -13.5, 0.04));
  for (const x of [-88, -80, -72, -66]) {
    addBox(scene, 0.08, 0.02, 8, solid(0xd8d4c8, { transparent: true, opacity: 0.35 }), x, 0.06, -13.5);
  }
  const ambulance = buildCar(0xf4f4f0, "van");
  ambulance.position.set(-86, -0.015, -12.5);
  ambulance.rotation.y = 0.08;
  scene.add(ambulance);
  addBox(ambulance, 0.7, 0.08, 0.08, solid(0xc43838), 0, 2.2, 0);
  addBox(ambulance, 0.08, 0.7, 0.08, solid(0xc43838), 0, 2.2, 0);
  for (const [i, [x, rot, color]] of [[-70, 0.04, 0x8a3a2e], [-62, -0.08, 0x3a4a62], [-74, 0.2, 0xc8c4b4]].entries()) {
    const car = buildCar(color, "sedan", i);
    car.position.set(x, -0.015, -15.2);
    car.rotation.y = rot;
    scene.add(car);
  }

  const apartmentA = buildApartment({
    width: 20, depth: 11, floors: 5, bodyColor: "#cbc1a6", bandColor: 0x81939a, number: "12",
  });
  apartmentA.name = "apartment-12";
  apartmentA.position.set(-36, 0, -23);
  scene.add(apartmentA);

  const apartmentB = buildApartment({
    width: 20, depth: 11, floors: 5, bodyColor: "#c9b6a4", bandColor: 0x8b8a72, number: "24", glazed: true,
  });
  apartmentB.name = "apartment-24";
  apartmentB.position.set(-10, 0, -23);
  scene.add(apartmentB);

  for (const [x, z, floors, number] of [
    [-80, -55, 4, "6"], [-46, -51, 5, "8"], [-14, -51, 5, "10"],
    [98, -51, 5, "18"], [120, -76, 4, "20"],
  ]) {
    const block = buildApartment({ width: 23, depth: 10, floors,
      bodyColor: "#a7a9a6", bandColor: 0x737f8c, number });
    block.position.set(x, 0, z);
    scene.add(block);
  }

  const governor = buildGovernorHall();
  governor.name = "governor";
  governor.position.set(16, 0, -28);
  scene.add(governor);
  scene.add(groundPlane(4.4, 5.5, walk, 16, -17.2, 0.045));
  scene.add(groundPlane(26, 8, plasterMaterial("#c2bba8"), 18, -11.2, 0.04));
  const squareName = new THREE.Group();
  squareName.name = "square";
  squareName.position.set(18, 0, -11);
  scene.add(squareName);

  const school = buildSchool();
  school.name = "school";
  school.position.set(66, 0, -36);
  scene.add(school);
  const gym = buildSchoolGym();
  gym.name = "school-gym";
  gym.position.set(58, 0, -50);
  scene.add(gym);

  const helipad = buildHelipad();
  helipad.name = "helipad";
  helipad.position.set(16, 0, -50);
  scene.add(helipad);

  const store = buildStore();
  store.name = "store";
  store.position.set(112, 0, -18);
  scene.add(store);
  addGlow(116.2, 3.05, -13.2, 4.4);
  addPool(114, 0.05, -12);

  const kiosk = buildKiosk();
  kiosk.name = "kiosk";
  kiosk.position.set(-24, 0, -9.1);
  scene.add(kiosk);

  const plant = buildHeatingPlant();
  plant.name = "heating-plant";
  plant.position.set(148, 0, -30);
  scene.add(plant);
  for (const chimney of plant.userData.chimneys) {
    bags.smokeSources.push({
      x: plant.position.x + chimney.x,
      y: chimney.y,
      z: plant.position.z + chimney.z,
      rise: chimney.y > 30 ? 16 : 12,
      scale: chimney.y > 30 ? 2.4 : 1.7,
      opacity: 0.5,
    });
  }

  const tower = buildWaterTower();
  tower.name = "water-tower";
  tower.position.set(-118, 0, -42);
  scene.add(tower);

  const pipes = buildPipeRun(210, 1.85);
  pipes.position.set(20, 0, -63);
  scene.add(pipes);

  const arch = buildArch();
  arch.name = "arch";
  arch.position.set(-108, 0, 0);
  arch.rotation.y = Math.PI / 2;
  scene.add(arch);

  const cordon = buildCordon();
  cordon.name = "cordon";
  cordon.position.set(-136, 0, -8);
  scene.add(cordon);

  const busSquare = buildBusStop();
  busSquare.position.set(28, 0, -8.6);
  scene.add(busSquare);
  const busAvenue = buildBusStop();
  busAvenue.position.set(-8, 0, 8.3);
  busAvenue.rotation.y = Math.PI;
  scene.add(busAvenue);

  const utility = buildUtilityBox();
  utility.position.set(-48, 0, -8.8);
  scene.add(utility);

  for (const x of [96, 99.2, 102.4, 105.6]) {
    const stall = buildMarketStall();
    stall.position.set(x, 0, 8.4);
    stall.rotation.y = Math.PI;
    scene.add(stall);
  }

  const frontWater = buildWaterKiosk();
  frontWater.position.set(-8.2, 0, 11.2);
  scene.add(frontWater);
  streetSign(scene, "НАРАН ГУДАМЖ", 7.2, 0, 11.4, -Math.PI / 2);
  streetSign(scene, "ТӨВ ТАЛБАЙ", 30.5, 0, -8.4, Math.PI);

  let plotIndex = 0;
  const yards = [];
  for (const row of SOUTH_ROWS) {
    for (const x of SOUTH_COLS) yards.push({ x, z: row.z, y: row.y, gateNorth: true });
  }
  for (const x of NORTH_COLS) {
    yards.push({ x, z: NORTH_ROW.z, y: NORTH_ROW.y, gateNorth: false });
  }
  for (const yard of yards) {
    if (yard.x === PLAYGROUND.x && yard.z === PLAYGROUND.z) continue;
    const seed = plotIndex + 1;
    plotIndex += 1;
    const house = seed % 3 === 0;
    placeKhashaa(scene, bags, {
      ...yard,
      seed,
      tone: TONES[seed % TONES.length],
      roof: ROOFS[seed % ROOFS.length],
      house,
      sheep: !house && seed % 11 === 0,
      car: seed % 5 === 0,
      dog: seed % 6 === 0,
      tree: seed % 4 === 1,
    });
  }

  const playY = townHeight(PLAYGROUND.x, PLAYGROUND.z);
  const swingSet = buildSwingSet();
  swingSet.group.position.set(11.2, playY, 42.2);
  swingSet.group.userData.dynamic = true;
  scene.add(swingSet.group);
  bags.swings.push(...swingSet.swings);
  const slide = buildSlide();
  slide.position.set(16.4, playY, 44.6);
  slide.rotation.y = -0.5;
  scene.add(slide);
  const sandbox = buildSandbox();
  sandbox.position.set(15.2, playY, 40.4);
  scene.add(sandbox);
  const playBench = buildBench();
  playBench.position.set(10.2, playY, 46.2);
  scene.add(playBench);
  const playWater = buildWaterKiosk();
  playWater.position.set(18.4, playY, 40.2);
  scene.add(playWater);

  const treeSpots = [
    [-96, -8.2], [-60, -8.2], [4, -8.2], [42, -8.2], [88, -8.2], [128, -8.2],
    [-96, 6.4], [-54, 6.4], [8, 6.4], [36, 6.4], [78, 6.4],
    [-96, 36], [96, 36], [-96, 70], [96, 78],
  ];
  treeSpots.forEach(([x, z], i) => {
    const tree = buildTree(i % 3 === 2 ? "poplar" : "autumn", i + 3);
    const y = townHeight(x, z);
    tree.position.set(x, y, z);
    tree.scale.setScalar(0.85 + (i % 4) * 0.06);
    scene.add(tree);
    const carpet = buildLeafCarpet(2.2 + (i % 3) * 0.4, i + 3);
    carpet.position.set(x, y + 0.048, z);
    scene.add(carpet);
    const drift = buildLeafScatter(10 + (i % 3) * 4, 2.8, i + 3);
    drift.position.set(x, y + 0.05, z);
    scene.add(drift);
  });

  const roadPoles = [];
  for (let x = -150; x <= 156; x += 22) {
    if (Math.abs(x + 108) < 10) continue;
    const lamp = ((x / 22) | 0) % 2 === 0;
    const pole = buildPowerPole({ lamp, transformer: x === -42, wood: false });
    pole.position.set(x, 0, 8.6);
    pole.rotation.y = Math.PI;
    scene.add(pole);
    roadPoles.push({ x, y: 0, z: 8.6 });
    if (lamp) {
      addGlow(x, 7.35, 7.15, 5.2);
      addPool(x, 0.05, 7.15);
    }
  }
  const avenueWest = [];
  const avenueEast = [];
  for (const row of SOUTH_ROWS) {
    for (const side of [-1, 1]) {
      const pole = buildPowerPole({ lamp: side === 1, wood: true });
      const px = side * 4.5;
      pole.position.set(px, row.y, row.z);
      pole.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(pole);
      const list = side === -1 ? avenueWest : avenueEast;
      list.push({ x: px, y: row.y, z: row.z });
      if (side === 1) {
        const head = new THREE.Vector3(0, 7.35, 1.45).applyAxisAngle(UP, -Math.PI / 2);
        addGlow(px + head.x, row.y + head.y, row.z + head.z, 4.6);
        addPool(px + head.x, row.y + 0.05, row.z + head.z);
      }
    }
  }

  const wireMaterial = new THREE.LineBasicMaterial({ color: 0x2f2c28 });
  function addWires(poles, drop) {
    for (const yOff of [9.45, 8.85]) {
      const points = [];
      for (let i = 0; i < poles.length - 1; i++) {
        const a = poles[i];
        const b = poles[i + 1];
        for (let k = 0; k <= 8; k++) {
          const u = k / 8;
          points.push(new THREE.Vector3(
            a.x + (b.x - a.x) * u,
            a.y + yOff + (b.y - a.y) * u - Math.sin(u * Math.PI) * drop,
            a.z + (b.z - a.z) * u
          ));
        }
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), wireMaterial));
    }
  }
  addWires(roadPoles, 0.6);
  addWires(avenueWest, 0.45);
  addWires(avenueEast, 0.45);

  for (const [x, z, rot] of [[-48, 94, 0.4], [-42, 97, 1.1], [-54, 96, -0.4], [70, 95, 0.8]]) {
    const horse = buildHorse();
    const y = townHeight(x, z);
    horse.position.set(x, y, z);
    horse.rotation.y = rot;
    horse.userData.dynamic = true;
    scene.add(horse);
    bags.horses.push({ group: horse, baseYaw: rot, phase: x * 0.1 });
  }

  const outside = mulberry(1201);
  for (let i = 0; i < 18; i++) {
    let x = 0;
    let z = 0;
    for (let n = 0; n < 8; n++) {
      const angle = outside() * Math.PI * 2;
      const dist = 40 + outside() * 120;
      x = Math.sin(angle) * dist;
      z = Math.cos(angle) * dist;
      if (!inTown(x, z)) break;
    }
    if (inTown(x, z)) continue;
    const tree = buildTree("autumn", i + 30);
    tree.position.set(x, terrainHeight(x, z), z);
    tree.rotation.y = outside() * Math.PI;
    tree.scale.setScalar(0.8 + outside() * 0.7);
    scene.add(tree);
  }
  for (let i = 0; i < 24; i++) {
    const angle = outside() * Math.PI * 2;
    const dist = 150 + outside() * 40;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const rock = buildRock(i + 40);
    rock.position.set(x, terrainHeight(x, z), z);
    scene.add(rock);
  }
  for (let i = 0; i < 70; i++) {
    const angle = outside() * Math.PI * 2;
    const dist = 130 + outside() * 55;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const tuft = buildGrassTuft(i + 80);
    tuft.position.set(x, terrainHeight(x, z), z);
    tuft.scale.setScalar(0.8 + outside() * 1.1);
    scene.add(tuft);
  }

  walker(scene, bags, { coat: 0x2b4a7a, hat: 0x8c2f24, pants: 0x3a3630 }, { x: -30, z: -6.6 }, { x: 24, z: -6.6 }, 16, 0.1);
  walker(scene, bags, { coat: 0x6a5a4a, hat: 0x2b4a7a, pants: 0x4a4a42 }, { x: -16, z: 6.5 }, { x: 48, z: 6.5 }, 18, 0.55);
  walker(scene, bags, { coat: 0xb04a32, hat: 0x2b4a7a, pants: 0x3a3630, backpack: true, child: true, scale: 0.74 }, { x: 1.4, z: 16 }, { x: 1.4, z: 78 }, 14, 0.3);
  walker(scene, bags, { coat: 0x3a5a48, hat: 0x8c2f24, pants: 0x3a3630 }, { x: -2.2, z: 24 }, { x: -2.2, z: 86 }, 12, 0.8);

  const storeShopper = standing(scene, { coat: 0x4a6a5a, hat: 0x8c2f24, pants: 0x3a3630, stance: true }, 106.5, 0, -12.4, Math.PI - 0.3);
  storeShopper.group.userData.dynamic = true;
  const standpipePerson = standing(scene, { coat: 0x7a5a8a, hat: 0x2b4a7a, pants: 0x3a3630, stance: true }, -7.2, 0, 12.4, 1.1);
  standpipePerson.group.userData.dynamic = true;
  const herder = standing(scene, { coat: 0x8c5a32, hat: 0x2b4a7a, pants: 0x3a3630, stance: true }, -46, townHeight(-46, 94), 94, 2.2);
  herder.group.userData.dynamic = true;
  herder.group.userData.groundY = townHeight(-46, 94);
  const playgroundKid = standing(
    scene,
    { coat: 0xc85a3c, hat: 0x2b4a7a, pants: 0x3a3630, child: true, scale: 0.72 },
    13.4, playY, 43.2, -0.4
  );
  playgroundKid.group.userData.dynamic = true;
  playgroundKid.group.userData.groundY = playY;

  standing(scene, { coat: 0x2b4a7a, hat: 0x2a2a28, pants: 0x3a3630, stance: true }, 12, 0, -12.4, 0.4);
  standing(scene, { coat: 0x8a4038, hat: 0x8c2f24, pants: 0x3a3630, stance: true }, 22, 0, -13.2, -0.6);
  standing(scene, { coat: 0x4a4038, hat: 0x6a6840, pants: 0x3a3630, stance: true }, -132, 0, -4.2, 0.6);
  standing(scene, { coat: 0xd8d0c0, hat: 0x2b4a7a, pants: 0x3a3630, stance: true }, -74, 0, -11.2, -0.4);

  const dumpster = buildDumpster();
  dumpster.position.set(92, 0, 9.2);
  scene.add(dumpster);
  const crate = buildCrate();
  crate.position.set(98.5, 0, 9.4);
  scene.add(crate);

  // Litter and leaf drift where people actually gather and dump things.
  const litterRand = mulberry(4402);
  const litterSpots = [
    [27, -7.2, 3], [29.5, -9.8, 2],
    [-9, 7.0, 2], [-6.8, 9.6, 2],
    [-23.2, -8.0, 2], [-25, -10.4, 1],
    [97.5, 7.4, 3], [101, 9.6, 2], [104, 7.2, 2],
    [91, 10.6, 4], [93.5, 7.8, 2],
    [-7.4, 10.2, 2], [19.5, 39.4, 1],
    [10.4, 46.8, 2], [15.8, 39.2, 1],
  ];
  for (const [lx, lz, n] of litterSpots) {
    const ly = townHeight(lx, lz);
    for (let k = 0; k < n; k++) {
      const paper = buildPaperScrap((litterRand() * 2) | 0, (lx * 7 + lz * 13 + k * 3) | 0);
      paper.position.set(lx + (litterRand() - 0.5) * 2.6, ly + 0.05 + litterRand() * 0.012, lz + (litterRand() - 0.5) * 2.2);
      scene.add(paper);
    }
    const drift = buildLeafScatter(4 + ((litterRand() * 5) | 0), 1.8, (lx * 3 + lz) | 0);
    drift.position.set(lx, ly + 0.05, lz);
    scene.add(drift);
  }
  for (let i = 0; i < 26; i++) {
    const x = -150 + litterRand() * 300;
    const z = litterRand() < 0.5 ? -9.1 + litterRand() * 0.8 : 7.4 + litterRand() * 0.8;
    const weed = buildWeedTuft(i + 500);
    weed.position.set(x, 0.02, z);
    weed.scale.setScalar(0.6 + litterRand() * 0.6);
    scene.add(weed);
  }

  const tumbleLeaves = [];
  for (let i = 0; i < 8; i++) {
    const leaf = buildTumblingLeaf(i + 900);
    leaf.userData.dynamic = true;
    scene.add(leaf);
    tumbleLeaves.push({
      mesh: leaf,
      speed: 0.016 + litterRand() * 0.02,
      phase: litterRand(),
      z: -3.5 + litterRand() * 7,
      baseY: 0.35 + litterRand() * 0.25,
      hop: 0.3 + litterRand() * 0.35,
    });
  }

  return {
    ...bags,
    tumbleLeaves,
    lampPoolMaterial,
    storeShopper,
    standpipePerson,
    herder,
    playgroundKid,
  };
}
