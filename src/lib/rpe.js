// RPE chart math. Pure functions, no DOM. Tested by tests/rpe.test.mjs.
//
// Two versions of the Reactive Training Systems (RTS, Mike Tuchscherer) RPE chart ship with the page.
// They differ by up to 7.6 points at high reps (12 reps at RPE 6: 65.0 vs 57.4), so the user picks one.
//
//  current  The current RTS table (TRAC), RPE 5 to 10, reps 1 to 15. Copied from data-raw/rpe_tab_rts.csv in the
//           R package `strength` (github.com/alexpaynter/strength), which says "Pulled from the TRAC system on
//           Reactive Training Systems in Dec 2025". We checked it on 2026-10-20. The page uses RPE 6 to 10, reps 1 to 12.
//  y2016    The RTS article "Customizing Your RPE Chart" (6 Jan 2016), RPE 6.5 to 10, reps 1 to 12, as copied in the
//           open-source app github.com/tnapes96/RPECalc (RpePercentageTable.cs), checked on 2026-10-20.
//           That table has no RPE 6 row. We add RPE 6 with the reps-plus-RIR rule below.
//
// Both charts follow one rule: the percent depends only on (reps + reps in reserve). 5 reps at RPE 8 (2 in reserve)
// equals 7 reps at RPE 10. So one list indexed by that total makes the whole table. tests/fixtures hold the full
// source tables, and the tests compare every cell with them.
//
// The RPE scale itself (RPE as reps in reserve, RIR) comes from Zourdos et al. 2016, J Strength Cond Res 30(1):267-275,
// and Helms et al. 2016, Strength Cond J 38(4):42-49.

export const MIN_RPE = 6;
export const MAX_RPE = 10;
export const MAX_REPS = 12;
export const MAX_WEIGHT = 5000;

// Percent of 1RM for a total of (reps + RIR), in half steps: 1, 1.5, 2 ... 16.
const SERIES_CURRENT = [
  100, 97.8, 95.5, 93.8, 92.2, 90.7, 89.2, 87.8, 86.3, 85.0, 83.7, 82.4, 81.1, 79.8, 78.6,
  77.4, 76.2, 75.1, 73.9, 73.2, 72.4, 71.6, 70.7, 69.9, 69.1, 68.3, 67.6, 66.9, 66.3, 65.7, 65.0,
];
const SERIES_2016 = [
  100, 97.8, 95.5, 93.9, 92.2, 90.7, 89.2, 87.8, 86.3, 85.0, 83.7, 82.4, 81.1, 79.9, 78.6,
  77.4, 76.2, 75.1, 73.9, 72.3, 70.7, 69.4, 68.0, 66.7, 65.3, 64.0, 62.6, 61.3, 59.9, 58.6, 57.4,
];

export const DEFAULT_VERSION = 'current';
export const VERSIONS = {
  current: {
    id: 'current',
    label: 'Current RTS (default)',
    name: 'Current RTS table (TRAC)',
    series: SERIES_CURRENT,
  },
  y2016: {
    id: 'y2016',
    label: '2016 RTS article',
    name: '2016 RTS article chart',
    series: SERIES_2016,
  },
};
export const isVersion = (v) => Object.hasOwn(VERSIONS, v);

// RPE values in the chart, highest first: 10, 9.5 ... 6.
export const RPES = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6];
export const WHOLE_RPES = [10, 9, 8, 7, 6];
export const REPS = Array.from({ length: MAX_REPS }, (_, i) => i + 1);

export const rpeToRir = (rpe) => 10 - rpe;
export const rirToRpe = (rir) => 10 - rir;

// The built-in chart value for reps at an RPE, in the chosen chart version.
export function defaultPercent(reps, rpe, version = DEFAULT_VERSION) {
  const series = VERSIONS[version]?.series;
  if (!series) return NaN;
  const total = reps + (10 - rpe);
  const i = Math.round((total - 1) * 2);
  if (!Number.isInteger(reps) || reps < 1 || reps > MAX_REPS || rpe < MIN_RPE || rpe > MAX_RPE || !Number.isInteger(rpe * 2)) return NaN;
  return series[i];
}

// Sets above this many reps are rough estimates. The two chart versions differ most there.
export const HIGH_REPS = 10;

// The key for one chart cell, used by edits.
export const cellKey = (reps, rpe) => `${reps}@${rpe}`;

// The percent used in the calculator: an edit if there is a valid one, else the published value.
// edits: { "5@8": 82 }
export function percentAt(reps, rpe, edits = {}, version = DEFAULT_VERSION) {
  const e = edits[cellKey(reps, rpe)];
  return isValidPercent(e) ? e : defaultPercent(reps, rpe, version);
}

export const isValidPercent = (x) => typeof x === 'number' && Number.isFinite(x) && x >= 20 && x <= 100;

// Estimated 1RM from a set. Returns NaN for input the chart does not cover.
export function e1rm(weight, reps, rpe, edits = {}, version = DEFAULT_VERSION) {
  const p = percentAt(reps, rpe, edits, version);
  if (!(weight > 0) || !(p > 0)) return NaN;
  return (weight * 100) / p;
}

// The exact weight for reps at an RPE, from an e1RM.
export function loadFor(oneRm, reps, rpe, edits = {}, version = DEFAULT_VERSION) {
  const p = percentAt(reps, rpe, edits, version);
  if (!(oneRm > 0) || !(p > 0)) return NaN;
  return (oneRm * p) / 100;
}

// Round to the nearest multiple of step (step = 2 x the smallest plate). Ties go up.
export function roundTo(x, step) {
  if (!(step > 0) || !Number.isFinite(x)) return NaN;
  const n = Math.floor(x / step + 0.5 + 1e-9);
  return Math.round(n * step * 1000) / 1000;
}

// Smallest jumps a pair of plates can make, and a default for each unit.
export const STEPS = { lb: [1.25, 2.5, 5, 10], kg: [0.5, 1, 2.5, 5] };
export const DEFAULT_STEP = { lb: 5, kg: 2.5 };

export const LB_PER_KG = 2.20462262185;
export const convertWeight = (w, from, to) => (from === to ? w : from === 'lb' ? w / LB_PER_KG : w * LB_PER_KG);

// Parse what a person types. Accepts "225", "225.5", "225,5". Returns NaN for anything else.
export function parseNumber(s) {
  if (typeof s === 'number') return s;
  const t = String(s ?? '').trim().replace(',', '.');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(t)) return NaN;
  return Number(t);
}

// Trim trailing zeros: 225 -> "225", 82.5 -> "82.5", 81.10 -> "81.1".
export const fmt = (n) => (Number.isFinite(n) ? String(Math.round(n * 100) / 100) : '-');

// Short description of an RPE, after the Zourdos et al. 2016 scale.
export function rpeMeaning(rpe) {
  const m = {
    10: 'Maximum effort. No reps left, and no room to add weight.',
    9.5: 'No reps left, but you could add a little weight.',
    9: 'One rep left.',
    8.5: 'One or two reps left.',
    8: 'Two reps left.',
    7.5: 'Two or three reps left.',
    7: 'Three reps left.',
    6.5: 'Three or four reps left.',
    6: 'Four or more reps left.',
  };
  return m[rpe] ?? '';
}
