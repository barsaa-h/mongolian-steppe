import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const directory=resolve('output/film');await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const url=process.env.FILM_URL||'http://127.0.0.1:5173/film.html';
try{
 await page.goto(url);await page.waitForFunction(()=>window.__film?.state().ready,{timeout:60000});
 assert.equal(await page.evaluate(()=>window.__film.state().playing),false);
 await page.locator('#play').click();await page.waitForFunction(()=>window.__film.state().time>.08);
 await page.locator('#play').click();assert.equal(await page.evaluate(()=>window.__film.state().playing),false);
 await page.locator('#scrub').fill('18');await page.locator('#scrub').dispatchEvent('input');
 assert.equal(await page.evaluate(()=>window.__film.state().time),18);
 const sample=()=>page.evaluate(()=>{window.__film.seek(18);const a=window.__film.actor();const state=[];a.group.traverse(o=>{if(o.isBone)state.push([o.name,...o.matrixWorld.elements]);if(o.morphTargetInfluences)state.push([o.name,...o.morphTargetInfluences]);});return state;});
 const first=await sample();assert.deepEqual(await sample(),first);
 await page.evaluate(()=>window.__film.seek(29.95));await page.locator('#play').click();await page.waitForFunction(()=>window.__film.state().time===30&&!window.__film.state().playing);
 await page.locator('#replay').click();await page.waitForFunction(()=>window.__film.state().playing&&window.__film.state().time<5);
 await page.evaluate(()=>window.__film.pause());
 await page.goto(url+'?render=1');await page.waitForFunction(()=>window.__film?.state().ready,{timeout:60000});
 const shots=[];
 for(const t of [1,2.3,4.3,8,14.5,16.8,18.5,21.6,22.15,22.35,23.5,25.5,28.4]){
  await page.evaluate(t=>window.__film.seek(t),t);
  await page.screenshot({path:`${directory}/shot-${t}.png`});
  const state=await page.evaluate(()=>window.__film.state());shots.push(state);
 }
 await page.evaluate(()=>window.__film.seek(18.5));await page.locator('#captions').evaluate(el=>el.style.visibility='hidden');
 await page.screenshot({path:`${directory}/performance-without-subtitles.png`});
 assert.deepEqual(errors,[]);
 await writeFile(`${directory}/browser-report.json`,JSON.stringify({playPause:true,scrub:true,repeatedSeek:true,replay:true,stopsAt30:true,shots,errors},null,2));
 console.log('Film playback, repeated seeking, replay and ending verified; captured 13 performance frames.');
}finally{await browser.close();}
