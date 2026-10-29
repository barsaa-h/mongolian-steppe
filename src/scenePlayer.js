import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { createPipeline } from "./psx.js";
import { sceneSoundtrack } from "./sceneSound.js";
import { applyMapOverride } from "./mapPieces.js";

// Generic deterministic film player. A scene module supplies:
//   id, duration,
//   build: async () => ({ scene, update(seconds, camera), actor? }),
//   state: (seconds) => ({ shot: { lens }, subtitle, fade, location?, endTitle? }),
//   soundtrack: () => Float32Array | null   (optional)
// The player owns the renderer, pipeline, camera, playback UI, audio and the
// window.__film contract used by the deterministic exporter.
export async function createFilmPlayer({ canvas, sceneModule, renderMode = false, ganaaAssetVersion = "legacy" }) {
  document.body.classList.toggle("render", renderMode);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.04, 2000);

  const built = await sceneModule.build({ renderMode, ganaaAssetVersion });
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
  const grade = sceneModule.grade || null;
  const sound = sceneModule.soundtrack || (() => sceneSoundtrack(sceneModule.id));
  const hi8 = document.getElementById("hi8");
  const hi8Timecode = document.getElementById("hi8Timecode");
  const hi8Battery = document.getElementById("hi8Battery");
  const hi8Fill = hi8Battery ? hi8Battery.querySelector("i") : null;
  const hi8Rec = document.getElementById("hi8Rec");
  if (grade?.type === "hi8" && hi8) {
    hi8.hidden = false;
    hi8Rec.hidden = false;
  }

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
    if (grade?.type === "hi8" && hi8) {
      const total = Math.floor(time);
      const hh = "00:" + String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
      hi8Timecode.textContent = "PLAY \u25B6 " + hh + ":" + String(Math.floor((time % 1) * 30)).padStart(2, "0");
      const battery = Math.max(0.04, 1 - time / duration);
      hi8Fill.style.width = (battery * 100).toFixed(0) + "%";
      hi8Fill.style.background = battery < 0.2 ? "#e86050" : "#b8e8a0";
      hi8Rec.style.visibility = Math.floor(time * 2) % 2 === 0 ? "visible" : "hidden";
    }
    clock.textContent = `00:${Math.floor(time).toString().padStart(2, "0")} / 00:${Math.floor(duration).toString().padStart(2, "0")}`;
    pipeline.render();
  }

  function setPlaying(value) {
    if (!ready) return;
    if (audioSource) { audioSource.stop(); audioSource = null; }
    if (value && time >= duration) renderAt(0);
    playing = value;
    if (playing && !renderMode && sound) {
      if (!audioContext) {
        audioContext = new AudioContext();
        const samples = sound();
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

  // Map-pipeline hook: headless scripts (scripts/export-map-glb.mjs) call this
  // to serialize a set (or any subtree) as base64 GLB, before any authoring.
  window.__mapExport = {
    scene,
    Box3: THREE.Box3,
    Vector3: THREE.Vector3,
    collectExportable: () => {
      const keep = [];
      scene.traverse(object => {
        if (object.parent !== scene) return;
        if (object.isLight || object.isCamera) return;
        let blocked = false;
        object.traverse(child => {
          if (child.isSkinnedMesh || child.isSprite || child.isLine || child.userData.dynamic) blocked = true;
        });
        if (!blocked) keep.push(object);
      });
      return keep;
    },
    exportGLBBase64: async object => {
      const buffer = await new GLTFExporter().parseAsync(object, { binary: true });
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      }
      return btoa(binary);
    },
  };

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

  // Blender-authored map override, applied after the first render so the set
  // is never blank. ?nomap=1 keeps the procedural set for comparison.
  if (!new URLSearchParams(location.search).has("nomap")) {
    applyMapOverride(scene, sceneModule.id)
      .then(result => { if (result === "authored") renderAt(time); })
      .catch(error => console.warn("Map override unavailable", error));
  }

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
