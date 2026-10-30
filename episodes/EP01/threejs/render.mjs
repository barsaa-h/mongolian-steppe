import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, copyFile, stat, readdir } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const { chromium }=await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../..'),gpu=process.argv.includes('--gpu'),preview=process.argv.includes('--preview');
const lineup=process.argv.includes('--lineup');
const mode=gpu?'gpu':'swiftshader',timings=[],errors=[];
await mkdir(resolve(here,'out'),{recursive:true});await mkdir(resolve(here,'compare'),{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.bvh':'text/plain'};
const address='http://b23.test/episodes/EP01/threejs/'+(lineup?'retarget.html':'?capture');
let executablePath=process.env.CHROMIUM_EXECUTABLE_PATH;
if(!executablePath){
  try{await stat(chromium.executablePath());}catch{
    const cache=resolve(process.env.HOME,'.cache/ms-playwright');
    const installed=(await readdir(cache)).filter(name=>name.startsWith('chromium_headless_shell-')).sort().reverse();
    for(const name of installed){const candidate=resolve(cache,name,'chrome-headless-shell-linux64/chrome-headless-shell');try{await stat(candidate);executablePath=candidate;break;}catch{}}
  }
}
let browser;
try{
  const launch=performance.now();
  browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(gpu?['--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist']:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])]});
  const page=await browser.newPage({viewport:{width:960,height:540},deviceScaleFactor:1});
  // Route a virtual local origin through Playwright; no listening socket is needed in the sandbox.
  await page.route('http://b23.test/**',async route=>{
    try{
      const path=resolve(root,'.'+decodeURIComponent(new URL(route.request().url()).pathname));
      if(!path.startsWith(root+sep))throw Error('Outside project');
      const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;
      await route.fulfill({status:200,contentType:types[extname(file)]||'application/octet-stream',body:await readFile(file)});
    }catch{await route.fulfill({status:404,body:'Not found'});}
  });
  page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE_ERROR',e.message);});
  page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.error(m.text());}});
  await page.goto(address);await page.waitForFunction(()=>window.ready,null,{timeout:120000});
  const info=await page.evaluate(()=>window.shot.diagnostics());console.log(JSON.stringify(info,null,2));
  if(gpu&&/swiftshader|llvmpipe/i.test(info.renderer))throw Error('GPU pass fell back to software: '+info.renderer);
  timings.push({step:'launch_load_compile',seconds:(performance.now()-launch)/1000});
  await writeFile(resolve(here,`compare/device_v2_${mode}.json`),JSON.stringify(info,null,2)+'\n');
  if(lineup){
    const manifest=JSON.parse(await readFile(resolve(here,'clips/manifest.json'),'utf8'));
    for(const name of Object.keys(manifest.actors.ganaa)){
      const png=await page.evaluate(name=>window.renderLineup(name),name);
      await writeFile(resolve(here,`out/lineup_${name}.png`),Buffer.from(png,'base64'));
    }
    const board=spawnSync('python3',[resolve(here,'tools/plot_lineup.py'),'--gpu'],{encoding:'utf8'});
    assert.equal(board.status,0,board.stderr);console.log(board.stdout.trim());
  }else if(preview){
    for(const [frame,shot] of [[0,'S001'],[48,'S001'],[96,'S001'],[168,'S001'],[96,'S004']]){
      await page.evaluate(([f,s])=>window.renderFrame(f,s),[frame,shot]);
      await writeFile(resolve(here,`out/preview_${shot}_${frame}.png`),Buffer.from(await page.evaluate(()=>window.shot.renderer.domElement.toDataURL('image/png').split(',')[1]),'base64'));
    }
    await writeFile(resolve(here,'out/pose-diagnostics.json'),JSON.stringify(await page.evaluate(()=>{
      const result=[];
      for(const t of [0,2,3.5,4,5.5,6,7,7.9]){
        window.shot.pose(t);const actors={};for(const [id,a] of Object.entries(window.shot.actors))actors[id]=Object.fromEntries(['head','wrist.L','wrist.R','foot.L','foot.R'].map(n=>[n,a.point(n).toArray()]));result.push({t,actors});
      }
      return result;
    }),null,2));
  }else{
    const checks=await page.evaluate(()=>{
      const {actors,pose,cameras,data}=window.shot,fail=message=>{throw Error(message);};
      for(const a of Object.values(actors))if(Object.keys(a.bones).length!==137)fail('Expected shared 137-joint rig');
      const sample=t=>{pose(t);return Object.values(actors).flatMap(a=>Object.values(a.bones).flatMap(b=>[...b.position.toArray(),...b.quaternion.toArray()]));};
      const before=sample(3.125);sample(7);const after=sample(3.125);
      if(before.some((v,i)=>Math.abs(v-after[i])>1e-8))fail('Seek is not deterministic');
      const traces=[],samples=[];
      for(let i=0;i<192;i++){
        pose(i/24);samples.push(window.shot.jointTrace(i/24));const g=actors.ganaa,a=actors.altan;
        for(const actor of Object.values(actors))actor.group.traverse(mesh=>{
          if(!mesh.isSkinnedMesh)return;mesh.skeleton.update();const point=mesh.position.clone();
          for(let j=0;j<mesh.geometry.attributes.position.count;j+=389){mesh.getVertexPosition(j,point).applyMatrix4(mesh.matrixWorld);if(![point.x,point.y,point.z].every(Number.isFinite)||point.distanceTo(actor.group.position)>3)fail('Invalid skinned vertex '+mesh.name);}
        });
        traces.push({frame:i,right:g.point('wrist.R').toArray(),left:g.point('wrist.L').toArray(),altanRight:a.point('wrist.R').toArray(),altanLeft:a.point('wrist.L').toArray(),head:g.point('head').toArray()});
      }
      const distance=(x,y)=>Math.hypot(...x.map((v,i)=>v-y[i]));
      const lift=distance(traces[0].right,traces[45].right),withdrawal=distance(traces[144].left,traces[180].left);
      if(lift<.03||withdrawal<.10)fail('Insufficient visible action travel');
      const cameraErrors=Object.entries(cameras).map(([id,c])=>{const m=data.cameras['CAM_B23_'+id].matrix_world;return Math.hypot(c.position.x-m[0][3],c.position.y-m[2][3],c.position.z+m[1][3]);});
      if(cameraErrors.some(e=>e>1e-6))fail('Camera conversion error');
      pose(8);samples.push(window.shot.jointTrace(8));
      return {samples,passed:true,seekDeterministic:true,framesChecked:192,liftM:lift,withdrawalM:withdrawal,cameraPositionErrors:cameraErrors,traces};
    });
    await writeFile(resolve(here,'compare/joint-motion-page.json'),JSON.stringify({method:'world-space hand/head joints logged from page at 24 fps, plus 8s endpoint',samples:checks.samples},null,2)+'\n');
    await writeFile(resolve(here,'compare/validation-v2.json'),JSON.stringify(checks,null,2)+'\n');console.log('SCENE_OK',JSON.stringify({...checks,traces:undefined,samples:undefined}));
    for(const [width,height] of [[1920,1080],[960,540]]){
      await page.setViewportSize({width,height});await page.evaluate(([w,h])=>window.shot.resize(w,h),[width,height]);
      const folder=resolve(here,`out/${mode}_${height}`);await mkdir(folder,{recursive:true});
      for(let i=0;i<3;i++)await page.evaluate(()=>window.renderFrame(0));
      const start=performance.now(),renders=[];
      for(let i=0;i<192;i++){
        renders.push((await page.evaluate(i=>window.renderFrame(i),i)).renderMs);
        await writeFile(resolve(folder,`${String(i).padStart(4,'0')}.png`),Buffer.from(await page.evaluate(()=>window.shot.renderer.domElement.toDataURL('image/png').split(',')[1]),'base64'));
        if(i%24===0)console.log(`CAPTURE ${mode} ${width}x${height} ${i}/192 elapsed=${((performance.now()-start)/1000).toFixed(1)}s`);
      }
      const seconds=(performance.now()-start)/1000,renderSeconds=renders.reduce((a,b)=>a+b,0)/1000;
      timings.push({step:`${mode}_${width}x${height}`,seconds,frames:192,secondsPerFrame:seconds/192,renderSeconds,renderSecondsPerFrame:renderSeconds/192});
      const dest=resolve(here,`compare/B23_S001_v2${height===540?'_540p':''}.mp4`),enc=performance.now();
      const result=spawnSync('ffmpeg',['-y','-v','error','-threads','2','-framerate','24','-i',resolve(folder,'%04d.png'),'-frames:v','192','-c:v','libx264','-threads','2','-preset','fast','-crf','17','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',dest],{encoding:'utf8'});
      assert.equal(result.status,0,result.stderr);timings.push({step:`encode_${height}`,seconds:(performance.now()-enc)/1000});
      const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames,r_frame_rate','-of','json',dest],{encoding:'utf8'});assert.equal(probe.status,0,probe.stderr);
      const stream=JSON.parse(probe.stdout).streams[0];assert.equal(stream.width,width);assert.equal(stream.height,height);assert.equal(Number(stream.nb_frames),192);assert.equal(stream.r_frame_rate,'24/1');console.log('VIDEO_OK',JSON.stringify(stream));
      if(height===1080){
        await copyFile(resolve(folder,'0096.png'),resolve(here,'compare/B23_S001_v2.png'));
        await page.evaluate(()=>window.renderFrame(96,'S004'));await writeFile(resolve(here,'compare/B23_S004_v2.png'),Buffer.from(await page.evaluate(()=>window.shot.renderer.domElement.toDataURL('image/png').split(',')[1]),'base64'));
      }
    }
  }
  assert.deepEqual(errors,[]);
  if(!preview&&!lineup){
    await writeFile(resolve(here,`compare/timings_v2${gpu?'_gpu':''}.txt`),timings.map(t=>JSON.stringify(t)).join('\n')+'\n');
    const analysis=spawnSync('python3',[resolve(here,'analyze.py'),...(gpu?['--gpu']:[])],{encoding:'utf8'});
    process.stdout.write(analysis.stdout);assert.equal(analysis.status,0,analysis.stderr);
  }
  console.log(lineup?'LINEUP_OK':preview?'PREVIEW_OK':'RENDER_OK');
}catch(error){
  timings.push({step:'failed',error:error.message});throw error;
}finally{
  const log=timings.map(t=>JSON.stringify(t)).join('\n')+'\n';
  await writeFile(resolve(here,preview?'out/preview-timings.txt':lineup?'out/lineup-timings.txt':`compare/timings_v2${gpu?'_gpu':''}.txt`),log);
  if(browser)await browser.close();
}
