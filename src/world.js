import * as THREE from "three";
import {
  addBox,
  asphaltMaterial,
  buildAntenna,
  buildBarrel,
  buildBench,
  buildBird,
  buildCar,
  buildCloud,
  buildClothesline,
  buildCoalPile,
  buildCrate,
  buildDog,
  buildFenceRun,
  buildFlagPole,
  buildGate,
  buildGer,
  buildGrassTuft,
  buildHorse,
  buildOuthouse,
  buildPerson,
  buildPowerPole,
  buildRock,
  buildSandbox,
  buildSatelliteDish,
  buildSheep,
  buildSlide,
  buildSolarPanel,
  buildSwingSet,
  buildTree,
  buildTrashCan,
  buildWoodpile,
  contactShadow,
  dirtMaterial,
  groundPlane,
  lampMaterials,
  mat,
  mulberry,
  shopWindowMaterial,
  signMaterials,
  solid,
  windowMaterials,
} from "./parts.js";
import {
  buildApartment,
  buildArch,
  buildBoilerHouse,
  buildBusStop,
  buildDumpster,
  buildKiosk,
  buildPipeRun,
  buildSchool,
  buildSelfBuiltHouse,
  buildStandpipe,
  buildStore,
  buildUtilityBox,
  buildWaterTower,
} from "./structures.js";
import {
  cloneRepeat,
  concreteTexture,
  glowTexture,
  steppeTexture,
} from "./textures.js";
import { mergeStatic } from "./mergeStatic.js";

const TAU = Math.PI * 2;

function sstep(x, min, max) {
  return THREE.MathUtils.smoothstep(x, min, max);
}

function terrainHeight(x, z) {
  const d = Math.hypot(x, z);
  const f = sstep(d, 82, 138);
  const h =
    Math.sin(x * 0.045) * Math.cos(z * 0.05) * 2.4 +
    Math.sin(x * 0.105 + 1.7) * 0.9 +
    Math.cos(z * 0.09 - 0.6) * 0.7;
  return h * f;
}

export function worldState(t) {
  const theta = (t - 0.25) * TAU;
  const sunDir = new THREE.Vector3(
    Math.cos(theta),
    Math.sin(theta),
    0.3
  ).normalize();
  const elev = sunDir.y;
  const day = sstep(elev, -0.05, 0.28);
  const night = 1 - sstep(elev, -0.14, 0.1);
  const dusk = Math.max(0, 1 - Math.abs(elev) / 0.33) * sstep(elev, -0.2, 0.02);

  const sunColor = new THREE.Color("#ff7a3a")
    .lerp(new THREE.Color("#fff2d8"), sstep(elev, 0.02, 0.55));
  if (elev < -0.02) {
    sunColor.lerp(new THREE.Color("#5c6c9a"), Math.min(1, -elev * 3));
  }

  const skyTop = new THREE.Color("#080e1c")
    .lerp(new THREE.Color("#5a8ec6"), day)
    .lerp(new THREE.Color("#4c3f6a"), dusk * 0.55);
  const skyHorizon = new THREE.Color("#18213a")
    .lerp(new THREE.Color("#c9d4cc"), day)
    .lerp(new THREE.Color("#e59a5e"), dusk * 0.7);

  const hemiSky = new THREE.Color("#2c3854")
    .lerp(new THREE.Color("#b7cbe0"), day)
    .lerp(new THREE.Color("#7a6a7a"), dusk * 0.4);
  const hemiGround = new THREE.Color("#20222a")
    .lerp(new THREE.Color("#8a8456"), day);

  const fogColor = new THREE.Color("#1a2233")
    .lerp(new THREE.Color("#bcc8c6"), day)
    .lerp(new THREE.Color("#d29a78"), dusk * 0.55);

  const cloudColor = new THREE.Color("#2c3448")
    .lerp(new THREE.Color("#f2f0e4"), day)
    .lerp(new THREE.Color("#e8b088"), dusk * 0.5);

  return {
    t,
    sunDir,
    sunColor,
    sunIntensity: 0.05 + day * 1.35 + dusk * 0.12,
    hemiSky,
    hemiGround,
    hemiIntensity: 0.34 + day * 0.58 + night * 0.26,
    fogColor,
    skyTop,
    skyHorizon,
    cloudColor,
    day,
    night,
    dusk,
    sunOpacity: sstep(elev, -0.005, 0.06),
    moonOpacity: night * 0.8,
  };
}

export function buildWorld() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xbcc8c6, 58, 195);

  const skyUniforms = {
    topColor: { value: new THREE.Color("#5a8ec6") },
    horizonColor: { value: new THREE.Color("#c9d4cc") },
    sunColor: { value: new THREE.Color("#fff2d8") },
    sunDirection: { value: new THREE.Vector3(0, 1, 0) },
    glow: { value: 0.4 },
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(390, 24, 16),
    new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 sunColor;
        uniform vec3 sunDirection;
        uniform float glow;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(horizonColor, topColor, pow(h, 0.55));
          float s = max(dot(d, normalize(sunDirection)), 0.0);
          col += sunColor * pow(s, 16.0) * glow;
          col = mix(col, horizonColor, pow(max(1.0 - h, 0.0), 10.0) * 0.24);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
  );
  sky.renderOrder = -100;
  scene.add(sky);

  const stars = (() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    const rand = mulberry(99);
    for (let i = 0; i < count; i++) {
      const y = 0.04 + rand() * 0.96;
      const a = rand() * TAU;
      const r = Math.sqrt(1 - y * y);
      positions[i * 3] = Math.cos(a) * r * 345;
      positions[i * 3 + 1] = y * 345;
      positions[i * 3 + 2] = Math.sin(a) * r * 345;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xdfe8ff,
      size: 1.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    });
    const points = new THREE.Points(geo, material);
    points.renderOrder = -50;
    scene.add(points);
    return points;
  })();

  const sunSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: 0xffe6b0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      opacity: 0,
    })
  );
  sunSprite.scale.set(58, 58, 1);
  scene.add(sunSprite);

  const moonSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: 0xaebfe0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      opacity: 0,
    })
  );
  moonSprite.scale.set(22, 22, 1);
  scene.add(moonSprite);

  const sun = new THREE.DirectionalLight(0xfff2d8, 1.4);
  sun.position.set(50, 80, 25);
  scene.add(sun);
  const moon = new THREE.DirectionalLight(0x7a8cba, 0);
  moon.position.set(-50, 80, -25);
  scene.add(moon);
  const hemi = new THREE.HemisphereLight(0xb7cbe0, 0x8a8456, 0.9);
  scene.add(hemi);

  const groundGeo = new THREE.PlaneGeometry(420, 420, 90, 90);
  const positions = groundGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    positions.setZ(i, terrainHeight(x, -y));
  }
  groundGeo.computeVertexNormals();
  const groundMaterial = mat({ map: cloneRepeat(steppeTexture(), 74, 74) });
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.userData.noMerge = true;
  scene.add(ground);

  const hillColors = [0x6f7a4c, 0x7b8454, 0x626e44, 0x858a5a, 0x707a50, 0x8a8a5e];
  const hillRand = mulberry(731);
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * TAU + hillRand() * 0.35;
    const dist = 108 + hillRand() * 70;
    const sx = 26 + hillRand() * 36;
    const sy = 7 + hillRand() * 13;
    const hill = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 0),
      solid(hillColors[(hillRand() * hillColors.length) | 0])
    );
    hill.position.set(Math.sin(angle) * dist, -2 + hillRand() * 3, Math.cos(angle) * dist);
    hill.scale.set(sx, sy, sx * (0.7 + hillRand() * 0.6));
    hill.rotation.y = hillRand() * Math.PI;
    scene.add(hill);
  }

  const road = groundPlane(150, 12, asphaltMaterial(30, 3), 0, 0, 0.02);
  scene.add(road);

  const sidewalkMat = mat({ map: cloneRepeat(concreteTexture("#b0a894"), 44, 1.4) });
  const sidewalkNorth = groundPlane(150, 3.6, sidewalkMat, 0, -7.8, 0.032);
  scene.add(sidewalkNorth);
  const sidewalkSouth = groundPlane(150, 2.4, sidewalkMat, 0, 7.2, 0.03);
  scene.add(sidewalkSouth);

  const lineMat = solid(0xb8b09a, { transparent: true, opacity: 0.45 });
  for (let x = -70; x <= 70; x += 6) {
    addBox(scene, 2.6, 0.02, 0.16, lineMat, x, 0.034, 0);
  }

  const crossRoad = groundPlane(9, 46, dirtMaterial(6, 32), 0, 29, 0.034);
  scene.add(crossRoad);
  const lane = groundPlane(118, 6, dirtMaterial(26, 2), 0, 29, 0.031);
  scene.add(lane);
  const serviceLane = groundPlane(132, 5.5, dirtMaterial(30, 1.5), 0, -34.5, 0.029);
  scene.add(serviceLane);

  const drivewayA = groundPlane(8, 3.4, sidewalkMat, -42, -9.7, 0.036);
  scene.add(drivewayA);
  const drivewayB = groundPlane(7, 3.4, sidewalkMat, -16, -10.6, 0.036);
  scene.add(drivewayB);
  const storeApron = groundPlane(14, 4.4, sidewalkMat, 57, -6.6, 0.037);
  scene.add(storeApron);
  const playgroundPad = groundPlane(13, 10, dirtMaterial(6, 5), 11.5, 43.5, 0.033);
  scene.add(playgroundPad);

  const apartmentA = buildApartment({
    width: 22,
    depth: 11,
    floors: 5,
    bodyColor: "#cbc1a6",
    bandColor: 0x81939a,
    number: "12",
    glazed: false,
  });
  apartmentA.name = "apartment-12";
  apartmentA.position.set(-42, 0, -17);
  scene.add(apartmentA);

  const apartmentB = buildApartment({
    width: 20,
    depth: 11,
    floors: 5,
    bodyColor: "#c9b6a4",
    bandColor: 0x8b8a72,
    number: "24",
    glazed: true,
  });
  apartmentB.name = "apartment-24";
  apartmentB.position.set(-16, 0, -18);
  scene.add(apartmentB);

  const school = buildSchool();
  school.name = "school";
  school.position.set(16, 0, -27);
  scene.add(school);

  const store = buildStore();
  store.name = "store";
  store.position.set(58, 0, -12);
  scene.add(store);

  const kiosk = buildKiosk();
  kiosk.position.set(6.8, 0, 9.7);
  kiosk.rotation.y = Math.PI;
  scene.add(kiosk);

  const boiler = buildBoilerHouse();
  boiler.name = "boiler-house";
  boiler.position.set(62, 0, -36);
  scene.add(boiler);

  const waterTower = buildWaterTower();
  waterTower.name = "water-tower";
  waterTower.position.set(-64, 0, -34);
  scene.add(waterTower);

  const pipeRun = buildPipeRun(118, 1.9);
  pipeRun.position.set(-1, 0, -34.5);
  scene.add(pipeRun);

  const arch = buildArch();
  arch.name = "arch";
  arch.position.set(-72, 0, 0);
  arch.rotation.y = Math.PI / 2;
  scene.add(arch);

  const busStop = buildBusStop();
  busStop.position.set(-4, 0, -8.9);
  scene.add(busStop);

  const utilityBox = buildUtilityBox();
  utilityBox.position.set(-31, 0, -8.9);
  scene.add(utilityBox);

  const northFlag = buildFlagPole();
  northFlag.group.position.set(-65, 0, -9.2);
  northFlag.group.scale.setScalar(0.8);
  scene.add(northFlag.group);

  const smokeSources = [];
  const clothGroups = [];
  const dogs = [];
  const sheepList = [];
  const swings = [];

  function addGerPlot(options) {
    const {
      x,
      z,
      seed = 1,
      tone = "warm",
      gateNorth = false,
      house = false,
      sheep = false,
      van = false,
      dog = false,
      smallTree = false,
      gerScale = 0.95,
    } = options;
    const rand = mulberry(seed * 67 + 19);
    const plot = new THREE.Group();
    plot.position.set(x, 0, z);
    scene.add(plot);

    const size = 14;
    const gateWidth = 3.4;
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
      gate.position.set(0, 0, -size / 2 - 0.08);
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
      gate.position.set(0, 0, size / 2 + 0.08);
    }
    plot.add(gate);

    const gerX = house ? -4.3 : (rand() - 0.5) * 1.2;
    const gerZ = house ? 0.6 : -0.9;
    const ger = buildGer(gerScale);
    ger.position.set(gerX, 0.02, gerZ);
    plot.add(ger);
    const gerShadow = contactShadow(6.2, 6.2, 0.35);
    gerShadow.position.set(gerX, 0.05, gerZ);
    plot.add(gerShadow);
    smokeSources.push({
      x: x + gerX - 1.0,
      z: z + gerZ - 0.48,
      y: 3.45,
      rise: 4.0,
      scale: 0.5,
      opacity: 0.4,
    });

    if (house) {
      const home = buildSelfBuiltHouse();
      home.position.set(2.3, 0, -0.2);
      plot.add(home);
      const homeShadow = contactShadow(11, 9, 0.4);
      homeShadow.position.set(2.3, 0.05, -0.2);
      plot.add(homeShadow);
      smokeSources.push({
        x: x + 4.9,
        z: z - 1.0,
        y: 6.2,
        rise: 2.5,
        scale: 0.35,
        opacity: 0.32,
      });
      const car = buildCar(0x6a7a6a, "van");
      car.position.set(4.6, 0, 4.6);
      car.rotation.y = -0.35;
      plot.add(car);
    }

    if (!house) {
      const wood = buildWoodpile();
      wood.position.set(-5.0, 0, -4.9);
      wood.rotation.y = 0.35;
      plot.add(wood);

      const outhouse = buildOuthouse();
      outhouse.position.set(5.0, 0, -4.9);
      outhouse.rotation.y = -0.12;
      plot.add(outhouse);

      const laundry = buildClothesline(4.0);
      laundry.group.position.set(-2.0, 0, 5.2);
      plot.add(laundry.group);
      for (const cloth of laundry.cloths) cloth.userData.dynamic = true;
      clothGroups.push({ cloths: laundry.cloths, phase: seed * 0.9 });

      const barrel = buildBarrel(seed % 2 ? 0x4a6a8a : 0x7a5a3a);
      barrel.position.set(-5.7, 0, 3.0);
      plot.add(barrel);

      const coal = buildCoalPile(0.65);
      coal.position.set(-4.3, 0, 5.7);
      plot.add(coal);

      const solar = buildSolarPanel();
      solar.position.set(4.5, 0, 3.2);
      solar.rotation.y = -0.4;
      plot.add(solar);

      const dish = buildSatelliteDish();
      dish.position.set(2.7, 0, 0.7);
      dish.rotation.y = -0.7;
      plot.add(dish);

      const antenna = buildAntenna(2.6);
      antenna.position.set(1.9, 0, -2.9);
      plot.add(antenna);

      const bin = buildTrashCan();
      bin.position.set(-5.8, 0, -1.7);
      plot.add(bin);

      if (rand() < 0.5) {
        const crate = buildCrate();
        crate.position.set(4.9, 0, 1.2);
        crate.rotation.y = 0.5;
        plot.add(crate);
      }
    }

    if (sheep) {
      const pen = new THREE.Group();
      pen.position.set(3.4, 0, 4.0);
      const railMat = solid(0x7a5a3c);
      for (const s of [-1, 1]) {
        addBox(pen, 4.4, 0.08, 0.08, railMat, 0, 0.85, s * 1.8);
        addBox(pen, 4.4, 0.08, 0.08, railMat, 0, 0.45, s * 1.8);
        addBox(pen, 0.08, 0.08, 3.6, railMat, s * 2.2, 0.85, 0);
        addBox(pen, 0.08, 0.08, 3.6, railMat, s * 2.2, 0.45, 0);
      }
      for (const sx of [-2.2, 2.2]) {
        for (const sz of [-1.8, 1.8]) {
          addBox(pen, 0.12, 1.0, 0.12, railMat, sx, 0.5, sz);
        }
      }
      plot.add(pen);
      for (let i = 0; i < 4; i++) {
        const animal = buildSheep();
        animal.position.set(x + 3.4 + (rand() - 0.5) * 2.6, 0, z + 4.0 + (rand() - 0.5) * 2.2);
        animal.rotation.y = rand() * TAU;
        animal.userData.dynamic = true;
        scene.add(animal);
        sheepList.push({
          group: animal,
          anchorX: x + 3.4 + (i - 1.5) * 0.8,
          anchorZ: z + 4.0 + (i % 2) * 0.6,
          phase: i * 1.7 + seed,
        });
      }
    }

    if (van) {
      const car = buildCar(seed % 2 ? 0x8a8a7a : 0x5a6a7a, "van");
      car.position.set(3.5, 0, 3.8);
      car.rotation.y = 0.5;
      plot.add(car);
    }

    if (dog) {
      const animal = buildDog();
      animal.position.set(x + 4.7, 0, z + 3.7);
      animal.userData.dynamic = true;
      scene.add(animal);
      dogs.push({ group: animal, anchorX: x + 4.7, anchorZ: z + 3.7, phase: seed * 1.3 });
    }

    if (smallTree) {
      const tree = buildTree("bush", seed + 4);
      tree.position.set(5.2, 0, -4.4);
      tree.scale.setScalar(1.2);
      plot.add(tree);
    }

    for (let i = 0; i < 5; i++) {
      const tuft = buildGrassTuft(seed * 9 + i);
      tuft.position.set(x + (rand() - 0.5) * 12.5, 0, z + (rand() - 0.5) * 12.5);
      scene.add(tuft);
    }
    return plot;
  }

  addGerPlot({ x: -46, z: 19, seed: 1, tone: "warm", dog: true, smallTree: true });
  addGerPlot({ x: -28, z: 19, seed: 2, tone: "grey", sheep: true });
  addGerPlot({ x: 16, z: 19, seed: 3, tone: "warm", van: true });
  addGerPlot({ x: 34, z: 19, seed: 4, tone: "warm", house: true });
  addGerPlot({ x: 48, z: 19, seed: 5, tone: "grey" });
  addGerPlot({ x: -38, z: 43, seed: 6, tone: "warm", gateNorth: true, smallTree: true });
  addGerPlot({ x: -13.5, z: 43, seed: 7, tone: "grey", gateNorth: true });
  addGerPlot({ x: 36, z: 43, seed: 8, tone: "warm", gateNorth: true, dog: true });

  const swingSet = buildSwingSet();
  swingSet.group.position.set(8.2, 0, 41.5);
  swingSet.group.rotation.y = 0.25;
  swingSet.group.userData.dynamic = true;
  scene.add(swingSet.group);
  swings.push(...swingSet.swings);

  const slide = buildSlide();
  slide.position.set(15.2, 0, 41.8);
  slide.rotation.y = -0.6;
  scene.add(slide);

  const sandbox = buildSandbox();
  sandbox.position.set(8.8, 0, 46.2);
  scene.add(sandbox);

  const playBench = buildBench();
  playBench.position.set(14.8, 0, 46.6);
  playBench.rotation.y = Math.PI;
  scene.add(playBench);

  const standpipe = buildStandpipe();
  standpipe.position.set(-5.8, 0, 34.0);
  scene.add(standpipe);

  const dumpsterA = buildDumpster();
  dumpsterA.position.set(5.7, 0, 34.0);
  dumpsterA.rotation.y = 0.2;
  scene.add(dumpsterA);
  const dumpsterB = buildDumpster();
  dumpsterB.position.set(6.8, 0, 34.4);
  dumpsterB.rotation.y = -0.1;
  scene.add(dumpsterB);

  const carA = buildCar(0x8f3a2e, "sedan");
  carA.position.set(-34, 0, -4.3);
  carA.rotation.y = 0.02;
  scene.add(carA);
  const carB = buildCar(0x6a7a72, "sedan");
  carB.position.set(54.5, 0, -6.4);
  carB.rotation.y = 0.35;
  scene.add(carB);

  const treePositions = [
    [-56, -7.6], [-28, -7.6], [4, -7.6],
    [-60, 8.6], [-38, 8.6], [2, 8.6], [25.5, 8.6], [42, 8.6], [60, 8.6],
    [-58, 28.4], [58, 28.4],
    [30, -7.6], [66, -7.6],
  ];
  const treeRand = mulberry(411);
  for (let i = 0; i < treePositions.length; i++) {
    const [x, z] = treePositions[i];
    const tree = buildTree("poplar", i + 2);
    tree.position.set(x, 0, z);
    tree.rotation.y = treeRand() * TAU;
    tree.scale.setScalar(0.9 + treeRand() * 0.4);
    scene.add(tree);
    const shadow = contactShadow(5.5, 5.5, 0.28);
    shadow.position.set(x, 0.05, z);
    scene.add(shadow);
  }

  const outsideRand = mulberry(1201);
  for (let i = 0; i < 11; i++) {
    const angle = outsideRand() * TAU;
    const dist = 86 + outsideRand() * 44;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const tree = buildTree(outsideRand() < 0.3 ? "bush" : "tree", i + 20);
    tree.position.set(x, terrainHeight(x, z), z);
    tree.rotation.y = outsideRand() * TAU;
    tree.scale.setScalar(0.8 + outsideRand() * 0.7);
    scene.add(tree);
  }
  for (let i = 0; i < 30; i++) {
    const angle = outsideRand() * TAU;
    const dist = 64 + outsideRand() * 55;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const rock = buildRock(i + 40);
    rock.position.set(x, terrainHeight(x, z) + 0.05, z);
    scene.add(rock);
  }
  for (let i = 0; i < 95; i++) {
    const angle = outsideRand() * TAU;
    const dist = 58 + outsideRand() * 62;
    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;
    const tuft = buildGrassTuft(i + 100);
    tuft.position.set(x, terrainHeight(x, z), z);
    tuft.scale.setScalar(0.8 + outsideRand() * 1.1);
    scene.add(tuft);
  }

  const poleXs = [-66, -46, -26, -6, 14, 34, 54];
  const lampGlows = [];
  const lampPositions = [-66, -26, 14, 54];
  for (const x of poleXs) {
    const pole = buildPowerPole({
      transformer: x === -26,
      lamp: lampPositions.includes(x),
      wood: x === 34,
    });
    pole.position.set(x, 0, 8.8);
    pole.rotation.y = Math.PI;
    scene.add(pole);
    if (lampPositions.includes(x)) {
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture(),
          color: 0xffc070,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
          opacity: 0,
        })
      );
      glow.scale.set(5.2, 5.2, 1);
      glow.position.set(x, 7.35, 7.35);
      scene.add(glow);
      lampGlows.push(glow);
    }
  }

  const storeGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: 0xffc070,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      opacity: 0,
    })
  );
  storeGlow.scale.set(4.4, 4.4, 1);
  storeGlow.position.set(62.05, 3.05, -7.4);
  scene.add(storeGlow);
  lampGlows.push(storeGlow);

  const lampPoolMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture(),
    color: 0xffb060,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
    opacity: 0,
  });
  for (const x of lampPositions) {
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lampPoolMaterial);
    pool.rotation.x = -Math.PI / 2;
    pool.scale.set(10, 7, 1);
    pool.position.set(x, 0.052, 7.1);
    scene.add(pool);
  }
  const storePool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lampPoolMaterial);
  storePool.rotation.x = -Math.PI / 2;
  storePool.scale.set(9, 6, 1);
  storePool.position.set(62, 0.052, -5.6);
  scene.add(storePool);

  const wireMaterial = new THREE.LineBasicMaterial({ color: 0x2f2c28 });
  const wireOffsets = [
    { z: -0.9, y: 9.5, sag: 0.55 },
    { z: 0.9, y: 9.5, sag: 0.55 },
    { z: 0, y: 8.8, sag: 0.75 },
  ];
  for (const offset of wireOffsets) {
    const points = [];
    for (let i = 0; i < poleXs.length - 1; i++) {
      const x1 = poleXs[i];
      const x2 = poleXs[i + 1];
      for (let k = 0; k <= 10; k++) {
        const u = k / 10;
        const x = x1 + (x2 - x1) * u;
        const y = offset.y - Math.sin(u * Math.PI) * offset.sag;
        points.push(new THREE.Vector3(x, y, 8.8 + offset.z));
      }
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), wireMaterial));
  }

  const horses = [];
  const horsePositions = [
    [-44, 65, 0.4],
    [-51, 62, 1.2],
    [-47, 71, -0.6],
  ];
  for (let i = 0; i < horsePositions.length; i++) {
    const [x, z, rot] = horsePositions[i];
    const horse = buildHorse();
    horse.position.set(x, terrainHeight(x, z), z);
    horse.rotation.y = rot;
    horse.userData.dynamic = true;
    scene.add(horse);
    horses.push({ group: horse, baseYaw: rot, phase: i * 1.9 });
  }

  const walkers = [];
  function addWalker(options, a, b, speed, phase) {
    const person = buildPerson(options);
    person.group.position.set(a.x, 0, a.z);
    person.group.userData.dynamic = true;
    scene.add(person.group);
    walkers.push({ ...person, a, b, speed, phase });
    return person;
  }

  addWalker(
    { coat: 0x2b4a7a, hat: 0x8c2f24, pants: 0x3a3630 },
    { x: -22, z: 7.8 },
    { x: 4, z: 7.8 },
    16,
    0.1
  );
  addWalker(
    { coat: 0x6a5a4a, hat: 0x2b4a7a, pants: 0x4a4a42 },
    { x: -10, z: -6.8 },
    { x: 44, z: -6.8 },
    18,
    0.55
  );
  addWalker(
    { coat: 0xb04a32, hat: 0x2b4a7a, pants: 0x3a3630, backpack: true, child: true, scale: 0.74 },
    { x: 5, z: -10.6 },
    { x: 26, z: -10.6 },
    24,
    0.3
  );

  const storeShopper = buildPerson({ coat: 0x4a6a5a, hat: 0x8c2f24, pants: 0x3a3630, stance: true });
  storeShopper.group.position.set(52.8, 0, -6.5);
  storeShopper.group.rotation.y = Math.PI - 0.2;
  storeShopper.group.userData.dynamic = true;
  scene.add(storeShopper.group);

  const standpipePerson = buildPerson({ coat: 0x7a5a8a, hat: 0x2b4a7a, pants: 0x3a3630, stance: true });
  standpipePerson.group.position.set(-7.0, 0, 34.6);
  standpipePerson.group.rotation.y = 1.2;
  standpipePerson.group.userData.dynamic = true;
  scene.add(standpipePerson.group);

  const herder = buildPerson({ coat: 0x8c5a32, hat: 0x2b4a7a, pants: 0x3a3630, stance: true });
  herder.group.position.set(-40, terrainHeight(-40, 66), 66);
  herder.group.rotation.y = 2.4;
  herder.group.userData.dynamic = true;
  scene.add(herder.group);

  const playgroundKid = buildPerson({ coat: 0xc85a3c, hat: 0x2b4a7a, pants: 0x3a3630, child: true, scale: 0.72 });
  playgroundKid.group.position.set(11.5, 0, 44.6);
  playgroundKid.group.rotation.y = -0.4;
  playgroundKid.group.userData.dynamic = true;
  scene.add(playgroundKid.group);

  const birds = [];
  for (let i = 0; i < 4; i++) {
    const bird = buildBird();
    bird.group.userData.dynamic = true;
    scene.add(bird.group);
    birds.push({ ...bird, phase: i * 1.9 });
  }

  const cloudRand = mulberry(888);
  const clouds = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU + cloudRand() * 0.4;
    const dist = 170 + cloudRand() * 55;
    const cloud = buildCloud(
      Math.sin(angle) * dist,
      62 + cloudRand() * 34,
      Math.cos(angle) * dist,
      24 + cloudRand() * 22,
      i
    );
    cloud.rotation.y = angle + Math.PI;
    cloud.userData.dynamic = true;
    scene.add(cloud);
    clouds.push({
      group: cloud,
      baseX: cloud.position.x,
      baseZ: cloud.position.z,
      phase: i * 1.3,
    });
  }

  smokeSources.push({
    x: 64.8,
    z: -38.2,
    y: 18.6,
    rise: 11,
    scale: 1.9,
    opacity: 0.48,
  });

  const smokePuffs = [];
  const puffGeo = new THREE.SphereGeometry(1, 5, 4);
  for (let s = 0; s < smokeSources.length; s++) {
    const source = smokeSources[s];
    const count = source.scale > 1 ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xd8d4cc,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        fog: true,
      });
      const puff = new THREE.Mesh(puffGeo, material);
      puff.userData.dynamic = true;
      scene.add(puff);
      smokePuffs.push({
        mesh: puff,
        source,
        phase: i / count + s * 0.137,
      });
    }
  }

  const flags = [];
  scene.traverse((object) => {
    if (object.userData.isFlag) {
      flags.push(object);
      object.userData.dynamic = true;
    }
  });
  flags.forEach((flag, i) => {
    flag.userData.phase = i * 1.7;
  });

  mergeStatic(scene);

  const windowMats = windowMaterials();
  const signMats = signMaterials();
  const lampMats = lampMaterials();
  const shopMat = shopWindowMaterial();

  function apply(state) {
    const t = state.t;

    sun.position.copy(state.sunDir).multiplyScalar(90);
    sun.color.copy(state.sunColor);
    sun.intensity = state.sunIntensity;
    moon.position.copy(state.sunDir).multiplyScalar(-90);
    moon.intensity = state.night * 0.75;
    hemi.color.copy(state.hemiSky);
    hemi.groundColor.copy(state.hemiGround);
    hemi.intensity = state.hemiIntensity;
    scene.fog.color.copy(state.fogColor);

    skyUniforms.topColor.value.copy(state.skyTop);
    skyUniforms.horizonColor.value.copy(state.skyHorizon);
    skyUniforms.sunColor.value.copy(state.sunColor);
    skyUniforms.sunDirection.value.copy(state.sunDir);
    skyUniforms.glow.value = 0.18 + state.dusk * 0.5;

    sunSprite.position.copy(state.sunDir).multiplyScalar(335);
    sunSprite.material.color.copy(state.sunColor).lerp(new THREE.Color("#fff8e8"), 0.4);
    sunSprite.material.opacity = state.sunOpacity * 0.85;
    moonSprite.position.copy(state.sunDir).multiplyScalar(-330);
    moonSprite.material.opacity = state.moonOpacity;
    stars.material.opacity = state.night * 0.85;

    const nightLights = sstep(state.night, 0.22, 0.78);
    for (let i = 0; i < windowMats.length; i++) {
      const flicker = 1 + Math.sin(t * 42 + i * 2.3) * 0.03;
      windowMats[i].emissiveIntensity = 1.7 * nightLights * flicker;
    }
    shopMat.emissiveIntensity = 0.08 + nightLights * 1.35;
    for (let i = 0; i < signMats.length; i++) {
      signMats[i].emissiveIntensity = 0.05 + nightLights * 0.9;
    }
    for (const material of lampMats) {
      material.emissiveIntensity = nightLights * 2.1;
    }
    for (const glow of lampGlows) {
      glow.material.opacity = nightLights * 0.8;
    }
    lampPoolMaterial.opacity = nightLights * 0.42;

    for (const cloud of clouds) {
      cloud.group.position.x = cloud.baseX + Math.sin(t * 7 + cloud.phase) * 5;
      cloud.group.position.z = cloud.baseZ + Math.cos(t * 5 + cloud.phase) * 4;
      for (const child of cloud.group.children) {
        child.material.color.copy(state.cloudColor);
        child.material.opacity = 0.7 + state.day * 0.2;
      }
    }

    for (const puff of smokePuffs) {
      const p = (t * 30 + puff.phase) % 1;
      const source = puff.source;
      const phase = puff.phase * 9.1;
      puff.mesh.position.set(
        source.x + Math.sin(p * 6.5 + phase) * 0.55 + p * source.rise * 0.22,
        source.y + p * source.rise,
        source.z + Math.cos(p * 5.2 + phase) * 0.45
      );
      const scale = source.scale * (0.35 + p * 1.6);
      puff.mesh.scale.set(scale, scale, scale);
      puff.mesh.material.opacity = (1 - p) * source.opacity;
      puff.mesh.material.color.setHex(state.night > 0.5 ? 0x8a8c94 : 0xd8d4cc);
    }

    for (const walker of walkers) {
      const u = (t * walker.speed + walker.phase) % 1;
      const forward = u < 0.5;
      const k = forward ? u * 2 : 2 - u * 2;
      const x = walker.a.x + (walker.b.x - walker.a.x) * k;
      const z = walker.a.z + (walker.b.z - walker.a.z) * k;
      walker.group.position.set(x, 0, z);
      const dx = (walker.b.x - walker.a.x) * (forward ? 1 : -1);
      const dz = (walker.b.z - walker.a.z) * (forward ? 1 : -1);
      walker.group.rotation.y = Math.atan2(dx, dz);
      const step = Math.sin(t * 2200 + walker.phase * 17);
      walker.legs[0].rotation.x = step * 0.55;
      walker.legs[1].rotation.x = -step * 0.55;
      walker.arms[0].rotation.x = -step * 0.35;
      walker.arms[1].rotation.x = step * 0.35;
      walker.group.position.y = Math.abs(Math.cos(t * 1100 + walker.phase * 17)) * 0.03;
    }

    for (const sheep of sheepList) {
      const angle = t * TAU * 6 + sheep.phase;
      sheep.group.position.x = sheep.anchorX + Math.sin(angle) * 0.65;
      sheep.group.position.z = sheep.anchorZ + Math.cos(angle * 0.7) * 0.55;
      sheep.group.rotation.y = angle + 1.7;
    }

    for (const dog of dogs) {
      const angle = t * TAU * 16 + dog.phase;
      dog.group.position.x = dog.anchorX + Math.sin(angle) * 1.1;
      dog.group.position.z = dog.anchorZ + Math.cos(angle) * 1.1;
      dog.group.rotation.y = angle + Math.PI / 2;
      dog.group.position.y = Math.abs(Math.sin(t * 2400 + dog.phase)) * 0.04;
    }

    for (const horse of horses) {
      horse.group.rotation.y = horse.baseYaw + Math.sin(t * 38 + horse.phase) * 0.05;
      horse.group.position.y =
        terrainHeight(horse.group.position.x, horse.group.position.z) +
        Math.sin(t * 70 + horse.phase) * 0.005;
    }

    for (let i = 0; i < swings.length; i++) {
      swings[i].rotation.x = Math.sin(t * 520 + i * 1.9) * 0.42;
    }

    for (const clothGroup of clothGroups) {
      for (let i = 0; i < clothGroup.cloths.length; i++) {
        const cloth = clothGroup.cloths[i];
        cloth.rotation.x = Math.sin(t * 700 + clothGroup.phase + i * 1.3) * 0.09;
        cloth.rotation.y = Math.sin(t * 540 + clothGroup.phase + i) * 0.06;
      }
    }

    for (const flag of flags) {
      const position = flag.geometry.attributes.position;
      const base = flag.userData.basePositions;
      if (!base) continue;
      for (let i = 0; i < position.count; i++) {
        const x = base[i * 3];
        const k = Math.min(1, Math.max(0, x / 1.9));
        const wave =
          Math.sin(x * 6.5 - t * 760 + flag.userData.phase) * 0.16 * k +
          Math.sin(x * 11 + t * 480) * 0.045 * k;
        position.setZ(i, wave);
      }
      position.needsUpdate = true;
      flag.geometry.computeVertexNormals();
    }

    for (const bird of birds) {
      const angle = t * TAU * 8 + bird.phase;
      bird.group.position.set(
        Math.sin(angle) * 46,
        23 + Math.sin(t * 160 + bird.phase) * 1.8,
        Math.cos(angle) * 46
      );
      bird.group.rotation.y = angle;
      const flap = Math.sin(t * 2400 + bird.phase) * 0.85;
      bird.left.rotation.z = flap;
      bird.right.rotation.z = -flap;
    }

    storeShopper.group.rotation.y = Math.PI - 0.2 + Math.sin(t * 24) * 0.05;
    standpipePerson.group.rotation.y = 1.2 + Math.sin(t * 30) * 0.04;
    herder.group.rotation.y = 2.4 + Math.sin(t * 26) * 0.04;
    playgroundKid.group.position.y = Math.abs(Math.sin(t * 2600)) * 0.04;
  }

  apply(worldState(0.6));
  return { scene, apply };
}
