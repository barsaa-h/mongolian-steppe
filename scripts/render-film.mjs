const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile, rename } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { getScene } from "../src/scenes.js";
import { sceneSoundtrack } from "../src/sceneSound.js";
import { DURATION as HOUR_FIVE_DURATION, CUES as HOUR_FIVE_CUES } from "../src/filmTimeline.js";
import { createSoundtrack } from "../src/filmSound.js";

// Any registered scene exports; the approved hour-five excerpt stays the default.
const SCENE_ID = process.env.SCENE_ID || "hour-five";
const sceneModule = SCENE_ID === "hour-five" ? null : getScene(SCENE_ID);
const DURATION = sceneModule ? sceneModule.duration : HOUR_FIVE_DURATION;
const CUES = sceneModule
  ? (() => {
      const cues = [];
      for (let t = 0; t < DURATION; t += 0.05) {
        const cue = sceneModule.state(t).subtitle;
        if (cue && (cues.length === 0 || cues.at(-1) !== cue)) cues.push(cue);
      }
      return cues;
    })()
  : HOUR_FIVE_CUES;

const output = resolve(process.argv[2] || `output/film/khaniad-${SCENE_ID}.mp4`);
const base = output.replace(/\.mp4$/i, "");
await mkdir(dirname(output), { recursive: true });
const samples = sceneModule
  ? (sceneModule.soundtrack?.() ?? sceneSoundtrack(SCENE_ID)?.() ?? new Float32Array(Math.floor(DURATION * 24000)))
  : createSoundtrack();
const wav = Buffer.alloc(44 + samples.length * 2);
wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(24000, 24); wav.writeUInt32LE(48000, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36);
wav.writeUInt32LE(samples.length * 2, 40);
samples.forEach((sample, i) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + i * 2));
await writeFile(`${base}.wav`, wav);

const stamp = seconds => {
  const ms = Math.round(seconds * 1000);
  return `00:00:${Math.floor(ms / 1000).toString().padStart(2, "0")},${(ms % 1000).toString().padStart(3, "0")}`;
};
await writeFile(`${base}.srt`, CUES.map((cue, i) =>
  `${i + 1}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.speaker}: ${cue.text}\n`).join("\n"));

const browser = await chromium.launch({ headless: true, args: [
  "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
] });
let encoder;
let encoderLog = "";
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${process.env.FILM_URL || "http://127.0.0.1:5173/film.html"}?scene=${SCENE_ID}&render=1`);
  await page.waitForFunction(() => window.__film?.state().ready, { timeout: 60000 });
  await page.evaluate(() => window.__film.seek(8));
  await page.screenshot({ path: `${base}.jpg`, type: "jpeg", quality: 95 });
  encoder = spawn("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", "24", "-i", "pipe:0",
    "-i", `${base}.wav`, "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-t", String(DURATION), "-movflags", "+faststart", `${base}.rendering.mp4`,
  ], { stdio: ["pipe", "ignore", "pipe"] });
  encoder.stderr.on("data", data => { encoderLog = (encoderLog + data).slice(-10000); });
  const completion = once(encoder, "close");
  for (let frame = 0; frame < DURATION * 24; frame++) {
    if (errors.length) throw new Error(errors.join("\n"));
    await page.evaluate(t => window.__film.seek(t), frame / 24);
    const jpeg = await page.screenshot({ type: "jpeg", quality: 93 });
    if (!encoder.stdin.write(jpeg)) await once(encoder.stdin, "drain");
    if (frame % 120 === 0) console.log(`Rendered ${frame}/${DURATION * 24} frames`);
  }
  encoder.stdin.end();
  const [code] = await completion;
  if (code !== 0) throw new Error(`Video encoding failed: ${encoderLog}`);
  await rename(`${base}.rendering.mp4`, output);
  console.log(`Saved ${output}: ${DURATION}s, 1280×720, 24 fps, subtitles and environmental sound.`);
} finally {
  if (encoder && encoder.exitCode === null) encoder.kill();
  await browser.close();
}
