import * as THREE from "three";

const POST_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tDiffuse;
  varying vec2 vUv;

  vec3 linearToSRGB(vec3 c) {
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  float bayer4(vec2 p) {
    vec2 f = mod(floor(p), 4.0);
    float x = f.x;
    float y = f.y;
    // 4x4 Bayer matrix, normalized 0..1
    float m[16];
    m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
    m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
    m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
    m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
    int idx = int(y * 4.0 + x);
    for (int i = 0; i < 16; i++) {
      if (i == idx) return m[i] / 16.0;
    }
    return 0.0;
  }

  void main() {
    // target texture is sRGB, so the hardware decodes it to linear on sample;
    // re-encode before display or the framebuffer shows linear values (crushed darks)
    vec3 color = linearToSRGB(texture2D(tDiffuse, vUv).rgb);
    float d = bayer4(gl_FragCoord.xy) - 0.5;
    // PS1: 15-bit color (5 bits per channel) with ordered dithering
    color = floor(color * 31.0 + d * 0.35 + 0.5) / 31.0;
    // faint vignette, like a CRT
    float v = smoothstep(1.35, 0.45, length(vUv - 0.5) * 1.6);
    color *= mix(0.82, 1.0, v);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const POST_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export function createPipeline(renderer, scene, camera) {
  const target = new THREE.WebGLRenderTarget(320, 240, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
    samples: 4,
  });
  target.texture.colorSpace = THREE.SRGBColorSpace;

  const postMaterial = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: target.texture } },
    vertexShader: POST_VERT,
    fragmentShader: POST_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const postScene = new THREE.Scene();
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial));
  const postCamera = new THREE.Camera();

  // Internal resolution is fixed-height like a console; width follows aspect.
  const INTERNAL_HEIGHT = 720;

  function setSize(cssWidth, cssHeight) {
    renderer.setSize(cssWidth, cssHeight, false);
    const aspect = cssWidth / cssHeight;
    const h = INTERNAL_HEIGHT;
    const w = Math.max(2, Math.round(h * aspect));
    target.setSize(w, h);
  }

  function render() {
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
  }

  return { setSize, render, target };
}
