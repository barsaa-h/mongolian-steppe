import * as THREE from "three";

const cache = new Map();

function cached(key, make) {
  let value = cache.get(key);
  if (!value) {
    value = make();
    cache.set(key, value);
  }
  return value;
}

function canvasTexture(w, h, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function cloneRepeat(texture, x, y) {
  const t = texture.clone();
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(x, y);
  t.needsUpdate = true;
  return t;
}

export function stoneTexture() {
  return cached("stone", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#8d887c";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = ["#817c70", "#989284", "#78736a", "#a39d8e"][(Math.random() * 4) | 0];
      ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = "rgba(60,56,50,0.2)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 10, 1);
    }
  }));
}

function speckle(ctx, w, h, colors, count, minR, maxR) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
    const r = minR + Math.random() * (maxR - minR);
    ctx.fillRect(Math.random() * w, Math.random() * h, r, r);
  }
}

export function steppeTexture() {
  return cached("steppe", () => canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#82884f";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = ["rgba(148,142,88,0.35)", "rgba(110,118,64,0.3)", "rgba(163,152,96,0.28)"][(Math.random() * 3) | 0];
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.ellipse(x, y, 8 + Math.random() * 26, 4 + Math.random() * 14, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    speckle(ctx, w, h, ["#6e7642", "#939a5c", "#a3a06a", "#5f6a3c", "#b0a874"], 5200, 1, 3);
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? "#c8bc7e" : "#d6cfa0";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 2);
    }
  }));
}

export function mountainTexture() {
  return cached("mountain", () => canvasTexture(64, 64, (ctx, w, h) => {
    const rand = mulberry(7301);
    ctx.fillStyle = "#a1a394";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = i % 3 ? "#8c9284" : "#b8bbae";
      ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 3, 1 + rand() * 2);
    }
    for (let i = 0; i < 12; i++) {
      let x = rand() * w, y = rand() * h;
      ctx.fillStyle = "#747c72";
      for (let step = 0; step < 7; step++) {
        ctx.fillRect(x, y, 1 + rand() * 2, 2);
        x += rand() * 3 - 1;
        y += 2;
      }
    }
  }));
}

export function dirtTexture() {
  return cached("dirt", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#b29a74";
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, ["#a68c66", "#c0a77e", "#9a8260", "#c8b088", "#8e7858"], 2400, 1, 3);
    ctx.fillStyle = "rgba(120,96,66,0.28)";
    ctx.fillRect(0, h * 0.3, w, 9);
    ctx.fillRect(0, h * 0.66, w, 7);
    ctx.fillStyle = "rgba(214,190,148,0.28)";
    ctx.fillRect(0, h * 0.48, w, 5);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? "#8a7656" : "#c8b48c";
      const s = 1 + Math.random() * 2;
      ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
  }));
}

export function asphaltTexture() {
  return cached("asphalt", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#615e58";
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, ["#57544f", "#6b6861", "#4d4b47", "#75726b"], 2800, 1, 3);
    ctx.strokeStyle = "rgba(40,38,36,0.5)";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      let x = Math.random() * w;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < h) {
        x += (Math.random() - 0.5) * 14;
        y += 4 + Math.random() * 8;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = "rgba(44,42,40,0.35)";
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 1 + Math.random() * 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }));
}

export function concreteTexture(color = "#c4bba6") {
  return cached(`concrete:${color}`, () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(80,76,68,${0.03 + Math.random() * 0.07})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 18, 1 + Math.random() * 5);
    }
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255,252,240,${0.04 + Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 14, 1 + Math.random() * 4);
    }
    speckle(ctx, w, h, ["rgba(70,66,58,0.16)", "rgba(245,240,225,0.14)"], 900, 1, 2);
    ctx.fillStyle = "rgba(70,66,58,0.12)";
    ctx.fillRect(0, h - 8, w, 8);
  }));
}

export function panelTexture(color, floorLines = 0) {
  return cached(`panel:${color}:${floorLines}`, () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 34; i++) {
      ctx.fillStyle = `rgba(88,84,74,${0.02 + Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 22, 1 + Math.random() * 4);
    }
    speckle(ctx, w, h, ["rgba(70,66,58,0.1)", "rgba(255,250,235,0.1)"], 700, 1, 2);
    if (floorLines > 0) {
      ctx.fillStyle = "rgba(72,66,58,0.2)";
      for (let i = 1; i < floorLines; i++) {
        ctx.fillRect(0, (h / floorLines) * i, w, 1);
      }
    }
    ctx.fillStyle = "rgba(66,60,52,0.14)";
    ctx.fillRect(0, h - 6, w, 6);
  }));
}

export function brickTexture() {
  return cached("brick", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#b3a68e";
    ctx.fillRect(0, 0, w, h);
    const brickW = 16;
    const brickH = 8;
    for (let row = 0; row < h / brickH; row++) {
      const offset = row % 2 ? brickW / 2 : 0;
      for (let x = -brickW; x < w + brickW; x += brickW) {
        const shade = ["#9a6a50", "#a57458", "#8e6048", "#ac7c5e"][(Math.random() * 4) | 0];
        ctx.fillStyle = shade;
        ctx.fillRect(x + offset + 1, row * brickH + 1, brickW - 2, brickH - 2);
      }
    }
    speckle(ctx, w, h, ["rgba(60,40,30,0.2)", "rgba(230,210,190,0.15)"], 500, 1, 2);
  }));
}

export function corrugatedTexture(tint = "#8b8b84") {
  return cached(`corrugated:${tint}`, () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 6) {
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(x, 0, 2, h);
      ctx.fillStyle = "rgba(40,38,34,0.2)";
      ctx.fillRect(x + 3, 0, 2, h);
    }
    speckle(ctx, w, h, ["#7c7a72", "#97968e", "#6d6b64", "#a2a098"], 240, 1, 2);
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = "rgba(112,66,40,0.35)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 5, 1 + Math.random() * 3);
    }
  }));
}

export function woodTexture() {
  return cached("wood", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#7d5836";
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 10) {
      ctx.fillStyle = (y / 10) % 2 === 0 ? "#6d4a2c" : "#88613c";
      ctx.fillRect(0, y + 1, w, 3);
      ctx.fillStyle = "rgba(50,32,18,0.35)";
      ctx.fillRect(0, y + 8, w, 1);
    }
    speckle(ctx, w, h, ["#5c3a24", "#8d6140", "#a07450"], 520, 1, 2);
  }));
}

export function fenceTexture(tone = "warm") {
  const palettes = {
    grey: ["#7c7a72", "#8a8880", "#6e6c65", "#94928a"],
    blue: ["#3e6e98", "#4d82ae", "#2f587c", "#5a90bc"],
    green: ["#2f6a46", "#3d7c54", "#245438", "#4c8c62"],
    red: ["#8a3c34", "#9a4c42", "#6e2e28", "#a85a4c"],
    white: ["#e6e2d6", "#d8d4c8", "#f2eee4", "#c8c4b6"],
    warm: ["#8a6a44", "#9a7a50", "#7a5a38", "#a88a60"],
  };
  const palette = palettes[tone] || palettes.warm;
  return cached(`fence:${tone}`, () => canvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);
    const plank = 12;
    for (let x = 0; x < w; x += plank) {
      ctx.fillStyle = palette[(x / plank) % palette.length | 0];
      ctx.fillRect(x, 0, plank - 1, h);
      ctx.fillStyle = "rgba(48,34,20,0.4)";
      ctx.fillRect(x + plank - 1, 0, 1, h);
      ctx.fillStyle = "rgba(255,240,210,0.08)";
      ctx.fillRect(x, 0, 1, h);
    }
    const wear = mulberry(tone.length * 131 + tone.charCodeAt(0));
    for (let x = 0; x < w; x += plank) {
      ctx.fillStyle = "#9c8b70";
      ctx.fillRect(x + 2, h - 5 - wear() * 15, 2 + wear() * 6, 16);
      ctx.fillRect(x + 4, 5 + wear() * 30, 2, 3 + wear() * 7);
    }
    ctx.fillStyle = "rgba(48,34,20,0.25)";
    ctx.fillRect(0, 10, w, 2);
    ctx.fillRect(0, 46, w, 2);
    speckle(ctx, w, h, ["rgba(50,34,20,0.25)", "rgba(220,200,170,0.12)"], 300, 1, 2);
  }));
}

export function gerWallTexture() {
  return cached("gerWall", () => canvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = "#ded6c2";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(170,158,132,${0.03 + Math.random() * 0.07})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 16, 1 + Math.random() * 4);
    }
    ctx.fillStyle = "rgba(150,136,110,0.18)";
    ctx.fillRect(0, h - 9, w, 9);
    ctx.fillStyle = "#b34a31";
    ctx.fillRect(0, 6, w, 3);
    ctx.fillStyle = "#2c4a72";
    ctx.fillRect(0, 12, w, 2);
    ctx.fillStyle = "#c8983e";
    ctx.fillRect(0, 14, w, 1);
    ctx.fillStyle = "rgba(255,252,240,0.3)";
    ctx.fillRect(0, 2, w, 2);
    speckle(ctx, w, h, ["rgba(120,108,88,0.13)", "rgba(255,252,238,0.18)"], 260, 1, 2);
  }));
}

export function gerRoofTexture() {
  return cached("gerRoof", () => canvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = "#d6cdb8";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(160,146,120,${0.04 + Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 5 + Math.random() * 18, 1 + Math.random() * 3);
    }
    ctx.fillStyle = "rgba(255,250,235,0.15)";
    for (let x = 0; x < w; x += 8) ctx.fillRect(x, 0, 1, h);
    speckle(ctx, w, h, ["rgba(140,126,102,0.12)", "rgba(255,250,235,0.18)"], 220, 1, 2);
  }));
}

export function doorTexture() {
  return cached("gerDoor", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#a63a2b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#d99a42";
    ctx.fillRect(4, 4, w - 8, 4);
    ctx.fillRect(4, h - 8, w - 8, 4);
    ctx.fillRect(4, 4, 4, h - 8);
    ctx.fillRect(w - 8, 4, 4, h - 8);
    ctx.fillStyle = "#2b4a7a";
    ctx.fillRect(18, 26, w - 36, 7);
    ctx.fillRect(18, 84, w - 36, 7);
    ctx.fillRect(18, 26, 7, 65);
    ctx.fillRect(w - 25, 26, 7, 65);
    ctx.fillStyle = "#d9b24a";
    ctx.fillRect(52, 48, 24, 18);
    ctx.fillRect(58, 42, 12, 30);
    ctx.fillStyle = "#5c2018";
    ctx.fillRect(w / 2 - 2, 20, 4, h - 40);
    speckle(ctx, w, h, ["rgba(110,36,24,0.35)", "rgba(210,90,60,0.2)"], 260, 1, 3);
  }));
}

export function windowTexture(variant = 0) {
  return cached(`window:${variant}`, () => canvasTexture(64, 64, (ctx, w, h) => {
    const rand = mulberry(variant * 97 + 13);
    const frame = ["#d8d0bc", "#c8b89c", "#e0d8c4", "#b8a888"][variant % 4];
    const curtain = ["#b4543c", "#c9b88c", "#78908a", "#8a6a8c", "#c89a50", "#d8d0b8"][variant % 6];
    ctx.fillStyle = frame;
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 5, 0, h - 5);
    g.addColorStop(0, "#8fa6ac");
    g.addColorStop(0.45, "#5b737c");
    g.addColorStop(1, "#2e3c44");
    ctx.fillStyle = g;
    ctx.fillRect(5, 5, w - 10, h - 10);
    ctx.fillStyle = "rgba(220,236,236,0.2)";
    ctx.beginPath();
    ctx.moveTo(8, h - 10);
    ctx.lineTo(w - 22, 6);
    ctx.lineTo(w - 12, 6);
    ctx.lineTo(18, h - 10);
    ctx.fill();
    if (variant % 3 !== 0) {
      const cw = 9 + rand() * 7;
      ctx.fillStyle = curtain;
      ctx.globalAlpha = 0.9;
      if (variant % 2 === 0) {
        ctx.fillRect(6, 6, cw, h - 12);
      } else {
        ctx.fillRect(w - 6 - cw, 6, cw, h - 12);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(40,30,25,0.25)";
      for (let i = 0; i < 3; i++) ctx.fillRect(7 + i * 3, 8, 1, h - 16);
    }
    if (variant === 5) {
      ctx.fillStyle = "#3f5a3c";
      ctx.fillRect(8, h - 24, 10, 12);
      ctx.fillStyle = "#5f7a4a";
      ctx.fillRect(10, h - 28, 6, 8);
    }
    ctx.fillStyle = frame;
    ctx.fillRect(w / 2 - 2, 5, 4, h - 10);
    ctx.fillRect(5, h / 2 - 2, w - 10, 4);
    ctx.fillStyle = "rgba(30,26,22,0.35)";
    ctx.fillRect(0, 0, w, 2);
    ctx.fillRect(0, h - 2, w, 2);
  }));
}

export function windowGlowTexture(variant = 0) {
  return cached(`windowGlow:${variant}`, () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    const warm = ["#6b4a24", "#7a5426", "#5c4424", "#806030"][variant % 4];
    ctx.fillStyle = warm;
    ctx.fillRect(5, 5, w - 10, h - 10);
    if (variant % 3 === 0) {
      ctx.fillStyle = "#241a10";
      ctx.fillRect(5, 5, w - 10, h - 10);
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(w / 2 - 2, 5, 4, h - 10);
    ctx.fillRect(5, h / 2 - 2, w - 10, 4);
  }));
}

export function shopWindowTexture() {
  return cached("shopWindow", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#3a4a48";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#6b5840";
    ctx.fillRect(4, 4, w - 8, h - 8);
    ctx.fillStyle = "#2a2a26";
    ctx.fillRect(5, 5, w - 10, h - 10);
    for (let row = 0; row < 3; row++) {
      ctx.fillStyle = "#7a6a52";
      ctx.fillRect(6, 14 + row * 15, w - 12, 2);
      for (let i = 0; i < 7; i++) {
        ctx.fillStyle = ["#c85a3c", "#d8b84a", "#4a8a6a", "#c8d8c0", "#7a5a9a", "#d89a4a"][(Math.random() * 6) | 0];
        const bw = 3 + Math.random() * 4;
        ctx.fillRect(7 + i * 7, 7 + row * 15, bw, 6);
      }
    }
    ctx.fillStyle = "rgba(200,230,230,0.15)";
    ctx.beginPath();
    ctx.moveTo(10, h - 6);
    ctx.lineTo(w - 20, 6);
    ctx.lineTo(w - 8, 6);
    ctx.lineTo(22, h - 6);
    ctx.fill();
    ctx.fillStyle = "#5a3a2a";
    ctx.fillRect(0, 0, w, 4);
    ctx.fillRect(0, h - 4, w, 4);
    ctx.fillRect(0, 0, 4, h);
    ctx.fillRect(w - 4, 0, 4, h);
    ctx.fillRect(w / 2 - 2, 0, 4, h);
  }));
}

function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function signTexture(text, options = {}) {
  const {
    width = 256,
    height = 64,
    bg = "#c9bd9e",
    fg = "#8c2f24",
    accent = "#2b4a7a",
    sub = "",
    border = true,
  } = options;
  return cached(`sign:${text}:${JSON.stringify(options)}`, () => canvasTexture(width, height, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    if (border) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = Math.max(2, Math.round(h * 0.06));
      ctx.strokeRect(3, 3, w - 6, h - 6);
    }
    if (sub) {
      ctx.fillStyle = fg;
      ctx.font = `bold ${Math.round(h * 0.5)}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h * 0.4);
      ctx.font = `bold ${Math.round(h * 0.24)}px "Courier New", monospace`;
      ctx.fillStyle = accent;
      ctx.fillText(sub, w / 2, h * 0.75);
    } else {
      ctx.fillStyle = fg;
      let size = Math.round(h * 0.56);
      ctx.font = `bold ${size}px "Courier New", monospace`;
      while (ctx.measureText(text).width > w * 0.84 && size > 10) {
        size -= 2;
        ctx.font = `bold ${size}px "Courier New", monospace`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h * 0.52);
    }
    for (let i = 0; i < w * 0.6; i++) {
      ctx.fillStyle = `rgba(${Math.random() < 0.5 ? "60,52,44" : "240,236,220"},${0.03 + Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1);
    }
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = "rgba(60,52,44,0.18)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 10, 1 + Math.random() * 2);
    }
  }));
}

export function archSignTexture() {
  return cached("archSign", () => canvasTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = "#2b4a7a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#d8a44a";
    ctx.lineWidth = 6;
    ctx.strokeRect(5, 5, w - 10, h - 10);
    ctx.fillStyle = "#e8dcc0";
    ctx.font = 'bold 54px "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("НАРАН ХОРООЛОЛ", w / 2, h * 0.42);
    ctx.fillStyle = "#d8a44a";
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillText("12-Р БАГ  ·  УЛААНБААТАР", w / 2, h * 0.76);
    ctx.fillStyle = "#8c2f24";
    ctx.fillRect(18, h - 24, 90, 5);
    ctx.fillRect(w - 108, h - 24, 90, 5);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? "#d8a44a" : "#e8dcc0";
      ctx.fillRect(18 + i * 18, 14, 10, 10);
      ctx.fillRect(w - 88 + i * 18, 14, 10, 10);
    }
    for (let i = 0; i < 350; i++) {
      ctx.fillStyle = `rgba(20,26,34,${0.04 + Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
    }
  }));
}

export function flagTexture() {
  return cached("flag", () => canvasTexture(96, 64, (ctx, w, h) => {
    const stripe = w / 3;
    ctx.fillStyle = "#b23a30";
    ctx.fillRect(0, 0, stripe, h);
    ctx.fillRect(stripe * 2, 0, stripe, h);
    ctx.fillStyle = "#2b4a7a";
    ctx.fillRect(stripe, 0, stripe, h);
    ctx.fillStyle = "#d9b24a";
    ctx.fillRect(14, 10, 4, 44);
    ctx.fillRect(7, 16, 18, 4);
    ctx.fillRect(9, 30, 14, 4);
    ctx.fillRect(9, 40, 14, 3);
    ctx.beginPath();
    ctx.arc(16, 9, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a83228";
    ctx.fillRect(16, 16, 3, 38);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "rgba(60,30,22,0.15)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 8, 1);
    }
  }));
}

export function courtTexture() {
  return cached("court", () => canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#6b6860";
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, ["#625f58", "#75726a", "#5a5852"], 1600, 1, 3);
    ctx.strokeStyle = "rgba(224,220,200,0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.beginPath();
    ctx.moveTo(18, h / 2);
    ctx.lineTo(w - 18, h / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(w / 2 - 40, 18, 80, 46);
    ctx.strokeRect(w / 2 - 40, h - 64, 80, 46);
    ctx.beginPath();
    ctx.arc(w / 2, 64, 22, 0, Math.PI);
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "rgba(40,38,36,0.14)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 22, 2 + Math.random() * 5);
    }
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = "rgba(70,90,50,0.2)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1 + Math.random() * 3);
    }
  }));
}

export function muralTexture() {
  return cached("mural", () => canvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = "#8fa8b8";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#d8b45a";
    ctx.beginPath();
    ctx.arc(56, 38, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(216,180,90,0.7)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(56 + Math.cos(a) * 28, 38 + Math.sin(a) * 28);
      ctx.lineTo(56 + Math.cos(a) * 36, 38 + Math.sin(a) * 36);
      ctx.stroke();
    }
    ctx.fillStyle = "#6d8050";
    ctx.beginPath();
    ctx.moveTo(0, h - 22);
    ctx.lineTo(50, 66);
    ctx.lineTo(98, h - 22);
    ctx.fill();
    ctx.fillStyle = "#586e42";
    ctx.beginPath();
    ctx.moveTo(64, h - 22);
    ctx.lineTo(126, 54);
    ctx.lineTo(190, h - 22);
    ctx.fill();
    ctx.fillStyle = "#7c8f58";
    ctx.beginPath();
    ctx.moveTo(150, h - 22);
    ctx.lineTo(212, 72);
    ctx.lineTo(256, h - 22);
    ctx.fill();
    ctx.fillStyle = "#5a6a48";
    ctx.fillRect(0, h - 22, w, 22);
    const colors = ["#b23a30", "#2b4a7a", "#d8a44a"];
    for (let i = 0; i < 3; i++) {
      const x = 90 + i * 38;
      ctx.fillStyle = colors[i];
      ctx.fillRect(x - 7, 84, 14, 22);
      ctx.fillStyle = "#c79a72";
      ctx.beginPath();
      ctx.arc(x, 76, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2b211a";
      ctx.fillRect(x - 7, 68, 14, 4);
      ctx.strokeStyle = "#c79a72";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 7, 88);
      ctx.lineTo(x - 16 + (i % 2) * 4, 98);
      ctx.moveTo(x + 7, 88);
      ctx.lineTo(x + 16 - (i % 2) * 4, 98);
      ctx.stroke();
    }
    ctx.strokeStyle = "#8c2f24";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(40,44,40,${0.03 + Math.random() * 0.09})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
    }
  }));
}

export function cloudTexture() {
  return cached("cloud", () => canvasTexture(128, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const puffs = [
      [30, 38, 24], [54, 30, 22], [80, 34, 26], [100, 40, 16], [18, 44, 14], [66, 44, 20],
    ];
    for (const [x, y, r] of puffs) {
      const g = ctx.createRadialGradient(x, y, 1, x, y, r);
      g.addColorStop(0, "rgba(245,244,236,0.95)");
      g.addColorStop(0.7, "rgba(238,238,230,0.85)");
      g.addColorStop(1, "rgba(230,232,228,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(190,198,204,0.4)";
    ctx.beginPath();
    ctx.ellipse(62, 48, 42, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }));
}

export function shadowTexture() {
  return cached("shadow", () => canvasTexture(64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(20,24,18,0.55)");
    g.addColorStop(0.65, "rgba(20,24,18,0.28)");
    g.addColorStop(1, "rgba(20,24,18,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }));
}

export function glowTexture() {
  return cached("glow", () => canvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,244,214,0.95)");
    g.addColorStop(0.35, "rgba(255,222,160,0.4)");
    g.addColorStop(1, "rgba(255,190,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }));
}

// Drawn in near-neutral tones so material.color carries the foliage palette;
// the mottle breaks up the flat per-face color of low-poly crowns.
export function foliageTexture(variant = 0) {
  return cached(`foliage:${variant}`, () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#d9d9d4";
    ctx.fillRect(0, 0, w, h);
    const fine = variant % 2 === 1;
    const specks = fine ? 900 : 430;
    for (let i = 0; i < specks; i++) {
      const shade = Math.random();
      ctx.fillStyle = shade < 0.42 ? "rgba(36,46,28,0.36)"
        : shade < 0.8 ? "rgba(255,255,238,0.32)"
        : "rgba(18,24,14,0.44)";
      const s = fine ? 1 + Math.random() * 1.6 : 2 + Math.random() * 2.4;
      ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? "rgba(28,38,22,0.13)" : "rgba(255,255,234,0.11)";
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 4 + Math.random() * 8, 3 + Math.random() * 6,
        Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }));
}

// Autumn leaf carpet with a wobbly cutout edge, for alpha-tested ground discs.
export function leafLitterTexture() {
  return cached("leafLitter", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    const points = 18;
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2;
      const r = w * 0.46 * (0.86 + Math.sin(i * 2.7) * 0.07 + Math.random() * 0.06);
      const x = w / 2 + Math.cos(a) * r;
      const y = h / 2 + Math.sin(a) * r * 0.92;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "#8a6a3c";
    ctx.fill();
    ctx.clip();
    const leaf = ["#a8763c", "#b8894a", "#8a5a30", "#c49a58", "#7c6434", "#9c8248", "#b06a38", "#6e5a2c"];
    for (let i = 0; i < 460; i++) {
      ctx.fillStyle = leaf[(Math.random() * leaf.length) | 0];
      ctx.save();
      ctx.translate(Math.random() * w, Math.random() * h);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-2.5, -1.2, 5, 2.4);
      ctx.restore();
    }
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = "rgba(52,38,20,0.45)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 1 + Math.random() * 2);
    }
  }));
}

// Paper scraps with torn edges: kind 0 is a red-header announcement, kind 1 newsprint.
export function paperTexture(kind = 0) {
  return cached(`paper:${kind}`, () => canvasTexture(32, 40, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const jig = (x, y) => [x + (Math.random() - 0.5) * 2.6, y + (Math.random() - 0.5) * 2.6];
    const corners = [[2, 1.5], [w - 2, 2.5], [w - 1.5, h - 3], [3, h - 2]];
    ctx.beginPath();
    corners.forEach(([x, y], i) => {
      const [jx, jy] = jig(x, y);
      if (i === 0) ctx.moveTo(jx, jy);
      else ctx.lineTo(jx, jy);
    });
    ctx.closePath();
    ctx.fillStyle = kind === 0 ? "#ddd4bc" : "#cfcabc";
    ctx.fill();
    ctx.clip();
    if (kind === 0) {
      ctx.fillStyle = "#a03428";
      ctx.fillRect(3, 4, w - 6, 6);
      ctx.fillStyle = "#3a3226";
      for (let row = 0; row < 5; row++) {
        ctx.fillRect(4, 14 + row * 5, w - 8 - Math.random() * 7, 2);
      }
    } else {
      ctx.fillStyle = "rgba(70,64,54,0.7)";
      for (let col = 0; col < 2; col++) {
        for (let row = 0; row < 9; row++) {
          ctx.fillRect(3 + col * 14, 4 + row * 4, 11, 1.4);
        }
      }
    }
    ctx.fillStyle = "rgba(60,50,40,0.2)";
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h);
    ctx.lineTo(w, h * 0.25);
    ctx.lineTo(w, h);
    ctx.fill();
  }));
}

// Alpha-cutout grass blades for crossed weed quads.
export function grassBladeTexture() {
  return cached("grassBlade", () => canvasTexture(32, 32, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) {
      const x = 2 + (w - 4) * (i / 8) + (Math.random() - 0.5) * 2;
      const top = 2 + Math.random() * 8;
      const lean = (Math.random() - 0.5) * 7;
      ctx.strokeStyle = ["#7e804e", "#9a9a5e", "#6e7642", "#a89e66", "#8a8a50"][(Math.random() * 5) | 0];
      ctx.lineWidth = 1.6 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.quadraticCurveTo(x + lean * 0.4, h * 0.55, x + lean, top);
      ctx.stroke();
    }
  }));
}

export function smokeTexture() {
  return cached("smoke", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const puffs = [[32, 34, 22], [22, 40, 14], [44, 28, 15], [36, 20, 11], [46, 42, 12]];
    for (const [x, y, r] of puffs) {
      const g = ctx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.6, "rgba(240,240,238,0.30)");
      g.addColorStop(1, "rgba(230,230,230,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }));
}

// Transparent rust blotches overlaid on worn car panels.
export function rustTexture() {
  return cached("rust", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 2 + Math.random() * 7;
      const g = ctx.createRadialGradient(x, y, 0.5, x, y, r);
      g.addColorStop(0, "rgba(96,52,24,0.55)");
      g.addColorStop(0.55, "rgba(130,74,32,0.35)");
      g.addColorStop(1, "rgba(130,74,32,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = "rgba(80,44,20,0.3)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 4 + Math.random() * 10);
    }
  }));
}

// Soft dark trampled-earth blotch; stretched for paths, scaled for terrace patches.
export function wearTexture() {
  return cached("wear", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 3, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(58,46,30,0.6)");
    g.addColorStop(0.55, "rgba(58,46,30,0.38)");
    g.addColorStop(0.82, "rgba(58,46,30,0.12)");
    g.addColorStop(1, "rgba(58,46,30,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 3 + Math.random() * 9;
      const gg = ctx.createRadialGradient(x, y, 1, x, y, r);
      gg.addColorStop(0, Math.random() < 0.6 ? "rgba(56,44,28,0.28)" : "rgba(210,190,150,0.2)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }));
}

// Faded institutional wallpaper; variant 0 is striped, variant 1 floral dots.
export function wallpaperTexture(variant = 0) {
  return cached(`wallpaper:${variant}`, () => canvasTexture(64, 64, (ctx, w, h) => {
    const base = variant % 2 ? "#b8ac8c" : "#a8b098";
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    if (variant % 2 === 0) {
      for (let x = 0; x < w; x += 8) {
        ctx.fillStyle = x % 16 === 0 ? "rgba(90,98,80,0.35)" : "rgba(220,216,190,0.28)";
        ctx.fillRect(x, 0, 4, h);
      }
    } else {
      for (let y = 4; y < h; y += 12) {
        for (let x = 4; x < w; x += 12) {
          ctx.fillStyle = "rgba(150,110,90,0.5)";
          ctx.beginPath();
          ctx.arc(x + ((y / 12) % 2) * 6, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(90,110,70,0.4)";
          ctx.fillRect(x + ((y / 12) % 2) * 6 - 1, y + 2.4, 2, 2);
        }
      }
    }
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = `rgba(70,64,48,${0.04 + Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 8, 1 + Math.random() * 3);
    }
    // grime creeps up from the skirting board
    const g = ctx.createLinearGradient(0, h, 0, h * 0.45);
    g.addColorStop(0, "rgba(52,46,34,0.4)");
    g.addColorStop(1, "rgba(52,46,34,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, h * 0.45, w, h * 0.55);
  }));
}

// Worn brown-green checkered linoleum with scuffs.
export function linoleumTexture() {
  return cached("linoleum", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#6e6a50";
    ctx.fillRect(0, 0, w, h);
    const tile = 16;
    for (let y = 0; y < h; y += tile) {
      for (let x = 0; x < w; x += tile) {
        const dark = ((x / tile) + (y / tile)) % 2 === 0;
        ctx.fillStyle = dark ? "#77745c" : "#5c5a44";
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
      }
    }
    ctx.strokeStyle = "rgba(40,38,28,0.5)";
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    speckle(ctx, w, h, ["rgba(30,28,20,0.2)", "rgba(200,190,160,0.12)"], 300, 1, 2);
  }));
}

// Institutional wall tiles; some discolored, grout stained.
export function tileTexture() {
  return cached("tile", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#8a8878";
    ctx.fillRect(0, 0, w, h);
    const tile = 16;
    for (let y = 0; y < h; y += tile) {
      for (let x = 0; x < w; x += tile) {
        const tint = Math.random();
        ctx.fillStyle = tint < 0.82 ? "#d8d8cc" : tint < 0.94 ? "#c2c8b4" : "#b0b8a8";
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        ctx.fillStyle = "rgba(255,255,250,0.25)";
        ctx.fillRect(x + 1, y + 1, tile - 2, 2);
      }
    }
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = "rgba(96,110,90,0.3)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 5, 2 + Math.random() * 5);
    }
  }));
}

// Stained ceiling boards.
export function ceilingTexture() {
  return cached("ceiling", () => canvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = "#c9c4b2";
    ctx.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) {
      ctx.fillStyle = "rgba(90,84,66,0.35)";
      ctx.fillRect(x, 0, 1, h);
    }
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 5 + Math.random() * 9;
      const g = ctx.createRadialGradient(x, y, 1, x, y, r);
      g.addColorStop(0, "rgba(150,128,88,0.25)");
      g.addColorStop(1, "rgba(150,128,88,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    speckle(ctx, w, h, ["rgba(120,112,92,0.14)", "rgba(240,238,224,0.14)"], 220, 1, 2);
  }));
}

// Dzud snow: blue-shadowed white with wind scours and buried grass tips.
export function snowTexture() {
  return cached("snow", () => canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#dfe4e8";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = "rgba(168,184,200,0.28)";
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 16, 2 + Math.random() * 5,
        Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    speckle(ctx, w, h, ["rgba(150,168,188,0.3)", "rgba(244,248,252,0.4)"], 900, 1, 3);
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = "rgba(158,150,110,0.4)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 2 + Math.random() * 3);
    }
  }));
}

export function posterTexture(kind = 0) {
  return cached(`poster:${kind}`, () => canvasTexture(64, 96, (ctx, w, h) => {
    ctx.fillStyle = kind === 0 ? "#d8cdb2" : "#c8b8a0";
    ctx.fillRect(0, 0, w, h);
    if (kind === 0) {
      ctx.fillStyle = "#8c2f24";
      ctx.fillRect(4, 5, w - 8, 12);
      ctx.fillStyle = "#e8dcc0";
      ctx.font = 'bold 9px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText("ЗАР", w / 2, 14);
      ctx.fillStyle = "#2b4a7a";
      ctx.fillRect(6, 22, w - 12, 30);
      ctx.fillStyle = "#d8a44a";
      ctx.beginPath();
      ctx.arc(w / 2, 37, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3a3630";
      for (let i = 0; i < 5; i++) ctx.fillRect(7, 58 + i * 6, w - 14 - Math.random() * 12, 2);
    } else {
      ctx.fillStyle = "#2b4a7a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#e8dcc0";
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText("ПИВО", w / 2, 24);
      ctx.fillStyle = "#d8a44a";
      ctx.fillRect(w / 2 - 9, 32, 18, 34);
      ctx.fillStyle = "#e8dcc0";
      ctx.fillRect(w / 2 - 5, 28, 10, 8);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(240,230,200,0.35)";
        ctx.beginPath();
        ctx.arc(w / 2 + 8, 20 + i * 7, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = "rgba(50,42,36,0.1)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  }));
}
