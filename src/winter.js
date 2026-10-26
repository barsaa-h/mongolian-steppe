import * as THREE from "three";
import cabLayout from "../assets/cast/cab.json" with { type: "json" };
import {
  addBox, asphaltMaterial, buildGrassTuft, buildPowerPole, buildRock, cylinder, mulberry,
  plasterMaterial, signMaterial, solid,
} from "./parts.js";
import { terrainHeight } from "./terrain.js";
import { mountainTexture } from "./textures.js";

export const APPROACH_POINTS = [
  [-212, 108], [-190, 81], [-174, 56], [-155, 31], [-147, 13], [-162, 0],
];

export function approachCurve() {
  return new THREE.CatmullRomCurve3(APPROACH_POINTS.map(([x, z]) =>
    new THREE.Vector3(x, 0, z)));
}

export function mountainGeometry(radius, height, seed) {
  const rand = mulberry(seed);
  const segments = 100;
  const peaks = Array.from({ length: segments }, (_, i) => 0.62 + Math.sin(i / segments * Math.PI * 6 + seed) * 0.12 + Math.cos(i / segments * Math.PI * 10) * 0.07);
  const vertices = [];
  const colors = [];
  const profiles = [[-155, 0], [-125, 0.05], [-95, 0.14], [-65, 0.28], [-35, 0.52], [0, 1], [30, 0.73], [65, 0.45], [100, 0.16], [145, 0]];
  const snow = new THREE.Color("#aaa99a");
  const rock = new THREE.Color("#777e78");
  for (let row = 0; row < profiles.length - 1; row++) {
    for (let i = 0; i < segments; i++) {
      const point = (r, j) => {
        const index = j % segments;
        const angle = j / segments * Math.PI * 2;
        const [offset, h] = profiles[r];
        const y = height * h * peaks[index] * (1 + Math.sin(index * 0.19 + r * 0.8) * 0.035) - 5;
        return [Math.sin(angle) * (radius + offset), y, Math.cos(angle) * (radius + offset)];
      };
      const a = point(row, i), b = point(row + 1, i);
      const c = point(row, i + 1), d = point(row + 1, i + 1);
      for (const triangle of [[a, b, c], [c, b, d]]) {
        const snowy = row === 4 && rand() > 0.94;
        const color = (snowy ? snow : rock).clone().multiplyScalar(0.75 + rand() * 0.25);
        for (const vertex of triangle) {
          vertices.push(...vertex);
          colors.push(color.r, color.g, color.b);
        }
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const uv = [];
  for (let i = 0; i < vertices.length; i += 3) uv.push((vertices[i] + vertices[i + 2]) * 0.035, vertices[i + 1] * 0.07);
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}

export function placeWinterLandscape(scene) {
  for (const [radius, height, seed, tint] of [
    [710, 85, 492, 0x959c9e], [475, 58, 731, 0xa2a697],
  ]) {
    const mountains = new THREE.Mesh(mountainGeometry(radius, height, seed),
      new THREE.MeshBasicMaterial({ map: mountainTexture(), vertexColors: true, color: tint, side: THREE.DoubleSide }));
    mountains.name = "snow-mountains";
    mountains.userData.noMerge = true;
    scene.add(mountains);
  }

  const curve = approachCurve();
  const roadVertices = [];
  const roadUV = [];
  const shoulderVertices = [];
  const samples = 100;
  const edge = (u, side, width) => {
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const x = p.x - t.z * side * width;
    const z = p.z + t.x * side * width;
    return [x, terrainHeight(x, z) + 0.08, z];
  };
  for (let i = 0; i < samples; i++) {
    const u = i / samples, v = (i + 1) / samples;
    for (const [vertices, width] of [[roadVertices, 4.3], [shoulderVertices, 5.8]]) {
      const a = edge(u, -1, width), b = edge(u, 1, width);
      const c = edge(v, -1, width), d = edge(v, 1, width);
      for (const p of [a, b, c, b, d, c]) vertices.push(...p);
    }
    roadUV.push(0, u * 22, 1, u * 22, 0, v * 22, 1, u * 22, 1, v * 22, 0, v * 22);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(roadVertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(roadUV, 2));
  geometry.computeVertexNormals();
  const road = new THREE.Mesh(geometry, asphaltMaterial(1, 1));
  road.name = "valley-approach";
  scene.add(road);
  const shoulderGeo = new THREE.BufferGeometry();
  shoulderGeo.setAttribute("position", new THREE.Float32BufferAttribute(shoulderVertices, 3));
  shoulderGeo.computeVertexNormals();
  const shoulder = new THREE.Mesh(shoulderGeo, solid(0x9d947b, { side: THREE.DoubleSide }));
  shoulder.position.y = -0.035;
  scene.add(shoulder);

  for (let i = 0; i < 15; i++) {
    const u = 0.04 + i * 0.062;
    for (const side of [-1, 1]) {
      const [x, y, z] = edge(u, side, 5.3);
      addBox(scene, 0.45, 1.2, 0.45, solid(0xc4cbd0), x, y + 0.6, z);
      addBox(scene, 0.47, 0.34, 0.47, solid(0x30343b), x, y + 0.8, z);
    }
    if (i % 3 === 0) {
      const [x, y, z] = edge(u, 1, 9);
      const pole = buildPowerPole({ lamp: false, wood: true });
      pole.position.set(x, y, z);
      scene.add(pole);
    }
  }

  const sign = new THREE.Group();
  sign.name = "naran-road-sign";
  const sx = -180, sz = 46;
  sign.position.set(sx, terrainHeight(sx, sz), sz);
  sign.rotation.y = -1.03;
  for (const x of [-3.7, 3.7]) {
    addBox(sign, 0.24, 10.5, 0.24, solid(0x4a4b4b), x, 5.25, 0);
    addBox(sign, 0.65, 0.5, 0.65, plasterMaterial("#959b9d"), x, 0.25, 0);
  }
  addBox(sign, 10.8, 4.2, 0.22, solid(0x4c565e), 0, 9.3, 0);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 3.9), signMaterial("НАРАН", {
    width: 256, height: 96, bg: "#263f54", fg: "#d6d8d2", accent: "#858f96",
  }));
  board.position.set(0, 9.3, 0.125);
  sign.add(board);
  const rand = mulberry(918);
  for (let i = 0; i < 65; i++) {
    const x = (rand() - 0.5) * 10.6, y = 7.25 + rand() * 4.05;
    addBox(sign, 0.04 + rand() * 0.2, 0.05 + rand() * 0.18, 0.015,
      solid(i % 2 ? 0x855d43 : 0x74818a), x, y, 0.145);
  }
  scene.add(sign);

  for (let i = 0; i < 45; i++) {
    const u = rand() * 0.87;
    const [x, , z] = edge(u, i % 2 ? -1 : 1, 7 + rand() * 12);
    const rock = buildRock(i + 180);
    rock.position.set(x, terrainHeight(x, z), z);
    rock.scale.multiplyScalar(1.2 + rand() * 1.8);
    scene.add(rock);
  }

  for (let i = 0; i < 140; i++) {
    const [x, , z] = edge(rand() * 0.9, i % 2 ? -1 : 1, 6 + rand() * 16);
    const grass = buildGrassTuft(i + 300);
    grass.position.set(x, terrainHeight(x, z), z);
    grass.scale.setScalar(1 + rand() * 1.5);
    scene.add(grass);
  }

  const truck = buildKamaz();
  positionKamaz(truck, curve, 0.43);
  scene.add(truck);

  const tower = new THREE.Group();
  tower.name = "radio-mast";
  tower.position.set(98, terrainHeight(98, -112), -112);
  const rod = (a, b, material) => {
    const direction = new THREE.Vector3().subVectors(b, a);
    const mesh = cylinder(0.07, 0.07, direction.length(), material, 4);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    tower.add(mesh);
  };
  for (let level = 0; level < 8; level++) {
    const material = solid(level % 2 ? 0x8b574e : 0xb1bbc3);
    for (let side = 0; side < 3; side++) {
      const corner = (height, index) => {
        const angle = index / 3 * Math.PI * 2;
        const width = 2.8 * (1 - height / 50);
        return new THREE.Vector3(Math.sin(angle) * width, height, Math.cos(angle) * width);
      };
      const a = corner(level * 5, side), b = corner((level + 1) * 5, side);
      rod(a, b, material);
      rod(a, corner(level * 5, side + 1), material);
      rod(a, corner((level + 1) * 5, side + 1), material);
    }
  }
  addBox(tower, 0.35, 0.35, 0.35, new THREE.MeshBasicMaterial({ color: 0xff4935 }), 0, 41, 0);
  scene.add(tower);
}

export function snowOnRoofs(scene) {
  const materials = new Set();
  scene.traverse(object => {
    if (!object.isMesh || object.userData.noMerge || object.isSkinnedMesh) return;
    for (let parent = object; parent; parent = parent.parent) {
      if (parent.userData.dynamic) return;
    }
    const material = object.material;
    if (!material?.isMeshLambertMaterial || material.transparent || material.emissiveMap
      || material.userData.noSnow) return;
    materials.add(material);
  });
  for (const material of materials) {
    material.onBeforeCompile = shader => {
      shader.vertexShader = "varying vec3 vSnowNormal;\nvarying vec3 vSnowPosition;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `
        #include <begin_vertex>
        vSnowNormal = normalize(mat3(modelMatrix) * normal);
        vSnowPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      `);
      shader.fragmentShader = "varying vec3 vSnowNormal;\nvarying vec3 vSnowPosition;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `
        #include <color_fragment>
        vec2 snowCell = floor(vSnowPosition.xz * 7.0);
        float snowGrain = fract(sin(dot(snowCell, vec2(12.9898, 78.233))) * 43758.5453);
        float snowCover = smoothstep(0.62, 0.84, normalize(vSnowNormal).y);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.68, 0.75, 0.82) * (0.88 + snowGrain * 0.12), snowCover);
      `);
    };
    material.customProgramCacheKey = () => "winter-snow-v1";
    material.needsUpdate = true;
  }
}

export function positionKamaz(truck, curve, u) {
  const truckPoint = curve.getPointAt(u);
  const truckDirection = curve.getTangentAt(u);
  truck.position.set(truckPoint.x, terrainHeight(truckPoint.x, truckPoint.z) + 0.1, truckPoint.z);
  const grade = (terrainHeight(truckPoint.x + truckDirection.x, truckPoint.z + truckDirection.z)
    - terrainHeight(truckPoint.x - truckDirection.x, truckPoint.z - truckDirection.z)) / 2;
  const slopeX = (terrainHeight(truckPoint.x + 1, truckPoint.z) - terrainHeight(truckPoint.x - 1, truckPoint.z)) / 2;
  const slopeZ = (terrainHeight(truckPoint.x, truckPoint.z + 1) - terrainHeight(truckPoint.x, truckPoint.z - 1)) / 2;
  truck.up.set(-slopeX, 1, -slopeZ).normalize();
  truck.lookAt(truck.position.x + truckDirection.x, truck.position.y + grade, truck.position.z + truckDirection.z);
  truck.updateMatrixWorld(true);
}

export function buildKamaz() {
  const truck = new THREE.Group();
  truck.name = "ganaa-kamaz";
  truck.userData.dynamic = true;
  truck.userData.wheels = [];
  const chassis = solid(0x303336);
  const cab = plasterMaterial("#975b42");
  const canvas = plasterMaterial("#656b62");
  addBox(truck, 2.65, 0.4, 7.2, chassis, 0, 1.1, 0);
  // Exterior panels leave actual room for the driver, seat, wheel and pedals.
  addBox(truck, 2.75, 0.18, 2.2, cab, 0, 1.4, 2.4);
  addBox(truck, 2.75, 1.0, 0.12, cab, 0, 1.8, 3.45);
  for (const x of [-1.31, 1.31]) addBox(truck, 0.12, 1.0, 2.2, cab, x, 1.8, 2.4);
  addBox(truck, 2.8, 0.16, 2.3, cab, 0, 3.72, 2.4);
  addBox(truck, 2.75, 2.5, 0.12, cab, 0, 2.45, 1.3);
  for (const x of [-1.32, 0, 1.32]) addBox(truck, 0.08, 1.35, 0.09, cab, x, 3.02, 3.47);
  for (const x of [-1.34, 1.34]) addBox(truck, 0.09, 1.4, 0.1, cab, x, 3.02, 1.4);
  const glass = new THREE.MeshBasicMaterial({ color: 0x8babb9, transparent: true, opacity: 0.13, depthWrite: false });
  addBox(truck, 2.52, 1.3, 0.02, glass, 0, 3, 3.49);
  for (const x of [-1.37, 1.37]) addBox(truck, 0.02, 1.25, 1.95, glass, x, 3.02, 2.4);
  addBox(truck, 2.6, 0.35, 0.55, solid(0x3d4140), 0, 1.83, 3.15);
  for (const x of [-0.65, 0.65]) {
    addBox(truck, 0.75, 0.2, 0.7, solid(0x4a3c32), x, 1.83, 2.25);
    addBox(truck, 0.75, 0.85, 0.14, solid(0x4a3c32), x, 2.3, 1.94);
  }
  const steering = new THREE.Mesh(new THREE.TorusGeometry(cabLayout.wheelRadius, 0.025, 5, 16), chassis);
  steering.position.fromArray(cabLayout.wheelCenter);
  steering.rotation.x = cabLayout.wheelTilt;
  truck.add(steering);
  addBox(steering, 0.43, 0.025, 0.03, chassis, 0, 0, 0);
  addBox(steering, 0.025, 0.43, 0.03, chassis, 0, 0, 0);
  truck.userData.steering = steering;
  addBox(truck, 0.42, 0.3, 0.24, solid(0x493c2c), -0.7, 2.05, 1.65);
  const flask = cylinder(0.07, 0.07, 0.28, solid(0x84908c), 8);
  flask.position.set(-0.3, 2.16, 3.1);
  truck.add(flask);
  const radio = addBox(truck, 0.48, 0.2, 0.08, solid(0x222a2d), -0.1, 2.12, 2.88);
  addBox(radio, 0.22, 0.045, 0.015, new THREE.MeshBasicMaterial({ color: 0x93a471 }), 0, 0.025, -0.05);
  for (const x of [-0.8, 0.7]) addBox(truck, 0.035, 0.6, 0.04, chassis, x, 2.72, 3.53, 0);
  const dashboardLight = new THREE.PointLight(0xffd0a0, 2.4, 4, 1.5);
  dashboardLight.position.set(0.5, 3.32, 3.15);
  truck.add(dashboardLight);
  addBox(truck, 2.5, 0.35, 4.7, solid(0x4e554c), 0, 1.5, -1.15);
  addBox(truck, 2.55, 2.35, 4.55, canvas, 0, 2.85, -1.15);
  for (const z of [-3.1, -1.2, 0.85]) {
    addBox(truck, 2.65, 0.08, 0.07, chassis, 0, 4.05, z);
    for (const x of [-1.3, 1.3]) addBox(truck, 0.055, 2.4, 0.08, chassis, x, 2.85, z);
  }
  addBox(truck, 0.08, 1.05, 0.08, cab, 0, 2.95, 3.56);
  addBox(truck, 1.9, 0.5, 0.06, chassis, 0, 1.7, 3.55);
  addBox(truck, 2.95, 0.26, 0.32, solid(0x565d61), 0, 1.15, 3.55);
  for (const side of [-1, 1]) {
    addBox(truck, 0.14, 0.5, 0.3, chassis, side * 1.65, 2.9, 3.1);
    for (const z of [-2.65, -1.1, 2.25]) {
      const wheel = cylinder(0.68, 0.68, 0.4, solid(0x24282d), 10);
      wheel.rotation.z = Math.PI / 2;
      const axle = new THREE.Group();
      axle.position.set(side * 1.4, 0.7, z);
      axle.add(wheel);
      truck.add(axle);
      truck.userData.wheels.push(axle);
    }
    addBox(truck, 0.4, 0.25, 0.07, new THREE.MeshBasicMaterial({ color: 0xff6039 }), side * 1.05, 1.55, -3.5);
    addBox(truck, 0.5, 0.3, 0.07, new THREE.MeshBasicMaterial({ color: 0xffd8a0 }), side * 1.05, 1.7, 3.6);
  }
  addBox(truck, 2.8, 0.045, 2.2, cab, 0, 3.82, 2.4);
  truck.traverse(object => {
    if (object.isMesh && !object.material.transparent) object.castShadow = object.receiveShadow = true;
  });
  return truck;
}
