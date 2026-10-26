import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CAST} from '../src/cast.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const directory=resolve('output/cast');await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const result=[];
try{
 await page.goto(process.env.STUDIO_URL||'http://127.0.0.1:5173/character.html');
 await page.waitForFunction(()=>window.__character?.getState().loaded,{timeout:60000});
 for(const profile of CAST.filter(a=>a.kind!=='voice')){
  await page.evaluate(async id=>{await window.__character.select(id);document.querySelector('#motion').value='rest';document.querySelector('#motion').dispatchEvent(new Event('change'));window.__character.setExpression('neutral');},profile.id);
  await page.waitForFunction(id=>{const s=window.__character.getState();return s.loaded&&s.id===id;},profile.id);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const info=await page.evaluate(id=>{
   const actor=window.__character.scene.getObjectByName(`cast-${id}`);let meshes=0,bones=0,invalid=0,missingMaps=0;
   actor.traverse(o=>{if(o.isBone)bones++;if(o.isMesh){meshes++;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.map&&!m.map.image)missingMaps++;}
    if(o.matrixWorld.elements.some(n=>!Number.isFinite(n)))invalid++;});
   return{meshes,bones,invalid,missingMaps};
  },profile.id);
  assert.ok(info.meshes&&info.bones,`${profile.id} scene content`);assert.equal(info.invalid+info.missingMaps,0,profile.id);
  await page.locator('#game').screenshot({path:`${directory}/${profile.id}.png`});
  result.push({id:profile.id,name:profile.name,...info});
  if(result.length%8===0)console.log(`Inspected ${result.length}/48 actors`);
 }
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>window.__character.select('legacy'));await page.waitForFunction(()=>window.__character.getState().id==='legacy'&&window.__character.getState().loaded);
 assert.equal(await page.locator('#wardrobe').isVisible(),true);
 await page.evaluate(()=>window.__character.select('ganaa'));await page.waitForFunction(()=>window.__character.getState().id==='ganaa'&&window.__character.getState().loaded);
 await page.evaluate(()=>window.__character.setTime(22.15));
 const before=await page.evaluate(()=>window.__character.getState());
 assert.equal(before.motion,'hour-five');assert.equal(before.playing,false);
 await page.screenshot({path:`${directory}/studio-performance.png`});
 await writeFile(`${directory}/browser-report.json`,JSON.stringify({actors:result,errors,legacy:true,performanceScrub:before},null,2));
 console.log(`Verified ${result.length} cast actors, Legacy wardrobe and Ganaa scrub.`);
}finally{await browser.close();}
