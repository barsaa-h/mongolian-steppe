// Deterministic stills (or a 1080p24 pass) of the stylized cue scene.
//   node episodes/EP01/threejs/src/stylized/render-stylized.mjs --gpu --stills
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, stat, readdir } from 'node:fs/promises';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../..');
const gpu = process.argv.includes('--gpu');
const stillsOnly = process.argv.includes('--stills');
const errors = [];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const out = resolve(here, '../../out/stylized');
const compare = resolve(here, '../../compare/stylized');
await mkdir(out, { recursive: true });
await mkdir(compare, { recursive: true });

let executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
if (!executablePath) {
  try { await stat(chromium.executablePath()); } catch {
    const cache = resolve(process.env.HOME, '.cache/ms-playwright');
    const names = (await readdir(cache)).filter(name => name.startsWith('chromium_headless_shell-')).sort().reverse();
    for (const name of names) {
      const candidate = resolve(cache, name, 'chrome-headless-shell-linux64/chrome-headless-shell');
      try { await stat(candidate); executablePath = candidate; break; } catch { /* keep looking */ }
    }
  }
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', ...(gpu
    ? ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist']
    : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])],
});

try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.route('http://b23.test/**', async route => {
    try {
      const path = resolve(root, `.${decodeURIComponent(new URL(route.request().url()).pathname)}`);
      if (!path.startsWith(root + sep)) throw new Error('Outside project');
      await route.fulfill({ status: 200, contentType: types[extname(path)] || 'application/octet-stream', body: await readFile(path) });
    } catch {
      await route.fulfill({ status: 404, body: 'Not found' });
    }
  });
  page.on('pageerror', error => { errors.push(error.message); console.error('PAGE_ERROR', error.message); });
  page.on('console', message => { if (message.type() === 'error') { errors.push(message.text()); console.error(message.text()); } });
  const t0 = performance.now();
  await page.goto('http://b23.test/episodes/EP01/threejs/demo.html?capture');
  await page.waitForFunction(() => window.ready, null, { timeout: 180000 });
  const info = await page.evaluate(() => window.stylized.diagnostics());
  console.log(JSON.stringify(info));
  if (gpu && /swiftshader|llvmpipe/i.test(info.renderer)) throw new Error(`GPU pass fell back to software: ${info.renderer}`);
  const grab = async (index, file) => {
    await page.evaluate(i => window.stylized.frame(i), index);
    await writeFile(file, Buffer.from(await page.evaluate(() => window.stylized.png()), 'base64'));
  };
  if (stillsOnly) {
    const times = info.stills || [0.4, 2.2, 3.4, 4.8, 6.4, 9.6];
    const files = [];
    for (const time of times) {
      const file = resolve(compare, `t${Number(time).toFixed(1)}.png`);
      await grab(Math.round(time * info.fps), file);
      files.push(file);
      console.log('STILL', time, file);
    }
    const sheet = spawnSync('ffmpeg', ['-y', '-v', 'error', ...files.flatMap(file => ['-i', file]), '-filter_complex', `${files.map((_, index) => `[${index}]scale=640:360[s${index}]`).join(';')};${files.map((_, index) => `[s${index}]`).join('')}hstack=inputs=${files.length}`, resolve(compare, 'contact_sheet.png')], { encoding: 'utf8' });
    if (sheet.status !== 0) console.error(sheet.stderr || 'ffmpeg contact sheet failed');
  } else {
    const frames = resolve(out, 'frames');
    await mkdir(frames, { recursive: true });
    for (let index = 0; index < info.totalFrames; index++) {
      await grab(index, resolve(frames, `${String(index).padStart(4, '0')}.png`));
      if (index % 48 === 0) console.log(`FRAME ${index}/${info.totalFrames}`);
    }
    const dest = resolve(compare, 'stylized_demo_12s.mp4');
    const encoded = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '24', '-i', resolve(frames, '%04d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest], { encoding: 'utf8' });
    assert.equal(encoded.status, 0, encoded.stderr);
    console.log('VIDEO_OK', dest);
  }
  assert.deepEqual(errors, []);
  console.log(`DONE in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
} finally {
  await browser.close();
}
