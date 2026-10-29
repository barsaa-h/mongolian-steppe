import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');

const directory = 'artifacts/episode-1-cast/ganaa-pilot-qa';
await mkdir(directory, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/opt/brave.com/brave/brave', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173/film.html?render=1');
  await page.waitForFunction(() => window.__film?.state().ready, {timeout: 60000});
  await page.evaluate(() => window.__film.seek(8));
  await page.screenshot({path: `${directory}/legacy-cab.png`});
  await page.goto('http://127.0.0.1:5173/film.html?render=1&ganaa=dna-candidate');
  await page.waitForFunction(() => window.__film?.state().ready, {timeout: 60000});
  const info = await page.evaluate(() => {
    const actor = window.__film.actor();
    const roles = []; let textured = 0, normalMapped = 0, morphMeshes = 0;
    actor.group.traverse(o => {
      if (!o.isMesh) return;
      roles.push(o.name);
      if (o.morphTargetDictionary) morphMeshes++;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        if (m.map) textured++;
        if (m.normalMap) normalMapped++;
      }
    });
    return {bones: actor.info.rigBones, motions: actor.motions, roles, textured, normalMapped, morphMeshes};
  });
  assert.equal(info.bones, 137, 'candidate skeleton');
  assert.ok(info.motions.includes('Deformation_Check') && info.motions.includes('Talk_Check'));
  assert.ok(info.textured > 0 && info.normalMapped > 0 && info.morphMeshes >= 4, 'candidate materials or morphs missing');
  const wristView = await page.evaluate(() => {
    window.__film.seek(2.3);
    const actor = window.__film.actor();
    const truck = actor.group.parent;
    const camera = truck.worldToLocal(window.__film.camera.position.clone());
    return {cameraX: camera.x, actorX: actor.group.position.x, bandageVisible: actor.group.getObjectByName('StoryForearmBandage').visible};
  });
  assert.equal(wristView.bandageVisible, true, 'hour-five selects the bandage state');
  assert.ok(wristView.cameraX < wristView.actorX, 'wrist insert faces the bandaged right side');
  const sample = async time => page.evaluate(t => {
    window.__film.seek(t);
    const parts = [];
    window.__film.actor().group.traverse(o => { if (o.isBone) parts.push([o.name, ...o.matrixWorld.elements]); if (o.morphTargetInfluences) parts.push([o.name, ...o.morphTargetInfluences]); });
    return parts;
  }, time);
  await page.evaluate(() => window.__film.actor().setMotion('Deformation_Check'));
  const first = await sample(8);
  await sample(30); await sample(0); await sample(2); assert.deepEqual(await sample(8), first, 'candidate pose changes after seeking');
  await page.screenshot({path: `${directory}/candidate-cab.png`});
  await page.evaluate(() => { window.__film.actor().setMotion('rest'); window.__film.actor().setExpression('smile'); window.__film.seek(8); });
  await page.screenshot({path: `${directory}/candidate-smile-standing.png`});
  // Diagnostic camera alignment only; this is not a seated pose.
  await page.evaluate(() => { window.__film.actor().group.position.y -= 0.85; window.__film.seek(8); });
  await page.screenshot({path: `${directory}/candidate-lowered-smile.png`});
  assert.deepEqual(errors, []);
  await writeFile(`${directory}/browser-report.json`, JSON.stringify({checkedAt: new Date().toISOString(), glbSha256: createHash('sha256').update(await readFile('assets/cast/candidates/ganaa/dna-v1.glb')).digest('hex'), info, wristView, seek: true, errors}, null, 2) + '\n');
  console.log('Candidate loaded in HOUR 5; out-of-order seek verified. Captures are technical evidence, not approval.');
} finally { await browser.close(); }
