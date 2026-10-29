// Export a scene set's static geometry as base64 GLB, straight from the live
// three.js scene graph (before any authored override). Writes:
//   assets/maps/glb/base/<scene>.glb        — the exportable static subtree
//   output/maps/<scene>-base.png            — reference frame for texture work
// Usage: SCENE_ID=ep7-boilerhouse node scripts/export-map-glb.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright-core");
import { mkdir, writeFile } from "node:fs/promises";

const SCENE_ID = process.env.SCENE_ID || "ep7-boilerhouse";
await mkdir("assets/maps/glb/base", { recursive: true });
await mkdir("output/maps", { recursive: true });

const browser = await chromium.launch({ headless: true, args: [
  "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:5173/film.html?scene=${SCENE_ID}`);
  await page.waitForFunction(() => window.__film?.state().ready, { timeout: 60000 });
  await page.waitForTimeout(1000);
  if (errors.length) throw new Error(errors.join("\n"));

  const stats = await page.evaluate(async () => {
    const pieces = window.__mapExport.collectExportable();
    let meshes = 0;
    for (const object of pieces) {
      object.traverse(child => { if (child.isMesh) meshes += 1; });
    }
    const base64 = await window.__mapExport.exportGLBBase64(pieces);
    return { base64, roots: pieces.length, meshes };
  });

  const glb = Buffer.from(stats.base64, "base64");
  await writeFile(`assets/maps/glb/base/${SCENE_ID}.glb`, glb);
  await page.screenshot({ path: `output/maps/${SCENE_ID}-base.png` });
  console.log(`Exported ${SCENE_ID}: ${stats.roots} roots, ${stats.meshes} meshes, ${(glb.length / 1024).toFixed(0)} KB -> assets/maps/glb/base/${SCENE_ID}.glb`);
  if (errors.length) throw new Error(errors.join("\n"));
} finally {
  await browser.close();
}
