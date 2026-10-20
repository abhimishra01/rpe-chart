import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { VERSIONS, DEFAULT_VERSION, isVersion, STEPS, HIGH_REPS, RPES, REPS, defaultPercent, percentAt, e1rm, loadFor, roundTo, parseNumber, fmt, convertWeight, rpeToRir, rirToRpe, cellKey } from '../src/lib/rpe.js';

// The expected values come from copies of the cited sources, not from our own list. See the header of each file.
//   rts-trac-2025-12.csv   current RTS table (TRAC), from the R package `strength`
//   rts-2016-article.csv   2016 RTS article "Customizing Your RPE Chart", from the open-source RPECalc app
function readTable(name) {
  const lines = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  const reps = lines[0].split(',').slice(1).map(Number);
  const table = new Map();
  for (const line of lines.slice(1)) {
    const [rpe, ...vals] = line.split(',').map(Number);
    reps.forEach((r, i) => table.set(`${r}@${rpe}`, vals[i]));
  }
  return table;
}
const TRAC = readTable('rts-trac-2025-12.csv');
const ARTICLE_2016 = readTable('rts-2016-article.csv');

test('current version matches every cell of the RTS TRAC table (reps 1 to 12, RPE 6 to 10)', () => {
  let n = 0;
  for (const reps of REPS) for (const rpe of RPES) {
    assert.equal(defaultPercent(reps, rpe, 'current'), TRAC.get(`${reps}@${rpe}`), `${reps} reps at RPE ${rpe}`);
    n++;
  }
  assert.equal(n, 108);
});

test('2016 version matches every cell of the 2016 RTS article table (reps 1 to 12, RPE 6.5 to 10)', () => {
  let n = 0;
  for (const reps of REPS) for (const rpe of RPES.filter((r) => r >= 6.5)) {
    assert.equal(defaultPercent(reps, rpe, 'y2016'), ARTICLE_2016.get(`${reps}@${rpe}`), `${reps} reps at RPE ${rpe}`);
    n++;
  }
  assert.equal(n, 96);
});

test('2016 version: RPE 6 is extended with the reps plus RIR rule (the article has no RPE 6 row)', () => {
  // RPE 6 has 4 RIR, RPE 7 has 3 RIR, so 6 reps at RPE 6 equals 7 reps at RPE 7 in the source.
  for (let r = 1; r <= 11; r++) assert.equal(defaultPercent(r, 6, 'y2016'), ARTICLE_2016.get(`${r + 1}@7`), `${r} reps at RPE 6`);
  // 12 reps at RPE 6 is 13 reps at RPE 7, which the article does not list. Same as 16 total, the end of the series.
  assert.equal(defaultPercent(12, 6, 'y2016'), 57.4);
});

test('the two versions differ by at most 7.6 points, and agree within 0.1 when reps plus RIR is 10 or less', () => {
  let max = 0;
  for (const reps of REPS) for (const rpe of RPES) {
    const gap = Math.abs(defaultPercent(reps, rpe, 'current') - defaultPercent(reps, rpe, 'y2016'));
    max = Math.max(max, gap);
    if (reps + (10 - rpe) <= 10) assert.ok(gap <= 0.1 + 1e-9, `${reps}@${rpe}`);
  }
  assert.equal(Math.round(max * 10) / 10, 7.6);
  assert.equal(Math.round((defaultPercent(12, 6, 'current') - defaultPercent(12, 6, 'y2016')) * 10) / 10, 7.6);
});

test('the default version is the current RTS table, and an unknown version gives NaN', () => {
  assert.equal(DEFAULT_VERSION, 'current');
  assert.equal(defaultPercent(12, 8), 67.6);
  assert.equal(defaultPercent(12, 8, 'y2016'), 62.6);
  assert.ok(isVersion('current') && isVersion('y2016') && !isVersion('2016') && !isVersion('toString'));
  assert.ok(Number.isNaN(defaultPercent(5, 8, 'nope')));
  assert.equal(VERSIONS.current.label, 'Current RTS (default)');
  assert.equal(VERSIONS.y2016.label, '2016 RTS article');
});

const ALL = Object.keys(VERSIONS);

test('each version has 12 reps x 9 RPE values, all falling as reps rise and RPE falls', () => {
  for (const v of ALL) {
    assert.equal(VERSIONS[v].series.length, 31);
    for (const rpe of RPES) {
      for (const r of REPS) {
        assert.ok(defaultPercent(r, rpe, v) > 0, `${v} ${r}@${rpe}`);
        if (r > 1) assert.ok(defaultPercent(r, rpe, v) < defaultPercent(r - 1, rpe, v));
      }
    }
    for (const r of REPS) for (let i = 1; i < RPES.length; i++) assert.ok(defaultPercent(r, RPES[i], v) < defaultPercent(r, RPES[i - 1], v));
  }
});

test('reps + reps in reserve rule: one rep more at one RPE point lower is the same percent', () => {
  for (const v of ALL) {
    assert.equal(defaultPercent(5, 8, v), defaultPercent(7, 10, v));
    assert.equal(defaultPercent(3, 9, v), defaultPercent(4, 10, v));
    for (const r of REPS) for (const rpe of RPES) {
      if (r + 1 <= 12 && rpe - 1 >= 6) assert.equal(defaultPercent(r + 1, rpe, v), defaultPercent(r, rpe - 1, v), `${v} ${r}@${rpe}`);
    }
  }
});

test('half-step cells sit between the whole-step neighbours (within 0.1)', () => {
  for (const v of ALL) for (const r of REPS) for (const rpe of [9.5, 8.5, 7.5, 6.5]) {
    const mid = (defaultPercent(r, rpe + 0.5, v) + defaultPercent(r, rpe - 0.5, v)) / 2;
    assert.ok(Math.abs(defaultPercent(r, rpe, v) - mid) <= 0.1, `${v} ${r}@${rpe}`);
  }
});

test('out of range input gives NaN', () => {
  assert.ok(Number.isNaN(defaultPercent(0, 8)));
  assert.ok(Number.isNaN(defaultPercent(13, 8)));
  assert.ok(Number.isNaN(defaultPercent(5, 5.5)));
  assert.ok(Number.isNaN(defaultPercent(5, 10.5)));
  assert.ok(Number.isNaN(defaultPercent(5, 8.25)));
  assert.ok(Number.isNaN(defaultPercent(2.5, 8)));
});

test('e1RM: 225 x 5 @ RPE 8 is 225 / 0.811', () => {
  assert.ok(Math.abs(e1rm(225, 5, 8) - 277.4) < 0.1);
  assert.equal(e1rm(315, 1, 10), 315);
  assert.ok(Math.abs(e1rm(100, 3, 9) - 100 / 0.892) < 1e-9);
  assert.ok(Number.isNaN(e1rm(0, 5, 8)));
  assert.ok(Number.isNaN(e1rm(225, 13, 8)));
});

test('target weight from an e1RM', () => {
  assert.ok(Math.abs(loadFor(300, 3, 8) - 258.9) < 0.01);
  assert.equal(loadFor(300, 1, 10), 300);
  // Round trip: lifting the target load gives the same e1RM back.
  const o = e1rm(225, 5, 8);
  assert.ok(Math.abs(e1rm(loadFor(o, 3, 9), 3, 9) - o) < 1e-9);
});

test('edits change the percent, bad edits are ignored', () => {
  const edits = { [cellKey(5, 8)]: 80 };
  assert.equal(percentAt(5, 8, edits), 80);
  assert.equal(percentAt(5, 9, edits), 83.7);
  assert.equal(percentAt(5, 8, { [cellKey(5, 8)]: 'x' }), 81.1);
  assert.equal(percentAt(5, 8, { [cellKey(5, 8)]: 120 }), 81.1);
  assert.equal(percentAt(5, 8, { [cellKey(5, 8)]: 5 }), 81.1);
  assert.ok(Math.abs(e1rm(200, 5, 8, edits) - 250) < 1e-9);
});

test('edits are kept per cell and work in either version', () => {
  const edits = { [cellKey(12, 8)]: 66 };
  assert.equal(percentAt(12, 8, edits, 'current'), 66);
  assert.equal(percentAt(12, 8, edits, 'y2016'), 66);
  assert.equal(percentAt(12, 9, edits, 'y2016'), 65.3);
  assert.ok(Math.abs(e1rm(100, 12, 8, {}, 'y2016') - 100 / 0.626) < 1e-9);
  assert.ok(Math.abs(e1rm(100, 12, 8, {}, 'current') - 100 / 0.676) < 1e-9);
  assert.ok(Math.abs(loadFor(200, 12, 8, {}, 'y2016') - 125.2) < 1e-9);
});

test('high-rep limit', () => {
  assert.equal(HIGH_REPS, 10);
});

test('rounding steps include 0.5 kg and 1.25 lb', () => {
  assert.deepEqual(STEPS.kg, [0.5, 1, 2.5, 5]);
  assert.deepEqual(STEPS.lb, [1.25, 2.5, 5, 10]);
  assert.equal(roundTo(100.3, 0.5), 100.5);
  assert.equal(roundTo(100.2, 0.5), 100);
  assert.equal(roundTo(100.75, 0.5), 101);
  assert.equal(roundTo(201.3, 1.25), 201.25);
  assert.equal(roundTo(202, 1.25), 202.5);
  assert.equal(roundTo(0.7, 1.25), 1.25);
});

test('rounding to plates', () => {
  assert.equal(roundTo(258.9, 5), 260);
  assert.equal(roundTo(257.4, 5), 255);
  assert.equal(roundTo(257.5, 5), 260);
  assert.equal(roundTo(102.4, 2.5), 102.5);
  assert.equal(roundTo(101.2, 2.5), 100);
  assert.equal(roundTo(101.25, 2.5), 102.5);
  assert.equal(roundTo(61.3, 1), 61);
  assert.equal(roundTo(0.4, 2.5), 0);
  assert.ok(Number.isNaN(roundTo(10, 0)));
  assert.ok(Number.isNaN(roundTo(NaN, 5)));
});

test('RIR and RPE convert both ways', () => {
  assert.equal(rpeToRir(8), 2);
  assert.equal(rpeToRir(9.5), 0.5);
  assert.equal(rirToRpe(0), 10);
  assert.equal(rirToRpe(3.5), 6.5);
});

test('parseNumber', () => {
  assert.equal(parseNumber('225'), 225);
  assert.equal(parseNumber(' 82.5 '), 82.5);
  assert.equal(parseNumber('82,5'), 82.5);
  assert.equal(parseNumber('.5'), 0.5);
  assert.ok(Number.isNaN(parseNumber('')));
  assert.ok(Number.isNaN(parseNumber('abc')));
  assert.ok(Number.isNaN(parseNumber('1e3')));
  assert.ok(Number.isNaN(parseNumber('-5')));
});

test('fmt and unit conversion', () => {
  assert.equal(fmt(225), '225');
  assert.equal(fmt(82.5), '82.5');
  assert.equal(fmt(81.10), '81.1');
  assert.equal(fmt(NaN), '-');
  assert.ok(Math.abs(convertWeight(100, 'kg', 'lb') - 220.462) < 0.001);
  assert.ok(Math.abs(convertWeight(225, 'lb', 'kg') - 102.058) < 0.001);
  assert.equal(convertWeight(5, 'lb', 'lb'), 5);
});
