import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { AnimationClip, AnimationMixer, Quaternion, Vector3 } from 'three';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
import { loadRig } from './rig.mjs';
import { MocapSampler, BONE_MAP } from '../src/retarget.js';
const here=new URL('../',import.meta.url),manifest=JSON.parse(await readFile(new URL('clips/manifest.json',here),'utf8'));
const actor=await loadRig('ganaa'),panels=[],results=[];
const edges=[['root','spine05'],['spine05','spine03'],['spine03','spine01'],['spine01','neck01'],['neck01','head']];
for(const side of ['L','R'])edges.push(['spine01','clavicle.'+side],['clavicle.'+side,'upperarm01.'+side],['upperarm01.'+side,'lowerarm01.'+side],['lowerarm01.'+side,'wrist.'+side],['root','upperleg01.'+side],['upperleg01.'+side,'lowerleg01.'+side],['lowerleg01.'+side,'foot.'+side]);
for(const [name,meta] of Object.entries(manifest.actors.ganaa)) {
  const clip=AnimationClip.parse(JSON.parse(await readFile(new URL(`clips/${name}.json`,here),'utf8')));
  assert.ok(clip.tracks.every(track=>Array.from(track.values).every(Number.isFinite)));
  for(const track of clip.tracks)for(let i=1;i<track.times.length;i++)assert.ok(Math.abs(track.times[i]-track.times[i-1]-1/24)<.00001);
  const sampler=new MocapSampler(actor,{[name]:clip}),samples=[];
  let floor=Infinity,maxStep=0;
  const prior={};
  for(let i=0;i<clip.tracks[0].times.length;i++) {
    actor.reset();sampler.apply(name,i/24);
    for(const n of ['foot.L','foot.R'])floor=Math.min(floor,actor.point(n).y);
    for(const [n,b] of Object.entries(actor.bones)) {
      assert.ok(Math.abs(b.quaternion.length()-1)<1e-5);
      if(prior[n])maxStep=Math.max(maxStep,b.quaternion.angleTo(prior[n]));prior[n]=b.quaternion.clone();
    }
  }
  const src=new BVHLoader().parse(await readFile(new URL(`../../../assets/sources/mocap-cmu/bvh/${meta.source}.bvh`,here),'utf8'));
  const sourceRoot=src.skeleton.bones[0],mixer=new AnimationMixer(sourceRoot);mixer.clipAction(src.clip).play();
  let maxDirectionError=0;
  const sourceBones=Object.fromEntries(src.skeleton.bones.map(b=>[b.name,b]));
  for(const t of [.1, .5, .85].map(f=>Math.round(f*clip.duration*24)/24)) {
    actor.reset();sampler.apply(name,t);mixer.setTime(meta.start+t);sourceRoot.updateMatrixWorld(true);
    const hips=sourceRoot.getWorldPosition(new Vector3());
    const target=Object.fromEntries(Object.keys(BONE_MAP).map(n=>[n,actor.point(n).toArray()]));
    const source={};
    for(const [n,s] of Object.entries(BONE_MAP)) {
      const key=meta.mirror?s.replace(/Left|Right/g,x=>x==='Left'?'Right':'Left'):s;
      const p=sourceBones[key].getWorldPosition(new Vector3()).sub(new Vector3(hips.x,0,hips.z));
      if(meta.mirror)p.x=-p.x;p.applyQuaternion(new Quaternion().fromArray(meta.heading)).multiplyScalar(meta.scale);
      source[n]=p.toArray();
    }
    for(const [joint,end] of [['upperarm01.L','lowerarm01.L'],['lowerarm01.L','wrist.L'],['upperarm01.R','lowerarm01.R'],['lowerarm01.R','wrist.R'],['upperleg01.L','lowerleg01.L'],['lowerleg01.L','foot.L'],['upperleg01.R','lowerleg01.R'],['lowerleg01.R','foot.R']]){
      const direction=(points,a,b)=>new Vector3().fromArray(points[b]).sub(new Vector3().fromArray(points[a])).normalize();
      maxDirectionError=Math.max(maxDirectionError,direction(target,joint,end).angleTo(direction(source,joint,end)));
    }
    samples.push({time:t,target,source});
  }
  assert.ok(maxDirectionError<.002,`${name}: limb directions must follow CMU, got ${maxDirectionError}`);
  assert.ok(floor>0,`${name}: ankles through floor`);
  panels.push({name,source:meta.source,samples});results.push({name,frames:clip.tracks[0].times.length,minFootY:floor,maxQuaternionStepRad:maxStep,maxDirectionErrorRad:maxDirectionError});
}
await mkdir(new URL('out/',here),{recursive:true});
await writeFile(new URL('out/retarget-skeletons.json',here),JSON.stringify({panels,edges}));
await writeFile(new URL('compare/retarget-check.json',here),JSON.stringify(results,null,2)+'\n');
const plot=spawnSync('python3',[new URL('./plot_lineup.py',import.meta.url).pathname],{encoding:'utf8'});assert.equal(plot.status,0,plot.stderr);console.log(plot.stdout.trim());
for(const r of results)console.log('CLIP_OK',r.name,r.frames,'frames','minFootY='+r.minFootY.toFixed(4),'maxStep='+r.maxQuaternionStepRad.toFixed(3),'directionError='+r.maxDirectionErrorRad.toExponential(2));
console.log('RETARGET_OK: 11 clips, finite normalized rotations, uniform 24 fps, CMU limb direction error <0.002 rad; see warnings and lineup for contact quality');
if(process.argv.includes('--gpu')) {
  const render=spawnSync(process.execPath,[new URL('../render.mjs',import.meta.url).pathname,'--gpu','--lineup'],{stdio:'inherit'});process.exitCode=render.status??1;
}
