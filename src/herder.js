import * as THREE from 'three';

const TAU = Math.PI * 2;
const DOWN = new THREE.Vector3(0, -1, 0);
const TONES = [1.0, 0.94, 1.04];

const MAT = new THREE.MeshStandardMaterial({
  vertexColors: true,
  flatShading: true,
  roughness: 0.9,
  metalness: 0.0,
  emissive: new THREE.Color(0x2a1a30),
  emissiveIntensity: 0.14
});
const MAT_DOUBLE = MAT.clone();
MAT_DOUBLE.side = THREE.DoubleSide;

const solidMats = new Map();
const basicMats = new Map();

function toHex(value) {
  if (value instanceof THREE.Color) return `#${value.getHexString()}`;
  return value;
}

function shadeHex(hex, light, sat = 0) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, sat, light);
  return `#${c.getHexString()}`;
}

function solidMesh(geometry, hex, opts = {}) {
  const key = `${toHex(hex)}|${opts.basic ? 'b' : 's'}`;
  let material;
  if (opts.basic) {
    if (!basicMats.has(key)) {
      basicMats.set(key, new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), toneMapped: false }));
    }
    material = basicMats.get(key);
  } else {
    if (!solidMats.has(key)) {
      solidMats.set(key, new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        flatShading: true,
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x24162a),
        emissiveIntensity: 0.1
      }));
    }
    material = solidMats.get(key);
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = opts.cast ?? false;
  mesh.receiveShadow = opts.receive ?? false;
  return mesh;
}

class FacetBuilder {
  constructor() {
    this.position = [];
    this.color = [];
  }

  tri(a, b, c, hex, tone = 1) {
    const col = new THREE.Color(hex).multiplyScalar(tone);
    for (const p of [a, b, c]) {
      this.position.push(p.x, p.y, p.z);
      this.color.push(col.r, col.g, col.b);
    }
  }

  quad(a, b, c, d, hex, tone = 1) {
    this.tri(a, b, c, hex, tone);
    this.tri(a, c, d, hex, tone);
  }

  splitQuad(a, b, c, d, hexA, hexB, toneA = 1, toneB = 1) {
    this.tri(a, b, c, hexA, toneA);
    this.tri(a, c, d, hexB, toneB);
  }

  box(center, size, hex, tone = 1, rotation) {
    const hx = size.x * 0.5, hy = size.y * 0.5, hz = size.z * 0.5;
    const local = [
      new THREE.Vector3(-hx, -hy, -hz), new THREE.Vector3(hx, -hy, -hz),
      new THREE.Vector3(hx, hy, -hz), new THREE.Vector3(-hx, hy, -hz),
      new THREE.Vector3(-hx, -hy, hz), new THREE.Vector3(hx, -hy, hz),
      new THREE.Vector3(hx, hy, hz), new THREE.Vector3(-hx, hy, hz)
    ];
    if (rotation) {
      const q = rotation instanceof THREE.Quaternion ? rotation : new THREE.Quaternion().setFromEuler(rotation);
      local.forEach(p => p.applyQuaternion(q));
    }
    local.forEach(p => p.add(center));
    const faces = [
      [0, 1, 2, 3], [5, 4, 7, 6], [4, 5, 1, 0], [3, 2, 6, 7], [4, 0, 3, 7], [1, 5, 6, 2]
    ];
    for (const [a, b, c, d] of faces) this.quad(local[a], local[b], local[c], local[d], hex, tone);
  }

  build() {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(this.position, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(this.color, 3));
    geo.computeVertexNormals();
    return geo;
  }
}

function facetMesh(builder, opts = {}) {
  const mesh = new THREE.Mesh(builder.build(), opts.doubleSide ? MAT_DOUBLE : MAT);
  mesh.castShadow = opts.cast ?? true;
  mesh.receiveShadow = opts.receive ?? true;
  return mesh;
}

function ringPoint(rows, row, side, sides, fold = 0) {
  const r = rows[row];
  const angle = TAU * (side % sides) / sides;
  const f = fold * Math.sin(side * 2.37 + row * 1.76);
  const y = r.y + (row > 0 && row < rows.length - 1 ? fold * Math.sin(side * 1.7 + row * 3.1) : 0);
  return new THREE.Vector3(
    Math.sin(angle) * (r.rx + f),
    y,
    Math.cos(angle) * (r.rz + f * 0.7) + (r.z || 0)
  );
}

function patchHash(seed) {
  const value = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return value - Math.floor(value);
}

function addLoft(builder, rows, sides, cfg, opts = {}) {
  const pattern = !!opts.pattern;
  const coat = opts.coat || cfg.coat;
  const accent = opts.accent || cfg.accent;
  const fold = opts.fold ?? 0.008;
  for (let r = 0; r < rows.length - 1; r++) {
    for (let s = 0; s < sides; s++) {
      const a = ringPoint(rows, r, s, sides, fold);
      const b = ringPoint(rows, r, s + 1, sides, fold);
      const c = ringPoint(rows, r + 1, s + 1, sides, fold);
      const d = ringPoint(rows, r + 1, s, sides, fold);
      const t1 = TONES[(r * 7 + s * 3) % 3];
      const t2 = TONES[(r * 7 + s * 3 + 1) % 3];
      // Two-tone triangulation: each quad gets one navy and one ochre
      // triangle, with the diagonal orientation mixed so it reads as the
      // Dorjoo facet pattern rather than a printed chevron.
      const flip = pattern && patchHash(r * 31 + s * 17 + 5) < 0.5;
      builder.tri(a, b, c, flip ? accent : coat, t1);
      builder.tri(a, c, d, flip ? coat : accent, t2);
    }
  }
}

// A Greek-key style meander band. The trim is the background; the dark
// notches are painted as raised quads so the pattern is real face colours.
function addMeanderBand(builder, sides, y0, y1, rx0, rz0, rx1, rz1, trim, notchHex, opts = {}) {
  const z0 = opts.z0 || 0;
  const cols = opts.cols || 5;
  const rows = 3;
  const stamp = [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1]
  ];
  const baseRows = [
    { y: y0, rx: rx0, rz: rz0, z: z0 },
    { y: y1, rx: rx1, rz: rz1, z: z0 }
  ];
  addBand(builder, baseRows, sides, trim, { tone: 1.0 });
  const lift = opts.lift ?? 1.006;
  const point = (ringU, colU, rowU) => {
    const ang = TAU * (ringU + colU / cols) / sides;
    const rx = (rx0 + (rx1 - rx0) * rowU) * lift;
    const rz = (rz0 + (rz1 - rz0) * rowU) * lift;
    return new THREE.Vector3(Math.sin(ang) * rx, y0 + (y1 - y0) * rowU, Math.cos(ang) * rz + z0);
  };
  for (let s = 0; s < sides; s++) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!stamp[r][c]) continue;
        const r0 = r / rows, r1 = (r + 1) / rows;
        const a = point(s, c, r0);
        const b = point(s, c + 1, r0);
        const cc = point(s, c + 1, r1);
        const d = point(s, c, r1);
        builder.quad(a, b, cc, d, notchHex, 1.0);
      }
    }
  }
  // Thin dark edges frame the band.
  const edge = (y) => {
    const e = [
      { y: y - 0.002, rx: rx0 * lift, rz: rz0 * lift, z: z0 },
      { y: y + 0.002, rx: rx0 * lift, rz: rz0 * lift, z: z0 }
    ];
    addBand(builder, e, sides, notchHex, { tone: 1.0 });
  };
  edge(y0);
  edge(y1);
}

function densifyRows(rows, perSpan = 2) {
  const out = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const low = rows[i], high = rows[i + 1];
    for (let k = 0; k < perSpan; k++) {
      const t = k / perSpan;
      out.push({
        y: low.y + (high.y - low.y) * t,
        rx: low.rx + (high.rx - low.rx) * t,
        rz: low.rz + (high.rz - low.rz) * t,
        z: (low.z || 0) + ((high.z || 0) - (low.z || 0)) * t
      });
    }
  }
  out.push(rows[rows.length - 1]);
  return out;
}

function addBand(builder, rows, sides, hex, opts = {}) {
  const tone = opts.tone ?? 1;
  const fold = opts.fold ?? 0;
  for (let r = 0; r < rows.length - 1; r++) {
    for (let s = 0; s < sides; s++) {
      const a = ringPoint(rows, r, s, sides, fold);
      const b = ringPoint(rows, r, s + 1, sides, fold);
      const c = ringPoint(rows, r + 1, s + 1, sides, fold);
      const d = ringPoint(rows, r + 1, s, sides, fold);
      builder.quad(a, b, c, d, hex, tone * TONES[(r + s) % 3]);
    }
  }
}

function addFurBand(parent, radius, y, height, color, opts = {}) {
  const b = new FacetBuilder();
  const sides = opts.sides ?? 12;
  const depth = opts.depth ?? 0.012;
  const rows = [
    { y: y, rx: radius - 0.006, rz: radius - 0.006 },
    { y: y + height * 0.18, rx: radius + depth * 0.55, rz: radius + depth * 0.55 },
    { y: y + height * 0.52, rx: radius + depth, rz: radius + depth },
    { y: y + height * 0.82, rx: radius + depth * 0.65, rz: radius + depth * 0.65 },
    { y: y + height, rx: radius - 0.004, rz: radius - 0.004 }
  ];
  addBand(b, rows, sides, color, { fold: 0.008, tone: 1 });
  const seam = opts.seam;
  if (seam) {
    const tuftRadius = opts.tuftRadius ?? radius * 0.095;
    const tuftHeight = opts.tuftHeight ?? height * 0.52;
    for (let i = 0; i < sides; i++) {
      const a = TAU * i / sides;
      const tuft = solidMesh(
        new THREE.ConeGeometry(tuftRadius, tuftHeight, 3),
        shadeHex(color, i % 2 ? 0.04 : -0.04),
        { cast: false }
      );
      tuft.position.set(Math.sin(a) * (radius + depth * 0.8), y + height * 0.45, Math.cos(a) * (radius + depth * 0.8));
      tuft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(Math.sin(a) * 0.7, 0.55, Math.cos(a) * 0.7).normalize());
      parent.add(tuft);
    }
  }
  parent.add(facetMesh(b, { cast: opts.cast ?? true, receive: true }));
}

function addRingTrim(builder, radiusAt, y, height, sides, hex, tone = 1) {
  const rows = [
    { y, rx: radiusAt, rz: radiusAt * 0.9 },
    { y: y + height, rx: radiusAt, rz: radiusAt * 0.9 }
  ];
  addBand(builder, rows, sides, hex, { tone });
}

function addBoxRing(builder, radius, y, sides, width, height, depth, hex, tone = 1) {
  for (let i = 0; i < sides; i++) {
    const a = TAU * i / sides;
    const tangent = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    builder.box(
      new THREE.Vector3(Math.sin(a) * radius, y, Math.cos(a) * radius),
      new THREE.Vector3(depth, height, width),
      hex, tone, q
    );
  }
}

function frontPoint(rows, x, y, offset = 0.006) {
  let lo = rows[0], hi = rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    if (y >= rows[i].y && y <= rows[i + 1].y) {
      lo = rows[i];
      hi = rows[i + 1];
      break;
    }
  }
  const t = hi.y === lo.y ? 0 : (y - lo.y) / (hi.y - lo.y);
  const rx = lo.rx + (hi.rx - lo.rx) * t;
  const rz = lo.rz + (hi.rz - lo.rz) * t;
  const z0 = lo.z || 0;
  const z = z0 + rz * Math.sqrt(Math.max(0, 1 - Math.min(1, (x / Math.max(0.0001, rx)) ** 2)));
  return new THREE.Vector3(x, y, z + offset);
}

function addChestWrap(builder, rows, cfg) {
  const cloth = cfg.coat;
  const trim = cfg.trim;
  const accent = cfg.accent;
  const path = [
    new THREE.Vector2(-0.060, 0.455),
    new THREE.Vector2(0.000, 0.360),
    new THREE.Vector2(0.055, 0.265),
    new THREE.Vector2(0.108, 0.160)
  ];
  const width = 0.072;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const d = new THREE.Vector2(b.x - a.x, b.y - a.y).normalize();
    const n = new THREE.Vector2(-d.y, d.x).multiplyScalar(width * 0.5);
    const p = [
      new THREE.Vector2(a.x + n.x, a.y + n.y),
      new THREE.Vector2(b.x + n.x, b.y + n.y),
      new THREE.Vector2(b.x - n.x, b.y - n.y),
      new THREE.Vector2(a.x - n.x, a.y - n.y)
    ];
    const q = p.map(v => frontPoint(rows, v.x, v.y, 0.006));
    builder.quad(q[0], q[1], q[2], q[3], cloth, 1.04);
  }
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const d = new THREE.Vector2(b.x - a.x, b.y - a.y).normalize();
    const n = new THREE.Vector2(-d.y, d.x).multiplyScalar(width * 0.54);
    const p = [a, b].map(v => frontPoint(rows, v.x + n.x, v.y + n.y, 0.009));
    const q = [b, a].map(v => frontPoint(rows, v.x + n.x * 0.88, v.y + n.y * 0.88, 0.009));
    builder.quad(p[0], p[1], q[1], q[0], trim, 1.0);
  }
  // Two short meander tabs on the chest, echoing the Dorjoo trim.
  for (const yy of [0.335, 0.275]) {
    for (let i = 0; i < 3; i++) {
      const x0 = 0.005 + i * 0.017;
      const a = frontPoint(rows, x0, yy, 0.010);
      const b = frontPoint(rows, x0 + 0.009, yy + 0.006, 0.010);
      const c = frontPoint(rows, x0 + 0.009, yy + 0.020, 0.010);
      const d = frontPoint(rows, x0, yy + 0.014, 0.010);
      builder.quad(a, b, c, d, trim, 1.0);
    }
  }
}

function buildTorso(upper, cfg) {
  const rows = [
    { y: 0.00, rx: 0.176, rz: 0.130 },
    { y: 0.06, rx: 0.184, rz: 0.137 },
    { y: 0.15, rx: 0.166, rz: 0.128 },
    { y: 0.24, rx: 0.192, rz: 0.143 },
    { y: 0.36, rx: 0.220, rz: 0.160 },
    { y: 0.47, rx: 0.226, rz: 0.166 },
    { y: 0.52, rx: 0.158, rz: 0.122 },
    { y: 0.56, rx: 0.094, rz: 0.086 }
  ];
  const b = new FacetBuilder();
  addLoft(b, rows, 16, cfg, { pattern: !!cfg.pattern, fold: 0.006 });
  addChestWrap(b, rows, cfg);
  upper.add(facetMesh(b, { cast: true, receive: true }));

  for (const side of [-1, 1]) {
    const cap = solidMesh(new THREE.IcosahedronGeometry(0.060, 0), cfg.coat, { cast: true });
    cap.scale.set(1.0, 0.72, 0.9);
    cap.position.set(side * 0.210, 0.465, 0);
    upper.add(cap);
  }

  const trimB = new FacetBuilder();
  addRingTrim(trimB, 0.182, 0.010, 0.010, 14, cfg.trim, 0.96);
  addRingTrim(trimB, 0.181, 0.162, 0.008, 14, cfg.trim, 0.96);
  upper.add(facetMesh(trimB, { cast: false, receive: true }));

  const sashB = new FacetBuilder();
  addBand(sashB, [
    { y: 0.075, rx: 0.187, rz: 0.139 },
    { y: 0.105, rx: 0.198, rz: 0.147 },
    { y: 0.155, rx: 0.192, rz: 0.144 }
  ], 14, cfg.accent, { tone: 1.0, fold: 0.004 });
  upper.add(facetMesh(sashB, { cast: true, receive: true }));

  const beltB = new FacetBuilder();
  beltB.box(new THREE.Vector3(0, 0.118, 0.198), new THREE.Vector3(0.070, 0.048, 0.014), '#C9A45E', 1.0);
  beltB.box(new THREE.Vector3(0, 0.118, 0.207), new THREE.Vector3(0.038, 0.024, 0.008), '#4A3322', 1.0);
  upper.add(facetMesh(beltB, { cast: false, receive: true }));

  const collarB = new FacetBuilder();
  addBand(collarB, [
    { y: 0.505, rx: 0.105, rz: 0.095 },
    { y: 0.535, rx: 0.120, rz: 0.104 },
    { y: 0.570, rx: 0.098, rz: 0.087 }
  ], 12, shadeHex(cfg.coat, 0.05), { tone: 1.0 });
  addRingTrim(collarB, 0.1215, 0.505, 0.010, 12, cfg.trim, 1.0);
  addMeanderBand(collarB, 12, 0.518, 0.558, 0.116, 0.101, 0.103, 0.091, cfg.trim, cfg.coat);
  upper.add(facetMesh(collarB, { cast: true, receive: true }));

  const pouch = solidMesh(new THREE.IcosahedronGeometry(0.045, 0), '#5B4633', { cast: false });
  pouch.scale.set(0.8, 1.05, 0.5);
  pouch.position.set(0.15, 0.085, 0.115);
  pouch.rotation.z = 0.2;
  upper.add(pouch);
  const pouchFlap = solidMesh(new THREE.BoxGeometry(0.072, 0.022, 0.04), '#3F3126', { cast: false });
  pouchFlap.position.set(0.148, 0.118, 0.122);
  pouchFlap.rotation.z = 0.16;
  upper.add(pouchFlap);

  const neck = solidMesh(new THREE.CylinderGeometry(0.056, 0.065, 0.13, 8), cfg.skin, { cast: true });
  neck.position.y = 0.575;
  upper.add(neck);

  return rows;
}

function addSashTail(upper, cfg) {
  const group = new THREE.Group();
  group.position.set(-0.105, 0.11, 0.145);
  const b = new FacetBuilder();
  const rows = [
    { y: 0.00, x0: -0.038, x1: 0.038, z: 0.002 },
    { y: -0.10, x0: -0.044, x1: 0.044, z: 0.020 },
    { y: -0.24, x0: -0.030, x1: 0.030, z: 0.042 }
  ];
  for (let r = 0; r < rows.length - 1; r++) {
    const a = rows[r], b2 = rows[r + 1];
    for (let c = 0; c < 2; c++) {
      const xa = c ? a.x1 : a.x0, xb = c ? b2.x1 : b2.x0;
      const p0 = new THREE.Vector3(xa, a.y, a.z);
      const p1 = new THREE.Vector3(c ? b2.x1 : b2.x0, b2.y, b2.z);
      const p2 = new THREE.Vector3(b2.x1, b2.y, b2.z);
      const p3 = new THREE.Vector3(a.x1, a.y, a.z);
      b.splitQuad(p0, p1, p2, p3, cfg.accent, cfg.trim, TONES[(r + c) % 3], 1.0);
    }
  }
  group.add(facetMesh(b, { doubleSide: true, cast: false, receive: true }));
  upper.add(group);
  return group;
}

function buildInnerSkirt(upper, cfg) {
  const rows = [
    { y: 0.02, rx: 0.176, rz: 0.130 },
    { y: -0.14, rx: 0.193, rz: 0.144 },
    { y: -0.30, rx: 0.220, rz: 0.173 },
    { y: -0.44, rx: 0.246, rz: 0.201 },
    { y: -0.50, rx: 0.256, rz: 0.211 }
  ];
  const b = new FacetBuilder();
  addLoft(b, rows, 16, cfg, { pattern: false, fold: 0.005 });
  upper.add(facetMesh(b, { doubleSide: true, cast: true, receive: true }));

  const trimB = new FacetBuilder();
  addMeanderBand(trimB, 16, -0.492, -0.436, 0.2545, 0.2095, 0.2485, 0.2035, cfg.trim, cfg.coat);
  upper.add(facetMesh(trimB, { doubleSide: true, cast: false, receive: true }));
}

function buildRobePanels(upper, cfg) {
  const panels = [];
  const count = 12;
  const sector = TAU / count;
  const length = 0.50;
  for (let i = 0; i < count; i++) {
    const center = sector * i;
    const half = sector * 0.80;
    const angleScale = Math.abs(Math.cos(center));
    const panelLength = 0.49 + angleScale * 0.035;
    const b = new FacetBuilder();
    const rows = 5;
    const cols = 3;
    const grid = [];
    for (let r = 0; r <= rows; r++) {
      const y = -panelLength * (r / rows);
      const radius = 0.178 + (r / rows) * 0.080;
      const row = [];
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        const angle = center - half + half * 2 * u;
        const fold = 0.006 * Math.sin((i * 2.3 + r * 1.7 + c * 1.2));
        row.push(new THREE.Vector3(
          Math.sin(angle) * (radius + fold),
          y,
          Math.cos(angle) * (radius + fold)
        ));
      }
      grid.push(row);
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = grid[r][c], bb = grid[r][c + 1], cc = grid[r + 1][c + 1], d = grid[r + 1][c];
        const tone = TONES[(i + r + c) % 3];
        const tone2 = TONES[(i + r + c + 1) % 3];
        const flip = cfg.pattern && patchHash(i * 101 + r * 17 + c * 5) < 0.5;
        b.tri(a, bb, cc, flip ? cfg.accent : cfg.coat, tone);
        b.tri(a, cc, d, flip ? cfg.coat : cfg.accent, tone2);
      }
    }
    // Hem band with a painted meander instead of a plain gold strip.
    const stamp = [
      [1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1, 0],
      [1, 1, 0, 1, 1, 1]
    ];
    const subCols = cols * 2;
    const subRows = 3;
    const hemTop = grid[rows - 1];
    const hemBot = grid[rows];
    const mix = (u, v) => {
      const x0 = hemTop[Math.min(cols - 1, Math.floor(u * cols))];
      const x1 = hemTop[Math.min(cols, Math.floor(u * cols) + 1)];
      const y0 = hemBot[Math.min(cols - 1, Math.floor(u * cols))];
      const y1 = hemBot[Math.min(cols, Math.floor(u * cols) + 1)];
      const col = u * cols - Math.floor(u * cols);
      const top = x0.clone().lerp(x1, col);
      const bot = y0.clone().lerp(y1, col);
      return top.lerp(bot, v);
    };
    for (let c = 0; c < subCols; c++) {
      for (let r = 0; r < subRows; r++) {
        const u0 = c / subCols, u1 = (c + 1) / subCols;
        const v0 = r / subRows, v1 = (r + 1) / subRows;
        const a = mix(u0, v0), bb = mix(u1, v0);
        const cc = mix(u1, v1), d = mix(u0, v1);
        b.quad(a, bb, cc, d, cfg.trim, 0.98);
        if (stamp[r][c % 6]) {
          const out = 0.0035;
          const ao = a.clone(); ao.z += out;
          const bo = bb.clone(); bo.z += out;
          const co = cc.clone(); co.z += out;
          const dO = d.clone(); dO.z += out;
          b.quad(ao, bo, co, dO, cfg.coat, 1.0);
        }
      }
    }
    const mesh = facetMesh(b, { doubleSide: true, cast: true, receive: true });
    const group = new THREE.Group();
    group.userData.angle = center;
    group.add(mesh);
    upper.add(group);
    panels.push(group);
  }
  return panels;
}

// A jaw-hugging beard mass. The reference beard is a broad faceted wedge
// that follows the jawline, not a cone hanging off the chin.
function addJawBeard(head, color, light, opts = {}) {
  const cols = opts.cols ?? 9;
  const rows = opts.rows ?? 4;
  const topY = opts.topY ?? -0.086;
  const sideRise = opts.sideRise ?? 0.064;
  const length = opts.length ?? 0.100;
  const grid = [];
  for (let c = 0; c <= cols; c++) {
    const a = (-1 + 2 * c / cols) * 1.34;
    const column = [];
    for (let r = 0; r <= rows; r++) {
      const t = r / rows;
      const rx = 0.098 - 0.040 * t;
      const rz = 0.090 - 0.032 * t;
      const y = topY + sideRise * Math.pow(Math.abs(Math.sin(a)), 1.25)
        - length * t * (0.70 + 0.30 * Math.cos(a));
      column.push(new THREE.Vector3(Math.sin(a) * rx, y, Math.cos(a) * rz + 0.008));
    }
    grid.push(column);
  }
  const b = new FacetBuilder();
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const a = grid[c][r], bb = grid[c + 1][r];
      const cc = grid[c + 1][r + 1], d = grid[c][r + 1];
      b.splitQuad(a, bb, cc, d, color, light, TONES[(c + r) % 3], TONES[(c + r + 1) % 3]);
    }
  }
  head.add(facetMesh(b, { doubleSide: true, cast: false, receive: true }));
}

function buildHeadRoot(cfg, head) {
  const skin = cfg.skin;
  const skinLight = shadeHex(skin, 0.05);
  const skinShadow = shadeHex(skin, -0.075);
  const cheek = shadeHex(skin, 0.015, 0.04);
  const beardColor = cfg.beardColor || '#3a2a22';
  const beardLight = shadeHex(beardColor, 0.018);
  const beardShadow = shadeHex(beardColor, -0.035);

  const rows = [
    { y: -0.132, rx: 0.052, rz: 0.058, z: 0.010 },
    { y: -0.112, rx: 0.075, rz: 0.074, z: 0.008 },
    { y: -0.075, rx: 0.090, rz: 0.084, z: 0.004 },
    { y: -0.030, rx: 0.098, rz: 0.091, z: 0.001 },
    { y: 0.020, rx: 0.100, rz: 0.096, z: 0 },
    { y: 0.070, rx: 0.099, rz: 0.101, z: 0.002 },
    { y: 0.110, rx: 0.088, rz: 0.092, z: 0.004 },
    { y: 0.140, rx: 0.048, rz: 0.054, z: 0.006 }
  ];
  const b = new FacetBuilder();
  addLoft(b, rows, 16, { ...cfg, coat: skin, accent: skin }, { fold: 0.0025 });
  head.add(facetMesh(b, { cast: true, receive: true }));

  const facePlanes = new FacetBuilder();
  for (const side of [-1, 1]) {
    facePlanes.tri(
      new THREE.Vector3(side * 0.010, -0.004, 0.099),
      new THREE.Vector3(side * 0.052, -0.036, 0.080),
      new THREE.Vector3(side * 0.068, -0.004, 0.075),
      skin, 0.99
    );
    facePlanes.tri(
      new THREE.Vector3(side * 0.010, -0.004, 0.099),
      new THREE.Vector3(side * 0.068, -0.004, 0.075),
      new THREE.Vector3(side * 0.040, 0.015, 0.094),
      skinLight, 1.01
    );
  }
  head.add(facetMesh(facePlanes, { cast: false, receive: true }));

  const eyeGroups = [];
  const brows = [];
  for (const side of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.040, 0.024, 0.0925);
    head.add(eyeGroup);
    const white = solidMesh(new THREE.SphereGeometry(0.0148, 7, 5), '#cbb49e', { cast: false });
    white.scale.set(1.15, 0.52, 0.34);
    eyeGroup.add(white);
    const iris = solidMesh(new THREE.SphereGeometry(0.0082, 6, 4), '#221711', { cast: false });
    iris.scale.set(1.0, 1.0, 0.38);
    iris.position.z = 0.0078;
    eyeGroup.add(iris);
    const catchlight = solidMesh(new THREE.SphereGeometry(0.0015, 4, 3), '#ffe9cf', { basic: true });
    catchlight.position.set(0.0022, 0.0026, 0.0120);
    eyeGroup.add(catchlight);
    const lid = solidMesh(new THREE.BoxGeometry(0.032, 0.0062, 0.010), skin, { cast: false });
    lid.position.set(0, 0.0102, 0.0048);
    lid.rotation.z = -side * 0.035;
    eyeGroup.add(lid);
    const lower = solidMesh(new THREE.BoxGeometry(0.027, 0.003, 0.007), skinShadow, { cast: false });
    lower.position.set(0, -0.0102, 0.0055);
    eyeGroup.add(lower);
    const lash = solidMesh(new THREE.BoxGeometry(0.010, 0.0025, 0.005), '#2b1a12', { cast: false });
    lash.position.set(side * 0.013, 0.006, 0.010);
    lash.rotation.z = side * 0.36;
    eyeGroup.add(lash);
    eyeGroups.push({
      group: eyeGroup,
      pupil: iris,
      baseX: iris.position.x,
      baseY: iris.position.y
    });

    const browColor = cfg.beard === 'full' ? shadeHex(beardColor, -0.05) : '#3a2a22';
    const brow = solidMesh(new THREE.BoxGeometry(0.028, 0.0048, 0.007), browColor, { cast: false });
    brow.position.set(side * 0.042, 0.052, 0.093);
    brow.rotation.z = side * 0.10;
    head.add(brow);
    brows.push({ mesh: brow, baseZ: brow.rotation.z, baseY: brow.position.y, side, part: 0 });
    const inner = solidMesh(new THREE.BoxGeometry(0.010, 0.0042, 0.006), browColor, { cast: false });
    inner.position.set(side * 0.025, 0.0505, 0.094);
    inner.rotation.z = side * 0.20;
    head.add(inner);
    brows.push({ mesh: inner, baseZ: inner.rotation.z, baseY: inner.position.y, side, part: 1 });
  }

  const noseB = new FacetBuilder();
  const bridgeA = new THREE.Vector3(-0.0075, 0.046, 0.0915);
  const bridgeB = new THREE.Vector3(0.0075, 0.046, 0.0915);
  const bridgeC = new THREE.Vector3(0.011, -0.006, 0.101);
  const bridgeD = new THREE.Vector3(-0.011, -0.006, 0.101);
  noseB.quad(bridgeA, bridgeB, bridgeC, bridgeD, skinLight, 1.02);
  noseB.tri(new THREE.Vector3(-0.011, -0.006, 0.101), new THREE.Vector3(0.0, -0.020, 0.108),
    new THREE.Vector3(0.011, -0.006, 0.101), skin, 0.98);
  for (const side of [-1, 1]) {
    noseB.tri(new THREE.Vector3(side * 0.011, -0.006, 0.101),
      new THREE.Vector3(side * 0.019, -0.017, 0.099),
      new THREE.Vector3(side * 0.008, -0.020, 0.104), skinShadow, 1.0);
    noseB.tri(new THREE.Vector3(side * 0.019, -0.017, 0.099),
      new THREE.Vector3(side * 0.014, -0.023, 0.104),
      new THREE.Vector3(side * 0.008, -0.020, 0.104), skinShadow, 0.94);
  }
  head.add(facetMesh(noseB, { cast: false, receive: true }));

  const mouth = new THREE.Group();
  mouth.position.set(0, -0.059, 0.096);
  head.add(mouth);
  const mouthKind = cfg.expression === 'sing' ? 'open' : (cfg.expression === 'smile' || cfg.expression === 'tea' || cfg.expression === 'warm' ? 'smile' : 'neutral');
  if (mouthKind === 'open') {
    const inner = solidMesh(new THREE.SphereGeometry(0.021, 7, 4), '#321916', { cast: false });
    inner.scale.set(1.25, 0.72, 0.30);
    mouth.add(inner);
    const tongue = solidMesh(new THREE.SphereGeometry(0.010, 5, 3), '#7c3732', { cast: false });
    tongue.scale.set(1.0, 0.4, 0.35);
    tongue.position.set(0, -0.012, 0.009);
    mouth.add(tongue);
  } else {
    const smile = mouthKind === 'smile' ? -0.006 : -0.001;
    const pts = [
      new THREE.Vector3(-0.032, 0.002, 0),
      new THREE.Vector3(0, smile, 0.003),
      new THREE.Vector3(0.032, 0.002, 0)
    ];
    const lip = solidMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 6, 0.0034, 3, false), '#5b3428', { cast: false });
    mouth.add(lip);
  }
  const lowerLip = solidMesh(new THREE.BoxGeometry(0.038, 0.0055, 0.009), '#985b4b', { cast: false });
  lowerLip.position.set(0, -0.011, 0.004);
  mouth.add(lowerLip);
  const philtrum = solidMesh(new THREE.BoxGeometry(0.006, 0.011, 0.004), skinShadow, { cast: false });
  philtrum.position.set(0, -0.040, 0.094);
  head.add(philtrum);

  for (const side of [-1, 1]) {
    const helix = solidMesh(new THREE.TorusGeometry(0.023, 0.005, 3, 8, Math.PI * 1.5), skin, { cast: false });
    helix.rotation.set(Math.PI / 2, 0, side * 0.2);
    helix.position.set(side * 0.096, 0.004, 0.004);
    head.add(helix);
    const lobe = solidMesh(new THREE.IcosahedronGeometry(0.012, 0), skinLight, { cast: false });
    lobe.scale.set(0.7, 1.0, 0.55);
    lobe.position.set(side * 0.097, -0.020, 0.006);
    head.add(lobe);
  }
  if (cfg.earring) {
    const ring = solidMesh(new THREE.TorusGeometry(0.013, 0.003, 3, 8), '#C9A45E', { cast: false });
    ring.rotation.y = Math.PI / 2;
    ring.position.set(0.097, -0.040, 0.010);
    head.add(ring);
  }

  if (cfg.beard !== 'none') {
    const beard = new THREE.Group();
    head.add(beard);
    const moustache = () => {
      for (const side of [-1, 1]) {
        const strip = solidMesh(new THREE.BoxGeometry(0.022, 0.0042, 0.0055), beardColor, { cast: false });
        strip.position.set(side * 0.014, -0.052, 0.0975);
        strip.rotation.z = -side * 0.30;
        beard.add(strip);
      }
    };
    if (cfg.beard === 'full') {
      addJawBeard(beard, beardColor, beardLight, { length: 0.125, topY: -0.088 });
      moustache();
    } else if (cfg.beard === 'mustache') {
      moustache();
      const goatee = solidMesh(new THREE.ConeGeometry(0.014, 0.045, 5), beardColor, { cast: false });
      goatee.rotation.x = Math.PI;
      goatee.position.set(0, -0.138, 0.078);
      beard.add(goatee);
    } else if (cfg.beard === 'short') {
      addJawBeard(beard, beardColor, beardLight, { length: 0.072, topY: -0.100, sideRise: 0.050, rows: 3 });
      moustache();
    }
  }

  if (cfg.age > 0.4) {
    for (let i = 0; i < 3; i++) {
      const line = solidMesh(new THREE.BoxGeometry(0.055 - i * 0.006, 0.0035, 0.006), skinShadow, { cast: false });
      line.position.set(0, 0.088 + i * 0.010, 0.092 - i * 0.002);
      head.add(line);
    }
    for (const side of [-1, 1]) {
      const crow = solidMesh(new THREE.BoxGeometry(0.030, 0.003, 0.005), skinShadow, { cast: false });
      crow.position.set(side * 0.073, 0.032, 0.082);
      crow.rotation.z = side * 0.35;
      head.add(crow);
      const naso = solidMesh(new THREE.BoxGeometry(0.006, 0.045, 0.005), skinShadow, { cast: false });
      naso.position.set(side * 0.036, -0.050, 0.094);
      naso.rotation.z = side * 0.25;
      head.add(naso);
    }
  }

  head.userData.brows = brows;
  return { eyeGroups, brows, mouth, mouthKind, skinLight, skinShadow, beardColor };
}

function buildHat(head, cfg) {
  const type = cfg.hatType;
  const hatColor = cfg.hatColor;
  const accent = cfg.accent;
  const fur = cfg.fur;
  if (type === 'fur') {
    // Thick, slightly lumpy fur brim; low crown and small knob.
    const brimB = new FacetBuilder();
    addBand(brimB, [
      { y: 0.092, rx: 0.104, rz: 0.100 },
      { y: 0.104, rx: 0.121, rz: 0.117 },
      { y: 0.120, rx: 0.125, rz: 0.121 },
      { y: 0.136, rx: 0.117, rz: 0.113 },
      { y: 0.150, rx: 0.098, rz: 0.094 }
    ], 11, fur, { tone: 1.0, fold: 0.010 });
    head.add(facetMesh(brimB, { cast: true, receive: true }));
    const crown = new FacetBuilder();
    addBand(crown, [
      { y: 0.144, rx: 0.094, rz: 0.090 },
      { y: 0.176, rx: 0.085, rz: 0.082 },
      { y: 0.204, rx: 0.066, rz: 0.063 },
      { y: 0.216, rx: 0.032, rz: 0.031 }
    ], 10, hatColor, { tone: 1.0 });
    addRingTrim(crown, 0.096, 0.144, 0.010, 10, accent, 0.96);
    head.add(facetMesh(crown, { cast: true, receive: true }));
    const knob = solidMesh(new THREE.IcosahedronGeometry(0.016, 0), accent, { cast: false });
    knob.position.y = 0.228;
    head.add(knob);
  } else if (type === 'peaked') {
    const brimB = new FacetBuilder();
    addBand(brimB, [
      { y: 0.094, rx: 0.110, rz: 0.106 },
      { y: 0.108, rx: 0.126, rz: 0.122 },
      { y: 0.128, rx: 0.108, rz: 0.104 }
    ], 12, fur, { tone: 1.0, fold: 0.006 });
    head.add(facetMesh(brimB, { cast: true, receive: true }));
    const crown = new FacetBuilder();
    addBand(crown, [
      { y: 0.124, rx: 0.094, rz: 0.090 },
      { y: 0.168, rx: 0.080, rz: 0.077 },
      { y: 0.196, rx: 0.052, rz: 0.050 }
    ], 10, hatColor, { tone: 1.0 });
    addRingTrim(crown, 0.096, 0.124, 0.012, 10, accent, 0.96);
    head.add(facetMesh(crown, { cast: true, receive: true }));
    const knob = solidMesh(new THREE.IcosahedronGeometry(0.015, 0), accent, { cast: false });
    knob.position.y = 0.208;
    head.add(knob);
  } else {
    const band = new FacetBuilder();
    addBand(band, [
      { y: 0.096, rx: 0.106, rz: 0.102 },
      { y: 0.126, rx: 0.110, rz: 0.106 },
      { y: 0.140, rx: 0.098, rz: 0.094 }
    ], 12, hatColor, { tone: 1.0 });
    addRingTrim(band, 0.109, 0.100, 0.014, 12, accent, 0.98);
    head.add(facetMesh(band, { cast: true, receive: true }));
    const crown = new FacetBuilder();
    addBand(crown, [
      { y: 0.138, rx: 0.096, rz: 0.092 },
      { y: 0.176, rx: 0.080, rz: 0.077 },
      { y: 0.198, rx: 0.040, rz: 0.038 }
    ], 10, hatColor, { tone: 1.0 });
    head.add(facetMesh(crown, { cast: true, receive: true }));
    const knob = solidMesh(new THREE.IcosahedronGeometry(0.013, 0), accent, { cast: false });
    knob.position.y = 0.208;
    head.add(knob);
  }
}

function addHair(head, cfg) {
  if (cfg.hatType !== 'none') {
    const hairColor = cfg.beardColor || '#2a211c';
    const nape = solidMesh(new THREE.IcosahedronGeometry(0.090, 0), shadeHex(hairColor, -0.02), { cast: false });
    nape.scale.set(1.0, 0.48, 0.48);
    nape.position.set(0, 0.038, -0.072);
    head.add(nape);
    if (cfg.sideburns !== false) {
      for (const side of [-1, 1]) {
        const sideburn = solidMesh(new THREE.BoxGeometry(0.010, 0.052, 0.028), cfg.beardColor || '#2a211c', { cast: false });
        sideburn.position.set(side * 0.094, 0.004, 0.010);
        sideburn.rotation.z = side * 0.08;
        head.add(sideburn);
      }
    }
    return;
  }
  const cap = solidMesh(new THREE.SphereGeometry(0.104, 9, 4, 0, TAU, 0, Math.PI * 0.48), cfg.beardColor || '#2a211c', { cast: false });
  cap.scale.set(1.0, 0.72, 1.0);
  cap.position.y = 0.055;
  head.add(cap);
  if (cfg.sideburns !== false) {
    for (const side of [-1, 1]) {
      const sideburn = solidMesh(new THREE.BoxGeometry(0.012, 0.052, 0.026), cfg.beardColor || '#2a211c', { cast: false });
      sideburn.position.set(side * 0.094, 0.000, 0.012);
      head.add(sideburn);
    }
  }
}

function buildHand(side, skin) {
  const group = new THREE.Group();
  const b = new FacetBuilder();
  const palm = new THREE.Vector3(0, -0.040, 0.008);
  b.box(palm, new THREE.Vector3(0.058, 0.075, 0.048), skin, 1.0);
  b.box(new THREE.Vector3(0, -0.078, 0.010), new THREE.Vector3(0.060, 0.016, 0.044), shadeHex(skin, -0.035), 1.0);
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.0145;
    const len = i === 0 || i === 3 ? 0.046 : 0.054;
    const y = -0.092;
    b.box(new THREE.Vector3(x, y, 0.012), new THREE.Vector3(0.012, len * 0.55, 0.017), skin, 0.98);
    b.box(new THREE.Vector3(x, y - len * 0.43, 0.014), new THREE.Vector3(0.0105, len * 0.5, 0.015), shadeHex(skin, 0.025), 1.0);
    b.box(new THREE.Vector3(x, y - len * 0.75, 0.0185), new THREE.Vector3(0.008, 0.008, 0.010), '#d8b28e', 1.0);
  }
  const thumbX = side * -0.038;
  b.box(new THREE.Vector3(thumbX, -0.030, 0.020), new THREE.Vector3(0.020, 0.032, 0.020), skin, 0.97);
  b.box(new THREE.Vector3(thumbX + side * -0.008, -0.055, 0.038), new THREE.Vector3(0.017, 0.035, 0.018), skin, 1.0);
  b.box(new THREE.Vector3(thumbX + side * -0.012, -0.070, 0.049), new THREE.Vector3(0.012, 0.012, 0.013), '#d8b28e', 1.0);
  const cuff = solidMesh(new THREE.CylinderGeometry(0.036, 0.042, 0.038, 6), shadeHex(skin, -0.02), { cast: false });
  cuff.position.y = 0.006;
  group.add(cuff);
  group.add(facetMesh(b, { cast: false, receive: true }));
  return group;
}

function makeBoot(side, cfg, skin) {
  const group = new THREE.Group();
  const b = new FacetBuilder();
  const boot = '#493827';
  const sole = '#1f1a16';
  b.box(new THREE.Vector3(0, -0.030, 0.048), new THREE.Vector3(0.088, 0.066, 0.140), boot, 1.0);
  b.box(new THREE.Vector3(0, -0.043, 0.132), new THREE.Vector3(0.073, 0.050, 0.060), shadeHex(boot, 0.03), 1.0);
  b.box(new THREE.Vector3(0, -0.060, 0.054), new THREE.Vector3(0.094, 0.020, 0.205), sole, 1.0);
  b.box(new THREE.Vector3(0, -0.010, 0.152), new THREE.Vector3(0.060, 0.024, 0.042), boot, 1.0);
  b.box(new THREE.Vector3(0, 0.014, -0.012), new THREE.Vector3(0.078, 0.055, 0.078), boot, 1.0);
  const cuff = solidMesh(new THREE.CylinderGeometry(0.066, 0.073, 0.042, 7), shadeHex(boot, 0.05), { cast: false });
  cuff.position.y = 0.040;
  group.add(cuff);
  group.add(facetMesh(b, { cast: true, receive: true }));
  return group;
}

function buildArm(side, cfg, pose) {
  const L1 = 0.285;
  const L2 = 0.255;
  const shoulder = new THREE.Group();
  shoulder.position.set(side * 0.235, 0.470, 0);
  const b = new FacetBuilder();
  const sleeveRows = [
    { y: 0.010, rx: 0.086, rz: 0.083 },
    { y: -0.070, rx: 0.084, rz: 0.081 },
    { y: -0.175, rx: 0.076, rz: 0.073 },
    { y: -L1, rx: 0.066, rz: 0.063 }
  ];
  addLoft(b, sleeveRows, 10, cfg, { pattern: !!cfg.pattern, fold: 0.004 });
  const cap = solidMesh(new THREE.IcosahedronGeometry(0.077, 0), cfg.coat, { cast: true });
  cap.scale.set(1.0, 0.62, 0.9);
  cap.position.y = 0.004;
  shoulder.add(cap);
  shoulder.add(facetMesh(b, { cast: true, receive: true }));

  const elbow = new THREE.Group();
  elbow.position.set(0, -L1, 0);
  shoulder.add(elbow);
  const eb = new FacetBuilder();
  const foreRows = [
    { y: 0.000, rx: 0.066, rz: 0.063 },
    { y: -0.060, rx: 0.063, rz: 0.060 },
    { y: -L2, rx: 0.047, rz: 0.045 }
  ];
  addLoft(eb, foreRows, 10, cfg, { pattern: !!cfg.pattern, fold: 0.004 });
  const cuffB = new FacetBuilder();
  addMeanderBand(cuffB, 10, -0.212, -0.176, 0.074, 0.070, 0.071, 0.067, cfg.trim, cfg.coat);
  addRingTrim(cuffB, 0.0705, -0.220, 0.008, 10, shadeHex(cfg.trim, -0.04), 1.0);
  elbow.add(facetMesh(cuffB, { cast: false, receive: true }));
  elbow.add(facetMesh(eb, { cast: true, receive: true }));

  const wrist = new THREE.Group();
  wrist.position.set(0, -L2, 0);
  elbow.add(wrist);
  const handMesh = buildHand(side, cfg.skin);
  handMesh.scale.setScalar(0.88);
  wrist.add(handMesh);
  const wristCuff = solidMesh(new THREE.CylinderGeometry(0.039, 0.044, 0.040, 6), cfg.trim, { cast: false });
  wristCuff.position.y = 0.012;
  wrist.add(wristCuff);

  const arm = {
    side,
    shoulder,
    elbow,
    wrist,
    root: shoulder,
    fore: elbow,
    hand: wrist,
    L1,
    L2,
    talk: pose === 'seatTalk' && side < 0,
    baseTarget: new THREE.Vector3(),
    target: new THREE.Vector3(),
    desired: new THREE.Vector3(),
    pole: new THREE.Vector3(side * 0.75, -0.8, 0.25),
    update: null
  };
  arm.update = (dt = 0.016, rate = 14) => {
    const k = dt <= 0 ? 1 : 1 - Math.exp(-rate * dt);
    arm.target.lerp(arm.desired, k);
    poseArm(arm);
  };
  return arm;
}

function poseArm(arm) {
  const shoulderPos = arm.shoulder.position;
  const target = arm.target;
  const diff = new THREE.Vector3().subVectors(target, shoulderPos);
  let distance = diff.length();
  const maxReach = arm.L1 + arm.L2 - 0.008;
  if (distance < 0.001) {
    diff.set(arm.side * 0.01, -0.1, 0.01);
    distance = diff.length();
  }
  if (distance > maxReach) {
    diff.multiplyScalar(maxReach / distance);
    distance = maxReach;
  }
  const dir = diff.clone().normalize();
  const a = (arm.L1 * arm.L1 - arm.L2 * arm.L2 + distance * distance) / (2 * distance);
  const h = Math.sqrt(Math.max(0, arm.L1 * arm.L1 - a * a));
  const pole = arm.pole.clone();
  pole.addScaledVector(dir, -pole.dot(dir));
  if (pole.lengthSq() < 1e-6) pole.set(0, -1, 0);
  pole.normalize();
  const elbowPos = new THREE.Vector3().copy(shoulderPos)
    .addScaledVector(dir, a)
    .addScaledVector(pole, h);
  const upperDir = new THREE.Vector3().subVectors(elbowPos, shoulderPos).normalize();
  arm.shoulder.quaternion.setFromUnitVectors(DOWN, upperDir);
  const foreWorld = new THREE.Vector3().subVectors(target, elbowPos).normalize();
  const inv = arm.shoulder.quaternion.clone().invert();
  const foreLocal = foreWorld.clone().applyQuaternion(inv).normalize();
  arm.elbow.quaternion.setFromUnitVectors(DOWN, foreLocal);
}

function armTargetFor(pose, side) {
  switch (pose) {
    case 'seatTalk':
      return side < 0 ? new THREE.Vector3(-0.36, 0.70, 0.23) : new THREE.Vector3(0.22, 0.08, 0.30);
    case 'seatListen':
      return new THREE.Vector3(side * 0.20, 0.10, 0.31);
    case 'seatTea':
      return new THREE.Vector3(side * 0.12, 0.29, 0.34);
    case 'seatWarm':
      return new THREE.Vector3(side * 0.17, 0.30, 0.45);
    case 'seatA':
      return new THREE.Vector3(side * 0.20, 0.04, 0.30);
    case 'seatB':
      return new THREE.Vector3(side * 0.22, 0.06, 0.28);
    case 'seatC':
      return new THREE.Vector3(side * 0.12, 0.12, 0.34);
    case 'carry':
      return new THREE.Vector3(side * 0.18, 0.17, 0.36);
    case 'reins':
      return new THREE.Vector3(side * 0.15, 0.30, 0.30);
    case 'point':
      return side < 0 ? new THREE.Vector3(-0.36, 0.62, 0.33) : new THREE.Vector3(0.21, 0.04, 0.14);
    default:
      return new THREE.Vector3(side * 0.235, 0.015, 0.055);
  }
}

function buildLegs(root, cfg, hipBase) {
  const legs = [];
  const L1 = 0.415;
  const L2 = 0.390;
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.145, hipBase, 0);
    root.add(hip);
    const b = new FacetBuilder();
    const thighRows = [
      { y: 0.000, rx: 0.092, rz: 0.082 },
      { y: -0.080, rx: 0.089, rz: 0.080 },
      { y: -0.240, rx: 0.079, rz: 0.073 },
      { y: -L1, rx: 0.071, rz: 0.065 }
    ];
    addLoft(b, thighRows, 8, cfg, { pattern: false, fold: 0.004 });
    hip.add(facetMesh(b, { cast: true, receive: true }));

    const knee = new THREE.Group();
    knee.position.set(0, -L1, 0);
    hip.add(knee);

    const calfRows = [
      { y: 0.000, rx: 0.072, rz: 0.068 },
      { y: -0.070, rx: 0.078, rz: 0.073 },
      { y: -0.250, rx: 0.064, rz: 0.060 },
      { y: -L2, rx: 0.052, rz: 0.049 }
    ];
    const calfB = new FacetBuilder();
    addLoft(calfB, densifyRows(calfRows, 2), 8, { ...cfg, coat: '#493827' }, { pattern: false, fold: 0.003 });
    knee.add(facetMesh(calfB, { cast: true, receive: true }));

    const ankle = new THREE.Group();
    ankle.position.set(0, -L2, 0);
    knee.add(ankle);
    const boot = makeBoot(side, cfg, cfg.skin);
    ankle.add(boot);

    const leg = {
      side, hip, knee, ankle, foot: ankle, boot, L1, L2,
      hipX: side * 0.145, hipBase,
      phase: 0, prevPhase: 0, state: 'stance',
      anchor: new THREE.Vector3(),
      swingStart: new THREE.Vector3(),
      landing: new THREE.Vector3()
    };
    legs.push(leg);
  }
  return legs;
}

function buildBowl(upper, cfg) {
  const group = new THREE.Group();
  group.position.set(0, 0.27, 0.37);
  const cup = solidMesh(new THREE.CylinderGeometry(0.076, 0.052, 0.072, 9), '#8b5f36', { cast: false });
  cup.position.y = 0.036;
  group.add(cup);
  const rim = solidMesh(new THREE.TorusGeometry(0.078, 0.009, 3, 10), '#C9A45E', { cast: false });
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.074;
  group.add(rim);
  const tea = solidMesh(new THREE.CylinderGeometry(0.069, 0.069, 0.006, 10), '#2c1a12', { cast: false });
  tea.position.y = 0.071;
  group.add(tea);
  upper.add(group);
  return group;
}

function makeBeads(upper, cfg) {
  const b = new FacetBuilder();
  for (let i = 0; i < 18; i++) {
    const a = TAU * i / 18;
    const bead = new THREE.Vector3(Math.sin(a) * 0.152, 0.455 + Math.cos(a) * 0.024, Math.cos(a) * 0.172);
    const r = i % 4 === 0 ? 0.013 : 0.010;
    b.box(bead, new THREE.Vector3(r, r, r), i % 4 === 0 ? '#C9A45E' : '#423326', 1.0);
  }
  upper.add(facetMesh(b, { cast: false, receive: true }));
}

export function createHerder(cfg) {
  const person = { ...cfg };
  person.height = person.height || 1.0;
  person.skin = person.skin || '#B88C66';
  person.coat = person.coat || '#1C3357';
  person.accent = person.accent || '#C48A3A';
  person.trim = person.trim || '#B87A33';
  person.fur = person.fur || '#6B523D';
  person.hatColor = person.hatColor || '#5C3829';
  person.beardColor = person.beardColor || '#3a2a21';
  person.beard = person.beard || 'none';
  person.hatType = person.hatType || 'fur';
  person.expression = person.expression || 'neutral';
  person.pose = person.pose || 'seatA';
  person.earring = !!person.earring;
  person.beads = !!person.beads;
  person.sideburns = person.sideburns !== false;
  person.age = person.age || 0;
  person.legsKind = person.legs || null;

  const root = new THREE.Group();
  const seated = person.pose !== 'standing';
  const baseUpperY = 0.50;
  const standingLift = 0.42;
  const upper = new THREE.Group();
  upper.position.y = baseUpperY;
  upper.rotation.x = person.lean || 0;
  root.add(upper);

  const torsoRows = buildTorso(upper, person);
  buildInnerSkirt(upper, person);
  const robePanels = buildRobePanels(upper, person);
  const sashTail = addSashTail(upper, person);

  if (person.beads) makeBeads(upper, person);

  const head = new THREE.Group();
  head.position.set(0, 0.665, 0.012);
  head.rotation.set(person.headPitch || 0, person.headTurn || 0, person.tilt || 0);
  head.scale.setScalar(1.04);
  upper.add(head);
  const headParts = buildHeadRoot(person, head);
  addHair(head, person);
  buildHat(head, person);

  const arms = [];
  for (const side of [-1, 1]) {
    const arm = buildArm(side, person, person.pose);
    upper.add(arm.shoulder);
    arm.baseTarget.copy(armTargetFor(person.pose, side));
    arm.target.copy(arm.baseTarget);
    arm.desired.copy(arm.baseTarget);
    poseArm(arm);
    arms.push(arm);
  }

  const legs = buildLegs(root, person, baseUpperY);
  const fitLegs = () => {};
  fitLegs();

  let bowl = null;
  if (person.pose === 'seatTea' || person.pose === 'seatC') bowl = buildBowl(upper, person);

  const standTarget = seated ? 0 : standingLift;
  const standLift = standTarget;
  upper.position.y = baseUpperY + standLift;
  legs.forEach(leg => { leg.hip.position.y = upper.position.y; });

  const parts = {
    upper, head, eyes: headParts.eyeGroups, brows: headParts.brows, mouth: headParts.mouth,
    mouthKind: headParts.mouthKind,
    arms, bowl, baseBowlY: bowl ? bowl.position.y : 0,
    sing: person.expression === 'sing',
    tea: person.pose === 'seatTea' || person.pose === 'seatC',
    warm: person.pose === 'seatWarm',
    listen: person.pose === 'seatListen',
    talkArm: arms.find(arm => arm.talk) || null,
    baseUpperY, baseLean: person.lean || 0, baseScale: person.height,
    baseHeadX: person.headPitch || 0, baseHeadY: person.headTurn || 0,
    baseHeadZ: person.tilt || 0, eyeBaseY: person.expression === 'sing' ? 0.78 : 1.0,
    gazeY: person.pose === 'seatTea' ? -0.004 : person.expression === 'sing' ? 0.002 : 0,
    seatedGroup: new THREE.Group(),
    standGroup: new THREE.Group(),
    standShadow: null, standLegs: legs, legs,
    standLift, standTarget, stood: false,
    walking: false, walkAmount: 0, walkBlend: 0, walkPhase: Math.random() * TAU, leanOffset: 0,
    speed: 0, prevX: 0, prevZ: 0, targetYaw: 0,
    gait: { initialized: false, cycle: 0, stride: 1.05, stanceFrac: 0.58, moved: 0 },
    sashTail, sashBaseZ: sashTail.rotation.z, sashBaseX: sashTail.rotation.x,
    riding: false, riderAttached: false, hidden: false, carryLog: null,
    animPhase: Math.random() * TAU, noiseSeed: Math.random() * 97,
    nextBlink: Math.random() * 3.5, blinkStart: -10, doubleBlink: false,
    speechEnv: 0, speechStress: 0, reactEnv: 0, reactStress: 0, speechBeat: 0,
    lookTarget: new THREE.Vector3(), lookWeight: 0, lookYaw: 0, lookPitch: 0, gazeX: 0,
    robePanels, torsoRows, seatBlend: seated ? 1 : 0
  };
  root.userData.parts = parts;
  root.scale.setScalar(person.height);
  return root;
}

export function setArmPose(arm, target) {
  arm.baseTarget.copy(target);
  arm.target.copy(target);
  arm.desired.copy(target);
  poseArm(arm);
}

export function solveArm(arm, dt) {
  arm.update(dt);
}

export function solveLeg(leg, targetX, targetY, targetZ) {
  const hipY = leg.hip.position.y;
  const hipX = leg.hip.position.x;
  const dx = targetX - hipX;
  const dy = targetY - hipY;
  const dz = targetZ;
  const distance = Math.max(0.16, Math.min(Math.hypot(dx, dy, dz), leg.L1 + leg.L2 - 0.004));
  const alpha = Math.atan2(dz, -dy);
  const beta = Math.acos(Math.max(-1, Math.min(1,
    (leg.L1 * leg.L1 + distance * distance - leg.L2 * leg.L2) / (2 * leg.L1 * distance))));
  const delta = Math.acos(Math.max(-1, Math.min(1,
    (leg.L2 * leg.L2 + distance * distance - leg.L1 * leg.L1) / (2 * leg.L2 * distance))));
  const hipRotation = -alpha - beta;
  const kneeRotation = beta + delta;
  leg.hip.rotation.x = hipRotation;
  leg.hip.rotation.z = Math.max(-0.42, Math.min(0.42, Math.atan2(dx, -dy) * 0.6));
  leg.knee.rotation.x = kneeRotation;
  leg.ankle.rotation.x = -(hipRotation + kneeRotation);
  return { hipRotation, kneeRotation };
}

export function setRiderLegs(legs, airborne = false) {
  for (const leg of legs) {
    const side = leg.side;
    if (airborne) {
      leg.hip.rotation.x = -0.45;
      leg.hip.rotation.z = side * 0.22;
      leg.knee.rotation.x = 0.95;
      leg.ankle.rotation.x = -0.25;
    } else {
      leg.hip.rotation.x = -0.62;
      leg.hip.rotation.z = side * 0.46;
      leg.knee.rotation.x = 1.08;
      leg.ankle.rotation.x = 0.10;
    }
  }
}
