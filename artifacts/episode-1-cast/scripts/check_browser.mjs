import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const output = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('response', response=>{ if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://127.0.0.1:5180/artifacts/episode-1-cast/');
  await page.waitForFunction(()=>window.__master?.getState().loaded,null,{timeout:60000});
  const profiles=await page.evaluate(()=>fetch('./cast.json').then(r=>r.json()));
  assert.equal(await page.locator('.cast-card').count(),13);
  const results=[];
  for(const profile of profiles){
    await page.evaluate(id=>window.__master.select(id),profile.id);
    const result=await page.evaluate(async id=>{
      const master=window.__master,actor=master.getActor(),meshes=[];
      if(!master.getState().loaded||master.getState().preset!==id)throw Error('Actor did not load: '+id);
      actor.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
      const roles=meshes.map(o=>o.userData.role),boneCount=meshes[0].skeleton.bones.length;
      if(boneCount!==137)throw Error('Missing rig');
      for(const role of ['Body','Hands.L','Hands.R','Clothes.Top','Hair','Eyes','Shoes'])if(!roles.includes(role))throw Error('Missing role '+role);
      for(const mesh of meshes){
        const weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex;
        if(!weights||!indices)throw Error('Unskinned part '+mesh.name);
        for(let i=0;i<weights.count;i++){
          let sum=0;for(let j=0;j<4;j++){const w=weights.array[i*4+j];if(!Number.isFinite(w)||w<0||indices.array[i*4+j]>=boneCount)throw Error('Invalid skin weights');sum+=w;}
          if(Math.abs(sum-1)>.001)throw Error('Non-normalized weights');
        }
        const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
        for(const mat of materials)if(mat.map&&!mat.map.image?.width)throw Error('Unloaded texture');
      }
      const body=meshes.find(o=>o.userData.role==='Body');
      const eyes=meshes.find(o=>o.userData.role==='Eyes');
      if(eyes.geometry.attributes.position.count<=500||roles.includes('Eyelashes'))throw Error('Old eye geometry or stock lash cards');
      const eyeMaterial=Array.isArray(eyes.material)?eyes.material[0]:eyes.material;
      if(eyeMaterial.roughness>.4)throw Error('Eye surface is too rough');
      if(!body.material.normalMap?.image?.width)throw Error('Missing portable skin detail normal map');
      const baseline=body.geometry.attributes.position.array.slice();
      const point=body.position.clone();
      const expressionMotion={};
      for(const name of ['smile','frown','blink','viseme_A','viseme_E','viseme_O','viseme_M']){
        master.setExpression(name);let movement=0;
        for(let i=0;i<body.geometry.attributes.position.count;i++){
          body.getVertexPosition(i,point);
          movement=Math.max(movement,Math.hypot(point.x-baseline[i*3],point.y-baseline[i*3+1],point.z-baseline[i*3+2]));
          if(![point.x,point.y,point.z].every(Number.isFinite))throw Error('Broken expression '+name);
        }
        if(movement<1e-6)throw Error('Expression did not move: '+name);
        expressionMotion[name]=movement;
      }
      master.setExpression('neutral');
      if(body.morphTargetInfluences.some(value=>Math.abs(value)>1e-8))throw Error('Neutral morph drift');
      master.setPerformance(true);master.setTime(.7);
      if(!body.morphTargetInfluences.some(value=>value>.05))throw Error('Talk_Check has no moving morphs');
      master.setPerformance(false);
      const key=(a,i)=>[a.getX(i),a.getY(i),a.getZ(i)].map(v=>Math.round(v*1e5)).join(',');
      const positions=body.geometry.attributes.position,normals=body.geometry.attributes.normal,lookup=new Map();
      for(let i=0;i<positions.count;i++)lookup.set(key(positions,i),i);
      const wrists=[];
      for(const hand of meshes.filter(o=>o.userData.role?.startsWith('Hands.'))){
        let matched=0,maxDelta=0;const p=hand.geometry.attributes.position,n=hand.geometry.attributes.normal;
        for(let i=0;i<p.count;i++){const j=lookup.get(key(p,i));if(j===undefined)continue;matched++;maxDelta=Math.max(maxDelta,Math.hypot(n.getX(i)-normals.getX(j),n.getY(i)-normals.getY(j),n.getZ(i)-normals.getZ(j)));}
        if(matched<10||!Number.isFinite(maxDelta)||maxDelta>.002)throw Error('Wrist shading discontinuity');
        wrists.push({hand:hand.name,matched,maxDelta});
      }
      const sample=()=>{
        const values=[];
        for(const mesh of meshes){mesh.skeleton.update();const p=mesh.position.clone();for(let i=0;i<mesh.geometry.attributes.position.count;i+=41){mesh.getVertexPosition(i,p).applyMatrix4(mesh.matrixWorld);if(![p.x,p.y,p.z].every(Number.isFinite)||p.length()>4)throw Error('Invalid posed geometry');values.push(p.x,p.y,p.z);}}
        return values;
      };
      master.setTest(true);master.setTime(0);const rest=sample();master.setTime(1);const bent=sample();master.setTest(false);
      const motion=Math.max(...rest.map((v,i)=>Math.abs(v-bent[i])));if(motion<.01)throw Error('Animation not deforming');
      const report=await fetch(`./${id}/report.json`).then(r=>r.json());
      return {id,meshes:meshes.length,bones:boneCount,wrists,motion,expressionMotion,height:report.bodyHeightM,headFraction:report.headHeightFraction,blemishes:report.skinDetailCount,wrinkleParts:report.wrinkleParts};
    },profile.id);
    assert.equal(await page.locator('#name').textContent(),profile.name);
    assert.match(await page.locator('#recipe').getAttribute('href'),new RegExp(`dna/${profile.id}\\.json$`));
    results.push(result);
    console.log('CHECKED',profile.id);
  }
  assert.ok(results.find(r=>r.id==='altan').headFraction>results.find(r=>r.id==='ganaa').headFraction*1.2);
  assert.ok(results.find(r=>r.id==='party-young-man').blemishes>=5);
  assert.ok(results.find(r=>r.id==='dulmaa').wrinkleParts>=3);
  await page.evaluate(()=>window.__master.select('ganaa'));
  const bandageVisible=()=>page.evaluate(()=>{let found;window.__master.getActor().traverse(o=>{if(o.userData.role==='Story.ForearmBandage')found=o.visible;});return found;});
  assert.equal(await bandageVisible(),false);
  await page.selectOption('#phase','hour-five');assert.equal(await bandageVisible(),true);
  await page.selectOption('#phase','healthy');assert.equal(await bandageVisible(),false);
  await page.click('#face');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.screenshot({path:output+'browser-face.png'});
  await page.click('#full');
  await page.screenshot({path:output+'browser-full.png'});
  await page.locator('#cast-board').scrollIntoViewIfNeeded();
  await page.locator('#cast-board img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#cast-board img')].every(image=>image.complete&&image.naturalWidth>0));
  await page.locator('#cast-board').screenshot({path:output+'portrait-board.png'});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const mismatch=await browser.newPage();
  await mismatch.route('**/ganaa/character.glb',route=>route.fulfill({path:output+'dasha/character.glb',contentType:'model/gltf-binary'}));
  await mismatch.goto('http://127.0.0.1:5180/artifacts/episode-1-cast/');
  await mismatch.waitForFunction(()=>document.getElementById('status').classList.contains('error'),null,{timeout:60000});
  assert.match(await mismatch.locator('#status').textContent(),/DNA identity does not match/);
  await mismatch.close();
  assert.deepEqual(errors,[]);
  await writeFile(output+'browser-report.json',JSON.stringify({passed:true,generatedAt:new Date().toISOString(),results,errors},null,2)+'\n');
  console.log('EPISODE_BROWSER_OK',results.length);
}finally{await browser.close();}
