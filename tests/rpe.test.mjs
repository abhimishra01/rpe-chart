import test from 'node:test';
import assert from 'node:assert/strict';
import { SERIES, RPES, REPS, defaultPercent, percentAt, e1rm, loadFor, roundTo, parseNumber, fmt, convertWeight, rpeToRir, rirToRpe, cellKey } from '../src/lib/rpe.js';

// Known cells of the RTS chart.
const KNOWN = [
  [1, 10, 100], [2, 10, 95.5], [3, 10, 92.2], [5, 10, 86.3], [10, 10, 73.9], [12, 10, 68.0],
  [1, 9.5, 97.8], [5, 9.5, 85.0], [12, 9.5, 66.7],
  [1, 9, 95.5], [5, 9, 83.7], [12, 9, 65.3],
  [3, 8.5, 87.8], [12, 8.5, 64.0],
  [1, 8, 92.2], [5, 8, 81.1], [8, 8, 73.9], [12, 8, 62.6],
  [5, 7.5, 79.9], [12, 7.5, 61.3],
  [1, 7, 89.2], [5, 7, 78.6], [12, 7, 59.9],
  [3, 6.5, 82.4], [12, 6.5, 58.6],
  [1, 6, 86.3], [5, 6, 76.2], [12, 6, 57.4],
];

test('chart matches the published RTS values', () => {
  for (const [reps, rpe, pct] of KNOWN) assert.equal(defaultPercent(reps, rpe), pct, `${reps} reps at RPE ${rpe}`);
});

test('chart has 12 reps x 9 RPE values, all falling as reps rise and RPE falls', () => {
  assert.equal(SERIES.length, 31);
  for (const rpe of RPES) {
    for (const r of REPS) {
      assert.ok(defaultPercent(r, rpe) > 0, `${r}@${rpe}`);
      if (r > 1) assert.ok(defaultPercent(r, rpe) < defaultPercent(r - 1, rpe));
    }
  }
  for (const r of REPS) for (let i = 1; i < RPES.length; i++) assert.ok(defaultPercent(r, RPES[i]) < defaultPercent(r, RPES[i - 1]));
});

test('reps + reps in reserve rule: one rep more at one RPE point lower is the same percent', () => {
  // 5 @ 8 equals 7 @ 10 (2 reps in reserve = 2 more reps)
  assert.equal(defaultPercent(5, 8), defaultPercent(7, 10));
  assert.equal(defaultPercent(3, 9), defaultPercent(4, 10));
  for (const r of REPS) for (const rpe of RPES) {
    if (r + 1 <= 12 && rpe - 1 >= 6) assert.equal(defaultPercent(r + 1, rpe), defaultPercent(r, rpe - 1), `${r}@${rpe}`);
  }
  assert.equal(defaultPercent(4, 9), defaultPercent(5, 10));
});

test('half-step cells sit between the whole-step neighbours (within 0.1)', () => {
  for (const r of REPS) for (const rpe of [9.5, 8.5, 7.5, 6.5]) {
    const mid = (defaultPercent(r, rpe + 0.5) + defaultPercent(r, rpe - 0.5)) / 2;
    assert.ok(Math.abs(defaultPercent(r, rpe) - mid) <= 0.1, `${r}@${rpe}`);
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
