import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PoseActor } from '../src/anim.js';
export async function loadRig(id) {
  const bytes=await readFile(new URL(`../../../../artifacts/episode-1-cast/${id}/character.glb`,import.meta.url));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));
  const hierarchy={asset:json.asset,scenes:json.scenes,scene:json.scene,nodes:json.nodes.map(({mesh,skin,camera,extensions,...rest})=>rest),skins:json.skins.map(s=>({joints:s.joints}))};
  return new PoseActor((await new GLTFLoader().parseAsync(JSON.stringify(hierarchy),'')).scene,11);
}
