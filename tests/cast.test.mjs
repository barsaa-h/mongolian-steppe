import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'node:fs';

test('cast has a single source roster and lookup module', async () => {
  assert.ok(existsSync(new URL('../assets/cast/roster.json', import.meta.url)), 'script-grounded roster exists');
  const { CAST, getCastMember } = await import('../src/cast.js');
  const namedOnscreen = ['irina', 'ganaa', 'dasha', 'hurel', 'tsetsegmaa', 'dulmaa', 'sukhee', 'altan',
    'oyun', 'bolor', 'narantsetseg', 'dagva', 'tsolmon', 'myagmar', 'naran', 'lkhagva', 'enkhee',
    'sarantuya', 'dashnyam', 'chinbat', 'lodoi', 'batu', 'uyanga', 'anu', 'nomin', 'bat-erdene',
    'gantsetseg', 'baasaa', 'munkh', 'temuujin', 'saruul', 'erdene', 'bayar', 'jargal', 'narantuya'];
  for (const id of namedOnscreen) assert.equal(getCastMember(id).id, id, `source character ${id} is covered`);
  assert.equal(getCastMember('altan').age, 3);
  assert.equal(getCastMember('naran').age, 0);
  assert.equal(getCastMember('naran').kind, 'infant');
  assert.equal(getCastMember('anu').age, 16);
  assert.equal(getCastMember('narantuya').age, 27);
  assert.throws(() => getCastMember('not-a-character'), /Unknown cast member/);
});

test('aliases resolve to one canonical actor without duplicating governors or teachers', async () => {
  const { CAST, getCastMember } = await import('../src/cast.js');
  for (const [id, alias] of [['lkhagva', 'ЗАСАГ ДАРГА'], ['gantsetseg', 'ЗАХИРАЛ'], ['baasaa', 'БАГШ БАЯСАА']]) {
    assert.equal(getCastMember(alias), getCastMember(id));
    assert.equal(CAST.filter(member => member.id === id).length, 1);
  }
  assert.deepEqual(getCastMember('lkhagva').episodes, [2, 3]);
  assert.deepEqual(getCastMember('oyun').episodes, [2, 3]);
});

test('distinct unnamed speakers remain distinct and mentioned-only people get no models', async () => {
  const { CAST, getCastMember } = await import('../src/cast.js');
  const speakers = ['citizen-1', 'citizen-2', 'citizen-3', 'helipad-parent', 'cordon-mother-meat', 'cordon-mother-smoke', 'cordon-bitten-man', 'cordon-father', 'cordon-woman'];
  assert.equal(new Set(speakers.map(id => getCastMember(id))).size, speakers.length);
  for (const id of ['bayarsaikhan']) {
    assert.ok(!CAST.some(member => member.id === id), 'the helicopter doctor is mentioned-only');
  }
  for (const id of ['tsogt', 'sarnai', 'dorj', 'bold']) {
    const member = getCastMember(id);
    assert.ok(member.episodes.every(episode => episode >= 6), `${id} is an Act II arrival, not an Episodes 1–5 face`);
  }
  for (const id of ['minister', 'radio']) assert.equal(getCastMember(id).kind, 'voice');
  assert.equal(getCastMember('munkh').infection, false, 'stove smoke is not a bite');
  assert.equal(getCastMember('saruul').infection, true);
  for (const id of ['anu', 'batu', 'nomin', 'cordon-coughing-boy', 'hurel', 'tsolmon']) {
    assert.equal(getCastMember(id).infection, false, `${id} has no confirmed surviving bite in Episodes 1–5`);
  }
  for (const id of ['bolor', 'narantsetseg', 'dagva', 'hurel', 'yard-guard']) assert.equal(getCastMember(id).age, null, 'a decade is not an exact age');
});

test('every model profile has usable units, materials, proportions and provenance', async () => {
  const { CAST } = await import('../src/cast.js');
  assert.equal(new Set(CAST.map(member => member.id)).size, CAST.length);
  const kinds = new Set(['adultMale', 'adultFemale', 'teenMale', 'teenFemale', 'child', 'infant', 'voice']);
  for (const member of CAST) {
    assert.match(member.id, /^[a-z][a-z0-9-]*$/);
    assert.match(member.name, /[А-Яа-яӨөҮү]/);
    assert.ok(kinds.has(member.kind));
    assert.ok(member.age === null || Number.isFinite(member.age) && member.age >= 0);
    assert.ok(member.episodes.length > 0 && member.episodes.every(episode => Number.isInteger(episode) && episode >= 1 && episode <= 10));
    assert.equal(typeof member.infection, 'boolean');
    assert.ok(member.sourceNotes.length > 30);
    assert.ok(member.behavior.length > 20);
    assert.equal(member.build.length, 2);
    if (member.kind === 'voice') { assert.equal(member.height, 0); continue; }
    assert.ok(member.height >= 0.35 && member.height < 1.9);
    assert.ok(member.build.every(value => value > 0.5 && value < 1.6));
    for (const value of Object.values(member.face)) assert.ok(Number.isFinite(value) && value > 0.5 && value < 1.6);
    for (const color of [member.skin, member.hair, ...Object.values(member.colors)]) assert.match(color, /^#[0-9a-f]{6}$/i);
  }
  assert.ok(new Set(CAST.filter(member => member.kind !== 'voice').map(member => JSON.stringify([member.height, member.build, member.face]))).size > 40, 'identities differ in shape, not only palettes');
});
