import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("viewer");
const status = document.getElementById("status");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 40);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 8;
controls.minPolarAngle = 0.12;
controls.maxPolarAngle = Math.PI / 2;

scene.add(new THREE.HemisphereLight(0xdbe4f2, 0x77726b, 2));
const key = new THREE.DirectionalLight(0xffe6cf, 3.4);
key.position.set(2.5, 5.5, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = key.shadow.camera.bottom = -2.5;
key.shadow.camera.right = key.shadow.camera.top = 2.5;
key.shadow.camera.near = 0.1;
key.shadow.camera.far = 12;
key.shadow.normalBias = 0.015;
scene.add(key);
const rim = new THREE.DirectionalLight(0xb6cae8, 2.3);
rim.position.set(-3, 3, -2);
scene.add(rim);
const fill = new THREE.DirectionalLight(0xd5dfea, 0.8);
fill.position.set(-3, 1.5, 3);
scene.add(fill);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),
  new THREE.ShadowMaterial({ color: 0x0b0d10, opacity: 0.38 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.008;
ground.receiveShadow = true;
scene.add(ground);

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

async function loadCharacter() {
  try {
    const { scene: source } = await new GLTFLoader().loadAsync("/assets/man.glb");
    const character = new THREE.Group();
    character.rotation.x = -Math.PI / 2;
    character.add(source);
    character.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(character);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    character.position.set(-center.x, -bounds.min.y, -center.z);
    character.traverse(object => {
      if (object.isMesh) object.castShadow = object.receiveShadow = true;
    });
    scene.add(character);

    controls.target.set(0, size.y * 0.53, 0);
    camera.position.set(size.y * 0.68, size.y * 0.78, size.y * 2.15);
    camera.lookAt(controls.target);
    controls.update();
    status.textContent = "Model ready";
  } catch (error) {
    console.error("Character model could not load", error);
    status.textContent = "Could not load assets/man.glb";
  }
}
loadCharacter();

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
