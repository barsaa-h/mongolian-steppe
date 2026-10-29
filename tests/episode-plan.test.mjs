import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function csv(path) {
  const text = readFileSync(path, 'utf8');
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && quoted && text[i + 1] === '"') { field += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if (c === '\n' && !quoted) { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (row.length || field) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}

const base = 'artifacts/character-master/sources/story/v4.3-timing/';
const timeline = csv(base + 'VOICE_EDIT_TIMELINE_v4.3.csv');
const manifest = csv(base + 'EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv');
const shots = csv('episodes/EP01/shotlist.csv');
const split = value => value ? value.split('; ') : [];

for (const [scene, duration, filename] of [['Birthday 90s', '01:30', 'birthday_90s.mn.srt'], ['Door 64s', '01:04', 'door_64s.mn.srt']]) {
  test(`${scene} covers every cue and tiles the scene`, () => {
    const cues = timeline.filter(c => c.test === scene);
    const plan = shots.filter(s => s.scene === scene);
    assert.deepEqual(plan.flatMap(s => split(s.timeline_cues)), cues.map(c => c.cue));
    assert.equal(plan[0].start, '00:00');
    assert.equal(plan.at(-1).end, duration);
    for (let i = 1; i < plan.length; i++) assert.equal(plan[i - 1].end, plan[i].start);
    for (const shot of plan) {
      const group = cues.filter(c => split(shot.timeline_cues).includes(c.cue));
      assert.equal(shot.start, group[0].in);
      assert.equal(shot.end, group.at(-1).out);
      const spoken = group.filter(c => c.spoken_text);
      assert.equal(shot.handle_in_frames, spoken.length ? '12' : '0');
      assert.equal(shot.handle_out_frames, spoken.length ? '12' : '0');
      assert.deepEqual(split(shot.line_ids).map(id => {
        const match = manifest.find(m => m.cue === id);
        assert.ok(match, id);
        return match['exact_spoken_dialogue_from_v4.2'];
      }), spoken.map(c => c.spoken_text));
    }
    const srt = readFileSync(`episodes/EP01/animatic/${filename}`, 'utf8').trim().split(/\n\s*\n/);
    assert.equal(srt.length, cues.filter(c => c.spoken_text).length);
    assert.deepEqual(srt.map(block => block.split('\n').slice(2).join('\n')), cues.filter(c => c.spoken_text).map(c => c.spoken_text));
  });
}

