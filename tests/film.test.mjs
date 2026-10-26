import assert from "node:assert/strict";
import { test } from "node:test";

import * as film from "../src/filmTimeline.js";
import { createSoundtrack } from "../src/filmSound.js";

test("the cinematic lasts 30 seconds and has a complete edit", () => {
  assert.equal(film.DURATION, 30);
  assert.equal(film.SHOTS[0].start, 0);
  assert.equal(film.SHOTS.at(-1).end, 30);
  for (let i = 1; i < film.SHOTS.length; i++) assert.equal(film.SHOTS[i].start, film.SHOTS[i - 1].end);
});

test("subtitles follow the approved dialogue with clean gaps and an ending", () => {
  assert.equal(film.filmState(0).subtitle, null);
  assert.match(film.filmState(4).subtitle.text, /тайван байгаарай/);
  assert.match(film.filmState(25).subtitle.text, /Алтан/);
  assert.equal(film.filmState(30).subtitle, null);
  for (let i = 0; i < film.CUES.length; i++) {
    const cue = film.CUES[i];
    assert.ok(cue.end > cue.start && cue.end <= 30);
    if (i) assert.ok(cue.start >= film.CUES[i - 1].end);
  }
});

test("the truck brakes for the sheep and resumes without teleporting", () => {
  assert.ok(film.filmState(10).truckU > film.filmState(0).truckU);
  assert.equal(film.filmState(16).truckU, film.filmState(23).truckU);
  assert.ok(film.filmState(29).truckU > film.filmState(23).truckU);
  for (const cut of [12, 15, 24]) {
    assert.ok(Math.abs(film.filmState(cut - 0.001).truckU - film.filmState(cut + 0.001).truckU) < 0.0001);
  }
});

test("seeking is deterministic, bounded, and rejects invalid time", () => {
  assert.deepEqual(film.filmState(11), film.filmState(11));
  assert.equal(film.filmState(-5).time, 0);
  assert.equal(film.filmState(99).time, 30);
  assert.throws(() => film.filmState(NaN), /finite/);
  for (let t = 0; t <= 30; t += 0.1) {
    const state = film.filmState(t);
    assert.ok(state.truckU >= 0 && state.truckU <= 1);
    assert.ok(state.shot);
  }
});

test("the voiceless soundtrack is finite, bounded, and exactly 30 seconds", () => {
  const samples = createSoundtrack(4000);
  assert.equal(samples.length, 120000);
  let energy = 0;
  for (const value of samples) {
    assert.ok(Number.isFinite(value) && Math.abs(value) <= 1);
    energy += value * value;
  }
  assert.ok(energy > 1);
  assert.equal(samples[0], 0);
  assert.ok(Math.abs(samples.at(-1)) < 0.001);
  assert.throws(() => createSoundtrack(0), /sample rate/);
});

test('the revised scene shows the wrist and explains flu before Ganaa answers',()=>{
  assert.equal(film.filmState(2.4).shot.id,'wrist');
  assert.match(film.filmState(4).subtitle.text,/томуу/);
  assert.ok(film.CUES[0].end<=film.CUES[1].start);
  assert.equal(film.filmState(27.8).truckU,film.filmState(17).truckU);
  assert.equal(film.filmState(26).shot.id,'resolve');
});
