import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const output = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://127.0.0.1:5180/artifacts/character-master/');
  await page.waitForFunction(() => window.__master?.getState().loaded, { timeout: 60000 });
  const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const results = [];
  for (const id of ['default', 'male', 'heavy', 'slim-tall', 'child']) {
    if (id !== 'default') await page.evaluate(id => window.__master.select(id), id);
    const result = await page.evaluate(async id => {
      const { getActor, getState, setTest, setTime, setExpression, setPerformance } = window.__master;
      if (!getState().loaded || getState().preset !== id) throw Error(`Preset failed: ${id}`);
      const actor = getActor();
      const meshes = [];
      actor.traverse(object => { if (object.isSkinnedMesh) meshes.push(object); });
      const problems = [];
      const roles = meshes.map(mesh => mesh.userData.role);
      for (const role of ['Body', 'Hands.L', 'Hands.R', 'Clothes.Top', 'Clothes.Bottom', 'Hair', 'Eyes', 'Shoes']) {
        if (!roles.includes(role)) problems.push(`Missing role: ${role}`);
      }
      const bones = meshes[0]?.skeleton.bones || [];
      if (bones.length !== 137) problems.push(`Expected 137 bones, got ${bones.length}`);
      if (bones.filter(bone => bone.name.startsWith('finger')).length !== 30) problems.push('Missing finger bones');
      for (const mesh of meshes) {
        const weights = mesh.geometry.getAttribute('skinWeight');
        const indices = mesh.geometry.getAttribute('skinIndex');
        if (!weights || !indices || weights.itemSize !== 4) throw Error(`Bad skin attributes: ${mesh.name}`);
        for (let v = 0; v < weights.count; v++) {
          const w = [weights.getX(v), weights.getY(v), weights.getZ(v), weights.getW(v)];
          if (!w.every(value => Number.isFinite(value) && value >= 0) || Math.abs(w.reduce((a,b) => a+b, 0) - 1) > .001) throw Error(`Invalid weights: ${mesh.name}/${v}`);
          for (let slot = 0; slot < 4; slot++) if (indices.array[v*4+slot] >= mesh.skeleton.bones.length) throw Error('Invalid bone index');
        }
        if (!mesh.userData.role?.startsWith('Eyelashes.Fine')) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials) if (!material.map?.image?.width) problems.push(`Missing texture: ${mesh.name}`);
        }
      }
      const body = meshes.find(mesh => mesh.userData.role === 'Body');
      const positionKey = (attribute, index) => [attribute.getX(index), attribute.getY(index), attribute.getZ(index)].map(value => Math.round(value * 1e5)).join(',');
      const bodyPositions = body.geometry.attributes.position, bodyNormals = body.geometry.attributes.normal;
      const boundary = new Map();
      for (let i = 0; i < bodyPositions.count; i++) boundary.set(positionKey(bodyPositions, i), i);
      const wrists = [];
      for (const hand of meshes.filter(mesh => mesh.userData.role.startsWith('Hands.'))) {
        let matched = 0, normalDelta = 0;
        const positions = hand.geometry.attributes.position, normals = hand.geometry.attributes.normal;
        for (let i = 0; i < positions.count; i++) {
          const j = boundary.get(positionKey(positions, i));
          if (j === undefined) continue;
          matched++;
          normalDelta = Math.max(normalDelta, Math.hypot(normals.getX(i)-bodyNormals.getX(j), normals.getY(i)-bodyNormals.getY(j), normals.getZ(i)-bodyNormals.getZ(j)));
        }
        if (matched < 10 || !Number.isFinite(normalDelta) || normalDelta > .002) problems.push(`Wrist seam ${hand.name}: ${matched} shared vertices, normal delta ${normalDelta}`);
        wrists.push({ hand: hand.name, matched, normalDelta });
      }
      const sample = () => {
        const values = [];
        for (const mesh of meshes) {
          mesh.skeleton.update();
          const point = mesh.position.clone();
          for (let i = 0; i < mesh.geometry.attributes.position.count; i += 17) {
            mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
            if (![point.x, point.y, point.z].every(Number.isFinite) || point.length() > 4) throw Error(`Invalid deformed vertex: ${mesh.name}`);
            values.push(point.x, point.y, point.z);
          }
        }
        return values;
      };
      setTest(true);
      setTime(0); const rest = sample();
      setTime(.5); sample();
      setTime(1); const bent = sample();
      const maxMotion = Math.max(...rest.map((value, i) => Math.abs(value - bent[i])));
      if (maxMotion < .01) problems.push('Animation did not deform vertices');
      setTest(false);
      const facial = meshes.filter(mesh => mesh.morphTargetDictionary && Object.keys(mesh.morphTargetDictionary).some(name => name.startsWith('EXP.')));
      if (!facial.length) problems.push('No EXP.* morph targets');
      const faceMorphs = meshes.reduce((sum, mesh) => sum + (mesh.morphTargetDictionary ? Object.keys(mesh.morphTargetDictionary).filter(name => name.startsWith('FACE.')).length : 0), 0);
      if (!faceMorphs) problems.push('No FACE.* control morphs');
      let talking = [];
      try {
        setExpression('smile', 1);
        if (!facial.some(mesh => mesh.morphTargetInfluences.some(value => value > .05))) problems.push('smile morph did not engage');
        setPerformance(true);
        setTime(.3);
        talking = facial.filter(mesh => mesh.morphTargetInfluences.some(value => value > .05));
        setPerformance(false);
        if (!talking.length) problems.push('Talk_Check moved no morphs');
      } catch (error) {
        problems.push(`Expression check failed: ${error.message}`);
      }
      const report = await fetch(`./${id}/report.json`).then(r => r.json());
      return { id, meshes: meshes.length, roles, wrists, bones: bones.length, maxMotion, faceMorphs, expressionMeshes: facial.length, talkMorphMeshes: talking.length, height: report.bodyHeightM, headFraction: report.headHeightFraction, waist: report.waistWidthM, problems };
    }, id);
    assert.deepEqual(result.problems, [], `${id}: ${result.problems.join(', ')}`);
    results.push(result);
    await settle();
    await page.screenshot({ path: `${output}${id}/browser-full.png` });
  }
  assert.ok(results.find(r => r.id === 'heavy').waist > results.find(r => r.id === 'male').waist * 1.05, 'Heavy build must widen the waist');
  assert.ok(results.find(r => r.id === 'child').headFraction > results[0].headFraction * 1.1, 'Child must use different head/body proportions');
  assert.equal(results.find(r => r.id === 'slim-tall').height, 1.9);
  for (const result of results) {
    assert.ok(result.faceMorphs > 0, `${result.id}: no FACE control morphs`);
    assert.ok(result.expressionMeshes > 0, `${result.id}: no EXP morph meshes`);
    assert.ok(result.talkMorphMeshes > 0, `${result.id}: Talk_Check moved no morphs`);
  }
  await page.selectOption('#preset', 'default');
  await page.waitForFunction(() => window.__master.getState().loaded && window.__master.getState().preset === 'default');
  await page.click('#face');
  await settle();
  await page.screenshot({ path: `${output}default/browser-neck.png` });
  await page.click('#hand');
  await settle();
  await page.screenshot({ path: `${output}default/browser-hand.png` });
  await page.click('#pose');
  await page.waitForFunction(() => window.__master.getState().localTime > .2);
  await settle();
  await page.screenshot({ path: `${output}default/browser-hand-bend.png` });
  await page.click('#pose');
  assert.equal(await page.locator('#pose').getAttribute('aria-pressed'), 'false');
  await page.click('#wire');
  assert.equal(await page.locator('#wire').getAttribute('aria-pressed'), 'true');
  await page.click('#wire');
  await page.click('#rotate');
  assert.equal(await page.locator('#rotate').getAttribute('aria-pressed'), 'true');
  await page.click('#rotate');
  await page.click('#full');
  await page.setViewportSize({ width: 390, height: 844 });
  await settle();
  await page.screenshot({ path: `${output}browser-mobile.png`, fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile must not overflow');
  assert.deepEqual(errors, [], `Browser errors: ${errors.join(', ')}`);
  await page.route('**/node_modules/three/build/three.module.js', route => route.abort());
  await page.reload();
  await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Preview could not start:'));
  await page.unroute('**/node_modules/three/build/three.module.js');
  await page.reload();
  await page.waitForFunction(() => window.__master?.getState().loaded);
  await writeFile(`${output}browser-report.json`, JSON.stringify({ passed: true, generatedAt: new Date().toISOString(), startupFailureHandled: true, results, errors }, null, 2) + '\n');
  console.log(JSON.stringify({ passed: true, results }, null, 2));
} finally {
  await browser.close();
}
