import { DURATION } from "./filmTimeline.js";

export function createSoundtrack(sampleRate = 24000) {
  if (!Number.isInteger(sampleRate) || sampleRate < 4000 || sampleRate > 96000) throw new Error("Invalid sample rate");
  const samples = new Float32Array(DURATION * sampleRate);
  let seed = 91827, wind = 0, rumble = 0, phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    wind += (noise - wind) * 0.008;
    rumble += (noise - rumble) * 0.045;
    const drive = t < 12 ? 0.65 : t < 15 ? 0.65 - (t - 12) * 0.15 : t < 28 ? 0.2 : 0.2 + Math.min(0.55, (t - 28) * 0.16);
    phase += (28 + drive * 27 + Math.sin(t * 0.9) * 1.5) / sampleRate;
    const motor = Math.sin(phase * Math.PI * 2) + Math.sin(phase * Math.PI * 4) * 0.3;
    const cab = t >= 6 && t < 13 || t >= 21 && t < 28;
    const brake = Math.max(0, 1 - Math.abs(t - 13.2) / 1.1);
    const tap = Math.max(0, 1 - Math.abs(t - 22.15) / 0.035);
    let sample = motor * (0.045 + drive * 0.045) + rumble * drive * 0.22;
    sample += wind * (cab ? 0.25 : 0.8) + noise * brake * 0.045 + noise * tap * 0.1;
    for (const bell of [14.3, 15.8, 17.4, 19.6]) {
      const age = t - bell;
      if (age >= 0 && age < 0.5) sample += Math.sin(age * 2 * Math.PI * 920) * Math.exp(-age * 13) * 0.013;
    }
    const fade = Math.min(1, t / 0.8, (DURATION - t) / 1.3);
    samples[i] = sample * fade;
  }
  return samples;
}
