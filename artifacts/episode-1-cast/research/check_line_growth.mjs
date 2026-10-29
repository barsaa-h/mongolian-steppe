// Research-only runtime probe. Start the preview server and pass an exported study GLB.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {readGeometryGLB} from '../../../tests/helpers/glb.mjs';

const asset = process.argv[2];
const output = process.argv[3];
if (!asset || !output) throw new Error('Usage: node check_line_growth.mjs /absolute/study.glb /absolute/output-prefix');
const gltf = await readGeometryGLB('line-growth', pathToFileURL(asset));
let mesh;
gltf.scene.traverse(object => { if (object.userData.role === 'Story.InfectionLine') mesh = object; });
assert.ok(mesh?.geometry.index);
const index = mesh.geometry.index, position = mesh.geometry.attributes.position;
assert.equal(index.count, 180);
// Every pair of triangles forms a strip sharing the preceding strip's edge.
const coordinate = i => [position.getX(i), position.getY(i), position.getZ(i)].map(n => n.toFixed(6)).join(',');
for (let segment = 1; segment < 30; segment++) {
  const previous = new Set(Array.from({length: 6}, (_, i) => coordinate(index.getX((segment-1)*6+i))));
  const current = new Set(Array.from({length: 6}, (_, i) => coordinate(index.getX(segment*6+i))));
  assert.equal([...current].filter(value => previous.has(value)).length, 2, `segment ${segment} must continue the strip`);
}
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/opt/brave.com/brave/brave', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/assets/cast/candidates/ganaa/dna-v1.glb', async route => route.fulfill({status: 200, contentType: 'model/gltf-binary', body: await readFile(asset)}));
  await page.goto('http://127.0.0.1:5173/film.html?render=1&ganaa=dna-candidate');
  await page.waitForFunction(() => window.__film?.state().ready, {timeout: 60000});
  await page.evaluate(() => {
    const actor = window.__film.actor();
    actor.setMotion('Driving_Block');
    actor.group.traverse(object => {
      if (object.userData.role === 'Story.InfectionLine') window.__draftLine = object;
    });
    if (!window.__draftLine) throw new Error('Study has no infection line');
  });
  // HOUR 5 starts after the scripted line reaches the elbow.
  const sceneSeek = time => page.evaluate(t => {
    window.__film.seek(t);
    return window.__draftLine.geometry.drawRange.count;
  }, time);
  for (const time of [1, 2.3, 3, 1.7, 2.3]) assert.equal(await sceneSeek(time), 180);
  // This separate manual reveal illustrates the earlier bite beat, not HOUR 5 continuity.
  const reveal = progress => page.evaluate(p => {
    window.__film.actor().setInfectionProgress(p);
    window.__film.seek(2.3);
    return window.__draftLine.geometry.drawRange.count;
  }, progress);
  assert.equal(await reveal(0), 0);
  assert.equal(await reveal(.5), 90);
  assert.equal(await reveal(1), 180);
  assert.equal(await reveal(.5), 90);
  const images = [];
  for (const [label, progress] of [['start', 0], ['middle', .5], ['end', 1]]) {
    await reveal(progress);
    const image = await page.screenshot();
    images.push(createHash('sha256').update(image).digest('hex'));
    await writeFile(`${output}-${label}.png`, image);
  }
  assert.equal(new Set(images).size, 3, 'growth frames must differ');
  if (process.argv[4]) {
    await mkdir(process.argv[4], {recursive: true});
    for (let i = 0; i <= 30; i++) {
      await reveal(i/30);
      await page.screenshot({path: `${process.argv[4]}/${String(i).padStart(3, '0')}.png`});
    }
  }
  assert.deepEqual(errors, []);
  console.log('LINE_GROWTH_PROBE_OK', JSON.stringify({triangleIndices: index.count, counts: [0, 90, 180], images}));
} finally {
  await browser.close();
}
