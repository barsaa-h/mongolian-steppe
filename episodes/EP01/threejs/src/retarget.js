import { AnimationClip, AnimationMixer, Quaternion, QuaternionKeyframeTrack, Vector3, VectorKeyframeTrack } from 'three';

// Extra MPFB twist/deform bones retain their authored local rest transforms.
export const BONE_MAP = {
  root:'Hips', spine05:'LowerBack', spine03:'Spine', spine01:'Spine1',
  neck01:'Neck', neck02:'Neck1', head:'Head',
  'clavicle.L':'LeftShoulder', 'clavicle.R':'RightShoulder',
  'upperarm01.L':'LeftArm', 'upperarm01.R':'RightArm',
  'lowerarm01.L':'LeftForeArm', 'lowerarm01.R':'RightForeArm',
  'wrist.L':'LeftHand', 'wrist.R':'RightHand',
  'upperleg01.L':'LeftUpLeg', 'upperleg01.R':'RightUpLeg',
  'lowerleg01.L':'LeftLeg', 'lowerleg01.R':'RightLeg',
  'foot.L':'LeftFoot', 'foot.R':'RightFoot'
};
const ENDS = {
  spine05:['spine03','Spine'],spine03:['spine01','Spine1'],spine01:['neck01','Neck1'],
  neck01:['neck02','Neck1'],neck02:['head','Head'],
};
for(const [side,long] of [['L','Left'],['R','Right']]) {
  ENDS['clavicle.'+side]=['upperarm01.'+side,long+'Arm'];
  ENDS['upperarm01.'+side]=['lowerarm01.'+side,long+'ForeArm'];
  ENDS['lowerarm01.'+side]=['wrist.'+side,long+'Hand'];
  ENDS['wrist.'+side]=['finger3-1.'+side,long+'FingerBase'];
  ENDS['upperleg01.'+side]=['lowerleg01.'+side,long+'Leg'];
  ENDS['lowerleg01.'+side]=['foot.'+side,long+'Foot'];
  ENDS['foot.'+side]=['toe1-1.'+side,long+'ToeBase'];
}
const pos=b=>b.getWorldPosition(new Vector3());
const world=b=>b.getWorldQuaternion(new Quaternion());

export function bakeRetarget(source, actor, name, start=0, end=source.clip.duration, mirror=false) {
  actor.reset();
  const src=Object.fromEntries(source.skeleton.bones.filter(b=>b.name!=='ENDSITE').map(b=>[b.name,b]));
  const root=source.skeleton.bones[0];root.updateMatrixWorld(true);
  const sourceName=n=>mirror?n.replace(/Left|Right/g,s=>s==='Left'?'Right':'Left'):n;
  const mirroredQ=q=>mirror?new Quaternion(q.x,-q.y,-q.z,q.w):q;
  const mirroredV=v=>{if(mirror)v.x=-v.x;return v;};
  const sourceRest=Object.fromEntries(Object.entries(src).map(([n,b])=>[n,world(b)]));
  const sourceHipHeight=-Math.min(pos(src.LeftToeBase).y,pos(src.RightToeBase).y);
  const targetHipHeight=actor.point('root').y-actor.group.position.y;
  const scale=targetHipHeight/sourceHipHeight;
  if(!(scale>0&&Number.isFinite(scale)))throw Error('Invalid hip-height ratio');
  // Head keeps its authored world frame: MPFB special01 points backward, not toward the skull top.
  const calibration={};
  for(const [target,mappedName] of Object.entries(BONE_MAP)) {
    const bone=actor.bones[target],s=src[sourceName(mappedName)];
    if(!bone||!s)throw Error('Missing mapped bone '+target+' / '+mappedName);
    calibration[target]=world(bone);
    const ends=ENDS[target];
    const targetEnd=ends&&actor.bones[ends[0]],sourceEnd=ends&&(ends[1]==='ENDSITE'?s.children[0]:src[sourceName(ends[1])]);
    if(targetEnd&&sourceEnd) {
      const td=pos(targetEnd).sub(pos(bone)),sd=mirroredV(pos(sourceEnd).sub(pos(s)));
      if(td.length()>1e-5&&sd.length()>1e-5)calibration[target].premultiply(new Quaternion().setFromUnitVectors(td.normalize(),sd.normalize()));
    }
  }
  // Parent-first traversal matters: MPFB has intermediate bones absent from CMU.
  const ordered=[];actor.group.traverse(b=>{const n=b.userData.name||b.name;if(BONE_MAP[n])ordered.push(n);});
  const mixer=new AnimationMixer(root);mixer.clipAction(source.clip).play();
  mixer.setTime(.5);root.updateMatrixWorld(true);
  const forward=new Vector3(0,0,1).applyQuaternion(mirroredQ(world(root)));
  const heading=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),-Math.atan2(forward.x,forward.z));
  mixer.setTime(start);root.updateMatrixWorld(true);
  const origin=pos(root),times=[],values=Object.fromEntries(ordered.map(n=>[n,[]])),positions=[];
  const restSole=Math.min(actor.point('toe1-1.L').y,actor.point('toe1-1.R').y);
  let minSole=Infinity;
  const duration=Math.max(1/24,Math.min(end,source.clip.duration)-start),count=Math.floor(duration*24);
  for(let i=0;i<=count;i++) {
    const t=i/24;times.push(t);mixer.setTime(start+t);root.updateMatrixWorld(true);actor.reset();
    for(const n of ordered) {
      const bone=actor.bones[n];
      const key=sourceName(BONE_MAP[n]);
      const desired=heading.clone().multiply(mirroredQ(world(src[key]).multiply(sourceRest[key].clone().invert()))).multiply(calibration[n]);
      bone.quaternion.copy(world(bone.parent).invert().multiply(desired)).normalize();
      bone.updateWorldMatrix(false,true);values[n].push(...bone.quaternion.toArray());
    }
    const displacement=mirroredV(pos(root).sub(origin)).applyQuaternion(heading).multiplyScalar(scale);
    // Keep absolute height relative to standing hips; erase only horizontal capture placement.
    displacement.y=(pos(root).y-sourceHipHeight)*scale;
    const local=actor.bones.root.parent.worldToLocal(actor.point('root').add(displacement));
    positions.push(...local.toArray());
    actor.bones.root.position.copy(local);actor.group.updateMatrixWorld(true);
    minSole=Math.min(minSole,actor.point('toe1-1.L').y,actor.point('toe1-1.R').y);
  }
  const groundOffset=minSole-restSole;
  const correction=new Vector3(0,groundOffset,0).applyQuaternion(world(actor.bones.root.parent).invert()).divide(actor.bones.root.parent.getWorldScale(new Vector3()));
  for(let i=0;i<positions.length;i+=3){positions[i]-=correction.x;positions[i+1]-=correction.y;positions[i+2]-=correction.z;}
  mixer.stopAllAction();mixer.uncacheRoot(root);actor.reset();
  const tracks=ordered.map(n=>new QuaternionKeyframeTrack(actor.bones[n].name+'.quaternion',times,values[n]));
  tracks.push(new VectorKeyframeTrack(actor.bones.root.name+'.position',times,positions));
  const clip=new AnimationClip(name,times.at(-1),tracks);
  return {clip,metadata:{groundOffset,scale,sourceHipHeight,targetHipHeight,start,end:start+times.at(-1),fps:24,mirror,heading:heading.toArray(),boneMap:BONE_MAP}};
}

// Stateless interpolants make out-of-order frame capture deterministic.
export class MocapSampler {
  constructor(actor,clips) {
    this.actor=actor;this.clips=Object.fromEntries(Object.entries(clips).map(([name,clip])=>[name,{duration:clip.duration,tracks:clip.tracks.map(track=>({bone:Object.values(actor.bones).find(b=>b.name===track.name.split('.')[0]),property:track.name.split('.').at(-1),sample:track.createInterpolant()}))}]));
  }
  apply(name,time,{mask=()=>true,weight=1,loop=false}={}) {
    const clip=this.clips[name];if(!clip)throw Error('Unknown mocap '+name);
    const t=loop?((time%clip.duration)+clip.duration)%clip.duration:Math.max(0,Math.min(clip.duration,time));
    for(const track of clip.tracks) {
      const n=track.bone?.userData.name||track.bone?.name;if(!track.bone||!mask(n))continue;
      const values=track.sample.evaluate(t);
      if(track.property==='quaternion')track.bone.quaternion.slerp(new Quaternion().fromArray(values),weight);
      else track.bone.position.lerp(new Vector3().fromArray(values),weight);
    }
    this.actor.group.updateMatrixWorld(true);
  }
}
