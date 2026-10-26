import * as THREE from "three";
import { addBox, box, cylinder, mat, solid } from "./parts.js";

// Bayar's UAZ-469: boxy 4x4 with a canvas top, flat windshield, spare wheel.
// Front faces +x, matching buildCar.
export function buildUAZ(color = 0x4a5a38) {
  const group = new THREE.Group();
  const paint = solid(color);
  const canvasTop = mat({ map: null, color: 0x5a5348 });
  const trim = solid(0x2c2e2c);
  const chrome = solid(0x9a9a92);
  const light = solid(0xd8cc9a);

  addBox(group, 3.6, 0.22, 1.66, trim, 0, 0.34, 0);
  addBox(group, 3.7, 0.34, 1.7, paint, 0, 0.64, 0);
  addBox(group, 1.15, 0.16, 1.6, paint, 1.2, 0.89, 0);
  // Canvas top over the rear cabin
  addBox(group, 2.0, 0.75, 1.62, canvasTop, -0.85, 1.32, 0);
  addBox(group, 2.05, 0.08, 1.66, paint, -0.85, 1.72, 0);
  for (const z of [-0.8, 0.8]) {
    addBox(group, 0.08, 0.6, 0.08, trim, 0.12, 1.1, z);
  }
  const windshield = box(0.05, 0.55, 1.56, new THREE.MeshLambertMaterial({
    color: 0x36444c, transparent: true, opacity: 0.32, depthWrite: false, flatShading: true,
  }));
  windshield.position.set(0.72, 1.42, 0);
  group.add(windshield);
  for (const z of [-0.78, 0.78]) {
    addBox(group, 0.07, 0.55, 0.07, trim, 0.72, 1.42, z);
    addBox(group, 1.85, 0.28, 0.03, canvasTop, -0.6, 1.3, z);
  }
  addBox(group, 0.14, 0.16, 1.72, chrome, 1.94, 0.52, 0);
  addBox(group, 0.14, 0.16, 1.72, chrome, -1.94, 0.52, 0);
  for (const z of [-0.55, 0.55]) {
    const lamp = cylinder(0.11, 0.11, 0.08, light, 8);
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(1.83, 0.86, z);
    group.add(lamp);
  }
  addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), 2.0, 0.6, 0);
  addBox(group, 0.02, 0.12, 0.4, solid(0xe0e0d0), -2.0, 0.6, 0);
  // Spare wheel on the tailgate
  const spare = cylinder(0.34, 0.34, 0.18, trim, 10);
  spare.rotation.z = Math.PI / 2;
  spare.position.set(-2.06, 1.15, 0);
  group.add(spare);
  for (const x of [-1.2, 1.2]) {
    for (const z of [-0.72, 0.72]) {
      const wheel = cylinder(0.37, 0.37, 0.24, trim, 10);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.37, z);
      group.add(wheel);
      const hub = cylinder(0.16, 0.16, 0.25, chrome, 8);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(x, 0.37, z);
      group.add(hub);
      addBox(group, 0.9, 0.22, 0.09, paint, x, 0.66, Math.sign(z) * 0.88);
    }
  }
  return group;
}

// A Mi-8 style transport: rounded body, tail boom, main and tail rotors.
// The rotors are returned via userData so scenes can spin them in updates.
export function buildHelicopter(bodyColor = 0x5a6a5e) {
  const group = new THREE.Group();
  const body = solid(bodyColor);
  const dark = solid(0x2c302c);
  const glass = new THREE.MeshLambertMaterial({
    color: 0x36444c, transparent: true, opacity: 0.32, depthWrite: false, flatShading: true,
  });

  addBox(group, 3.4, 2.5, 2.4, body, 1.6, 2.2, 0);
  const nose = box(1.6, 1.9, 2.2, body);
  nose.position.set(3.9, 2.15, 0);
  group.add(nose);
  const canopy = box(0.06, 1.3, 2.0, glass);
  canopy.rotation.z = -0.35;
  canopy.position.set(4.5, 2.6, 0);
  group.add(canopy);
  addBox(group, 2.6, 0.9, 2.3, glass, 2.4, 3.1, 0);
  addBox(group, 5.2, 1.7, 2.3, body, -1.8, 2.4, 0);
  addBox(group, 0.9, 0.9, 0.9, body, -4.8, 2.9, 0);
  addBox(group, 0.16, 1.7, 1.4, body, -5.0, 3.7, 0);
  for (const z of [-1.3, 1.3]) {
    addBox(group, 0.4, 1.1, 0.5, dark, 3.4, 1.2, z);
    addBox(group, 0.3, 0.5, 0.4, dark, 3.3, 0.6, z);
  }
  // Skids
  for (const z of [-1.15, 1.15]) {
    addBox(group, 3.6, 0.12, 0.16, dark, 0.6, 0.28, z);
    for (const x of [1.8, 2.9, -0.4]) {
      addBox(group, 0.1, 0.75, 0.1, dark, x, 0.7, z);
    }
  }
  // Main rotor: hub plus four blades in a spinning subgroup
  const rotor = new THREE.Group();
  rotor.position.set(1.6, 3.75, 0);
  const mast = cylinder(0.12, 0.14, 0.6, dark, 6);
  rotor.add(mast);
  for (let i = 0; i < 4; i++) {
    const blade = box(7.2, 0.05, 0.34, dark);
    blade.rotation.y = (i / 4) * Math.PI * 2;
    rotor.add(blade);
  }
  group.add(rotor);
  const tailRotor = new THREE.Group();
  tailRotor.position.set(-5.15, 3.7, 0.78);
  for (let i = 0; i < 2; i++) {
    const blade = box(0.05, 1.5, 0.16, dark);
    blade.rotation.x = (i / 2) * Math.PI;
    tailRotor.add(blade);
  }
  group.add(tailRotor);
  group.userData.rotor = rotor;
  group.userData.tailRotor = tailRotor;
  return group;
}
