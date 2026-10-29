import { mulberry } from "./parts.js";

// Procedural per-scene sound design, following the filmSound.js conventions:
// 24 kHz mono, finite, starts and ends at silence. Deterministic per scene so
// exports are repeatable. sceneSoundtrack(id) returns () => Float32Array or
// null for scenes without a bed.

const RATE = 24000;

function addTone(out, start, dur, freq, level, shape = "sine", decay = 6, rand = Math.random) {
  const startI = Math.max(0, Math.floor(start * RATE));
  const endI = Math.min(out.length, Math.floor((start + dur) * RATE));
  let phase = rand() * Math.PI * 2;
  for (let i = startI; i < endI; i++) {
    const t = (i - startI) / RATE;
    const env = Math.exp(-t * decay) * Math.min(1, t * 200);
    phase += (Math.PI * 2 * freq) / RATE;
    let v;
    if (shape === "saw") v = ((phase / Math.PI) % 2) - 1;
    else if (shape === "square") v = Math.sin(phase) >= 0 ? 0.7 : -0.7;
    else v = Math.sin(phase);
    out[i] += v * env * level;
  }
}

function noiseBurst(out, start, dur, level, decay = 12, lp = 0.6, rand = Math.random) {
  const startI = Math.max(0, Math.floor(start * RATE));
  const endI = Math.min(out.length, Math.floor((start + dur) * RATE));
  let last = 0;
  for (let i = startI; i < endI; i++) {
    const t = (i - startI) / RATE;
    const env = Math.exp(-t * decay) * Math.min(1, t * 400);
    last += (rand() * 2 - 1 - last) * lp;
    out[i] += last * env * level;
  }
}

function noiseBed(out, level, lp, gustSpeed, seedOffset, rand) {
  let last = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const gust = 0.6 + 0.4 * Math.sin(t * gustSpeed + seedOffset) * Math.sin(t * gustSpeed * 0.37 + 1.7);
    last += (rand() * 2 - 1 - last) * lp;
    out[i] += last * level * gust;
  }
}

function murmurBed(out, level, brightness, seedOffset, rand, start = 0, end = null) {
  const startI = Math.floor(start * RATE);
  const endI = end === null ? out.length : Math.min(out.length, Math.floor(end * RATE));
  let low = 0;
  let high = 0;
  for (let i = startI; i < endI; i++) {
    const t = (i - startI) / RATE;
    const swell = 0.55 + 0.45 * Math.sin(t * 0.9 + seedOffset) * Math.sin(t * 0.53 + 2.1);
    low += (rand() * 2 - 1 - low) * (0.02 + brightness * 0.05);
    high += (rand() * 2 - 1 - high) * (0.08 + brightness * 0.2);
    out[i] += (low * 2.2 + high * 0.9) * level * swell;
  }
}

function rotorBed(out, level, seedOffset, start = 0) {
  const startI = Math.floor(start * RATE);
  let last = 0;
  let phase = 0;
  for (let i = startI; i < out.length; i++) {
    const t = (i - startI) / RATE;
    phase += (Math.PI * 2 * 12.5) / RATE;
    const chop = 0.45 + 0.55 * Math.max(0, Math.sin(phase));
    last += (Math.random() * 2 - 1 - last) * 0.25;
    out[i] += (last * 0.5 + Math.sin(phase * 0.5) * 0.35) * chop * level;
  }
  void seedOffset;
}

function crackleBed(out, start, end, level, rand) {
  const startI = Math.floor(start * RATE);
  const endI = Math.min(out.length, Math.floor(end * RATE));
  let roar = 0;
  for (let i = startI; i < endI; i++) {
    roar += (rand() * 2 - 1 - roar) * 0.04;
    out[i] += roar * 0.5 * level;
    if (rand() < 0.004) {
      const len = Math.floor(RATE * (0.004 + rand() * 0.02));
      for (let k = 0; k < len && i + k < endI; k++) {
        out[i + k] += (rand() * 2 - 1) * level * Math.exp(-k / len * 5) * 0.9;
      }
    }
  }
}

function hoofBed(out, start, end, perSecond, level, rand) {
  const startI = Math.floor(start * RATE);
  const endI = Math.min(out.length, Math.floor(end * RATE));
  let next = 0;
  for (let i = startI; i < endI; i++) {
    if (i >= next) {
      const t = i / RATE;
      addTone(out, t, 0.09, 95 + rand() * 30, level, "sine", 26, rand);
      addTone(out, t + 0.12 / perSecond, 0.08, 88 + rand() * 30, level * 0.8, "sine", 26, rand);
      next = i + Math.floor((RATE / perSecond) * (0.85 + rand() * 0.3));
    }
  }
}

function heartBed(out, start, end, level, rand) {
  const startI = Math.floor(start * RATE);
  const endI = Math.min(out.length, Math.floor(end * RATE));
  const period = RATE * 1.05;
  for (let i = startI; i < endI; i += period) {
    addTone(out, i / RATE, 0.16, 52, level, "sine", 15, rand);
    addTone(out, (i + RATE * 0.22) / RATE, 0.14, 46, level * 0.75, "sine", 16, rand);
  }
}

function waltz(out, start, dur, level, rand) {
  // A small minor-key accordion-ish waltz: oom-pah-pah plus a simple melody.
  const notes = [220, 261.6, 293.7, 329.6, 392, 440, 392, 329.6];
  const bar = 1.5;
  const bars = Math.floor(dur / bar);
  for (let b = 0; b < bars; b++) {
    const t0 = start + b * bar;
    addTone(out, t0, 0.5, notes[0] / 2, level * 0.9, "square", 5, rand);
    for (const beat of [0.5, 1.0]) {
      addTone(out, t0 + beat, 0.3, notes[(b * 2) % notes.length] / 2, level * 0.5, "square", 8, rand);
    }
    const lead = notes[(b * 3 + 1) % notes.length];
    addTone(out, t0 + 0.05, 0.55, lead, level * 0.55, "saw", 3.2, rand);
    addTone(out, t0 + 0.55, 0.4, notes[(b * 3 + 4) % notes.length], level * 0.45, "saw", 4, rand);
    addTone(out, t0 + 1.0, 0.45, lead * 0.75, level * 0.45, "saw", 4.5, rand);
  }
}

const MIXES = {
  "ep1-border-road": (out, dur, rand) => {
    noiseBed(out, 0.2, 0.016, 1.2, 1.5, rand);
    for (let t = 0.2; t < 5.6; t += 0.5) addTone(out, t, 0.2, 52, 0.09 + rand() * 0.03, "sine", 14, rand);
    noiseBurst(out, 6.0, 0.8, 0.16, 7, 0.5, rand);
    for (let t = 6.6; t < 11.2; t += 1.1) addTone(out, t, 0.24, 48, 0.1, "sine", 12, rand);
    for (let t = 11.6; t < dur; t += 0.34) addTone(out, t, 0.18, 56, 0.12, "sine", 15, rand);
  },
  "ep1-yard": (out, dur, rand) => {
    noiseBed(out, 0.16, 0.015, 0.8, 1.1, rand);
    noiseBed(out, 0.05, 0.002, 0.4, 2.3, rand);
    addTone(out, 0.6, 0.4, 620, 0.1, "sine", 22, rand);
    addTone(out, 9.1, 0.4, 590, 0.09, "sine", 22, rand);
    noiseBurst(out, 4.35, 0.7, 0.2, 9, 0.25, rand);
    heartBed(out, 5.4, dur, 0.12, rand);
  },
  "ep1-truckstop": (out, dur, rand) => {
    noiseBed(out, 0.05, 0.004, 0.5, 3.1, rand);
    murmurBed(out, 0.11, 0.5, 0.7, rand, 0, 10.4);
    for (let t = 0.4; t < 10; t += 1.15) addTone(out, t, 0.22, 54, 0.1, "sine", 12, rand);
    addTone(out, 10.35, 1.6, 46, 0.85, "sine", 3.5, rand);
    noiseBurst(out, 10.35, 1.2, 0.9, 7, 0.8, rand);
    crackleBed(out, 10.45, dur, 0.4, rand);
  },
  "ep1-apartment": (out, dur, rand) => {
    murmurBed(out, 0.15, 0.62, 1.4, rand);
    waltz(out, 0.4, dur - 0.6, 0.2, rand);
    addTone(out, 0.14, 0.16, 180, 0.24, "sine", 24, rand);
    for (const t of [3.4, 6.6, 9.2]) addTone(out, t + rand() * 0.2, 0.1, 900 + rand() * 300, 0.05, "sine", 30, rand);
  },
  "ep2-nursery": (out, dur, rand) => {
    murmurBed(out, 0.1, 0.35, 0.9, rand, 0, 6.2);
    for (const t of [1.6, 5.2, 9.1]) addTone(out, t, 0.09, 880, 0.09, "sine", 26, rand);
    murmurBed(out, 0.3, 0.85, 4.2, rand, 6.3, 10.6);
    for (let t = 7.9; t < 10.6; t += 0.21) addTone(out, t + rand() * 0.04, 0.08, 120, 0.2, "sine", 30, rand);
    addTone(out, 12.1, 0.35, 440, 0.07, "sine", 6, rand);
    addTone(out, 12.85, 0.35, 480, 0.07, "sine", 6, rand);
    murmurBed(out, 0.06, 0.2, 2.0, rand, 12, null);
  },
  "ep3-governor": (out, dur, rand) => {
    murmurBed(out, 0.09, 0.4, 1.2, rand, 0, 8.1);
    for (const t of [7.4, 7.9, 8.35]) addTone(out, t, 0.05, 1750 + rand() * 400, 0.045, "sine", 40, rand);
    murmurBed(out, 0.34, 0.9, 5.1, rand, 8.2, 10.4);
    rotorBed(out, Math.min(1, 0.25 + ((dur - 10.5) * 0.3)), 2.2, 10.5);
    noiseBed(out, 0.04, 0.01, 0.7, 1.4, rand);
  },
  "ep4-school": (out, dur, rand) => {
    murmurBed(out, 0.13, 0.55, 0.8, rand, 0, 6.9);
    for (let t = 4.0; t < 6.9; t += 0.85) {
      addTone(out, t, 0.07, 175, 0.2, "sine", 32, rand);
      addTone(out, t + 0.13, 0.06, 168, 0.16, "sine", 34, rand);
    }
    noiseBed(out, 0.02, 0.003, 0.5, 3.3, rand);
    heartBed(out, 9.8, dur, 0.3, rand);
  },
  "ep5-cordon": (out, dur, rand) => {
    noiseBed(out, 0.17, 0.012, 1.1, 1.9, rand);
    murmurBed(out, 0.13, 0.4, 2.4, rand, 0, 7.9);
    noiseBurst(out, 3.1, 0.4, 0.75, 16, 0.9, rand);
    addTone(out, 3.1, 0.3, 62, 0.4, "sine", 12, rand);
    murmurBed(out, 0.38, 0.85, 6.2, rand, 8.0, 11.4);
    noiseBurst(out, 8.05, 0.35, 0.6, 18, 0.9, rand);
  },
  "ep6-gorge": (out, dur, rand) => {
    noiseBed(out, 0.2, 0.014, 1.4, 0.9, rand);
    hoofBed(out, 0.2, 3.9, 3.4, 0.2, rand);
    for (const t of [4.6, 5.7, 6.8, 7.9]) {
      addTone(out, t, 0.7, 68 + rand() * 16, 0.16, "saw", 4.5, rand);
      addTone(out, t + 0.12, 0.5, 96 + rand() * 20, 0.09, "saw", 6, rand);
    }
    noiseBed(out, 0.05, 0.002, 0.5, 2.7, rand);
  },
  "ep7-boilerhouse": (out, dur, rand) => {
    crackleBed(out, 0, dur, 0.22, rand);
    noiseBed(out, 0.07, 0.006, 0.6, 1.6, rand);
    noiseBurst(out, 4.6, 0.8, 0.16, 8, 0.3, rand);
    for (const t of [9.4, 9.9, 10.4]) addTone(out, t + rand() * 0.05, 0.1, 130, 0.12, "sine", 28, rand);
  },
  "ep9-cabin": (out, dur, rand) => {
    rotorBed(out, 0.85, 1.3, 0);
    noiseBed(out, 0.06, 0.005, 0.9, 2.8, rand);
    addTone(out, 4.3, 0.14, 140, 0.2, "sine", 26, rand);
    murmurBed(out, 0.05, 0.3, 3.3, rand, 4.4, null);
  },
  "ep10-dzud": (out, dur, rand) => {
    noiseBed(out, 0.26, 0.05, 2.3, 1.2, rand);
    noiseBed(out, 0.09, 0.004, 0.8, 3.4, rand);
    hoofBed(out, 1.2, 5.2, 1.9, 0.14, rand);
  },
};

export function sceneSoundtrack(id) {
  const mix = MIXES[id];
  if (!mix) return null;
  const durations = {
    "ep1-border-road": 15,
    "ep1-yard": 10, "ep1-truckstop": 12, "ep1-apartment": 12,
    "ep2-nursery": 24, "ep3-governor": 14, "ep4-school": 12,
    "ep5-cordon": 12, "ep6-gorge": 11, "ep7-boilerhouse": 12,
    "ep9-cabin": 11, "ep10-dzud": 16,
  };
  const duration = durations[id];
  if (!duration) return null;
  return () => {
    const rand = mulberry([...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 17) * 7919);
    const out = new Float32Array(Math.floor(duration * RATE));
    mix(out, duration, rand);
    // House rules: start and end at silence, clamp everything.
    const fade = Math.floor(RATE * 0.06);
    for (let i = 0; i < fade; i++) {
      out[i] *= i / fade;
      out[out.length - 1 - i] *= i / fade;
    }
    for (let i = 0; i < out.length; i++) {
      out[i] = Math.max(-0.98, Math.min(0.98, out[i]));
    }
    return out;
  };
}
