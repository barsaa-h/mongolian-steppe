// Extract existing environment builders as a reusable kit without changing the app.
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url);
await mkdir(new URL('source/',root),{recursive:true});
await mkdir('output/naran-city',{recursive:true});
await build({stdin:{contents:`
import * as THREE from 'three';
import * as p from './src/parts.js';
import * as s from './src/structures.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeStatic } from './src/mergeStatic.js';
window.exportNaranKit=async()=>{
 const kit=new THREE.Scene();kit.name='Naran_Existing_Map_Kit';
 const assets={Ger:p.buildGer(),House:s.buildSelfBuiltHouse({roof:'#6a6860'}),
 Apartment:s.buildApartment({width:43,depth:13,floors:4,number:'12'}),
 Apartment3:s.buildApartment({width:38,depth:11,floors:3,number:'6',bodyColor:'#b3b9ad',glazed:true}),
 Apartment5:s.buildApartment({width:48,depth:13,floors:5,number:'18',bodyColor:'#c9b6a4',bandColor:0x8b8a72}),
 Fence:p.buildFenceRun(14,'warm'),Gate:p.buildGate(3.2),
 Pole:p.buildPowerPole({wood:true,lamp:true}),BusStop:s.buildBusStop(),
 WaterKiosk:s.buildWaterKiosk(),Stall:s.buildMarketStall(),
 Car:p.buildCar(0x6a6a62),Bench:p.buildBench(),Crate:p.buildCrate(),
 Barrel:p.buildBarrel(),Dumpster:s.buildDumpster(),Rock:p.buildRock(27)};
 const measurements={};
 for(const [name,model] of Object.entries(assets)){
   const merged=new THREE.Scene();merged.add(model);mergeStatic(merged);
   const group=new THREE.Group();group.name='Kit.'+name;
   for(const object of [...merged.children])group.add(object);
   group.updateMatrixWorld(true);
   const bounds=new THREE.Box3().setFromObject(group);
   measurements[name]={min:bounds.min.toArray(),max:bounds.max.toArray()};
   kit.add(group);
 }
 const buffer=await new GLTFExporter().parseAsync(kit,{binary:true,onlyVisible:true});
 let binary='';for(const byte of new Uint8Array(buffer))binary+=String.fromCharCode(byte);
 return {base64:btoa(binary),measurements};
};`,resolveDir:process.cwd(),loader:'js'},bundle:true,format:'iife',outfile:'output/naran-city/export-kit.js'});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/');
 await page.addScriptTag({url:'http://127.0.0.1:5173/output/naran-city/export-kit.js'});
 const result=await page.evaluate(()=>window.exportNaranKit());
 assert.deepEqual(errors,[]);assert.equal(Object.keys(result.measurements).length,17);
 const data=Buffer.from(result.base64,'base64');assert.equal(data.subarray(0,4).toString(),'glTF');
 await writeFile(new URL('source/existing-map-kit.glb',root),data);
 await writeFile(new URL('source/kit-measurements.json',root),JSON.stringify(result.measurements,null,2)+'\n');
 console.log(`Reused 17 current-map asset variants; kit ${(data.length/1024).toFixed(0)} KiB; no browser errors.`);
}finally{await browser.close();}
