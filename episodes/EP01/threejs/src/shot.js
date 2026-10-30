import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { PoseActor, ease } from './anim.js';

const scene=new THREE.Scene();scene.background=new THREE.Color('#302c29');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
document.body.append(renderer.domElement);
const loader=new GLTFLoader(),V=(x,y,z)=>new THREE.Vector3(x,y,z),fromBlender=([x,y,z])=>V(x,z,-y);
const data=await fetch('../godot/inputs/b23_cams.json').then(r=>r.json());
const conversion=new THREE.Matrix4().makeRotationX(-Math.PI/2),cameras={};
for(const id of ['S001','S004']){
  const spec=data.cameras['CAM_B23_'+id],camera=new THREE.PerspectiveCamera(2*Math.atan(36/(16/9)/(2*spec.lens_mm))*180/Math.PI,16/9,.025,30);
  camera.applyMatrix4(conversion.clone().multiply(new THREE.Matrix4().set(...spec.matrix_world.flat())));cameras[id]=camera;
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
  // Artistic choice: open both performances toward the camera, as in the Blender reference.
  group.rotation.y=[-1.15,1.48,-1.57,1.45][i];group.updateMatrixWorld(true);
  group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;if(o.userData.role==='Story.ForearmBandage')o.visible=false;}});
  actors[id]=new PoseActor(group,[11,29,43,67][i]);actors[id].clips=gltf.animations.map(a=>a.name);
}
const g=actors.ganaa,a=actors.altan,p=actors['party-guest-01'],q=actors['party-guest-02'];
const feet=new Map(Object.values(actors).map(actor=>[actor,['L','R'].map(s=>actor.point('foot.'+s))]));
function bake(actor,name,rootDrop,hands,shift=V(),tilt=0){
  actor.reset();actor.group.position.add(shift);actor.bones.root.position.y-=rootDrop/actor.bones.root.parent.getWorldScale(V()).y;
  actor.bones.spine01.rotateX(tilt);actor.group.updateMatrixWorld(true);
  for(const [i,side] of ['L','R'].entries()){
    const foot=feet.get(actor)[i].clone().add(shift);const rotation=actor.bones['foot.'+side].getWorldQuaternion(new THREE.Quaternion());
    const pole=foot.clone().add(V(0,.35,.65).applyQuaternion(actor.group.quaternion));
    actor.limb(side,foot,pole,true);
    const parent=actor.bones['foot.'+side].parent.getWorldQuaternion(new THREE.Quaternion());actor.bones['foot.'+side].quaternion.copy(parent.invert().multiply(rotation));
  }
  for(const [side,target] of Object.entries(hands)){
    const pole=actor.group.localToWorld(V(side==='L'?.5:-.5,.65,.15));actor.limb(side,V(...target),pole);
  }
  actor.save(name);
}
// World-space contact targets bake into named rest-relative quaternion poses.
const safeLeft=[1.70,.53,-2.79],awayLeft=[1.93,.62,-2.84];
bake(g,'crouched',.52,{R:[1.18,.43,-2.40],L:safeLeft});
bake(g,'offer',.50,{R:[1.07,.70,-2.25],L:safeLeft},V(),-.035);
bake(g,'release',.52,{R:[1.25,.57,-2.38],L:safeLeft},V(),.025);
bake(g,'soften',.54,{R:[1.25,.46,-2.37],L:safeLeft},V(),.045);
bake(g,'withdraw',.48,{R:[1.26,.51,-2.40],L:awayLeft},V(.04,0,-.015),-.025);
const step=V(.11,0,-.035);
bake(a,'wait',0,{R:[.96,.44,-2.18],L:[1.16,.43,-2.36]});
bake(a,'take',.015,{R:[1.03,.68,-2.23],L:[1.12,.69,-2.23]},step,-.025);
bake(a,'fit',.025,{R:[1.06,.60,-2.16],L:[1.08,.64,-2.12]},step,.02);
bake(a,'show',0,{R:[.97,.77,-2.12],L:[1.23,.48,-2.26]},step,-.03);
bake(a,'reachLeft',.02,{R:[1.31,.57,-2.29],L:[1.34,.54,-2.38]},step,.045);
bake(a,'recoil',0,{R:[1.16,.61,-2.19],L:[1.26,.50,-2.29]},step,-.015);
for(const [actor,guest] of [[p,1],[q,2]]){
  const local=(x,y,z)=>actor.group.localToWorld(V(x,y,z)).toArray();
  actor.reset();bake(actor,'idle',0,{L:local(.22,.86,.12),R:local(-.22,.84,.12)});
  actor.reset();bake(actor,'gesture',.025,{L:local(.30,1.17,.31),R:local(-.27,1.03,.34)},V(),-.03);
  actor.reset();bake(actor,'sip',0,{L:local(.22,.86,.12),R:local(-.10,1.45,.20)},V(),-.025);
}
const cup=new THREE.Group(),cupMat=material('#c0b28c');
mesh(new THREE.CylinderGeometry(.036,.027,.085,16),cupMat,V(0,.04,0),cup);
mesh(new THREE.TorusGeometry(.027,.006,6,12),cupMat,V(.035,.04,0),cup);
scene.add(cup);
const tracks={
  ganaa:[[0,'crouched'],[1.9,'offer'],[3.5,'offer'],[4.4,'release'],[5.8,'soften'],[6.45,'soften'],[7.25,'withdraw'],[8,'withdraw']],
  altan:[[0,'wait'],[2,'wait'],[3.5,'take'],[4.4,'fit'],[5.5,'show'],[6,'show'],[7,'reachLeft'],[7.8,'recoil'],[8,'recoil']],
  'party-guest-01':[[0,'idle'],[1,'gesture'],[2,'idle'],[3.3,'gesture'],[4.1,'idle'],[5.3,'gesture'],[6.3,'idle'],[7.3,'gesture'],[8,'idle']],
  'party-guest-02':[[0,'idle'],[2.3,'idle'],[3,'sip'],[3.7,'sip'],[4.2,'idle'],[5.8,'idle'],[6.5,'sip'],[7.1,'sip'],[8,'idle']]
};
const composer=new EffectComposer(renderer),renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);composer.addPass(new OutputPass());
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 d=vUv-.5;float v=1.-.32*dot(d,d);float n=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;gl_FragColor=vec4(c*v+n*.006,1.);}`});composer.addPass(grade);
function pose(t){
  for(const [id,actor] of Object.entries(actors))actor.sample(tracks[id].map(([time,pose])=>({time,pose})),t);
  // A short heel-to-toe half step; the other foot catches up rather than sliding both feet together.
  const progress=ease((t-2)/1.5);
  for(const [index,side] of ['R','L'].entries()){
    const u=ease((progress-index*.4)/.6),foot=feet.get(a)[side==='L'?0:1].clone().addScaledVector(step,u);foot.y+=.038*Math.sin(Math.PI*u);
    a.limb(side,foot,foot.clone().add(V(.1,.3,.4)),true);
  }
  g.life(t,a.point('head'));a.life(t,g.point('head'));p.life(t,q.point('head'));q.life(t,p.point('head'));
  const hand=(actor,side,offset)=>V(0,offset,0).applyMatrix4(actor.bones['wrist.'+side].matrixWorld);
  const transfer=ease((t-3.25)/.25);
  offered.position.copy(hand(g,'R',.07).lerp(hand(a,'R',.052),transfer));
  offered.quaternion.copy(g.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion())).slerp(a.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()),transfer);
  cup.position.copy(hand(q,'R',.07));cup.quaternion.copy(q.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()));
}
window.renderFrame=(i,shot='S001')=>{
  if(!Number.isInteger(i)||i<0||i>=192||!cameras[shot])throw Error('Invalid frame or camera');
  camera=cameras[shot];renderPass.camera=camera;const start=performance.now();pose(i/24);composer.render(0);renderer.getContext().finish();
  return {frame:i,time:i/24,renderMs:performance.now()-start};
};
window.shot={actors,cameras,data,renderer,pose,offered,cup,scene,resize(w,h){renderer.setSize(w,h);composer.setSize(w,h);},diagnostics(){
  const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
  return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),three:THREE.REVISION,actors:Object.fromEntries(Object.entries(actors).map(([id,actor])=>[id,{bones:Object.keys(actor.bones).length,clips:actor.clips,meshes:actor.morphs.length}]))};
}};
window.renderFrame(0);document.querySelector('#status').remove();window.ready=true;
if(!new URLSearchParams(location.search).has('capture')){
  const start=performance.now();renderer.setAnimationLoop(()=>{pose(((performance.now()-start)/1000)%8);composer.render();});
}
