import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));

test('builds portable HTML and keeps the detail variant separate', async (t) => {
  const fixture = await mkdtemp(join(tmpdir(), 'steppe build '));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  await mkdir(join(fixture, 'scripts'));
  await mkdir(join(fixture, 'src'));
  await cp(join(root, 'scripts/build.mjs'), join(fixture, 'scripts/build.mjs'));
  await cp(join(root, 'template.html'), join(fixture, 'template.html'));
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'junction');
  await writeFile(join(fixture, 'src/herder.js'), 'export const version = "main";');
  await writeFile(join(fixture, 'src/main.js'),
    'import { version } from "./herder.js"; globalThis.version = version; globalThis.tag = "</script>";');
  await writeFile(join(fixture, 'src/main-test.js'), 'globalThis.version = "detail";');

  const build = (...args) => execFileSync(process.execPath,
    [join(fixture, 'scripts/build.mjs'), ...args],
    { cwd: tmpdir(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  build();
  const html = await readFile(join(fixture, 'index.html'), 'utf8');
  assert.equal(await readFile(join(fixture, 'winter-sunset-camp.html'), 'utf8'), html);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  const sandbox = {};
  runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], sandbox);
  assert.equal(sandbox.version, 'main');
  assert.equal(sandbox.tag, '</script>');
  const dev = await readFile(join(fixture, 'dev.html'), 'utf8');
  assert.match(dev, /type="module" src="\.\/src\/main\.js"/);
  assert.match(dev, /type="importmap"/);

  build('--test');
  const detail = await readFile(join(fixture, 'test-style.html'), 'utf8');
  assert.match(detail, /character detail test/);
  runInNewContext(detail.match(/<script>([\s\S]*?)<\/script>/)[1], sandbox);
  assert.equal(sandbox.version, 'detail');
  assert.equal(await readFile(join(fixture, 'index.html'), 'utf8'), html);

  await writeFile(join(fixture, 'template.html'), '<html>Missing entry point</html>');
  assert.throws(() => build(), /template\.html.*script/);
  assert.equal(await readFile(join(fixture, 'index.html'), 'utf8'), html);
});
