import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const template = fileURLToPath(new URL('./template.html', import.meta.url));

export default defineConfig({
  root,
  publicDir: false,
  resolve: {
    alias: { three: fileURLToPath(new URL('./vendor/three.module.js', import.meta.url)) },
  },
  // Keep postprocessing from bundling a second copy of the vendored Three.js.
  optimizeDeps: { exclude: ['postprocessing'] },
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
  plugins: [{
    name: 'scene-template',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(_html, context) {
        const shell = await readFile(template, 'utf8');
        const entry = context.path === '/test-style.html' ? 'main-test.js' : 'main.js';
        return shell.replace('<script src="./bundle.js"></script>',
          `<script type="module" src="/src/${entry}"></script>`);
      },
    },
    handleHotUpdate({ file, server }) {
      if (file === template) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  }],
});
