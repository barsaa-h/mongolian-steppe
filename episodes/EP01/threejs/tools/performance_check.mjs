import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { AnimationClip, Vector3 } from 'three';
import { loadRig } from './rig.mjs';
import { shotCamera, fromBlender } from '../src/camera.js';
import { faceToward, createPerformance, jointTrace } from '../src/motion.js';
const actors={},clips={};
const positions=[[1.4,0,-1.95],[1.05,0,-2.35],[3.9,0,-4.35],[2.1,0,-4.55]];
for(const [i,id] of ['ganaa','altan','party-guest-01','party-guest-02'].entries()) {
  const a=actors[id]=await loadRig(id);a.seed=[11,29,43,67][i];a.group.position.fromArray(positions[i]);a.origin.copy(a.group.position);a.group.updateMatrixWorld(true);clips[id]={};
  for(const name of ['kneel','hand_over','take_object','wait_normal','converse_A','sip'])clips[id][name]=AnimationClip.parse(JSON.parse(await readFile(new URL(`../clips/${id==='ganaa'?'':id+'/'}${name}.json`,import.meta.url),'utf8')));
}
faceToward(actors.ganaa,actors.altan.group.position);faceToward(actors.altan,actors.ganaa.group.position);faceToward(actors['party-guest-01'],actors['party-guest-02'].group.position);faceToward(actors['party-guest-02'],actors['party-guest-01'].group.position);
const pose=createPerformance(actors,clips),traces=[],feet={};let footDrift=0,minKnee=Infinity,maxGazeError=0;
pose(0);for(const [id,a] of Object.entries(actors))feet[id]=['L','R'].map(s=>a.point('foot.'+s));
const sample=t=>{pose(t);return jointTrace(actors,t);};
const first=sample(4);sample(7);assert.deepEqual(sample(4),first);
for(let i=0;i<=192;i++) {
  const trace=sample(i/24);assert.ok(Object.values(trace.actors).every(a=>Object.values(a).flat().every(Number.isFinite)));traces.push(trace);
  for(const [id,other] of [['ganaa','altan'],['altan','ganaa']]){
    const actor=actors[id],forward=new Vector3(0,0,1).applyQuaternion(actor.headRest.clone().invert()).applyQuaternion(actor.bones.head.getWorldQuaternion(actor.headRest.clone()));
    const wanted=actors[other].point('head').sub(actor.point('head')).normalize(),error=forward.angleTo(wanted);
    maxGazeError=Math.max(maxGazeError,error);
  }
  for(const [id,a] of Object.entries(actors))for(const [j,s] of ['L','R'].entries()){footDrift=Math.max(footDrift,a.point('foot.'+s).distanceTo(feet[id][j]));minKnee=Math.min(minKnee,a.point('lowerleg01.'+s).y);}
}
const d=(x,y)=>Math.hypot(...x.map((v,i)=>v-y[i]));
const handoff=d(traces[84].actors.ganaa['wrist.R'],traces[84].actors.altan['wrist.R']);
const withdrawal=d(traces[156].actors.ganaa['wrist.L'],traces[180].actors.ganaa['wrist.L']);
console.log('CONTACT',handoff,'WITHDRAWAL',withdrawal,'MAX_FOOT_DRIFT',footDrift,'MIN_KNEE_Y',minKnee);
assert.ok(handoff<.025,'handover hands must meet');assert.ok(withdrawal>.10,'left hand must withdraw visibly');
await writeFile(new URL('../compare/joint-motion-node.json',import.meta.url),JSON.stringify({method:'CPU hierarchy, same performance code as page; no skin/render verification',samples:traces},null,2)+'\n');
console.log('PERFORMANCE_OK: 193 samples including 8s endpoint, deterministic seek, finite joints, handover <2.5 cm, left withdrawal >10 cm');
assert.ok(maxGazeError<.05,'head gaze must track partner');
console.log('GAZE_OK max error radians',maxGazeError);
assert.ok(footDrift<.025,'planted feet must stay within 2.5cm');assert.ok(minKnee>0,'knees must stay above floor');
const data=JSON.parse(await readFile(new URL('../../godot/inputs/b23_cams.json',import.meta.url),'utf8'));
const cameraChecks={};pose(4);
for(const id of ['S001','S004']){
  const spec=data.cameras['CAM_B23_'+id],camera=shotCamera(spec),m=spec.matrix_world;
  assert.ok(camera.position.distanceTo(fromBlender([m[0][3],m[1][3],m[2][3]]))<1e-6);
  const forward=camera.getWorldDirection(new Vector3()),expected=fromBlender([-m[0][2],-m[1][2],-m[2][2]]).normalize();
  assert.ok(forward.distanceTo(expected)<1e-6,'camera must look along converted Blender -Z');
  const a=actors.altan,g=actors.ganaa,ap=a.point('head').project(camera),gp=g.point('head').project(camera);
  const visibleForward=new Vector3(0,0,1).applyQuaternion(a.headRest.clone().invert()).applyQuaternion(a.bones.head.getWorldQuaternion(a.headRest.clone()));
  const facing=visibleForward.dot(camera.position.clone().sub(a.point('head')).normalize());
  const baseline=new Vector3(Math.sin(1.48),0,Math.cos(1.48)).dot(camera.position.clone().sub(a.point('head')).normalize());
  assert.ok(baseline<0,'T01 Altan yaw must reproduce back-facing diagnosis');
  assert.ok(ap.x<gp.x,'Altan must be left of Ganaa');assert.ok(facing>0,'Altan face must point into visible hemisphere');
  cameraChecks[id]={altanHeadNDC:ap.toArray(),ganaaHeadNDC:gp.toArray(),altanFaceCameraDot:facing,t01FacingDot:baseline,rotationError:forward.distanceTo(expected)};
}
await writeFile(new URL('../compare/camera-check.json',import.meta.url),JSON.stringify(cameraChecks,null,2)+'\n');
console.log('CAMERA_OK',JSON.stringify(cameraChecks));
console.log('FEET_OK: planted ankle drift <2.5 cm; knees above floor');
