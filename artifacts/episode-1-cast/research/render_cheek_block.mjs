// Render the draft Cheek_Block in the film camera, without replacing its candidate asset.
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
const [asset, output] = process.argv.slice(2);
if (!asset || !output) throw new Error('Usage: node render_cheek_block.mjs /absolute/study.glb /absolute/output.mp4');
const start = Number(process.argv[4] ?? 21);
const frames = Number(process.argv[5] ?? 84);
if (!Number.isFinite(start) || start < 0 || !Number.isInteger(frames) || frames < 1 || start + (frames-1)/24 > 30) throw new Error('Invalid preview range');
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/home/barsaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/opt/brave.com/brave/brave', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
let encoder;
try {
  const page = await browser.newPage({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/assets/cast/candidates/ganaa/dna-v1.glb', async route => route.fulfill({status: 200, contentType: 'model/gltf-binary', body: await readFile(asset)}));
  await page.goto('http://127.0.0.1:5173/film.html?render=1&ganaa=dna-candidate');
  await page.waitForFunction(() => window.__film?.state().ready, {timeout: 60000});
  await page.evaluate(() => window.__film.actor().setMotion('Cheek_Block'));
  encoder = spawn('ffmpeg', ['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','24','-i','pipe:0','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',output], {stdio: ['pipe','ignore','pipe']});
  let log = ''; encoder.stderr.on('data', chunk => { log += chunk; });
  const done = once(encoder, 'close');
  for (let frame = 0; frame < frames; frame++) {
    await page.evaluate(time => window.__film.seek(time), start + frame/24);
    const image = await page.screenshot({type: 'jpeg', quality: 93});
    if (!encoder.stdin.write(image)) await once(encoder.stdin, 'drain');
  }
  encoder.stdin.end();
  const [code] = await done;
  if (code !== 0 || errors.length) throw new Error(`Render failed: ${log} ${errors.join('; ')}`);
  console.log(`STUDY_PREVIEW_OK ${frames} frames, 24 fps, 1280x720, silent`);
} finally {
  if (encoder && encoder.exitCode === null) encoder.kill();
  await browser.close();
}
