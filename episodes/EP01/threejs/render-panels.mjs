// Render the motion-comic sample: `--stills` (one frame per panel + contact sheet) or the full 1080p24 MP4.
//   node episodes/EP01/threejs/render-panels.mjs --gpu [--stills]
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, stat, readdir, rm } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const { chromium }=await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../..');
const gpu=process.argv.includes('--gpu'),stills=process.argv.includes('--stills'),errors=[];
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png'};
const out=resolve(here,'out/panels'),compare=resolve(here,'compare/panels');
await mkdir(out,{recursive:true});await mkdir(compare,{recursive:true});
let executablePath=process.env.CHROMIUM_EXECUTABLE_PATH;
if(!executablePath){
  try{await stat(chromium.executablePath());}catch{
    const cache=resolve(process.env.HOME,'.cache/ms-playwright');
    for(const name of (await readdir(cache)).filter(n=>n.startsWith('chromium_headless_shell-')).sort().reverse()){
      const candidate=resolve(cache,name,'chrome-headless-shell-linux64/chrome-headless-shell');try{await stat(candidate);executablePath=candidate;break;}catch{}
    }
  }
}
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(gpu?['--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist']:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])]});
try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.route('http://b23.test/**',async route=>{
    try{
      const path=resolve(root,'.'+decodeURIComponent(new URL(route.request().url()).pathname));
      if(!path.startsWith(root+sep))throw Error('Outside project');
      await route.fulfill({status:200,contentType:types[extname(path)]||'application/octet-stream',body:await readFile(path)});
    }catch{await route.fulfill({status:404,body:'Not found'});}
  });
  page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE_ERROR',e.message);});
  page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.error(m.text());}});
  const t0=performance.now();
  await page.goto('http://b23.test/episodes/EP01/threejs/panels.html?capture');await page.waitForFunction(()=>window.ready,null,{timeout:180000});
  const info=await page.evaluate(()=>window.panels.diagnostics());console.log(JSON.stringify(info));
  if(gpu&&/swiftshader|llvmpipe/i.test(info.renderer))throw Error('GPU pass fell back to software: '+info.renderer);
  const list=await page.evaluate(()=>window.panels.list);
  const grab=async(index,file)=>{await page.evaluate(i=>window.panels.frame(i),index);await writeFile(file,Buffer.from(await page.evaluate(()=>window.panels.png()),'base64'));};
  if(stills){
    const files=[];
    for(const p of list){const file=resolve(compare,`${p.id}.png`);await grab(Math.round((p.start+p.dur*.6)*24),file);files.push(file);console.log('STILL',p.id);}
    const sheet=spawnSync('ffmpeg',['-y','-v','error',...files.flatMap(f=>['-i',f]),'-filter_complex',files.map((_,i)=>`[${i}]scale=640:360[s${i}]`).join(';')+';'+files.map((_,i)=>`[s${i}]`).join('')+`xstack=inputs=${files.length}:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0`,resolve(compare,'contact_sheet.png')],{encoding:'utf8'});
    assert.equal(sheet.status,0,sheet.stderr);
  }else{
    const frames=resolve(out,'frames');await rm(frames,{recursive:true,force:true});await mkdir(frames,{recursive:true});
    for(let i=0;i<info.totalFrames;i++){await grab(i,resolve(frames,`${String(i).padStart(4,'0')}.png`));if(i%48===0)console.log(`FRAME ${i}/${info.totalFrames}`);}
    const dest=resolve(compare,'EP01_motion_comic_sample_20s.mp4');
    const enc=spawnSync('ffmpeg',['-y','-v','error','-framerate','24','-i',resolve(frames,'%04d.png'),'-c:v','libx264','-preset','slow','-crf','15','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',dest],{encoding:'utf8'});
    assert.equal(enc.status,0,enc.stderr);
    const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames,r_frame_rate','-of','json',dest],{encoding:'utf8'});
    const s=JSON.parse(probe.stdout).streams[0];assert.equal(Number(s.nb_frames),info.totalFrames);console.log('VIDEO_OK',JSON.stringify(s),dest);
  }
  assert.deepEqual(errors,[]);console.log(`DONE in ${((performance.now()-t0)/1000).toFixed(1)}s`);
}finally{await browser.close();}
