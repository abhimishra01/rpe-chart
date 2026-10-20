# RPE chart and calculator

Free browser tool for rpechart.com. Editable RPE/RIR to percent-of-1RM chart with two named versions of the Reactive Training Systems chart (current RTS table, default; 2016 RTS article), switchable, estimated 1RM from a set, target weights for other reps and RPE rounded to plates, lb and kg, rounding steps down to 1.25 lb and 0.5 kg. Settings and chart edits are saved in the browser. No backend.

- `src/lib/rpe.js`: all math (pure). `tests/rpe.test.mjs`: compares every chart cell with copies of the cited source tables in `tests/fixtures/` (R package `strength` for the current table, the RPECalc copy of the 2016 RTS article), plus the math. Run `npm test`.
- `src/components/Tool.astro` (calculator, shared script), `Chart.astro` (editable chart), `Article.astro`, `src/data/faq.ts`.
- `npm run build` makes `dist/`. GitHub Pages: `.github/workflows/pages.yml` (base `/rpe-chart/`, noindex on that copy, canonical on the real domain).
