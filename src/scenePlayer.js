import * as THREE from "three";
import { createPipeline } from "./psx.js";

// Generic deterministic film player. A scene module supplies:
//   id, duration,
//   build: async () => ({ scene, update(seconds, camera), actor? }),
//   state: (seconds) => ({ shot: { lens }, subtitle, fade, location?, endTitle? }),
//   soundtrack: () => Float32Array | null   (optional)
// The player owns the renderer, pipeline, camera, playback UI, audio and the
// window.__film contract used by the deterministic exporter.
export async function createFilmPlayer({ canvas, sceneModule, renderMode = false }) {
  document.body.classList.toggle("render", renderMode);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.04, 2000);

  const built = await sceneModule.build({ renderMode });
  const scene = built.scene;
  const duration = sceneModule.duration;
  const pipeline = createPipeline(renderer, scene, camera);
  pipeline.setSize(innerWidth, innerHeight);

  let time = 0;
  let playing = false;
  let ready = true;
  let previous = performance.now();
  let audioContext, audioBuffer, audioSource;

  const playButton = document.getElementById("play");
  const replayButton = document.getElementById("replay");
  const scrub = document.getElementById("scrub");
  const speaker = document.getElementById("speaker");
  const subtitle = document.getElementById("subtitle");
  const locationCard = document.getElementById("location");
  const endTitle = document.getElementById("endTitle");
  const shade = document.getElementById("shade");
  const clock = document.getElementById("clock");
  const status = document.getElementById("status");

  function renderAt(seconds) {
    const s = sceneModule.state(seconds);
    time = s.time ?? Math.max(0, Math.min(duration, seconds));
    built.update(time, camera);
    if (s.shot?.lens) {
      camera.fov = s.shot.lens;
      camera.updateProjectionMatrix();
    }
    speaker.textContent = s.subtitle?.speaker || "";
    subtitle.textContent = s.subtitle?.text || "";
    shade.style.opacity = s.fade ?? 0;
    locationCard.style.opacity = s.location ?? 0;
    endTitle.style.opacity = s.endTitle ?? 0;
    scrub.value = time;
    scrub.max = duration;
    clock.textContent = `00:${Math.floor(time).toString().padStart(2, "0")} / 00:${Math.floor(duration).toString().padStart(2, "0")}`;
    pipeline.render();
  }

  function setPlaying(value) {
    if (!ready) return;
    if (audioSource) { audioSource.stop(); audioSource = null; }
    if (value && time >= duration) renderAt(0);
    playing = value;
    if (playing && !renderMode && sceneModule.soundtrack) {
      if (!audioContext) {
        audioContext = new AudioContext();
        const samples = sceneModule.soundtrack();
        audioBuffer = audioContext.createBuffer(1, samples.length, 24000);
        audioBuffer.copyToChannel(samples, 0);
      }
      audioContext.resume();
      audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioContext.destination);
      audioSource.start(0, time);
    }
    previous = performance.now();
    playButton.textContent = playing ? "Ⅱ Pause" : "▶ Play";
    playButton.setAttribute("aria-label", playing ? "Pause film" : "Play film");
  }

  playButton.addEventListener("click", () => setPlaying(!playing));
  replayButton.addEventListener("click", () => { renderAt(0); setPlaying(true); });
  scrub.addEventListener("input", () => { setPlaying(false); renderAt(Number(scrub.value)); });
  window.addEventListener("keydown", event => {
    if (event.target.matches("input, button, a")) return;
    if (event.code === "Space") { event.preventDefault(); setPlaying(!playing); }
    if (event.code === "KeyR") { renderAt(0); setPlaying(true); }
  });
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    pipeline.setSize(innerWidth, innerHeight);
    renderAt(time);
  });

  window.__film = {
    seek: seconds => { setPlaying(false); renderAt(seconds); },
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    state: () => ({
      ready,
      time,
      playing,
      duration,
      shot: sceneModule.state(time).shot?.id,
      sceneId: sceneModule.id,
    }),
    scene,
    camera,
    actor: () => built.actor?.(),
  };

  playButton.disabled = replayButton.disabled = false;
  if (status) status.hidden = true;
  renderAt(0);

  function frame(now) {
    if (playing && !renderMode) {
      const next = Math.min(duration, time + (now - previous) / 1000);
      renderAt(next);
      if (next >= duration) setPlaying(false);
    }
    previous = now;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return window.__film;
}
