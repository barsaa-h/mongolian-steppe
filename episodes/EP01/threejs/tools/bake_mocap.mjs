import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
import { AnimationClip } from 'three';
import { bakeRetarget } from '../src/retarget.js';
import { loadRig } from './rig.mjs';
export const SOURCES={kneel:'23_03',hand_over:'22_13',take_object:'23_13',converse_A:'18_08',converse_B:'19_08',sip:'137_26',laugh:'13_14',wait_normal:'137_28',wait_old:'137_32',walk:'136_20',sit_talk:'86_15'};
const folder=new URL('../clips/',import.meta.url),manifest={licence:'CMU: no restrictions; credit mocap.cs.cmu.edu (NSF EIA-0196217)',actors:{}};
for(const id of ['ganaa','altan','party-guest-01','party-guest-02']) {
  const actor=await loadRig(id);manifest.actors[id]={};
  if(id!=='ganaa')await mkdir(new URL(id+'/',folder),{recursive:true});
  for(const [name,file] of Object.entries(SOURCES)) {
    const source=new BVHLoader().parse(await readFile(new URL(`../../../../assets/sources/mocap-cmu/bvh/${file}.bvh`,import.meta.url),'utf8'));
    const {clip,metadata}=bakeRetarget(source,actor,name,.25,source.clip.duration,name==='hand_over');
    clip.userData={...metadata,source:file,actor:id};
    const json=AnimationClip.toJSON(clip);
    await writeFile(new URL(`${id==='ganaa'?'':id+'/'}${name}.json`,folder),JSON.stringify(json,(_,value)=>typeof value==='number'?Math.round(value*1e6)/1e6:value)+'\n');
    manifest.actors[id][name]={source:file,duration:clip.duration,frames:clip.tracks[0].times.length,...metadata};
    console.log('BAKED',id,name,file,clip.duration.toFixed(3)+'s',clip.tracks[0].times.length+' frames','scale='+metadata.scale.toFixed(5));
  }
}
await writeFile(new URL('manifest.json',folder),JSON.stringify(manifest,null,2)+'\n');
