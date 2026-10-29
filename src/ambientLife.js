import * as THREE from "three";
import { mulberry, solid, cylinder, box, buildDog } from "./parts.js";

// Ambient life: deterministic, time-driven moving props for the town map and
// film sets — swinging signs, creaking gates, sagging wires, tumbleweeds,
// dust devils, avenue traffic, a stray dog. Every builder returns
// { object(s), update(t) }; scenes push the updates into their apply loops.

function marker(parent, name) {
  const anchor = new THREE.Group();
  anchor.name = name;
  parent.add(anchor);
  return anchor;
}

// A hanging sign or lantern that swings on its chain/wire.
export function buildSwingingSign({ width = 1.0, height = 0.5, x = 0, y = 3, z = 0, seed = 0, color = 0x8c2f24 } = {}) {
  const rand = mulberry(seed * 71 + 3);
  const group = new THREE.Group();
  group.position.set(x, y, z);
  const pivot = new THREE.Group();
  group.add(pivot);
  for (const dx of [-width / 2 + 0.08, width / 2 - 0.08]) {
    const link = cylinder(0.012, 0.012, 0.34, solid(0x3a3a36), 4);
    link.position.set(dx, -0.17, 0);
    pivot.add(link);
  }
  const board = box(width, height, 0.05, solid(color));
  board.position.y = -0.34 - height / 2;
  pivot.add(board);
  const phase = rand() * 6.28;
  const amp = 0.06 + rand() * 0.05;
  return {
    object: group,
    update(t) {
      pivot.rotation.z = Math.sin(t * 1.1 + phase) * amp + Math.sin(t * 0.37 + phase) * amp * 0.5;
      pivot.rotation.x = Math.cos(t * 0.83 + phase * 1.3) * amp * 0.6;
    },
  };
}

// A gate left off the latch, creaking slowly on its hinge.
export function buildCreakingGate({ width = 1.4, x = 0, z = 0, seed = 0 } = {}) {
  const rand = mulberry(seed * 53 + 11);
  const pivot = new THREE.Group();
  pivot.position.set(x, 0, z);
  const post = box(0.12, 1.7, 0.12, solid(0x6a4c30));
  post.position.set(-width / 2, 0.85, 0);
  pivot.add(post);
  const leaf = new THREE.Group();
  leaf.position.set(-width / 2 + 0.06, 0, 0);
  const panel = box(width - 0.12, 1.3, 0.06, solid(0x7a5a3c));
  panel.position.set(width / 2, 0.82, 0);
  leaf.add(panel);
  pivot.add(leaf);
  const phase = rand() * 6.28;
  return {
    object: pivot,
    update(t) {
      leaf.rotation.y = 0.5 + Math.sin(t * 0.5 + phase) * 0.12 + Math.sin(t * 0.13 + phase) * 0.08;
    },
  };
}

// Sagging overhead wire between two points, swaying in the wind.
export function buildSaggingWire({ from = [0, 4, 0], to = [6, 4, 0], sag = 0.4, seed = 0 } = {}) {
  const rand = mulberry(seed * 29 + 7);
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const points = [];
  const segments = 10;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const p = a.clone().lerp(b, u);
    p.y -= Math.sin(u * Math.PI) * sag;
    points.push(p);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x2c2a26 }));
  const phase = rand() * 6.28;
  const base = points.map(p => p.clone());
  return {
    object: line,
    update(t) {
      const sway = Math.sin(t * 1.4 + phase) * 0.05;
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const u = i / segments;
        position.setXYZ(i,
          base[i].x + Math.sin(u * Math.PI) * sway,
          base[i].y + Math.sin(u * Math.PI) * Math.sin(t * 2.1 + phase) * 0.02,
          base[i].z);
      }
      position.needsUpdate = true;
      geometry.computeBoundingSphere();
    },
  };
}

// A tumbleweed: spiky ball that bounces along a fixed lane forever.
export function buildTumbleweed({ laneZ = 0, from = -80, to = 80, y = 0, speed = 3.4, seed = 0, scale = 1 } = {}) {
  const rand = mulberry(seed * 97 + 13);
  const group = new THREE.Group();
  const twigMat = solid(0x8a7448);
  for (let i = 0; i < 7; i++) {
    const twig = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32 + rand() * 0.2, 0), twigMat);
    twig.scale.set(1, 0.7 + rand() * 0.5, 1);
    twig.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    group.add(twig);
  }
  group.scale.setScalar(scale);
  const phase = rand();
  const wobble = 2 + rand() * 2;
  return {
    object: group,
    update(t) {
      const u = ((t * speed / (to - from)) + phase) % 1;
      const x = from + u * (to - from);
      group.position.set(x, y + Math.abs(Math.sin(t * wobble)) * 0.32, laneZ + Math.sin(t * 0.7 + phase * 9) * 1.6);
      group.rotation.z -= 0.09;
      group.rotation.x = Math.sin(t * 0.9 + phase * 5) * 0.4;
    },
  };
}

// A dust devil: spiral of sprite puffs that forms, drifts and dies on a loop.
export function buildDustDevil({ from = [-30, 20], to = [30, 34], y = 0, seed = 0 } = {}) {
  const rand = mulberry(seed * 43 + 5);
  const column = [];
  for (let i = 0; i < 9; i++) {
    const puff = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.4 + i * 0.09, 0),
      new THREE.MeshBasicMaterial({ color: 0xb0a488, transparent: true, opacity: 0.3, depthWrite: false })
    );
    column.push(puff);
  }
  const group = new THREE.Group();
  column.forEach(p => group.add(p));
  const phase = rand();
  return {
    object: group,
    update(t) {
      const cycle = 22;
      const u = (t / cycle + phase) % 1;
      const life = Math.sin(u * Math.PI); // form, live, die
      group.visible = life > 0.06;
      if (!group.visible) return;
      const x = from[0] + (to[0] - from[0]) * u + Math.sin(u * 24) * 2;
      const z = from[1] + (to[1] - from[1]) * u;
      group.position.set(x, y, z);
      column.forEach((puff, i) => {
        const a = t * (2.4 - i * 0.12) + i * 0.8;
        const r = 0.3 + i * 0.12;
        puff.position.set(Math.cos(a) * r, y + i * 0.52 + Math.sin(t * 3 + i) * 0.1, Math.sin(a) * r);
        puff.material.opacity = 0.34 * life * (1 - i / 12);
        puff.scale.setScalar(0.7 + life * 0.5);
      });
    },
  };
}

// A vehicle looping along a straight lane (the avenue). Snaps to ground height.
export function buildTrafficLoop({ model, from = [-160, 3.2], to = [160, 3.2], speed = 9, seed = 0, ground } = {}) {
  const rand = mulberry(seed * 37 + 1);
  const phase = rand();
  const westbound = seed % 2 === 1;
  return {
    object: model,
    update(t) {
      const cycle = 210;
      const u = ((t * speed / cycle) + phase) % 1;
      const k = westbound ? 1 - u : u;
      const x = from[0] + (to[0] - from[0]) * k;
      model.position.set(x, ground ? ground(x, from[1]) - 0.015 : 0, from[1]);
      model.rotation.y = westbound ? Math.PI : 0;
    },
  };
}

// A stray dog weaving between anchor points.
export function buildStrayDog({ anchors, ground, seed = 0 } = {}) {
  const rand = mulberry(seed * 61 + 9);
  const dog = buildDog();
  const phase = rand();
  const legs = dog.children.filter(child => Math.abs(child.position.y - 0.14) < 0.01);
  return {
    object: dog,
    update(t) {
      const u = (t * 0.021 + phase) % 1;
      const k = u * anchors.length * 2;
      const index = Math.min(anchors.length - 2, Math.floor(k / 2 % (anchors.length - 1)));
      const seg = (k / 2) % 1;
      const forward = Math.floor(k) % 2 === 0;
      const a = anchors[index];
      const b = anchors[index + 1];
      const [ax, az] = forward ? a : b;
      const [bx, bz] = forward ? b : a;
      const x = ax + (bx - ax) * (forward ? seg : 1 - seg);
      const z = az + (bz - az) * (forward ? seg : 1 - seg);
      dog.position.set(x, ground ? ground(x, z) : 0, z);
      dog.rotation.y = Math.atan2(bx - ax, bz - az) + (forward ? 0 : Math.PI);
      const step = Math.sin(t * 9);
      for (const leg of legs) leg.rotation.x = step * 0.4 * (legs.indexOf(leg) % 2 ? -1 : 1);
    },
  };
}

// Convenience: run a list of updates at time t.
export function makeAmbientRunner(list) {
  return function runAmbient(t) {
    for (const item of list) item.update(t);
  };
}

// Set dressing shortcut: several swinging props + wires in one call.
export function dressAmbient(scene, list, parent) {
  const root = parent ?? scene;
  for (const item of list) root.add(item.object);
  return makeAmbientRunner(list);
}

