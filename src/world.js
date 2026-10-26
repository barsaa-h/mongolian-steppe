import * as THREE from "three";
import {
  buildBird,
  buildCloud,
  lampMaterials,
  mat,
  mulberry,
  shopWindowMaterial,
  signMaterials,
  windowMaterials,
} from "./parts.js";
import { cloneRepeat, glowTexture, steppeTexture } from "./textures.js";
import { mergeStatic } from "./mergeStatic.js";
import { placeTown, townHeight } from "./district.js";
import { terrainHeight, groundGeometry } from "./terrain.js";
import { placeWinterLandscape } from "./winter.js";

const TAU = Math.PI * 2;

function sstep(x, min, max) {
  return THREE.MathUtils.smoothstep(x, min, max);
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
    .lerp(new THREE.Color("#9a8c5e"), day);

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
  scene.fog = new THREE.Fog(0xbcc8c6, 125, 720);

  const skyUniforms = {
    topColor: { value: new THREE.Color("#5a8ec6") },
    horizonColor: { value: new THREE.Color("#c9d4cc") },
    sunColor: { value: new THREE.Color("#fff2d8") },
    sunDirection: { value: new THREE.Vector3(0, 1, 0) },
    glow: { value: 0.4 },
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1400, 24, 16),
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
          float h = clamp(d.y * 3.0, 0.0, 1.0);
          vec3 col = mix(horizonColor, topColor, pow(h, 0.55));
          float s = max(dot(d, normalize(sunDirection)), 0.0);
          col += sunColor * pow(s, 24.0) * glow;
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
      positions[i * 3] = Math.cos(a) * r * 1050;
      positions[i * 3 + 1] = y * 1050;
      positions[i * 3 + 2] = Math.sin(a) * r * 1050;
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
  sunSprite.scale.set(110, 110, 1);
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
  moonSprite.scale.set(60, 60, 1);
  scene.add(moonSprite);

  const sun = new THREE.DirectionalLight(0xfff2d8, 1.4);
  sun.position.set(50, 80, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -190, right: 190, top: 160, bottom: -160, near: 1, far: 700 });
  sun.shadow.normalBias = 0.12;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const moon = new THREE.DirectionalLight(0x7a8cba, 0);
  moon.position.set(-50, 80, -25);
  scene.add(moon);
  const hemi = new THREE.HemisphereLight(0xb7cbe0, 0x8a8456, 0.9);
  scene.add(hemi);

  const groundGeo = groundGeometry();
  const groundMaterial = mat({ map: cloneRepeat(steppeTexture(), 130, 130) });
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.userData.noMerge = true;
  ground.receiveShadow = true;
  scene.add(ground);

  placeWinterLandscape(scene);

  const town = placeTown(scene);
  const {
    smokeSources,
    clothGroups,
    dogs,
    sheepList,
    swings,
    lampGlows,
    lampPoolMaterial,
    walkers,
    horses,
    storeShopper,
    standpipePerson,
    herder,
    playgroundKid,
  } = town;

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
    cloud.name = "autumn-cloud";
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

  const smokePuffs = [];
  const puffGeo = new THREE.SphereGeometry(1, 5, 4);
  for (let s = 0; s < smokeSources.length; s++) {
    const source = smokeSources[s];
    const count = source.scale > 1.2 ? 6 : 3;
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
  scene.traverse(object => {
    if (!object.isMesh || object.userData.noMerge || object.material.transparent || object.material.isShaderMaterial) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });

  const windowMats = windowMaterials();
  const signMats = signMaterials();
  const lampMats = lampMaterials();
  const shopMat = shopWindowMaterial();

  function apply(state, animationTime = state.t) {
    const t = animationTime;

    sun.position.copy(state.sunDir).multiplyScalar(360);
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

    sunSprite.position.copy(state.sunDir).multiplyScalar(1100);
    sunSprite.material.color.copy(state.sunColor).lerp(new THREE.Color("#fff8e8"), 0.4);
    sunSprite.material.opacity = state.sunOpacity * 0.85;
    moonSprite.position.copy(state.sunDir).multiplyScalar(-1100);
    moonSprite.material.opacity = state.moonOpacity;
    stars.material.opacity = state.night * (1 - state.dusk) * 0.65;

    const nightLights = Math.max(sstep(state.night, 0.12, 0.72), state.dusk * 0.72);
    for (let i = 0; i < windowMats.length; i++) {
      const flicker = 1 + Math.sin(t * 42 + i * 2.3) * 0.03;
      windowMats[i].emissiveIntensity = 3.2 * nightLights * flicker;
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
      walker.group.position.set(
        x,
        townHeight(x, z) + Math.abs(Math.cos(t * 1100 + walker.phase * 17)) * 0.03,
        z
      );
      const dx = (walker.b.x - walker.a.x) * (forward ? 1 : -1);
      const dz = (walker.b.z - walker.a.z) * (forward ? 1 : -1);
      walker.group.rotation.y = Math.atan2(dx, dz);
      const step = Math.sin(t * 2200 + walker.phase * 17);
      walker.legs[0].rotation.x = step * 0.55;
      walker.legs[1].rotation.x = -step * 0.55;
      walker.arms[0].rotation.x = -step * 0.35;
      walker.arms[1].rotation.x = step * 0.35;
    }

    for (const sheep of sheepList) {
      const angle = t * TAU * 6 + sheep.phase;
      sheep.group.position.x = sheep.anchorX + Math.sin(angle) * 0.65;
      sheep.group.position.y = sheep.groundY || 0;
      sheep.group.position.z = sheep.anchorZ + Math.cos(angle * 0.7) * 0.55;
      sheep.group.rotation.y = angle + 1.7;
    }

    for (const dog of dogs) {
      const angle = t * TAU * 16 + dog.phase;
      dog.group.position.x = dog.anchorX + Math.sin(angle) * 1.1;
      dog.group.position.z = dog.anchorZ + Math.cos(angle) * 1.1;
      dog.group.rotation.y = angle + Math.PI / 2;
      dog.group.position.y = (dog.groundY || 0) + Math.abs(Math.sin(t * 2400 + dog.phase)) * 0.04;
    }

    for (const horse of horses) {
      horse.group.rotation.y = horse.baseYaw + Math.sin(t * 38 + horse.phase) * 0.05;
      const hx = horse.group.position.x;
      const hz = horse.group.position.z;
      const terrace = townHeight(hx, hz);
      horse.group.position.y =
        (terrace > 0 ? terrace : terrainHeight(hx, hz)) +
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
        Math.sin(angle) * 78,
        32 + Math.sin(t * 160 + bird.phase) * 2.2,
        Math.cos(angle) * 78
      );
      bird.group.rotation.y = angle;
      const flap = Math.sin(t * 2400 + bird.phase) * 0.85;
      bird.left.rotation.z = flap;
      bird.right.rotation.z = -flap;
    }

    storeShopper.group.rotation.y = Math.PI - 0.2 + Math.sin(t * 24) * 0.05;
    standpipePerson.group.rotation.y = 1.2 + Math.sin(t * 30) * 0.04;
    herder.group.rotation.y = 2.2 + Math.sin(t * 26) * 0.04;
    playgroundKid.group.position.y =
      (playgroundKid.group.userData.groundY || 0) + Math.abs(Math.sin(t * 2600)) * 0.04;
  }

  apply(worldState(0.26));
  return { scene, apply };
}
