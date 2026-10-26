import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
await mkdir('output/production',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.MAP_URL||'http://127.0.0.1:5173/');await page.waitForFunction(()=>window.__psx);
 assert.ok(Math.abs(await page.evaluate(()=>window.__psx.getState().t)-.6)<1e-9);
 await page.screenshot({path:'docs/naran-autumn-preview.png'});
 await page.keyboard.press('4');await page.waitForFunction(()=>Math.abs(window.__psx.getState().pitch-.34)<.01);
 await page.screenshot({path:'output/production/naran-yards.png'});
 await page.keyboard.press('Enter');await page.waitForFunction(()=>window.__psx.getState().character&&window.__psx.getState().explore,{timeout:60000});
 await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__psx.getState().flying);assert.equal(await page.evaluate(()=>window.__psx.getState().flying),true);
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.__psx.getState().explore),false);
 assert.deepEqual(errors,[]);
 await writeFile('output/production/map-browser-report.json',JSON.stringify({autumnStartup:true,preset:true,herderEntry:true,flight:true,mapReturn:true,errors},null,2));
 console.log('Autumn startup, preset, herder entry, flight and map return pass.');
}finally{await browser.close();}
