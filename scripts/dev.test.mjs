import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

test('development serves source and shares one Three.js module with postprocessing', async (t) => {
  const server = await createServer({
    configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
    server: { port: 0, strictPort: false },
    logLevel: 'silent',
  });
  t.after(() => server.close());
  await server.listen();
  const base = server.resolvedUrls.local[0];
  const html = await (await fetch(base)).text();
  assert.match(html, /src="\/src\/main.js"/);
  assert.match(html, /@vite\/client/);
  const main = await (await fetch(new URL('/src/main.js', base))).text();
  const effectUrl = main.match(/from "([^"]*postprocessing[^"]*)"/)[1];
  const effects = await (await fetch(new URL(effectUrl, base))).text();
  assert.match(effects, /from "\/vendor\/three.module.js"/);
  const detail = await (await fetch(new URL('/test-style.html', base))).text();
  assert.match(detail, /src="\/src\/main-test.js"/);
});
