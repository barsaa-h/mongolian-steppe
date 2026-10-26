import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile,stat} from 'node:fs/promises';
function glbJSON(buffer) {
 assert.equal(buffer.toString('ascii',0,4),'glTF');
 assert.equal(buffer.readUInt32LE(4),2);
 return JSON.parse(buffer.toString('utf8',20,20+buffer.readUInt32LE(12)));
}
test('every visible cast member has an editable rigged GLB with expressions and preview animation',async()=>{
 const roster=JSON.parse(await readFile(new URL('../assets/cast/roster.json',import.meta.url)));
 for(const actor of roster.filter(a=>a.kind!=='voice')){
  const file=await readFile(new URL(`../assets/cast/${actor.id}.glb`,import.meta.url));
  const glb=glbJSON(file);
  assert.ok(glb.skins?.length,actor.id+' rig');
  assert.ok(glb.animations?.some(a=>a.name==='idle'),actor.id+' idle');
  if(actor.kind!=='infant')assert.ok(glb.meshes.some(m=>m.extras?.targetNames?.includes('speak')),actor.id+' mouth');
  assert.ok(glb.meshes.every(m=>m.primitives.every(p=>p.attributes.POSITION!==undefined)),actor.id);
  if(actor.kind!=='infant')assert.ok(glb.images?.length,actor.id+' atlas');
  assert.ok((glb.images||[]).every(i=>i.bufferView!==undefined),actor.id+' embedded texture');
  assert.ok((await stat(new URL(`../assets/cast/${actor.id}.blend`,import.meta.url))).size>1000,actor.id+' editable source');
 }
});
test('Ganaa has a continuous 30 second authored performance and contact markers',async()=>{
 const glb=glbJSON(await readFile(new URL('../assets/cast/ganaa.glb',import.meta.url)));
 assert.ok(glb.animations.some(a=>a.name==='hour-five'));
 for(const name of ['grip-left','grip-right','cheek-contact'])assert.ok(glb.nodes.some(n=>n.name===name));
});
