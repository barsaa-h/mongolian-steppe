import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--test')) {
  throw new Error('Usage: node scripts/build.mjs [--test]');
}
const detail = args[0] === '--test';
const marker = '<script src="./bundle.js"></script>';
let shell = await readFile(join(root, 'template.html'), 'utf8');
if (shell.split(marker).length !== 2) {
  throw new Error('template.html must contain exactly one bundle.js script tag');
}

const bundleName = detail ? 'bundle-test.js' : 'bundle.js';
await build({
  absWorkingDir: root,
  entryPoints: [detail ? 'src/main-test.js' : 'src/main.js'],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: true,
  outfile: bundleName,
  alias: { three: join(root, 'vendor/three.module.js') },
});

if (detail) {
  shell = shell
    .replace(/<title>.*?<\/title>/, '<title>Winter Sunset Camp — Character Detail Test · Mongolian Steppe Low-Poly</title>')
    .replace('Mongolian steppe · low-poly study', 'Mongolian steppe · character detail test')
    .replace(/<div class="hint">.*?<\/div>/, '<div class="hint">Detail pass · 60-second camp story · Drag to orbit</div>');
}
const bundle = (await readFile(join(root, bundleName), 'utf8')).replace(/<\/script/gi, '<\\/script');
const html = shell.replace(marker, () => `<script>\n${bundle}\n</script>`);
if (detail) {
  await writeFile(join(root, 'test-style.html'), html);
  console.log('Built bundle-test.js and test-style.html');
} else {
  await writeFile(join(root, 'index.html'), html);
  await writeFile(join(root, 'winter-sunset-camp.html'), html);
  const dev = '<script type="importmap">\n' +
    '  {"imports":{"three":"./vendor/three.module.js","postprocessing":"./node_modules/postprocessing/build/index.js"}}\n' +
    '</script>\n<script type="module" src="./src/main.js"></script>';
  await writeFile(join(root, 'dev.html'), shell.replace(marker, () => dev));
  console.log('Built bundle.js, index.html, winter-sunset-camp.html, and dev.html');
}
