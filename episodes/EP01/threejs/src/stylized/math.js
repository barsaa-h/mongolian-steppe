// Pure timing helpers. Every pose sample is a function of t, so these stay free of clocks.

export function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function smooth(value) {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
}

// Smootherstep. Gesture keys use this so anticipation and settle are not linear.
export function smoother(value) {
  const x = clamp(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function hash01(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function seedFromId(id) {
  let hash = 2166136261;
  const text = String(id);
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0) % 997;
}

export function angleDiff(from, to) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function lerpAngle(from, to, t) {
  return from + angleDiff(from, to) * t;
}

// Yaw 0 faces world +Z. This is the only heading formula for paths, turns and blocking.
export function yawToward(fromX, fromZ, toX, toZ) {
  return Math.atan2(toX - fromX, toZ - fromZ);
}

// Jaw / speak flap used until real audio drives the mouth. Syllable-shaped, not a sine wall.
export function syllable(t, start, dur, intensity = 0.8) {
  if (!(dur > 0) || t < start || t > start + dur) return 0;
  const u = (t - start) / dur;
  const attack = Math.sin(Math.min(1, u * 10) * Math.PI * 0.5);
  const release = Math.sin(Math.min(1, (1 - u) * 8) * Math.PI * 0.5);
  const pulses = Math.abs(Math.sin(u * dur * Math.PI * 7.5));
  const gaps = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(u * dur * Math.PI * 2.15));
  return clamp(intensity * attack * release * (0.35 + 0.65 * pulses) * gaps);
}

// Deterministic blink envelope, 2–6 s, heavier and slightly slower-to-open when sick.
export function blinkAt(t, seed, sick = 0) {
  const gapScale = 1 - 0.55 * clamp(sick);
  let cursor = 0;
  let amount = 0;
  for (let i = 0; i < 80 && cursor <= t + 0.2; i++) {
    const interval = (2 + 4 * hash01(seed * 0.13 + i * 4.17)) * gapScale;
    const close = 0.09 + 0.05 * sick;
    const u = t - cursor;
    if (u >= 0 && u < close) amount = Math.max(amount, Math.sin((u / close) * Math.PI));
    cursor += Math.max(0.35, interval);
  }
  return amount;
}

// Small gaze jumps while fixating. Interval stays inside 0.4–2 s.
export function saccadeAt(t, seed) {
  let cursor = 0;
  for (let i = 0; i < 120; i++) {
    const hold = 0.4 + 1.6 * hash01(seed * 0.19 + i * 2.41);
    if (t < cursor + hold || i === 119) {
      return {
        yaw: (hash01(seed + i * 3.17) - 0.5) * 0.07,
        pitch: (hash01(seed + i * 5.71) - 0.5) * 0.045,
      };
    }
    cursor += hold;
  }
  return { yaw: 0, pitch: 0 };
}

// Weight shift holds for 3–8 s, then eases to the next side. Returns about -1..1.
export function weightShiftAt(t, seed) {
  let cursor = 0;
  let previous = 0;
  for (let i = 0; i < 80; i++) {
    const hold = 3 + 5 * hash01(seed * 0.23 + i * 2.37);
    const next = hash01(seed * 0.31 + i * 5.13) * 2 - 1;
    if (t < cursor + hold || i === 79) {
      const blend = smooth(clamp((t - cursor) / 0.55));
      return lerp(previous, next, blend);
    }
    previous = next;
    cursor += hold;
  }
  return 0;
}
