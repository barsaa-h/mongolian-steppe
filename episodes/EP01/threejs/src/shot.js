import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { PoseActor } from './anim.js';
import { createPerformance, faceToward, jointTrace } from './motion.js';
import { fromBlender, shotCamera } from './camera.js';

const scene=new THREE.Scene();scene.background=new THREE.Color('#302c29');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
document.body.append(renderer.domElement);
const loader=new GLTFLoader(),V=(x,y,z)=>new THREE.Vector3(x,y,z);
const data=await fetch('../godot/inputs/b23_cams.json').then(r=>r.json());
const cameras={};
for(const id of ['S001','S004']){
  cameras[id]=shotCamera(data.cameras['CAM_B23_'+id]);
}
let camera=cameras.S001;
const room=(await loader.loadAsync('/assets/maps/episode-1/glb/apartment.glb')).scene;scene.add(room);
room.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.86,...extra});
function mesh(geometry,mat,pos,parent=scene){const object=new THREE.Mesh(geometry,mat);object.position.copy(pos);object.castShadow=true;object.receiveShadow=true;parent.add(object);return object;}
const box=(size,pos,mat,parent)=>mesh(new THREE.BoxGeometry(...size),mat,V(...pos),parent);
const sphere=(size,pos,mat,parent)=>{const o=mesh(new THREE.SphereGeometry(1,16,12),mat,V(...pos),parent);o.scale.set(...size);return o;};
// The exported apartment has no roof. Close it locally instead of showing the background through it.
box([11.3,.12,7.7],[0,2.77,-3.65],material('#82786a'));
const cloth=material('#b7a484');box([2.84,.014,1.42],[2.7,.798,-3.1],cloth);
for(const z of [-3.81,-2.39])box([2.84,.12,.012],[2.7,.742,z],cloth);
const warm=new THREE.PointLight('#ffd29b',70,9,2);warm.position.set(2.2,2.43,-2.65);warm.castShadow=true;
warm.shadow.mapSize.set(512,512);warm.shadow.bias=-.001;warm.shadow.normalBias=.025;warm.shadow.camera.near=.1;scene.add(warm);
scene.add(new THREE.HemisphereLight('#d9c8ab','#4f4339',1.15));
const fill=new THREE.PointLight('#f3caa2',14,7,2);fill.position.set(.2,1.7,-.6);scene.add(fill);
const windowLight=new THREE.PointLight('#789bd2',22,6,2);windowLight.position.set(5.15,1.9,-2);scene.add(windowLight);
sphere([.075,.09,.075],[2.2,2.49,-2.65],material('#ffcc83',{emissive:'#ffc27a',emissiveIntensity:3}));
const glow=new THREE.PointLight('#ffad51',2.5,2,2);glow.position.set(2.7,1.15,-3.1);scene.add(glow);
room.updateMatrixWorld(true);let candles=0;
room.traverse(o=>{if(o.isMesh&&(o.userData.name||o.name).startsWith('Birthday.Candle')){sphere([.009,.024,.009],o.getWorldPosition(V()).add(V(0,.08,0)).toArray(),material('#ffcf68',{emissive:'#ffac3e',emissiveIntensity:4}));candles++;}});
if(candles!==3)throw Error('Expected three birthday candles; got '+candles);
for(let i=0;i<6;i++){
  const x=2+i*.47,y=2.16+(i%2)*.12,z=-4.8;
  sphere([.13,.17,.13],[x,y,z],material(['#a95743','#b99b53','#6b8492','#7c8967','#9d6b74','#b3845a'][i]));
  box([.002,.6,.002],[x,y-.46,z],material('#c2b49c'));
}
function mitten(){
  const g=new THREE.Group(),red=material('#b32130'),stitch=material('#da6d63');
  sphere([.036,.054,.021],[0,.022,0],red,g);sphere([.019,.028,.018],[.032,.006,0],red,g);
  box([.063,.026,.035],[0,-.029,0],red,g);
  for(let i=0;i<5;i++)box([.0025,.057,.002],[-.024+i*.012,.023,.02],stitch,g);
  return g;
}
const offered=mitten();scene.add(offered);const second=mitten();second.position.copy(fromBlender(data.anchors['ANCHOR.MITTEN_2_TABLE'].location));second.rotation.x=Math.PI/2;scene.add(second);
const actors={};
for(const [i,id] of ['ganaa','altan','party-guest-01','party-guest-02'].entries()){
  const gltf=await loader.loadAsync(`/artifacts/episode-1-cast/${id}/character.glb`),group=new THREE.Group();group.add(gltf.scene);scene.add(group);
  const anchor=['GANAA_MITTENS','ALTAN_MITTENS','GUEST_LIVING_2','GUEST_LIVING_3'][i];group.position.copy(fromBlender(data.anchors['ANCHOR.'+anchor].location));
  // Artistic restaging: standing anchors overlap in camera; bring the kneeler in front of the table.
  if(id==='ganaa')group.position.z+=.75;
  group.updateMatrixWorld(true);
  group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;if(o.userData.role==='Story.ForearmBandage')o.visible=false;}});
  actors[id]=new PoseActor(group,[11,29,43,67][i]);actors[id].clips=gltf.animations.map(a=>a.name);
}
const g=actors.ganaa,a=actors.altan,p=actors['party-guest-01'],q=actors['party-guest-02'];
faceToward(g,a.group.position);faceToward(a,g.group.position);faceToward(p,q.group.position);faceToward(q,p.group.position);
const baked={};
for(const id of Object.keys(actors)){
  baked[id]={};
  for(const name of ['kneel','hand_over','take_object','wait_normal','converse_A','sip']){
    const response=await fetch(`./clips/${id==='ganaa'?'':id+'/'}${name}.json`);if(!response.ok)throw Error('Missing baked clip '+id+'/'+name);
    baked[id][name]=THREE.AnimationClip.parse(await response.json());
  }
}
const performancePose=createPerformance(actors,baked);
performancePose(3.5);
const transferCenter=g.point('wrist.R').lerp(a.point('wrist.R'),.5).add(V(0,.025,0));
for(const actor of [g,a]){
  actor.mittenGrip=actor.bones['wrist.R'].worldToLocal(transferCenter.clone());
  actor.mittenRotation=actor.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()).invert();
}
const cup=new THREE.Group(),cupMat=material('#c0b28c');
mesh(new THREE.CylinderGeometry(.036,.027,.085,16),cupMat,V(0,.04,0),cup);
mesh(new THREE.TorusGeometry(.027,.006,6,12),cupMat,V(.035,.04,0),cup);
performancePose(0);
q.bones['wrist.R'].add(cup);
cup.position.copy(q.bones['wrist.R'].worldToLocal(q.point('wrist.R').add(V(0,.04,0))));
cup.quaternion.copy(q.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()).invert());
let owner=null;
const composer=new EffectComposer(renderer),renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);composer.addPass(new OutputPass());
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 d=vUv-.5;float v=1.-.32*dot(d,d);float n=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;gl_FragColor=vec4(c*v+n*.006,1.);}`});composer.addPass(grade);
function pose(t){
  performancePose(t);
  const holder=t<3.5?g:a;
  // True parent switch at frame 84; the contact correction brings both hands together first.
  if(owner!==holder){holder.bones['wrist.R'].add(offered);owner=holder;}
  offered.position.copy(holder.mittenGrip);offered.quaternion.copy(holder.mittenRotation);
  scene.updateMatrixWorld(true);
}
window.renderFrame=(i,shot='S001')=>{
  if(!Number.isInteger(i)||i<0||i>=192||!cameras[shot])throw Error('Invalid frame or camera');
  camera=cameras[shot];renderPass.camera=camera;const start=performance.now();pose(i/24);composer.render(0);renderer.getContext().finish();
  return {frame:i,time:i/24,renderMs:performance.now()-start};
};
window.shot={actors,cameras,data,renderer,pose,offered,cup,scene,jointTrace:t=>jointTrace(actors,t),resize(w,h){renderer.setSize(w,h);composer.setSize(w,h);},diagnostics(){
  const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
  return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),three:THREE.REVISION,actors:Object.fromEntries(Object.entries(actors).map(([id,actor])=>[id,{bones:Object.keys(actor.bones).length,clips:actor.clips,meshes:actor.morphs.length}]))};
}};
window.renderFrame(0);document.querySelector('#status').remove();window.ready=true;
if(!new URLSearchParams(location.search).has('capture')){
  const start=performance.now();renderer.setAnimationLoop(()=>{pose(((performance.now()-start)/1000)%8);composer.render();});
}
