import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import {
  EffectComposer, RenderPass, EffectPass, BloomEffect, VignetteEffect,
  NoiseEffect, FXAAEffect, HueSaturationEffect, BrightnessContrastEffect,
  BlendFunction
} from 'postprocessing';

const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Interactive low-poly Mongolian winter camp at sunset');
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcfa1b4, 65, 380);

    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 1600);
    camera.position.set(0.5, 4.0, 10.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2.3, -3.5);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 26;
    controls.minPolarAngle = 1.2;
    controls.maxPolarAngle = 1.53;
    controls.minAzimuthAngle = -0.35;
    controls.maxAzimuthAngle = 0.35;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.55;
    controls.update();

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomEffect = new BloomEffect({
      intensity: 0.62,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.18,
      mipmapBlur: true
    });
    const hueEffect = new HueSaturationEffect({ hue: 0, saturation: -0.015 });
    const contrastEffect = new BrightnessContrastEffect({ brightness: 0.06, contrast: 0.018 });
    const vignetteEffect = new VignetteEffect({ offset: 0.46, darkness: 0.24 });
    const grainEffect = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: true });
    grainEffect.blendMode.opacity.value = 0.012;
    const aaEffect = new FXAAEffect();
    composer.addPass(new EffectPass(
      camera, bloomEffect, hueEffect, contrastEffect, vignetteEffect, grainEffect, aaEffect
    ));
    let qualityHigh = true;

    let seed = 20261020;
    function rnd() {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    const range = (a, b) => a + rnd() * (b - a);
    const clamp = THREE.MathUtils.clamp;
    const smoothstep = (a, b, x) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const V3 = THREE.Vector3;
    const FIXED_DT = 1 / 60;
    let simTime = 0;
    const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
    const angleDelta = (a, b) => {
      let d = (b - a + Math.PI) % (Math.PI * 2);
      if (d < 0) d += Math.PI * 2;
      return d - Math.PI;
    };
    const angleDamp = (cur, target, lambda, dt) =>
      cur + angleDelta(cur, target) * (1 - Math.exp(-lambda * dt));

    function hash1(n) {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
      return s - Math.floor(s);
    }
    function noise1(x) {
      const i = Math.floor(x);
      const f = x - i;
      const u = f * f * (3 - 2 * f);
      return (hash1(i) * (1 - u) + hash1(i + 1) * u) * 2 - 1;
    }
    function fbm1(x) {
      return noise1(x) * 0.58 + noise1(x * 2.07 + 13.7) * 0.28 +
        noise1(x * 4.11 + 41.3) * 0.14;
    }
    function seededRng(seed) {
      let state = seed >>> 0;
      return () => {
        state = (state + 0x6D2B79F5) | 0;
        let v = Math.imul(state ^ (state >>> 15), 1 | state);
        v = (v + Math.imul(v ^ (v >>> 7), 61 | v)) ^ v;
        return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
      };
    }

    const hslScratch = {};
    function jitter(base, lightness = 0.045, saturation = 0.015, hue = 0.004) {
      base.getHSL(hslScratch, THREE.SRGBColorSpace);
      return new THREE.Color().setHSL(
        (hslScratch.h + (rnd() * 2 - 1) * hue + 1) % 1,
        clamp(hslScratch.s + (rnd() * 2 - 1) * saturation, 0, 1),
        clamp(hslScratch.l + (rnd() * 2 - 1) * lightness, 0.02, 0.98),
        THREE.SRGBColorSpace
      );
    }

    const pa = new V3(), pb = new V3(), pc = new V3(), pn = new V3();
    function paintFaces(geometry, colorFn) {
      if (geometry.index) geometry = geometry.toNonIndexed();
      const pos = geometry.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i += 3) {
        pa.fromBufferAttribute(pos, i);
        pb.fromBufferAttribute(pos, i + 1);
        pc.fromBufferAttribute(pos, i + 2);
        const cx = (pa.x + pb.x + pc.x) / 3;
        const cy = (pa.y + pb.y + pc.y) / 3;
        const cz = (pa.z + pb.z + pc.z) / 3;
        pn.subVectors(pb, pa).cross(pc.sub(pa)).normalize();
        const col = colorFn(cx, cy, cz, pn);
        for (let k = 0; k < 3; k++) {
          colors[(i + k) * 3] = col.r;
          colors[(i + k) * 3 + 1] = col.g;
          colors[(i + k) * 3 + 2] = col.b;
        }
      }
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      return geometry;
    }

    const facetMat = new THREE.MeshStandardMaterial({
      vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0.0
    });
    const facetMatDouble = facetMat.clone();
    facetMatDouble.side = THREE.DoubleSide;
    const figureMat = facetMat.clone();
    figureMat.emissive = new THREE.Color(0x2a1a30);
    figureMat.emissiveIntensity = 0.14;
    const figureMatDouble = figureMat.clone();
    figureMatDouble.side = THREE.DoubleSide;
    const cloudMat = new THREE.MeshBasicMaterial({
      vertexColors: true, side: THREE.DoubleSide, fog: false, toneMapped: true
    });

    function faceted(geometry, hex, opts = {}) {
      const base = new THREE.Color(hex);
      const painted = paintFaces(geometry, () => jitter(
        base,
        opts.lightness ?? 0.045,
        opts.saturation ?? 0.015,
        opts.hue ?? 0.004
      ));
      const mat = opts.figure
        ? (opts.doubleSide ? figureMatDouble : figureMat)
        : (opts.doubleSide ? facetMatDouble : facetMat);
      const mesh = new THREE.Mesh(painted, mat);
      mesh.castShadow = opts.castShadow ?? true;
      mesh.receiveShadow = opts.receiveShadow ?? true;
      return mesh;
    }

    function figurePart(geometry, hex, opts = {}) {
      return faceted(geometry, hex, { ...opts, figure: true });
    }

    function mergeMeshGroup(meshes) {
      let total = 0;
      let hasColor = true;
      let hasNormal = true;
      const parts = [];
      for (const m of meshes) {
        let geo = m.geometry;
        if (!geo || !geo.attributes || !geo.attributes.position) return null;
        if (Array.isArray(m.material)) return null;
        if (geo.index) geo = geo.toNonIndexed();
        else geo = geo.clone();
        geo.applyMatrix4(m.matrix);
        total += geo.attributes.position.count;
        if (!geo.attributes.color) hasColor = false;
        if (!geo.attributes.normal) hasNormal = false;
        parts.push(geo);
      }
      const position = new Float32Array(total * 3);
      const normal = hasNormal ? new Float32Array(total * 3) : null;
      const color = hasColor ? new Float32Array(total * 3) : null;
      let offset = 0;
      for (const geo of parts) {
        position.set(geo.attributes.position.array, offset * 3);
        if (normal) normal.set(geo.attributes.normal.array, offset * 3);
        if (color) color.set(geo.attributes.color.array, offset * 3);
        offset += geo.attributes.position.count;
        geo.dispose();
      }
      const out = new THREE.BufferGeometry();
      out.setAttribute('position', new THREE.BufferAttribute(position, 3));
      if (normal) out.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
      if (color) out.setAttribute('color', new THREE.BufferAttribute(color, 3));
      return out;
    }

    // Folds the static detail meshes of a character into one mesh per
    // (parent, material, shadow flags) so the added detail stays cheap.
    function mergeStaticMeshes(root) {
      root.updateMatrixWorld(true);
      const groups = new Map();
      root.traverse(obj => {
        if (!obj.isMesh) return;
        if (obj.children.length) return;
        if (obj.userData.noMerge) return;
        const geo = obj.geometry;
        if (!geo || !geo.attributes || !geo.attributes.position) return;
        if (geo.attributes.uv && (obj.material.map || obj.material.alphaMap)) return;
        if (geo.morphAttributes && Object.keys(geo.morphAttributes).length) return;
        if (Array.isArray(obj.material)) return;
        const key = [obj.parent.uuid, obj.material.uuid, obj.castShadow ? 1 : 0, obj.receiveShadow ? 1 : 0].join('|');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(obj);
      });
      groups.forEach(meshes => {
        if (meshes.length < 2) return;
        const merged = mergeMeshGroup(meshes);
        if (!merged) return;
        const mesh = new THREE.Mesh(merged, meshes[0].material);
        mesh.castShadow = meshes[0].castShadow;
        mesh.receiveShadow = meshes[0].receiveShadow;
        mesh.renderOrder = meshes[0].renderOrder;
        const parent = meshes[0].parent;
        parent.add(mesh);
        for (const m of meshes) {
          parent.remove(m);
          m.geometry.dispose();
        }
      });
    }

    const eyeMats = {
      sheepWhite: new THREE.MeshBasicMaterial({ color: 0xF2E8D8 }),
      sheepPupil: new THREE.MeshBasicMaterial({ color: 0x1E1712 }),
      sheepDark: new THREE.MeshBasicMaterial({ color: 0x2A211B }),
      sheepMouth: new THREE.MeshBasicMaterial({ color: 0x4A3A30 }),
      goatWhite: new THREE.MeshBasicMaterial({ color: 0xE9D9BC }),
      goatPupil: new THREE.MeshBasicMaterial({ color: 0x1C130E }),
      yakWhite: new THREE.MeshBasicMaterial({ color: 0x9C8892 }),
      yakPupil: new THREE.MeshBasicMaterial({ color: 0x181216 }),
      yakGlint: new THREE.MeshBasicMaterial({ color: 0xFFF0E4 }),
      glint: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
      horseEye: new THREE.MeshBasicMaterial({ color: 0x1A120C }),
      horseGlint: new THREE.MeshBasicMaterial({ color: 0xFFF2E2 })
    };

    function figureCustom(geometry, colorFn, opts = {}) {
      const painted = paintFaces(geometry, colorFn);
      const mesh = new THREE.Mesh(painted, opts.doubleSide ? figureMatDouble : figureMat);
      mesh.castShadow = opts.castShadow ?? true;
      mesh.receiveShadow = opts.receiveShadow ?? true;
      return mesh;
    }

    function loftGeometry(sections, sides = 8) {
      const rings = sections.map(section => {
        const ring = [];
        for (let i = 0; i < sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          ring.push(new V3(
            Math.cos(a) * section.w,
            section.y + Math.sin(a) * section.h,
            section.z
          ));
        }
        return ring;
      });
      const verts = [];
      for (let s = 0; s < rings.length - 1; s++) {
        for (let i = 0; i < sides; i++) {
          const a = rings[s][i];
          const b = rings[s][(i + 1) % sides];
          const c = rings[s + 1][(i + 1) % sides];
          const d = rings[s + 1][i];
          verts.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
          verts.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
        }
      }
      const first = sections[0];
      const last = sections[sections.length - 1];
      const firstRing = rings[0];
      const lastRing = rings[rings.length - 1];
      for (let i = 0; i < sides; i++) {
        const a = firstRing[i];
        const b = firstRing[(i + 1) % sides];
        verts.push(0, first.y, first.z, b.x, b.y, b.z, a.x, a.y, a.z);
        const c = lastRing[i];
        const d = lastRing[(i + 1) % sides];
        verts.push(0, last.y, last.z, c.x, c.y, c.z, d.x, d.y, d.z);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.computeVertexNormals();
      return geo;
    }

    function tube(a, b, radiusA, radiusB, hex, opts = {}) {
      const delta = new V3().subVectors(b, a);
      const len = delta.length();
      const geo = new THREE.CylinderGeometry(radiusB, radiusA, len, opts.segments ?? 5, 1);
      const mesh = faceted(geo, hex, opts);
      mesh.position.copy(a).addScaledVector(delta, 0.5);
      mesh.quaternion.setFromUnitVectors(new V3(0, 1, 0), delta.normalize());
      return mesh;
    }

    function makeBoot(color = '#332a24', sole = '#1f1a17', scale = 1) {
      const g = new THREE.Group();
      const shaft = figurePart(new THREE.CylinderGeometry(0.075, 0.095, 0.2, 6), color, { lightness: 0.04 });
      shaft.position.y = 0.1;
      g.add(shaft);
      const foot = figurePart(new THREE.BoxGeometry(0.16, 0.11, 0.27), color, { lightness: 0.04 });
      foot.position.set(0, 0.05, 0.09);
      g.add(foot);
      const toe = figurePart(new THREE.ConeGeometry(0.072, 0.15, 4), color, { lightness: 0.04 });
      toe.rotation.x = -1.08;
      toe.position.set(0, 0.08, 0.235);
      g.add(toe);
      const soleStrip = figurePart(new THREE.BoxGeometry(0.175, 0.035, 0.31), sole, { lightness: 0.02, castShadow: false });
      soleStrip.position.set(0, 0.018, 0.08);
      g.add(soleStrip);

      const welt = figurePart(new THREE.BoxGeometry(0.168, 0.016, 0.3), '#6a5b4c', { lightness: 0.02, castShadow: false });
      welt.position.set(0, 0.036, 0.075);
      g.add(welt);

      const heel = figurePart(new THREE.BoxGeometry(0.13, 0.05, 0.1), sole, { lightness: 0.02, castShadow: false });
      heel.position.set(0, 0.026, -0.035);
      g.add(heel);

      const stitch = figurePart(new THREE.BoxGeometry(0.012, 0.01, 0.22), '#8d7c66', { lightness: 0.02, castShadow: false });
      stitch.position.set(0, 0.108, 0.1);
      stitch.rotation.x = -0.1;
      g.add(stitch);

      const toeSeam = figurePart(new THREE.BoxGeometry(0.1, 0.012, 0.012), '#8d7c66', { lightness: 0.02, castShadow: false });
      toeSeam.position.set(0, 0.108, 0.198);
      g.add(toeSeam);

      const cuff = figurePart(new THREE.CylinderGeometry(0.083, 0.086, 0.05, 6), '#5c4a3a', { lightness: 0.03, castShadow: false });
      cuff.position.y = 0.2;
      g.add(cuff);

      const frost = figurePart(new THREE.BoxGeometry(0.09, 0.02, 0.13), '#d9d3ea', { lightness: 0.02, castShadow: false });
      frost.position.set(0, 0.112, 0.185);
      frost.rotation.x = -0.22;
      g.add(frost);

      g.scale.setScalar(scale);
      return g;
    }

    function addFurTufts(parent, radius, y, count, color, size = 1) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const tuft = figurePart(new THREE.ConeGeometry(0.036 * size, 0.1 * size, 3), color, {
          lightness: 0.04, castShadow: false
        });
        tuft.quaternion.setFromUnitVectors(
          new V3(0, 1, 0),
          new V3(Math.cos(a) * 0.8, 0.65, Math.sin(a) * 0.8).normalize()
        );
        tuft.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
        parent.add(tuft);
      }
    }

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    {
      const ctx = glowCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0.0, 'rgba(255, 207, 136, 0.86)');
      grad.addColorStop(0.22, 'rgba(255, 160, 74, 0.55)');
      grad.addColorStop(0.52, 'rgba(255, 118, 48, 0.18)');
      grad.addColorStop(1.0, 'rgba(255, 100, 40, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;

    const doorCanvas = document.createElement('canvas');
    doorCanvas.width = 96;
    doorCanvas.height = 160;
    {
      const ctx = doorCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(48, 118, 3, 48, 118, 108);
      grad.addColorStop(0.0, '#fff3cf');
      grad.addColorStop(0.25, '#ffd08a');
      grad.addColorStop(0.5, '#ffab4c');
      grad.addColorStop(0.76, '#e2711f');
      grad.addColorStop(1.0, '#a83d0d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 96, 160);
      const shade = ctx.createLinearGradient(0, 0, 0, 160);
      shade.addColorStop(0, 'rgba(45, 14, 4, 0.38)');
      shade.addColorStop(0.35, 'rgba(45, 14, 4, 0)');
      shade.addColorStop(1, 'rgba(255, 206, 130, 0.18)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, 96, 160);
    }
    const doorTex = new THREE.CanvasTexture(doorCanvas);
    doorTex.colorSpace = THREE.SRGBColorSpace;

    function glowPlane(size, opacity) {
      const mat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 3;
      return mesh;
    }

    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = contactCanvas.height = 128;
    {
      const ctx = contactCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
      grad.addColorStop(0.0, 'rgba(14, 8, 20, 0.72)');
      grad.addColorStop(0.45, 'rgba(14, 8, 20, 0.44)');
      grad.addColorStop(0.78, 'rgba(14, 8, 20, 0.13)');
      grad.addColorStop(1.0, 'rgba(14, 8, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const contactTex = new THREE.CanvasTexture(contactCanvas);
    contactTex.colorSpace = THREE.SRGBColorSpace;

    function contactShadow(width, depth, opacity = 0.5) {
      const mat = new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        opacity,
        depthWrite: false,
        toneMapped: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.014;
      mesh.renderOrder = 2;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      return mesh;
    }

    const skyGeo = new THREE.SphereGeometry(800, 40, 20);
    const sunDir = new V3(-0.62, 0.20, -0.76).normalize();
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(0x4b3567) },
        uMid: { value: new THREE.Color(0xb2637a) },
        uHorizon: { value: new THREE.Color(0xff9b78) },
        uSunColor: { value: new THREE.Color(0xffd3a0) },
        uSunDir: { value: sunDir.clone() }
      },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vDir;
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        void main() {
          vec3 dir = normalize(vDir);
          float h = clamp(dir.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.12, h));
          col = mix(col, uTop, smoothstep(0.07, 0.34, h));
          float sd = max(dot(dir, normalize(uSunDir)), 0.0);
          col += uSunColor * (pow(sd, 220.0) * 1.05 + pow(sd, 26.0) * 0.28 + pow(sd, 5.0) * 0.10 + pow(sd, 2.0) * 0.04);
          float band = exp(-pow((h - 0.022) * 13.0, 2.0));
          col += uSunColor * band * 0.14;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.renderOrder = -10;
    scene.add(sky);

    scene.add(new THREE.HemisphereLight(0xa79be0, 0x4a3f62, 1.08));
    const sun = new THREE.DirectionalLight(0xffd2a8, 3.25);
    sun.position.set(-92, 36, -118);
    sun.target.position.set(0, 0, -4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -96;
    sun.shadow.camera.right = 96;
    sun.shadow.camera.top = 96;
    sun.shadow.camera.bottom = -96;
    sun.shadow.camera.near = 8;
    sun.shadow.camera.far = 340;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.04;
    sun.shadow.radius = 3;
    scene.add(sun, sun.target);

    const fill = new THREE.DirectionalLight(0x9aabe8, 0.62);
    fill.position.set(20, 30, 80);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xff8f78, 0.85);
    rim.position.set(-70, 11, -120);
    rim.target.position.set(0, 1.2, -4);
    scene.add(rim, rim.target);

    function groundHeight(x, z) {
      let h = 0;
      h += 1.15 * Math.sin(x * 0.055 + 0.7) * Math.cos(z * 0.042 + 0.9);
      h += 0.55 * Math.sin(x * 0.14 + z * 0.07 + 1.9);
      h += 0.32 * Math.cos(x * 0.23 - z * 0.11 + 0.3);
      h += smoothstep(4, 27, z) * (1.5 + 0.9 * Math.sin(x * 0.13 + 0.5) + 0.5 * Math.cos(x * 0.055 - 1.2));
      h += smoothstep(20, 115, -z) * (2.2 + 1.6 * Math.sin(x * 0.045 + 1.2) + 1.1 * Math.cos(x * 0.09 - 0.7));
      const bump = (bx, bz, r, height) => height * Math.exp(-(((x - bx) ** 2 + (z - bz) ** 2) / (r * r)) * 2.2);
      h += bump(-6.5, 11.5, 6.5, 1.2) + bump(9.5, 13, 7.5, 1.55) +
           bump(-16, 16, 8, 1.2) + bump(2.5, 6.5, 3.8, 0.75) +
           bump(-2.5, 9.5, 4.5, 0.65) + bump(5.5, 8.5, 3.5, 0.5);
      h += bump(-30, -32, 18, 1.6) + bump(22, -38, 20, 2.0) +
           bump(-4, -52, 22, 1.8) + bump(62, -58, 25, 2.2);
      const dc = Math.hypot(x / 22, (z + 2) / 16);
      const flat = 1 - smoothstep(0.45, 1.0, dc);
      h *= 1 - 0.96 * flat;

      const front = smoothstep(3.0, 4.6, z) * (1 - smoothstep(10.5, 14.5, z));
      if (front > 0.001) {
        const drift =
          0.62 * Math.sin(x * 0.58 + z * 0.42 + 1.1) +
          0.42 * Math.cos(x * 0.9 - z * 0.55 + 0.4) +
          0.24 * Math.sin(x * 1.55 + z * 1.1) +
          0.70 * Math.exp(-(((x + 3.5) ** 2 + (z - 7.2) ** 2) / 18)) +
          0.50 * Math.exp(-(((x - 5.0) ** 2 + (z - 8.8) ** 2) / 22)) +
          0.40 * Math.exp(-(((x + 9.0) ** 2 + (z - 10.5) ** 2) / 30)) +
          0.75 * Math.exp(-(((x - 0.5) ** 2 + (z - 6.2) ** 2) / 12)) +
          0.55 * Math.exp(-(((x + 2.0) ** 2 + (z - 8.8) ** 2) / 18)) +
          0.60 * Math.exp(-(((x - 4.0) ** 2 + (z - 5.4) ** 2) / 10)) +
          0.16 * Math.sin(x * 2.7 + z * 2.1);
        h += front * drift;
      }
      return h;
    }

    const sunToward = new V3(-0.62, 0.35, -0.7).normalize();
    const warmSnow = new THREE.Color(0xf8d8d0);
    const snowBright = new THREE.Color(0xefe2e9);
    const snowMid = new THREE.Color(0xb8a7cf);
    const snowShade = new THREE.Color(0x7b6f9f);
    const rockSnow = new THREE.Color(0x61567a);
    const terrainColorFn = (cx, cy, cz, normal) => {
      const patch = Math.sin(cx * 0.07 + Math.sin(cz * 0.045) * 1.9) * 0.5 + 0.5;
      let base = (patch > 0.54 ? snowBright : (patch > 0.22 ? snowMid : snowShade)).clone();
      if (normal.y < 0.80) base.lerp(rockSnow, 0.46);
      const facing = normal.dot(sunToward);
      if (facing < 0.12) base.lerp(snowShade, 0.48);
      else if (facing > 0.68) base.lerp(snowBright, 0.28);
      if (normal.y > 0.82) base.lerp(warmSnow, 0.16 * smoothstep(0.2, 1.0, facing));
      if (cy > 1.5) base.lerp(snowBright, 0.32);
      if (rnd() > 0.88) base.lerp(snowBright, 0.35);
      if (rnd() > 0.94) base.lerp(snowShade, 0.42);
      return jitter(base, 0.085, 0.03, 0.005);
    };
    let terrainSeed = 0x51F15EED;
    const terrainRnd = () => {
      terrainSeed = (terrainSeed * 1664525 + 1013904223) >>> 0;
      return terrainSeed / 4294967296;
    };
    const groundGeo = new THREE.PlaneGeometry(380, 340, 220, 200);
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, 0, -80);
    const groundPos = groundGeo.attributes.position;
    for (let i = 0; i < groundPos.count; i++) {
      let x = groundPos.getX(i);
      let z = groundPos.getZ(i);
      const nearEdge = Math.abs(x) > 186 || z < -246 || z > 86;
      const inCamp = Math.abs(x) < 14 && z > -17 && z < 13;
      if (!nearEdge && !inCamp) {
        x += (terrainRnd() - 0.5);
        z += (terrainRnd() - 0.5);
        groundPos.setX(i, x);
        groundPos.setZ(i, z);
      }
      groundPos.setY(i, groundHeight(x, z));
    }
    const terrain = new THREE.Mesh(paintFaces(groundGeo, terrainColorFn), facetMat);
    terrain.receiveShadow = true;
    terrain.castShadow = false;
    scene.add(terrain);

    function ridgeHeight(x, peaks, base) {
      let h = base + 1.4 * Math.sin(x * 0.043 + 0.7);
      for (const peak of peaks) {
        const d = Math.abs(x - peak.x);
        if (d < peak.w) h = Math.max(h, peak.h * (1 - d / peak.w));
      }
      return h;
    }

    function mountainRange({
      cx, cz, width, depth, peaks, base = 4, segX = 36, segZ = 12,
      ridgeT = 0.63, baseColor, snowColor, snowLine = 0.55, maxH, rough = 1
    }) {
      const geo = new THREE.PlaneGeometry(width, depth, segX, segZ);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const lx = pos.getX(i);
        const lz = pos.getZ(i);
        const xw = cx + lx;
        const t = (lz + depth / 2) / depth;
        const p = t > ridgeT ? (1 - t) / (1 - ridgeT) : t / ridgeT;
        const sh = Math.pow(clamp(p, 0, 1), 0.92);
        let h = ridgeHeight(xw, peaks, base);
        h *= 1 + 0.05 * Math.sin(xw * 0.19 + lz * 0.35) + 0.035 * Math.cos(xw * 0.07 - lz * 0.23);
        let y = h * sh;
        y += (Math.sin(xw * 0.16 + lz * 0.31) * 0.85 + Math.cos(xw * 0.31 - lz * 0.19) * 0.55) * sh * rough;
        pos.setY(i, y);
      }
      geo.translate(cx, 0, cz);
      const bc = new THREE.Color(baseColor);
      const sc = new THREE.Color(snowColor);
      const shadowTint = new THREE.Color(0x6f6796);
      const snowShadeTint = new THREE.Color(0xb8b0d8);
      const sunTint = new THREE.Color(0xffe4d8);
      const painted = paintFaces(geo, (fx, fy, fz, normal) => {
        const snowy = fy > maxH * (snowLine + (rnd() - 0.5) * 0.2) && normal.y > -0.05;
        let col = (snowy ? sc : bc).clone();
        const facing = normal.dot(sunToward);
        if (!snowy) {
          if (facing < 0.28) col.lerp(shadowTint, 0.24);
          else if (facing > 0.62) col.lerp(sunTint, 0.10);
        } else if (facing < 0.12) {
          col.lerp(snowShadeTint, 0.22);
        } else {
          col.lerp(sunTint, 0.07);
        }
        const streak = Math.sin(fx * 0.19 + fy * 0.33 + fz * 0.11) + Math.sin(fx * 0.06 - fy * 0.21 + fz * 0.07);
        if (snowy && normal.z > 0.42) col.lerp(snowShadeTint, 0.2);
        if (snowy && normal.y < 0.58 && streak > 1.0) col.lerp(bc, 0.55);
        if (snowy && normal.y > 0.78 && streak < -1.15) col.lerp(sunTint, 0.16);
        return jitter(col, snowy ? 0.075 : 0.09, 0.02, 0.005);
      });
      const mesh = new THREE.Mesh(painted, facetMat);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      scene.add(mesh);
      return mesh;
    }

    mountainRange({
      cx: -82, cz: -142, width: 260, depth: 140, base: 5,
      peaks: [
        { x: -150, h: 22, w: 52 }, { x: -112, h: 31, w: 56 },
        { x: -68, h: 40, w: 54 }, { x: -28, h: 27, w: 44 },
        { x: 8, h: 16, w: 32 }
      ],
      segX: 64, segZ: 20, ridgeT: 0.66, baseColor: '#897da8', snowColor: '#fbf8ff',
      snowLine: 0.24, maxH: 40, rough: 1.35
    });

    mountainRange({
      cx: 0, cz: -230, width: 500, depth: 130, base: 4,
      peaks: [
        { x: -220, h: 13, w: 70 }, { x: -150, h: 17, w: 60 },
        { x: -80, h: 14, w: 60 }, { x: -10, h: 19, w: 58 },
        { x: 60, h: 22, w: 60 }, { x: 130, h: 16, w: 62 },
        { x: 200, h: 20, w: 66 }, { x: 265, h: 13, w: 60 }
      ],
      segX: 68, segZ: 14, baseColor: '#a79ac7', snowColor: '#f6f1fc',
      snowLine: 0.44, maxH: 24, rough: 1.1
    });

    mountainRange({
      cx: 0, cz: -300, width: 580, depth: 110, base: 3,
      peaks: [
        { x: -240, h: 11, w: 80 }, { x: -150, h: 15, w: 78 },
        { x: -50, h: 12, w: 70 }, { x: 50, h: 16, w: 78 },
        { x: 150, h: 13, w: 78 }, { x: 240, h: 11, w: 80 }
      ],
      segX: 54, segZ: 10, baseColor: '#b9aed3', snowColor: '#fbf8fe',
      snowLine: 0.48, maxH: 20, rough: 0.8
    });

    mountainRange({
      cx: -112, cz: -105, width: 190, depth: 70, base: 1,
      peaks: [{ x: -178, h: 6, w: 45 }, { x: -132, h: 12, w: 48 }, { x: -82, h: 9, w: 42 }],
      segX: 26, segZ: 8, baseColor: '#a79ac7', snowColor: '#eee9f7',
      snowLine: 0.10, maxH: 13, rough: 0.7
    });

    mountainRange({
      cx: 118, cz: -122, width: 200, depth: 76, base: 1,
      peaks: [{ x: 58, h: 6, w: 46 }, { x: 106, h: 10, w: 48 }, { x: 154, h: 7, w: 44 }],
      segX: 26, segZ: 8, baseColor: '#afa3ca', snowColor: '#f1edf9',
      snowLine: 0.06, maxH: 10, rough: 0.58
    });

    function createCloudBand(w, h, hex, warmHex = '#c9767c') {
      const n = 9 + Math.floor(rnd() * 4);
      const shape = new THREE.Shape();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * w * 0.5 * (0.62 + rnd() * 0.38);
        const y = Math.sin(a) * h * 0.5 * (0.3 + rnd() * 0.7) + Math.sin(a * 3 + 0.7) * h * 0.055;
        if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
      }
      shape.closePath();
      const geo = new THREE.ShapeGeometry(shape);
      const base = new THREE.Color(hex);
      const warm = new THREE.Color(warmHex);
      const shade = base.clone().multiplyScalar(0.66);
      const painted = paintFaces(geo, (cx, cy, cz, normal) => {
        const t = clamp(cy / h + 0.5, 0, 1);
        let col = base.clone().lerp(shade, (1 - t) * 0.4);
        col.lerp(warm, clamp(-cx / (w * 0.5), 0, 1) * 0.16 + (1 - t) * 0.16);
        return jitter(col, 0.04, 0.016, 0.004);
      });
      const mesh = new THREE.Mesh(painted, cloudMat);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      return mesh;
    }

    const cloudGroups = [];
    function addCloud(x, y, z, w, d, h, hex, hex2, warmHex = '#dc8c86') {
      const group = new THREE.Group();
      const main = createCloudBand(w, h, hex, warmHex);
      const under = createCloudBand(w * 0.68, h * 0.62, hex2);
      under.position.set(w * 0.07, -h * 0.38, -Math.max(1.5, d * 0.04));
      const lit = createCloudBand(w * 0.52, h * 0.42, '#b96a72', '#d58a80');
      lit.position.set(-w * 0.15, h * 0.22, -Math.max(1.2, d * 0.03));
      group.add(main, under, lit);
      group.position.set(x, y, z);
      group.rotation.z = range(-0.02, 0.02);
      group.rotation.y = range(-0.05, 0.05);
      group.userData.baseX = x;
      group.userData.phase = rnd() * 6.28;
      scene.add(group);
      cloudGroups.push(group);
    }

    addCloud(-190, 84, -330, 235, 70, 26, '#6f3b55', '#592e46', '#c07078');
    addCloud(-20, 104, -356, 310, 88, 34, '#7a405a', '#5f3048', '#c9797e');
    addCloud(160, 88, -342, 245, 72, 26, '#7f425c', '#632f4a', '#cf7e82');
    addCloud(60, 62, -310, 200, 55, 18, '#9a4f66', '#7a3c53', '#dd8e86');
    addCloud(-105, 58, -305, 170, 50, 16, '#8a465f', '#6d344c', '#cc7b7d');
    addCloud(230, 60, -334, 180, 52, 17, '#8f4a62', '#71364f', '#c9797e');
    addCloud(-10, 38, -286, 220, 46, 10, '#b15f6d', '#8c4759', '#e7a08f');
    addCloud(115, 35, -288, 150, 40, 9, '#bb6a72', '#944f60', '#efad98');
    addCloud(-115, 74, -336, 170, 62, 42, '#733d57', '#5a2f47', '#c4747b');
    addCloud(95, 94, -352, 190, 68, 46, '#7b405a', '#5f3048', '#c9797e');

    const geese = [];
    const geeseGroup = new THREE.Group();
    function createGoose() {
      const g = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: 0x4a3455, side: THREE.DoubleSide, fog: false });
      const wingGeo = new THREE.BufferGeometry();
      wingGeo.setAttribute('position', new THREE.Float32BufferAttribute([
        0, 0, 0, -1.0, 0.04, 0.16, -0.16, 0.0, -0.22
      ], 3));
      const left = new THREE.Mesh(wingGeo, mat);
      const right = new THREE.Mesh(wingGeo, mat);
      right.scale.x = -1;
      g.add(left, right);
      g.userData.left = left;
      g.userData.right = right;
      g.userData.phase = rnd() * 6.28;
      return g;
    }
    for (let i = 0; i < 7; i++) {
      const bird = createGoose();
      const k = Math.ceil(i / 2);
      const side = i % 2 === 0 ? 1 : -1;
      bird.position.set(k * 1.5 + 1.2, Math.abs(side * k) * 0.22, side * k * 1.3 + (i % 2) * 0.4);
      bird.scale.setScalar(1.8);
      geeseGroup.add(bird);
      geese.push(bird);
    }
    geeseGroup.position.set(-55, 24, -90);
    scene.add(geeseGroup);

    const smokePuffs = [];
    const doorLights = [];
    const smokeGeometry = new THREE.IcosahedronGeometry(0.09, 0);
    function addSmoke(parent, localPos, count = 8, size = 0.85) {
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xa296ad, transparent: true, opacity: 0.24, depthWrite: false, fog: true
        });
        const puff = new THREE.Mesh(smokeGeometry, mat);
        puff.position.copy(localPos);
        puff.userData = {
          base: localPos.clone(),
          phase: rnd(),
          speed: range(0.045, 0.075),
          drift: range(-0.35, 0.35),
          size: range(0.7, 1.25) * size
        };
        puff.castShadow = false;
        parent.add(puff);
        smokePuffs.push(puff);
      }
    }

    function createSnowFringe(radius, y, segments, minDrop, maxDrop) {
      const ring = [];
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        ring.push({
          x: Math.cos(a) * radius,
          z: Math.sin(a) * radius,
          drop: range(minDrop, maxDrop)
        });
      }
      const verts = [];
      for (let i = 0; i < segments; i++) {
        const r1 = ring[i];
        const r2 = ring[(i + 1) % segments];
        const mx = (r1.x + r2.x) / 2;
        const mz = (r1.z + r2.z) / 2;
        const my = y - (r1.drop + r2.drop) / 2;
        verts.push(r1.x, y, r1.z, r2.x, y, r2.z, mx, my, mz);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return faceted(geo, '#E6E0F0', { doubleSide: true, lightness: 0.035, castShadow: false });
    }

    function createGer(scale = 1, variant = {}) {
      const {
        ornament: ornamentColor = '#2a4da0',
        doorWood = '#8a5a33',
        detail = false,
        smokeCount = 8
      } = variant;
      const g = new THREE.Group();
      const R = 2.55;
      const wallH = 1.92;
      const roofH = 1.5;
      const roofRadius = R * 1.16;
      const roofBase = wallH - 0.03;
      const surfaceY = r => roofBase + roofH * (1 - r / roofRadius);

      const wall = faceted(new THREE.CylinderGeometry(R, R * 1.03, wallH, 14, 1, true), '#AEA7A1', { lightness: 0.045 });
      wall.position.y = wallH / 2;
      g.add(wall);

      const bottomBand = faceted(new THREE.TorusGeometry(R * 1.015, 0.055, 4, 18), '#5F4935', { lightness: 0.025 });
      bottomBand.rotation.x = Math.PI / 2;
      bottomBand.position.y = 0.14;
      bottomBand.castShadow = false;
      g.add(bottomBand);

      for (const y of [0.55, 1.12, 1.7]) {
        const band = faceted(new THREE.TorusGeometry(R * 1.008, 0.032, 3, 22), '#8A7A68', { lightness: 0.04 });
        band.rotation.x = Math.PI / 2;
        band.position.y = y;
        band.castShadow = false;
        g.add(band);
      }

      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const rope = faceted(new THREE.CylinderGeometry(0.017, 0.017, wallH - 0.18, 3), '#6E5B49', {
          lightness: 0.02, castShadow: false
        });
        rope.position.set(Math.cos(a) * R * 1.004, wallH / 2, Math.sin(a) * R * 1.004);
        g.add(rope);
      }

      const knot = faceted(new THREE.IcosahedronGeometry(0.075, 0), '#8A7A68', { lightness: 0.04, castShadow: false });
      knot.position.set(0.82, 1.12, R * 0.82);
      g.add(knot);
      const tassel = faceted(new THREE.CylinderGeometry(0.018, 0.038, 0.27, 4), detail ? '#C9A45E' : '#9A8466', { lightness: 0.03, castShadow: false });
      tassel.position.set(0.82, 0.955, R * 0.83);
      tassel.rotation.z = 0.05;
      g.add(tassel);

      const eave = faceted(new THREE.TorusGeometry(R * 1.1, 0.055, 4, 18), '#6B4A33', { lightness: 0.025 });
      eave.rotation.x = Math.PI / 2;
      eave.position.y = wallH - 0.01;
      eave.castShadow = false;
      g.add(eave);

      const topBand = faceted(new THREE.TorusGeometry(R * 1.012, 0.045, 3, 22), '#8B5A33', { lightness: 0.03 });
      topBand.rotation.x = Math.PI / 2;
      topBand.position.y = wallH - 0.13;
      topBand.castShadow = false;
      g.add(topBand);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const diamond = faceted(new THREE.BoxGeometry(0.075, 0.075, 0.018), i % 2 ? '#A5433A' : ornamentColor, {
          lightness: 0.02, castShadow: false
        });
        diamond.position.set(Math.cos(a) * R * 1.018, wallH - 0.13, Math.sin(a) * R * 1.018);
        diamond.rotation.y = Math.PI / 2 - a;
        diamond.rotation.z = Math.PI / 4;
        g.add(diamond);
      }

      const roof = faceted(new THREE.ConeGeometry(roofRadius, roofH, 14, 2, true), '#E9E4F1', { lightness: 0.035 });
      roof.position.y = wallH + roofH / 2 - 0.03;
      g.add(roof);

      g.add(createSnowFringe(roofRadius * 0.995, wallH + 0.02, 20, 0.055, 0.15));

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const midR = roofRadius * 0.62;
        const points = [
          new V3(Math.cos(a) * roofRadius * 1.005, wallH - 0.12, Math.sin(a) * roofRadius * 1.005),
          new V3(Math.cos(a) * roofRadius * 0.995, surfaceY(roofRadius) + 0.02, Math.sin(a) * roofRadius * 0.995),
          new V3(Math.cos(a) * midR, surfaceY(midR) + 0.02, Math.sin(a) * midR),
          new V3(Math.cos(a) * 0.56, surfaceY(0.56) + 0.015, Math.sin(a) * 0.56)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const rib = faceted(new THREE.TubeGeometry(curve, 8, 0.017, 3, false), '#5E4C3F', {
          lightness: 0.02, castShadow: false
        });
        g.add(rib);
      }

      const crown = faceted(new THREE.CylinderGeometry(0.44, 0.52, 0.14, 10), '#6B4A33', { lightness: 0.04 });
      crown.position.y = wallH + roofH - 0.08;
      g.add(crown);
      const crownRing = faceted(new THREE.TorusGeometry(0.5, 0.035, 3, 10), '#8B5A33', { lightness: 0.035, castShadow: false });
      crownRing.rotation.x = Math.PI / 2;
      crownRing.position.y = wallH + roofH - 0.14;
      g.add(crownRing);
      const crownOpening = faceted(new THREE.CylinderGeometry(0.37, 0.37, 0.02, 10), '#1D1714', { lightness: 0.01, castShadow: false });
      crownOpening.position.y = wallH + roofH - 0.005;
      g.add(crownOpening);

      const chimney = faceted(new THREE.CylinderGeometry(0.1, 0.12, 1.0, 8), '#2E2833', { lightness: 0.02 });
      chimney.position.set(0.55, wallH + roofH + 0.28, 0.22);
      g.add(chimney);
      const collar = faceted(new THREE.CylinderGeometry(0.17, 0.21, 0.08, 8), '#3A3340', { lightness: 0.02, castShadow: false });
      collar.position.set(0.55, surfaceY(0.592) + 0.05, 0.22);
      g.add(collar);
      const chimneyCap = faceted(new THREE.ConeGeometry(0.22, 0.18, 8), '#25202B', { lightness: 0.015 });
      chimneyCap.position.set(0.55, wallH + roofH + 0.82, 0.22);
      g.add(chimneyCap);

      const doorRecess = faceted(new THREE.BoxGeometry(1.18, 1.5, 0.13), '#3A2A20', { lightness: 0.02 });
      doorRecess.position.set(0, 0.76, R - 0.03);
      g.add(doorRecess);

      const doorMat = new THREE.MeshBasicMaterial({ map: doorTex, toneMapped: false });
      const glowDoor = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.28, 0.07), doorMat);
      glowDoor.position.set(0, 0.72, R + 0.04);
      g.add(glowDoor);

      const doorLeaf = faceted(new THREE.BoxGeometry(0.16, 1.24, 0.08), '#5C3A22', { lightness: 0.03 });
      doorLeaf.position.set(-0.3, 0.72, R + 0.13);
      g.add(doorLeaf);
      g.userData.doorLeaf = doorLeaf;

      const frameMatOpts = { lightness: 0.03 };
      const lintel = faceted(new THREE.BoxGeometry(1.34, 0.16, 0.2), doorWood, frameMatOpts);
      lintel.position.set(0, 1.53, R + 0.03);
      g.add(lintel);
      const threshold = faceted(new THREE.BoxGeometry(1.34, 0.1, 0.24), '#6E4729', frameMatOpts);
      threshold.position.set(0, 0.05, R + 0.08);
      g.add(threshold);
      for (const x of [-0.58, 0.58]) {
        const post = faceted(new THREE.BoxGeometry(0.14, 1.58, 0.2), doorWood, frameMatOpts);
        post.position.set(x, 0.8, R + 0.04);
        g.add(post);
        const hinge = faceted(new THREE.BoxGeometry(0.05, 0.12, 0.07), '#3A2B1E', { lightness: 0.02, castShadow: false });
        hinge.position.set(-0.56, x < 0 ? 0.45 : 1.15, R + 0.15);
        g.add(hinge);
      }

      const ornament = faceted(new THREE.BoxGeometry(1.15, 0.075, 0.22), ornamentColor, { lightness: 0.03, castShadow: false });
      ornament.position.set(0, 1.62, R + 0.04);
      g.add(ornament);
      for (const x of [-0.34, 0, 0.34]) {
        const dot = faceted(new THREE.BoxGeometry(0.1, 0.1, 0.02), x === 0 ? '#C9A45E' : '#A5433A', {
          lightness: 0.02, castShadow: false
        });
        dot.position.set(x, 1.62, R + 0.16);
        dot.rotation.z = Math.PI / 4;
        g.add(dot);
      }
      if (detail) {
        const handle = faceted(new THREE.BoxGeometry(0.035, 0.16, 0.035), '#C9A45E', { lightness: 0.03, castShadow: false });
        handle.position.set(0.1, 0.78, R + 0.19);
        g.add(handle);
        for (const x of [-0.35, 0.35]) {
          const motif = faceted(new THREE.BoxGeometry(0.07, 0.07, 0.02), '#2A4DA0', { lightness: 0.025, castShadow: false });
          motif.position.set(x, 1.32, R + 0.19);
          motif.rotation.z = Math.PI / 4;
          g.add(motif);
        }
      }

      const step = faceted(new THREE.BoxGeometry(1.42, 0.11, 0.5), '#6B4A33', { lightness: 0.03 });
      step.position.set(0, 0.055, R + 0.36);
      g.add(step);
      for (const x of [-0.4, 0.35]) {
        const snow = faceted(new THREE.IcosahedronGeometry(0.16, 0), '#D8D2E8', { lightness: 0.03, castShadow: false });
        snow.scale.set(1.3, 0.3, 0.8);
        snow.position.set(x, 0.115, R + 0.48);
        g.add(snow);
      }

      const doorLight = new THREE.PointLight(0xff8a40, 6, 10, 2);
      doorLight.position.set(0, 0.95, R + 0.65);
      g.add(doorLight);
      doorLights.push(doorLight);

      const doorPool = glowPlane(4.2, 0.22);
      doorPool.position.set(0, 0.045, R + 1.35);
      g.add(doorPool);

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const snowBank = faceted(new THREE.IcosahedronGeometry(range(0.5, 0.75), 0), '#C9C2E2', { lightness: 0.035 });
        snowBank.scale.set(1.75, 0.3, 1.05);
        snowBank.position.set(Math.cos(a) * R * 1.02, 0.08, Math.sin(a) * R * 1.02);
        snowBank.rotation.y = rnd() * Math.PI;
        snowBank.castShadow = false;
        g.add(snowBank);
      }

      const baseShadow = contactShadow(R * 2.9, R * 2.9, 0.34);
      baseShadow.position.y = 0.008;
      g.add(baseShadow);

      g.scale.setScalar(scale);
      addSmoke(g, new V3(0.55, wallH + roofH + 0.95, 0.22), smokeCount, detail ? 1.0 : 0.8);
      g.userData.roofHeight = (wallH + roofH) * scale;
      return g;
    }

    function placeGer(x, z, rot, scale, variant = {}) {
      const ger = createGer(scale, variant);
      ger.position.set(x, groundHeight(x, z), z);
      ger.rotation.y = rot;
      scene.add(ger);
      return ger;
    }

    const gerMain = placeGer(0.8, -6.3, -0.42, 1.2, {
      ornament: '#2A4DA0', doorWood: '#8A5A33', detail: true, smokeCount: 9
    });
    const gerSecond = placeGer(-6.5, -12.2, 0.46, 0.9, {
      ornament: '#8E3A33', doorWood: '#6F4A2E', detail: false, smokeCount: 7
    });
    const gerThird = placeGer(14.8, -17.5, -0.78, 0.76, {
      ornament: '#2E6F7A', doorWood: '#7D5A3A', detail: false, smokeCount: 6
    });

    function addHat(head, type, hatColor, accent, fur) {
      const metalColor = '#C9A45E';
      const snowColor = '#E4DEF2';

      if (type === 'fur') {
        const band = figurePart(new THREE.CylinderGeometry(0.18, 0.2, 0.1, 9), fur, { lightness: 0.05 });
        band.position.y = 0.125;
        head.add(band);
        addFurTufts(head, 0.185, 0.125, 16, fur, 0.72);
        const bandLip = figurePart(new THREE.CylinderGeometry(0.202, 0.206, 0.028, 9), fur, {
          lightness: 0.04, castShadow: false
        });
        bandLip.position.y = 0.078;
        head.add(bandLip);

        const crown = figurePart(new THREE.CylinderGeometry(0.125, 0.145, 0.15, 8), hatColor, { lightness: 0.03 });
        crown.position.y = 0.21;
        head.add(crown);
        const top = figurePart(new THREE.IcosahedronGeometry(0.125, 0), hatColor, { lightness: 0.03 });
        top.scale.set(1.0, 0.55, 1.0);
        top.position.y = 0.30;
        head.add(top);

        const crownBand = figurePart(new THREE.CylinderGeometry(0.131, 0.133, 0.03, 8), accent, {
          lightness: 0.03, castShadow: false
        });
        crownBand.position.y = 0.185;
        head.add(crownBand);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const stud = figurePart(new THREE.BoxGeometry(0.014, 0.02, 0.012), metalColor, {
            lightness: 0.02, castShadow: false
          });
          stud.position.set(Math.cos(a) * 0.132, 0.185, Math.sin(a) * 0.132);
          stud.rotation.y = -a;
          head.add(stud);
        }

        const crownSeam = figurePart(new THREE.BoxGeometry(0.014, 0.13, 0.2), hatColor, {
          lightness: 0.04, castShadow: false
        });
        crownSeam.position.set(0, 0.245, 0.01);
        head.add(crownSeam);

        const button = figurePart(new THREE.IcosahedronGeometry(0.028, 0), accent, { lightness: 0.02 });
        button.position.y = 0.355;
        head.add(button);

        const frost = figurePart(new THREE.IcosahedronGeometry(0.085, 0), snowColor, {
          lightness: 0.02, castShadow: false
        });
        frost.scale.set(1.0, 0.4, 1.0);
        frost.position.y = 0.335;
        head.add(frost);

        for (const sx of [-1, 1]) {
          const flap = figurePart(new THREE.ConeGeometry(0.056, 0.19, 4), fur, { lightness: 0.04, castShadow: false });
          flap.rotation.set(Math.PI + 0.12, 0, sx * 0.2);
          flap.position.set(sx * 0.168, -0.045, 0.01);
          head.add(flap);
          const lining = figurePart(new THREE.ConeGeometry(0.034, 0.12, 4), accent, {
            lightness: 0.03, castShadow: false
          });
          lining.rotation.set(Math.PI + 0.12, 0, sx * 0.2);
          lining.position.set(sx * 0.15, -0.04, 0.052);
          head.add(lining);
          const cord = figurePart(new THREE.BoxGeometry(0.008, 0.16, 0.008), '#4a3f37', {
            lightness: 0.02, castShadow: false
          });
          cord.position.set(sx * 0.16, -0.14, 0.03);
          cord.rotation.z = sx * 0.16;
          head.add(cord);
        }
      } else if (type === 'peaked') {
        const brim = figurePart(new THREE.CylinderGeometry(0.205, 0.22, 0.055, 8), fur, { lightness: 0.04 });
        brim.position.y = 0.12;
        brim.rotation.x = -0.18;
        head.add(brim);
        addFurTufts(head, 0.206, 0.12, 15, fur, 0.48);
        const stem = figurePart(new THREE.CylinderGeometry(0.145, 0.16, 0.045, 8), accent, { lightness: 0.03, castShadow: false });
        stem.position.y = 0.158;
        head.add(stem);
        const crown = figurePart(new THREE.ConeGeometry(0.14, 0.24, 8), hatColor, { lightness: 0.035 });
        crown.position.y = 0.245;
        head.add(crown);

        const swirl = figurePart(new THREE.CylinderGeometry(0.112, 0.126, 0.036, 8), accent, {
          lightness: 0.03, castShadow: false
        });
        swirl.position.y = 0.238;
        head.add(swirl);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const stud = figurePart(new THREE.BoxGeometry(0.012, 0.026, 0.01), metalColor, {
            lightness: 0.02, castShadow: false
          });
          stud.position.set(Math.cos(a) * 0.125, 0.238, Math.sin(a) * 0.125);
          stud.rotation.y = -a;
          head.add(stud);
        }

        const knob = figurePart(new THREE.IcosahedronGeometry(0.042, 0), accent, { lightness: 0.025 });
        knob.position.y = 0.38;
        head.add(knob);
        for (let i = 0; i < 3; i++) {
          const tassel = figurePart(new THREE.ConeGeometry(0.012, 0.11, 3), metalColor, {
            lightness: 0.03, castShadow: false
          });
          tassel.position.set((i - 1) * 0.018, 0.315, (i === 1 ? 0.014 : -0.012));
          tassel.rotation.x = 0.2;
          head.add(tassel);
        }

        const peakFrost = figurePart(new THREE.IcosahedronGeometry(0.05, 0), snowColor, {
          lightness: 0.02, castShadow: false
        });
        peakFrost.scale.set(1.0, 0.35, 1.0);
        peakFrost.position.set(0, 0.3, 0.08);
        head.add(peakFrost);

        for (const sx of [-1, 1]) {
          const flap = figurePart(new THREE.ConeGeometry(0.046, 0.16, 4), fur, {
            lightness: 0.04, castShadow: false
          });
          flap.rotation.set(Math.PI + 0.12, 0, sx * 0.24);
          flap.position.set(sx * 0.168, -0.04, 0.01);
          head.add(flap);
          const cord = figurePart(new THREE.BoxGeometry(0.008, 0.15, 0.008), '#4a3f37', {
            lightness: 0.02, castShadow: false
          });
          cord.position.set(sx * 0.155, -0.135, 0.025);
          head.add(cord);
        }
      } else {
        const band = figurePart(new THREE.CylinderGeometry(0.17, 0.185, 0.06, 8), fur, { lightness: 0.04 });
        band.position.y = 0.115;
        head.add(band);
        const dome = figurePart(new THREE.SphereGeometry(0.165, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), hatColor, { lightness: 0.035 });
        dome.position.y = 0.115;
        dome.scale.y = 0.72;
        head.add(dome);

        const domeSeam = figurePart(new THREE.BoxGeometry(0.012, 0.02, 0.29), hatColor, {
          lightness: 0.05, castShadow: false
        });
        domeSeam.position.set(0, 0.232, 0.01);
        head.add(domeSeam);

        const patternBand = figurePart(new THREE.CylinderGeometry(0.171, 0.173, 0.036, 8), accent, {
          lightness: 0.03, castShadow: false
        });
        patternBand.position.y = 0.145;
        head.add(patternBand);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const stud = figurePart(new THREE.BoxGeometry(0.012, 0.024, 0.01), metalColor, {
            lightness: 0.02, castShadow: false
          });
          stud.position.set(Math.cos(a) * 0.174, 0.145, Math.sin(a) * 0.174);
          stud.rotation.y = -a;
          head.add(stud);
        }

        const turnUp = figurePart(new THREE.CylinderGeometry(0.198, 0.198, 0.022, 8), hatColor, {
          lightness: 0.04, castShadow: false
        });
        turnUp.position.y = 0.102;
        head.add(turnUp);

        const knot = figurePart(new THREE.IcosahedronGeometry(0.026, 0), accent, { lightness: 0.02, castShadow: false });
        knot.position.y = 0.24;
        head.add(knot);
      }
    }

    function makeHand(skin) {
      const g = new THREE.Group();
      const palm = figurePart(new THREE.BoxGeometry(0.085, 0.075, 0.09), skin, { lightness: 0.025 });
      palm.position.z = 0.04;
      g.add(palm);

      const knuckleRow = figurePart(new THREE.BoxGeometry(0.076, 0.024, 0.026), skin, {
        lightness: 0.02, castShadow: false
      });
      knuckleRow.position.set(0, 0.03, 0.081);
      g.add(knuckleRow);

      const nailColor = new THREE.Color(skin).offsetHSL(0, -0.04, 0.09).getStyle();
      for (let i = 0; i < 4; i++) {
        const fx = (i - 1.5) * 0.0195;
        const len = (i === 0 || i === 3) ? 0.05 : 0.058;
        const prox = figurePart(new THREE.BoxGeometry(0.018, 0.019, len * 0.55), skin, {
          lightness: 0.02, castShadow: false
        });
        prox.position.set(fx, 0.01, 0.104);
        prox.rotation.x = 0.05 + i * 0.02;
        g.add(prox);
        const mid = figurePart(new THREE.BoxGeometry(0.016, 0.017, len * 0.5), skin, {
          lightness: 0.02, castShadow: false
        });
        mid.position.set(fx, 0.004, 0.104 + len * 0.48);
        mid.rotation.x = 0.1 + i * 0.025;
        g.add(mid);
        const nail = figurePart(new THREE.BoxGeometry(0.011, 0.005, 0.013), nailColor, {
          lightness: 0.01, castShadow: false
        });
        nail.position.set(fx, 0.014, 0.104 + len * 0.9);
        nail.rotation.x = 0.18;
        g.add(nail);
      }

      const thumbBase = figurePart(new THREE.BoxGeometry(0.022, 0.024, 0.03), skin, {
        lightness: 0.02, castShadow: false
      });
      thumbBase.position.set(-0.05, -0.008, 0.028);
      thumbBase.rotation.y = 0.8;
      thumbBase.rotation.z = -0.2;
      g.add(thumbBase);
      const thumb = figurePart(new THREE.BoxGeometry(0.02, 0.022, 0.05), skin, {
        lightness: 0.02, castShadow: false
      });
      thumb.position.set(-0.058, -0.008, 0.055);
      thumb.rotation.y = 0.8;
      thumb.rotation.z = -0.2;
      g.add(thumb);
      const thumbTip = figurePart(new THREE.BoxGeometry(0.016, 0.017, 0.022), skin, {
        lightness: 0.02, castShadow: false
      });
      thumbTip.position.set(-0.062, -0.005, 0.082);
      thumbTip.rotation.y = 0.8;
      thumbTip.rotation.z = -0.2;
      g.add(thumbTip);

      const wrist = figurePart(new THREE.CylinderGeometry(0.04, 0.045, 0.05, 5), skin, {
        lightness: 0.02, castShadow: false
      });
      wrist.rotation.x = Math.PI / 2;
      wrist.position.set(0, 0, -0.012);
      g.add(wrist);

      return g;
    }

    function createPerson(cfg) {
      const {
        pose = 'seatA', coat = '#3E4F8F', accent = '#D2A24A', trim = '#C9D6E4',
        hatType = 'fur', hatColor = '#2E2A33', fur = '#C9B79C',
        skin = '#C98A5E', beard = 'none', headTurn = 0, tilt = 0, headPitch = 0,
        lean = 0.04, seat = null, height = 1, expression = 'neutral',
        beardColor = '#4a3a30', earring = false, legs = null, beads = false, age = 0
      } = cfg;

      const g = new THREE.Group();
      const seated = pose !== 'standing';
      const torsoH = seated ? 0.64 : 0.66;
      const hipY = seated ? 0.5 : 0.92;

      const upper = new THREE.Group();
      upper.position.y = hipY;
      upper.rotation.x = lean;
      g.add(upper);

      const skinMid = new THREE.Color(skin);
      const skinLight = skinMid.clone().offsetHSL(0.01, 0.02, 0.05);
      const skinShadow = skinMid.clone().offsetHSL(-0.015, -0.02, -0.08);
      const cheek = new THREE.Color('#B9714A');

      const torso = figurePart(new THREE.CylinderGeometry(0.34, 0.28, torsoH, 8), coat, { lightness: 0.055 });
      torso.position.y = torsoH / 2;
      upper.add(torso);

      const hemTrim = figurePart(new THREE.CylinderGeometry(0.343, 0.345, 0.055, 8), trim, { lightness: 0.03, castShadow: false });
      hemTrim.position.y = 0.045;
      upper.add(hemTrim);

      const hemBand = figurePart(new THREE.CylinderGeometry(0.346, 0.346, 0.018, 8), accent, {
        lightness: 0.03, castShadow: false
      });
      hemBand.position.y = 0.085;
      upper.add(hemBand);

      for (const sx of [-1, 1]) {
        const shoulder = figurePart(new THREE.IcosahedronGeometry(0.118, 0), coat, { lightness: 0.05 });
        shoulder.scale.set(1.0, 0.76, 0.9);
        shoulder.position.set(sx * 0.305, torsoH - 0.035, 0);
        upper.add(shoulder);
        const snowCap = figurePart(new THREE.IcosahedronGeometry(0.072, 0), '#ded8ee', {
          lightness: 0.02, castShadow: false
        });
        snowCap.scale.set(1.1, 0.26, 0.85);
        snowCap.position.set(sx * 0.305, torsoH + 0.04, 0);
        upper.add(snowCap);
        const yoke = figurePart(new THREE.BoxGeometry(0.13, 0.026, 0.19), trim, { lightness: 0.03, castShadow: false });
        yoke.position.set(sx * 0.235, torsoH - 0.062, 0.015);
        yoke.rotation.z = sx * 0.22;
        upper.add(yoke);
        const pocket = figurePart(new THREE.BoxGeometry(0.115, 0.085, 0.018), coat, { lightness: 0.06, castShadow: false });
        pocket.position.set(sx * 0.215, torsoH * 0.42, 0.255);
        pocket.rotation.set(0, -sx * 0.5, 0);
        upper.add(pocket);
        const pocketFlap = figurePart(new THREE.BoxGeometry(0.12, 0.03, 0.022), trim, { lightness: 0.03, castShadow: false });
        pocketFlap.position.set(sx * 0.215, torsoH * 0.42 + 0.052, 0.258);
        pocketFlap.rotation.set(0, -sx * 0.5, 0);
        upper.add(pocketFlap);
      }

      const backVent = figurePart(new THREE.BoxGeometry(0.022, torsoH * 0.62, 0.016), trim, {
        lightness: 0.03, castShadow: false
      });
      backVent.position.set(0, torsoH * 0.46, -0.325);
      upper.add(backVent);

      const wrapGroup = new THREE.Group();
      wrapGroup.position.set(0.02, torsoH * 0.49, 0.302);
      wrapGroup.rotation.z = -0.48;
      upper.add(wrapGroup);
      const wrap = figurePart(new THREE.BoxGeometry(0.11, torsoH * 0.9, 0.024), coat, { lightness: 0.08, castShadow: false });
      wrapGroup.add(wrap);
      const wrapTrim = figurePart(new THREE.BoxGeometry(0.022, torsoH * 0.9, 0.028), trim, { lightness: 0.03, castShadow: false });
      wrapTrim.position.set(-0.04, 0, 0.007);
      wrapGroup.add(wrapTrim);

      for (let i = 0; i < 5; i++) {
        const ly = -torsoH * 0.34 + i * (torsoH * 0.17);
        const scroll = figurePart(new THREE.TorusGeometry(0.016, 0.005, 3, 8), accent, {
          lightness: 0.03, castShadow: false
        });
        scroll.scale.set(1.45, 0.8, 1);
        scroll.position.set(0.016, ly, 0.016);
        scroll.rotation.set(0, 0, (i % 2 ? 1 : -1) * 0.22);
        wrapGroup.add(scroll);
      }

      for (let i = 0; i < 3; i++) {
        const ly = -torsoH * 0.24 + i * (torsoH * 0.24);
        const toggle = figurePart(new THREE.BoxGeometry(0.085, 0.015, 0.018), trim, {
          lightness: 0.03, castShadow: false
        });
        toggle.position.set(-0.028, ly, 0.018);
        toggle.rotation.z = 0.28;
        wrapGroup.add(toggle);
        const toggleKnot = figurePart(new THREE.IcosahedronGeometry(0.011, 0), accent, {
          lightness: 0.02, castShadow: false
        });
        toggleKnot.position.set(-0.063, ly - 0.005, 0.019);
        wrapGroup.add(toggleKnot);
      }

      const sash = figurePart(new THREE.CylinderGeometry(0.328, 0.328, 0.105, 8), accent, { lightness: 0.035 });
      sash.position.y = 0.115;
      upper.add(sash);
      const sashKnot = figurePart(new THREE.IcosahedronGeometry(0.05, 0), accent, { lightness: 0.03, castShadow: false });
      sashKnot.position.set(-0.2, 0.115, 0.285);
      upper.add(sashKnot);

      const tailShape = new THREE.Shape();
      tailShape.moveTo(-0.05, 0.02);
      tailShape.lineTo(0.05, 0.02);
      tailShape.lineTo(0.04, -0.17);
      tailShape.lineTo(0, -0.24);
      tailShape.lineTo(-0.04, -0.17);
      tailShape.closePath();
      const sashTail = figurePart(new THREE.ShapeGeometry(tailShape), accent, { doubleSide: true, lightness: 0.03, castShadow: false });
      sashTail.position.set(-0.17, 0.095, 0.298);
      sashTail.rotation.z = 0.08;
      upper.add(sashTail);

      for (let i = 0; i < 3; i++) {
        const tassel = figurePart(new THREE.ConeGeometry(0.012, 0.07, 3), accent, {
          lightness: 0.03, castShadow: false
        });
        tassel.position.set(-0.205 + i * 0.032, -0.145, 0.3);
        tassel.rotation.z = (i - 1) * 0.18;
        upper.add(tassel);
      }

      const buckle = figurePart(new THREE.TorusGeometry(0.036, 0.011, 3, 9), '#C9A45E', {
        lightness: 0.025, castShadow: false
      });
      buckle.position.set(0.04, 0.115, 0.328);
      upper.add(buckle);
      const buckleTongue = figurePart(new THREE.BoxGeometry(0.075, 0.012, 0.012), '#C9A45E', {
        lightness: 0.025, castShadow: false
      });
      buckleTongue.position.set(0.04, 0.115, 0.331);
      buckleTongue.rotation.z = 0.25;
      upper.add(buckleTongue);

      const pouch = figurePart(new THREE.IcosahedronGeometry(0.058, 0), '#5A4432', { lightness: 0.04 });
      pouch.scale.set(0.85, 1.15, 0.5);
      pouch.position.set(0.22, 0.085, 0.24);
      pouch.rotation.z = 0.18;
      upper.add(pouch);
      const pouchFlap = figurePart(new THREE.BoxGeometry(0.09, 0.026, 0.05), '#3f3126', {
        lightness: 0.03, castShadow: false
      });
      pouchFlap.position.set(0.215, 0.128, 0.245);
      pouchFlap.rotation.z = 0.18;
      upper.add(pouchFlap);
      const pouchStrap = figurePart(new THREE.BoxGeometry(0.016, 0.16, 0.016), '#3f3126', {
        lightness: 0.02, castShadow: false
      });
      pouchStrap.position.set(0.235, 0.2, 0.245);
      pouchStrap.rotation.z = 0.22;
      upper.add(pouchStrap);

      const neck = figurePart(new THREE.CylinderGeometry(0.075, 0.085, 0.16, 6), skinMid, { lightness: 0.025 });
      neck.position.y = torsoH + 0.04;
      upper.add(neck);

      const neckShade = figurePart(new THREE.SphereGeometry(0.086, 7, 4), skinShadow, {
        lightness: 0.012, castShadow: false
      });
      neckShade.scale.set(1.0, 0.5, 0.85);
      neckShade.position.set(0, torsoH + 0.108, 0.012);
      upper.add(neckShade);

      const collar = figurePart(new THREE.CylinderGeometry(0.175, 0.205, 0.12, 8), trim, { lightness: 0.035 });
      collar.position.y = torsoH + 0.005;
      collar.rotation.x = 0.07;
      upper.add(collar);

      for (const sx of [-1, 1]) {
        const collarFlap = figurePart(new THREE.BoxGeometry(0.085, 0.115, 0.018), trim, {
          lightness: 0.03, castShadow: false
        });
        collarFlap.position.set(sx * 0.072, torsoH + 0.082, 0.132);
        collarFlap.rotation.set(0.26, -sx * 0.32, sx * 0.1);
        upper.add(collarFlap);
        const collarTip = figurePart(new THREE.BoxGeometry(0.085, 0.022, 0.02), accent, {
          lightness: 0.03, castShadow: false
        });
        collarTip.position.set(sx * 0.081, torsoH + 0.135, 0.157);
        collarTip.rotation.set(0.26, -sx * 0.32, sx * 0.1);
        upper.add(collarTip);
      }

      addFurTufts(upper, 0.22, torsoH - 0.02, 10, fur, 0.8);
      addFurTufts(upper, 0.183, torsoH + 0.055, 12, fur, 0.62);

      if (beads) {
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * Math.PI * 2;
          const bead = figurePart(new THREE.IcosahedronGeometry(0.016, 0), i % 4 === 0 ? '#C9A45E' : '#4A3A2E', {
            lightness: 0.03, castShadow: false
          });
          bead.position.set(Math.cos(a) * 0.135, torsoH + 0.105 + Math.sin(a) * 0.03, Math.sin(a) * 0.115);
          upper.add(bead);
        }
        const guru = figurePart(new THREE.IcosahedronGeometry(0.026, 0), '#C9A45E', { lightness: 0.025 });
        guru.position.set(0, torsoH + 0.075, 0.14);
        upper.add(guru);
      }

      const head = new THREE.Group();
      head.position.set(0, torsoH + 0.20, 0.015);
      head.rotation.x = headPitch;
      head.rotation.y = headTurn;
      head.rotation.z = tilt;
      head.scale.setScalar(0.84);
      upper.add(head);

      const skullGeo = new THREE.IcosahedronGeometry(0.165, 1);
      {
        const sp = skullGeo.attributes.position;
        for (let i = 0; i < sp.count; i++) {
          const x = sp.getX(i), y = sp.getY(i), z = sp.getZ(i);
          if (y < 0) {
            const f = 1 + (y / 0.165) * 0.16;
            sp.setX(i, x * f);
            sp.setZ(i, z * f);
          }
          if (y < -0.072) {
            const k = (-y - 0.072) / 0.093;
            sp.setX(i, sp.getX(i) * (1 - k * 0.44));
            sp.setZ(i, sp.getZ(i) * (1 - k * 0.18) + k * 0.016);
          }
          if (z < -0.055) sp.setZ(i, z * 0.93);
        }
        skullGeo.scale(0.98, 1.08, 0.96);
      }
      const skull = figureCustom(skullGeo, (cx, cy, cz, normal) => {
        let col = normal.y > 0.35 ? skinLight : (normal.z < -0.15 ? skinShadow : skinMid);
        if (cy > 0.055 && normal.z > 0) col = skinLight.clone().lerp(skinMid, 0.25);
        if (Math.abs(normal.x) > 0.5 && normal.z > 0.15) col = col.clone().lerp(cheek, 0.3);
        if (normal.y < -0.45) col = col.clone().lerp(skinShadow, 0.32);
        if (Math.abs(normal.x) > 0.8 && normal.y > -0.15) col = col.clone().lerp(skinShadow, 0.2);
        if (cz > 0.09 && cy < 0.005 && cy > -0.085 && Math.abs(cx) < 0.035) col = skinLight.clone();
        return jitter(col, 0.03, 0.014, 0.004);
      });
      head.add(skull);

      for (const sx of [-1, 1]) {
        const cheekBone = figurePart(new THREE.IcosahedronGeometry(0.05, 0), skinLight, {
          lightness: 0.018, castShadow: false
        });
        cheekBone.scale.set(0.92, 0.55, 0.62);
        cheekBone.position.set(sx * 0.086, 0.006, 0.114);
        cheekBone.rotation.z = sx * 0.4;
        head.add(cheekBone);
      }

      const chin = figurePart(new THREE.IcosahedronGeometry(0.038, 0), skinMid, { lightness: 0.02, castShadow: false });
      chin.scale.set(1.0, 0.66, 0.78);
      chin.position.set(0, -0.142, 0.08);
      head.add(chin);

      const philtrum = figurePart(new THREE.BoxGeometry(0.014, 0.026, 0.012), skinShadow, {
        lightness: 0.006, castShadow: false
      });
      philtrum.position.set(0, -0.046, 0.15);
      head.add(philtrum);

      for (const sx of [-1, 1]) {
        const wing = figurePart(new THREE.IcosahedronGeometry(0.016, 0), skinMid, {
          lightness: 0.02, castShadow: false
        });
        wing.scale.set(1.0, 0.82, 0.68);
        wing.position.set(sx * 0.027, -0.033, 0.152);
        head.add(wing);

        const fold = tube(
          new V3(sx * 0.042, -0.026, 0.148),
          new V3(sx * 0.061, -0.064, 0.14),
          0.0042, 0.0032, skinShadow,
          { lightness: 0.008, figure: true, segments: 3, castShadow: false }
        );
        head.add(fold);
      }

      if (expression === 'smile' || expression === 'warm') {
        for (const sx of [-1, 1]) {
          const laugh = tube(
            new V3(sx * 0.099, 0.017, 0.135),
            new V3(sx * 0.124, -0.013, 0.121),
            0.0038, 0.0029, skinShadow,
            { lightness: 0.008, figure: true, segments: 3, castShadow: false }
          );
          head.add(laugh);
        }
      }

      if (age > 0) {
        for (let i = 0; i < 3; i++) {
          const line = figurePart(new THREE.BoxGeometry(0.112 - i * 0.014, 0.006, 0.014), skinShadow, {
            lightness: 0.006, castShadow: false
          });
          line.position.set(0, 0.079 + i * 0.027, 0.139 - i * 0.011);
          line.rotation.x = -0.2;
          head.add(line);
        }
        for (const sx of [-1, 1]) {
          const temple = figurePart(new THREE.BoxGeometry(0.012, 0.048, 0.05), skinShadow, {
            lightness: 0.008, castShadow: false
          });
          temple.position.set(sx * 0.128, 0.05, 0.088);
          head.add(temple);
        }
      }

      for (const sx of [-1, 1]) {
        const wisp = figurePart(new THREE.BoxGeometry(0.028, 0.055, 0.05), beardColor, {
          lightness: 0.025, castShadow: false
        });
        wisp.position.set(sx * 0.146, -0.052, 0.008);
        wisp.rotation.z = sx * 0.12;
        head.add(wisp);
      }

      const nose = figurePart(new THREE.ConeGeometry(0.034, 0.085, 4), skinMid, { lightness: 0.02, castShadow: false });
      nose.rotation.x = Math.PI / 2;
      nose.position.set(0, -0.012, 0.17);
      head.add(nose);

      const noseBridge = figurePart(new THREE.BoxGeometry(0.038, 0.07, 0.025), skinLight, {
        lightness: 0.02, castShadow: false
      });
      noseBridge.position.set(0, 0.025, 0.154);
      noseBridge.rotation.x = 0.14;
      head.add(noseBridge);
      for (const sx of [-1, 1]) {
        const nostril = figurePart(new THREE.IcosahedronGeometry(0.009, 0), skinShadow, {
          lightness: 0.006, castShadow: false
        });
        nostril.scale.set(1.0, 0.6, 0.5);
        nostril.position.set(sx * 0.017, -0.043, 0.174);
        head.add(nostril);
      }

      const jaw = figurePart(new THREE.SphereGeometry(0.065, 6, 4), skinMid, { lightness: 0.02, castShadow: false });
      jaw.scale.set(1.05, 0.55, 0.7);
      jaw.position.set(0, -0.108, 0.06);
      head.add(jaw);

      const eyeGroups = [];
      const brows = [];
      for (const sx of [-1, 1]) {
        const socket = figurePart(new THREE.BoxGeometry(0.078, 0.046, 0.014), skinShadow, {
          lightness: 0.012, castShadow: false
        });
        socket.position.set(sx * 0.064, 0.027, 0.142);
        head.add(socket);

        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(sx * 0.064, 0.028, 0.149);
        head.add(eyeGroup);
        const white = figurePart(new THREE.SphereGeometry(0.027, 6, 4), '#e8d6c2', {
          lightness: 0.02, castShadow: false
        });
        white.scale.set(0.98, 0.6, 0.4);
        eyeGroup.add(white);
        const pupil = figurePart(new THREE.SphereGeometry(0.0145, 5, 4), '#241813', {
          lightness: 0.006, castShadow: false
        });
        pupil.position.set(sx * 0.002, 0.001, 0.012);
        pupil.scale.set(1.0, 1.0, 0.65);
        eyeGroup.add(pupil);
        const catchlight = figurePart(new THREE.SphereGeometry(0.0035, 4, 3), '#fff4e4', {
          lightness: 0.01, castShadow: false
        });
        catchlight.position.set(sx * 0.002 + 0.003, 0.006, 0.017);
        eyeGroup.add(catchlight);
        const lid = figurePart(new THREE.BoxGeometry(0.066, 0.014, 0.016), skinMid, {
          lightness: 0.02, castShadow: false
        });
        lid.position.set(0, 0.015, 0.006);
        lid.rotation.z = sx * 0.04;
        eyeGroup.add(lid);
        const crease = figurePart(new THREE.BoxGeometry(0.052, 0.0045, 0.012), skinShadow, {
          lightness: 0.008, castShadow: false
        });
        crease.position.set(0, -0.016, 0.007);
        eyeGroup.add(crease);

        const lowerLid = figurePart(new THREE.BoxGeometry(0.056, 0.008, 0.012), skinShadow, {
          lightness: 0.008, castShadow: false
        });
        lowerLid.position.set(0, -0.021, 0.006);
        eyeGroup.add(lowerLid);

        for (let k = 0; k < 3; k++) {
          const lash = figurePart(new THREE.BoxGeometry(0.013, 0.007, 0.011), '#241813', {
            lightness: 0.006, castShadow: false
          });
          lash.position.set(sx * (0.014 + k * 0.009), 0.016 - k * 0.002, 0.009);
          lash.rotation.z = sx * (0.42 - k * 0.1);
          eyeGroup.add(lash);
        }
        pupil.userData.noMerge = true;
        eyeGroups.push({ group: eyeGroup, pupil, baseX: pupil.position.x, baseY: pupil.position.y });

        const ear = figurePart(new THREE.IcosahedronGeometry(0.045, 0), skinMid, { lightness: 0.02, castShadow: false });
        ear.scale.set(0.55, 1.0, 0.55);
        ear.position.set(sx * 0.165, -0.005, 0);
        head.add(ear);
        const innerEar = figurePart(new THREE.IcosahedronGeometry(0.022, 0), skinShadow, {
          lightness: 0.008, castShadow: false
        });
        innerEar.scale.set(0.5, 1.0, 0.35);
        innerEar.position.set(sx * 0.17, -0.005, 0.012);
        head.add(innerEar);

        const helix = figurePart(new THREE.TorusGeometry(0.031, 0.0075, 3, 7, Math.PI * 1.3), skinMid, {
          lightness: 0.02, castShadow: false
        });
        helix.rotation.set(0, Math.PI / 2, sx * 0.95);
        helix.position.set(sx * 0.171, 0.005, -0.004);
        head.add(helix);

        const lobe = figurePart(new THREE.IcosahedronGeometry(0.014, 0), skinMid, {
          lightness: 0.02, castShadow: false
        });
        lobe.scale.set(0.62, 1.0, 0.8);
        lobe.position.set(sx * 0.166, -0.049, 0.004);
        head.add(lobe);
        if (earring && sx === 1) {
          const ring = figurePart(new THREE.TorusGeometry(0.018, 0.004, 3, 6), '#C9A45E', {
            lightness: 0.03, castShadow: false
          });
          ring.rotation.x = Math.PI / 2;
          ring.position.set(sx * 0.17, -0.06, 0.015);
          head.add(ring);
        }

        const browColor = beard === 'full' ? beardColor : '#3a2a22';
        const brow = figurePart(new THREE.BoxGeometry(0.082, 0.016, 0.02), browColor, {
          lightness: 0.02, castShadow: false
        });
        brow.position.set(sx * 0.066, 0.068, 0.149);
        brow.rotation.z = sx * (expression === 'sing' ? -0.16 : expression === 'warm' ? -0.06 : -0.10);
        head.add(brow);
        brow.userData.noMerge = true;
        brows.push({ mesh: brow, baseZ: brow.rotation.z, baseY: brow.position.y });

        for (let k = 0; k < 4; k++) {
          const stroke = figurePart(new THREE.BoxGeometry(0.013, 0.008, 0.011), browColor, {
            lightness: 0.02, castShadow: false
          });
          stroke.position.set(sx * 0.066 + (k - 1.5) * 0.019, 0.076 + (k === 1 || k === 2 ? 0.003 : 0), 0.151);
          stroke.rotation.z = sx * (expression === 'sing' ? -0.16 : expression === 'warm' ? -0.06 : -0.10);
          head.add(stroke);
        }
      }

      const mouthGroup = new THREE.Group();
      mouthGroup.position.set(0, -0.072, 0.158);
      head.add(mouthGroup);
      let mouthKind = 'smile';
      if (expression === 'sing') {
        mouthKind = 'open';
        const inner = figurePart(new THREE.SphereGeometry(0.036, 6, 4), '#3a1d1a', {
          lightness: 0.008, castShadow: false
        });
        inner.scale.set(1.35, 0.9, 0.4);
        mouthGroup.add(inner);
        const teeth = figurePart(new THREE.BoxGeometry(0.056, 0.011, 0.012), '#e8dcc8', {
          lightness: 0.02, castShadow: false
        });
        teeth.position.set(0, 0.027, 0.012);
        mouthGroup.add(teeth);
        const tongue = figurePart(new THREE.SphereGeometry(0.019, 5, 3), '#8e3b35', {
          lightness: 0.01, castShadow: false
        });
        tongue.scale.set(1.2, 0.55, 0.5);
        tongue.position.set(0, -0.019, 0.014);
        mouthGroup.add(tongue);
        const lowerLip = figurePart(new THREE.BoxGeometry(0.078, 0.012, 0.018), '#b06a58', {
          lightness: 0.01, castShadow: false
        });
        lowerLip.position.set(0, -0.035, 0.008);
        mouthGroup.add(lowerLip);
      } else {
        const smile = expression === 'smile' || expression === 'tea' || expression === 'warm';
        const points = [
          new V3(-0.058, 0.004, 0),
          new V3(0, smile ? -0.013 : 0.0, 0.004),
          new V3(0.058, 0.004, 0)
        ];
        const lip = figurePart(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 6, 0.006, 3, false), '#5a3326', {
          lightness: 0.008, castShadow: false
        });
        mouthGroup.add(lip);
        const lowerLip = figurePart(new THREE.BoxGeometry(0.072, 0.009, 0.016), '#b06a58', {
          lightness: 0.01, castShadow: false
        });
        lowerLip.position.set(0, -0.017, 0.005);
        mouthGroup.add(lowerLip);
        mouthKind = smile ? 'smile' : 'neutral';
      }

      if (beard === 'full' || beard === 'mustache') {
        const mustache = figurePart(new THREE.SphereGeometry(0.04, 6, 4), beardColor, {
          lightness: 0.03, castShadow: false
        });
        mustache.scale.set(1.5, 0.5, 0.55);
        mustache.position.set(0, -0.042, 0.157);
        head.add(mustache);
        for (const sx of [-1, 1]) {
          const tuft = figurePart(new THREE.ConeGeometry(0.02, 0.06, 4), beardColor, {
            lightness: 0.03, castShadow: false
          });
          tuft.rotation.z = -sx * 1.25;
          tuft.position.set(sx * 0.032, -0.035, 0.161);
          head.add(tuft);
          for (let k = 0; k < 3; k++) {
            const strand = figurePart(new THREE.ConeGeometry(0.008, 0.05, 3), beardColor, {
              lightness: 0.03, castShadow: false
            });
            strand.rotation.z = -sx * (1.05 + k * 0.2);
            strand.position.set(sx * (0.027 + k * 0.011), -0.052 - k * 0.004, 0.158);
            head.add(strand);
          }
        }
      }
      if (beard === 'full') {
        const mainBeard = figurePart(new THREE.ConeGeometry(0.09, 0.22, 5), beardColor, {
          lightness: 0.035, castShadow: false
        });
        mainBeard.rotation.x = Math.PI;
        mainBeard.position.set(0, -0.155, 0.075);
        head.add(mainBeard);
        for (let k = 0; k < 5; k++) {
          const strand = figurePart(new THREE.ConeGeometry(0.011, 0.1 + (k % 2) * 0.045, 3), beardColor, {
            lightness: 0.03, castShadow: false
          });
          strand.rotation.x = Math.PI;
          strand.rotation.z = (k - 2) * 0.1;
          strand.position.set((k - 2) * 0.027, -0.185 - (k % 2) * 0.022, 0.086);
          head.add(strand);
        }
        for (const sx of [-1, 1]) {
          const sideBeard = figurePart(new THREE.ConeGeometry(0.048, 0.12, 4), beardColor, {
            lightness: 0.03, castShadow: false
          });
          sideBeard.rotation.x = Math.PI;
          sideBeard.rotation.z = sx * 0.24;
          sideBeard.position.set(sx * 0.06, -0.135, 0.075);
          head.add(sideBeard);
        }
      } else if (beard === 'short') {
        const chinBeard = figurePart(new THREE.ConeGeometry(0.06, 0.12, 5), beardColor, {
          lightness: 0.03, castShadow: false
        });
        chinBeard.rotation.x = Math.PI;
        chinBeard.position.set(0, -0.135, 0.08);
        head.add(chinBeard);
      }
      if (expression === 'sing' && beard === 'full') {
        for (const sx of [-1, 1]) {
          const line = figurePart(new THREE.BoxGeometry(0.032, 0.0045, 0.01), skinShadow, {
            lightness: 0.006, castShadow: false
          });
          line.position.set(sx * 0.105, 0.043, 0.147);
          line.rotation.z = sx * 0.35;
          head.add(line);
        }
      }

      addHat(head, hatType, hatColor, accent, fur);

      const breathGroup = new THREE.Group();
      breathGroup.position.set(0, -0.03, 0.2);
      head.add(breathGroup);
      const breathPuffs = [];
      for (let i = 0; i < 4; i++) {
        const puff = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.05, 0),
          new THREE.MeshBasicMaterial({
            color: 0xe9e3f7, transparent: true, opacity: 0, depthWrite: false, toneMapped: false
          })
        );
        puff.userData.phase = i / 4;
        puff.userData.noMerge = true;
        puff.renderOrder = 4;
        breathGroup.add(puff);
        breathPuffs.push(puff);
      }

      const armPoses = {
        seatTalk: [
          { s: [-0.31, 0.5, 0], e: [-0.48, 0.52, 0.1], h: [-0.58, 0.82, 0.18], handRot: [-1.15, 0.25, 0.1], talk: true },
          { s: [0.31, 0.5, 0], e: [0.4, 0.18, 0.12], h: [0.3, -0.02, 0.38], handRot: [1.0, 0, 0] }
        ],
        seatListen: [
          { s: [-0.31, 0.5, 0], e: [-0.4, 0.2, 0.13], h: [-0.29, 0.02, 0.4], handRot: [0.95, 0, 0] },
          { s: [0.31, 0.5, 0], e: [0.4, 0.2, 0.13], h: [0.29, 0.03, 0.4], handRot: [0.95, 0, 0] }
        ],
        seatTea: [
          { s: [-0.31, 0.48, 0], e: [-0.35, 0.34, 0.16], h: [-0.15, 0.36, 0.43], handRot: [0.2, 0.4, 0] },
          { s: [0.31, 0.48, 0], e: [0.35, 0.34, 0.16], h: [0.15, 0.36, 0.43], handRot: [0.2, -0.4, 0] }
        ],
        seatWarm: [
          { s: [-0.31, 0.5, 0], e: [-0.4, 0.4, 0.18], h: [-0.23, 0.34, 0.55], handRot: [0.15, 0.1, 0] },
          { s: [0.31, 0.5, 0], e: [0.4, 0.4, 0.18], h: [0.23, 0.34, 0.55], handRot: [0.15, -0.1, 0] }
        ],
        seatA: [
          { s: [-0.31, 0.5, 0], e: [-0.37, 0.36, 0.2], h: [-0.28, 0.3, 0.49] },
          { s: [0.31, 0.5, 0], e: [0.37, 0.36, 0.2], h: [0.28, 0.3, 0.49] }
        ],
        seatB: [
          { s: [-0.31, 0.5, 0], e: [-0.38, 0.34, 0.14], h: [-0.3, 0.27, 0.45] },
          { s: [0.31, 0.5, 0], e: [0.4, 0.32, 0.18], h: [0.34, 0.29, 0.52] }
        ],
        seatC: [
          { s: [-0.3, 0.48, 0], e: [-0.33, 0.33, 0.18], h: [-0.11, 0.22, 0.39] },
          { s: [0.3, 0.48, 0], e: [0.33, 0.33, 0.18], h: [0.11, 0.22, 0.39] }
        ],
        standing: [
          { s: [-0.33, 0.52, 0], e: [-0.36, 0.3, 0.12], h: [-0.33, 0.05, 0.18] },
          { s: [0.33, 0.52, 0], e: [0.43, 0.35, 0.02], h: [0.27, 0.16, 0.13] }
        ]
      };

      const arms = [];
      for (const arm of armPoses[pose]) {
        const s = new V3(...arm.s), e = new V3(...arm.e), h = new V3(...arm.h);
        const root = new THREE.Group();
        root.position.copy(s);
        upper.add(root);
        const upperVec = e.clone().sub(s);
        root.add(tube(new V3(0, 0, 0), upperVec, 0.09, 0.078, coat, { lightness: 0.05, figure: true }));
        const elbow = figurePart(new THREE.IcosahedronGeometry(0.078, 0), coat, { lightness: 0.05 });
        elbow.position.copy(upperVec);
        root.add(elbow);
        const fore = new THREE.Group();
        fore.position.copy(upperVec);
        root.add(fore);
        const foreVec = h.clone().sub(e);
        fore.add(tube(new V3(0, 0, 0), foreVec, 0.076, 0.06, coat, { lightness: 0.05, figure: true }));
        const cuffA = foreVec.clone().multiplyScalar(0.73);
        const cuffB = foreVec.clone().multiplyScalar(0.92);
        fore.add(tube(cuffA, cuffB, 0.088, 0.072, trim, { lightness: 0.03, figure: true, segments: 6 }));
        const cuffStripe = foreVec.clone().multiplyScalar(0.66);
        fore.add(tube(cuffStripe, foreVec.clone().multiplyScalar(0.74), 0.086, 0.084, accent, {
          lightness: 0.03, figure: true, segments: 6
        }));
        const cuffButton = figurePart(new THREE.IcosahedronGeometry(0.013, 0), accent, {
          lightness: 0.02, castShadow: false
        });
        cuffButton.position.copy(foreVec.clone().multiplyScalar(0.8));
        fore.add(cuffButton);
        const hand = makeHand(skinMid);
        hand.position.copy(foreVec);
        if (arm.handRot) hand.rotation.set(...arm.handRot);
        fore.add(hand);
        arms.push({ root, fore, hand, talk: !!arm.talk, baseForeX: fore.rotation.x, baseForeZ: fore.rotation.z });
      }

      let bowlGroup = null;
      const seatedGroup = new THREE.Group();
      g.add(seatedGroup);
      const standGroup = new THREE.Group();
      g.add(standGroup);
      standGroup.visible = false;
      const standLegs = [];
      if (seated) {
        const drape = figurePart(new THREE.CylinderGeometry(0.32, 0.42, 0.24, 4, 1, true), coat, { lightness: 0.05 });
        drape.rotation.y = Math.PI / 4;
        drape.position.y = 0.52;
        seatedGroup.add(drape);
        const drapeHem = figurePart(new THREE.CylinderGeometry(0.42, 0.43, 0.05, 4, 1, true), trim, { lightness: 0.03, castShadow: false });
        drapeHem.rotation.y = Math.PI / 4;
        drapeHem.position.y = 0.405;
        seatedGroup.add(drapeHem);

        if (legs === 'crossed' || pose === 'seatC') {
          for (const sx of [-1, 1]) {
            const knee = new V3(-sx * 0.22, 0.3, 0.34);
            seatedGroup.add(tube(new V3(sx * 0.12, 0.5, 0.02), knee, 0.1, 0.085, coat, { lightness: 0.05, figure: true }));
            const kneeMesh = figurePart(new THREE.IcosahedronGeometry(0.085, 0), coat, { lightness: 0.05 });
            kneeMesh.position.copy(knee);
            seatedGroup.add(kneeMesh);
            const ankle = new V3(sx * 0.18, 0.12, 0.16);
            seatedGroup.add(tube(knee, ankle, 0.07, 0.058, '#3a3028', { lightness: 0.03, figure: true }));
            const boot = makeBoot('#2f2823', '#1f1a17', 0.92);
            boot.position.set(sx * 0.25, 0, 0.22);
            boot.rotation.y = sx * 0.55;
            seatedGroup.add(boot);
          }
        } else {
          for (const sx of [-1, 1]) {
            const knee = new V3(sx * 0.26, 0.36, 0.42);
            seatedGroup.add(tube(new V3(sx * 0.12, 0.52, 0.04), knee, 0.11, 0.09, coat, { lightness: 0.05, figure: true }));
            const kneeMesh = figurePart(new THREE.IcosahedronGeometry(0.09, 0), coat, { lightness: 0.05 });
            kneeMesh.position.copy(knee);
            seatedGroup.add(kneeMesh);
            const ankle = new V3(sx * 0.28, 0.13, 0.52);
            seatedGroup.add(tube(knee, ankle, 0.075, 0.06, '#3a3028', { lightness: 0.03, figure: true }));
            const boot = makeBoot('#2f2823', '#1f1a17', 0.95);
            boot.position.set(sx * 0.28, 0, 0.56);
            boot.rotation.y = sx * 0.16;
            seatedGroup.add(boot);
          }
        }

        if (pose === 'seatTea' || pose === 'seatC') {
          bowlGroup = new THREE.Group();
          bowlGroup.position.set(0, 0.36, 0.44);
          upper.add(bowlGroup);
          const bowl = figurePart(new THREE.CylinderGeometry(0.105, 0.08, 0.085, 8), '#7a5a3a', { lightness: 0.04 });
          bowlGroup.add(bowl);
          const bowlRim = figurePart(new THREE.TorusGeometry(0.105, 0.014, 3, 10), '#c9a45e', {
            lightness: 0.03, castShadow: false
          });
          bowlRim.rotation.x = Math.PI / 2;
          bowlRim.position.y = 0.045;
          bowlGroup.add(bowlRim);
          const tea = figurePart(new THREE.CylinderGeometry(0.095, 0.095, 0.008, 8), '#2c1a12', {
            lightness: 0.008, castShadow: false
          });
          tea.position.y = 0.042;
          bowlGroup.add(tea);

          const saucer = figurePart(new THREE.CylinderGeometry(0.138, 0.115, 0.016, 10), '#8a6040', {
            lightness: 0.04, castShadow: false
          });
          saucer.position.y = -0.052;
          bowlGroup.add(saucer);

          const steam = [];
          for (let i = 0; i < 3; i++) {
            const puff = new THREE.Mesh(
              new THREE.IcosahedronGeometry(0.032, 0),
              new THREE.MeshBasicMaterial({
                color: 0xf1eaff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false
              })
            );
            puff.userData.phase = i / 3;
            puff.userData.noMerge = true;
            puff.position.set(0, 0.075, 0);
            puff.renderOrder = 3;
            bowlGroup.add(puff);
            steam.push(puff);
          }
          bowlGroup.userData.steam = steam;
        }

        const shadow = contactShadow(1.7, 1.35, 0.52);
        shadow.position.z = 0.18;
        seatedGroup.add(shadow);
      } else {
        const skirt = figurePart(new THREE.CylinderGeometry(0.32, 0.38, 0.32, 8), coat, { lightness: 0.055 });
        skirt.position.y = 0.82;
        g.add(skirt);
        const skirtHem = figurePart(new THREE.CylinderGeometry(0.38, 0.39, 0.05, 8), trim, { lightness: 0.03, castShadow: false });
        skirtHem.position.y = 0.675;
        g.add(skirtHem);

        for (const sx of [-1, 1]) {
          const hip = new V3(sx * 0.13, 0.94, 0);
          const knee = new V3(sx * 0.17, 0.52, sx === 1 ? -0.04 : 0.06);
          const ankle = new V3(sx * 0.19, 0.12, sx === 1 ? -0.03 : 0.09);
          g.add(tube(hip, knee, 0.11, 0.085, '#3a3028', { lightness: 0.035, figure: true }));
          const kneeMesh = figurePart(new THREE.IcosahedronGeometry(0.085, 0), '#3a3028', { lightness: 0.035 });
          kneeMesh.position.copy(knee);
          g.add(kneeMesh);
          g.add(tube(knee, ankle, 0.075, 0.058, '#3a3028', { lightness: 0.03, figure: true }));
          const boot = makeBoot('#2f2823', '#1f1a17', 1.02);
          boot.position.set(sx * 0.19, 0, ankle.z);
          boot.rotation.y = sx * 0.12;
          g.add(boot);
        }

        const staff = tube(new V3(-0.33, 1.0, 0.18), new V3(-0.43, 0.02, 0.22), 0.02, 0.028, '#6d4f35', { lightness: 0.03, figure: true });
        g.add(staff);
        const staffKnob = figurePart(new THREE.IcosahedronGeometry(0.038, 0), '#7a5b3e', { lightness: 0.035 });
        staffKnob.scale.set(1.0, 1.15, 1.0);
        staffKnob.position.set(-0.33, 1.02, 0.18);
        g.add(staffKnob);
        const staffGrip = tube(new V3(-0.338, 0.92, 0.183), new V3(-0.3545, 0.76, 0.19), 0.029, 0.027, '#3f3126', {
          lightness: 0.03, figure: true, segments: 6
        });
        g.add(staffGrip);
        const staffFerrule = figurePart(new THREE.CylinderGeometry(0.031, 0.033, 0.07, 6), '#4a454e', {
          lightness: 0.02, castShadow: false
        });
        staffFerrule.position.set(-0.424, 0.06, 0.218);
        staffFerrule.rotation.z = -0.1;
        g.add(staffFerrule);

        const shadow = contactShadow(1.2, 0.95, 0.45);
        shadow.position.z = 0.08;
        g.add(shadow);
      }

      for (const sx of [-1, 1]) {
        const hip = new THREE.Group();
        hip.position.set(sx * 0.14, 0.9, 0);
        standGroup.add(hip);
        hip.add(tube(new V3(0, 0, 0), new V3(0, -0.4, 0.025), 0.11, 0.085, coat, {
          lightness: 0.05, figure: true
        }));
        const knee = new THREE.Group();
        knee.position.set(0, -0.4, 0.025);
        hip.add(knee);
        knee.add(tube(new V3(0, 0, 0), new V3(0, -0.4, -0.015), 0.08, 0.06, '#3a3028', {
          lightness: 0.03, figure: true
        }));
        const foot = new THREE.Group();
        foot.position.set(0, -0.4, -0.015);
        knee.add(foot);
        const boot = makeBoot('#2f2823', '#1f1a17', 0.95);
        boot.position.set(0, -0.1, 0.005);
        foot.add(boot);
        standLegs.push({
          hip, knee, foot, baseHipX: hip.rotation.x, baseKneeX: knee.rotation.x, baseFootX: 0,
          side: sx, phase: 0, prevPhase: 0, state: 'stance',
          anchor: new V3(), swingStart: new V3(), landing: new V3()
        });
      }
      const standShadow = contactShadow(1.3, 1.05, 0.4);
      standShadow.position.z = 0.06;
      standGroup.add(standShadow);
      seatedGroup.visible = true;

      const sing = expression === 'sing';
      const tea = pose === 'seatTea' || pose === 'seatC';
      const warm = pose === 'seatWarm';
      const eyeBaseY = sing ? 0.62 : 1;
      eyeGroups.forEach(eye => { eye.group.scale.y = eyeBaseY; });
      g.userData.parts = {
        upper, head, eyes: eyeGroups, brows, mouth: mouthGroup, mouthKind,
        arms, bowl: bowlGroup, baseBowlY: bowlGroup ? bowlGroup.position.y : 0,
        sing, tea, warm, listen: pose === 'seatListen', talkArm: arms.find(arm => arm.talk) || null,
        baseUpperY: hipY, baseLean: lean, baseScale: height,
        baseHeadX: headPitch, baseHeadY: headTurn, baseHeadZ: tilt, eyeBaseY,
        gazeY: tea ? -0.004 : sing ? 0.002 : 0,
        seatedGroup, standGroup, standShadow, standLegs, standLift: 0, standTarget: 0, stood: false,
        walking: false, walkAmount: 0, walkBlend: 0, walkPhase: rnd() * 6.28, leanOffset: 0,
        speed: 0, prevX: 0, prevZ: 0, targetYaw: 0,
        gait: { initialized: false, cycle: 0, stride: 1.15, stanceFrac: 0.58, moved: 0 },
        sashTail, sashBaseZ: sashTail.rotation.z, sashBaseX: sashTail.rotation.x,
        riding: false, riderAttached: false, hidden: false, carryLog: null,
        animPhase: rnd() * 6.28, noiseSeed: rnd() * 97, nextBlink: rnd() * 3.5,
        blinkStart: -10, doubleBlink: false,
        speechEnv: 0, speechStress: 0, reactEnv: 0, reactStress: 0, speechBeat: 0,
        lookTarget: new V3(), lookWeight: 0, lookYaw: 0, lookPitch: 0, gazeX: 0,
        breath: breathPuffs, steam: bowlGroup ? (bowlGroup.userData.steam || []) : []
      };
      mergeStaticMeshes(g);
      g.scale.setScalar(height);
      return g;
    }

    const firePos = new V3(-1.2, groundHeight(-1.2, 1.2), 1.2);
    const peopleData = [
      {
        pose: 'seatTalk', seat: 'stump', x: -3.35, z: 0.0,
        coat: '#2F3F6F', accent: '#D2A24A', trim: '#9AA9DD', fur: '#C9B79C',
        hatType: 'fur', hatColor: '#2E2A33', skin: '#B97950', beard: 'full',
        beardColor: '#95877b', expression: 'sing', headTurn: -0.15, headPitch: -0.12,
        tilt: 0.035, lean: 0.08, height: 1.22, beads: true, age: 1
      },
      {
        pose: 'seatListen', seat: 'stone', x: -1.45, z: -1.45,
        coat: '#5E2E2B', accent: '#2E8F7C', trim: '#E3D2A4', fur: '#8B7557',
        hatType: 'peaked', hatColor: '#3A2A25', skin: '#A86A44', beard: 'mustache',
        beardColor: '#4a3a30', expression: 'smile', headTurn: -0.8, headPitch: 0.01,
        tilt: -0.03, lean: 0.055, height: 1.23, age: 1
      },
      {
        pose: 'seatTea', legs: 'crossed', x: 0.85, z: -0.25,
        coat: '#48542F', accent: '#B03A2E', trim: '#D9C79A', fur: '#C9B79C',
        hatType: 'cap', hatColor: '#4A3B2D', skin: '#C98A5E', beard: 'none',
        expression: 'tea', earring: true, headTurn: 0.05, headPitch: 0.16,
        tilt: -0.03, lean: 0.03, height: 1.19
      },
      {
        pose: 'seatWarm', seat: 'stump', x: -2.4, z: 2.5,
        coat: '#3F556E', accent: '#E3D2A4', trim: '#C9D6E4', fur: '#8B7557',
        hatType: 'fur', hatColor: '#2B2520', skin: '#A86A44', beard: 'short',
        beardColor: '#4a3a30', expression: 'warm', headTurn: -0.8, headPitch: 0.04,
        tilt: 0.015, lean: 0.05, height: 1.14, age: 1
      }
    ];
    function addCampSeat(kind, x, z) {
      if (!kind) return;
      const y = groundHeight(x, z);
      if (kind === 'stump') {
        const stump = faceted(new THREE.CylinderGeometry(0.23, 0.27, 0.26, 7), '#6a4a32', { lightness: 0.05 });
        stump.position.set(x, y + 0.13, z);
        scene.add(stump);
        const top = faceted(new THREE.CylinderGeometry(0.225, 0.225, 0.022, 7), '#8a6647', {
          lightness: 0.04, castShadow: false
        });
        top.position.set(x, y + 0.266, z);
        scene.add(top);
      } else if (kind === 'stone') {
        const stone = faceted(new THREE.DodecahedronGeometry(0.32, 0), '#6b6478', { lightness: 0.05 });
        stone.scale.set(1.2, 0.35, 0.9);
        stone.position.set(x, y + 0.11, z);
        scene.add(stone);
      }
    }

    const people = [];
    peopleData.forEach(p => {
      const person = createPerson(p);
      person.position.set(p.x, groundHeight(p.x, p.z), p.z);
      person.rotation.y = Math.atan2(firePos.x - p.x, firePos.z - p.z);
      scene.add(person);
      const parts = person.userData.parts;
      parts.basePos = new V3(p.x, groundHeight(p.x, p.z), p.z);
      parts.baseYaw = person.rotation.y;
      parts.targetYaw = person.rotation.y;
      parts.prevX = person.position.x;
      parts.prevZ = person.position.z;
      addCampSeat(p.seat, p.x, p.z);
      people.push(person);
    });

    const carryLog = new THREE.Group();
    const carriedStick = faceted(new THREE.CylinderGeometry(0.07, 0.075, 0.8, 5), '#5a3a22', { lightness: 0.04 });
    carriedStick.rotation.z = Math.PI / 2;
    carryLog.add(carriedStick);
    carryLog.position.set(0, 0.38, 0.62);
    carryLog.visible = false;
    people[3].userData.parts.upper.add(carryLog);
    people[3].userData.parts.carryLog = carryLog;

    const fireGroup = new THREE.Group();
    fireGroup.position.copy(firePos);
    fireGroup.scale.setScalar(1.12);
    scene.add(fireGroup);

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + rnd() * 0.2;
      const stone = faceted(new THREE.DodecahedronGeometry(range(0.16, 0.26), 0), '#5b556c', { lightness: 0.05 });
      stone.scale.set(1.25, 0.72, 1);
      stone.position.set(Math.cos(a) * 0.78, 0.1, Math.sin(a) * 0.78);
      stone.rotation.set(rnd(), rnd() * 3, rnd());
      fireGroup.add(stone);
    }

    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.4;
      const log = faceted(new THREE.CylinderGeometry(0.07, 0.09, 1.15, 5), '#4a3220', { lightness: 0.05 });
      log.rotation.z = Math.PI / 2;
      log.rotation.y = a;
      log.position.set(0, 0.2 + i * 0.055, 0);
      fireGroup.add(log);
    }

    const flameMats = [
      new THREE.MeshBasicMaterial({ color: 0xe85614, side: THREE.DoubleSide, transparent: true, opacity: 0.96, depthWrite: false, toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: 0xff9829, side: THREE.DoubleSide, transparent: true, opacity: 0.94, depthWrite: false, toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: 0xffc05e, side: THREE.DoubleSide, transparent: true, opacity: 0.92, depthWrite: false, toneMapped: false })
    ];
    function makeFlameGeometry(scale) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-0.22, 0.16);
      shape.lineTo(-0.3, 0.58);
      shape.lineTo(-0.1, 0.4);
      shape.lineTo(0.02, 0.96);
      shape.lineTo(0.13, 0.4);
      shape.lineTo(0.3, 0.6);
      shape.lineTo(0.21, 0.16);
      shape.lineTo(0, 0);
      const geo = new THREE.ShapeGeometry(shape);
      geo.scale(scale, scale, 1);
      return geo;
    }
    const flames = [];
    const flameLayers = [
      { scale: 1.05, mat: 0, planes: 3, turn: 0 },
      { scale: 0.72, mat: 1, planes: 2, turn: 0.4 },
      { scale: 0.42, mat: 2, planes: 2, turn: 0.9 }
    ];
    flameLayers.forEach((layer, layerIndex) => {
      const geo = makeFlameGeometry(layer.scale);
      for (let i = 0; i < layer.planes; i++) {
        const flame = new THREE.Mesh(geo, flameMats[layer.mat]);
        const baseRotY = (i / layer.planes) * Math.PI + layer.turn;
        flame.position.set(0, 0.02 + layerIndex * 0.015, 0);
        flame.rotation.y = baseRotY;
        flame.renderOrder = 2 + layerIndex;
        flame.userData = { phase: rnd() * 6.28, baseRotY };
        flame.castShadow = false;
        fireGroup.add(flame);
        flames.push(flame);
      }
    });

    const fireHalo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffa45a,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    }));
    fireHalo.position.set(0, 0.8, 0);
    fireHalo.scale.set(4.4, 4.4, 1);
    fireGroup.add(fireHalo);

    const fireLight = new THREE.PointLight(0xff9a3c, 14, 13, 2);
    fireLight.position.set(0, 0.95, 0);
    fireGroup.add(fireLight);

    const firePool = glowPlane(6.5, 0.18);
    firePool.position.set(0, 0.055, 0);
    fireGroup.add(firePool);

    const fireCore = glowPlane(3.5, 0.18);
    fireCore.position.set(0, 0.07, 0);
    fireGroup.add(fireCore);

    const sheepFlock = [];
    function createSheep(x, z, rot, scale = 1, darkFace = false) {
      const g = new THREE.Group();
      const cream = '#E5DCC8';
      const headColor = darkFace ? '#6A5748' : '#D8CDB6';
      const faceColor = darkFace ? '#5A4A3E' : '#C9BCA3';
      const earColor = darkFace ? '#4E4037' : '#B8AA92';

      const body = faceted(new THREE.IcosahedronGeometry(0.55, 1), cream, { lightness: 0.03 });
      body.scale.set(1.1, 0.95, 1.35);
      body.position.y = 0.72;
      g.add(body);

      const puffPositions = [
        [0.22, 0.95, 0.18, 0.3], [-0.24, 0.93, -0.16, 0.32], [0.04, 1.02, -0.36, 0.26]
      ];
      puffPositions.forEach(([px, py, pz, pr]) => {
        const puff = faceted(new THREE.IcosahedronGeometry(pr, 1), '#EEE6D3', { lightness: 0.028 });
        puff.position.set(px, py, pz);
        g.add(puff);
      });

      const fleeceColor = darkFace ? '#E9E0CE' : '#F1E9D7';
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        if (Math.sin(a) > 0.75) continue;
        const ring = 0.6 + (i % 2) * 0.035;
        const curl = faceted(new THREE.IcosahedronGeometry(0.135 + (i % 3) * 0.018, 0), fleeceColor, {
          lightness: 0.03
        });
        curl.position.set(
          Math.cos(a) * ring,
          0.78 + Math.sin(a * 2.1) * 0.14,
          Math.sin(a) * ring * 1.28
        );
        curl.scale.set(1.05, 0.82, 1.08);
        g.add(curl);
      }

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.93, 0.66);
      headGroup.rotation.z = range(-0.1, 0.1);
      headGroup.rotation.y = range(-0.08, 0.08);
      g.add(headGroup);

      const head = faceted(new THREE.IcosahedronGeometry(0.19, 1), headColor, { lightness: 0.03 });
      head.scale.set(0.95, 1.0, 1.05);
      headGroup.add(head);
      const face = faceted(new THREE.ConeGeometry(0.1, 0.22, 4), faceColor, { lightness: 0.02 });
      face.rotation.x = Math.PI / 2;
      face.position.set(0, -0.03, 0.17);
      headGroup.add(face);

      const muzzle = faceted(new THREE.IcosahedronGeometry(0.072, 0), faceColor, { lightness: 0.025 });
      muzzle.scale.set(1.0, 0.86, 1.05);
      muzzle.position.set(0, -0.052, 0.205);
      headGroup.add(muzzle);

      for (const sx of [-1, 1]) {
        const nostril = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.013, 0),
          eyeMats.sheepDark
        );
        nostril.scale.set(0.75, 1.25, 0.7);
        nostril.position.set(sx * 0.026, -0.04, 0.262);
        headGroup.add(nostril);
      }

      const mouthLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.052, 0.007, 0.01),
        eyeMats.sheepMouth
      );
      mouthLine.position.set(0, -0.078, 0.248);
      headGroup.add(mouthLine);

      for (let i = 0; i < 4; i++) {
        const tuft = faceted(new THREE.IcosahedronGeometry(0.062 + (i % 2) * 0.012, 0), fleeceColor, {
          lightness: 0.03, castShadow: false
        });
        const a = (i / 4) * Math.PI * 2 + 0.4;
        tuft.position.set(Math.cos(a) * 0.075, 0.145 + Math.sin(a * 1.6) * 0.018, 0.095 + Math.sin(a) * 0.05);
        tuft.scale.set(1.1, 0.7, 1.0);
        headGroup.add(tuft);
      }

      const sheepEars = [];
      for (const sx of [-1, 1]) {
        const ear = faceted(new THREE.ConeGeometry(0.045, 0.14, 4), earColor, { lightness: 0.02, castShadow: false });
        ear.rotation.z = sx * 0.95;
        ear.position.set(sx * 0.17, 0.055, 0.0);
        headGroup.add(ear);
        sheepEars.push(ear);
        const innerEar = faceted(new THREE.ConeGeometry(0.026, 0.085, 4), darkFace ? '#3E332B' : '#CFC2A8', {
          lightness: 0.02, castShadow: false
        });
        innerEar.rotation.z = sx * 0.95;
        innerEar.position.set(sx * 0.176, 0.055, 0.024);
        headGroup.add(innerEar);

        const eyeWhite = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.026, 0),
          eyeMats.sheepWhite
        );
        eyeWhite.scale.set(1.0, 0.88, 0.8);
        eyeWhite.position.set(sx * 0.072, 0.028, 0.172);
        headGroup.add(eyeWhite);
        const pupil = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.0135, 0),
          eyeMats.sheepPupil
        );
        pupil.scale.set(0.85, 1.0, 0.6);
        pupil.position.set(sx * 0.076, 0.026, 0.19);
        headGroup.add(pupil);
        const glint = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.0045, 0),
          eyeMats.glint
        );
        glint.position.set(sx * 0.081, 0.034, 0.196);
        headGroup.add(glint);
        const lid = faceted(new THREE.BoxGeometry(0.05, 0.014, 0.014), headColor, {
          lightness: 0.02, castShadow: false
        });
        lid.position.set(sx * 0.072, 0.045, 0.176);
        lid.rotation.z = sx * 0.12;
        headGroup.add(lid);

        if (darkFace) {
          const tag = faceted(new THREE.BoxGeometry(0.012, 0.05, 0.008), '#C9A45E', {
            lightness: 0.03, castShadow: false
          });
          tag.position.set(sx * 0.198, 0.026, 0.0);
          tag.rotation.z = sx * 0.4;
          headGroup.add(tag);
        }
      }

      for (const lx of [-0.26, 0.26]) {
        for (const lz of [-0.34, 0.36]) {
          const knee = new V3(lx * 1.02, 0.3, lz);
          g.add(tube(new V3(lx, 0.52, lz), knee, 0.05, 0.04, '#453A2F', { lightness: 0.025, figure: true, segments: 4 }));
          const ankle = new V3(lx * 1.05, 0.09, lz + 0.01);
          g.add(tube(knee, ankle, 0.035, 0.028, '#3A3028', { lightness: 0.02, figure: true, segments: 4 }));
          for (const cz of [-0.022, 0.022]) {
            const claw = faceted(new THREE.BoxGeometry(0.05, 0.055, 0.075), '#2A211A', { lightness: 0.015 });
            claw.position.set(lx * 1.05, 0.035, lz + 0.01 + cz);
            g.add(claw);
          }
          const dewClaw = faceted(new THREE.IcosahedronGeometry(0.016, 0), '#241C16', {
            lightness: 0.012, castShadow: false
          });
          dewClaw.position.set(lx * 1.05, 0.056, lz + 0.062);
          g.add(dewClaw);
        }
      }

      const tail = faceted(new THREE.IcosahedronGeometry(0.1, 0), cream, { lightness: 0.02 });
      tail.position.set(0, 0.72, -0.74);
      g.add(tail);
      const tailTip = faceted(new THREE.IcosahedronGeometry(0.062, 0), fleeceColor, { lightness: 0.03 });
      tailTip.position.set(0, 0.66, -0.81);
      g.add(tailTip);

      const shadow = contactShadow(1.5, 1.15, 0.38);
      shadow.position.z = 0.05;
      g.add(shadow);

      tail.userData.noMerge = true;
      body.userData.noMerge = true;
      sheepEars.forEach(ear => { ear.userData.noMerge = true; });
      mergeStaticMeshes(g);
      g.userData.rig = {
        head: headGroup, tail, body, ears: sheepEars,
        baseHeadX: headGroup.rotation.x, baseHeadY: headGroup.rotation.y, baseHeadZ: headGroup.rotation.z,
        baseEarZ: sheepEars.map(ear => ear.rotation.z),
        baseBodyScale: body.scale.clone(), isLamb: scale < 0.7,
        baseY: groundHeight(x, z), phase: rnd() * 6.28
      };
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = rot;
      g.scale.setScalar(scale);
      scene.add(g);
      sheepFlock.push(g);
      return g;
    }

    createSheep(-5.9, -3.4, 0.6, 1.08);
    createSheep(-7.1, -2.2, -0.3, 1.03);
    createSheep(-6.3, -5.0, 1.9, 0.95);
    createSheep(-7.7, -4.0, 0.1, 0.86);
    createSheep(-7.8, -2.4, 1.1, 0.97);
    createSheep(-5.1, -5.2, -0.5, 0.89);
    createSheep(-7.3, -4.8, -1.3, 0.95, true);
    createSheep(-4.6, -2.9, 0.4, 0.63);

    function createGoat(x, z, rot, scale = 1) {
      const g = new THREE.Group();
      const white = new THREE.Color('#E6DFD0');
      const brown = new THREE.Color('#8B6242');
      const darkLeg = '#4A3C2E';

      const body = figureCustom(loftGeometry([
        { z: -0.5, y: 0.63, w: 0.24, h: 0.25 },
        { z: -0.15, y: 0.64, w: 0.32, h: 0.3 },
        { z: 0.2, y: 0.65, w: 0.33, h: 0.32 },
        { z: 0.45, y: 0.66, w: 0.27, h: 0.3 }
      ], 7), (cx, cy, cz, normal) => {
        const patch = (cz > 0.1 && cy > 0.62) || (cx < -0.12 && cz < 0.15 && cy > 0.72);
        let col = patch ? brown.clone() : white.clone();
        if (normal.y < -0.15) col = col.lerp(new THREE.Color('#C9BEAA'), 0.2);
        return jitter(col, 0.045, 0.016, 0.004);
      });
      g.add(body);

      const neck = tube(new V3(0, 0.72, 0.32), new V3(0, 0.96, 0.58), 0.13, 0.095, '#8B6242', {
        lightness: 0.04, figure: true, segments: 5
      });
      g.add(neck);

      const head = figurePart(new THREE.IcosahedronGeometry(0.16, 1), '#8B6242', { lightness: 0.04 });
      head.scale.set(0.9, 0.95, 1.2);
      head.position.set(0, 1.0, 0.66);
      g.add(head);
      const muzzle = figurePart(new THREE.ConeGeometry(0.075, 0.2, 4), '#A37E58', { lightness: 0.03 });
      muzzle.rotation.x = Math.PI / 2;
      muzzle.position.set(0, 0.96, 0.8);
      g.add(muzzle);

      const muzzlePad = figurePart(new THREE.IcosahedronGeometry(0.055, 0), '#B08B63', { lightness: 0.03 });
      muzzlePad.scale.set(1.0, 0.85, 1.05);
      muzzlePad.position.set(0, 0.94, 0.865);
      g.add(muzzlePad);

      for (const sx of [-1, 1]) {
        const nostril = figurePart(new THREE.IcosahedronGeometry(0.013, 0), '#2A1F18', {
          lightness: 0.008, castShadow: false
        });
        nostril.scale.set(0.7, 1.3, 0.6);
        nostril.position.set(sx * 0.026, 0.947, 0.902);
        g.add(nostril);
      }

      const goatMouth = figurePart(new THREE.BoxGeometry(0.06, 0.009, 0.012), '#4A372C', {
        lightness: 0.008, castShadow: false
      });
      goatMouth.position.set(0, 0.905, 0.888);
      g.add(goatMouth);

      const goatEars = [];
      for (const sx of [-1, 1]) {
        const ear = figurePart(new THREE.ConeGeometry(0.045, 0.16, 4), '#8B6242', { lightness: 0.03, castShadow: false });
        ear.rotation.z = sx * 1.05;
        ear.position.set(sx * 0.14, 1.09, 0.64);
        g.add(ear);
        goatEars.push(ear);
        const innerEar = figurePart(new THREE.ConeGeometry(0.026, 0.1, 4), '#5E4230', {
          lightness: 0.02, castShadow: false
        });
        innerEar.rotation.z = sx * 1.05;
        innerEar.position.set(sx * 0.145, 1.09, 0.665);
        g.add(innerEar);

        const eyeWhite = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.027, 0),
          eyeMats.goatWhite
        );
        eyeWhite.scale.set(1.0, 0.9, 0.8);
        eyeWhite.position.set(sx * 0.068, 1.018, 0.812);
        g.add(eyeWhite);
        const pupil = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.0135, 0),
          eyeMats.goatPupil
        );
        pupil.scale.set(0.85, 1.05, 0.6);
        pupil.position.set(sx * 0.072, 1.016, 0.832);
        g.add(pupil);
        const glint = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.0045, 0),
          eyeMats.glint
        );
        glint.position.set(sx * 0.077, 1.026, 0.838);
        g.add(glint);
        const lid = figurePart(new THREE.BoxGeometry(0.05, 0.014, 0.014), '#8B6242', {
          lightness: 0.03, castShadow: false
        });
        lid.position.set(sx * 0.068, 1.04, 0.815);
        lid.rotation.z = sx * 0.16;
        g.add(lid);

        const hornPoints = [
          [0.08, 1.1, 0.64], [0.13, 1.22, 0.57], [0.15, 1.33, 0.47],
          [0.12, 1.41, 0.36], [0.06, 1.43, 0.26]
        ];
        for (let i = 0; i < hornPoints.length - 1; i++) {
          const t = i / (hornPoints.length - 1);
          const a = new V3(sx * hornPoints[i][0], hornPoints[i][1], hornPoints[i][2]);
          const b = new V3(sx * hornPoints[i + 1][0], hornPoints[i + 1][1], hornPoints[i + 1][2]);
          const color = new THREE.Color('#6B5A48').lerp(new THREE.Color('#B5A184'), t * 0.8);
          const seg = tube(a, b, 0.03 * (1 - t * 0.55), 0.03 * (1 - (t + 0.25) * 0.55), color, {
            lightness: 0.02, figure: true, segments: 4, castShadow: false
          });
          g.add(seg);
          const mid = new V3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
          const dir = new V3().subVectors(b, a).normalize();
          const ridge = figurePart(new THREE.TorusGeometry(0.03 * (1 - t * 0.55), 0.005, 3, 7), '#8E7B60', {
            lightness: 0.02, castShadow: false
          });
          ridge.position.copy(mid);
          ridge.quaternion.setFromUnitVectors(new V3(0, 0, 1), dir);
          g.add(ridge);
        }
      }

      const beard = figurePart(new THREE.ConeGeometry(0.055, 0.19, 4), '#6B5A48', { lightness: 0.03, castShadow: false });
      beard.rotation.x = Math.PI;
      beard.position.set(0, 0.83, 0.74);
      g.add(beard);
      for (let i = 0; i < 4; i++) {
        const strand = figurePart(new THREE.ConeGeometry(0.012, 0.16, 3), '#6B5A48', {
          lightness: 0.03, castShadow: false
        });
        strand.position.set((i - 1.5) * 0.022, 0.8 - (i % 2) * 0.022, 0.75);
        strand.rotation.x = Math.PI;
        strand.rotation.z = (i - 1.5) * 0.08;
        g.add(strand);
      }

      for (const lx of [-0.2, 0.2]) {
        for (const lz of [-0.3, 0.28]) {
          const knee = new V3(lx * 1.05, 0.3, lz);
          g.add(tube(new V3(lx, 0.5, lz), knee, 0.045, 0.035, darkLeg, { lightness: 0.025, figure: true, segments: 4 }));
          const ankle = new V3(lx * 1.1, 0.07, lz + 0.02);
          g.add(tube(knee, ankle, 0.032, 0.025, darkLeg, { lightness: 0.02, figure: true, segments: 4 }));
          for (const cz of [-0.02, 0.02]) {
            const claw = figurePart(new THREE.BoxGeometry(0.05, 0.055, 0.075), '#2A211A', { lightness: 0.015 });
            claw.position.set(lx * 1.1, 0.035, lz + 0.02 + cz);
            g.add(claw);
          }
        }
      }

      const tail = figurePart(new THREE.ConeGeometry(0.055, 0.18, 4), '#E6DFD0', { lightness: 0.03 });
      tail.rotation.x = -0.9;
      tail.position.set(0, 0.8, -0.52);
      g.add(tail);

      const shadow = contactShadow(1.15, 0.95, 0.34);
      shadow.position.z = 0.06;
      g.add(shadow);

      tail.userData.noMerge = true;
      body.userData.noMerge = true;
      goatEars.forEach(ear => { ear.userData.noMerge = true; });
      mergeStaticMeshes(g);
      g.userData.rig = {
        body, tail, ears: goatEars,
        baseTailZ: tail.rotation.z, baseEarZ: goatEars.map(ear => ear.rotation.z),
        baseBodyScale: body.scale.clone(), phase: rnd() * 6.28
      };
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = rot;
      g.scale.setScalar(scale);
      scene.add(g);
      return g;
    }

    const goat = createGoat(-5.2, -1.6, 0.3, 1.0);

    function createYak(x, z, rot, scale = 1) {
      const g = new THREE.Group();
      const dark = new THREE.Color('#4C3E4A');
      const lit = new THREE.Color('#7A6874');
      const shade = new THREE.Color('#2A232C');
      const rimTint = new THREE.Color('#B06A7A');
      const hornBase = new THREE.Color('#4A3C3A');
      const hornTip = new THREE.Color('#D8C9A8');

      const body = figureCustom(loftGeometry([
        { z: -0.98, y: 1.02, w: 0.5, h: 0.42 },
        { z: -0.55, y: 1.03, w: 0.63, h: 0.5 },
        { z: -0.05, y: 1.03, w: 0.67, h: 0.55 },
        { z: 0.45, y: 1.06, w: 0.6, h: 0.53 },
        { z: 0.72, y: 1.09, w: 0.52, h: 0.5 }
      ], 7), (cx, cy, cz, normal) => {
        let col = dark.clone();
        if (normal.y > 0.2) col = col.lerp(lit, 0.55);
        if (normal.y < -0.18) col = col.lerp(shade, 0.25);
        if (normal.x < -0.35 && normal.y > -0.1) col = col.lerp(rimTint, 0.2);
        return jitter(col, 0.055, 0.016, 0.004);
      });
      g.add(body);

      const hump = figurePart(new THREE.IcosahedronGeometry(0.48, 0), '#6A5A66', { lightness: 0.06 });
      hump.scale.set(1.08, 0.62, 0.95);
      hump.position.set(0, 1.7, 0.22);
      g.add(hump);
      const humpSnow = figurePart(new THREE.IcosahedronGeometry(0.31, 0), '#d5cfe6', {
        lightness: 0.02, castShadow: false
      });
      humpSnow.scale.set(1.12, 0.2, 0.82);
      humpSnow.position.set(0, 1.93, 0.2);
      g.add(humpSnow);
      const humpBack = figurePart(new THREE.IcosahedronGeometry(0.4, 0), '#5E4E5A', { lightness: 0.05 });
      humpBack.scale.set(0.9, 0.45, 0.85);
      humpBack.position.set(0, 1.64, -0.25);
      g.add(humpBack);

      const neck = tube(new V3(0, 1.35, 0.55), new V3(0, 0.96, 1.12), 0.36, 0.3, '#5A4A56', {
        lightness: 0.05, figure: true, segments: 6
      });
      g.add(neck);

      const head = figurePart(new THREE.IcosahedronGeometry(0.3, 0), '#5E4E5A', { lightness: 0.055 });
      head.scale.set(1.05, 0.82, 1.15);
      head.position.set(0, 0.88, 1.3);
      g.add(head);
      const forehead = figurePart(new THREE.IcosahedronGeometry(0.22, 0), '#7A6A76', { lightness: 0.05, castShadow: false });
      forehead.scale.set(1.05, 0.55, 0.75);
      forehead.position.set(0, 0.99, 1.22);
      g.add(forehead);

      for (const sx of [-1, 1]) {
        const brow = figurePart(new THREE.BoxGeometry(0.1, 0.05, 0.08), '#6A5A66', {
          lightness: 0.05, castShadow: false
        });
        brow.position.set(sx * 0.172, 1.0, 1.46);
        brow.rotation.z = sx * -0.22;
        g.add(brow);

        const eyeWhite = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.036, 0),
          eyeMats.yakWhite
        );
        eyeWhite.scale.set(1.0, 0.82, 0.75);
        eyeWhite.position.set(sx * 0.178, 0.935, 1.512);
        g.add(eyeWhite);
        const pupil = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.019, 0),
          eyeMats.yakPupil
        );
        pupil.scale.set(0.9, 1.05, 0.6);
        pupil.position.set(sx * 0.184, 0.932, 1.538);
        g.add(pupil);
        const glint = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.006, 0),
          eyeMats.yakGlint
        );
        glint.position.set(sx * 0.191, 0.948, 1.549);
        g.add(glint);
      }
      const muzzle = figurePart(new THREE.BoxGeometry(0.32, 0.22, 0.3), '#6A5A62', { lightness: 0.055 });
      muzzle.position.set(0, 0.78, 1.51);
      g.add(muzzle);
      const muzzlePatch = figurePart(new THREE.BoxGeometry(0.18, 0.08, 0.02), '#8F7F88', { lightness: 0.045, castShadow: false });
      muzzlePatch.position.set(0, 0.81, 1.67);
      g.add(muzzlePatch);
      const yakMouth = figurePart(new THREE.BoxGeometry(0.15, 0.035, 0.02), '#332933', {
        lightness: 0.02, castShadow: false
      });
      yakMouth.position.set(0, 0.733, 1.663);
      g.add(yakMouth);
      const chinBeard = figurePart(new THREE.ConeGeometry(0.09, 0.24, 4), '#4F404A', { lightness: 0.04, castShadow: false });
      chinBeard.rotation.x = Math.PI;
      chinBeard.position.set(0, 0.64, 1.42);
      g.add(chinBeard);

      const yakEars = [];
      for (const sx of [-1, 1]) {
        const nostril = figurePart(new THREE.BoxGeometry(0.045, 0.035, 0.02), '#221B20', { lightness: 0.01, castShadow: false });
        nostril.position.set(sx * 0.09, 0.8, 1.665);
        g.add(nostril);
        const ear = figurePart(new THREE.ConeGeometry(0.07, 0.2, 4), '#3A2E38', { lightness: 0.03, castShadow: false });
        ear.position.set(sx * 0.3, 1.06, 1.17);
        ear.rotation.z = sx * 1.2;
        g.add(ear);
        yakEars.push(ear);

        const hornPoints = [
          [0.21, 1.0, 1.28], [0.36, 1.09, 1.22], [0.5, 1.19, 1.13],
          [0.6, 1.31, 1.03], [0.62, 1.45, 0.94], [0.56, 1.56, 0.9]
        ];
        for (let i = 0; i < hornPoints.length - 1; i++) {
          const t = i / (hornPoints.length - 1);
          const nextT = (i + 1) / (hornPoints.length - 1);
          const a = new V3(sx * hornPoints[i][0], hornPoints[i][1], hornPoints[i][2]);
          const b = new V3(sx * hornPoints[i + 1][0], hornPoints[i + 1][1], hornPoints[i + 1][2]);
          const color = hornBase.clone().lerp(hornTip, t * 0.9);
          const radiusA = 0.06 * (1 - t * 0.7);
          const radiusB = 0.06 * (1 - nextT * 0.7);
          const segment = tube(a, b, radiusA, radiusB, color, { lightness: 0.02, figure: true, segments: 4, castShadow: false });
          g.add(segment);
          const mid = new V3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
          const dir = new V3().subVectors(b, a).normalize();
          const ridge = figurePart(new THREE.TorusGeometry(radiusA * 0.96, 0.006, 3, 8), '#6E5C56', {
            lightness: 0.02, castShadow: false
          });
          ridge.position.copy(mid);
          ridge.quaternion.setFromUnitVectors(new V3(0, 0, 1), dir);
          g.add(ridge);
        }
        const tip = figurePart(new THREE.ConeGeometry(0.02, 0.08, 4), hornTip, { lightness: 0.02, castShadow: false });
        tip.position.set(sx * 0.56, 1.59, 0.89);
        tip.rotation.x = -0.2;
        g.add(tip);
      }

      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(-0.11, 0);
      bladeShape.lineTo(0.11, 0);
      bladeShape.lineTo(0.075, -0.78);
      bladeShape.lineTo(0, -1);
      bladeShape.lineTo(-0.075, -0.78);
      bladeShape.closePath();
      const bladeGeo = new THREE.ShapeGeometry(bladeShape);

      const bladeDark = new THREE.Color('#5A4A56');
      const bladeLight = new THREE.Color('#9A8894');
      for (let tier = 0; tier < 3; tier++) {
        const startY = 1.08 - tier * 0.18;
        const length = 0.45 + tier * 0.135;
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          if (Math.sin(a) > 0.8) continue;
          const blade = figureCustom(bladeGeo, (cx, cy) => {
            const tip = clamp(-cy, 0, 1);
            return jitter(bladeDark.clone().lerp(bladeLight, tip * 0.55), 0.05, 0.015, 0.004);
          }, { doubleSide: true, castShadow: false });
          blade.scale.set(1, length, 1);
          blade.position.set(Math.cos(a) * 0.72, startY, Math.sin(a) * 0.86);
          blade.rotation.y = Math.PI / 2 - a;
          blade.rotation.z = Math.sin(a * 2.1) * 0.05;
          g.add(blade);
        }
      }

      for (const lx of [-0.28, 0.28]) {
        for (const lz of [-0.52, 0.45]) {
          const leg = tube(new V3(lx, 0.7, lz), new V3(lx, 0.06, lz), 0.075, 0.06, '#2A2229', {
            lightness: 0.02, figure: true, segments: 4
          });
          g.add(leg);
          const hoof = figurePart(new THREE.BoxGeometry(0.14, 0.11, 0.16), '#1C171C', { lightness: 0.015 });
          hoof.position.set(lx, 0.055, lz);
          g.add(hoof);
          for (const cz of [-0.042, 0.042]) {
            const claw = figurePart(new THREE.BoxGeometry(0.1, 0.1, 0.125), '#241D22', { lightness: 0.015 });
            claw.position.set(lx, 0.058, lz + cz);
            g.add(claw);
          }
        }
      }

      const yakTail = new THREE.Group();
      yakTail.position.set(0, 1.0, -1.0);
      g.add(yakTail);
      for (let i = 0; i < 5; i++) {
        const tail = figurePart(new THREE.ConeGeometry(0.09, 0.5 - i * 0.04, 4), '#332933', { lightness: 0.025, castShadow: false });
        tail.position.set((i - 2) * 0.05, -i * 0.06, 0);
        tail.rotation.x = -2.5;
        tail.rotation.z = (i - 2) * 0.06;
        yakTail.add(tail);
      }

      const shadow = contactShadow(2.0, 2.5, 0.42);
      shadow.position.z = 0.05;
      g.add(shadow);

      body.userData.noMerge = true;
      muzzle.userData.noMerge = true;
      chinBeard.userData.noMerge = true;
      yakEars.forEach(ear => { ear.userData.noMerge = true; });
      mergeStaticMeshes(g);
      g.userData.rig = {
        body, tail: yakTail, ears: yakEars, muzzle, chinBeard,
        baseTailZ: yakTail.rotation.z, baseEarZ: yakEars.map(ear => ear.rotation.z),
        baseBodyScale: body.scale.clone(), phase: rnd() * 6.28
      };
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = rot;
      g.scale.setScalar(scale);
      scene.add(g);
      return g;
    }

    const yak = createYak(-11.8, -9.2, 1.45, 1.0);
    const yakMat = figureMat.clone();
    yakMat.emissive = new THREE.Color(0x4A3342);
    yakMat.emissiveIntensity = 0.26;
    const yakMatDouble = yakMat.clone();
    yakMatDouble.side = THREE.DoubleSide;
    yak.traverse(child => {
      if (!child.isMesh) return;
      if (child.material === figureMat) child.material = yakMat;
      else if (child.material === figureMatDouble) child.material = yakMatDouble;
    });

    function createHorse(x, z, rot, scale = 1) {
      const g = new THREE.Group();
      const coat = '#A85C32';
      const coatColor = new THREE.Color(coat);
      const coatLight = new THREE.Color('#CE8048');
      const coatDark = new THREE.Color('#6B351F');
      const maneColor = '#2B1D16';
      const legColor = '#7A3D20';
      const hoofColor = '#241C18';

      const bodySections = [
        { z: -1.02, y: 1.4, w: 0.33, h: 0.32 },
        { z: -0.68, y: 1.42, w: 0.46, h: 0.41 },
        { z: -0.22, y: 1.41, w: 0.49, h: 0.4 },
        { z: 0.22, y: 1.44, w: 0.48, h: 0.43 },
        { z: 0.58, y: 1.46, w: 0.4, h: 0.41 }
      ];
      const body = figureCustom(loftGeometry(bodySections, 8), (cx, cy, cz, normal) => {
        let col = coatColor.clone();
        if (normal.y > 0.3) col = col.lerp(coatLight, 0.35);
        if (normal.y < -0.15) col = col.lerp(coatDark, 0.4);
        return jitter(col, 0.05, 0.016, 0.004);
      });
      g.add(body);

      const neckLow = tube(new V3(0, 1.58, 0.52), new V3(0, 1.96, 0.8), 0.3, 0.22, coat, {
        lightness: 0.055, figure: true, segments: 6
      });
      g.add(neckLow);
      const neckHigh = tube(new V3(0, 1.96, 0.8), new V3(0, 2.17, 1.04), 0.22, 0.17, coat, {
        lightness: 0.055, figure: true, segments: 6
      });
      g.add(neckHigh);
      const neckJoint = figurePart(new THREE.IcosahedronGeometry(0.23, 0), coat, { lightness: 0.05 });
      neckJoint.position.set(0, 1.96, 0.8);
      g.add(neckJoint);

      const crest = figurePart(new THREE.BoxGeometry(0.08, 0.55, 0.16), coat, { lightness: 0.08, castShadow: false });
      crest.position.set(0, 1.88, 0.7);
      crest.rotation.x = -0.55;
      g.add(crest);

      for (let i = 0; i < 13; i++) {
        const t = i / 12;
        const mane = figurePart(new THREE.ConeGeometry(0.045, 0.32, 4), maneColor, { lightness: 0.025, castShadow: false });
        mane.position.set((i % 2 ? 0.022 : -0.022), 1.70 + t * 0.56, 0.52 + t * 0.58);
        mane.rotation.x = -1.18;
        mane.rotation.z = (i % 2 ? 0.07 : -0.07);
        g.add(mane);
      }
      for (let i = 0; i < 6; i++) {
        const t = i / 5;
        const side = figurePart(new THREE.ConeGeometry(0.032, 0.19, 4), maneColor, { lightness: 0.025, castShadow: false });
        side.position.set((i % 2 ? 0.05 : -0.05), 1.72 + t * 0.42, 0.6 + t * 0.44);
        side.rotation.x = -1.22;
        side.rotation.z = (i % 2 ? 0.22 : -0.22);
        g.add(side);
      }

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 2.16, 1.08);
      headGroup.rotation.x = 0.24;
      g.add(headGroup);

      const head = figureCustom(loftGeometry([
        { z: -0.12, y: 0, w: 0.135, h: 0.15 },
        { z: 0.16, y: -0.015, w: 0.13, h: 0.145 },
        { z: 0.36, y: -0.06, w: 0.095, h: 0.1 }
      ], 7), (cx, cy, cz, normal) => {
        let col = coatColor.clone();
        if (normal.y > 0.35) col = col.lerp(coatLight, 0.25);
        if (normal.y < -0.15) col = col.lerp(coatDark, 0.35);
        return jitter(col, 0.045, 0.015, 0.004);
      });
      headGroup.add(head);

      const jaw = figurePart(new THREE.BoxGeometry(0.17, 0.06, 0.33), coatDark, { lightness: 0.03 });
      jaw.position.set(0, -0.13, 0.14);
      headGroup.add(jaw);

      const muzzle = figurePart(new THREE.BoxGeometry(0.18, 0.16, 0.18), '#8D4724', { lightness: 0.035 });
      muzzle.position.set(0, -0.065, 0.38);
      headGroup.add(muzzle);

      const lipHighlight = figurePart(new THREE.BoxGeometry(0.162, 0.032, 0.022), '#A85C32', {
        lightness: 0.03, castShadow: false
      });
      lipHighlight.position.set(0, -0.082, 0.461);
      headGroup.add(lipHighlight);
      const muzzleLip = figurePart(new THREE.BoxGeometry(0.152, 0.018, 0.022), '#4A2716', {
        lightness: 0.02, castShadow: false
      });
      muzzleLip.position.set(0, -0.125, 0.461);
      headGroup.add(muzzleLip);
      const chin = figurePart(new THREE.BoxGeometry(0.135, 0.055, 0.13), coatDark, {
        lightness: 0.03, castShadow: false
      });
      chin.position.set(0, -0.148, 0.36);
      headGroup.add(chin);

      const horseEars = [];
      for (const sx of [-1, 1]) {
        const nostril = figurePart(new THREE.ConeGeometry(0.018, 0.032, 5), '#241813', {
          lightness: 0.01, castShadow: false
        });
        nostril.rotation.set(-1.35, 0, 0);
        nostril.position.set(sx * 0.058, -0.082, 0.455);
        headGroup.add(nostril);

        const eyeSocket = figurePart(new THREE.BoxGeometry(0.03, 0.052, 0.085), coatDark, {
          lightness: 0.03, castShadow: false
        });
        eyeSocket.position.set(sx * 0.124, 0.025, 0.118);
        headGroup.add(eyeSocket);
        const eye = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.026, 0),
          eyeMats.horseEye
        );
        eye.scale.set(0.78, 1.0, 1.0);
        eye.position.set(sx * 0.128, 0.025, 0.122);
        headGroup.add(eye);
        const glint = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.006, 0),
          eyeMats.horseGlint
        );
        glint.position.set(sx * 0.136, 0.037, 0.134);
        headGroup.add(glint);
        const upperLid = figurePart(new THREE.BoxGeometry(0.024, 0.014, 0.07), coatDark, {
          lightness: 0.03, castShadow: false
        });
        upperLid.position.set(sx * 0.133, 0.05, 0.118);
        headGroup.add(upperLid);
        const lowerLid = figurePart(new THREE.BoxGeometry(0.022, 0.01, 0.06), coatDark, {
          lightness: 0.03, castShadow: false
        });
        lowerLid.position.set(sx * 0.131, -0.003, 0.118);
        headGroup.add(lowerLid);

        const ear = figurePart(new THREE.ConeGeometry(0.05, 0.2, 4), coat, { lightness: 0.04 });
        ear.position.set(sx * 0.095, 0.18, -0.03);
        ear.rotation.z = sx * 0.12;
        ear.rotation.x = -0.08;
        headGroup.add(ear);
        horseEars.push(ear);
        const innerEar = figurePart(new THREE.ConeGeometry(0.025, 0.12, 4), coatDark, { lightness: 0.02, castShadow: false });
        innerEar.position.set(sx * 0.095, 0.18, 0.005);
        innerEar.rotation.z = sx * 0.12;
        innerEar.rotation.x = -0.08;
        headGroup.add(innerEar);

        const cheekStrap = figurePart(new THREE.BoxGeometry(0.016, 0.03, 0.34), '#3A291E', { lightness: 0.02, castShadow: false });
        cheekStrap.position.set(sx * 0.135, 0.005, 0.14);
        headGroup.add(cheekStrap);
      }

      const forelock = figurePart(new THREE.ConeGeometry(0.055, 0.18, 4), maneColor, { lightness: 0.02, castShadow: false });
      forelock.position.set(0, 0.16, 0.03);
      forelock.rotation.x = -0.7;
      headGroup.add(forelock);

      const noseband = figurePart(new THREE.BoxGeometry(0.21, 0.026, 0.03), '#3A291E', { lightness: 0.02, castShadow: false });
      noseband.position.set(0, -0.03, 0.33);
      headGroup.add(noseband);

      const blaze = figurePart(new THREE.BoxGeometry(0.045, 0.16, 0.02), '#D9CBB8', { lightness: 0.03, castShadow: false });
      blaze.position.set(0, 0.09, 0.21);
      blaze.rotation.x = -0.2;
      headGroup.add(blaze);

      const horseLegs = [];
      const legSpecs = [
        [-1, 0.56, 0.59, 0.56, false],
        [1, 0.56, 0.59, 0.56, false],
        [-1, -0.72, -0.84, -0.7, true],
        [1, -0.72, -0.84, -0.72, false]
      ];
      for (const [sx, zHip, zKnee, zFet, relaxed] of legSpecs) {
        const hip = new V3(sx * 0.29, 1.18, zHip);
        const knee = new V3(sx * 0.31, 0.68, zKnee);
        const fetlock = new V3(sx * 0.31, relaxed ? 0.22 : 0.14, zFet);
        const legRoot = new THREE.Group();
        legRoot.position.copy(hip);
        g.add(legRoot);
        const kneeLocal = knee.clone().sub(hip);
        legRoot.add(tube(new V3(0, 0, 0), kneeLocal, 0.115, 0.085, legColor, {
          lightness: 0.04, figure: true, segments: 5
        }));
        const kneeGroup = new THREE.Group();
        kneeGroup.position.copy(kneeLocal);
        legRoot.add(kneeGroup);
        const kneeMesh = figurePart(new THREE.IcosahedronGeometry(0.09, 0), legColor, { lightness: 0.04 });
        kneeGroup.add(kneeMesh);
        const fetLocal = fetlock.clone().sub(knee);
        kneeGroup.add(tube(new V3(0, 0, 0), fetLocal, 0.075, 0.055, '#6B351F', {
          lightness: 0.035, figure: true, segments: 5
        }));
        const hoof = figurePart(new THREE.BoxGeometry(0.14, 0.12, 0.18), hoofColor, { lightness: 0.02 });
        hoof.position.copy(fetLocal).add(new V3(0, relaxed ? -0.1 : -0.08, 0));
        kneeGroup.add(hoof);
        const hoofRim = figurePart(new THREE.BoxGeometry(0.148, 0.028, 0.19), '#3A2E28', {
          lightness: 0.02, castShadow: false
        });
        hoofRim.position.copy(hoof.position).add(new V3(0, 0.05, 0));
        kneeGroup.add(hoofRim);

        const feather = figurePart(new THREE.ConeGeometry(0.072, 0.17, 5), maneColor, {
          lightness: 0.025, castShadow: false
        });
        feather.rotation.x = Math.PI;
        feather.position.copy(fetLocal).add(new V3(0, relaxed ? -0.015 : 0.005, 0.008));
        kneeGroup.add(feather);

        const wrapA = fetLocal.clone().multiplyScalar(0.52);
        const wrapB = fetLocal.clone().multiplyScalar(0.74);
        kneeGroup.add(tube(wrapA, wrapB, 0.076, 0.069, '#8E3A33', {
          lightness: 0.035, figure: true, segments: 6
        }));
        horseLegs.push({ root: legRoot, knee: kneeGroup, front: zHip > 0, side: sx });
      }

      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 1.56, -1.0);
      g.add(tailGroup);
      for (let i = 0; i < 9; i++) {
        const tail = figurePart(new THREE.ConeGeometry(0.062, 0.74 - (i % 3) * 0.05, 4), maneColor, { lightness: 0.02, castShadow: false });
        tail.position.set((i - 4) * 0.032, -i * 0.028, (i % 2) * 0.02);
        tail.rotation.x = -2.55;
        tail.rotation.z = (i - 4) * 0.045;
        tailGroup.add(tail);
      }
      const tailRoot = figurePart(new THREE.IcosahedronGeometry(0.14, 0), maneColor, {
        lightness: 0.025, castShadow: false
      });
      tailRoot.scale.set(1.1, 0.85, 0.9);
      tailGroup.add(tailRoot);
      const tailTie = figurePart(new THREE.TorusGeometry(0.075, 0.014, 3, 8), '#8E3A33', {
        lightness: 0.03, castShadow: false
      });
      tailTie.rotation.y = Math.PI / 2;
      tailTie.position.set(0, 0.03, -0.02);
      tailGroup.add(tailTie);

      const blanket = figurePart(new THREE.BoxGeometry(0.95, 0.06, 0.95), '#8E3A33', { lightness: 0.035 });
      blanket.position.set(0, 1.885, -0.03);
      g.add(blanket);
      const blanketTrim = figurePart(new THREE.BoxGeometry(1.0, 0.025, 0.99), '#C9A45E', { lightness: 0.03, castShadow: false });
      blanketTrim.position.set(0, 1.85, -0.03);
      g.add(blanketTrim);

      for (const [dx, dz] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25], [0, 0]]) {
        const diamond = figurePart(new THREE.OctahedronGeometry(0.075, 0), '#E3D2A4', {
          lightness: 0.03, castShadow: false
        });
        diamond.scale.set(1.0, 0.2, 1.0);
        diamond.rotation.y = Math.PI / 4;
        diamond.position.set(dx, 1.918, dz - 0.03);
        g.add(diamond);
      }

      for (let i = 0; i < 5; i++) {
        const t = -0.4 + i * 0.2;
        [[t, 0.47], [t, -0.47], [0.47, t], [-0.47, t]].forEach(([px, pz]) => {
          const tassel = figurePart(new THREE.ConeGeometry(0.014, 0.085, 3), '#C9A45E', {
            lightness: 0.03, castShadow: false
          });
          tassel.position.set(px, 1.826, pz - 0.03);
          tassel.rotation.x = Math.PI;
          g.add(tassel);
        });
      }

      const saddle = figurePart(new THREE.BoxGeometry(0.55, 0.13, 0.55), '#4B2F21', { lightness: 0.035 });
      saddle.position.set(0, 1.975, -0.03);
      g.add(saddle);
      const pommel = figurePart(new THREE.BoxGeometry(0.42, 0.18, 0.15), '#5A3825', { lightness: 0.04 });
      pommel.position.set(0, 2.03, 0.27);
      pommel.rotation.x = 0.22;
      g.add(pommel);
      const cantle = figurePart(new THREE.BoxGeometry(0.42, 0.2, 0.15), '#5A3825', { lightness: 0.04 });
      cantle.position.set(0, 2.03, -0.31);
      cantle.rotation.x = -0.18;
      g.add(cantle);
      const seat = figurePart(new THREE.BoxGeometry(0.34, 0.03, 0.42), '#8A6040', { lightness: 0.03, castShadow: false });
      seat.position.set(0, 2.045, -0.03);
      g.add(seat);

      for (const sx of [-1, 1]) {
        const frontHorn = figurePart(new THREE.ConeGeometry(0.034, 0.17, 5), '#6B4A32', {
          lightness: 0.04, castShadow: false
        });
        frontHorn.position.set(sx * 0.17, 2.16, 0.25);
        frontHorn.rotation.x = 0.22;
        g.add(frontHorn);
        const rearHorn = figurePart(new THREE.ConeGeometry(0.034, 0.15, 5), '#6B4A32', {
          lightness: 0.04, castShadow: false
        });
        rearHorn.position.set(sx * 0.17, 2.15, -0.33);
        rearHorn.rotation.x = -0.18;
        g.add(rearHorn);
      }

      const saddleBag = figurePart(new THREE.BoxGeometry(0.2, 0.24, 0.13), '#6B4A32', { lightness: 0.04 });
      saddleBag.position.set(0.33, 1.79, -0.27);
      g.add(saddleBag);
      const bagFlap = figurePart(new THREE.BoxGeometry(0.22, 0.085, 0.14), '#4B2F21', {
        lightness: 0.03, castShadow: false
      });
      bagFlap.position.set(0.33, 1.91, -0.27);
      g.add(bagFlap);
      const bagStrap = figurePart(new THREE.BoxGeometry(0.02, 0.22, 0.02), '#4B2F21', {
        lightness: 0.02, castShadow: false
      });
      bagStrap.position.set(0.33, 1.99, -0.26);
      g.add(bagStrap);

      for (const sx of [-1, 1]) {
        const strap = figurePart(new THREE.BoxGeometry(0.04, 0.4, 0.09), '#3A291E', { lightness: 0.02, castShadow: false });
        strap.position.set(sx * 0.46, 1.78, -0.02);
        g.add(strap);
        const stirrup = figurePart(new THREE.TorusGeometry(0.065, 0.014, 3, 8), '#8A8A92', { lightness: 0.025, castShadow: false });
        stirrup.position.set(sx * 0.46, 1.55, -0.02);
        g.add(stirrup);
        const footplate = figurePart(new THREE.BoxGeometry(0.1, 0.02, 0.07), '#6F7079', { lightness: 0.02, castShadow: false });
        footplate.position.set(sx * 0.46, 1.485, -0.02);
        g.add(footplate);

        const rein = tube(
          new V3(sx * 0.09, 2.05, 1.36),
          new V3(sx * 0.18, 2.02, 0.3),
          0.012, 0.012, '#3A291E', { lightness: 0.02, figure: true, segments: 4, castShadow: false }
        );
        g.add(rein);
      }

      const girth = figurePart(new THREE.TorusGeometry(1, 0.026, 3, 18), '#3A291E', { lightness: 0.02, castShadow: false });
      girth.position.set(0, 1.43, 0.08);
      girth.scale.set(0.5, 0.43, 1);
      g.add(girth);

      const breastCollar = figurePart(new THREE.TorusGeometry(0.3, 0.024, 3, 14), '#8E3A33', {
        lightness: 0.03, castShadow: false
      });
      breastCollar.rotation.x = Math.PI / 2;
      breastCollar.position.set(0, 1.68, 0.594);
      g.add(breastCollar);

      const bell = figurePart(new THREE.ConeGeometry(0.034, 0.05, 6), '#C9A45E', {
        lightness: 0.03, castShadow: false
      });
      bell.position.set(0, 1.63, 0.855);
      bell.rotation.x = Math.PI;
      g.add(bell);

      const brand = figurePart(new THREE.TorusGeometry(0.068, 0.013, 3, 6), '#7A3A18', {
        lightness: 0.03, castShadow: false
      });
      brand.rotation.y = -Math.PI / 2;
      brand.position.set(-0.45, 1.32, -0.32);
      g.add(brand);

      horseEars.forEach(ear => { ear.userData.noMerge = true; });
      mergeStaticMeshes(g);
      g.userData.rig = {
        legs: horseLegs, tail: tailGroup, head: headGroup, ears: horseEars,
        baseHeadX: headGroup.rotation.x, baseHeadY: headGroup.rotation.y,
        baseEarZ: horseEars.map(ear => ear.rotation.z),
        baseX: x, baseZ: z, baseRot: rot, baseY: groundHeight(x, z)
      };
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = rot;
      g.scale.setScalar(scale);
      scene.add(g);
      return g;
    }

    const horse = createHorse(7.9, -4.3, -1.35, 1.06);
    const horseMat = figureMat.clone();
    horseMat.emissive = new THREE.Color(0x40241A);
    horseMat.emissiveIntensity = 0.2;
    const horseMatDouble = horseMat.clone();
    horseMatDouble.side = THREE.DoubleSide;
    horse.traverse(child => {
      if (!child.isMesh) return;
      if (child.material === figureMat) child.material = horseMat;
      else if (child.material === figureMatDouble) child.material = horseMatDouble;
    });
    const horseShadow = contactShadow(1.6, 2.4, 0.38);
    horseShadow.position.z = -0.1;
    horse.add(horseShadow);

    function createWoodpile(x, z, rot) {
      const g = new THREE.Group();
      const woodA = '#7A5233';
      const woodB = '#6B4529';
      const cut = '#B08A5E';
      const rows = [
        { y: 0.11, zs: [-0.23, 0.01, 0.25] },
        { y: 0.3, zs: [-0.11, 0.13] }
      ];
      for (const row of rows) {
        for (const zz of row.zs) {
          const log = faceted(new THREE.CylinderGeometry(0.1, 0.1, 0.85, 6), row.y < 0.2 ? woodA : woodB, { lightness: 0.04 });
          log.rotation.z = Math.PI / 2;
          log.position.set(0, row.y, zz);
          g.add(log);
          const cutEnd = faceted(new THREE.CylinderGeometry(0.093, 0.093, 0.015, 6), cut, { lightness: 0.03, castShadow: false });
          cutEnd.rotation.z = Math.PI / 2;
          cutEnd.position.set(0.435, row.y, zz);
          g.add(cutEnd);
        }
      }
      const stump = faceted(new THREE.CylinderGeometry(0.19, 0.22, 0.3, 7), '#5C4129', { lightness: 0.045 });
      stump.position.set(-0.75, 0.15, 0.03);
      g.add(stump);
      const stumpTop = faceted(new THREE.CylinderGeometry(0.19, 0.19, 0.022, 7), cut, { lightness: 0.035, castShadow: false });
      stumpTop.position.set(-0.75, 0.31, 0.03);
      g.add(stumpTop);
      const axeHandle = tube(new V3(-0.8, 0.3, 0.04), new V3(-0.55, 0.75, 0.02), 0.022, 0.028, '#6D4F35', { lightness: 0.03, segments: 4 });
      g.add(axeHandle);
      const axeHead = faceted(new THREE.BoxGeometry(0.055, 0.19, 0.21), '#7A7A84', { lightness: 0.04 });
      axeHead.position.set(-0.54, 0.76, 0.02);
      axeHead.rotation.z = 0.2;
      g.add(axeHead);
      for (const zz of [-0.12, 0.12]) {
        const snow = faceted(new THREE.IcosahedronGeometry(0.13, 0), '#D8D2E8', { lightness: 0.03, castShadow: false });
        snow.scale.set(2.4, 0.28, 0.7);
        snow.position.set(0.05, 0.405, zz);
        g.add(snow);
      }
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = rot;
      scene.add(g);
      return g;
    }

    function createBucket(x, z) {
      const g = new THREE.Group();
      const body = faceted(new THREE.CylinderGeometry(0.16, 0.125, 0.27, 8), '#7A5A3A', { lightness: 0.04 });
      body.position.y = 0.135;
      g.add(body);
      const band = faceted(new THREE.TorusGeometry(0.148, 0.012, 3, 10), '#4A454E', { lightness: 0.02, castShadow: false });
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.22;
      g.add(band);
      const handle = faceted(new THREE.TorusGeometry(0.145, 0.012, 3, 8, Math.PI), '#4A454E', { lightness: 0.02, castShadow: false });
      handle.position.y = 0.27;
      g.add(handle);
      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = range(0, Math.PI);
      scene.add(g);
      return g;
    }

    createWoodpile(-1.0, -3.1, 0.35);
    createBucket(1.6, -2.2);

    const postX = 7.4;
    const postZ = -2.5;
    const postY = groundHeight(postX, postZ);
    const hitchingPost = faceted(new THREE.CylinderGeometry(0.05, 0.07, 1.2, 5), '#5B4432', { lightness: 0.035 });
    hitchingPost.position.set(postX, postY + 0.6, postZ);
    scene.add(hitchingPost);
    const leadRope = tube(
      new V3(postX, postY + 1.12, postZ),
      new V3(6.9, groundHeight(7.9, -4.3) + 2.05, -4.05),
      0.014, 0.014, '#5A4636', { lightness: 0.02, castShadow: false, segments: 4 }
    );
    scene.add(leadRope);

    function createRockCluster(x, z, scale = 1) {
      const g = new THREE.Group();
      const count = 3 + Math.floor(rnd() * 3);
      for (let i = 0; i < count; i++) {
        const s = range(0.45, 1.05) * scale;
        const rock = faceted(new THREE.DodecahedronGeometry(s, 0), '#6a637c', { lightness: 0.06 });
        rock.scale.set(range(0.85, 1.5), range(0.5, 0.9), range(0.8, 1.3));
        rock.position.set(range(-1.3, 1.3) * scale, s * 0.28, range(-1.1, 1.1) * scale);
        rock.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
        g.add(rock);

        if (i === 0) {
          const cap = faceted(new THREE.IcosahedronGeometry(s * 0.62, 0), '#cbc5e2', { lightness: 0.025 });
          cap.scale.set(1.25, 0.22, 1.05);
          cap.position.set(rock.position.x, s * 0.72, rock.position.z);
          cap.rotation.y = rnd() * 3;
          g.add(cap);
        }
      }
      g.position.set(x, groundHeight(x, z), z);
      scene.add(g);
      return g;
    }

    createRockCluster(-6.9, 4.6, 0.85);
    createRockCluster(6.4, 5.2, 0.95);
    createRockCluster(-4.0, 3.8, 0.4);
    createRockCluster(3.5, 5.1, 0.34);
    createRockCluster(-13.2, 2.7, 0.75);
    createRockCluster(21.5, -1.5, 0.9);
    createRockCluster(-19.5, -7.5, 0.7);
    createRockCluster(16.8, 2.8, 0.5);

    function createGrassTuft(x, z, scale = 1) {
      const verts = [];
      for (let i = 0; i < 7; i++) {
        const a = rnd() * Math.PI * 2;
        const bx = Math.cos(a) * 0.05;
        const bz = Math.sin(a) * 0.05;
        const wx = Math.cos(a + Math.PI / 2) * 0.025;
        const wz = Math.sin(a + Math.PI / 2) * 0.025;
        const h = range(0.2, 0.42);
        const lean = range(0.04, 0.13);
        const tx = bx + Math.cos(a) * lean;
        const tz = bz + Math.sin(a) * lean;
        verts.push(bx - wx, 0, bz - wz, bx + wx, 0, bz + wz, tx, h, tz);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      const tuft = faceted(geo, '#6F5C3F', { doubleSide: true, lightness: 0.06, castShadow: false });
      tuft.position.set(x, groundHeight(x, z) + 0.01, z);
      tuft.scale.setScalar(scale);
      scene.add(tuft);
      return tuft;
    }

    createGrassTuft(-2.2, 5.0, 1.1);
    createGrassTuft(2.0, 5.2, 1.0);
    createGrassTuft(-0.8, 4.6, 0.85);
    createGrassTuft(7.8, 3.9, 0.8);

    const bannerCloths = [];
    function createBannerPole(x, z, hex) {
      const g = new THREE.Group();
      const pole = faceted(new THREE.CylinderGeometry(0.055, 0.075, 5.4, 6), '#5a4432', { lightness: 0.03 });
      pole.position.y = 2.7;
      g.add(pole);
      const tip = faceted(new THREE.ConeGeometry(0.09, 0.3, 5), '#3a2d22', { lightness: 0.02 });
      tip.position.y = 5.5;
      g.add(tip);

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0.95, -0.05);
      shape.lineTo(0.9, -1.42);
      shape.lineTo(0.58, -1.16);
      shape.lineTo(0.26, -1.53);
      shape.lineTo(0, -1.3);
      shape.closePath();
      const clothGeo = new THREE.ShapeGeometry(shape);
      const cloth = new THREE.Mesh(
        paintFaces(clothGeo, () => jitter(new THREE.Color(hex), 0.04, 0.015, 0.004)),
        facetMatDouble
      );
      cloth.position.set(0.04, 5.25, 0);
      cloth.castShadow = false;
      cloth.userData.phase = rnd() * 6.28;
      cloth.userData.baseRot = range(-0.07, 0.07);
      g.add(cloth);
      bannerCloths.push(cloth);

      g.position.set(x, groundHeight(x, z), z);
      g.rotation.y = range(-0.2, 0.2);
      scene.add(g);
      return g;
    }

    createBannerPole(-23, -11.5, '#6b2b3e');
    createBannerPole(21.5, -16.5, '#3c3560');

    function createFence(points) {
      const g = new THREE.Group();
      const tops = [];
      points.forEach(([x, z]) => {
        const y = groundHeight(x, z);
        const post = faceted(new THREE.CylinderGeometry(0.055, 0.08, 1.15, 5), '#5b4432', { lightness: 0.035 });
        post.position.set(x, y + 0.55, z);
        g.add(post);
        tops.push(new V3(x, y + 0.95, z));
      });
      for (let i = 0; i < tops.length - 1; i++) {
        const rope = tube(tops[i], tops[i + 1], 0.018, 0.018, '#7a6650', { lightness: 0.02, castShadow: false, segments: 4 });
        g.add(rope);
        const rope2 = tube(
          tops[i].clone().add(new V3(0, -0.26, 0)),
          tops[i + 1].clone().add(new V3(0, -0.26, 0)),
          0.014, 0.014, '#6f5c47', { lightness: 0.02, castShadow: false, segments: 4 }
        );
        g.add(rope2);
      }
      scene.add(g);
      return g;
    }

    createFence([[6.8, -12.6], [9.8, -13.1], [12.9, -13.5], [16.0, -13.8], [19.0, -13.6]]);

    const snowfallCount = 420;
    const snowPositions = new Float32Array(snowfallCount * 3);
    const snowSpeeds = new Float32Array(snowfallCount);
    for (let i = 0; i < snowfallCount; i++) {
      snowPositions[i * 3] = range(-45, 45);
      snowPositions[i * 3 + 1] = range(0, 32);
      snowPositions[i * 3 + 2] = range(-42, 28);
      snowSpeeds[i] = range(0.45, 1.1);
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xf3ecff, size: 0.062, transparent: true, opacity: 0.42,
      depthWrite: false, sizeAttenuation: true
    });
    const snowfall = new THREE.Points(snowGeo, snowMat);
    scene.add(snowfall);

    const STORY_LEN = 60;
    let storyTimeOffset = 0;
    let storyDoorBoost = 1;

    const storyCurve = (points, closed = false) =>
      new THREE.CatmullRomCurve3(points.map(([x, z]) => new V3(x, 0, z)), closed, 'centripetal');

    const singer = people[0], rider = people[1], yurtKeeper = people[2], woodKeeper = people[3];
    const riderP = rider.userData.parts;
    const yurtP = yurtKeeper.userData.parts;
    const woodP = woodKeeper.userData.parts;

    const curveALead = storyCurve([
      [-3.35, 0], [-4.0, 0.8], [-4.0, 2.4], [-3.2, 3.6], [-2.0, 3.6], [-1.0, 3.0]
    ]);
    const curveALoop = storyCurve([
      [-1.0, 3.0], [-0.2, 3.8], [1.2, 3.8], [2.0, 3.0], [1.2, 2.2], [-0.2, 2.2]
    ], true);
    const curveAReturn = storyCurve([
      [-1.0, 3.0], [-2.0, 3.6], [-3.2, 3.6], [-4.0, 2.4], [-4.0, 0.8], [-3.35, 0]
    ]);
    const curveBToHorse = storyCurve([
      [-1.45, -1.45], [1.0, -1.5], [3.8, -1.2], [6.0, -2.1], [7.15, -3.15]
    ]);
    const curveBBack = storyCurve([
      [7.05, -3.0], [5.0, -2.0], [2.5, -1.5], [0.0, -1.4], [-1.45, -1.45]
    ]);
    const curveCToYurt = storyCurve([
      [0.85, -0.25], [0.55, -1.4], [0.0, -2.7], [-0.4, -3.5]
    ]);
    const curveCBack = storyCurve([
      [-0.4, -3.5], [0.0, -2.7], [0.55, -1.4], [0.85, -0.25]
    ]);
    const curveDWood = storyCurve([
      [-2.4, 2.5], [-3.9, 1.6], [-3.7, -0.6], [-2.6, -2.2], [-1.4, -2.55]
    ]);
    const curveDReturn = storyCurve([
      [-1.4, -2.55], [-2.6, -2.2], [-3.4, -0.5], [-3.2, 1.4], [-2.3, 2.2]
    ]);
    const horseCurve = storyCurve([
      [7.9, -4.3], [5.5, -2.0], [4.0, 0.8], [3.6, 3.2],
      [6.0, 4.8], [9.2, 4.0], [10.9, 1.2], [10.2, -2.2]
    ], true);

    function sitPerson(person) {
      const p = person.userData.parts;
      p.standTarget = 0;
      p.walking = false;
      p.walkAmount = 0;
      p.airborne = false;
      p.leanOffset = 0;
      p.targetYaw = p.baseYaw;
      resetGait(person);
      person.visible = true;
      person.position.copy(p.basePos);
    }

    function standPerson(person) {
      const p = person.userData.parts;
      p.standTarget = 0.42;
      p.walking = false;
      p.walkAmount = 0;
      p.airborne = false;
      p.leanOffset = 0;
      p.targetYaw = p.baseYaw;
      resetGait(person);
      person.visible = true;
      person.position.copy(p.basePos);
    }

    function walkPerson(person, curve, u, rate = 5.2, ease = false) {
      const p = person.userData.parts;
      if (!p.walking) {
        resetGait(person);
        p.walkBlend = 0;
      }
      const uu = clamp(u, 0, 1);
      const pu = ease ? smoothstep(0, 1, uu) : uu;
      const pt = curve.getPointAt(pu);
      const look = Math.min(1, pu + 0.035);
      const tan = curve.getTangentAt(look);
      person.position.x = pt.x;
      person.position.z = pt.z;
      person.position.y = groundHeight(pt.x, pt.z);
      p.targetYaw = Math.atan2(tan.x, tan.z);
      p.standTarget = 0.42;
      p.walking = true;
      p.walkAmount = 1;
      p.airborne = false;
      p.leanOffset = 0;
    }

    function angleLerp(a, b, amount) {
      let delta = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (delta < -Math.PI) delta += Math.PI * 2;
      return a + delta * amount;
    }

    const GAIT_HIP_Y = 0.9;
    const GAIT_L1 = 0.4;
    const GAIT_L2 = 0.4;
    const gaitFootWorld = new V3();
    const gaitFootLocal = new V3();

    function resetGait(person) {
      const p = person.userData.parts;
      p.gait.initialized = false;
      p.gait.cycle = 0;
      p.standLegs.forEach(leg => {
        leg.state = 'stance';
        leg.prevPhase = 0;
        leg.phase = 0;
        leg.hip.rotation.x = 0;
        leg.hip.rotation.z = 0;
        leg.knee.rotation.x = 0;
        leg.foot.rotation.x = 0;
      });
    }

    function initGait(person) {
      const p = person.userData.parts;
      const scale = p.baseScale;
      const yaw = person.rotation.y;
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);
      p.gait.stride = 1.15 * scale;
      p.gait.cycle = 0;
      p.standLegs.forEach((leg, index) => {
        const side = leg.side * 0.14 * scale;
        const x = person.position.x + rightX * side;
        const z = person.position.z + rightZ * side;
        leg.anchor.set(x, groundHeight(x, z), z);
        leg.swingStart.copy(leg.anchor);
        leg.landing.copy(leg.anchor);
        leg.phase = index * 0.5;
        leg.prevPhase = leg.phase;
        leg.state = 'stance';
      });
      p.gait.initialized = true;
    }

    function solveLegIK(leg, targetX, targetY, targetZ) {
      const hipX = leg.side * 0.14;
      const dx = targetX - hipX;
      const dy = targetY - GAIT_HIP_Y;
      const dz = targetZ;
      const distance = clamp(Math.hypot(dx, dy, dz), 0.24, 0.795);
      const alpha = Math.atan2(dz, -dy);
      const beta = Math.acos(clamp((GAIT_L1 * GAIT_L1 + distance * distance - GAIT_L2 * GAIT_L2) / (2 * GAIT_L1 * distance), -1, 1));
      const delta = Math.acos(clamp((GAIT_L2 * GAIT_L2 + distance * distance - GAIT_L1 * GAIT_L1) / (2 * GAIT_L2 * distance), -1, 1));
      const hipRotation = -alpha - beta;
      const kneeRotation = beta + delta;
      leg.hip.rotation.x = hipRotation;
      leg.knee.rotation.x = kneeRotation;
      leg.hip.rotation.z = clamp(Math.atan2(dx, -dy) * 0.45, -0.18, 0.18);
      leg.phase = leg.phase;
      return { hipRotation, kneeRotation };
    }

    function updateGaitLegs(person, p) {
      if (!p.gait.initialized || p.riding || p.airborne || p.standLift < 0.05) return false;
      const g = p.gait;
      const scale = p.baseScale;
      const yaw = person.rotation.y;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const forwardX = Math.sin(yaw);
      const forwardZ = Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);
      p.standLegs.forEach((leg, index) => {
        const phase = (g.cycle + index * 0.5) % 1;
        if (phase + 1e-6 < leg.prevPhase) {
          if (leg.state === 'swing') {
            leg.anchor.copy(leg.landing);
            leg.state = 'stance';
          }
        }
        if (leg.state === 'stance' && leg.prevPhase < g.stanceFrac && phase >= g.stanceFrac) {
          leg.state = 'swing';
          leg.swingStart.copy(leg.anchor);
          const lead = g.stride * 0.38;
          const side = leg.side * 0.14 * scale;
          leg.landing.set(
            person.position.x + forwardX * lead + rightX * side,
            0,
            person.position.z + forwardZ * lead + rightZ * side
          );
          leg.landing.y = groundHeight(leg.landing.x, leg.landing.z);
        }
        if (phase < g.stanceFrac) {
          leg.state = 'stance';
          gaitFootWorld.copy(leg.anchor);
        } else {
          const swingU = smoothstep(0, 1, (phase - g.stanceFrac) / (1 - g.stanceFrac));
          gaitFootWorld.lerpVectors(leg.swingStart, leg.landing, swingU);
          gaitFootWorld.y += Math.sin(Math.PI * swingU) * 0.11 * scale;
        }

        const ankleY = gaitFootWorld.y + 0.1 * scale;
        const dx = gaitFootWorld.x - person.position.x;
        const dz = gaitFootWorld.z - person.position.z;
        const localX = (dx * cosYaw - dz * sinYaw) / scale;
        const localZ = (dx * sinYaw + dz * cosYaw) / scale;
        const localY = (ankleY - person.position.y) / scale;
        const solved = solveLegIK(leg, localX, localY, localZ);

        let footPitch = -(solved.hipRotation + solved.kneeRotation) * 0.8;
        if (phase < g.stanceFrac) {
          const stanceU = phase / g.stanceFrac;
          footPitch -= (1 - smoothstep(0, 0.22, stanceU)) * 0.1;
          footPitch += smoothstep(0.66, 1, stanceU) * 0.24;
        } else {
          const swingU = (phase - g.stanceFrac) / (1 - g.stanceFrac);
          footPitch += Math.sin(Math.PI * swingU) * 0.14;
        }
        leg.foot.rotation.x = footPitch;
        leg.phase = phase;
        leg.prevPhase = phase;
      });
      return true;
    }

    function horseMountPoint() {
      horse.updateMatrixWorld(true);
      return horse.localToWorld(new V3(0, 0.98, -0.03));
    }

    function attachRider() {
      if (riderP.riderAttached) return;
      horse.updateMatrixWorld(true);
      horse.attach(rider);
      rider.position.set(0, 0.98, -0.03);
      rider.rotation.set(0, 0, 0);
      rider.scale.setScalar(riderP.baseScale / horse.scale.x);
      riderP.riderAttached = true;
      riderP.riding = true;
      riderP.airborne = false;
      riderP.mountStart = null;
      riderP.mountYaw = null;
    }

    function detachRider() {
      if (!riderP.riderAttached) return;
      horse.updateMatrixWorld(true);
      scene.attach(rider);
      rider.scale.setScalar(riderP.baseScale);
      rider.rotation.set(0, horse.rotation.y, 0);
      riderP.riderAttached = false;
      riderP.riding = false;
      riderP.airborne = true;
      riderP.dismountStart = rider.position.clone();
    }

    function mountRider(T) {
      riderP.standTarget = 0.42;
      riderP.walking = false;
      riderP.walkAmount = 0;
      riderP.airborne = true;
      riderP.leanOffset = 0;
      if (!riderP.mountStart) {
        riderP.mountStart = rider.position.clone();
        riderP.mountYaw = rider.rotation.y;
      }
      const target = horseMountPoint();
      const u = smoothstep(0, 1, (T - 11) / 1);
      rider.position.lerpVectors(riderP.mountStart, target, u);
      rider.position.y += Math.sin(u * Math.PI) * 0.24;
      rider.rotation.y = angleLerp(riderP.mountYaw, horse.rotation.y, u);
      if (u >= 0.999) attachRider();
    }

    function dismountRider(T) {
      if (!riderP.dismountStart) riderP.dismountStart = rider.position.clone();
      const end = new V3(7.05, groundHeight(7.05, -3.0), -3.0);
      const u = smoothstep(0, 1, (T - 38) / 1);
      rider.position.lerpVectors(riderP.dismountStart, end, u);
      rider.rotation.y = horse.rotation.y;
      if (u >= 0.999) {
        riderP.airborne = false;
        riderP.dismountStart = null;
      }
    }

    function animateHorse(t, moving) {
      const rig = horse.userData.rig;
      const phase = t * 8.2;
      if (moving) {
        rig.legs.forEach(leg => {
          const diagonal = (leg.front && leg.side < 0) || (!leg.front && leg.side > 0);
          const p = phase + (diagonal ? 0 : Math.PI);
          leg.root.rotation.x = Math.sin(p) * 0.36;
          leg.knee.rotation.x = Math.max(0, Math.sin(p + 0.85)) * 0.52;
        });
        horse.position.y += Math.abs(Math.sin(phase)) * 0.018;
        rig.head.rotation.x = rig.baseHeadX + Math.sin(phase * 0.45) * 0.055;
        rig.head.rotation.y = rig.baseHeadY + Math.sin(t * 0.6) * 0.045;
        rig.tail.rotation.z = Math.sin(t * 3.0) * 0.2;
        rig.ears.forEach((ear, i) => {
          ear.rotation.z = rig.baseEarZ[i] + Math.sin(t * 2.3 + i) * 0.04;
        });
      } else {
        rig.legs.forEach(leg => {
          leg.root.rotation.x = damp(leg.root.rotation.x, 0, 10, FIXED_DT);
          leg.knee.rotation.x = damp(leg.knee.rotation.x, 0, 10, FIXED_DT);
        });
        const graze = Math.pow(Math.max(0, Math.sin(t * 0.16 + 0.9)), 8) * 0.22;
        rig.head.rotation.x = rig.baseHeadX + graze + Math.sin(t * 0.6) * 0.045;
        rig.head.rotation.y = rig.baseHeadY + Math.sin(t * 0.32) * 0.06;
        rig.tail.rotation.z = Math.sin(t * 1.25) * 0.13;
        rig.ears.forEach((ear, i) => {
          ear.rotation.z = rig.baseEarZ[i] + Math.sin(t * 1.7 + i) * 0.055;
        });
      }
    }

    function animateAnimals(t) {
      sheepFlock.forEach((sheep, idx) => {
        const rig = sheep.userData.rig;
        const tt = t + rig.phase;
        const graze = Math.max(0, Math.sin(tt * 0.22 + idx * 1.3));
        rig.head.rotation.x = rig.baseHeadX + graze * 0.3 + Math.sin(tt * 1.3) * 0.025;
        rig.head.rotation.y = rig.baseHeadY + Math.sin(tt * 0.35 + idx) * 0.1;
        rig.head.rotation.z = rig.baseHeadZ + Math.sin(tt * 0.6 + idx) * 0.03;
        rig.tail.rotation.z = Math.sin(tt * 2.0 + idx) * 0.16;
        rig.ears.forEach((ear, j) => {
          ear.rotation.z = rig.baseEarZ[j] + Math.sin(tt * (2.0 + j * 0.5) + idx) * 0.06;
        });
        rig.body.scale.y = rig.baseBodyScale.y * (1 + Math.sin(tt * 1.1 + idx) * 0.012);
        if (rig.isLamb) {
          sheep.position.y = rig.baseY + Math.max(0, Math.sin(tt * 1.35)) * 0.06;
        }
      });

      const goatRig = goat.userData.rig;
      const gt = t + goatRig.phase;
      goatRig.tail.rotation.z = goatRig.baseTailZ + Math.sin(gt * 2.2) * 0.22;
      goatRig.ears.forEach((ear, i) => {
        ear.rotation.z = goatRig.baseEarZ[i] + Math.sin(gt * 1.7 + i) * 0.07;
      });
      goatRig.body.scale.y = goatRig.baseBodyScale.y * (1 + Math.sin(gt * 1.0) * 0.012);

      const yakRig = yak.userData.rig;
      const yt = t + yakRig.phase;
      yakRig.tail.rotation.z = yakRig.baseTailZ + Math.sin(yt * 1.2) * 0.12;
      yakRig.tail.rotation.y = Math.sin(yt * 0.5) * 0.25;
      yakRig.ears.forEach((ear, i) => {
        ear.rotation.z = yakRig.baseEarZ[i] + Math.sin(yt * 1.3 + i) * 0.055;
      });
      yakRig.body.scale.y = yakRig.baseBodyScale.y * (1 + Math.sin(yt * 0.8) * 0.011);
      yakRig.muzzle.scale.y = 1 + Math.sin(yt * 2.5) * 0.03;
      yakRig.chinBeard.rotation.z = Math.sin(yt * 2.5) * 0.03;
    }

    const speechPulses = (() => {
      const rng = seededRng(20261021);
      const pulses = [];
      let time = 0.28;
      while (time < 4.82) {
        if (rng() < 0.16) time += 0.14 + rng() * 0.22;
        const length = 0.09 + rng() * 0.10;
        pulses.push({
          t: time,
          len: length,
          amp: 0.35 + rng() * 0.65,
          stress: rng() < 0.22
        });
        time += length + 0.03;
      }
      return pulses;
    })();

    function sampleSpeech(pulses, time) {
      let env = 0;
      let stress = 0;
      for (const pulse of pulses) {
        if (time < pulse.t || time > pulse.t + pulse.len + 0.11) continue;
        const local = time - pulse.t;
        const attack = local < 0.04 ? local / 0.04 : 1;
        const release = local > pulse.len ? Math.max(0, 1 - (local - pulse.len) / 0.1) : 1;
        const value = Math.max(0, Math.min(attack, release)) * pulse.amp;
        env = Math.max(env, value);
        if (pulse.stress) stress = Math.max(stress, value);
      }
      return { env, stress };
    }

    const lookScratch = new V3();
    const lookHead = new V3();
    function headPoint(person, out) {
      const p = person.userData.parts;
      return out.set(
        person.position.x,
        person.position.y + 1.55 * p.baseScale,
        person.position.z
      );
    }
    function setLook(person, x, y, z, weight) {
      const p = person.userData.parts;
      p.lookTarget.set(x, y, z);
      p.lookWeight = weight;
    }
    function updatePerformance(T) {
      const sp = T < 5 ? sampleSpeech(speechPulses, T) : { env: 0, stress: 0 };
      const reaction = T < 5 ? sampleSpeech(speechPulses, T - 0.2) : { env: 0, stress: 0 };
      people.forEach((person, index) => {
        const p = person.userData.parts;
        if (index === 0) {
          p.speechEnv = sp.env;
          p.speechStress = sp.stress;
          p.reactEnv = 0;
          p.reactStress = 0;
        } else {
          p.reactEnv = reaction.env;
          p.reactStress = reaction.stress;
          p.speechEnv = 0;
          p.speechStress = 0;
        }
      });

      headPoint(singer, lookHead);
      const singerHeadX = lookHead.x;
      const singerHeadY = lookHead.y;
      const singerHeadZ = lookHead.z;

      if (T < 5) {
        headPoint(rider, lookScratch);
        setLook(singer, lookScratch.x, lookScratch.y, lookScratch.z, 0.9);
        setLook(rider, singerHeadX, singerHeadY, singerHeadZ, 1);
        setLook(yurtKeeper, singerHeadX, singerHeadY, singerHeadZ, 1);
        setLook(woodKeeper, singerHeadX, singerHeadY, singerHeadZ, 1);
      } else if (T < 10.5) {
        setLook(singer, firePos.x, firePos.y + 1.1, firePos.z, 0.65);
        const horseYaw = horse.rotation.y;
        setLook(rider,
          horse.position.x + Math.sin(horseYaw) * 1.25,
          horse.position.y + 2.15,
          horse.position.z + Math.cos(horseYaw) * 1.25,
          0.85);
        setLook(yurtKeeper, -0.4, 1.25, -3.4, 0.9);
        setLook(woodKeeper, firePos.x, firePos.y + 0.9, firePos.z, 0.7);
      } else if (T < 36) {
        setLook(singer, firePos.x, firePos.y + 1.2, firePos.z, 0.55);
        if (T < 12) {
          const horseYaw = horse.rotation.y;
          setLook(rider,
            horse.position.x + Math.sin(horseYaw) * 1.25,
            horse.position.y + 2.15,
            horse.position.z + Math.cos(horseYaw) * 1.25,
            0.9);
        } else {
          const fx = Math.sin(horse.rotation.y);
          const fz = Math.cos(horse.rotation.y);
          setLook(rider, horse.position.x + fx * 3.2, horse.position.y + 1.9,
            horse.position.z + fz * 3.2, 0.7);
        }
        if (T < 14.2) {
          setLook(woodKeeper, -1.0, 0.65, -3.05, 0.85);
        } else {
          setLook(woodKeeper, firePos.x, firePos.y + 1.0, firePos.z, 0.8);
        }
      } else if (T < 44) {
        setLook(singer, firePos.x, firePos.y + 0.9, firePos.z, 0.8);
        setLook(rider, firePos.x, firePos.y + 0.9, firePos.z, 0.8);
        setLook(yurtKeeper, firePos.x, firePos.y + 0.9, firePos.z, 0.8);
        setLook(woodKeeper, singerHeadX, singerHeadY, singerHeadZ, 0.75);
      } else {
        setLook(singer, firePos.x, firePos.y + 1.0, firePos.z, 0.75);
        setLook(rider, singerHeadX, singerHeadY, singerHeadZ, 0.8);
        setLook(yurtKeeper, singerHeadX, singerHeadY, singerHeadZ, 0.8);
        setLook(woodKeeper, singerHeadX, singerHeadY, singerHeadZ, 0.8);
      }
    }

    function updateStory(T, t) {
      if (T < 5) {
        sitPerson(singer);
      } else if (T < 6.2) {
        standPerson(singer);
      } else if (T < 9.5) {
        walkPerson(singer, curveALead, (T - 6.2) / 3.3, 3.0, true);
      } else if (T < 36) {
        walkPerson(singer, curveALoop, ((T - 9.5) % 13.25) / 13.25, 3.0);
      } else if (T < 39.5) {
        walkPerson(singer, curveAReturn, (T - 36) / 3.5, 3.0, true);
      } else {
        sitPerson(singer);
      }

      if (T < 5.3) {
        seatRiderReset();
      } else if (T < 6.5) {
        standPerson(rider);
      } else if (T < 11) {
        walkPerson(rider, curveBToHorse, (T - 6.5) / 4.5, 5.2, true);
      } else if (T < 12) {
        mountRider(T);
      } else if (T < 38) {
        if (!riderP.riderAttached) attachRider();
        riderP.standTarget = 0.42;
        riderP.walking = false;
        riderP.walkAmount = 0;
        riderP.airborne = false;
        riderP.leanOffset = 0.08;
      } else if (T < 39) {
        if (riderP.riderAttached) detachRider();
        dismountRider(T);
      } else if (T < 44) {
        riderP.riding = false;
        riderP.airborne = false;
        walkPerson(rider, curveBBack, (T - 39) / 5, 5.2, true);
      } else {
        seatRiderReset();
      }

      if (T < 5.6) {
        yurtP.hidden = false;
        yurtKeeper.visible = true;
        sitPerson(yurtKeeper);
      } else if (T < 6.8) {
        standPerson(yurtKeeper);
      } else if (T < 10.5) {
        walkPerson(yurtKeeper, curveCToYurt, (T - 6.8) / 3.7, 4.4, true);
      } else if (T < 35) {
        yurtP.hidden = true;
        yurtP.standTarget = 0.42;
        yurtP.walking = false;
        yurtP.walkAmount = 0;
        yurtP.airborne = false;
        yurtKeeper.visible = false;
        yurtKeeper.position.set(-0.4, groundHeight(-0.4, -3.5), -3.5);
      } else if (T < 35.5) {
        const exitYaw = Math.atan2(firePos.x + 0.4, firePos.z + 3.5);
        yurtP.hidden = false;
        yurtKeeper.visible = true;
        yurtKeeper.position.set(-0.4, groundHeight(-0.4, -3.5), -3.5);
        yurtKeeper.rotation.y = exitYaw;
        yurtP.targetYaw = exitYaw;
        yurtP.standTarget = 0.42;
        yurtP.walking = false;
        yurtP.walkAmount = 0;
        yurtP.airborne = false;
        yurtP.leanOffset = 0;
      } else if (T < 39.5) {
        yurtP.hidden = false;
        yurtKeeper.visible = true;
        walkPerson(yurtKeeper, curveCBack, (T - 35.5) / 4, 4.4, true);
      } else {
        yurtP.hidden = false;
        sitPerson(yurtKeeper);
      }

      if (T < 5.9) {
        sitPerson(woodKeeper);
        woodP.carryLog.visible = false;
      } else if (T < 10) {
        standPerson(woodKeeper);
      } else if (T < 12.9) {
        walkPerson(woodKeeper, curveDWood, (T - 10) / 2.9, 5.2, true);
      } else if (T < 14.2) {
        woodP.standTarget = 0.42;
        woodP.walking = false;
        woodP.walkAmount = 0;
        woodP.leanOffset = Math.max(0, Math.sin(((T - 12.9) / 1.3) * Math.PI)) * 0.34;
        woodP.carryLog.visible = true;
      } else if (T < 17.2) {
        walkPerson(woodKeeper, curveDReturn, (T - 14.2) / 3, 5.2, true);
        woodP.carryLog.visible = true;
      } else if (T < 19.7) {
        const stokeYaw = Math.atan2(firePos.x + 2.3, firePos.z - 2.2);
        woodP.standTarget = 0.42;
        woodP.walking = false;
        woodP.walkAmount = 0;
        woodP.leanOffset = 0.24;
        woodP.carryLog.visible = T < 17.6;
        woodKeeper.position.set(-2.3, groundHeight(-2.3, 2.2), 2.2);
        woodKeeper.rotation.y = stokeYaw;
        woodP.targetYaw = stokeYaw;
      } else {
        sitPerson(woodKeeper);
        woodP.carryLog.visible = false;
      }

      if (T >= 12 && T < 38) {
        const u = clamp((T - 12) / 26, 0, 1);
        const pt = horseCurve.getPointAt(u);
        const tan = horseCurve.getTangentAt(u);
        horse.position.set(pt.x, groundHeight(pt.x, pt.z), pt.z);
        horse.rotation.y = Math.atan2(tan.x, tan.z);
        animateHorse(t, true);
      } else {
        horse.position.set(horse.userData.rig.baseX, horse.userData.rig.baseY, horse.userData.rig.baseZ);
        horse.rotation.y = horse.userData.rig.baseRot;
        animateHorse(t, false);
      }

      storyDoorBoost = yurtP.hidden ? 1.35 + Math.sin(t * 2.2) * 0.06 : 1;
      const doorLeaf = gerMain.userData.doorLeaf;
      if (doorLeaf) {
        const open = smoothstep(10.2, 10.7, T) * (1 - smoothstep(35.0, 35.5, T));
        doorLeaf.rotation.y = -open * 1.15;
      }

      updatePerformance(T);
    }

    function seatRiderReset() {
      if (riderP.riderAttached) {
        scene.attach(rider);
        rider.scale.setScalar(riderP.baseScale);
        riderP.riderAttached = false;
        riderP.riding = false;
      }
      riderP.mountStart = null;
      riderP.mountYaw = null;
      riderP.dismountStart = null;
      sitPerson(rider);
    }

    function separateWalkers() {
      const minDistance = 0.95;
      for (let i = 0; i < people.length; i++) {
        const a = people[i];
        const pa = a.userData.parts;
        if (pa.walkAmount < 0.15 || pa.riding || pa.hidden || pa.airborne) continue;
        for (let j = 0; j < people.length; j++) {
          if (i === j) continue;
          const b = people[j];
          const pb = b.userData.parts;
          if (pb.hidden || pb.riding) continue;
          const dx = a.position.x - b.position.x;
          const dz = a.position.z - b.position.z;
          const distance = Math.hypot(dx, dz);
          if (distance > 0.001 && distance < minDistance) {
            const push = minDistance - distance;
            a.position.x += (dx / distance) * push;
            a.position.z += (dz / distance) * push;
          }
        }
      }
    }

    const CAMERA_SHOTS = [
      {
        start: 0, end: 3.0,
        from: { pos: [1.4, 5.4, 14.2], target: [0.0, 2.35, -3.7], fov: 48 },
        to: { pos: [0.55, 4.35, 11.8], target: [-0.25, 2.1, -3.15], fov: 46 },
        hand: 0
      },
      {
        start: 3.0, end: 6.2,
        from: { pos: [1.2, 3.5, 6.6], target: [-1.6, 1.05, 0.2], fov: 40 },
        to: { pos: [0.8, 3.2, 5.8], target: [-1.75, 1.05, 0.25], fov: 38 },
        hand: 0.006
      },
      {
        start: 6.2, end: 12.0,
        from: { pos: [2.6, 4.0, 9.6], target: [-0.9, 1.35, 0.0], fov: 42 },
        to: { pos: [2.0, 3.5, 8.2], target: [-0.8, 1.3, 0.4], fov: 40 },
        hand: 0.012
      },
      { start: 12.0, end: 18.0, track: 'singer', fov: 37, hand: 0.008 },
      { start: 18.0, end: 28.0, track: 'horse', fov: 40, hand: 0.015 },
      { start: 28.0, end: 36.0, track: 'horseWide', fov: 50, hand: 0.008 },
      {
        start: 36.0, end: 44.0,
        from: { pos: [2.4, 1.62, 2.5], target: [-0.4, 1.25, -3.45], fov: 34 },
        to: { pos: [1.55, 1.82, 1.65], target: [-0.5, 1.35, -3.35], fov: 32 },
        hand: 0.006
      },
      {
        start: 44.0, end: 60.0,
        from: { pos: [0.8, 4.1, 11.0], target: [-0.35, 2.0, -2.7], fov: 46 },
        to: { pos: [1.4, 5.4, 14.2], target: [0.0, 2.35, -3.7], fov: 48 },
        hand: 0.005
      }
    ];

    const viewToggle = document.getElementById('view-toggle');
    const viewHint = document.querySelector('.hint');
    const stageEl = document.getElementById('stage');
    const cameraLook = new V3(0, 2.3, -3.5);
    const cameraGoal = new V3();
    const cameraPos = new V3();
    let cinematicMode = true;
    let cameraShotIndex = -1;
    controls.enabled = false;

    function setViewMode(free) {
      cinematicMode = !free;
      controls.enabled = free;
      cameraShotIndex = -1;
      if (free) {
        controls.target.copy(cameraLook);
        camera.fov = 50;
        camera.updateProjectionMatrix();
        controls.update();
      }
      stageEl.classList.toggle('free', free);
      if (viewToggle) viewToggle.textContent = free ? 'Cinematic camera' : 'Free look';
      if (viewHint) viewHint.textContent = free
        ? '60-second camp story · free camera'
        : '60-second camp story · cinematic camera';
    }
    if (viewToggle) {
      viewToggle.addEventListener('click', () => setViewMode(cinematicMode));
    }
    const qualityToggle = document.getElementById('quality-toggle');
    if (qualityToggle) {
      qualityToggle.addEventListener('click', () => {
        qualityHigh = !qualityHigh;
        renderer.autoClear = !qualityHigh;
        qualityToggle.textContent = qualityHigh ? 'Quality: High' : 'Quality: Low';
      });
    }

    function updateCinematicCamera(T, dt) {
      if (!cinematicMode) return;
      let shotIndex = CAMERA_SHOTS.length - 1;
      for (let i = 0; i < CAMERA_SHOTS.length; i++) {
        if (T >= CAMERA_SHOTS[i].start && T < CAMERA_SHOTS[i].end) {
          shotIndex = i;
          break;
        }
      }
      const shot = CAMERA_SHOTS[shotIndex];
      const shotChanged = cameraShotIndex !== shotIndex;
      cameraShotIndex = shotIndex;
      const u = smoothstep(0, 1, clamp((T - shot.start) / (shot.end - shot.start), 0, 1));

      if (shot.track === 'singer') {
        const yaw = singer.rotation.y;
        const fx = Math.sin(yaw);
        const fz = Math.cos(yaw);
        const rx = Math.cos(yaw);
        const rz = -Math.sin(yaw);
        const front = 4.4 + u * 0.25;
        const side = 1.3 + u * 0.15;
        cameraPos.set(
          singer.position.x + fx * front + rx * side,
          singer.position.y + 1.98 + u * 0.08,
          singer.position.z + fz * front + rz * side
        );
        cameraGoal.set(
          singer.position.x + fx * 0.25,
          singer.position.y + 1.12,
          singer.position.z + fz * 0.25
        );
        if (shotChanged) camera.fov = shot.fov;
      } else if (shot.track === 'horse') {
        const horseYaw = horse.rotation.y;
        const fx = Math.sin(horseYaw);
        const fz = Math.cos(horseYaw);
        const rx = Math.cos(horseYaw);
        const rz = -Math.sin(horseYaw);
        const side = 5.6 - u * 0.8;
        const back = -2.0 + u * 0.5;
        cameraPos.set(
          horse.position.x + rx * side - fx * back,
          horse.position.y + 2.7 + u * 0.2,
          horse.position.z + rz * side - fz * back
        );
        cameraGoal.set(
          horse.position.x + fx * (1.0 + u * 0.55),
          horse.position.y + 2.05,
          horse.position.z + fz * (1.0 + u * 0.55)
        );
        if (shotChanged) camera.fov = shot.fov;
      } else if (shot.track === 'horseWide') {
        const horseYaw = horse.rotation.y;
        const fx = Math.sin(horseYaw);
        const fz = Math.cos(horseYaw);
        const rx = Math.cos(horseYaw);
        const rz = -Math.sin(horseYaw);
        const side = 9.5 + u * 1.0;
        const back = 4.8 + u * 1.2;
        cameraPos.set(
          horse.position.x + rx * side - fx * back,
          horse.position.y + 5.7 + u * 0.4,
          horse.position.z + rz * side - fz * back
        );
        cameraGoal.set(
          horse.position.x + fx * 0.8,
          horse.position.y + 1.55,
          horse.position.z + fz * 0.8
        );
        if (shotChanged) camera.fov = shot.fov;
      } else {
        cameraPos.set(
          THREE.MathUtils.lerp(shot.from.pos[0], shot.to.pos[0], u),
          THREE.MathUtils.lerp(shot.from.pos[1], shot.to.pos[1], u),
          THREE.MathUtils.lerp(shot.from.pos[2], shot.to.pos[2], u)
        );
        cameraGoal.set(
          THREE.MathUtils.lerp(shot.from.target[0], shot.to.target[0], u),
          THREE.MathUtils.lerp(shot.from.target[1], shot.to.target[1], u),
          THREE.MathUtils.lerp(shot.from.target[2], shot.to.target[2], u)
        );
      }

      const hand = shot.hand || 0;
      if (hand) {
        const shakeX = fbm1(T * 0.45 + 11.0) * hand;
        const shakeY = fbm1(T * 0.38 + 27.0) * hand * 0.65;
        const shakeZ = fbm1(T * 0.42 + 43.0) * hand;
        cameraPos.x += shakeX;
        cameraPos.y += shakeY;
        cameraPos.z += shakeZ;
        cameraGoal.x += fbm1(T * 0.3 + 64.0) * hand * 0.5;
        cameraGoal.y += fbm1(T * 0.26 + 72.0) * hand * 0.35;
      }

      if (shotChanged) {
        cameraLook.copy(cameraGoal);
        camera.position.copy(cameraPos);
        camera.fov = shot.track ? shot.fov : shot.from.fov;
      } else {
        cameraLook.lerp(cameraGoal, 1 - Math.exp(-7 * dt));
        camera.position.copy(cameraPos);
        const targetFov = shot.track
          ? shot.fov
          : THREE.MathUtils.lerp(shot.from.fov, shot.to.fov, u);
        camera.fov = damp(camera.fov, targetFov, 8, dt);
      }
      camera.lookAt(cameraLook);
      camera.updateProjectionMatrix();
    }

    const clock = new THREE.Clock();
    let accumulator = 0;
    let paused = false;
    function simulate(dt, t) {
      const storyT = ((t + storyTimeOffset) % STORY_LEN + STORY_LEN) % STORY_LEN;
      updateStory(storyT, t);
      separateWalkers();
      updateCinematicCamera(storyT, dt);

      const flicker = 1 + Math.sin(t * 12.5) * 0.05 + Math.sin(t * 7.1 + 1.7) * 0.03;
      fireLight.intensity = 14 * flicker;
      fireLight.position.x = Math.sin(t * 9.3) * 0.06;
      fireLight.position.z = Math.cos(t * 8.1) * 0.06;
      fireHalo.material.opacity = 0.26 + flicker * 0.08;
      fireCore.material.opacity = 0.22 + flicker * 0.08;

      doorLights.forEach((light, i) => {
        light.intensity = 6 * (1 + Math.sin(t * 5.3 + i * 1.7) * 0.05 + Math.sin(t * 11 + i * 2.1) * 0.025) *
          (i === 0 ? storyDoorBoost : 1);
      });

      people.forEach(person => {
        const p = person.userData.parts;
        const pt = t + p.animPhase;
        const life = t + p.noiseSeed;
        const breath = Math.sin(pt * 1.15) * 0.004 + fbm1(life * 0.33) * 0.0022;
        p.standLift = damp(p.standLift, p.standTarget, 9, dt);
        if (p.standTarget > 0.001 && !p.stood && p.standLift > 0.36) {
          p.stood = true;
          p.seatedGroup.visible = false;
          p.standGroup.visible = true;
        }
        if (p.standTarget <= 0.001 && p.standLift < 0.06 && p.stood) {
          p.stood = false;
          p.seatedGroup.visible = true;
          p.standGroup.visible = false;
        }
        const moved = person.parent === scene
          ? Math.hypot(person.position.x - p.prevX, person.position.z - p.prevZ)
          : 0;
        const instSpeed = moved / Math.max(dt, 0.001);
        p.prevX = person.position.x;
        p.prevZ = person.position.z;
        p.speed = damp(p.speed, instSpeed, 10, dt);

        let lookYawTarget = 0;
        let lookPitchTarget = 0;
        if (p.lookWeight > 0.001) {
          const dx = p.lookTarget.x - person.position.x;
          const dz = p.lookTarget.z - person.position.z;
          const distance = Math.max(0.001, Math.hypot(dx, dz));
          const worldYaw = Math.atan2(dx, dz);
          lookYawTarget = clamp(angleDelta(person.rotation.y, worldYaw), -0.85, 0.85) * p.lookWeight;
          const headY = person.position.y + 1.52 * p.baseScale;
          lookPitchTarget = clamp(Math.atan2(-(p.lookTarget.y - headY), distance), -0.45, 0.5) * p.lookWeight;
        }
        p.lookYaw = angleDamp(p.lookYaw, lookYawTarget, 3.6, dt);
        p.lookPitch = damp(p.lookPitch, lookPitchTarget, 3.6, dt);
        p.gazeX = damp(p.gazeX, lookYawTarget * 0.0034 + fbm1(life * 0.9) * 0.0006, 12, dt);

        const walkTarget = p.walking && p.speed > 0.06 ? 1 : 0;
        p.walkBlend = damp(p.walkBlend, walkTarget, 10, dt);
        const walkAmt = p.walkBlend;

        if (p.walking && p.standLift > 0.05 && !p.gait.initialized) initGait(person);
        if (p.gait.initialized) {
          if (moved > p.baseScale * 0.45) {
            initGait(person);
          } else {
            p.gait.cycle = (p.gait.cycle + moved / p.gait.stride) % 1;
          }
          p.walkPhase = p.gait.cycle * Math.PI * 2;
        }

        if (!p.riding && !p.airborne && person.parent === scene) {
          const cycle = p.gait.initialized ? p.gait.cycle : 0;
          person.position.y = groundHeight(person.position.x, person.position.z) +
            Math.abs(Math.sin(cycle * Math.PI * 2)) * 0.025 * walkAmt - 0.012 * walkAmt;
        }

        const weightShift = fbm1(life * 0.11) * 0.009 * (1 - walkAmt);
        p.upper.position.x = Math.sin(p.walkPhase) * 0.013 * walkAmt + weightShift;
        p.upper.position.y = p.baseUpperY + p.standLift + breath +
          Math.sin(p.walkPhase * 2) * 0.005 * walkAmt;
        p.upper.rotation.x = p.baseLean + p.leanOffset + walkAmt * 0.022 +
          Math.sin(pt * 0.8 + 0.7) * 0.008 + fbm1(life * 0.19) * 0.004;
        p.upper.rotation.y = Math.sin(p.walkPhase) * 0.045 * walkAmt +
          fbm1(life * 0.15 + 4.1) * 0.006 * (1 - walkAmt);

        let yawDelta = 0;
        if (!p.riding && !p.airborne) {
          yawDelta = angleDelta(person.rotation.y, p.targetYaw);
          person.rotation.y = angleDamp(person.rotation.y, p.targetYaw, 14, dt);
          p.upper.rotation.z = Math.sin(pt * 0.55) * 0.008 +
            clamp(yawDelta, -0.5, 0.5) * 0.12 * walkAmt;
        } else {
          p.upper.rotation.z = Math.sin(pt * 0.55) * 0.008;
        }

        const gaitActive = updateGaitLegs(person, p);
        p.standLegs.forEach((leg, j) => {
          const side = j === 0 ? -1 : 1;
          if (p.riding) {
            leg.hip.rotation.x = -0.55;
            leg.hip.rotation.z = side * 0.55;
            leg.knee.rotation.x = 1.15;
            leg.foot.rotation.x = 0.12;
          } else if (p.airborne) {
            leg.hip.rotation.x = -0.45;
            leg.hip.rotation.z = side * 0.22;
            leg.knee.rotation.x = 0.95;
            leg.foot.rotation.x = -0.25;
          } else if (!gaitActive) {
            leg.hip.rotation.x = 0;
            leg.hip.rotation.z = side * 0.02;
            leg.knee.rotation.x = 0;
            leg.foot.rotation.x = 0;
          }
        });
        p.arms.forEach((arm, j) => {
          if (arm.talk) return;
          arm.root.rotation.x = p.riding ? 0 :
            Math.sin(p.walkPhase - 0.65 + (j ? Math.PI : 0)) * 0.2 * walkAmt;
        });
        p.sashTail.rotation.z = p.sashBaseZ + Math.sin(p.walkPhase - 0.5) * 0.06 * walkAmt +
          Math.sin(pt * 1.3) * 0.008;
        p.sashTail.rotation.x = p.sashBaseX + Math.cos(p.walkPhase * 0.8) * 0.06 * walkAmt;
        p.standShadow.visible = !p.riding && !p.airborne;

        const yawSway = p.sing ? 0.05 : p.tea ? 0.012 : 0.018;
        const pitchSway = p.sing ? 0.018 : p.tea ? 0.028 : p.listen ? 0.02 : 0.012;
        const speechNod = p.speechStress * 0.045 + p.reactStress * 0.035;
        p.head.rotation.y = p.baseHeadY +
          (Math.sin(pt * (p.sing ? 0.55 : 0.4)) * yawSway + fbm1(life * 0.23) * 0.014) +
          p.lookYaw - p.upper.rotation.y * 0.8;
        p.head.rotation.x = p.baseHeadX +
          Math.sin(pt * (p.tea ? 0.6 : 0.45)) * pitchSway +
          (p.speechEnv * -0.018) + speechNod + p.lookPitch +
          fbm1(life * 0.19 + 8.3) * 0.01 +
          (p.tea ? Math.max(0, Math.sin(pt * 0.5)) * 0.04 : 0) +
          (p.listen ? Math.max(0, Math.sin(pt * 1.25)) * 0.012 : 0);
        p.head.rotation.z = p.baseHeadZ + Math.sin(pt * 0.5) * (p.sing ? 0.026 : 0.008) +
          fbm1(life * 0.21 + 3.7) * 0.007;

        if (t > p.nextBlink) {
          p.blinkStart = t;
          p.nextBlink = t + 2.2 + rnd() * 4.2;
          p.doubleBlink = rnd() < 0.16;
        }
        const blinkAge = t - p.blinkStart;
        const blinkClosed = (blinkAge >= 0 && blinkAge < 0.12) ||
          (p.doubleBlink && blinkAge > 0.23 && blinkAge < 0.34);
        const blink = blinkClosed ? 0.08 : 1;
        p.eyes.forEach((eye, j) => {
          const target = p.eyeBaseY * blink;
          eye.group.scale.y = damp(eye.group.scale.y, target, 22, dt);
          eye.pupil.position.x = eye.baseX + p.gazeX +
            fbm1(life * 1.15 + j * 2.7) * 0.0007;
          eye.pupil.position.y = eye.baseY + p.gazeY + p.lookPitch * 0.0016 +
            fbm1(life * 0.95 + j * 1.9) * 0.0006;
        });

        p.brows.forEach((brow, j) => {
          brow.mesh.rotation.z = brow.baseZ +
            Math.sin(pt * (p.sing ? 1.8 : 0.8) + j) * (p.sing ? 0.012 : 0.006) +
            (j === 0 ? -1 : 1) * p.speechStress * 0.025;
          brow.mesh.position.y = brow.baseY + p.speechStress * 0.004 +
            p.reactStress * 0.003 + fbm1(life * 0.5 + j) * 0.0008;
        });

        if (p.sing) {
          const env = clamp(p.speechEnv, 0, 1);
          p.mouth.scale.y = 0.42 + env * 1.35;
          p.mouth.scale.x = 1 + env * 0.06;
        } else {
          p.mouth.scale.y = 1 + Math.sin(pt * 0.9) * 0.025 + p.reactEnv * 0.05;
        }

        if (p.talkArm) {
          const gesture = clamp(p.speechEnv * 0.2 + p.speechStress * 0.12, 0, 0.3);
          p.talkArm.fore.rotation.x = p.talkArm.baseForeX +
            Math.sin(pt * 1.3) * 0.035 + gesture;
          p.talkArm.fore.rotation.z = p.talkArm.baseForeZ +
            Math.cos(pt * 1.1) * 0.025 + p.speechEnv * 0.04;
        }
        if (p.warm) {
          p.arms.forEach((arm, j) => {
            arm.fore.rotation.x = arm.baseForeX +
              Math.sin(pt * 2.8 + j * Math.PI) * 0.04 +
              fbm1(life * 0.7 + j * 3.1) * 0.015;
          });
        }
        if (p.tea && p.bowl) {
          p.bowl.position.y = p.baseBowlY + 0.015 * Math.sin(pt * 0.55) +
            fbm1(life * 0.4) * 0.003;
          p.bowl.rotation.z = Math.sin(pt * 0.4) * 0.02;
        }

        if (p.steam && p.steam.length) {
          p.steam.forEach((puff, si) => {
            const k = (pt * 0.26 + puff.userData.phase) % 1;
            puff.position.set(
              Math.sin(k * 4.2 + si * 1.7) * 0.024,
              0.07 + k * 0.3,
              Math.cos(k * 3.1 + si) * 0.022
            );
            puff.scale.setScalar(0.6 + k * 1.5);
            puff.material.opacity = 0.42 * (1 - k) * (k < 0.12 ? k / 0.12 : 1);
          });
        }

        if (p.breath && p.breath.length) {
          p.breath.forEach((puff, bi) => {
            const k = (pt * 0.2 + puff.userData.phase) % 1;
            puff.position.set(
              Math.sin(k * 3.4 + bi * 2.1) * 0.035,
              k * 0.17,
              k * 0.26
            );
            puff.scale.setScalar(0.45 + k * 1.7);
            puff.material.opacity = 0.34 * (1 - k) * (k < 0.1 ? k / 0.1 : 1);
          });
        }
      });

      flames.forEach((flame, i) => {
        const p = flame.userData.phase;
        const f = 0.92 + Math.sin(t * (10 + i * 1.3) + p) * 0.12 + Math.sin(t * 18 + p) * 0.04;
        flame.scale.set(1 + Math.sin(t * 5.2 + p) * 0.05, f, 1);
        flame.rotation.y = flame.userData.baseRotY + Math.sin(t * 1.6 + p) * 0.12;
        flame.rotation.z = Math.sin(t * 2.3 + p) * 0.03;
        flame.position.x = Math.sin(t * 3.4 + p) * 0.02;
      });

      smokePuffs.forEach(puff => {
        const d = puff.userData;
        const k = (d.phase + t * d.speed) % 1;
        puff.position.set(
          d.base.x + d.drift * k + Math.sin(k * 7 + d.phase * 9) * 0.22,
          d.base.y + k * 4.3,
          d.base.z + Math.cos(k * 5 + d.phase * 6) * 0.25
        );
        const s = d.size * (0.6 + k * 1.45);
        puff.scale.setScalar(s);
        puff.material.opacity = 0.22 * (1 - k) * (k < 0.08 ? k / 0.08 : 1);
        puff.rotation.y = k * 3;
      });

      bannerCloths.forEach(cloth => {
        cloth.rotation.z = cloth.userData.baseRot + Math.sin(t * 1.15 + cloth.userData.phase) * 0.035;
        cloth.rotation.y = Math.sin(t * 0.8 + cloth.userData.phase) * 0.06;
      });

      cloudGroups.forEach(group => {
        group.position.x = group.userData.baseX + Math.sin(t * 0.016 + group.userData.phase) * 9;
      });

      geeseGroup.position.x += dt * 0.9;
      geeseGroup.position.y = 24 + Math.sin(t * 0.35) * 1.1;
      if (geeseGroup.position.x > 130) geeseGroup.position.x = -130;
      geese.forEach((bird, i) => {
        const phase = bird.userData.phase;
        const flap = Math.sin(t * 5.2 + phase) * 0.52;
        bird.userData.left.rotation.z = flap;
        bird.userData.right.rotation.z = -flap;
        bird.position.y += Math.sin(t * 1.2 + i) * 0.0006;
      });

      const snowArr = snowGeo.attributes.position.array;
      for (let i = 0; i < snowfallCount; i++) {
        snowArr[i * 3] += dt * 0.32;
        snowArr[i * 3 + 1] -= dt * snowSpeeds[i];
        if (snowArr[i * 3 + 1] < 0) {
          snowArr[i * 3] = range(-45, 45);
          snowArr[i * 3 + 1] = range(24, 34);
          snowArr[i * 3 + 2] = range(-42, 28);
        }
      }
      snowGeo.attributes.position.needsUpdate = true;

      animateAnimals(t);
      if (storyT > 5 && storyT < 45) renderer.shadowMap.needsUpdate = true;
    }

    function renderFrame() {
      if (!cinematicMode) controls.update();
      if (qualityHigh) {
        composer.render();
      } else {
        renderer.autoClear = true;
        renderer.render(scene, camera);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      const frameDt = Math.min(clock.getDelta(), 0.1);
      if (!paused) {
        accumulator += frameDt;
        let steps = 0;
        while (accumulator >= FIXED_DT && steps < 6) {
          simulate(FIXED_DT, simTime);
          simTime += FIXED_DT;
          accumulator -= FIXED_DT;
          steps++;
        }
      }
      renderFrame();
    }

    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
    }
    new ResizeObserver(resize).observe(stage);

    window.__steppe = {
      renderer, scene, camera, controls, people, horse,
      setStoryTime: seconds => {
        storyTimeOffset = seconds - (simTime % STORY_LEN);
      },
      setPaused: value => { paused = !!value; },
      seek: (seconds, settle = 45) => {
        storyTimeOffset = seconds - (simTime % STORY_LEN);
        for (let i = 0; i < settle; i++) {
          simulate(FIXED_DT, simTime);
          simTime += FIXED_DT;
        }
        renderFrame();
      }
    };
    animate();
    requestAnimationFrame(() => {
      document.body.classList.add('ready');
      setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.remove();
      }, 1000);
    });
