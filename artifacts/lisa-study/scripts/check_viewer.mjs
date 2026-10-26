import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(process.env.STUDY_URL || 'http://127.0.0.1:5180/artifacts/lisa-study/');
  await page.waitForFunction(() => window.__lisaStudy?.getState().loaded, { timeout: 60000 });
  await page.screenshot({ path: `${out}browser-comparison.png` });
  const report = await page.evaluate(async () => {
    const THREE = await import('three');
    const study = window.__lisaStudy;
    const results = [];
    for (const [index, subject] of study.subjects.entries()) {
      const meshes = [];
      subject.root.traverse(object => { if (object.isSkinnedMesh) meshes.push(object); });
      const skeletons = meshes.map(mesh => mesh.skeleton.bones.length);
      const triangles = meshes.reduce((sum, mesh) => sum + (mesh.geometry.index?.count || mesh.geometry.attributes.position.count) / 3, 0);
      const invalidWeights = meshes.reduce((sum, mesh) => {
        const weights = mesh.geometry.attributes.skinWeight;
        let invalid = 0;
        for (let vertex = 0; vertex < weights.count; vertex++) {
          const total = weights.getX(vertex) + weights.getY(vertex) + weights.getZ(vertex) + weights.getW(vertex);
          if (!Number.isFinite(total) || Math.abs(total - 1) > .0001) invalid++;
        }
        return sum + invalid;
      }, 0);
      results.push({ index, skeletons, triangles, invalidWeights, clips: subject.clips.map(clip => ({ name: clip.name, duration: clip.duration })), samples: [] });
    }
    for (let clip = 0; clip < 18; clip++) {
      study.selectClip(clip);
      for (const phase of [0, .25, .5, .9]) {
        study.pose(study.getState().duration * phase);
        study.subjects.forEach((subject, index) => {
          subject.root.updateMatrixWorld(true);
          const box = new THREE.Box3();
          subject.root.traverse(mesh => {
            if (!mesh.isSkinnedMesh) return;
            mesh.skeleton.update();
            for (let vertex = 0; vertex < mesh.geometry.attributes.position.count; vertex++) {
              const point = mesh.getVertexPosition(vertex, new THREE.Vector3()).applyMatrix4(mesh.matrixWorld);
              if (![point.x, point.y, point.z].every(Number.isFinite)) throw new Error(`Invalid deformed vertex, clip ${clip}`);
              box.expandByPoint(point);
            }
          });
          results[index].samples.push({ clip, phase, min: box.min.toArray(), max: box.max.toArray(), size: box.getSize(new THREE.Vector3()).toArray() });
        });
      }
    }
    study.selectClip(-1);
    study.frame('face');
    const heads = study.subjects.map(subject => {
      let point;
      subject.root.traverse(object => {
        if (object.isBone && object.name === '2') point = object.getWorldPosition(new THREE.Vector3()).toArray();
      });
      return point;
    });
    if (!heads.every(Boolean) || new THREE.Vector3(...heads[0]).distanceTo(new THREE.Vector3(...heads[1])) > .05) throw new Error('Rest-pose head positions do not match');
    return results;
  });
  for (const [index, subject] of report.entries()) {
    assert.equal(subject.clips.length, 18);
    assert.ok(subject.skeletons.every(count => count === 21));
    assert.equal(subject.invalidWeights, 0);
    assert.equal(subject.triangles, index ? 4896 : 816);
    assert.equal(subject.samples.length, 72);
    for (const sample of subject.samples) {
      assert.ok(sample.size.every(value => value > 0 && value < 5), `Unreasonable deformed bounds for model ${index}, clip ${sample.clip}`);
    }
  }
  for (let clip = 0; clip < 18; clip++) {
    assert.ok(Math.abs(report[0].clips[clip].duration - report[1].clips[clip].duration) < .045, `Clip ${clip} duration changed`);
  }
  await page.screenshot({ path: `${out}browser-faces.png` });
  await page.locator('#solo').click();
  assert.equal(await page.evaluate(() => window.__lisaStudy.getState().compare), false);
  await page.locator('#clip').selectOption('1');
  await page.locator('#play').click();
  await page.waitForFunction(() => window.__lisaStudy.getState().time > .08);
  await page.locator('#play').click();
  await page.locator('#time').fill('0.2');
  assert.equal(await page.evaluate(() => window.__lisaStudy.getState().playing), false);
  await page.locator('#clip').selectOption('-1');
  await page.locator('#lighting').selectOption('corridor');
  await page.locator('#pixels').check();
  await page.screenshot({ path: `${out}browser-corridor.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: `${out}browser-mobile.png`, fullPage: true });
  assert.deepEqual(errors, []);
  await writeFile(`${out}browser-report.json`, JSON.stringify({ subjects: report, errors, comparisons: true, playback: true, scrub: true, lowResolution: true, mobile: true }, null, 2) + '\n');
  console.log('Verified: two skinned models, 18 clips each, 144 deformation samples, playback/scrub, comparison, low-resolution view, mobile layout.');
} finally {
  await browser.close();
}
