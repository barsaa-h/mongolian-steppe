const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
import {readFile} from 'node:fs/promises';
if (!process.argv[2]) throw new Error('Pass the absolute path to a study GLB');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH || '/opt/brave.com/brave/brave',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {const page=await browser.newPage({viewport:{width:1280,height:720}});
 await page.route('**/assets/cast/candidates/ganaa/dna-v1.glb',async route=>route.fulfill({status:200,contentType:'model/gltf-binary',body:await readFile(process.argv[2])}));
 await page.goto('http://127.0.0.1:5173/film.html?render=1&ganaa=dna-candidate');await page.waitForFunction(()=>window.__film?.state().ready,{timeout:60000});
 await page.evaluate(()=>{window.__film.actor().setMotion('Cheek_Block')});
 let res=await page.evaluate(async()=>{const T=await import('/node_modules/three/build/three.module.js');let ray=new T.Raycaster(),out={};for(let t of [20,21.5,22,22.15,22.35,23,23.5,24,25]){window.__film.seek(t);let count=0;for(let y=350;y<=364;y+=2)for(let x=360;x<=374;x+=2){ray.setFromCamera(new T.Vector2(x/640-1,1-y/360),window.__film.camera);let h=ray.intersectObject(window.__film.actor().group,true)[0];if(h?.object.userData.role==='Body')count++;}out[t]=count};return out});console.log(JSON.stringify(res,null,2));
}finally{await browser.close()}
