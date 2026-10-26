import assert from "node:assert/strict";
import { test } from "node:test";

// Canvas drawing is exercised in the browser; these checks inspect registry
// metadata and state math, not GL loads.
const gradient = { addColorStop() {} };
const context = new Proxy({}, {
  get(_, key) {
    if (key === "measureText") return text => ({ width: text.length * 10 });
    if (key === "createLinearGradient" || key === "createRadialGradient") return () => gradient;
    return () => {};
  },
});
globalThis.document = { createElement: () => ({ getContext: () => context }) };

const { SCENES, getScene } = await import("../src/scenes.js");
const film = await import("../src/filmTimeline.js");

test("the registry keeps the approved excerpt and every staging set", () => {
  assert.deepEqual(Object.keys(SCENES).sort(), [
    "ep1-apartment", "ep1-truckstop", "ep1-yard", "ep10-dzud", "ep2-nursery",
    "ep3-governor", "ep4-school", "ep5-cordon", "ep6-gorge",
    "hour-five", "kit-preview",
  ]);
  assert.equal(getScene("hour-five").duration, film.DURATION);
  assert.equal(getScene("kit-preview").duration, 14);
  assert.equal(getScene("ep2-nursery").duration, 24);
  assert.equal(getScene("ep1-yard").duration, 10);
  assert.equal(getScene("ep10-dzud").duration, 16);
  assert.throws(() => getScene("unknown"), /Unknown scene/);
});

test("hour-five state matches the approved timeline exactly", () => {
  const scene = getScene("hour-five");
  for (const t of [0, 4, 11.5, 16, 27.9, 30]) {
    const fromRegistry = scene.state(t);
    const fromTimeline = film.filmState(t);
    assert.equal(fromRegistry.time, fromTimeline.time);
    assert.equal(fromRegistry.shot.id, fromTimeline.shot.id);
    assert.equal(fromRegistry.fade, fromTimeline.fade);
    assert.deepEqual(fromRegistry.subtitle, fromTimeline.subtitle);
  }
  assert.equal(scene.state(-3).time, 0);
  assert.equal(scene.state(99).time, 30);
  assert.equal(scene.state(1).location, 1, "the location card is up early");
  assert.equal(scene.state(3).location, 0, "the location card fades within three seconds");
  assert.ok(scene.state(29.2).endTitle > 0, "the end title rises at the close");
});

test("shots in every registered scene form one continuous edit", () => {
  for (const scene of Object.values(SCENES)) {
    const shots = scene.shots;
    assert.equal(shots[0].start, 0, scene.id);
    assert.equal(shots.at(-1).end, scene.duration, scene.id);
    for (let i = 1; i < shots.length; i++) {
      assert.equal(shots[i].start, shots[i - 1].end, scene.id);
    }
    for (const shot of shots) assert.ok(shot.lens > 10 && shot.lens < 120, scene.id);
  }
});

test("the preview scene states stay bounded and subtitle gaps stay clean", () => {
  for (const id of ["kit-preview", "ep2-nursery", "ep1-yard", "ep1-truckstop",
    "ep1-apartment", "ep3-governor", "ep4-school", "ep5-cordon", "ep6-gorge", "ep10-dzud"]) {
    const scene = getScene(id);
    for (let t = 0; t <= scene.duration; t += 0.25) {
      const state = scene.state(t);
      assert.ok(state.time >= 0 && state.time <= scene.duration, id);
      assert.ok(state.fade >= 0 && state.fade <= 1, id);
      assert.ok(state.shot, id);
      assert.ok(state.subtitle === null || state.subtitle.text.length > 4, id);
    }
  }
  const ep2 = getScene("ep2-nursery");
  const settled = EP2_CUES_OF(ep2);
  assert.ok(settled.length >= 4, `found ${settled.length} cues`);
  for (let i = 1; i < settled.length; i++) {
    assert.ok(settled[i].start >= settled[i - 1].end, "cues do not overlap");
  }
  assert.ok(ep2.state(2).location > 0, "the location card shows early");
  assert.equal(ep2.state(5).location, 0, "the location card is gone before the ER beat");
});

function EP2_CUES_OF(scene) {
  // Pull the cue list through the public state function across the timeline.
  const found = [];
  for (let t = 0; t < scene.duration; t += 0.1) {
    const cue = scene.state(t).subtitle;
    if (cue && (found.length === 0 || found.at(-1) !== cue)) found.push(cue);
  }
  return found;
}
