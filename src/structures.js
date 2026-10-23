import * as THREE from "three";
import {
  addBox,
  addCylinder,
  box,
  brickMaterial,
  buildAntenna,
  lampMaterial,
  buildBench,
  buildCrate,
  buildFlagPole,
  buildGasCylinder,
  buildHoop,
  buildIceBox,
  buildSatelliteDish,
  buildTrashCan,
  contactShadow,
  corrugatedMaterial,
  courtMaterial,
  cylinder,
  muralMaterial,
  plasterMaterial,
  posterMaterial,
  signMaterial,
  solid,
  woodMaterial,
  windowMaterial,
  shopWindowMaterial,
} from "./parts.js";

function addWindow(parent, w, h, x, y, z, rotY = 0, variant = 0) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), windowMaterial(variant));
  group.add(pane);
  addBox(group, w + 0.12, 0.09, 0.15, solid(0xc8c0ac), 0, -h / 2 - 0.03, 0.04);
  addBox(group, w + 0.08, 0.06, 0.08, solid(0x8a8070), 0, h / 2 + 0.02, 0.02);
  parent.add(group);
  return group;
}

function addSignPlane(parent, text, options, w, h, x, y, z, rotY = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), signMaterial(text, options));
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotY;
  parent.add(mesh);
  return mesh;
}

function buildingShadow(w, d) {
  const shadow = contactShadow(w, d, 0.5);
  shadow.position.y = 0.05;
  return shadow;
}

export function buildApartment(options = {}) {
  const {
    width = 22,
    depth = 11,
    floors = 5,
    bodyColor = "#c9bfa4",
    bandColor = 0x8b9aa0,
    number = "12",
    glazed = false,
  } = options;
  const group = new THREE.Group();
  const floorH = 2.8;
  const height = floors * floorH;
  const front = depth / 2;
  const wall = plasterMaterial(bodyColor);
  const band = solid(bandColor);
  const dark = solid(0x565550);
  const concrete = solid(0xb0a894);
  const metal = solid(0x5a5a54);

  addBox(group, width + 0.25, 0.6, depth + 0.25, solid(0x8a8474), 0, 0.3, 0);
  addBox(group, width, height, depth, wall, 0, height / 2, 0);

  for (let f = 1; f < floors; f++) {
    addBox(group, width + 0.14, 0.1, depth + 0.14, concrete, 0, f * floorH, 0);
  }
  addBox(group, width + 0.16, 0.32, depth + 0.16, band, 0, height - 0.2, 0);
  addBox(group, width + 0.1, 0.2, depth + 0.1, band, 0, 0.68, 0);

  const bays = 5;
  const left = -(width / 2 - 2.2);
  const right = width / 2 - 2.2;
  const bayX = [];
  for (let i = 0; i < bays; i++) {
    bayX.push(left + ((right - left) / (bays - 1)) * i);
  }

  for (let b = 0; b < bays; b++) {
    const x = bayX[b];
    if (b > 0 && b < bays - 1) {
      addBox(group, 0.05, height - 0.4, depth + 0.06, solid(0x9a9282), x + 1.9, height / 2, 0);
    }
    for (let f = 0; f < floors; f++) {
      const y = f * floorH + 1.55;
      if (f === 0 && b === 2) continue;
      addWindow(group, 1.34, 1.55, x, y, front + 0.03, 0, b + f);
    }
  }

  for (let f = 1; f < floors; f++) {
    for (const b of [0, bays - 1]) {
      const x = bayX[b];
      const y = f * floorH;
      addBox(group, 2.4, 0.14, 1.25, concrete, x, y + 0.08, front + 0.62);
      const railY = y + 0.55;
      if (glazed) {
        const glass = solid(0x7a8a8a, { transparent: true, opacity: 0.55, side: THREE.DoubleSide });
        addBox(group, 2.25, 1.15, 0.04, glass, x, railY + 0.18, front + 1.22);
        addBox(group, 0.05, 1.2, 0.05, metal, x - 1.1, railY + 0.18, front + 1.24);
        addBox(group, 0.05, 1.2, 0.05, metal, x + 1.1, railY + 0.18, front + 1.24);
        addBox(group, 2.3, 0.06, 0.06, metal, x, y + 1.78, front + 1.24);
      } else {
        addBox(group, 2.4, 0.06, 0.06, metal, x, y + 1.62, front + 1.22);
        addBox(group, 2.4, 0.05, 0.05, metal, x, y + 1.05, front + 1.22);
        addBox(group, 2.4, 0.08, 0.4, concrete, x, y + 1.64, front + 0.55);
        for (let p = 0; p < 5; p++) {
          const px = x - 1.05 + p * 0.525;
          addBox(group, 0.05, 1.55, 0.05, metal, px, y + 0.86, front + 1.22);
        }
        if ((f + b) % 2 === 0) {
          const cloth = new THREE.Mesh(
            new THREE.PlaneGeometry(0.55, 0.7),
            solid(f % 2 ? 0xc8a0a0 : 0xa8c0c8, { side: THREE.DoubleSide })
          );
          cloth.position.set(x + 0.5, y + 1.15, front + 1.27);
          group.add(cloth);
        }
      }
      addBox(group, 0.06, 1.7, 0.06, metal, x - 1.12, railY + 0.5, front + 0.7);
      addBox(group, 0.06, 1.7, 0.06, metal, x - 1.12, railY + 0.5, front + 1.2);
    }
  }

  for (let f = 0; f < floors; f++) {
    for (const x of [-width / 2 - 0.03, width / 2 + 0.03]) {
      addWindow(group, 1.0, 1.3, x, f * floorH + 1.6, 0, x < 0 ? -Math.PI / 2 : Math.PI / 2, f + 2);
    }
    for (let i = 0; i < 3; i++) {
      addWindow(group, 1.0, 1.3, -width / 2 + 4 + i * (width - 8) / 2, f * floorH + 1.6, -front - 0.03, Math.PI, f + i);
    }
  }

  addBox(group, 1.5, 2.25, 0.15, solid(0x4a4038), 0, 1.12, front + 0.05);
  addBox(group, 2.0, 0.07, 0.06, solid(0xd8d0b8), 0.7, 1.35, front + 0.14);
  addBox(group, 3.8, 0.18, 1.8, concrete, 0, 3.1, front + 0.9);
  addBox(group, 0.16, 2.95, 0.16, concrete, -1.55, 1.5, front + 1.6);
  addBox(group, 0.16, 2.95, 0.16, concrete, 1.55, 1.5, front + 1.6);
  addBox(group, 3.4, 0.24, 0.9, solid(0x9a9484), 0, 0.12, front + 0.45);
  addBox(group, 3.2, 0.18, 0.7, solid(0xa8a292), 0, 0.34, front + 0.35);
  addBox(group, 3.2, 0.16, 1.1, concrete, 0, 0.3, front + 2.0);

  addSignPlane(group, number, {
    width: 64, height: 64, bg: "#2b4a7a", fg: "#e8dcc0", accent: "#e8dcc0", border: false,
  }, 0.72, 0.72, 1.05, 2.4, front + 0.07);

  addBox(group, 0.1, height - 0.5, 0.1, solid(0x7a7466), width / 2 - 0.22, height / 2, front + 0.09);
  addBox(group, 0.1, height - 0.5, 0.1, solid(0x7a7466), -width / 2 + 0.22, height / 2, front + 0.09);

  const parapet = solid(bandColor);
  addBox(group, width + 0.1, 0.55, 0.22, parapet, 0, height + 0.28, front - 0.02);
  addBox(group, width + 0.1, 0.55, 0.22, parapet, 0, height + 0.28, -front + 0.02);
  addBox(group, 0.22, 0.55, depth + 0.1, parapet, -width / 2 + 0.02, height + 0.28, 0);
  addBox(group, 0.22, 0.55, depth + 0.1, parapet, width / 2 - 0.02, height + 0.28, 0);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.4, depth - 0.4), solid(0x6a6860));
  roof.rotation.x = -Math.PI / 2;
  roof.position.y = height + 0.02;
  group.add(roof);

  addBox(group, 2.8, 1.25, 2.0, solid(0xa8a08c), -3.5, height + 0.64, -1.5);
  addBox(group, 0.55, 0.8, 0.55, solid(0x8a8478), 2.5, height + 0.42, -1.0);
  addCylinder(group, 0.22, 0.22, 1.4, metal, 4.5, height + 0.72, -1.2, 6);
  addCylinder(group, 0.28, 0.28, 0.08, solid(0x4a4a44), 4.5, height + 1.44, -1.2, 6);
  const antenna = buildAntenna(2.6);
  antenna.position.set(6.5, height + 0.05, -1.5);
  group.add(antenna);
  const dish = buildSatelliteDish();
  dish.position.set(-7, height + 0.1, 1.2);
  dish.scale.setScalar(0.8);
  group.add(dish);
  const roofBench = buildClotheslineRoof();
  roofBench.position.set(4.5, height + 0.08, 2.0);
  group.add(roofBench);

  addBox(group, 0.65, 0.55, 0.32, solid(0xb8b0a0), 3.8, 5.2, front + 0.16);
  addBox(group, 0.65, 0.55, 0.32, solid(0xb8b0a0), -3.8, 7.9, front + 0.16);

  const bench = buildBench();
  bench.position.set(2.7, 0, front + 2.2);
  group.add(bench);
  const trash = buildTrashCan();
  trash.position.set(-2.9, 0, front + 2.1);
  group.add(trash);

  group.add(buildingShadow(width + 3, depth + 3));
  return group;
}

function buildClotheslineRoof() {
  const group = new THREE.Group();
  const metal = solid(0x6a6a62);
  addCylinder(group, 0.04, 0.05, 2.0, metal, -3, 1.0, 0, 4);
  addCylinder(group, 0.04, 0.05, 2.0, metal, 3, 1.0, 0, 4);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 1.4, 0),
      new THREE.Vector3(0, 1.28, 0),
      new THREE.Vector3(3, 1.4, 0),
    ]),
    new THREE.LineBasicMaterial({ color: 0x4a4a44 })
  );
  group.add(line);
  const colors = [0xd8d0b8, 0x8aa0b0, 0xc8a0a0, 0xc8c070];
  for (let i = 0; i < 4; i++) {
    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.9),
      solid(colors[i], { side: THREE.DoubleSide })
    );
    cloth.position.set(-2 + i * 1.2, 0.85, 0);
    group.add(cloth);
  }
  return group;
}

export function buildSchool() {
  const group = new THREE.Group();
  const width = 30;
  const depth = 13;
  const floors = 3;
  const floorH = 3.4;
  const height = floors * floorH;
  const front = depth / 2;
  const wall = plasterMaterial("#c6b48c");
  const trim = solid(0x7c8a92);
  const concrete = solid(0xb4ac98);
  const dark = solid(0x4a4640);

  addBox(group, width + 0.3, 0.65, depth + 0.3, solid(0x8a8070), 0, 0.32, 0);
  addBox(group, width, height, depth, wall, 0, height / 2, 0);
  addBox(group, width + 0.16, 0.4, depth + 0.16, trim, 0, height - 0.25, 0);
  addBox(group, width + 0.12, 0.24, depth + 0.12, trim, 0, 0.72, 0);
  addBox(group, width + 0.04, 0.12, depth + 0.04, concrete, 0, floors * floorH - 1.7, 0);

  const bayX = [-11.4, -6.8, -2.3, 2.3, 6.8, 11.4];
  for (let b = 0; b < bayX.length; b++) {
    for (let f = 0; f < floors; f++) {
      const y = f * floorH + 1.9;
      if (f === 0 && (b === 2 || b === 3)) continue;
      for (const dx of [-0.72, 0.72]) {
        addWindow(group, 1.2, 2.0, bayX[b] + dx, y, front + 0.03, 0, b + f + 1);
      }
    }
  }

  for (let f = 0; f < floors; f++) {
    for (const x of [-width / 2 - 0.03, width / 2 + 0.03]) {
      for (const dz of [-3.5, 3.5]) {
        addWindow(group, 1.15, 1.8, x, f * floorH + 1.9, dz, x < 0 ? -Math.PI / 2 : Math.PI / 2, f + 2);
      }
    }
  }

  addBox(group, 6.4, 4.9, 1.7, wall, 0, 2.45, front + 0.85);
  addBox(group, 6.8, 0.26, 2.5, concrete, 0, 4.6, front + 1.3);
  for (const x of [-2.4, 2.4]) {
    addCylinder(group, 0.22, 0.26, 4.4, concrete, x, 2.2, front + 1.9, 8);
  }
  addBox(group, 2.6, 2.35, 0.12, dark, 0, 1.18, front + 1.73);
  addBox(group, 2.7, 0.08, 0.06, solid(0xd8d0b8), 0, 1.4, front + 1.8);
  addBox(group, 1.2, 0.06, 0.06, solid(0xd8d0b8), 0, 1.84, front + 1.8);
  for (let i = 0; i < 3; i++) {
    addBox(group, 5.6 - i * 0.4, 0.18, 0.7 + i * 0.35, solid(0xa8a08c), 0, 0.18 + i * 0.18, front + 2.0 + i * 0.3);
  }
  addSignPlane(group, "4-Р СУРГУУЛЬ", {
    width: 512, height: 96, bg: "#d8cdb0", fg: "#2b4a7a", accent: "#8c2f24", sub: "БҮРЭН ДУНД СУРГУУЛЬ",
  }, 8.6, 1.5, 0, 6.1, front + 0.05);

  const mural = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 4.0), muralMaterial());
  mural.position.set(-width / 2 - 0.04, 4.3, 0.6);
  mural.rotation.y = -Math.PI / 2;
  group.add(mural);

  addBox(group, width + 0.12, 0.6, 0.24, trim, 0, height + 0.3, front - 0.02);
  addBox(group, width + 0.12, 0.6, 0.24, trim, 0, height + 0.3, -front + 0.02);
  addBox(group, 0.24, 0.6, depth + 0.12, trim, -width / 2 + 0.02, height + 0.3, 0);
  addBox(group, 0.24, 0.6, depth + 0.12, trim, width / 2 - 0.02, height + 0.3, 0);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.4, depth - 0.4), solid(0x6a6860));
  roof.rotation.x = -Math.PI / 2;
  roof.position.y = height + 0.04;
  group.add(roof);
  addBox(group, 3.2, 1.4, 2.2, solid(0xa8a08c), -6, height + 0.72, -1.6);
  addBox(group, 0.6, 0.9, 0.6, solid(0x8a8478), 7, height + 0.46, -0.6);
  const antenna = buildAntenna(3);
  antenna.position.set(9, height + 0.05, -2);
  group.add(antenna);

  group.add(buildingShadow(width + 4, depth + 4));

  const yard = new THREE.Group();
  group.add(yard);

  const pathMat = plasterMaterial("#b8b0a0");
  const path = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 11), pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.03, front + 7.8);
  yard.add(path);

  const flag = buildFlagPole();
  flag.group.position.set(-5.5, 0, front + 6.8);
  flag.group.scale.setScalar(0.85);
  yard.add(flag.group);

  const benchA = buildBench();
  benchA.position.set(6.5, 0, front + 5.4);
  benchA.rotation.y = Math.PI;
  yard.add(benchA);
  const benchB = buildBench();
  benchB.position.set(-6.5, 0, front + 5.4);
  yard.add(benchB);
  const bin = buildTrashCan();
  bin.position.set(-8.3, 0, front + 5.6);
  yard.add(bin);

  const court = new THREE.Mesh(new THREE.PlaneGeometry(17, 19), courtMaterial());
  court.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  court.position.set(23.5, 0.04, 0);
  yard.add(court);
  const hoopA = buildHoop();
  hoopA.position.set(15.3, 0, 0);
  yard.add(hoopA);
  const hoopB = buildHoop();
  hoopB.position.set(31.7, 0, 0);
  hoopB.rotation.y = Math.PI;
  yard.add(hoopB);

  const gate = new THREE.Group();
  const metal = solid(0x556052);
  for (const x of [-2.6, 2.6]) {
    addBox(gate, 0.22, 1.5, 0.22, solid(0x8a8474), x, 0.75, 0);
  }
  for (let i = 0; i < 12; i++) {
    addBox(gate, 0.05, 1.2, 0.05, metal, -2.3 + i * 0.42, 0.7, 0);
  }
  addBox(gate, 5.1, 0.06, 0.06, metal, 0, 1.28, 0);
  addBox(gate, 5.1, 0.06, 0.06, metal, 0, 0.18, 0);
  gate.position.set(0, 0, front + 12.4);
  yard.add(gate);

  function railFence(length) {
    const fence = new THREE.Group();
    const posts = Math.max(2, Math.round(length / 1.2) + 1);
    for (let i = 0; i < posts; i++) {
      addBox(fence, 0.14, 1.3, 0.14, solid(0x8a8474), -length / 2 + (length / (posts - 1)) * i, 0.65, 0);
    }
    addBox(fence, length, 0.06, 0.06, metal, 0, 1.25, 0);
    addBox(fence, length, 0.05, 0.05, metal, 0, 0.55, 0);
    return fence;
  }

  const frontLeft = railFence(15.0);
  frontLeft.position.set(-10.1, 0, front + 12.4);
  yard.add(frontLeft);
  const frontRight = railFence(31.4);
  frontRight.position.set(18.3, 0, front + 12.4);
  yard.add(frontRight);
  const westFence = railFence(12.4);
  westFence.rotation.y = Math.PI / 2;
  westFence.position.set(-width / 2 - 2.6, 0, front + 6.2);
  yard.add(westFence);
  const eastFence = railFence(28.4);
  eastFence.rotation.y = Math.PI / 2;
  eastFence.position.set(width / 2 + 19, 0, front - 1.8);
  yard.add(eastFence);
  const backWall = railFence(18.7);
  backWall.position.set(width / 2 + 9, 0, -9.5);
  yard.add(backWall);

  addSignPlane(group, "СУРГУУЛИЙН ХАШАА", {
    width: 256, height: 64, bg: "#d8cdb0", fg: "#8c2f24", accent: "#2b4a7a",
  }, 3.2, 0.8, 6.5, 1.65, front + 12.34);

  return group;
}

export function buildStore() {
  const group = new THREE.Group();
  const width = 11;
  const depth = 7;
  const height = 4.7;
  const front = depth / 2;
  const wall = plasterMaterial("#cfc4a8");
  const trim = solid(0x8c2f24);
  const metal = solid(0x5a5a54);

  addBox(group, width + 0.2, 0.35, depth + 0.2, solid(0x8a8474), 0, 0.18, 0);
  addBox(group, width, height, depth, wall, 0, height / 2, 0);
  addBox(group, width + 0.16, 0.35, depth + 0.16, solid(0xb8ae98), 0, height - 0.2, 0);
  addBox(group, width + 0.12, 0.6, 0.2, trim, 0, height + 0.3, front - 0.03);
  addBox(group, width + 0.12, 0.6, 0.2, trim, 0, height + 0.3, -front + 0.03);
  addBox(group, 0.2, 0.6, depth + 0.12, trim, -width / 2 + 0.03, height + 0.3, 0);
  addBox(group, 0.2, 0.6, depth + 0.12, trim, width / 2 - 0.03, height + 0.3, 0);

  const windowXs = [-3.5, -0.7, 2.1];
  for (const x of windowXs) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.0), shopWindowMaterial());
    pane.position.set(x, 1.75, front + 0.04);
    group.add(pane);
    addBox(group, 2.62, 0.12, 0.16, solid(0x6a5a44), x, 2.8, front + 0.06);
    addBox(group, 2.62, 0.16, 0.18, solid(0x8a8474), x, 0.72, front + 0.06);
    addBox(group, 0.12, 2.1, 0.16, solid(0x6a5a44), x - 1.31, 1.75, front + 0.06);
    addBox(group, 0.12, 2.1, 0.16, solid(0x6a5a44), x + 1.31, 1.75, front + 0.06);
  }

  addBox(group, 1.35, 2.3, 0.14, solid(0x4a4038), 4.2, 1.15, front + 0.05);
  addBox(group, 1.1, 0.9, 0.05, solid(0x8aa0a8), 4.2, 1.45, front + 0.13);
  addBox(group, 0.1, 2.0, 0.08, solid(0xc8c0a8), 4.2, 1.0, front + 0.15);

  const awning = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const stripe = box(0.8, 0.06, 1.5, solid(i % 2 ? 0xd8cdb0 : 0x9a3a2c));
    stripe.position.set(-4.4 + i * 0.8, 0, -0.65);
    stripe.rotation.x = -0.32;
    awning.add(stripe);
  }
  awning.position.set(0.4, 2.95, front + 0.75);
  group.add(awning);
  addBox(group, 0.07, 1.1, 0.07, metal, -4.4, 3.35, front + 0.05);
  addBox(group, 0.07, 1.1, 0.07, metal, 4.4, 3.35, front + 0.05);

  addSignPlane(group, "ДЭЛГҮҮР", {
    width: 512, height: 96, bg: "#d8cdb0", fg: "#8c2f24", accent: "#2b4a7a", sub: "ХҮНС · УНДАА · БАРАА",
  }, 9.8, 1.55, 0, 3.85, front + 0.07);

  addSignPlane(group, "ЗАР", {
    width: 96, height: 128, bg: "#e0d8c0", fg: "#2b4a7a", accent: "#8c2f24", border: true,
  }, 1.3, 1.7, -width / 2 - 0.05, 2.1, 1.2, -Math.PI / 2);
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.3), posterMaterial(1));
  poster.position.set(width / 2 + 0.05, 2.0, 0.7);
  poster.rotation.y = Math.PI / 2;
  group.add(poster);

  for (let i = 0; i < 3; i++) {
    const crate = buildCrate();
    crate.position.set(4.7, 0, front + 1.2 + (i % 2) * 0.5);
    crate.rotation.y = i * 0.5;
    group.add(crate);
  }
  const ice = buildIceBox();
  ice.position.set(-4.3, 0, front + 1.2);
  group.add(ice);
  const gas = buildGasCylinder();
  gas.position.set(3.4, 0, front + 0.9);
  group.add(gas);
  const bench = buildBench();
  bench.position.set(-1.4, 0, front + 2.3);
  group.add(bench);
  const bin = buildTrashCan();
  bin.position.set(5.7, 0, front + 0.8);
  group.add(bin);

  addBox(group, 0.9, 0.8, 0.6, solid(0x9a9488), 2.5, height + 0.4, -1.6);
  addCylinder(group, 0.18, 0.18, 1.1, metal, -3.5, height + 0.55, -1.4, 6);
  addCylinder(group, 0.22, 0.22, 0.08, solid(0x4a4a44), -3.5, height + 1.1, -1.4, 6);

  const lamp = box(0.6, 0.16, 0.26, lampMaterial());
  lamp.position.set(4.05, 3.05, front + 1.1);
  group.add(lamp);

  group.add(buildingShadow(width + 4, depth + 4));
  return group;
}

export function buildKiosk() {
  const group = new THREE.Group();
  const width = 4.4;
  const depth = 3.2;
  const height = 3.0;
  const front = depth / 2;
  addBox(group, width, height, depth, corrugatedMaterial("#9a9a90"), 0, height / 2, 0);
  addBox(group, width + 0.4, 0.16, depth + 0.4, solid(0x6a6a64), 0, height + 0.05, 0);
  addBox(group, width + 0.3, 0.3, depth + 0.3, solid(0x7a7468), 0, height + 0.22, 0);
  addBox(group, width - 0.5, 1.9, 0.1, metalShutter(), 0, 1.05, front + 0.04);
  addBox(group, width - 0.3, 0.2, 0.16, solid(0x6a5a44), 0, 2.1, front + 0.06);
  addSignPlane(group, "БАР", {
    width: 256, height: 96, bg: "#2b4a7a", fg: "#e8dcc0", accent: "#d8a44a", border: true,
  }, 3.6, 1.2, 0, 2.5, front + 0.12);
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.3), posterMaterial(1));
  poster.position.set(width / 2 + 0.04, 1.4, 0);
  poster.rotation.y = Math.PI / 2;
  group.add(poster);
  addBox(group, 1.6, 0.18, 0.7, solid(0x8a8474), 0, 0.09, front + 0.4);
  const crate = buildCrate();
  crate.position.set(-1.5, 0, front + 0.6);
  group.add(crate);
  const bin = buildTrashCan();
  bin.position.set(1.6, 0, front + 0.6);
  group.add(bin);
  group.add(buildingShadow(width + 2, depth + 2));
  return group;
}

function metalShutter() {
  return solid(0x8a8a82);
}

export function buildBoilerHouse() {
  const group = new THREE.Group();
  const width = 10;
  const depth = 8;
  const height = 5;
  const front = depth / 2;
  const brick = brickMaterial();
  const metal = solid(0x6a6a62);
  addBox(group, width, height, depth, brick, 0, height / 2, 0);
  addBox(group, width + 0.3, 0.5, depth + 0.3, solid(0x7a7468), 0, 0.25, 0);
  const angle = 0.48;
  for (const side of [-1, 1]) {
    const slope = box(width + 0.8, 0.16, 4.8, corrugatedMaterial("#7c7468"));
    slope.position.set(0, height + 0.95, side * 1.9);
    slope.rotation.x = side * angle;
    group.add(slope);
  }
  addBox(group, width + 0.9, 0.2, 0.2, solid(0x5a5a54), 0, height + 1.95, 0);
  addBox(group, 2.2, 2.6, 0.14, solid(0x4a4038), -2.5, 1.35, front + 0.05);
  addBox(group, 2.2, 2.6, 0.14, solid(0x4a4038), 2.5, 1.35, front + 0.05);
  addWindow(group, 1.3, 1.2, 0, 3.4, front + 0.04, 0, 3);
  addWindow(group, 1.1, 1.0, -width / 2 - 0.03, 2.0, 0, -Math.PI / 2, 4);
  addWindow(group, 1.1, 1.0, width / 2 + 0.03, 2.0, 0, Math.PI / 2, 5);

  const chimneyMat = solid(0x8c6a54);
  const chimney = cylinder(1.5, 1.2, 18, chimneyMat, 8);
  chimney.position.set(2.8, 9.2, -2.2);
  group.add(chimney);
  for (const y of [4, 8, 12, 16]) {
    addCylinder(group, 1.52, 1.52, 0.2, solid(0x7a5a48), 2.8, y, -2.2, 8);
  }
  addCylinder(group, 1.68, 1.68, 0.42, solid(0x5a4a40), 2.8, 18.2, -2.2, 8);
  addBox(group, 0.5, 0.5, 0.5, solid(0x8a8474), 2.8, 18.55, -2.2);

  const coal = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const pile = new THREE.Mesh(
      new THREE.ConeGeometry(1.4 - i * 0.25, 0.7 + i * 0.2, 7),
      solid(0x36322e)
    );
    pile.position.set(-6.5 - i * 0.5, 0.35, 2.0 + (i % 2) * 0.7);
    coal.add(pile);
  }
  group.add(coal);
  const crate = buildCrate();
  crate.position.set(5.6, 0, front + 1.2);
  group.add(crate);

  group.add(buildingShadow(width + 5, depth + 5));
  return group;
}

export function buildWaterTower() {
  const group = new THREE.Group();
  const metal = solid(0x7a6a58);
  const rust = solid(0x8c5a3c);
  const baseY = 0;
  const legBottom = 3.0;
  const legTop = 1.3;
  const legHeight = 10.5;
  const cornersBottom = [
    new THREE.Vector3(-2.1, baseY, -2.1),
    new THREE.Vector3(2.1, baseY, -2.1),
    new THREE.Vector3(-2.1, baseY, 2.1),
    new THREE.Vector3(2.1, baseY, 2.1),
  ];
  const cornersTop = [
    new THREE.Vector3(-1.35, legHeight, -1.35),
    new THREE.Vector3(1.35, legHeight, -1.35),
    new THREE.Vector3(-1.35, legHeight, 1.35),
    new THREE.Vector3(1.35, legHeight, 1.35),
  ];
  for (let i = 0; i < 4; i++) {
    strut(group, cornersBottom[i], cornersTop[i], 0.14, metal);
  }
  for (let level = 0; level < 3; level++) {
    const t = 0.25 + level * 0.28;
    const y = legHeight * t;
    const w = 2.1 - (2.1 - 1.35) * t;
    addBox(group, w * 2, 0.09, 0.09, metal, 0, y, -w);
    addBox(group, w * 2, 0.09, 0.09, metal, 0, y, w);
    addBox(group, 0.09, 0.09, w * 2, metal, -w, y, 0);
    addBox(group, 0.09, 0.09, w * 2, metal, w, y, 0);
    if (level < 2) {
      strut(group, new THREE.Vector3(-w, y, -w), new THREE.Vector3(w, y + 2.6, -w), 0.05, metal);
      strut(group, new THREE.Vector3(w, y, w), new THREE.Vector3(-w, y + 2.6, w), 0.05, metal);
    }
  }
  addCylinder(group, 2.15, 2.15, 3.3, rust, 0, 10.6 + 1.65, 0, 12);
  for (const y of [10.8, 12.2, 13.8]) {
    addCylinder(group, 2.2, 2.2, 0.12, solid(0x6a5a48), 0, y, 0, 12);
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.35, 1.3, 12), solid(0x6a625a));
  roof.position.y = 14.55;
  group.add(roof);
  addCylinder(group, 0.22, 0.22, 1.2, solid(0x5a5a52), 0, 15.4, 0, 6);
  const ladder = new THREE.Group();
  addBox(ladder, 0.06, 10.4, 0.06, metal, -2.2, 5.2, 0);
  addBox(ladder, 0.06, 10.4, 0.06, metal, -1.75, 5.2, 0);
  for (let i = 0; i < 16; i++) {
    addBox(ladder, 0.5, 0.05, 0.05, metal, -1.98, 0.5 + i * 0.64, 0);
  }
  group.add(ladder);
  addCylinder(group, 0.12, 0.12, 9.5, solid(0x6a6258), 1.8, 5.0, 1.8, 5);
  group.add(buildingShadow(7, 7));
  return group;
}

function strut(group, a, b, r, material) {
  const dir = b.clone().sub(a);
  const length = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 5), material);
  mesh.scale.y = length;
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  group.add(mesh);
}

export function buildPipeRun(length = 90, height = 1.9) {
  const group = new THREE.Group();
  const pipeMat = solid(0x8a8478);
  const rust = solid(0x8c5a3c);
  const supportMat = solid(0x9a9484);
  const count = Math.max(2, Math.round(length / 8) + 1);
  for (let i = 0; i < count; i++) {
    const x = -length / 2 + (length / (count - 1)) * i;
    addBox(group, 0.32, height, 0.32, supportMat, x, height / 2, 0);
    addBox(group, 1.4, 0.16, 0.34, supportMat, x, height, 0);
    if (i % 3 === 0) {
      addBox(group, 0.5, 0.06, 0.5, rust, x, 0.03, 0);
    }
  }
  for (const z of [-0.32, 0.32]) {
    const pipe = cylinder(0.19, 0.19, length, pipeMat, 8);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, height + 0.38, z);
    group.add(pipe);
    for (let i = 1; i < count; i += 3) {
      const x = -length / 2 + (length / (count - 1)) * i;
      const band = cylinder(0.22, 0.22, 0.18, rust, 8);
      band.rotation.z = Math.PI / 2;
      band.position.set(x, height + 0.38, z);
      group.add(band);
    }
  }
  addCylinder(group, 0.23, 0.23, 2.2, pipeMat, -length / 2 + 0.3, height - 0.7, 0.32, 8);
  addCylinder(group, 0.23, 0.23, 2.2, pipeMat, -length / 2 + 0.3, height - 0.7, -0.32, 8);
  return group;
}

export function buildArch() {
  const group = new THREE.Group();
  const postMat = brickMaterial();
  const width = 13;
  for (const x of [-width / 2, width / 2]) {
    addBox(group, 1.1, 7.4, 1.1, postMat, x, 3.7, 0);
    addBox(group, 1.5, 0.35, 1.5, solid(0x8a8474), x, 7.55, 0);
    addBox(group, 1.7, 0.4, 1.7, solid(0x7a7468), x, 0.2, 0);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.8, 4), solid(0x7a7468));
    cap.position.set(x, 8.1, 0);
    cap.rotation.y = Math.PI / 4;
    group.add(cap);
  }
  addBox(group, width + 1.6, 2.0, 0.35, solid(0x2b4a7a), 0, 6.3, 0);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(width + 1.2, 1.7), signMaterial("НАРАН ХОРООЛОЛ", {
    width: 512, height: 64, bg: "#2b4a7a", fg: "#e8dcc0", accent: "#d8a44a", border: false,
  }));
  sign.position.set(0, 6.3, 0.2);
  group.add(sign);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(width + 1.2, 1.7), signMaterial("12-Р БАГ", {
    width: 512, height: 64, bg: "#2b4a7a", fg: "#e8dcc0", accent: "#d8a44a", border: false,
  }));
  back.position.set(0, 6.3, -0.2);
  back.rotation.y = Math.PI;
  group.add(back);
  addBox(group, 0.1, 1.2, 0.1, solid(0x8a8474), 0, 7.7, 0);
  group.add(buildingShadow(width + 3, 3));
  return group;
}

export function buildBusStop() {
  const group = new THREE.Group();
  const metal = solid(0x5a625a);
  const wall = plasterMaterial("#b8b0a0");
  addBox(group, 5.2, 0.14, 2.2, solid(0x6a6a62), 0, 2.6, 0);
  addBox(group, 5.2, 2.4, 0.12, wall, 0, 1.2, -0.95);
  addBox(group, 2.4, 0.5, 0.12, solid(0x8aa0a8), 0, 1.75, -0.94);
  for (const x of [-2.45, 2.45]) {
    addBox(group, 0.12, 2.6, 1.7, metal, x, 1.3, -0.1);
    addBox(group, 0.05, 2.3, 0.05, metal, x, 1.15, 0.78);
  }
  const bench = buildBench();
  bench.position.set(-0.5, 0, -0.45);
  group.add(bench);
  const bin = buildTrashCan();
  bin.position.set(-2.0, 0, 0.4);
  group.add(bin);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.1), signMaterial("АВТОБУС", {
    width: 256, height: 128, bg: "#d8cdb0", fg: "#2b4a7a", accent: "#8c2f24", sub: "12 · 31 · 105",
  }));
  sign.position.set(2.45, 2.15, 0.83);
  group.add(sign);
  addBox(group, 0.4, 0.65, 1.1, solid(0x6a6a62), 2.45, 0.32, 0.85);
  group.add(buildingShadow(6.5, 3.2));
  return group;
}

export function buildDumpster() {
  const group = new THREE.Group();
  addBox(group, 1.9, 1.1, 1.2, solid(0x4a6a4a), 0, 0.75, 0);
  addBox(group, 1.95, 0.1, 1.25, solid(0x3a5a3a), 0, 1.32, 0);
  addBox(group, 0.14, 0.2, 1.2, solid(0x2a2a28), -0.75, 0.1, 0);
  addBox(group, 0.14, 0.2, 1.2, solid(0x2a2a28), 0.75, 0.1, 0);
  return group;
}

export function buildStandpipe() {
  const group = new THREE.Group();
  addBox(group, 2.4, 0.18, 1.6, solid(0x9a9484), 0, 0.09, 0);
  addCylinder(group, 0.11, 0.13, 1.3, solid(0x6a6a62), 0, 0.83, 0, 6);
  addCylinder(group, 0.05, 0.05, 0.5, solid(0x9a9a92), 0.3, 1.05, 0, 4).rotation.z = Math.PI / 2;
  addBox(group, 0.18, 0.18, 0.18, solid(0x5a5a54), 0.55, 1.0, 0);
  const puddle = new THREE.Mesh(
    new THREE.CircleGeometry(0.65, 8),
    solid(0x5a6a6a, { transparent: true, opacity: 0.5 })
  );
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.y = 0.19;
  puddle.scale.set(1.4, 0.8, 1);
  group.add(puddle);
  return group;
}

export function buildUtilityBox() {
  const group = new THREE.Group();
  addBox(group, 1.2, 1.4, 0.7, solid(0x6a7a64), 0, 0.7, 0);
  addBox(group, 1.25, 0.1, 0.75, solid(0x5a6a54), 0, 1.42, 0);
  addBox(group, 0.06, 0.5, 0.02, solid(0x3a3a38), 0.2, 0.8, 0.36);
  addSignPlane(group, "ОЛОН НИЙТИЙН", {
    width: 128, height: 32, bg: "#d8cdb0", fg: "#8c2f24", accent: "#8c2f24", border: false,
  }, 0.9, 0.22, 0, 1.2, 0.36);
  return group;
}

export function buildSelfBuiltHouse() {
  const group = new THREE.Group();
  const width = 8;
  const depth = 6.5;
  const height = 3.2;
  const front = depth / 2;
  const brick = brickMaterial();
  const trim = solid(0x8a7a60);

  addBox(group, width + 0.2, 0.35, depth + 0.2, solid(0x8a8474), 0, 0.18, 0);
  addBox(group, width, height, depth, brick, 0, height / 2, 0);
  addBox(group, width + 0.1, 0.25, depth + 0.1, trim, 0, height - 0.12, 0);

  const rise = 1.65;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, rise);
  shape.lineTo(-width / 2, 0);
  const gableGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: false });
  for (const z of [-front - 0.07, front - 0.07]) {
    const gable = new THREE.Mesh(gableGeo, solid(0x9a6a50));
    gable.position.set(0, height, z);
    group.add(gable);
  }
  for (const side of [-1, 1]) {
    const slope = box(width + 1.0, 0.14, 3.9, corrugatedMaterial("#8c4a34"));
    slope.position.set(0, height + 0.86, side * 1.45);
    slope.rotation.x = side * 0.42;
    group.add(slope);
  }
  addBox(group, width + 1.1, 0.18, 0.2, solid(0x5a4a40), 0, height + rise, 0);

  const door = box(1.1, 2.2, 0.1, woodMaterial());
  door.position.set(0.4, 1.1, front + 0.06);
  group.add(door);
  addBox(group, 1.4, 0.1, 0.16, trim, 0.4, 2.25, front + 0.08);
  addWindow(group, 1.15, 1.2, -2.4, 1.75, front + 0.04, 0, 1);
  addWindow(group, 1.15, 1.2, 2.8, 1.75, front + 0.04, 0, 3);
  addWindow(group, 1.0, 1.1, -width / 2 - 0.03, 1.8, 0, -Math.PI / 2, 2);
  addWindow(group, 1.0, 1.1, width / 2 + 0.03, 1.8, 0.8, Math.PI / 2, 4);

  addBox(group, 3.0, 0.14, 1.6, solid(0xb0a890), 0.4, 2.75, front + 0.8);
  addBox(group, 0.12, 2.55, 0.12, trim, -1.0, 1.3, front + 1.5);
  addBox(group, 0.12, 2.55, 0.12, trim, 1.8, 1.3, front + 1.5);
  addBox(group, 3.2, 0.18, 0.9, solid(0x9a9484), 0.4, 0.09, front + 0.4);

  addBox(group, 0.62, 2.8, 0.62, brick, 2.6, height + 1.4, -0.8);
  addBox(group, 0.78, 0.18, 0.78, solid(0x5a4a40), 2.6, height + 2.82, -0.8);
  const dish = buildSatelliteDish();
  dish.position.set(-3.1, height + 0.1, -0.4);
  dish.scale.setScalar(0.75);
  group.add(dish);

  group.add(buildingShadow(width + 3.5, depth + 3.5));
  return group;
}
