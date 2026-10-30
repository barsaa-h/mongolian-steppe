import { Euler, Quaternion, Vector3 } from 'three';

export const ease = value => { const x=Math.max(0,Math.min(1,value)); return x*x*(3-2*x); };
const position = bone => bone.getWorldPosition(new Vector3());

function turnWorld(bone, delta) {
  const parent=bone.parent.getWorldQuaternion(new Quaternion());
  const world=bone.getWorldQuaternion(new Quaternion());
  bone.quaternion.copy(parent.invert().multiply(delta).multiply(world)).normalize();
  bone.updateWorldMatrix(false,true);
}

// Aim joint origins rather than assuming MPFB's local bend axes.
export function solveLimb(upper, lower, end, target, pole) {
  upper.updateWorldMatrix(true,true);
  const start=position(upper),middle=position(lower),tip=position(end);
  const a=start.distanceTo(middle),b=middle.distanceTo(tip),direction=target.clone().sub(start).normalize();
  const distance=Math.max(Math.abs(a-b)+.0001,Math.min(a+b-.0001,start.distanceTo(target)));
  const along=(a*a-b*b+distance*distance)/(2*distance);
  const bend=pole.clone().sub(start);bend.addScaledVector(direction,-bend.dot(direction)).normalize();
  const elbow=start.clone().addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,a*a-along*along)));
  turnWorld(upper,new Quaternion().setFromUnitVectors(middle.sub(start).normalize(),elbow.sub(start).normalize()));
  turnWorld(lower,new Quaternion().setFromUnitVectors(position(end).sub(position(lower)).normalize(),start.addScaledVector(direction,distance).sub(position(lower)).normalize()));
}

export class PoseActor {
  constructor(group,seed) {
    this.group=group;this.seed=seed;this.bones={};this.rest={};this.poses={};this.morphs=[];
    group.traverse(object=>{
      if(object.isBone){const name=object.userData.name||object.name;this.bones[name]=object;this.rest[name]={q:object.quaternion.clone(),p:object.position.clone()};}
      if(object.morphTargetDictionary)this.morphs.push(object);
    });
    this.origin=group.position.clone();
  }
  reset() {
    for(const [name,bone] of Object.entries(this.bones)){bone.quaternion.copy(this.rest[name].q);bone.position.copy(this.rest[name].p);}
    this.group.position.copy(this.origin);this.group.updateMatrixWorld(true);
  }
  save(name) {
    this.poses[name]={position:this.group.position.clone().sub(this.origin),bones:{}};
    for(const [id,bone] of Object.entries(this.bones))this.poses[name].bones[id]={q:this.rest[id].q.clone().invert().multiply(bone.quaternion).normalize(),p:bone.position.clone().sub(this.rest[id].p)};
  }
  sample(keys,t) {
    this.reset();let index=0;
    while(index<keys.length-2&&t>keys[index+1].time)index++;
    const a=keys[index],b=keys[index+1],blend=ease((t-a.time)/(b.time-a.time));
    const pa=this.poses[a.pose],pb=this.poses[b.pose];
    this.group.position.add(pa.position.clone().lerp(pb.position,blend));
    for(const [id,bone] of Object.entries(this.bones)){
      bone.quaternion.multiply(pa.bones[id].q.clone().slerp(pb.bones[id].q,blend)).normalize();
      bone.position.add(pa.bones[id].p.clone().lerp(pb.bones[id].p,blend));
    }
    this.group.updateMatrixWorld(true);
  }
  limb(side,target,pole,leg=false) {
    const names=leg?['upperleg01.','lowerleg01.','foot.']:['upperarm01.','lowerarm01.','wrist.'];
    solveLimb(...names.map(name=>this.bones[name+side]),target,pole);
  }
  point(name) { return position(this.bones[name]); }
  life(t,target) {
    const phase=this.seed*1.73;
    const breathe=Math.sin(t*2*Math.PI/(3.2+(this.seed%8)*.1)+phase);
    this.bones.spine01?.quaternion.multiply(new Quaternion().setFromEuler(new Euler(.012*breathe,0,.009*breathe)));
    if(this.bones.root)this.bones.root.position.x+=.008*Math.sin(t*2*Math.PI/(4.6+this.seed*.083)+phase);
    for(const side of ['L','R'])this.bones['wrist.'+side]?.quaternion.multiply(new Quaternion().setFromEuler(new Euler(.025*Math.sin(t*1.3+phase),.016*Math.sin(t*2.1+phase+2),.016*Math.cos(t*1.7+phase))));
    this.group.updateMatrixWorld(true);
    if(target&&this.bones.head){
      const head=this.bones.head,forward=new Vector3(0,0,1).applyQuaternion(this.group.quaternion);
      const toward=target.clone().sub(position(head)).normalize();
      const delta=new Quaternion().setFromUnitVectors(forward,toward);
      const angle=delta.angleTo(new Quaternion());
      delta.slerp(new Quaternion(),Math.max(0,1-.38/Math.max(angle,.0001)));
      turnWorld(head,delta);
    }
    const cycle=(t+this.seed*.43)%3.7,blink=Math.max(0,1-Math.abs(cycle-.16)/.09);
    for(const mesh of this.morphs){const i=mesh.morphTargetDictionary['EXP.blink'];if(i!==undefined)mesh.morphTargetInfluences[i]=blink;}
    this.group.updateMatrixWorld(true);
  }
}
