import assert from "node:assert/strict";
import { test } from "node:test";
import { worldState } from "../src/world.js";

test("the day cycle reaches daylight and night", () => {
  assert.equal(worldState(0.5).day, 1);
  assert.equal(worldState(0.5).night, 0);
  assert.equal(worldState(0).day, 0);
  assert.equal(worldState(0).night, 1);
});

test("lighting stays valid and repeats after one day", () => {
  for (const time of [0, 0.1, 0.25, 0.5, 0.75, 0.99]) {
    const state = worldState(time);
    const next = worldState(time + 1);
    for (const key of ["day", "night", "dusk", "sunOpacity", "moonOpacity"]) {
      assert.ok(state[key] >= 0 && state[key] <= 1, `${key} at ${time}`);
      assert.ok(Math.abs(state[key] - next[key]) < 1e-10, `${key} repeats`);
    }
    assert.ok(Math.abs(state.sunDir.length() - 1) < 1e-10);
    assert.ok(state.sunDir.distanceTo(next.sunDir) < 1e-10);
    assert.ok(Number.isFinite(state.sunIntensity));
    assert.ok(Number.isFinite(state.hemiIntensity));
  }
});
