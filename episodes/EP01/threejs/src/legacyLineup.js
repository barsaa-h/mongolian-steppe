// Lineup of the prototype's stylized cast (assets/cast/*.glb) under the SH2 apartment light.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createLook } from './look.js';

const params=new URLSearchParams(location.search),only=params.get('id'),view=params.get('view');
const W=1920,H=1080,ids=only?[only]:['ganaa','tsetsegmaa','altan','dulmaa','sukhee','hurel','dasha','irina'];
const scene=new THREE.Scene();scene.background=new THREE.Color('#0b0908');scene.fog=new THREE.FogExp2('#1b1511',.09);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;document.body.append(renderer.domElement);
const loader=new GLTFLoader();
const room=(await loader.loadAsync('/assets/maps/episode-1/glb/apartment.glb')).scene;scene.add(room);
room.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});
const key=new THREE.PointLight('#ffc98f',5.5,9,1);key.position.set(2.4,2.45,-2.9);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0008;scene.add(key);
scene.add(new THREE.HemisphereLight('#c9b79c','#2a211b',.3));
const moon=new THREE.DirectionalLight('#6f8fc4',.5);moon.position.set(8,3,-1.5);moon.target.position.set(2,.8,-3.5);scene.add(moon,moon.target);
const mixers=[];
for(const [i,id] of ids.entries()){
  const gltf=await loader.loadAsync(`/assets/cast/${id}.glb`);const o=gltf.scene;
  o.position.set(only?2.6:.55+i*.58,0,-4.35);scene.add(o);
  o.traverse(m=>{if(m.isMesh){m.castShadow=m.receiveShadow=true;m.frustumCulled=false;}});
  const mixer=new THREE.AnimationMixer(o),idle=gltf.animations.find(a=>a.name==='idle');if(idle)mixer.clipAction(idle).play();mixer.setTime(1.3+i*.37);mixers.push(mixer);
}
const camera=new THREE.PerspectiveCamera(36,W/H,.03,40);camera.position.set(2.6,1.35,-.75);camera.lookAt(2.6,.95,-4.35);
if(only){
  // Close-up framing from the actor's own bounds: face, hands or full body.
  const box=new THREE.Box3().setFromObject(scene.getObjectByName(only)||scene.children.at(-1)),top=box.max.y;
  const frames={face:[top-.12,.55,22],hands:[top*.5,1.1,30],body:[top*.55,2.6,38]},[y,d,fov]=frames[view]||frames.body;
  camera.fov=fov;camera.updateProjectionMatrix();camera.position.set(2.6+(view==='hands'?.35:.12),y+.02,-4.35+d);camera.lookAt(2.6,y,-4.35);
  scene.add(new THREE.PointLight('#ffd9b0',1.2,4,1).translateX(2.3).translateY(top).translateZ(-3.6));
}
const {composer}=createLook(renderer,scene,camera,W,H);
composer.render();renderer.getContext().finish();
window.lineup={png:()=>renderer.domElement.toDataURL('image/png').split(',')[1]};window.ready=true;
