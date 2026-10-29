import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Blender round-trip: named sets whose authored GLB replaces the procedural
// static subtree at runtime. Cast figures, lights, sprites and dynamic props
// always stay procedural. ?nomap=1 disables for before/after comparison.

const AUTHORED = {
  "ep1-apartment": "assets/maps/glb/authored/ep1-apartment.glb",
  "ep1-truckstop": "assets/maps/glb/authored/ep1-truckstop.glb",
  "ep1-yard": "assets/maps/glb/authored/ep1-yard.glb",
  "ep10-dzud": "assets/maps/glb/authored/ep10-dzud.glb",
  "ep2-nursery": "assets/maps/glb/authored/ep2-nursery.glb",
  "ep3-governor": "assets/maps/glb/authored/ep3-governor.glb",
  "ep4-school": "assets/maps/glb/authored/ep4-school.glb",
  "ep5-cordon": "assets/maps/glb/authored/ep5-cordon.glb",
  "ep6-gorge": "assets/maps/glb/authored/ep6-gorge.glb",
  "ep7-boilerhouse": "assets/maps/glb/authored/ep7-boilerhouse.glb",
  "ep8-truckstop": "assets/maps/glb/authored/ep8-truckstop.glb",
  "ep9-cabin": "assets/maps/glb/authored/ep9-cabin.glb",
};

const loader = new GLTFLoader();

function collectStaticRoots(scene) {
  const keep = [];
  scene.traverse(object => {
    if (object.parent !== scene) return;
    if (object.isLight || object.isCamera) return;
    let blocked = false;
    object.traverse(child => {
      if (child.isSkinnedMesh || child.isSprite || child.isLine || child.userData.dynamic) blocked = true;
    });
    if (!blocked) keep.push(object);
  });
  return keep;
}

// Keep the PSX look: authored GLB materials arrive as MeshStandardMaterial;
// the house style is flat Lambert with the same map/color/alpha.
function convertMaterial(source) {
  const next = new THREE.MeshLambertMaterial({
    color: source.color ? source.color.clone() : new THREE.Color(0xffffff),
    flatShading: true,
  });
  if (source.map) next.map = source.map;
  if (source.transparent) {
    next.transparent = true;
    next.opacity = source.opacity ?? 1;
    next.depthWrite = source.depthWrite !== false;
  }
  if (source.alphaTest) next.alphaTest = source.alphaTest;
  if (source.side !== undefined) next.side = source.side;
  if (source.emissive && source.emissive.getHex() !== 0) {
    next.emissive = source.emissive.clone();
    next.emissiveIntensity = source.emissiveIntensity ?? 1;
  }
  return next;
}

export async function applyMapOverride(scene, sceneId) {
  const file = AUTHORED[sceneId];
  if (!file) return "none";
  const head = await fetch(file, { method: "HEAD" });
  if (!head.ok) return "none";
  const gltf = await loader.loadAsync(file);
  const roots = collectStaticRoots(scene);
  roots.forEach(root => scene.remove(root));
  gltf.scene.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = object.receiveShadow = true;
    const source = object.material;
    object.material = Array.isArray(source)
      ? source.map(convertMaterial)
      : convertMaterial(source);
  });
  scene.add(gltf.scene);
  return "authored";
}
