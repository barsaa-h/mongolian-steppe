// Motion-comic sample: six "living panels" (20 s) of the B23 mitten handover with the SH2-style look.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PoseActor, ease } from './anim.js';
import { createPerformance, faceToward } from './motion.js';
import { fromBlender } from './camera.js';
import { createLook } from './look.js';

const FPS=24,W=1920,H=1080,V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const worldQ=b=>b.getWorldQuaternion(new THREE.Quaternion());
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};

const scene=new THREE.Scene();scene.background=new THREE.Color('#0b0908');
scene.fog=new THREE.FogExp2('#1b1511',.11);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
document.body.append(renderer.domElement);
const loader=new GLTFLoader();
const data=await fetch('../godot/inputs/b23_cams.json').then(r=>r.json());

// Set: filtered textures (PS2, not PSX), shadows everywhere.
const room=(await loader.loadAsync('/assets/maps/episode-1/glb/apartment.glb')).scene;scene.add(room);
const maxAniso=renderer.capabilities.getMaxAnisotropy();
const filtered=root=>root.traverse(o=>{
  if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;
  for(const m of [o.material].flat())for(const key of ['map','normalMap','roughnessMap']){
    const tex=m[key];if(!tex)continue;tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.anisotropy=maxAniso;tex.needsUpdate=true;
  }
});
filtered(room);
const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.86,...extra});
function mesh(geometry,mat,pos,parent=scene){const o=new THREE.Mesh(geometry,mat);o.position.copy(pos);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
const box=(size,pos,mat,parent)=>mesh(new THREE.BoxGeometry(...size),mat,V(...pos),parent);
const sphere=(size,pos,mat,parent)=>{const o=mesh(new THREE.SphereGeometry(1,20,14),mat,V(...pos),parent);o.scale.set(...size);return o;};
box([11.3,.12,7.7],[0,2.77,-3.65],material('#5e554b'));
// Tablecloth: cotton weave, wash-worn stains and a fold line.
const clothTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
  x.fillStyle='#cbbd9f';x.fillRect(0,0,512,512);
  for(let i=0;i<512;i+=2){x.fillStyle=`rgba(90,70,40,${.03+.03*hash(i)})`;x.fillRect(i,0,1,512);x.fillStyle=`rgba(255,250,235,${.03+.03*hash(i+.5)})`;x.fillRect(0,i,512,1);}
  for(let k=0;k<9;k++){const g=x.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'rgba(120,85,45,.16)');g.addColorStop(1,'rgba(120,85,45,0)');
    x.save();x.translate(hash(k*3.3)*512,hash(k*7.1)*512);x.scale(18+50*hash(k),12+40*hash(k+1));x.fillStyle=g;x.beginPath();x.arc(0,0,1,0,7);x.fill();x.restore();}
  x.fillStyle='rgba(80,60,35,.10)';x.fillRect(0,254,512,3);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1);t.anisotropy=8;return t;})();
const cloth=material('#ffffff',{map:clothTex,roughness:.95});box([2.84,.014,1.42],[2.7,.798,-3.1],cloth);
for(const z of [-3.81,-2.39])box([2.84,.12,.012],[2.7,.742,z],cloth);

// Light rig "birthday night": one tungsten key, candles, cold window, a dim corridor bulb. Everything else falls to dark.
const key=new THREE.PointLight('#ffc98f',5.5,9,1);key.position.set(2.2,2.43,-2.65);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0008;key.shadow.normalBias=.02;key.shadow.camera.near=.1;key.shadow.radius=4;scene.add(key);
const bulb=sphere([.075,.09,.075],[2.2,2.49,-2.65],material('#ffcc83',{emissive:'#ffc27a',emissiveIntensity:6}));bulb.castShadow=false;
box([.004,.22,.004],[2.2,2.66,-2.65],material('#222'));
scene.add(new THREE.HemisphereLight('#c9b79c','#2a211b',.22));
const moon=new THREE.DirectionalLight('#6f8fc4',.55);moon.position.set(8,3,-1.5);moon.target.position.set(1.5,.8,-2.5);scene.add(moon,moon.target);
const candle=new THREE.PointLight('#ff9d47',1.1,3.5,1);candle.position.set(2.65,1.05,-3.05);candle.castShadow=true;candle.shadow.mapSize.set(1024,1024);candle.shadow.bias=-.001;scene.add(candle);
const faceFill=new THREE.PointLight('#ffb470',.55,4,1);faceFill.position.set(2.35,1.0,-2.95);scene.add(faceFill);
const bounce=new THREE.PointLight('#ffb27a',.28,2.2,1);bounce.position.set(1.2,.75,-2.5);scene.add(bounce);
const spill=new THREE.PointLight('#e2c39a',.5,3,1);spill.position.set(.15,1.7,-1.5);scene.add(spill);
const corridor=new THREE.PointLight('#e8c79a',1.2,5,1);corridor.position.set(-.55,2.4,-1.15);corridor.castShadow=true;corridor.shadow.mapSize.set(1024,1024);scene.add(corridor);
const corridorBulb=sphere([.05,.06,.05],[-.55,2.47,-1.15],material('#fff0d0',{emissive:'#ffdca8',emissiveIntensity:5}));corridorBulb.castShadow=false;

const leaf=room.getObjectByName('HomeKitchenDoorLeaf')||room.getObjectByName('Home.KitchenDoorLeaf');
if(!leaf)throw Error('Kitchen door leaf missing');
const hinge=new THREE.Group();hinge.position.set(-1.526,1.02,-1.98);room.add(hinge);hinge.attach(leaf);hinge.rotation.y=-.6;
const kitchenCold=new THREE.PointLight('#5f7fb0',.35,4,1);kitchenCold.position.set(-3.2,1.5,-1.2);scene.add(kitchenCold);
room.updateMatrixWorld(true);const flames=[];
room.traverse(o=>{if(o.isMesh&&(o.userData.name||o.name).startsWith('Birthday.Candle'))flames.push(o.getWorldPosition(V()).add(V(0,.08,0)));});
if(flames.length!==3)throw Error('Expected three birthday candles; got '+flames.length);
const flameMeshes=flames.map(p=>{const f=sphere([.009,.024,.009],p.toArray(),material('#ffd27a',{emissive:'#ffac3e',emissiveIntensity:9}));f.castShadow=false;return f;});
for(let i=0;i<6;i++){
  const x=2+i*.47,y=2.16+(i%2)*.12,z=-4.8;
  sphere([.13,.17,.13],[x,y,z],material(['#8f4a3a','#9c8448','#566f7c','#677257','#845a62','#98704c'][i],{roughness:.45}));
  box([.002,.6,.002],[x,y-.46,z],material('#9b8f7c'));
}
function mitten(){
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#8e1424';x.fillRect(0,0,64,64);x.lineWidth=2.2;
  // Stocking-stitch Vs, low contrast.
  for(let i=0;i<64;i+=8)for(let j=-6;j<70;j+=6){x.strokeStyle=(j/6)%2?'#a31d2e':'#9a1a2a';x.beginPath();x.moveTo(i+.5,j);x.lineTo(i+4,j+5);x.lineTo(i+7.5,j);x.stroke();}
  const knit=new THREE.CanvasTexture(c);knit.colorSpace=THREE.SRGBColorSpace;knit.wrapS=knit.wrapT=THREE.RepeatWrapping;knit.repeat.set(4,4);
  const g=new THREE.Group(),red=material('#ffffff',{map:knit,roughness:1}),cuff=material('#b9ae9e',{roughness:1});
  const body=mesh(new THREE.CapsuleGeometry(.033,.04,6,14),red,V(0,.02,0),g);body.scale.set(1,1,.58);
  const thumb=mesh(new THREE.CapsuleGeometry(.012,.022,4,10),red,V(.03,.0,0),g);thumb.rotation.z=-.6;thumb.scale.set(1,1,.8);
  const band=mesh(new THREE.CylinderGeometry(.031,.03,.03,16),cuff,V(0,-.04,0),g);band.scale.set(1,1,.62);
  return g;
}
const offered=mitten();scene.add(offered);const second=mitten();second.position.copy(fromBlender(data.anchors['ANCHOR.MITTEN_2_TABLE'].location));second.rotation.x=Math.PI/2;second.position.y+=.012;scene.add(second);

// Dust in the light: the cheapest "air" there is.
const dustCount=900,dustPos=new Float32Array(dustCount*3),dustSeed=[];
for(let i=0;i<dustCount;i++)dustSeed.push([.2+hash(i)*4.2,.3+hash(i+.3)*2.3,-.6-hash(i+.7)*4.2,hash(i+.9)]);
const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:'#ffe2b8',size:.006,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dust);

// Actors: same placement as the B23 shot.
const actors={};
for(const [i,id] of ['ganaa','altan','party-guest-01','party-guest-02'].entries()){
  const gltf=await loader.loadAsync(`/artifacts/episode-1-cast/${id}/character.glb`),group=new THREE.Group();group.add(gltf.scene);scene.add(group);
  const anchor=['GANAA_MITTENS','ALTAN_MITTENS','GUEST_LIVING_2','GUEST_LIVING_3'][i];group.position.copy(fromBlender(data.anchors['ANCHOR.'+anchor].location));
  if(id==='ganaa')group.position.z+=.75;
  group.updateMatrixWorld(true);filtered(group);
  group.traverse(o=>{if(o.isMesh)o.frustumCulled=false;});
  actors[id]=new PoseActor(group,[11,29,43,67][i]);
}
const g=actors.ganaa,a=actors.altan,p=actors['party-guest-01'],q=actors['party-guest-02'];
faceToward(g,a.group.position);faceToward(a,g.group.position);faceToward(p,q.group.position);faceToward(q,p.group.position);
const baked={};
for(const id of Object.keys(actors)){
  baked[id]={};
  for(const name of ['kneel','hand_over','take_object','wait_normal','converse_A','sip']){
    const r=await fetch(`./clips/${id==='ganaa'?'':id+'/'}${name}.json`);if(!r.ok)throw Error('Missing baked clip '+id+'/'+name);
    baked[id][name]=THREE.AnimationClip.parse(await r.json());
  }
}
const performancePose=createPerformance(actors,baked);
performancePose(3.5);
const transferCenter=g.point('wrist.R').lerp(a.point('wrist.R'),.5).add(V(0,.025,0));
for(const actor of [g,a]){
  actor.mittenGrip=actor.bones['wrist.R'].worldToLocal(transferCenter.clone());
  actor.mittenRotation=actor.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()).invert();
}
const cup=new THREE.Group(),cupMat=material('#b9ab88',{roughness:.5});
mesh(new THREE.CylinderGeometry(.036,.027,.085,16),cupMat,V(0,.04,0),cup);
mesh(new THREE.TorusGeometry(.027,.006,6,12),cupMat,V(.035,.04,0),cup);
performancePose(0);
q.bones['wrist.R'].add(cup);
cup.position.copy(q.bones['wrist.R'].worldToLocal(q.point('wrist.R').add(V(0,.04,0))));
cup.quaternion.copy(q.bones['wrist.R'].getWorldQuaternion(new THREE.Quaternion()).invert());

function turnWorld(bone,delta){
  bone.quaternion.copy(worldQ(bone.parent).invert().multiply(delta).multiply(worldQ(bone))).normalize();bone.updateWorldMatrix(false,true);
}
// Eyes lead: fixate a target with small saccades every 0.4-1.6 s.
function aimEyes(actor,target,t,seed){
  let k=0,at=0;while(at<=t){at+=.4+1.2*hash(seed+k);k++;}
  const jitter=V(hash(seed+k*3.1)-.5,hash(seed+k*5.7)-.5,hash(seed+k*7.3)-.5).multiplyScalar(.05);
  const head=actor.bones.head,forward=V(0,0,1).applyQuaternion(actor.headRest.clone().invert()).applyQuaternion(worldQ(head));
  for(const side of ['L','R']){
    const eye=actor.bones['eye.'+side];if(!eye)continue;
    const want=target.clone().add(jitter).sub(eye.getWorldPosition(V())).normalize();
    const delta=new THREE.Quaternion().setFromUnitVectors(forward,want),angle=delta.angleTo(new THREE.Quaternion());
    if(angle>.38)delta.slerp(new THREE.Quaternion(),1-.38/angle);
    turnWorld(eye,delta);
  }
}
function tremor(actor,t,amount){
  for(const [name,f] of [['head',9.1],['wrist.L',11.3],['wrist.R',10.7]]){
    const b=actor.bones[name];if(!b)continue;
    b.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(amount*Math.sin(t*f*6.28),amount*.7*Math.sin(t*f*5.1+1),amount*.5*Math.sin(t*f*7.3+2))));
  }
  actor.group.updateMatrixWorld(true);
}
function face(actor,mix){
  for(const m of actor.morphs)for(const [name,w] of Object.entries(mix)){const i=m.morphTargetDictionary['EXP.'+name];if(i!==undefined)m.morphTargetInfluences[i]=w;}
}

// Panels. Performance time runs slowly inside each panel: the pose is held, but never frozen.
const P=(pos,target,fov)=>({pos:V(...pos),target:V(...target),fov});
const panels=[
  {id:'P1_room',dur:4,perf:[0,.6],from:P([3.45,1.78,-3.95],[1.3,.85,-2.2],42),to:P([3.3,1.7,-3.8],[1.28,.86,-2.2],38),light:1,
    look:{g:'altan',a:'ganaa'},ganaa:{smile:.25},altan:{smile:.15}},
  {id:'P2_ganaa_offers',dur:3,perf:[.7,1.6],from:P([.7,.95,-2.32],[1.43,1.12,-2.0],32),to:P([.75,.95,-2.3],[1.43,1.12,-2.0],27),light:1,
    look:{g:'altan',a:'ganaa'},ganaa:{smile:.55},altan:{smile:.2},shake:.6},
  {id:'P3_altan_looks_up',dur:3.5,perf:[1.9,3.0],from:P([1.98,1.24,-2.08],[1.07,.8,-2.36],30),to:P([1.9,1.22,-2.12],[1.07,.81,-2.36],25),light:1,
    look:{g:'altan',a:'ganaa'},ganaa:{smile:.5},altan:{smile:.6}},
  {id:'P4_second_mitten',dur:3,perf:[3.0,4.0],from:P([2.8,1.1,-3.0],[3.12,.86,-3.38],30),to:P([2.87,1.05,-3.1],[3.13,.86,-3.4],22),exposure:.95,light:1,
    look:{g:'mitten',a:'mitten'},ganaa:{smile:.4},altan:{smile:.45}},
  {id:'P5_left_wrist',dur:3.5,perf:[5.9,7.5],from:P([.15,1.05,-1.85],[1.25,.85,-2.05],38),to:P([.25,1.03,-1.88],[1.25,.85,-2.05],33),light:1,
    look:{g:'altan',a:'wrist'},ganaa:{smile:[.45,0],frown:[0,.35]},altan:{smile:[.4,.1]},tremor:true},
  {id:'P6_no_smile',dur:3,perf:[7.6,8],from:P([.84,1.1,-2.52],[1.43,1.12,-2.0],24),to:P([.88,1.1,-2.48],[1.43,1.12,-2.0],19),light:1,
    look:{g:'away',a:'ganaa'},ganaa:{smile:0,frown:[.2,.38]},altan:{smile:[.3,0]},tremor:true,fadeOut:1.3},
];
let start=0;for(const panel of panels){panel.start=start;start+=panel.dur;}
const totalFrames=Math.round(start*FPS);

const camera=new THREE.PerspectiveCamera(40,W/H,.03,40);
const {composer,bloom,grade}=createLook(renderer,scene,camera,W,H);

function panelAt(time){let i=0;while(i<panels.length-1&&time>=panels[i].start+panels[i].dur)i++;return panels[i];}
const pick=(v,k)=>Array.isArray(v)?v[0]+(v[1]-v[0])*k:(v??0);
function frame(index){
  const time=index/FPS,panel=panelAt(time),local=time-panel.start,k=local/panel.dur,e=ease(k);
  const perf=panel.perf[0]+(panel.perf[1]-panel.perf[0])*k;
  performancePose(perf);
  const holder=perf<3.5?g:a;
  if(offered.parent!==holder.bones['wrist.R'])holder.bones['wrist.R'].add(offered);
  offered.position.copy(holder.mittenGrip);offered.quaternion.copy(holder.mittenRotation);
  if(panel.tremor)tremor(g,time,.012);else tremor(g,time,.004);
  scene.updateMatrixWorld(true);
  const targets={altan:a.point('head').add(V(0,.04,0)),ganaa:g.point('head').add(V(0,.06,0)),mitten:offered.getWorldPosition(V()),wrist:g.point('wrist.L'),away:V(1.36,.63,-2.63)};
  aimEyes(g,targets[panel.look.g],time,1);aimEyes(a,targets[panel.look.a],time,2);
  aimEyes(p,q.point('head'),time,3);aimEyes(q,p.point('head'),time,4);
  for(const [actor,mix] of [[g,panel.ganaa],[a,panel.altan]])face(actor,{smile:pick(mix.smile,e),frown:pick(mix.frown,e)});
  // Camera: eased push between two composed frames, plus a breath of handheld drift.
  const sh=.0035*(panel.shake??.35);
  camera.position.lerpVectors(panel.from.pos,panel.to.pos,e).add(V(sh*Math.sin(time*1.3),sh*Math.sin(time*1.7+1),0));
  camera.fov=panel.from.fov+(panel.to.fov-panel.from.fov)*e;camera.updateProjectionMatrix();
  camera.lookAt(panel.from.target.clone().lerp(panel.to.target,e).add(V(sh*Math.sin(time*.9+2),sh*.6*Math.sin(time*1.1),0)));
  // Practicals: candles and the corridor bulb flicker; the corridor only matters in panel 6.
  const flick=.82+.1*Math.sin(time*13.1)+.08*Math.sin(time*29.7+1)+.05*(hash(Math.floor(time*12))-.5);
  candle.intensity=1.1*flick;faceFill.intensity=.55*(.9+.1*flick);
  flameMeshes.forEach((f,i)=>f.scale.set(.009,.024*(.85+.2*Math.sin(time*17+i*2)),.009));
  const buzz=panel.light===2?(hash(Math.floor(time*10))>.9?.25:1):1;
  corridor.intensity=(panel.light===2?3.2:.6)*buzz;corridorBulb.material.emissiveIntensity=5*buzz;
  for(let i=0;i<dustCount;i++){const [x,y,z,s]=dustSeed[i];dustPos.set([x+.08*Math.sin(time*.3+s*20),((y-time*.02*(.3+s))%2.6+2.6)%2.6+.15,z+.08*Math.cos(time*.25+s*13)],i*3);}
  dustGeo.attributes.position.needsUpdate=true;
  const fadeIn=ease(time/.6),fadeOut=panel.fadeOut?1-ease((local-(panel.dur-panel.fadeOut))/panel.fadeOut):1;
  grade.uniforms.time.value=time;grade.uniforms.fade.value=fadeIn*fadeOut;
  renderer.toneMappingExposure=panel.exposure??1.3;
  composer.render();renderer.getContext().finish();
  return {index,panel:panel.id,local};
}
window.panels={debug:{THREE,scene,renderer,panels},lights:{key,candle,faceFill,corridor,moon,bloom},list:panels.map(({id,start,dur})=>({id,start,dur})),totalFrames,fps:FPS,frame,
  png:()=>renderer.domElement.toDataURL('image/png').split(',')[1],
  diagnostics(){const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),three:THREE.REVISION,totalFrames};}};
frame(0);document.querySelector('#status')?.remove();window.ready=true;
if(!new URLSearchParams(location.search).has('capture')){
  const t0=performance.now();renderer.setAnimationLoop(()=>frame(Math.floor((performance.now()-t0)/1000*FPS)%totalFrames));
}
