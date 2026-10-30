import { Quaternion, Vector3 } from 'three';
import { ease } from './anim.js';
import { MocapSampler } from './retarget.js';
const V=(x=0,y=0,z=0)=>new Vector3(x,y,z);
const upper=n=>!/^(root|pelvis|upperleg|lowerleg|foot|toe)/.test(n);
const worldQ=b=>b.getWorldQuaternion(new Quaternion());
export function faceToward(actor,target) {
  const delta=target.clone().sub(actor.group.position);actor.group.rotation.y=Math.atan2(delta.x,delta.z);actor.group.updateMatrixWorld(true);
}
function aimHead(actor,target) {
  const head=actor.bones.head,rest=actor.headRest;
  const current=worldQ(head);
  const forward=V(0,0,1).applyQuaternion(rest.clone().invert()).applyQuaternion(current);
  const desired=target.clone().sub(actor.point('head')).normalize();
  const bodyForward=V(0,0,1).applyQuaternion(actor.group.quaternion);
  const turn=new Quaternion().setFromUnitVectors(bodyForward,desired);
  const angle=turn.angleTo(new Quaternion());
  if(angle>1.15)turn.slerp(new Quaternion(),1-1.15/angle);
  const delta=new Quaternion().setFromUnitVectors(forward,bodyForward.applyQuaternion(turn));
  head.quaternion.copy(worldQ(head.parent).invert().multiply(delta).multiply(current));
  head.updateWorldMatrix(false,true);
}
export function createPerformance(actors,clips) {
  const {ganaa:g,altan:a,'party-guest-01':p,'party-guest-02':q}=actors;
  for(const [id,actor] of Object.entries(actors)) {
    actor.mocap=new MocapSampler(actor,clips[id]);
    actor.headRest=actor.group.getWorldQuaternion(new Quaternion()).invert().multiply(worldQ(actor.bones.head));
    actor.standingRoot=actor.rest.root.p.clone();
  }
  const contact=V(1.16,.72,-2.15);
  const pinPlacement=actor=>{
    const root=actor.bones.root;root.position.x=actor.standingRoot.x;root.position.z=actor.standingRoot.z;
    // This stationary blocking owns heading; retain captured hip pitch and roll.
    const delta=root.quaternion.clone().multiply(actor.rest.root.q.clone().invert());
    const forward=V(0,0,1).applyQuaternion(delta);
    root.quaternion.copy(new Quaternion().setFromAxisAngle(V(0,1,0),-Math.atan2(forward.x,forward.z)).multiply(delta).multiply(actor.rest.root.q));
    actor.group.updateMatrixWorld(true);
  };
  const hand=(actor,side,target,weight=1)=>{
    if(weight<=0)return;
    const names=['upperarm01.','lowerarm01.'].map(n=>n+side),saved=names.map(n=>actor.bones[n].quaternion.clone());
    const wrist=actor.bones['wrist.'+side],rotation=worldQ(wrist);
    const pole=actor.group.localToWorld(V(side==='L'?.45:-.45,.65,-.1));
    actor.limb(side,target,pole);
    for(let i=0;i<names.length;i++)actor.bones[names[i]].quaternion.slerp(saved[i],1-weight);
    actor.group.updateMatrixWorld(true);
    wrist.quaternion.copy(worldQ(wrist.parent).invert().multiply(rotation));
    actor.group.updateMatrixWorld(true);
  };
  const pose=t=>{
    for(const actor of Object.values(actors))actor.reset();
    // Artistic timing: hold the comforter's kneeling section, then layer the mirrored pass.
    g.mocap.apply('kneel',1.7+Math.min(t,8)*.22);
    g.mocap.apply('hand_over',.55+t*.48,{mask:upper});pinPlacement(g);
    a.mocap.apply('wait_normal',1+t*.3);
    a.mocap.apply('take_object',.45+t*.58,{mask:upper,weight:ease((t-.9)/.5)});pinPlacement(a);
    // Tiny torso/root shifts retain the child-scaled capture; no adult stride is copied to Altan.
    p.mocap.apply('wait_normal',2+t*.6);
    p.mocap.apply('converse_A',2+t,{mask:upper,weight:ease(t/.4)});pinPlacement(p);
    q.mocap.apply('wait_normal',9+t*.5);
    q.mocap.apply('sip',2.2+t,{mask:upper,weight:ease(t/.4)});pinPlacement(q);
    for(const actor of Object.values(actors)){
      actor.life(t);
      if(actor.floorLocks){
        actor.bones.root.position.y=Math.min(actor.bones.root.position.y,actor.floorLocks.rootY);
        actor.group.updateMatrixWorld(true);
        for(const side of ['L','R']){
          const lock=actor.floorLocks[side],pole=actor.point('lowerleg01.'+side);
          actor.limb(side,lock.position,pole,true);
          actor.bones['foot.'+side].quaternion.copy(worldQ(actor.bones['foot.'+side].parent).invert().multiply(lock.rotation));
          actor.group.updateMatrixWorld(true);
        }
      }
    }
    // Contact corrections are IK over captured body motion, not joint-angle animation.
    const offer=ease((t-.35)/.5),release=ease((t-3.5)/.45);
    const released=g.group.localToWorld(V(-.23,.57,.20));
    hand(g,'R',contact.clone().lerp(released,release),offer);
    const receive=ease((t-1.8)/.5),fit=ease((t-3.6)/.5);
    const right=contact.clone().lerp(V(1.12,.65,-2.15),fit);
    const left=right.clone().add(V(-.055,.025,.015));
    hand(a,'R',right,receive);
    hand(a,'L',left,receive);
    const sip=ease((t-4.1)/.5)*(1-ease((t-6.4)/.5));
    hand(q,'R',q.point('head').add(V(0,-.11,.11).applyQuaternion(q.group.quaternion)),sip);
    const withdraw=ease((t-6.55)/.5);
    const guarded=g.group.localToWorld(V(.22,.43,-.10));
    guarded.lerp(g.group.localToWorld(V(.30,.57,-.30)),withdraw);
    hand(g,'L',guarded);
    const reach=ease((t-6)/.5)*(1-ease((t-7.2)/.5));
    hand(a,'L',g.group.localToWorld(V(.22,.43,-.10)),reach);
    aimHead(g,a.point('head'));aimHead(a,g.point('head'));aimHead(p,q.point('head'));aimHead(q,p.point('head'));
    for(const actor of Object.values(actors))actor.group.updateMatrixWorld(true);
  };
  pose(0);
  for(const actor of Object.values(actors)){
    actor.floorLocks={rootY:actor.bones.root.position.y};
    for(const side of ['L','R'])actor.floorLocks[side]={position:actor.point('foot.'+side),rotation:worldQ(actor.bones['foot.'+side])};
  }
  return pose;
}

export function jointTrace(actors,t) {
  return {time:t,actors:Object.fromEntries(Object.entries(actors).map(([id,a])=>[id,Object.fromEntries(['head','wrist.L','wrist.R'].map(n=>[n,a.point(n).toArray()]))]))};
}
