import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const KEEP = new Set(["position", "normal", "uv"]);

export function mergeStatic(scene) {
  scene.updateMatrixWorld(true);

  const dynamic = new Set();
  scene.traverse((object) => {
    if (object.userData && object.userData.dynamic) {
      object.traverse((child) => dynamic.add(child));
    }
  });

  const buckets = new Map();

  scene.traverse((object) => {
    if (!object.isMesh || object.isSkinnedMesh || object.isInstancedMesh) return;
    if (dynamic.has(object) || object.userData.noMerge) return;
    const material = object.material;
    if (!material || Array.isArray(material) || material.isShaderMaterial) return;
    const geometry = object.geometry;
    if (!geometry || !geometry.attributes.position || !geometry.attributes.normal || !geometry.attributes.uv) {
      return;
    }
    if (Object.keys(geometry.morphAttributes || {}).length > 0) return;

    const clone = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    clone.applyMatrix4(object.matrixWorld);
    for (const name of Object.keys(clone.attributes)) {
      if (!KEEP.has(name)) clone.deleteAttribute(name);
    }
    clone.morphAttributes = {};
    clone.clearGroups();

    let bucket = buckets.get(material.uuid);
    if (!bucket) {
      bucket = { material, entries: [] };
      buckets.set(material.uuid, bucket);
    }
    bucket.entries.push({ object, geometry: clone });
  });

  let batches = 0;

  for (const { material, entries } of buckets.values()) {
    if (entries.length < 2) {
      for (const entry of entries) entry.geometry.dispose();
      continue;
    }
    const merged = mergeGeometries(entries.map((entry) => entry.geometry), false);
    if (!merged) {
      for (const entry of entries) entry.geometry.dispose();
      continue;
    }
    merged.computeBoundingSphere();

    for (const { object, geometry } of entries) {
      if (object.parent) object.parent.remove(object);
      geometry.dispose();
    }

    const mesh = new THREE.Mesh(merged, material);
    mesh.frustumCulled = false;
    mesh.name = `static-batch-${batches}`;
    scene.add(mesh);
    batches += 1;
  }

  scene.userData.mergedBatches = batches;
  return batches;
}
