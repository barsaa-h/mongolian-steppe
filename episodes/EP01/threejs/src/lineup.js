import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { PoseActor } from './anim.js';
import { MocapSampler } from './retarget.js';
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(960,540);document.body.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#171b23');scene.add(new THREE.HemisphereLight(0xffffff,0x626a7a,2.8));
const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(1,4,3);scene.add(light);
const camera=new THREE.PerspectiveCamera(35,16/9,.01,100);camera.position.set(2.8,1.8,5.9);camera.lookAt(0,.85,0);
const grid=new THREE.GridHelper(7,28,0x667080,0x303744);scene.add(grid);
const template=(await new GLTFLoader().loadAsync('/artifacts/episode-1-cast/ganaa/character.glb')).scene;
const neutral=new THREE.MeshStandardMaterial({color:0xe9c69c,roughness:.9});template.traverse(o=>{if(o.isMesh){o.material=neutral;o.frustumCulled=false;}});
const manifest=await fetch('./clips/manifest.json').then(r=>r.json());let objects=[];
window.renderLineup=async name=>{
  for(const object of objects){scene.remove(object);object.traverse(o=>{if(o.isLineSegments)o.geometry.dispose();});}objects=[];
  const json=await fetch(`./clips/${name}.json`).then(r=>r.json()),clip=THREE.AnimationClip.parse(json),meta=manifest.actors.ganaa[name];
  const sourceText=await fetch(`/assets/sources/mocap-cmu/bvh/${meta.source}.bvh`).then(r=>r.text());
  for(const [i,f] of [.1,.5,.85].entries()){
    const actor=new PoseActor(clone(template),11),sampler=new MocapSampler(actor,{[name]:clip});sampler.apply(name,clip.duration*f);
    actor.group.position.x=(i-1)*1.55;actor.group.updateMatrixWorld(true);scene.add(actor.group);objects.push(actor.group);
    const source=new BVHLoader().parse(sourceText),root=source.skeleton.bones[0],mixer=new THREE.AnimationMixer(root);mixer.clipAction(source.clip).play();mixer.setTime(meta.start+clip.duration*f);root.updateMatrixWorld(true);
    const hip=root.getWorldPosition(new THREE.Vector3()),vertices=[];
    const point=bone=>{
      const p=bone.getWorldPosition(new THREE.Vector3()).sub(hip);if(meta.mirror)p.x=-p.x;
      return p.applyQuaternion(new THREE.Quaternion().fromArray(meta.heading)).multiplyScalar(meta.scale).add(actor.point('root')).add(new THREE.Vector3(.45,0,0));
    };
    for(const bone of source.skeleton.bones)if(bone.parent?.isBone)vertices.push(...point(bone.parent).toArray(),...point(bone).toArray());
    const lines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)),new THREE.LineBasicMaterial({color:0x54c3e8}));scene.add(lines);objects.push(lines);
  }
  renderer.render(scene,camera);renderer.getContext().finish();return renderer.domElement.toDataURL('image/png').split(',')[1];
};
window.shot={diagnostics(){const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),purpose:'neutral skinned MPFB + cyan CMU at 10%, 50%, 85% per clip'};}};
window.ready=true;
