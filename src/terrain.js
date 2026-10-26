import { MathUtils, PlaneGeometry } from "three";

export function terrainHeight(x, z) {
  const edge = MathUtils.smoothstep(Math.hypot(x, z), 82, 138);
  const rolling = Math.sin(x * 0.045) * Math.cos(z * 0.05) * 2.4
    + Math.sin(x * 0.105 + 1.7) * 0.9 + Math.cos(z * 0.09 - 0.6) * 0.7;
  const approach = MathUtils.smoothstep(-x, 135, 210)
    * MathUtils.smoothstep(z, -12, 68) * 13;
  const avenue = (1 - MathUtils.smoothstep(Math.abs(z), 6, 15))
    * (1 - MathUtils.smoothstep(Math.abs(x), 170, 190));
  return (rolling * edge + approach) * (1 - avenue);
}

export function groundGeometry() {
  const axis = ranges => ranges.flatMap(([start, end, step]) =>
    Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step)).concat(800);
  // Fine road samples prevent the coarse valley triangles from covering the asphalt.
  const xs = axis([[-800, -240, 20], [-240, -130, 2], [-130, 150, 5], [150, 800, 20]]);
  const zs = axis([[-800, -140, 20], [-140, -20, 5], [-20, 140, 2], [140, 800, 20]]);
  const geo = new PlaneGeometry(1600, 1600, xs.length - 1, zs.length - 1);
  const positions = geo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = xs[i % xs.length];
    const z = zs[Math.floor(i / xs.length)];
    positions.setXYZ(i, x, -z, terrainHeight(x, z));
    geo.attributes.uv.setXY(i, (x + 800) / 1600, (800 - z) / 1600);
  }
  geo.computeVertexNormals();
  return geo;
}
